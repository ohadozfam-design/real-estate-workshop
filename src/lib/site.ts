// Central place for editable copy placeholders + pricing.
// Swap the placeholders below with the real event details before launch.

export const SITE = {
  eventDatePlaceholder: "[תאריך הסדנה]",
  eventTimePlaceholder: "[שעת התחלה – שעת סיום]",
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
