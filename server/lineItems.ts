import type Stripe from "stripe";

/**
 * Stripe product tax code. Required when the account uses Managed Payments
 * (on by default) - without an *eligible* code Checkout rejects the line items.
 * "General - Electronically Supplied Services" fits a live online workshop and
 * is Managed-Payments-eligible. Override via STRIPE_TAX_CODE if needed.
 */
const TAX_CODE = process.env.STRIPE_TAX_CODE || "txcd_10000000";

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
        product_data: { name: "סדנת מנוע העסקאות ל2 נכסים בחודש", tax_code: TAX_CODE },
        unit_amount: 9700, // $97.00
      },
      quantity: 1,
    },
  ];

  if (hasOrderBump) {
    items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "חבילת חוזים מול קבלנים ומוכרים פרטיים", tax_code: TAX_CODE },
        unit_amount: 2700, // $27.00
      },
      quantity: 1,
    });
  }

  return items;
}
