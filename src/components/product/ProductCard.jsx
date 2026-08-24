import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../context/ToastContext";
import { itemAdded, selectQtyOf } from "../../features/cart/cartSlice";
import { money } from "../../utils/format";
import ProductMedia from "./ProductMedia";
import WishlistButton from "./WishlistButton";
import Rating from "../ui/Rating";
import { PlusIcon } from "../Icons";

/**
 * Image-first, border-free.
 *
 * The cards are separated by whitespace and the plate behind each photograph,
 * not by outlines and drop shadows — that's most of what stops a grid reading
 * as a dashboard.
 *
 * Hover does four quiet things over ~400ms: the photo crossfades to the second
 * shot, both scale a hair, Quick Add rises from the bottom of the plate, and
 * the save button lifts out. Nothing changes position, so the pointer never
 * loses its target mid-hover.
 */
export default function ProductCard({ product, priority = false, className = "" }) {
  const dispatch = useDispatch();
  const { notify } = useToast();
  const qty = useSelector(selectQtyOf(product.id));

  const soldOut = !product.inStock;

  function handleAdd() {
    if (soldOut) return;
    dispatch(itemAdded(product));
    notify("Added to cart", "success", { label: "View cart", to: "/cart" });
  }

  return (
    <article className={`group relative flex flex-col ${className}`}>
      <div className="relative">
        {/* The photo is a second route into the same page. Hidden from
            assistive tech and skipped in the tab order so keyboard users get
            one stop per card, on the title, rather than two. */}
        <Link
          to={`/product/${product.id}`}
          className="block"
          tabIndex={-1}
          aria-hidden="true"
        >
          <ProductMedia
            src={product.image}
            hoverSrc={product.hoverImage}
            alt={product.title}
            priority={priority}
            pad="p-5 sm:p-7"
            className={soldOut ? "opacity-60" : ""}
          />
        </Link>

        {/* --- badges --- */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {soldOut && (
            <span className="bg-ink px-2 py-1 font-display text-[9px] font-bold uppercase tracking-[0.16em] text-bg">
              Sold out
            </span>
          )}
          {!soldOut && product.discountPercent != null && (
            <span className="bg-red-solid px-2 py-1 font-display text-[9px] font-bold uppercase tracking-[0.16em] text-white">
              −{product.discountPercent}%
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3">
          <WishlistButton productId={product.id} title={product.title} />
        </div>

        {/* --- quick add, rises on hover; hidden from AT because the visible
                Add button below is the accessible control --- */}
        {!soldOut && (
          <div
            className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-3 opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 lg:block"
            aria-hidden="true"
          >
            <button
              type="button"
              tabIndex={-1}
              onClick={handleAdd}
              className="flex w-full items-center justify-center gap-2 bg-ink py-3 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-bg transition-colors hover:bg-red-solid hover:text-white"
            >
              <PlusIcon width={13} height={13} />
              Quick add
            </button>
          </div>
        )}
      </div>

      {/* --- meta --- */}
      <div className="flex flex-1 flex-col pt-4">
        <p className="eyebrow truncate">
          {product.brand ?? product.categoryLabel}
        </p>

        <h3 className="t-product mt-2 text-ink">
          <Link
            to={`/product/${product.id}`}
            className="line-clamp-2 decoration-line-strong underline-offset-4 hover:underline"
          >
            {product.title}
          </Link>
        </h3>

        {product.rating != null && (
          <div className="mt-2">
            <Rating value={product.rating} />
          </div>
        )}

        {/* flex-wrap, not a fixed row: in a two-column grid on a 360px phone
            the column is ~150px, and a four-figure price next to a shrink-0
            button overflowed the card. Wrapping drops the button to its own
            line instead. */}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-2.5 pt-3.5">
          <p className="flex min-w-0 items-baseline gap-2">
            <span className="nums font-display text-[15px] font-bold text-ink">
              {money(product.price)}
            </span>
            {product.listPrice != null && (
              <span className="nums text-xs text-faint line-through">
                {money(product.listPrice)}
              </span>
            )}
          </p>

          {soldOut ? (
            <span className="font-display text-[11px] font-semibold uppercase tracking-[0.1em] text-faint">
              Unavailable
            </span>
          ) : (
            /* Not .btn-secondary — this firms up from outline to solid on card
               hover, and the shared class's own :hover rule would win. */
            <button
              type="button"
              onClick={handleAdd}
              className="shrink-0 rounded-sm border border-line-strong px-3.5 py-2.5 font-display text-[11px] font-bold uppercase leading-none tracking-[0.12em] text-ink transition-colors duration-200 hover:border-red hover:bg-red-solid hover:text-white lg:py-2"
            >
              {qty > 0 ? `In cart ${qty}` : "Add"}
              <span className="sr-only"> {product.title} to cart</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
