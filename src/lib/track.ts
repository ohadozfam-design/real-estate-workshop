// Lightweight, privacy-friendly client analytics.
// Events: page_view (once/session), cta_click, scroll_depth (25/50/75/100%),
// and time_on_page (session duration on exit). All sent to /api/track-event via
// sendBeacon (keepalive fetch fallback) so tracking never blocks the UI or the
// checkout redirect. No cookies; only path, referrer, UTM tags, a coarse device
// class, and any ?phone / ?uid lead params are captured.

type TrackEvent = "page_view" | "cta_click" | "scroll_depth" | "time_on_page";
type Extra = Record<string, string | number>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const PAGE_VIEW_FLAG = "k2_pv_sent";
const TRACK_URL = "/api/track-event";

function deviceType(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
}

function buildPayload(event: TrackEvent, extra?: Extra) {
  const params = new URLSearchParams(window.location.search);
  return {
    event,
    path: window.location.pathname + window.location.search,
    referrer: document.referrer || "",
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    // Lead params so a click-to-page link (?phone=..., ?uid=...) is attributable.
    phone: params.get("phone") || "",
    uid: params.get("uid") || params.get("lead_id") || "",
    deviceType: deviceType(),
    timestamp: new Date().toISOString(),
    ...extra,
  };
}

/** Fire-and-forget send. Prefers sendBeacon; falls back to keepalive fetch. */
function send(event: TrackEvent, extra?: Extra): void {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify(buildPayload(event, extra));

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(TRACK_URL, blob)) return; // queued, guaranteed flush
    }

    void fetch(TRACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true, // survives a navigation (e.g. the Stripe redirect)
    }).catch(() => {});
  } catch (err) {
    // Analytics must never break UX.
    console.error("[track] failed to send", event, err);
  }
}

/** Safe Meta Pixel track (no-op if the pixel isn't configured/loaded). */
function fbqTrack(event: string): void {
  try {
    window.fbq?.("track", event);
  } catch {
    /* pixel not present - ignore */
  }
}

/** Page view - sent once per browser session (survives re-renders / HMR). */
export function trackPageView(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(PAGE_VIEW_FLAG)) return;
    sessionStorage.setItem(PAGE_VIEW_FLAG, "1");
  } catch {
    // sessionStorage unavailable (private mode) - still fire once here.
  }
  send("page_view");
}

/** Checkout CTA click - fire right before opening Stripe Checkout. */
export function trackCtaClick(): void {
  send("cta_click");
  fbqTrack("InitiateCheckout");
}

/** Scroll-depth milestones: fire 25/50/75/100% once each. Returns a cleanup fn. */
function initScrollDepth(): () => void {
  const thresholds = [25, 50, 75, 100];
  const fired = new Set<number>();

  const onScroll = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const pct =
      scrollable <= 0 ? 100 : Math.min(100, Math.round((window.scrollY / scrollable) * 100));
    for (const t of thresholds) {
      if (pct >= t && !fired.has(t)) {
        fired.add(t);
        send("scroll_depth", { depth: `${t}%` });
      }
    }
    if (fired.size === thresholds.length) window.removeEventListener("scroll", onScroll);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

/** Time on page: send session duration (seconds) once, on first exit/hide. */
function initTimeOnPage(): () => void {
  const start = Date.now();
  let sent = false;

  const finalize = () => {
    if (sent) return;
    sent = true;
    send("time_on_page", { seconds: Math.round((Date.now() - start) / 1000) });
  };
  const onVisibility = () => {
    if (document.visibilityState === "hidden") finalize();
  };

  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", finalize);

  return () => {
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", finalize);
  };
}

/**
 * Initialize page-load analytics: fire page_view and wire scroll-depth +
 * time-on-page listeners. Returns a cleanup fn to detach the listeners.
 */
export function initTracking(): () => void {
  trackPageView();
  const stopScroll = initScrollDepth();
  const stopTime = initTimeOnPage();
  return () => {
    stopScroll();
    stopTime();
  };
}
