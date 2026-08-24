import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  itemRemoved,
  qtyDecreased,
  qtyIncreased,
} from "../../features/cart/cartSlice";
import QuantitySelector from "../ui/QuantitySelector";
import { money } from "../../utils/format";

/**
 * A cart line.
 *
 * Two layouts in one component: on phones the stepper and line total sit on a
 * second row under the title, on tablet and up everything is on one line with
 * the total right-aligned. Splitting it into two components would mean two
 * places to keep the same actions wired up.
 *
 * Remove is a text button, not a bin icon on its own — "Remove" can't be
 * misread, and it stops the row ending in a red glyph.
 */
export default function CartItem({ item }) {
  const dispatch = useDispatch();

  return (
    <li className="flex gap-4 border-b border-line py-6 last:border-b-0 sm:gap-6">
      <Link
        to={`/product/${item.id}`}
        className="media-plate flex h-24 w-24 shrink-0 items-center justify-center rounded-md p-3 sm:h-28 sm:w-28 sm:p-4"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="t-product">
              <Link
                to={`/product/${item.id}`}
                className="line-clamp-2 text-ink hover:underline decoration-line-strong underline-offset-4"
              >
                {item.title}
              </Link>
            </h3>
            <p className="nums mt-1.5 text-sm text-muted">{money(item.price)} each</p>
          </div>

          {/* Line total, desktop position */}
          <span className="nums hidden shrink-0 font-display text-base font-semibold text-ink sm:block">
            {money(item.price * item.qty)}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-4">
          <QuantitySelector
            value={item.qty}
            onIncrease={() => dispatch(qtyIncreased(item.id))}
            onDecrease={() => dispatch(qtyDecreased(item.id))}
            label={item.title}
            size="sm"
            // 1 → 0 removes the row rather than leaving a dead line item, so
            // the stepper is allowed to go below its usual floor.
            min={0}
          />

          <div className="flex items-center gap-4">
            {/* Line total, mobile position */}
            <span className="nums font-display text-sm font-semibold text-ink sm:hidden">
              {money(item.price * item.qty)}
            </span>

            <button
              type="button"
              onClick={() => dispatch(itemRemoved(item.id))}
              className="text-sm text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-danger hover:decoration-danger"
            >
              Remove
              <span className="sr-only"> {item.title} from cart</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
