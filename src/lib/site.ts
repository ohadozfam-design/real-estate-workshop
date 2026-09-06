// Central place for editable copy placeholders + pricing.
// Swap the placeholders below with the real event details before launch.

export const SITE = {
  // Two concentrated days, two live hours each (18:00 to 20:00 Israel time).
  // Two concentrated days: 16 September (day 1) and 17 September (day 2), 2026.
  eventDates: "16 & 17 בספטמבר",
  eventHours: "18:00 עד 20:00 (שעון ישראל)",
  eventDatesFull: "16 & 17 בספטמבר · 18:00 עד 20:00 (שעון ישראל)",
  eventFormat: "יומיים מרוכזים · שעתיים בכל יום בלייב בזום",
  eventFormatShort: "יומיים בלייב בזום · שעתיים בכל יום",
  day1: { date: "16 בספטמבר", label: "יום רביעי" },
  day2: { date: "17 בספטמבר", label: "יום חמישי" },
  checkoutHref: "#pricing",
} as const;

export const PRICING = {
  base: 97,
  orderBump: 27,
  get withBump() {
    return this.base + this.orderBump;
  },
  totalStackValue: 888,
  bumpOriginal: 197,
} as const;

export const scrollToCheckout = () => {
  // Prefer the pricing/checkout card itself so the sticky CTA lands on the offer,
  // not the guarantee block that sits at the top of the checkout section.
  const el = document.getElementById("pricing") || document.getElementById("checkout");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};
