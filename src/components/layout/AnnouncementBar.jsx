import { Link } from "react-router-dom";
import { ArrowRightIcon } from "../Icons";
import { FREE_SHIPPING_OVER, SHIPPING_FLAT } from "../../features/cart/shipping";
import { money } from "../../utils/format";

/**
 * Slim utility strip. It scrolls away — only the nav below it sticks.
 *
 * The one claim it makes is the shipping threshold, and that's read from the
 * same constants the cart totals use, so the bar can't drift out of sync with
 * what a shopper is actually charged. No countdowns, no invented discounts.
 */
export default function AnnouncementBar() {
  return (
    <div className="border-b border-line bg-surface-2">
      <div className="shell flex h-9 items-center justify-center gap-x-6 sm:h-8">
        <p className="truncate text-center text-[11px] tracking-[0.08em] text-muted sm:text-xs">
          Free shipping over{" "}
          <span className="nums text-ink">{money(FREE_SHIPPING_OVER)}</span>
          <span className="hidden sm:inline">
            {" "}
            · {money(SHIPPING_FLAT)} flat rate below that
          </span>
        </p>

        <Link
          to="/products"
          className="hidden shrink-0 items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink md:inline-flex"
        >
          Browse the shop
          <ArrowRightIcon width={13} height={13} />
        </Link>
      </div>
    </div>
  );
}
