import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../context/ToastContext";
import { itemAdded, selectQtyOf } from "../../features/cart/cartSlice";
import { categoryLabel, money } from "../../utils/format";
import ProductMedia from "./ProductMedia";
import WishlistButton from "./WishlistButton";
import Rating from "../ui/Rating";

/**
 * Image-first and border-free. The cards are separated by whitespace and the
 * plate behind each photo, not by outlines and drop shadows — that's most of
 * what stops a grid reading as a dashboard.
 *
 * Hover does three quiet things over ~200ms: the photo scales a hair, the
 * save button lifts out of the background, and the add button firms up from
 * outline to solid. Nothing moves position, so the pointer never loses its
 * target mid-hover.
 */
export default function ProductCard({ product, priority = false }) {
  const dispatch = useDispatch();
  const { notify } = useToast();
  const qty = useSelector(selectQtyOf(product.id));

  function handleAdd() {
    dispatch(itemAdded(product));
    notify("Added to cart", "success", { label: "View cart", to: "/cart" });
  }

  return (
    <article className="group relative flex flex-col">
      {/* The photo is a second route into the same page. It's hidden from
          assistive tech and skipped in the tab order so keyboard users get
          one stop per card, on the title link, rather than two. */}
      <Link
        to={`/product/${product.id}`}
        className="block"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductMedia
          src={product.image}
          alt={product.title}
          zoom
          priority={priority}
          pad="p-5 sm:p-7"
        />
      </Link>

      <div className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3">
        <WishlistButton productId={product.id} title={product.title} />
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="eyebrow">{categoryLabel(product.category)}</p>

        <h3 id={`product-${product.id}-title`} className="t-product mt-2 text-ink">
          <Link to={`/product/${product.id}`} className="line-clamp-2 hover:underline decoration-line-strong underline-offset-4">
            {product.title}
          </Link>
        </h3>

        {product.rating != null && (
          <div className="mt-2">
            <Rating value={product.rating} count={product.ratingCount} />
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <span className="nums font-display text-base font-semibold text-ink">
            {money(product.price)}
          </span>

          {/* Not .btn-secondary — this one firms up from outline to solid on
              card hover, and the shared class's own :hover rule would win. */}
          <button
            type="button"
            onClick={handleAdd}
            // py-2.5 on small screens takes the tap target to ~36px; hover
            // isn't available there, so this button is the only way to add.
            className="inline-flex shrink-0 items-center rounded-md border border-line-strong px-3.5 py-2.5 font-display text-[13px] font-medium leading-none text-ink transition-colors duration-200 hover:border-transparent hover:bg-solid hover:text-on-solid group-hover:border-transparent group-hover:bg-solid group-hover:text-on-solid sm:py-2"
          >
            {qty > 0 ? `In cart · ${qty}` : "Add"}
            <span className="sr-only"> {product.title} to cart</span>
          </button>
        </div>
      </div>
    </article>
  );
}
