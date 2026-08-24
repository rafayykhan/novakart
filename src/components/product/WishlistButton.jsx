import { useDispatch, useSelector } from "react-redux";
import { HeartIcon } from "../Icons";
import { selectIsWishlisted, wishlistToggled } from "../../features/wishlist/wishlistSlice";

/**
 * Saved-items toggle.
 *
 * State is communicated three ways — filled vs outline icon, aria-pressed,
 * and the accessible name — so it never depends on colour alone.
 *
 * Sits inside a <Link> on product cards, hence the preventDefault/stopPropagation:
 * saving something shouldn't navigate to it.
 */
export default function WishlistButton({ productId, title, size = "md", className = "" }) {
  const dispatch = useDispatch();
  const saved = useSelector(selectIsWishlisted(productId));

  const box = size === "lg" ? "h-11 w-11" : "h-9 w-9";
  const icon = size === "lg" ? 19 : 16;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        dispatch(wishlistToggled(productId));
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved items` : `Save ${title} for later`}
      className={`${box} flex items-center justify-center rounded-full border transition-colors duration-200 ${
        saved
          ? "border-transparent bg-ink text-bg"
          : "border-line bg-surface/90 text-muted backdrop-blur-sm hover:border-ink hover:text-ink"
      } ${className}`}
    >
      <HeartIcon filled={saved} width={icon} height={icon} strokeWidth={saved ? 0 : 1.6} />
    </button>
  );
}
