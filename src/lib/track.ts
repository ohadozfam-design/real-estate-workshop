// Lightweight, privacy-friendly client analytics.
// Fires page_view (once per session) and cta_click events to /api/track-event
// using sendBeacon (fetch keepalive fallback) so it never blocks the UI or the
// checkout redirect. No cookies, no PII - only path, referrer, UTM tags and a
// coarse device class are sent.

type TrackEvent = "page_view" | "cta_click";

const PAGE_VIEW_FLAG = "k2_pv_sent";

function deviceType(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
}

function buildPayload(event: TrackEvent) {
  const params = new URLSearchParams(window.location.search);
  return {
    event,
    path: window.location.pathname + window.location.search,
    referrer: document.referrer || "",
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    deviceType: deviceType(),
    timestamp: new Date().toISOString(),
  };
}

/** Fire-and-forget send. Prefers sendBeacon; falls back to keepalive fetch. */
function send(event: TrackEvent): void {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify(buildPayload(event));
    const url = "/api/track-event";

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon(url, blob);
      if (ok) return; // queued by the browser, guaranteed to flush
    }

    // Fallback: keepalive so it survives a navigation (e.g. Stripe redirect).
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch (err) {
    // Analytics must never break UX.
    console.error("[track] failed to send", event, err);
  }
}

/** Page view - sent once per browser session (survives re-renders / HMR). */
export function trackPageView(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(PAGE_VIEW_FLAG)) return;
    sessionStorage.setItem(PAGE_VIEW_FLAG, "1");
  } catch {
    // sessionStorage may be unavailable (private mode) - still fire once here.
  }
  send("page_view");
}

/** Checkout CTA click - fire right before opening Stripe Checkout. */
export function trackCtaClick(): void {
  send("cta_click");
}
