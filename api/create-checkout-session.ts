import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildLineItems } from "../server/lineItems";

/**
 * Production serverless handler (Vercel Node runtime).
 *
 * Standards-compliant Vercel function: `export default (req, res) => …`.
 * The Stripe secret key is read from the server environment only and is never
 * shipped to the browser. The same logic runs in dev via the Vite middleware
 * plugin in vite.config.ts.
 *
 * Request body:  { hasOrderBump: boolean }
 * Response:      { url: string }   ->  the client redirects to Stripe Checkout
 *                { error: string } ->  on any failure (surfaced to the console)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    // Most common production failure: the env var was never set in Vercel.
    console.error(
      "[create-checkout-session] STRIPE_SECRET_KEY is undefined. " +
        "Set it in Vercel → Project → Settings → Environment Variables (and redeploy)."
    );
    res.status(500).json({
      error: "Stripe is not configured on the server (STRIPE_SECRET_KEY missing).",
    });
    return;
  }

  try {
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

    res.status(200).json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error creating the Checkout session.";
    console.error("[create-checkout-session] Stripe error:", message);
    res.status(500).json({ error: message });
  }
}
