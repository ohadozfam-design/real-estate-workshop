import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Stripe webhook (Vercel Node serverless function) — fully self-contained.
 *
 * Listens for `checkout.session.completed`, verifies the signature, extracts the
 * lead's contact details, and hands them to a single fulfillment function where
 * an email (Resend) and/or a DB insert (Supabase) can be plugged in.
 *
 * SETUP (once):
 *   1. Stripe Dashboard → Developers → Webhooks → Add endpoint:
 *        URL:    https://<your-domain>/api/stripe-webhook
 *        Event:  checkout.session.completed
 *   2. Copy the endpoint's "Signing secret" (whsec_…) into Vercel env as
 *        STRIPE_WEBHOOK_SECRET   (STRIPE_SECRET_KEY must also be set).
 *
 * Signature verification requires the RAW request body, so Vercel's automatic
 * body parsing is disabled below and the raw stream is read manually.
 */
export const config = { api: { bodyParser: false } };

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : (chunk as Buffer));
  }
  return Buffer.concat(chunks);
}

type PaidRegistration = {
  sessionId: string;
  name: string;
  phone: string;
  email: string;
  hasOrderBump: boolean;
  amountTotal: number | null; // smallest currency unit (e.g. cents)
  currency: string | null;
};

/**
 * Single place to fulfill a paid registration.
 * TODO: plug in your email provider and/or database here.
 */
async function handlePaidRegistration(reg: PaidRegistration): Promise<void> {
  console.log("[stripe-webhook] paid registration:", reg);

  // ── 1) Email the Zoom link + materials (Resend) ─────────────────────────────
  // if (process.env.RESEND_API_KEY && reg.email) {
  //   const { Resend } = await import("resend");
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({
  //     from: "סדנת נדל״ן <no-reply@your-domain.com>",
  //     to: reg.email,
  //     subject: "אישור הרשמה + קישור לזום",
  //     html: `<p>שלום ${reg.name}, נרשמת בהצלחה! הקישור לזום: ...</p>`,
  //   });
  // }

  // ── 2) Store the lead in a DB you own (Supabase) ────────────────────────────
  // if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  //   const { createClient } = await import("@supabase/supabase-js");
  //   const supabase = createClient(
  //     process.env.SUPABASE_URL,
  //     process.env.SUPABASE_SERVICE_ROLE_KEY
  //   );
  //   await supabase.from("registrations").insert({
  //     session_id: reg.sessionId,
  //     name: reg.name,
  //     phone: reg.phone,
  //     email: reg.email,
  //     order_bump: reg.hasOrderBump,
  //     amount_total: reg.amountTotal,
  //     currency: reg.currency,
  //   });
  // }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    console.error(
      "[stripe-webhook] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET in the environment."
    );
    return res.status(500).json({ error: "Webhook is not configured on the server." });
  }

  const stripe = new Stripe(secretKey);
  const signature = req.headers["stripe-signature"];

  // 1) Verify the event came from Stripe (raw body + signature).
  let event: Stripe.Event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature as string, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("[stripe-webhook] signature verification failed:", message);
    return res.status(400).json({ error: `Webhook signature verification failed: ${message}` });
  }

  // 2) Handle the events we care about.
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const md = session.metadata ?? {};

      const reg: PaidRegistration = {
        sessionId: session.id,
        name: md.name ?? "",
        phone: md.phone ?? "",
        email: (session.customer_details?.email || session.customer_email || md.email || "").trim(),
        hasOrderBump: md.hasOrderBump === "true",
        amountTotal: session.amount_total ?? null,
        currency: session.currency ?? null,
      };

      await handlePaidRegistration(reg);
    } else {
      console.log("[stripe-webhook] unhandled event type:", event.type);
    }

    // Always 200 once received so Stripe stops retrying.
    return res.status(200).json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Handler error";
    console.error("[stripe-webhook] handler error:", message);
    return res.status(500).json({ error: message });
  }
}
