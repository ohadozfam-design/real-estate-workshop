import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Waitlist capture (POST /api/waitlist) - used when the workshop is sold out.
 * Body: { name, phone, email }
 * Dispatches the lead to GOOGLE_SHEET_WEBHOOK_URL tagged "Workshop_Waitlist".
 *
 * Fail-soft: always returns 200 to the visitor once validated, even if the
 * downstream sheet is unreachable/unconfigured (logged), so the UX never breaks.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body: { name?: string; phone?: string; email?: string } =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});
    const name = (body.name ?? "").trim();
    const phone = (body.phone ?? "").trim();
    const email = (body.email ?? "").trim();

    if (name.length < 2 || phone.replace(/\D/g, "").length < 9 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "נא למלא שם מלא, טלפון ואימייל תקינים." });
    }

    const sheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    const payload = {
      timestamp: new Date().toISOString(),
      name,
      phone,
      email,
      tag: "Workshop_Waitlist",
    };

    if (sheetUrl) {
      try {
        await fetch(sheetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error("[waitlist] sheet dispatch failed:", err instanceof Error ? err.message : err);
      }
    } else {
      console.warn("[waitlist] GOOGLE_SHEET_WEBHOOK_URL not set - waitlist lead:", payload);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Waitlist error";
    console.error("[waitlist] error:", message);
    return res.status(500).json({ error: message });
  }
}
