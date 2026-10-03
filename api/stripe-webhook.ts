import Stripe from "stripe";
import { Resend } from "resend";
import { createHash } from "crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// ── Fulfillment configuration (server-side env only) ──────────────────────────
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL || "The K2 Academy <onboarding@resend.dev>";
// Clean placeholder until the real meeting link is provided in the env.
const ZOOM_LINK = process.env.ZOOM_LINK || "https://zoom.us/";
// Google Sheet / CRM webhook + admin sales alert (both optional).
const GOOGLE_SHEET_WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL;
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;
// Meta Conversions API (server-side Purchase). Skipped cleanly if unset.
// The pixel id is shared with the client build (VITE_META_PIXEL_ID).
const META_PIXEL_ID = process.env.META_PIXEL_ID || process.env.VITE_META_PIXEL_ID;
const META_CAPI_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
// Optional: routes events to Events Manager → Test events while verifying.
const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;
const META_GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v23.0";

/**
 * Stripe webhook (Vercel Node serverless function) - fully self-contained.
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
 *   3. For the confirmation email, set RESEND_API_KEY (and optionally ZOOM_LINK,
 *        SENDER_EMAIL). If RESEND_API_KEY is missing, the email is skipped with a
 *        clean log line and the webhook still returns 200.
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
  paid: boolean;
  // Meta CAPI match signals captured at checkout creation (see metaSignals).
  fbp: string;
  fbc: string;
  clientIp: string;
  clientUa: string;
  sourceUrl: string;
};

/** Minimal HTML-escape for values interpolated into the email. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Branded, RTL confirmation email (inline styles + tables for email clients). */
export function renderConfirmationEmail(name: string, hasOrderBump: boolean): string {
  const greetingName = name ? esc(name) : "וברוך הבא";
  const bump = hasOrderBump
    ? `
    <tr><td style="padding:0 32px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(253,137,115,0.4);border-radius:14px;background:rgba(253,137,115,0.10);">
        <tr><td style="padding:20px 22px;">
          <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#FD8973;">בונוס נוסף שנפתח עבורך</div>
          <div style="margin-top:8px;font-size:18px;font-weight:800;color:#F0EEEB;">Off-Market &amp; Contractor Pack</div>
          <div style="margin-top:6px;font-size:15px;line-height:1.6;color:#CCD5DA;">חבילת החוזים לעבודה מול קבלנים ומוכרים פרטיים מחכה לך יחד עם שאר החומרים בלייב.</div>
        </td></tr>
      </table>
    </td></tr>`
    : "";

  return `<!doctype html>
<html lang="he" dir="rtl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>אישור הרשמה</title></head>
<body style="margin:0;padding:0;background:#0e1316;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0e1316;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#13181B;border:1px solid rgba(204,213,218,0.15);border-radius:20px;overflow:hidden;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;direction:rtl;text-align:right;">

        <!-- Header -->
        <tr><td style="padding:28px 32px;border-bottom:1px solid rgba(204,213,218,0.12);text-align:center;">
          <span style="font-size:22px;font-weight:800;letter-spacing:1px;color:#FFBF65;">The K2 Academy</span>
        </td></tr>

        <!-- Greeting -->
        <tr><td style="padding:32px 32px 8px;">
          <h1 style="margin:0;font-size:26px;line-height:1.25;font-weight:800;color:#F0EEEB;">שלום ${greetingName}, שמחים לראות אותך איתנו!</h1>
          <p style="margin:14px 0 0;font-size:17px;line-height:1.7;color:#CCD5DA;">מקומך בסדנה שמור ומובטח. ריכזנו כאן את כל פרטי ההתחברות.</p>
        </td></tr>

        <!-- Schedule card -->
        <tr><td style="padding:16px 32px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(204,213,218,0.15);border-radius:14px;background:rgba(0,58,108,0.18);">
            <tr><td style="padding:22px 22px 6px;">
              <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#FFBF65;">מועדי הסדנה</div>
            </td></tr>
            <tr><td style="padding:8px 22px;border-bottom:1px solid rgba(204,213,218,0.12);">
              <div style="font-size:14px;color:#CCD5DA;">מפגש 1</div>
              <div style="margin-top:2px;font-size:18px;font-weight:700;color:#F0EEEB;">יום שלישי, 6 באוקטובר &nbsp;|&nbsp; 18:00 עד 20:00 (שעון ישראל)</div>
            </td></tr>
            <tr><td style="padding:12px 22px 22px;">
              <div style="font-size:14px;color:#CCD5DA;">מפגש 2</div>
              <div style="margin-top:2px;font-size:18px;font-weight:700;color:#F0EEEB;">יום רביעי, 7 באוקטובר &nbsp;|&nbsp; 18:00 עד 20:00 (שעון ישראל)</div>
            </td></tr>
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:24px 32px 8px;text-align:center;">
          <a href="${esc(ZOOM_LINK)}" target="_blank" style="display:inline-block;background:#FFBF65;color:#13181B;font-size:18px;font-weight:800;text-decoration:none;padding:16px 40px;border-radius:999px;">הצטרף לסדנה בזום</a>
        </td></tr>

        <!-- Preparation note -->
        <tr><td style="padding:12px 32px 8px;">
          <p style="margin:0;font-size:15px;line-height:1.7;color:#CCD5DA;">מומלץ להתחבר ממחשב נייד או נייח עם חיבור יציב לאינטרנט. כל התבניות והחומרים המעשיים יחכו לך בלייב.</p>
        </td></tr>
        ${bump}

        <!-- Sign-off -->
        <tr><td style="padding:20px 32px 32px;border-top:1px solid rgba(204,213,218,0.12);">
          <p style="margin:0;font-size:16px;color:#F0EEEB;">נתראה בלייב,</p>
          <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#FFBF65;">צוות The K2 Academy</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Plain-text fallback for deliverability and text-only clients. */
export function renderConfirmationText(name: string, hasOrderBump: boolean): string {
  const lines = [
    `שלום ${name || "וברוך הבא"}, שמחים לראות אותך איתנו!`,
    `מקומך בסדנה שמור ומובטח.`,
    ``,
    `מועדי הסדנה:`,
    `מפגש 1: יום שלישי, 6 באוקטובר | 18:00 עד 20:00 (שעון ישראל)`,
    `מפגש 2: יום רביעי, 7 באוקטובר | 18:00 עד 20:00 (שעון ישראל)`,
    ``,
    `קישור לזום: ${ZOOM_LINK}`,
    ``,
    `מומלץ להתחבר ממחשב עם חיבור יציב לאינטרנט. כל התבניות והחומרים יחכו לך בלייב.`,
  ];
  if (hasOrderBump) {
    lines.push(``, `בונוס: חבילת Off-Market & Contractor Pack פתוחה עבורך ותחכה לך בלייב.`);
  }
  lines.push(``, `צוות The K2 Academy`);
  return lines.join("\n");
}

/** Non-blocking dispatch of the buyer to a Google Sheet / CRM webhook. */
async function dispatchToSheet(reg: PaidRegistration): Promise<void> {
  if (!GOOGLE_SHEET_WEBHOOK_URL) {
    console.warn("[stripe-webhook] GOOGLE_SHEET_WEBHOOK_URL not set - skipping sheet dispatch.");
    return;
  }
  try {
    await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        name: reg.name,
        phone: reg.phone,
        email: reg.email,
        amount: reg.amountTotal,
        currency: reg.currency,
        hasOrderBump: reg.hasOrderBump,
        tag: "Workshop_Oct6_Buyer",
      }),
    });
    console.log("[stripe-webhook] buyer dispatched to sheet:", reg.email);
  } catch (err) {
    console.error("[stripe-webhook] sheet dispatch failed:", err instanceof Error ? err.message : err);
  }
}

/** Branded confirmation email to the buyer (Zoom link + materials). */
async function sendBuyerEmail(reg: PaidRegistration): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn("[stripe-webhook] RESEND_API_KEY not set - skipping confirmation email.", {
      to: reg.email || "(no email)",
    });
    return;
  }
  if (!reg.email) {
    console.warn("[stripe-webhook] No email on the session - cannot send confirmation.");
    return;
  }
  try {
    const resend = new Resend(RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: reg.email,
      subject: "ההרשמה שלך לסדנה הנדל״ן אושרה | פרטי ההתחברות והקישור לזום",
      html: renderConfirmationEmail(reg.name, reg.hasOrderBump),
      text: renderConfirmationText(reg.name, reg.hasOrderBump),
    });
    if (error) console.error("[stripe-webhook] Resend send error:", error);
    else console.log("[stripe-webhook] confirmation email sent:", data?.id, "→", reg.email);
  } catch (err) {
    console.error("[stripe-webhook] confirmation email failed:", err instanceof Error ? err.message : err);
  }
}

/** Instant sales-alert email to the admin. */
async function notifyAdmin(reg: PaidRegistration): Promise<void> {
  if (!RESEND_API_KEY || !ADMIN_NOTIFICATION_EMAIL) return;
  const amount =
    reg.amountTotal != null
      ? `${(reg.amountTotal / 100).toFixed(2)} ${(reg.currency || "").toUpperCase()}`
      : "-";
  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `🎉 מכירה חדשה בסדנה - ${reg.name || reg.email}`,
      text: [
        "רישום חדש לסדנה:",
        `שם: ${reg.name || "-"}`,
        `טלפון: ${reg.phone || "-"}`,
        `אימייל: ${reg.email || "-"}`,
        `סכום: ${amount}`,
        `Order Bump: ${reg.hasOrderBump ? "כן" : "לא"}`,
        `Session: ${reg.sessionId}`,
      ].join("\n"),
    });
    if (error) console.error("[stripe-webhook] admin alert error:", error);
    else console.log("[stripe-webhook] admin alert sent to", ADMIN_NOTIFICATION_EMAIL);
  } catch (err) {
    console.error("[stripe-webhook] admin alert failed:", err instanceof Error ? err.message : err);
  }
}

/** SHA-256 hex, as Meta requires for customer information parameters. */
function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Digits with country code. Bare local numbers are assumed Israeli (05x) or US (10 digits). */
function normalizePhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = `972${d.slice(1)}`;
  else if (d.length === 9 && d.startsWith("5")) d = `972${d}`;
  else if (d.length === 10) d = `1${d}`;
  return d;
}

/**
 * Server-side Purchase via the Meta Conversions API. event_id is the Checkout
 * Session id - the same eventID the thank-you page pixel uses - so Meta counts
 * the purchase once even when both the browser and server events arrive.
 */
async function sendMetaPurchase(reg: PaidRegistration): Promise<void> {
  if (!META_PIXEL_ID || !META_CAPI_ACCESS_TOKEN) {
    console.warn("[stripe-webhook] META_PIXEL_ID / META_CAPI_ACCESS_TOKEN not set - skipping CAPI.");
    return;
  }
  if (!reg.paid) {
    console.log("[stripe-webhook] session not paid yet - skipping CAPI Purchase:", reg.sessionId);
    return;
  }

  const user_data: Record<string, string | string[]> = {};
  if (reg.email) user_data.em = [sha256(reg.email.trim().toLowerCase())];
  const phone = normalizePhone(reg.phone);
  if (phone) user_data.ph = [sha256(phone)];
  const [first, ...rest] = reg.name.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (first) user_data.fn = [sha256(first)];
  if (rest.length) user_data.ln = [sha256(rest.join(" "))];
  if (reg.fbp) user_data.fbp = reg.fbp;
  if (reg.fbc) user_data.fbc = reg.fbc;
  if (reg.clientIp) user_data.client_ip_address = reg.clientIp;
  if (reg.clientUa) user_data.client_user_agent = reg.clientUa;

  const event = {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: reg.sessionId,
    // "website" events require the browser user agent; fall back if missing.
    action_source: reg.clientUa ? "website" : "system_generated",
    ...(reg.sourceUrl ? { event_source_url: reg.sourceUrl } : {}),
    user_data,
    custom_data: {
      currency: (reg.currency || "usd").toUpperCase(),
      value: reg.amountTotal != null ? reg.amountTotal / 100 : 0,
      content_name: "סדנת מנוע העסקאות ל2 נכסים בחודש",
      content_type: "product",
    },
  };

  try {
    const r = await fetch(`https://graph.facebook.com/${META_GRAPH_VERSION}/${META_PIXEL_ID}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [event],
        access_token: META_CAPI_ACCESS_TOKEN,
        ...(META_TEST_EVENT_CODE ? { test_event_code: META_TEST_EVENT_CODE } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) console.error("[stripe-webhook] CAPI Purchase rejected:", r.status, JSON.stringify(body));
    else console.log("[stripe-webhook] CAPI Purchase sent:", reg.sessionId, JSON.stringify(body));
  } catch (err) {
    console.error("[stripe-webhook] CAPI Purchase failed:", err instanceof Error ? err.message : err);
  }
}

/**
 * Fulfill a paid registration. Each step is independent and non-blocking so a
 * failure in one (e.g. sheet down) never stops the others or fails the webhook.
 */
async function handlePaidRegistration(reg: PaidRegistration): Promise<void> {
  console.log("[stripe-webhook] paid registration:", reg);
  await Promise.allSettled([
    dispatchToSheet(reg),
    sendBuyerEmail(reg),
    notifyAdmin(reg),
    sendMetaPurchase(reg),
  ]);
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
        paid: session.payment_status === "paid",
        fbp: md.fbp ?? "",
        fbc: md.fbc ?? "",
        clientIp: md.client_ip ?? "",
        clientUa: md.client_ua ?? "",
        sourceUrl: (session.success_url || "").split("?")[0],
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
