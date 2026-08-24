import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectAllProducts,
  selectProductsStatus,
} from "../../features/products/productsSlice";
import { categoryLabel, money } from "../../utils/format";

/**
 * Asymmetric, not centred, and not a gradient banner.
 *
 * The right-hand composition is built from three real products out of the
 * catalogue — offset, different sizes, overlapping their plates. There's no
 * lifestyle photography in this project and inventing some would mean
 * shipping stock images of a shop that doesn't exist, so the products do the
 * work instead.
 *
 * While the catalogue is loading the plates render empty at the same sizes,
 * so the hero never reflows underneath the headline.
 */
export default function Hero() {
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);

  // Three visually distinct picks, spaced through the list rather than the
  // first three (which are all from one category).
  const showcase = [products[0], products[9], products[5]].filter(Boolean);
  const loading = status === "loading" || showcase.length < 3;

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="shell">
        <div className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:py-28">
          {/* --- copy --- */}
          <div className="max-w-xl">
            <p className="eyebrow">The NovaKart edit</p>

            <h1 className="t-hero mt-6 text-ink">
              Better things.
              <br />
              <span className="font-serif font-normal italic tracking-[-0.01em]">
                Chosen
              </span>{" "}
              well.
            </h1>

            <p className="t-lead measure mt-7">
              A short catalogue of things worth making room for — shown properly,
              priced plainly, and never buried under six banners.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop the collection
              </Link>
              <Link to="/#categories" className="btn btn-secondary btn-lg">
                Explore categories
              </Link>
            </div>

            {/* One honest line of context, sourced from the loaded catalogue. */}
            {status === "succeeded" && (
              <p className="mt-10 flex items-center gap-3 text-xs text-faint">
                <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
                {products.length} products across{" "}
                {new Set(products.map((p) => p.category)).size} categories
              </p>
            )}
          </div>

          {/* --- composition --- */}
          <div className="relative" aria-hidden={loading ? "true" : undefined}>
            {/* Explicit heights at every breakpoint — the tiles are grid
                items with no intrinsic size, so without them the composition
                collapses on phones. The staggered row-starts are what make it
                read as art direction rather than a 2x2. */}
            <div className="grid h-[22rem] grid-cols-5 grid-rows-6 gap-3 sm:h-[30rem] sm:gap-4 lg:h-[34rem]">
              <HeroTile
                product={showcase[0]}
                loading={loading}
                className="col-span-3 col-start-1 row-span-5 row-start-1"
                pad="p-6 sm:p-10 lg:p-14"
                showMeta
              />
              <HeroTile
                product={showcase[1]}
                loading={loading}
                className="col-span-2 col-start-4 row-span-2 row-start-2"
                pad="p-4 sm:p-6"
              />
              <HeroTile
                product={showcase[2]}
                loading={loading}
                className="col-span-2 col-start-4 row-span-3 row-start-4"
                pad="p-4 sm:p-7"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroTile({ product, loading, className = "", pad, showMeta = false }) {
  if (loading || !product) {
    return (
      <div className={`animate-pulse rounded-lg bg-surface-2 ${className}`} />
    );
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className={`group media-plate relative block rounded-lg ${className}`}
    >
      <span className={`flex h-full w-full items-center justify-center ${pad}`}>
        <img
          src={product.image}
          alt={product.title}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.04]"
        />
      </span>

      {showMeta && (
        // Sits on the plate, which is light in both themes, so this text is
        // deliberately dark rather than theme-aware.
        <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-6 sm:bottom-6">
          <span className="min-w-0">
            <span className="block font-display text-[10px] uppercase tracking-[0.2em] text-neutral-600">
              {categoryLabel(product.category)}
            </span>
            <span className="mt-1 block truncate font-display text-sm font-medium text-neutral-900">
              {product.title}
            </span>
          </span>
          <span className="nums shrink-0 font-display text-sm font-semibold text-neutral-900">
            {money(product.price)}
          </span>
        </span>
      )}
    </Link>
  );
}
