import { Link } from "react-router-dom";
import { ArrowRightIcon } from "../Icons";
import { FREE_SHIPPING_OVER } from "../../features/cart/shipping";
import { money } from "../../utils/format";

/**
 * Slim ink strip above the nav. It scrolls away — only the nav below sticks.
 *
 * The shipping threshold is read from the same constant the cart totals use,
 * so the promise up here can't drift from what a shopper is actually charged.
 * No countdowns, no invented percentages.
 */
export default function AnnouncementBar() {
  return (
    <div className="on-ink">
      <div className="shell flex h-10 items-center justify-between gap-4">
        <p className="font-display truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f4efe6] sm:text-[11px] sm:tracking-[0.22em]">
          Free shipping on orders{" "}
          <span className="nums">{money(FREE_SHIPPING_OVER)}</span>+
        </p>

        <Link
          to="/products"
          className="group hidden shrink-0 items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f4efe6]/75 transition-colors hover:text-[#f4efe6] sm:inline-flex"
        >
          Shop NovaKart
          <ArrowRightIcon
            width={13}
            height={13}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
}
