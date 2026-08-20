import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Seat availability endpoint (GET /api/seats).
 * Returns { soldOut, remaining, total } for the sold-out / waitlist UI.
 *
 * Fail-open: if Stripe is unreachable or unconfigured, reports seats available
 * so a transient error never blocks the page. The HARD cap is enforced
 * server-side in create-checkout-session.ts, which is the source of truth.
 */
const MAX_SEATS = Number(process.env.MAX_SEATS || 25);
const WORKSHOP_ID = process.env.WORKSHOP_ID || "Workshop_Sep2";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") return res.status(200).end();

  const available = { soldOut: false, remaining: MAX_SEATS, total: MAX_SEATS };

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return res.status(200).json(available);

  try {
    const stripe = new Stripe(secretKey);
    const paid = await countPaidSeats(stripe);
    const remaining = Math.max(0, MAX_SEATS - paid);
    return res.status(200).json({ soldOut: remaining <= 0, remaining, total: MAX_SEATS });
  } catch (err) {
    console.error("[seats] error, failing open:", err instanceof Error ? err.message : err);
    return res.status(200).json(available);
  }
}
