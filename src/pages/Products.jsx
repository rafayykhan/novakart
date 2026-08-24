import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductGrid from "../components/product/ProductGrid";
import { ProductGridSkeleton } from "../components/ui/Skeleton";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import FilterControls from "../components/shop/FilterControls";
import FilterDrawer from "../components/shop/FilterDrawer";
import SortSelect from "../components/shop/SortSelect";
import { CloseIcon, SlidersIcon } from "../components/Icons";
import { useCatalogue } from "../hooks/useCatalogue";
import {
  filtersCleared,
  queryChanged,
  selectAllProducts,
  selectCategory,
  selectFiltersActive,
  selectQuery,
  selectVisibleProducts,
} from "../features/products/productsSlice";
import { categoryLabel } from "../utils/format";

/**
 * The collection page.
 *
 * Filters live in the store rather than the URL, which is what lets the nav
 * flyout, the footer and the search overlay all drop someone here with a
 * category or query already applied.
 *
 * Desktop gets a persistent sidebar, mobile gets a bottom sheet — same
 * controls, same state, rendered once in FilterControls.
 */
export default function Products() {
  const dispatch = useDispatch();
  const { loading, failed, error, retry } = useCatalogue();

  const products = useSelector(selectVisibleProducts);
  const total = useSelector(selectAllProducts).length;
  const category = useSelector(selectCategory);
  const query = useSelector(selectQuery);
  const filtersActive = useSelector(selectFiltersActive);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const searching = query.trim().length > 0;

  return (
    <>
      {/* --- page header --- */}
      <header className="border-b border-line">
        <div className="shell py-12 sm:py-16">
          <p className="eyebrow">{searching ? "Search" : "The shop"}</p>

          <h1 className="t-section mt-4 max-w-2xl text-ink text-balance">
            {searching ? (
              <>
                Results for{" "}
                <span className="font-serif font-normal italic">“{query}”</span>
              </>
            ) : category === "all" ? (
              "Everything we carry"
            ) : (
              categoryLabel(category)
            )}
          </h1>

          {!searching && (
            <p className="t-lead measure mt-4">
              {category === "all"
                ? "The full catalogue, in the order we'd show it to you."
                : "Everything on this shelf, nothing padding it out."}
            </p>
          )}

          {searching && (
            <button
              type="button"
              onClick={() => dispatch(queryChanged(""))}
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:border-ink hover:text-ink"
            >
              Clear search
              <CloseIcon width={13} height={13} />
            </button>
          )}
        </div>
      </header>

      <div className="shell py-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          {/* --- desktop sidebar --- */}
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-28">
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-sm font-semibold text-ink">Filter</h2>
                {filtersActive && (
                  <button
                    type="button"
                    onClick={() => dispatch(filtersCleared())}
                    className="text-xs text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="mt-8">
                <FilterControls />
              </div>
            </div>
          </aside>

          {/* --- results --- */}
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
              <p className="nums text-sm text-muted" aria-live="polite">
                {loading ? (
                  "Loading products…"
                ) : (
                  <>
                    <span className="text-ink">{products.length}</span>
                    {products.length !== total && !loading && (
                      <span className="text-faint"> of {total}</span>
                    )}{" "}
                    {products.length === 1 ? "product" : "products"}
                  </>
                )}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="btn btn-secondary btn-sm lg:hidden"
                >
                  <SlidersIcon width={15} height={15} />
                  Filter
                  {filtersActive && (
                    <span
                      className="ml-0.5 h-1.5 w-1.5 rounded-full bg-accent"
                      aria-label="filters applied"
                    />
                  )}
                </button>

                <SortSelect className="hidden w-52 lg:block" />
              </div>
            </div>

            <div className="mt-10">
              {loading && <ProductGridSkeleton count={8} />}

              {failed && (
                <ErrorState
                  title="Products couldn't be loaded right now."
                  description="The catalogue request didn't come back. It's usually temporary."
                  detail={error}
                  onRetry={retry}
                />
              )}

              {!loading && !failed && products.length === 0 && (
                <EmptyState
                  eyebrow="No matches"
                  title={
                    searching ? "No products match that search." : "Nothing here yet."
                  }
                  description={
                    searching
                      ? "Try a shorter term, or clear the filters and browse the whole catalogue."
                      : "This combination of filters doesn't have anything in it."
                  }
                  actionLabel="Clear filters"
                  onAction={() => dispatch(filtersCleared())}
                />
              )}

              {!loading && !failed && products.length > 0 && (
                <ProductGrid products={products} priorityCount={4} />
              )}
            </div>
          </div>
        </div>
      </div>

      {drawerOpen && (
        <FilterDrawer onClose={closeDrawer} resultCount={products.length} />
      )}
    </>
  );
}
