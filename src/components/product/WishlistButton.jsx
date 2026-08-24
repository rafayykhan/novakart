import { useDispatch, useSelector } from "react-redux";
import { HeartIcon } from "../Icons";
import { selectIsWishlisted, wishlistToggled } from "../../features/wishlist/wishlistSlice";

/**
 * Saved-items toggle.
 *
 * State is communicated three ways — filled vs outline icon, aria-pressed, and
 * the accessible name — so it never depends on colour alone.
 *
 * Sits inside a <Link> on product cards, hence the preventDefault and
 * stopPropagation: saving something shouldn't navigate to it.
 */
export default function WishlistButton({ productId, title, size = "md", className = "" }) {
  const dispatch = useDispatch();
  const saved = useSelector(selectIsWishlisted(productId));

  const box = size === "lg" ? "h-12 w-12" : "h-9 w-9";
  const icon = size === "lg" ? 20 : 16;

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
      className={`${box} flex items-center justify-center rounded-sm border transition-colors duration-200 ${
        saved
          ? "border-red-solid bg-red-solid text-white"
          : "border-[#201e1d]/15 bg-[#fffdf9]/85 text-[#201e1d]/60 backdrop-blur-sm hover:border-red hover:text-red"
      } ${className}`}
    >
      <HeartIcon filled={saved} width={icon} height={icon} strokeWidth={saved ? 0 : 1.7} />
    </button>
  );
}
