import { useSelector } from "react-redux";
import { selectCartCount, selectCartSubtotal } from "../features/cart/cartSlice";
import { money } from "../utils/format";

const SHIPPING_FLAT = 4.99;
const FREE_SHIPPING_OVER = 120;

// The order summary, styled like a paper receipt - dashed rules, monospaced
// numbers, torn bottom edge. Used on both the cart and the checkout page.
export default function Receipt({ children }) {
  const count = useSelector(selectCartCount);
  const subtotal = useSelector(selectCartSubtotal);

  const shipping = subtotal >= FREE_SHIPPING_OVER || subtotal === 0 ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  return (
    <div className="panel relative rounded-2xl rounded-b-none p-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Order summary</p>

      <dl className="nums mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">
            Items <span className="text-ink">×{count}</span>
          </dt>
          <dd>{money(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd>{shipping === 0 ? "Free" : money(shipping)}</dd>
        </div>
      </dl>

      {shipping > 0 && (
        <p className="nums mt-3 text-xs text-muted">
          {money(FREE_SHIPPING_OVER - subtotal)} more for free shipping.
        </p>
      )}

      <div className="my-5 border-t border-dashed border-line" />

      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted">Total</span>
        <span className="nums gradient-text font-display text-3xl font-bold">
          {money(total)}
        </span>
      </div>

      {children}

      {/* torn paper edge */}
      <div
        className="absolute inset-x-0 -bottom-2 h-2"
        style={{
          background:
            "radial-gradient(circle at 6px 0, transparent 6px, var(--panel) 6.5px) 0 0 / 12px 12px repeat-x",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
