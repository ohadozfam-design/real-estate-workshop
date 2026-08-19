import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Production serverless handler (Vercel Node runtime) — fully self-contained.
 *
 * IMPORTANT: this file intentionally has NO relative imports outside the /api
 * boundary (e.g. it does not import ../server/lineItems). Vercel bundles each
 * function independently, and reaching outside /api can leave the dependency
 * unbundled at runtime -> FUNCTION_INVOCATION_FAILED. Keeping everything inline
 * guarantees the lambda is standalone.
 *
 * Request body:  { hasOrderBump?: boolean }
 * Response:      { url: string }   -> client redirects to Stripe Checkout
 *                { error: string } -> on any failure (always structured JSON)
 */

// "General - Electronically Supplied Services" — the correct, Managed-Payments-
// eligible tax code for a live online workshop. Overridable via env.
const TAX_CODE = process.env.STRIPE_TAX_CODE || "txcd_10000000";

function buildLineItems(hasOrderBump: boolean): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: "usd",
        product_data: { name: "סדנת לייב: איתור וניתוח נכסים בארה״ב", tax_code: TAX_CODE },
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — set before anything else so even errors/preflight carry the headers.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Everything is wrapped so the lambda NEVER crashes into a 500 HTML screen —
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

    // Vercel auto-parses JSON bodies, but guard against a string/undefined body too.
    const body: { hasOrderBump?: boolean } =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});
    const hasOrderBump = Boolean(body.hasOrderBump);

    const origin =
      (req.headers.origin as string | undefined) ??
      (req.headers.host ? `https://${req.headers.host}` : "");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: buildLineItems(hasOrderBump),
      success_url: `${origin}/?checkout=success`,
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
