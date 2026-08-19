// Central place for editable copy placeholders + pricing.
// Swap the placeholders below with the real event details before launch.

export const SITE = {
  // Two concentrated days, two live hours each.
  eventDates: "24 & 26 באוגוסט",
  eventFormat: "יומיים מרוכזים · שעתיים בכל יום בלייב בזום",
  eventFormatShort: "יומיים בלייב בזום · שעתיים בכל יום",
  day1: { date: "24 באוגוסט", label: "יום ראשון" },
  day2: { date: "26 באוגוסט", label: "יום שני" },
  checkoutHref: "#checkout",
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
  const el = document.getElementById("checkout");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};
