import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductGallery from "../components/product/ProductGallery";
import ProductCarousel from "../components/product/ProductCarousel";
import ProductReviews from "../components/product/ProductReviews";
import WishlistButton from "../components/product/WishlistButton";
import QuantitySelector from "../components/ui/QuantitySelector";
import Accordion from "../components/ui/Accordion";
import Rating from "../components/ui/Rating";
import SectionHeading from "../components/ui/SectionHeading";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import { ProductDetailSkeleton } from "../components/ui/Skeleton";
import { ArrowLeftIcon, ShieldIcon, TruckIcon } from "../components/Icons";
import { useCatalogue } from "../hooks/useCatalogue";
import { useToast } from "../context/ToastContext";
import { getProduct } from "../api/shopApi";
import { itemAdded, selectQtyOf } from "../features/cart/cartSlice";
import { selectAllProducts, selectProductById } from "../features/products/productsSlice";
import { FREE_SHIPPING_OVER, SHIPPING_FLAT } from "../features/cart/shipping";
import { excerpt, money } from "../utils/format";

// Below this the "N left" nudge is honest urgency; above it, it's just noise.
const LOW_STOCK_THRESHOLD = 10;

/**
 * Product detail.
 *
 * Note what isn't here: no size or colour selector. The catalogue payload has
 * no variants, so a row of swatches would be four buttons that change
 * nothing. Quantity is the only option this product genuinely has, so it's
 * the only one offered.
 */
export default function ProductDetail() {
  const { id } = useParams();

  // Keyed on the id so navigating between products via the "more like this"
  // row remounts the view. That resets quantity and the detail-fetch state on
  // its own — cheaper and less bug-prone than effects that reach in to reset
  // them, and it's what keeps the fetch-on-mount effect below lint-clean.
  return <ProductDetailView key={id} id={id} />;
}

function ProductDetailView({ id }) {
  const dispatch = useDispatch();
  const { notify } = useToast();
  const catalogue = useCatalogue();

  // The store's list record — present the instant it's been fetched once,
  // missing entirely on a fresh deep link. It never carries reviews,
  // shipping, warranty or a sku; `select=` on the list request leaves them
  // out on purpose (see shopApi.js).
  const listProduct = useSelector(selectProductById(id));
  const allProducts = useSelector(selectAllProducts);

  const [qty, setQty] = useState(1);

  // The full record, fetched independently of the catalogue so this page
  // never waits on all ~200 products just to show one. `full` stays null
  // until it resolves; `product` below prefers it but falls back to the list
  // record so there's something to paint immediately when one exists.
  const [full, setFull] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | succeeded | failed
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    getProduct(id)
      .then((record) => {
        if (ignore) return;
        setFull(record);
        setStatus("succeeded");
      })
      .catch((err) => {
        if (ignore) return;
        setStatus("failed");
        setError(err.message);
      });

    return () => {
      ignore = true;
    };
  }, [id, attempt]);

  const product = full ?? listProduct;
  const detailLoading = status === "loading";
  const inCart = useSelector(selectQtyOf(product?.id));

  // Deep link with nothing cached yet: wait for the direct fetch.
  if (!product && detailLoading) {
    return (
      <div className="shell py-10 sm:py-14">
        <ProductDetailSkeleton />
      </div>
    );
  }

  // Deep link, direct fetch settled, and there's still nothing to show.
  if (!product && status === "failed") {
    const notFound = /\(404\)/.test(error ?? "");

    if (notFound) {
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

    return (
      <div className="shell py-16">
        <div className="mx-auto max-w-lg">
          <ErrorState
            title="This product couldn't be loaded."
            description="The request didn't come back, so there's nothing to show yet."
            detail={error}
            onRetry={() => {
              setStatus("loading");
              setAttempt((n) => n + 1);
            }}
          />
        </div>
      </div>
    );
  }

  if (!product) {
    // status === "succeeded" but nothing came back — treat it as not found
    // rather than rendering a blank page.
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
    .slice(0, 10);
  const showRelated = catalogue.loading || catalogue.failed || related.length > 0;

  const soldOut = !product.inStock;
  const stock = stockStatus(product);

  function addToCart() {
    dispatch(itemAdded({ ...product, qty }));
    notify(qty === 1 ? "Added to cart" : `Added ${qty} to cart`, "success", {
      label: "View cart",
      to: "/cart",
    });
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
            {product.categoryLabel}
          </li>
        </ol>
      </nav>

      <div className="shell py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          {/* --- gallery --- */}
          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <ProductGallery images={product.images} title={product.title} />
          </div>

          {/* --- buy column --- */}
          <div className="min-w-0 lg:py-4">
            <p className="eyebrow">{product.brand ?? product.categoryLabel}</p>

            <h1 className="t-sub mt-4 text-ink text-balance">{product.title}</h1>

            {product.rating != null && (
              <div className="mt-4">
                <Rating value={product.rating} size={15} />
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <p className="nums font-display text-3xl font-bold text-ink">
                {money(product.price)}
              </p>
              {product.listPrice != null && (
                <>
                  <p className="nums text-base text-faint line-through">
                    {money(product.listPrice)}
                  </p>
                  <span className="bg-red-solid px-2 py-1 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                    −{product.discountPercent}%
                  </span>
                </>
              )}
            </div>

            <p className={`mt-3 text-sm font-medium ${stock.className}`}>{stock.label}</p>

            {product.description && (
              <p className="measure mt-6 text-[15px] leading-relaxed text-muted">
                {excerpt(product.description, 220)}
              </p>
            )}

            {/* --- buy controls --- */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              {!soldOut && (
                <QuantitySelector
                  value={qty}
                  onIncrease={() => setQty((q) => q + 1)}
                  onDecrease={() => setQty((q) => Math.max(1, q - 1))}
                  label={product.title}
                />
              )}

              <button
                type="button"
                onClick={addToCart}
                disabled={soldOut}
                className="btn btn-primary btn-lg min-w-[12rem] flex-1"
              >
                {soldOut ? "Sold out" : "Add to cart"}
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

            {/* --- reassurance, built only from fields this product actually
                has — the shipping/warranty/return lines fill in once the full
                record arrives, rather than being guessed at up front --- */}
            <ul className="mt-9 space-y-3 border-t border-line pt-7 text-sm text-muted">
              <li className="flex items-start gap-3">
                <TruckIcon width={17} height={17} className="mt-0.5 shrink-0 text-faint" />
                <span>
                  Free shipping over{" "}
                  <span className="nums text-ink">{money(FREE_SHIPPING_OVER)}</span> —{" "}
                  <span className="nums">{money(SHIPPING_FLAT)}</span> flat below that.
                  {product.shippingInformation && ` ${product.shippingInformation}.`}
                </span>
              </li>
              {product.warrantyInformation && (
                <li className="flex items-start gap-3">
                  <ShieldIcon width={17} height={17} className="mt-0.5 shrink-0 text-faint" />
                  <span>{product.warrantyInformation}</span>
                </li>
              )}
              {product.returnPolicy && (
                <li className="flex items-start gap-3">
                  <ArrowLeftIcon width={17} height={17} className="mt-0.5 shrink-0 text-faint" />
                  <span>{product.returnPolicy}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* --- product information --- */}
      <section className="border-t border-line" aria-labelledby="product-info-heading">
        <div className="shell band-tight">
          <div className="max-w-3xl">
            <SectionHeading
              as="h2"
              id="product-info-heading"
              eyebrow="The specifics"
              title="Product information"
            />
            <div className="mt-10">
              <Accordion items={buildAccordionItems(product)} />
            </div>
          </div>
        </div>
      </section>

      {/* --- reviews --- */}
      <section className="border-t border-line" aria-labelledby="reviews-heading">
        <div className="shell band-tight">
          <div className="max-w-3xl">
            <ProductReviews reviews={product.reviews} loading={detailLoading} />
          </div>
        </div>
      </section>

      {showRelated && (
        <ProductCarousel
          id="related-products"
          eyebrow="More like this"
          title={`Also in ${product.categoryLabel.toLowerCase()}`}
          action="View the category"
          actionTo="/products"
          products={related}
          loading={catalogue.loading}
          failed={catalogue.failed}
          onRetry={catalogue.retry}
          className="border-t border-line"
        />
      )}
    </>
  );
}

function stockStatus(product) {
  if (!product.inStock) {
    return { label: "Sold out", className: "text-danger" };
  }
  if (product.stock != null && product.stock <= LOW_STOCK_THRESHOLD) {
    return { label: `Only ${product.stock} left`, className: "text-warning" };
  }
  return { label: product.availability ?? "In stock", className: "text-success" };
}

function buildAccordionItems(product) {
  const items = [
    {
      title: "Details",
      content: (
        <div className="space-y-4">
          <p>{product.description || "No description was supplied for this product."}</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
            {product.brand && (
              <>
                <dt className="text-faint">Brand</dt>
                <dd className="text-ink">{product.brand}</dd>
              </>
            )}
            <dt className="text-faint">Category</dt>
            <dd className="text-ink">{product.categoryLabel}</dd>
            {product.tags.length > 0 && (
              <>
                <dt className="text-faint">Tags</dt>
                <dd className="text-ink">{product.tags.join(", ")}</dd>
              </>
            )}
          </dl>
        </div>
      ),
    },
    {
      title: "Shipping & Returns",
      content: (
        <div className="space-y-2">
          <p>
            Orders over {money(FREE_SHIPPING_OVER)} ship free. Below that a flat{" "}
            {money(SHIPPING_FLAT)} is added at checkout — the cart shows exactly where an
            order stands before you get there.
          </p>
          {product.shippingInformation && <p>{product.shippingInformation}.</p>}
          {product.returnPolicy && <p>{product.returnPolicy}.</p>}
        </div>
      ),
    },
  ];

  const specRows = [
    product.sku && ["SKU", product.sku],
    ["Availability", product.availability ?? (product.inStock ? "In stock" : "Sold out")],
    product.minimumOrderQuantity && ["Minimum order", `${product.minimumOrderQuantity} unit(s)`],
    product.warrantyInformation && ["Warranty", product.warrantyInformation],
  ].filter(Boolean);

  items.push({
    title: "Specifications",
    // Availability is on every record, list or full, so this is never empty
    // — sku/warranty/minimum order just fill in once the full record lands.
    content: (
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
        {specRows.map(([label, value]) => (
          <Fragment key={label}>
            <dt className="text-faint">{label}</dt>
            <dd className="text-ink">{value}</dd>
          </Fragment>
        ))}
      </dl>
    ),
  });

  return items;
}
