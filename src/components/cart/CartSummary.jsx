import { useSelector } from "react-redux";
import { selectCartCount, selectCartSubtotal } from "../../features/cart/cartSlice";
import {
  FREE_SHIPPING_OVER,
  amountToFreeShipping,
  shippingFor,
} from "../../features/cart/shipping";
import { money } from "../../utils/format";

/**
 * Order summary. Used on both the cart and checkout pages.
 *
 * Replaces the torn-paper receipt the first version had. That was a nice bit
 * of craft, but a novelty graphic sitting where the total goes works against
 * the one thing this component has to do, which is be believed.
 *
 * There is no tax line. Nothing in this build calculates tax, and a row
 * reading "Estimated tax $0.00" would be a made-up number wearing a label.
 */
export default function CartSummary({ children, heading = "Order summary" }) {
  const count = useSelector(selectCartCount);
  const subtotal = useSelector(selectCartSubtotal);

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;
  const remaining = amountToFreeShipping(subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_OVER) * 100);

  return (
    <div className="panel p-6 sm:p-7">
      <h2 className="eyebrow">{heading}</h2>

      <dl className="nums mt-6 space-y-3.5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">
            Subtotal <span className="text-faint">({count} items)</span>
          </dt>
          <dd className="text-ink">{money(subtotal)}</dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-muted">Shipping</dt>
          <dd className={shipping === 0 ? "text-success" : "text-ink"}>
            {shipping === 0 ? "Free" : money(shipping)}
          </dd>
        </div>
      </dl>

      {remaining > 0 && subtotal > 0 && (
        <div className="mt-5">
          <div
            className="h-1 w-full overflow-hidden rounded-full bg-surface-2"
            role="presentation"
          >
            <div
              className="h-full rounded-full bg-ink transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="nums mt-2.5 text-xs text-muted">
            <span className="text-ink">{money(remaining)}</span> more for free
            shipping.
          </p>
        </div>
      )}

      <div className="my-6 border-t border-line" />

      <div className="flex items-baseline justify-between gap-4">
        <span className="font-display text-sm font-medium text-ink">Total</span>
        <span className="nums font-display text-2xl font-bold text-ink">
          {money(total)}
        </span>
      </div>

      {children}
    </div>
  );
}
