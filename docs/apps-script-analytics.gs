/**
 * K2 Landing Page — Google Sheets webhook (Code.gs)
 * ---------------------------------------------------------------------------
 * Handles three POST payloads routed by `tag`:
 *   • Workshop_Analytics      → Analytics tab, ONE UPSERTED ROW PER SESSION
 *   • Workshop_Waitlist       → Waitlist tab (append)
 *   • *_Buyer (e.g. Workshop_Sep2_Buyer) → Buyers tab (append)
 *
 * The Vercel /api/track-event endpoint sends a session snapshot (keyed by
 * sessionId) on load, on each new scroll milestone, on the CTA click, and on
 * page exit. This script finds the row with that sessionId and UPDATES it, or
 * APPENDS it the first time — so every visitor is a single clean row.
 *
 * INSTALL
 *   1. Google Sheet → Extensions → Apps Script → paste this into Code.gs.
 *   2. Set the CONFIG tab names below to match your existing buyers/waitlist tabs.
 *   3. Deploy → Manage deployments → edit the active Web App → Deploy
 *      (the /exec URL stays the same).
 *   NOTE: if an "Analytics" tab already exists from an older version, delete it
 *   once so it is recreated with the new single-row headers below.
 *
 * Analytics columns (A–J; J = Session ID key, safe to hide):
 *   Timestamp (Israel Time) | Device | Time on Page (Seconds) | Max Scroll Depth |
 *   Clicked CTA? | UTM Source | UTM Campaign | Phone | Lead ID | Session ID
 */

/*** ─────────────  CONFIG — set these to match YOUR tabs  ───────────── ***/
var CONFIG = {
  buyersSheet: "Buyers", // ← set to your EXISTING buyers tab name
  waitlistSheet: "Waitlist", // ← set to your EXISTING waitlist tab name
  analyticsSheet: "Analytics",
  summarySheet: "Summary",
};

var ANALYTICS_HEADERS = [
  "Timestamp (Israel Time)",
  "Device",
  "Time on Page (Seconds)",
  "Max Scroll Depth",
  "Clicked CTA?",
  "UTM Source",
  "UTM Campaign",
  "Phone",
  "Lead ID",
  "Session ID",
];
var SESSION_ID_COL = 10; // column J

/*** ─────────────────────────  ENTRY POINTS  ───────────────────────── ***/
function doGet() {
  return ContentService.createTextOutput("Webhook is live and running!");
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000); // serialize writes so concurrent beacons don't clash
  } catch (err) {
    // Could not get a lock — proceed rather than dropping the event.
  }
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var tag = String(data.tag || "");

    if (tag === "Workshop_Analytics") {
      handleAnalytics_(data, ss);
    } else if (tag === "Workshop_Waitlist") {
      handleWaitlist_(data, ss);
    } else if (tag.slice(-6) === "_Buyer") {
      handleBuyer_(data, ss);
    } else {
      handleBuyer_(data, ss); // sensible default for any other lead payload
    }

    return json_({ status: "success" });
  } catch (err) {
    return json_({ status: "error", message: String(err) });
  } finally {
    try {
      lock.releaseLock();
    } catch (e2) {}
  }
}

/*** ───────────────────  ANALYTICS (single-row upsert)  ─────────────── ***/
function handleAnalytics_(data, ss) {
  var sheet = ss.getSheetByName(CONFIG.analyticsSheet);
  if (!sheet) sheet = ss.insertSheet(CONFIG.analyticsSheet);

  // ALWAYS enforce the exact 10-column header row (A1:J1) - this also repairs an
  // older/misaligned header row so live upserts can find column J reliably.
  ensureAnalyticsHeaders_(sheet);

  var sid = String(data.sessionId || "");
  var timeCell = (Number(data.seconds) || 0) + "s"; // column C
  var scrollCell = data.maxScroll || "0%"; // column D
  var ctaCell = data.ctaClicked ? "Yes" : "No"; // column E

  var rowIndex = sid ? findSessionRow_(sheet, sid) : -1;

  if (rowIndex === -1) {
    // First sighting: write the full 10-column row with an explicit A..J range so
    // sessionId is GUARANTEED to land in column 10 (J) - never a 9-vs-10 drift.
    var insertAt = sheet.getLastRow() + 1;
    sheet.getRange(insertAt, 1, 1, 10).setValues([
      [
        data.timestampIsrael || toIsraelTime_(data.timestamp), // A arrival time
        data.device || "", // B
        timeCell, // C time on page
        scrollCell, // D max scroll
        ctaCell, // E clicked CTA?
        data.utm_source || "", // F
        data.utm_campaign || "", // G
        data.phone || "", // H
        data.uid || "", // I lead id
        sid, // J session id (key)
      ],
    ]);
  } else {
    // Existing session: update ONLY Time (C), Max Scroll (D), Clicked CTA? (E).
    // Arrival time (A), device, UTM, phone, lead id and session id are left as-is.
    sheet.getRange(rowIndex, 3, 1, 3).setValues([[timeCell, scrollCell, ctaCell]]);
  }

  ensureSummary_(ss);
}

/**
 * Self-healing headers: force-overwrite row 1 across A1:J1 on EVERY write so a
 * corrupted/merged/older header row is repaired and all 10 columns stay strictly
 * separate. Column J therefore always holds "Session ID" for the upsert scan.
 */
function ensureAnalyticsHeaders_(sheet) {
  sheet.getRange("A1:J1").breakApart(); // undo any merged cells that shift headers
  sheet
    .getRange(1, 1, 1, ANALYTICS_HEADERS.length) // A1:J1, exactly 10 cells
    .setValues([ANALYTICS_HEADERS])
    .setFontWeight("bold")
    .setBackground("#D1FAE5");
  sheet.setFrozenRows(1);
}

/**
 * One-time manual repair: run this from the Apps Script editor (Run ▶) to fix
 * the Analytics header row immediately, without waiting for the next event.
 */
function repairAnalyticsHeaders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.analyticsSheet);
  if (!sheet) sheet = ss.insertSheet(CONFIG.analyticsSheet);
  ensureAnalyticsHeaders_(sheet);
}

/** Return the 1-based row index whose Session ID (column J) matches, or -1. */
function findSessionRow_(sheet, sid) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  var ids = sheet.getRange(2, SESSION_ID_COL, lastRow - 1, 1).getValues(); // column 10 = J
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === sid) return i + 2; // +2: header row + 0-index
  }
  return -1;
}

/*** ─────────────────────  WAITLIST / BUYERS (append)  ─────────────── ***/
function handleWaitlist_(data, ss) {
  var headers = ["Timestamp (Israel Time)", "Name", "Phone", "Email"];
  var sheet = getOrCreateSheet_(ss, CONFIG.waitlistSheet, headers);
  sheet.appendRow([
    toIsraelTime_(data.timestamp),
    data.name || "",
    data.phone || "",
    data.email || "",
  ]);
}

function handleBuyer_(data, ss) {
  var headers = [
    "Timestamp (Israel Time)",
    "Name",
    "Phone",
    "Email",
    "Amount (USD)",
    "Order Bump",
    "Tag",
  ];
  var sheet = getOrCreateSheet_(ss, CONFIG.buyersSheet, headers);
  var usd = data.amount != null && data.amount !== "" ? Number(data.amount) / 100 : "";
  sheet.appendRow([
    toIsraelTime_(data.timestamp),
    data.name || "",
    data.phone || "",
    data.email || "",
    usd,
    data.hasOrderBump ? "Yes" : "No",
    data.tag || "",
  ]);
}

/*** ─────────────────────────────  SUMMARY  ────────────────────────── ***/
function ensureSummary_(ss) {
  var s = ss.getSheetByName(CONFIG.summarySheet);
  if (!s) s = ss.insertSheet(CONFIG.summarySheet, 0);

  var A = "'" + CONFIG.analyticsSheet + "'";
  // One row per session -> Total Sessions = filled rows in the Session ID column.
  var sessions = "=MAX(0, COUNTA(" + A + "!J2:J))";
  var ctaClicks = "=COUNTIF(" + A + "!E:E,\"Yes\")";
  var purchases =
    "=IFERROR(MAX(0, COUNTA(INDIRECT(\"'" + CONFIG.buyersSheet + "'!A2:A\"))), 0)";

  var rows = [
    ["K2 Landing Page — Funnel Summary", ""],
    ["Total Sessions", sessions],
    ["Total CTA Clicks", ctaClicks],
    ["Total Purchases", purchases],
    ["Click-through Rate (CTR %)", "=IF(B2=0,0,B3/B2)"],
    ["Purchase Conversion Rate (%)", "=IF(B2=0,0,B4/B2)"],
  ];
  s.getRange(1, 1, rows.length, 2).setValues(rows);
  s.getRange("A1:B1").merge().setFontWeight("bold").setFontSize(12);
  s.getRange("A2:A6").setFontWeight("bold");
  s.getRange("B5:B6").setNumberFormat("0.0%");
  s.setColumnWidth(1, 240);
  s.setColumnWidth(2, 140);
}

/*** ─────────────────────────────  HELPERS  ────────────────────────── ***/
function getOrCreateSheet_(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function toIsraelTime_(iso) {
  var d = iso ? new Date(iso) : new Date();
  if (isNaN(d.getTime())) d = new Date();
  return Utilities.formatDate(d, "Asia/Jerusalem", "dd/MM/yyyy HH:mm:ss");
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
