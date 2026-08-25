// Single-row-per-session analytics.
//
// Instead of emitting a row per event, each visitor is ONE row in the Analytics
// sheet, keyed by a sessionId. The client keeps live session state (max scroll,
// CTA clicked, elapsed seconds) and sends "upsert" beacons to /api/track-event;
// the Apps Script updates the matching row (or appends it on first sight).
//
// Sends happen on: initial load, each new scroll milestone, the CTA click, and
// page exit (visibilitychange -> hidden / pagehide). All via sendBeacon (with a
// keepalive fetch fallback) so nothing blocks the UI or the checkout redirect.
// No cookies; only device class, UTM tags and ?phone / ?uid lead params.

type Extra = Record<string, string | number | boolean>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const SID_KEY = "k2_sid";
const ARRIVAL_KEY = "k2_arrival";
const MAXSCROLL_KEY = "k2_maxscroll";
const CTA_KEY = "k2_cta";
const TRACK_URL = "/api/track-event";

/* ── session-state helpers (persisted in sessionStorage) ─────────────────── */

function ss(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function genId(): string {
  try {
    if (crypto?.randomUUID) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function sessionId(): string {
  const store = ss();
  if (!store) return genId();
  let id = store.getItem(SID_KEY);
  if (!id) {
    id = genId();
    store.setItem(SID_KEY, id);
  }
  return id;
}

function arrivalIso(): string {
  const store = ss();
  if (!store) return new Date().toISOString();
  let iso = store.getItem(ARRIVAL_KEY);
  if (!iso) {
    iso = new Date().toISOString();
    store.setItem(ARRIVAL_KEY, iso);
  }
  return iso;
}

function elapsedSeconds(): number {
  const started = new Date(arrivalIso()).getTime();
  return Math.max(0, Math.round((Date.now() - started) / 1000));
}

function maxScroll(): number {
  const store = ss();
  return store ? Number(store.getItem(MAXSCROLL_KEY) || 0) : 0;
}
function setMaxScroll(v: number): void {
  ss()?.setItem(MAXSCROLL_KEY, String(v));
}

function ctaClicked(): boolean {
  return ss()?.getItem(CTA_KEY) === "1";
}
function setCtaClicked(): void {
  ss()?.setItem(CTA_KEY, "1");
}

function deviceType(): "mobile" | "desktop" {
  return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
}

/* ── the single-row session payload + upsert send ───────────────────────── */

function buildPayload(extra?: Extra) {
  const params = new URLSearchParams(window.location.search);
  return {
    sessionId: sessionId(),
    timestamp: arrivalIso(), // arrival time (fixed for the session)
    device: deviceType(),
    seconds: elapsedSeconds(),
    maxScroll: `${maxScroll()}%`,
    ctaClicked: ctaClicked(),
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    phone: params.get("phone") || "",
    uid: params.get("uid") || params.get("lead_id") || "",
    path: window.location.pathname + window.location.search,
    referrer: document.referrer || "",
    ...extra,
  };
}

/** Fire-and-forget upsert. Prefers sendBeacon; falls back to keepalive fetch. */
function sendSession(extra?: Extra): void {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify(buildPayload(extra));
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(TRACK_URL, blob)) return;
    }
    void fetch(TRACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch (err) {
    console.error("[track] session upsert failed", err);
  }
}

/** Safe Meta Pixel track (no-op if the pixel isn't configured/loaded). */
function fbqTrack(event: string): void {
  try {
    window.fbq?.("track", event);
  } catch {
    /* pixel not present */
  }
}

/* ── public API ─────────────────────────────────────────────────────────── */

/** Checkout CTA click - mark the session and update the row before Stripe. */
export function trackCtaClick(): void {
  setCtaClicked();
  sendSession({ ctaClicked: true });
  fbqTrack("InitiateCheckout");
}

function scrollMilestone(pct: number): number {
  if (pct >= 100) return 100;
  if (pct >= 75) return 75;
  if (pct >= 50) return 50;
  if (pct >= 25) return 25;
  return 0;
}

/**
 * Initialize session tracking: create/refresh the session row on load, bump it
 * on each new scroll milestone, and finalize it (latest time + scroll) on exit.
 * Returns a cleanup fn that detaches the listeners.
 */
export function initTracking(): () => void {
  if (typeof window === "undefined") return () => {};

  // Establish the session and write the initial row.
  sessionId();
  arrivalIso();
  sendSession();

  const onScroll = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const pct =
      scrollable <= 0 ? 100 : Math.min(100, Math.round((window.scrollY / scrollable) * 100));
    const milestone = scrollMilestone(pct);
    if (milestone > maxScroll()) {
      setMaxScroll(milestone);
      sendSession(); // row now reflects the deeper scroll
    }
  };

  const finalize = () => {
    if (document.visibilityState === "hidden") sendSession();
  };
  const onPageHide = () => sendSession();

  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", finalize);
  window.addEventListener("pagehide", onPageHide);

  return () => {
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", finalize);
    window.removeEventListener("pagehide", onPageHide);
  };
}
