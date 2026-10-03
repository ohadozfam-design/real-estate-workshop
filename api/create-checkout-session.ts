import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Production serverless handler (Vercel Node runtime) - fully self-contained.
 *
 * IMPORTANT: this file intentionally has NO relative imports outside the /api
 * boundary (e.g. it does not import ../server/lineItems). Vercel bundles each
 * function independently, and reaching outside /api can leave the dependency
 * unbundled at runtime -> FUNCTION_INVOCATION_FAILED. Keeping everything inline
 * guarantees the lambda is standalone.
 *
 * Request body:  { hasOrderBump?: boolean; name?: string; phone?: string; email?: string }
 * Response:      { url: string }   -> client redirects to Stripe Checkout
 *                { error: string } -> on any failure (always structured JSON)
 *
 * The lead's contact details are attached to the session (customer_email +
 * metadata { name, phone }) so every lead and buyer is captured with full contact info.
 */

// "General - Electronically Supplied Services" - the correct, Managed-Payments-
// eligible tax code for a live online workshop. Overridable via env.
const TAX_CODE = process.env.STRIPE_TAX_CODE || "txcd_10000000";

// Hard capacity cap. Sessions are tagged with WORKSHOP_ID so we count only this
// cohort's paid seats (not unrelated Stripe sessions).
const MAX_SEATS = Number(process.env.MAX_SEATS || 25);
const WORKSHOP_ID = process.env.WORKSHOP_ID || "Workshop_Oct6";

/** Count PAID checkout sessions belonging to this workshop. */
async function countPaidSeats(stripe: Stripe): Promise<number> {
  let count = 0;
  const params: Stripe.Checkout.SessionListParams = { limit: 100 };
  for (let page = 0; page < 5; page++) {
    const res = await stripe.checkout.sessions.list(params);
    for (const s of res.data) {
      if (s.payment_status === "paid" && s.metadata?.workshop === WORKSHOP_ID) count++;
    }
    if (!res.has_more || res.data.length === 0) break;
    params.starting_after = res.data[res.data.length - 1].id;
  }
  return count;
}

function buildLineItems(hasOrderBump: boolean): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: "usd",
        product_data: { name: "סדנת מנוע העסקאות ל2 נכסים בחודש", tax_code: TAX_CODE },
        unit_amount: 9700, // $97.00
      },
      quantity: 1,
    },
  ];

  if (hasOrderBump) {
    items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "חבילת חוזים מול קבלנים ומוכרים פרטיים", tax_code: TAX_CODE },
        unit_amount: 2700, // $27.00
      },
      quantity: 1,
    });
  }

  return items;
}

/** Read one cookie from the raw Cookie header. */
function readCookie(req: VercelRequest, name: string): string {
  const header = req.headers.cookie || "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return "";
}

/**
 * Meta Conversions API match signals, captured here because the later
 * stripe-webhook request comes from Stripe and has no browser context.
 * Stored in session metadata (Stripe caps values at 500 chars).
 */
function metaSignals(req: VercelRequest): Record<string, string> {
  const fwd = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(fwd) ? fwd[0] : fwd || "").split(",")[0].trim();
  return {
    fbp: readCookie(req, "_fbp").slice(0, 500),
    fbc: readCookie(req, "_fbc").slice(0, 500),
    client_ip: ip.slice(0, 500),
    client_ua: String(req.headers["user-agent"] || "").slice(0, 500),
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS - set before anything else so even errors/preflight carry the headers.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Everything is wrapped so the lambda NEVER crashes into a 500 HTML screen -
  // it always responds with structured JSON.
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST, OPTIONS");
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error(
        "[create-checkout-session] STRIPE_SECRET_KEY is undefined. " +
          "Set it in Vercel → Project → Settings → Environment Variables, then redeploy."
      );
      return res.status(500).json({
        error: "Stripe is not configured on the server (STRIPE_SECRET_KEY missing).",
      });
    }

    const stripe = new Stripe(secretKey);

    // Enforce the hard seat cap before creating a new payable session.
    const paidSeats = await countPaidSeats(stripe);
    if (paidSeats >= MAX_SEATS) {
      return res.status(403).json({ error: "הסדנה בתפוסה מלאה", soldOut: true });
    }

    // Vercel auto-parses JSON bodies, but guard against a string/undefined body too.
    const body: { hasOrderBump?: boolean; name?: string; phone?: string; email?: string } =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});
    const hasOrderBump = Boolean(body.hasOrderBump);
    const name = (body.name ?? "").trim();
    const phone = (body.phone ?? "").trim();
    const email = (body.email ?? "").trim();

    const origin =
      (req.headers.origin as string | undefined) ??
      (req.headers.host ? `https://${req.headers.host}` : "");

    const lineItems = buildLineItems(hasOrderBump);
    const value =
      lineItems.reduce((sum, i) => sum + (i.price_data?.unit_amount ?? 0) * (i.quantity ?? 1), 0) / 100;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      // Capture the lead's contact details on the session.
      ...(email ? { customer_email: email } : {}),
      metadata: {
        name,
        phone,
        email,
        hasOrderBump: String(hasOrderBump),
        workshop: WORKSHOP_ID,
        ...metaSignals(req),
      },
      // {CHECKOUT_SESSION_ID} is filled in by Stripe; the thank-you page uses it
      // as the Pixel Purchase eventID (deduped against the webhook's CAPI event).
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}&value=${value}&currency=USD`,
      cancel_url: `${origin}/?checkout=cancel`,
    });

    if (!session.url) {
      throw new Error("Stripe did not return a Checkout URL.");
    }

    return res.status(200).json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error creating the Checkout session.";
    console.error("[create-checkout-session] error:", message);
    return res.status(500).json({ error: message });
  }
}
