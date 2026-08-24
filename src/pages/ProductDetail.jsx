import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductGallery from "../components/product/ProductGallery";
import ProductGrid from "../components/product/ProductGrid";
import WishlistButton from "../components/product/WishlistButton";
import QuantitySelector from "../components/ui/QuantitySelector";
import Accordion from "../components/ui/Accordion";
import Rating from "../components/ui/Rating";
import SectionHeading from "../components/ui/SectionHeading";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import { ProductDetailSkeleton } from "../components/ui/Skeleton";
import { ShieldIcon, TruckIcon } from "../components/Icons";
import { useCatalogue } from "../hooks/useCatalogue";
import { useToast } from "../context/ToastContext";
import { itemAdded, selectQtyOf } from "../features/cart/cartSlice";
import { selectAllProducts, selectProductById } from "../features/products/productsSlice";
import { FREE_SHIPPING_OVER, SHIPPING_FLAT } from "../features/cart/shipping";
import { categoryLabel, money } from "../utils/format";

/**
 * Product detail.
 *
 * Note what isn't here: no size or colour selector. The catalogue payload has
 * no variants, so a row of swatches would be four buttons that change nothing.
 * Quantity is the only option this product genuinely has, so it's the only one
 * offered.
 */
export default function ProductDetail() {
  const { id } = useParams();

  // Keyed on the id so navigating between products via the "more like this"
  // row remounts the view. That resets the quantity stepper on its own —
  // cheaper and less bug-prone than an effect that reaches in to reset it.
  return <ProductDetailView key={id} id={id} />;
}

function ProductDetailView({ id }) {
  const dispatch = useDispatch();
  const { loading, failed, error, retry } = useCatalogue();
  const { notify } = useToast();

  const product = useSelector(selectProductById(id));
  const allProducts = useSelector(selectAllProducts);
  const inCart = useSelector(selectQtyOf(product?.id));

  const [qty, setQty] = useState(1);

  if (loading) {
    return (
      <div className="shell py-10 sm:py-14">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (failed) {
    return (
      <div className="shell py-16">
        <div className="mx-auto max-w-lg">
          <ErrorState
            title="This product couldn't be loaded."
            description="The catalogue request didn't come back, so there's nothing to show yet."
            detail={error}
            onRetry={retry}
          />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <EmptyState
        eyebrow="Not found"
        title="We don't carry that one."
        description="The product may have been removed from the catalogue, or the link is wrong."
        actionLabel="Browse the shop"
        actionTo="/products"
      />
    );
  }

  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  function addToCart() {
    dispatch(itemAdded({ ...product, qty }));
    notify(
      qty === 1 ? "Added to cart" : `Added ${qty} to cart`,
      "success",
      { label: "View cart", to: "/cart" }
    );
  }

  return (
    <>
      {/* --- breadcrumb --- */}
      <nav aria-label="Breadcrumb" className="border-b border-line">
        <ol className="shell flex items-center gap-2 py-4 text-xs text-muted">
          <li>
            <Link to="/" className="transition-colors hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-faint">
            /
          </li>
          <li>
            <Link to="/products" className="transition-colors hover:text-ink">
              Shop
            </Link>
          </li>
          <li aria-hidden="true" className="text-faint">
            /
          </li>
          <li className="truncate text-ink" aria-current="page">
            {categoryLabel(product.category)}
          </li>
        </ol>
      </nav>

      <div className="shell py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          {/* --- gallery --- */}
          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <ProductGallery images={[product.image]} title={product.title} />
          </div>

          {/* --- buy column --- */}
          <div className="min-w-0 lg:py-4">
            <p className="eyebrow">{categoryLabel(product.category)}</p>

            <h1 className="t-sub mt-4 text-ink text-balance">{product.title}</h1>

            {product.rating != null && (
              <div className="mt-4">
                <Rating value={product.rating} count={product.ratingCount} size={15} />
              </div>
            )}

            <p className="nums mt-6 font-display text-2xl font-semibold text-ink">
              {money(product.price)}
            </p>

            {product.description && (
              <p className="mt-7 max-w-prose text-[15px] leading-relaxed text-muted">
                {product.description}
              </p>
            )}

            {/* --- buy controls --- */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <QuantitySelector
                value={qty}
                onIncrease={() => setQty((q) => q + 1)}
                onDecrease={() => setQty((q) => Math.max(1, q - 1))}
                label={product.title}
              />

              <button
                type="button"
                onClick={addToCart}
                className="btn btn-primary btn-lg min-w-[12rem] flex-1"
              >
                Add to cart
              </button>

              <WishlistButton
                productId={product.id}
                title={product.title}
                size="lg"
                className="shrink-0"
              />
            </div>

            {inCart > 0 && (
              <p className="nums mt-4 text-sm text-muted">
                {inCart} already in your{" "}
                <Link
                  to="/cart"
                  className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
                >
                  cart
                </Link>
                .
              </p>
            )}

            {/* --- reassurance, all of it true of this build --- */}
            <ul className="mt-9 space-y-3 border-t border-line pt-7 text-sm text-muted">
              <li className="flex items-start gap-3">
                <TruckIcon width={17} height={17} className="mt-0.5 shrink-0 text-faint" />
                <span>
                  Free shipping over{" "}
                  <span className="nums text-ink">{money(FREE_SHIPPING_OVER)}</span> —{" "}
                  <span className="nums">{money(SHIPPING_FLAT)}</span> flat below that.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldIcon width={17} height={17} className="mt-0.5 shrink-0 text-faint" />
                <span>Your cart stays on this device. Nothing is sent anywhere.</span>
              </li>
            </ul>

            <div className="mt-10">
              <Accordion
                items={[
                  {
                    title: "Details",
                    content: (
                      <p>
                        {product.description ||
                          "No description was supplied for this product."}
                      </p>
                    ),
                  },
                  {
                    title: "Shipping",
                    content: (
                      <p>
                        Orders over {money(FREE_SHIPPING_OVER)} ship free. Below
                        that a flat {money(SHIPPING_FLAT)} is added at checkout.
                        The cart shows exactly where an order stands before you
                        get there.
                      </p>
                    ),
                  },
                  {
                    title: "About this listing",
                    content: (
                      <p>
                        NovaKart is a portfolio build. The catalogue comes from
                        the public Fake Store API, so this listing's title,
                        price, photograph and rating are its data — and no order
                        placed here is ever fulfilled.{" "}
                        <Link
                          to="/help#about"
                          className="text-ink underline decoration-line-strong underline-offset-4"
                        >
                          More on how this works
                        </Link>
                        .
                      </p>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="band border-t border-line" aria-labelledby="related-heading">
          <div className="shell">
            <SectionHeading
              id="related-heading"
              eyebrow="More like this"
              title={`Also in ${categoryLabel(product.category).toLowerCase()}`}
              action="View the category"
              actionTo="/products"
            />
            <div className="mt-12">
              <ProductGrid products={related} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
