/**
 * The store's one shipping rule, in one place.
 *
 * It was previously hardcoded inside the order summary component. Pulled out
 * because the announcement bar, the product page and the cart all quote the
 * threshold — and a promise in the header that doesn't match the total at
 * checkout is the fastest way to lose trust.
 *
 * There is no tax engine behind this build, so no tax line is shown. An
 * "estimated tax — $0.00" row would be a number we made up.
 */
export const SHIPPING_FLAT = 4.99;
export const FREE_SHIPPING_OVER = 120;

export function shippingFor(subtotal) {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
}

export const amountToFreeShipping = (subtotal) =>
  Math.max(0, FREE_SHIPPING_OVER - subtotal);
