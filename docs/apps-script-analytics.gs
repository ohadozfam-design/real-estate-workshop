/**
 * Google Apps Script — Analytics sink for the K2 landing page.
 * ---------------------------------------------------------------------------
 * The Vercel endpoint /api/track-event POSTs analytics events to this Web App
 * (the same GOOGLE_SHEET_WEBHOOK_URL already used for buyers/waitlist), tagged
 * "Workshop_Analytics". This script:
 *   1. Auto-creates the "Analytics" tab + header row if missing.
 *   2. Appends one row per event.
 *   3. Creates/refreshes a "Summary" tab with live funnel formulas.
 *
 * HOW TO INSTALL
 *   1. Open the Google Sheet → Extensions → Apps Script.
 *   2. Merge the `if (data.tag === 'Workshop_Analytics')` branch shown in
 *      doPost() below into your EXISTING doPost (keep your buyer/waitlist
 *      branches), then paste the helper functions.
 *   3. Deploy → Manage deployments → edit the active Web App deployment →
 *      Deploy (this republishes; the /exec URL stays the same).
 *   4. Set BUYERS_SHEET_NAME below to the tab where paid buyers are written.
 *
 * Analytics columns:
 *   Timestamp (Israel Time) | Event Type | Device | UTM Source | UTM Campaign | Referrer | Path
 */

var ANALYTICS_SHEET = "Analytics";
var SUMMARY_SHEET = "Summary";
// The tab your paid-buyer rows land in (used for the purchase count/formula).
// Adjust to match your setup (e.g. "Workshop_Sep2_Buyer" or "Buyers").
var BUYERS_SHEET_NAME = "Workshop_Sep2_Buyer";

var ANALYTICS_HEADERS = [
  "Timestamp (Israel Time)",
  "Event Type",
  "Device",
  "UTM Source",
  "UTM Campaign",
  "Referrer",
  "Path",
];

/**
 * Merge this branch into your existing doPost(e).
 * Example minimal doPost:
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (data.tag === "Workshop_Analytics") {
      handleAnalytics_(data, ss);
      return ContentService
        .createTextOutput(JSON.stringify({ status: "success" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ---- keep your existing buyer / waitlist branches here ----

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** GET returns a health string (handy for a quick browser check). */
function doGet() {
  return ContentService.createTextOutput("Webhook is live and running!");
}

/** Append one analytics event; auto-create the tab + headers on first write. */
function handleAnalytics_(data, ss) {
  var sheet = ss.getSheetByName(ANALYTICS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(ANALYTICS_SHEET);
    sheet.appendRow(ANALYTICS_HEADERS);
    sheet.getRange(1, 1, 1, ANALYTICS_HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    data.timestampIsrael || data.timestamp || new Date(),
    data.event || "",
    data.deviceType || "",
    data.utm_source || "",
    data.utm_campaign || "",
    data.referrer || "",
    data.path || "",
  ]);

  ensureSummary_(ss); // keep the funnel metrics live
}

/** Create/refresh the Summary tab with live funnel formulas. Idempotent. */
function ensureSummary_(ss) {
  var s = ss.getSheetByName(SUMMARY_SHEET);
  if (!s) s = ss.insertSheet(SUMMARY_SHEET, 0);

  var A = ANALYTICS_SHEET;
  var pageViews = '=COUNTIF(' + A + "!B:B,\"page_view\")";
  var ctaClicks = '=COUNTIF(' + A + "!B:B,\"cta_click\")";
  // Purchases: count non-empty rows in the buyers tab (minus header), guarded
  // so a missing/renamed tab shows 0 instead of #REF.
  var purchases =
    '=IFERROR(MAX(0, COUNTA(INDIRECT("' +
    BUYERS_SHEET_NAME +
    '!A2:A"))), 0)';

  var rows = [
    ["K2 Landing Page — Funnel Summary", ""],
    ["Total Page Views", pageViews],
    ["Total CTA Clicks", ctaClicks],
    ["Total Purchases", purchases],
    ["Click-through Rate (CTR %)", "=IF(B2=0,0,B3/B2)"],
    ["Purchase Conversion Rate (%)", "=IF(B2=0,0,B4/B2)"],
  ];

  s.getRange(1, 1, rows.length, 2).setValues(rows);
  s.getRange("A1:B1").merge().setFontWeight("bold").setFontSize(12);
  s.getRange("A2:A6").setFontWeight("bold");
  s.getRange("B5:B6").setNumberFormat("0.0%"); // CTR + conversion as percentages
  s.setColumnWidth(1, 240);
  s.setColumnWidth(2, 140);
}
