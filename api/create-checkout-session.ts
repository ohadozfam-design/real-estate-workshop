import Stripe from "stripe";
import { buildLineItems } from "../server/lineItems";

/**
 * Production serverless handler (Vercel / Netlify Node runtime).
 * Reads the Stripe secret key from the server environment only — it is never
 * shipped to the browser. The same logic runs in dev via the Vite middleware
 * plugin in vite.config.ts.
 *
 * Request body:  { hasOrderBump: boolean }
 * Response:      { url: string }  ->  the client redirects to Stripe Checkout
 */
export default async function handler(
  req: { method?: string; body?: unknown; headers: Record<string, string | undefined> },
  res: {
    status: (code: number) => { json: (body: unknown) => void };
  }
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    res.status(500).json({ error: "Stripe is not configured (STRIPE_SECRET_KEY missing)." });
    return;
  }

  try {
    const stripe = new Stripe(secretKey);
    const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as {
      hasOrderBump?: boolean;
    };
    const origin = req.headers.origin ?? `https://${req.headers.host ?? ""}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: buildLineItems(Boolean(body?.hasOrderBump)),
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Checkout failed" });
  }
}
