import type Stripe from "stripe";

/**
 * Builds the Stripe Checkout line items for the workshop order.
 * Prices are defined in the smallest currency unit (cents) and server-side only,
 * so the amount charged can never be tampered with from the client.
 */
export function buildLineItems(
  hasOrderBump: boolean
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: "usd",
        product_data: { name: "סדנת לייב: איתור וניתוח נכסים בארה״ב" },
        unit_amount: 9700, // $97.00
      },
      quantity: 1,
    },
  ];

  if (hasOrderBump) {
    items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "חבילת חוזים מול קבלנים ומוכרים פרטיים" },
        unit_amount: 2700, // $27.00
      },
      quantity: 1,
    });
  }

  return items;
}
