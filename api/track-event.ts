import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Lightweight, privacy-friendly analytics collector (POST /api/track-event).
 *
 * Receives a page_view or cta_click event and forwards it to the existing
 * Google Sheet webhook (GOOGLE_SHEET_WEBHOOK_URL) tagged "Workshop_Analytics".
 * The Apps Script on the sheet side is responsible for creating the "Analytics"
 * tab + headers and the "Summary" formulas (see docs/apps-script-analytics.gs).
 *
 * No cookies, no PII: only event type, path, referrer, UTM tags and a coarse
 * device class are recorded. Fail-soft: any downstream failure is logged and we
 * still return 204 so the browser's beacon never surfaces an error to the user.
 */

type EventType = "page_view" | "cta_click";

const clip = (v: unknown, max = 512): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/** Format an ISO instant as Israel local time (Asia/Jerusalem), DST-aware. */
function toIsraelTime(iso: string): string {
  const d = iso ? new Date(iso) : new Date();
  const when = isNaN(d.getTime()) ? new Date() : d;
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jerusalem",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(when);
  } catch {
    return when.toISOString();
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Never break the caller: everything below is best-effort and returns 204.
  try {
    const body: Record<string, unknown> =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});

    const event: EventType = body.event === "cta_click" ? "cta_click" : "page_view";
    const deviceType = body.deviceType === "mobile" ? "mobile" : "desktop";
    const isoTimestamp = clip(body.timestamp, 40) || new Date().toISOString();

    const payload = {
      tag: "Workshop_Analytics",
      // Pre-formatted Israel-time string so the sheet always has it, plus the
      // raw ISO instant in case the Apps Script prefers to format it itself.
      timestampIsrael: toIsraelTime(isoTimestamp),
      timestamp: isoTimestamp,
      event,
      deviceType,
      path: clip(body.path, 256),
      referrer: clip(body.referrer, 256),
      utm_source: clip(body.utm_source, 128),
      utm_medium: clip(body.utm_medium, 128),
      utm_campaign: clip(body.utm_campaign, 128),
    };

    const sheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (sheetUrl) {
      try {
        await fetch(sheetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          redirect: "follow",
        });
      } catch (err) {
        console.error(
          "[track-event] sheet dispatch failed:",
          err instanceof Error ? err.message : err
        );
      }
    } else {
      console.warn("[track-event] GOOGLE_SHEET_WEBHOOK_URL not set - event:", payload);
    }

    // 204 No Content: nothing for the beacon to parse, and it never blocks UX.
    return res.status(204).end();
  } catch (err) {
    console.error("[track-event] error:", err instanceof Error ? err.message : err);
    // Still succeed from the client's perspective - analytics must never break UX.
    return res.status(204).end();
  }
}
