import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductGrid from "../components/product/ProductGrid";
import { ProductGridSkeleton } from "../components/ui/Skeleton";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import FilterControls from "../components/shop/FilterControls";
import FilterDrawer from "../components/shop/FilterDrawer";
import SortSelect from "../components/shop/SortSelect";
import { CloseIcon, SearchIcon, SlidersIcon } from "../components/Icons";
import { useCatalogue } from "../hooks/useCatalogue";
import { DEPARTMENTS } from "../features/products/taxonomy";
import {
  PRICE_BANDS,
  categoryChanged,
  departmentChanged,
  filtersCleared,
  inStockOnlyToggled,
  priceBandChanged,
  queryChanged,
  selectAllProducts,
  selectCategory,
  selectDepartment,
  selectFiltersActive,
  selectInStockOnly,
  selectPriceBand,
  selectQuery,
  selectVisibleProducts,
} from "../features/products/productsSlice";
import { categoryLabel } from "../utils/format";

const PAGE_SIZE = 24;

/**
 * The collection page.
 *
 * Filters live in the store rather than the URL, which is what lets the nav
 * flyout, the footer and the search overlay all drop someone here with a
 * category, department or query already applied.
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
  const department = useSelector(selectDepartment);
  const query = useSelector(selectQuery);
  const priceBand = useSelector(selectPriceBand);
  const inStockOnly = useSelector(selectInStockOnly);
  const filtersActive = useSelector(selectFiltersActive);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // The catalogue is ~200 products. Mounting every card up front means several
  // hundred <img> elements and a very heavy DOM for a page most people filter
  // within seconds, so the grid pages in instead.
  const [shown, setShown] = useState(PAGE_SIZE);

  // Reset the page size whenever the result set changes, adjusting state
  // during render rather than in an effect — an effect here would render one
  // frame of the old page length against the new results, and this project's
  // lint config (correctly) rejects setState in an effect body.
  const signature = `${category}|${department}|${query}|${priceBand}|${inStockOnly}`;
  const [lastSignature, setLastSignature] = useState(signature);
  if (lastSignature !== signature) {
    setLastSignature(signature);
    setShown(PAGE_SIZE);
  }

  const visible = products.slice(0, shown);
  const remaining = products.length - visible.length;

  const searching = query.trim().length > 0;
  const activeDept = department !== "all" ? DEPARTMENTS.find((d) => d.id === department) : null;

  // Priority mirrors how someone actually landed here: a typed search wins
  // over a narrowed department, which wins over a narrowed category.
  let eyebrowText = "The shop";
  let title = "Shop All";
  let subLine = "The full catalogue, in the order we'd show it to you.";

  if (searching) {
    eyebrowText = "Search";
    title = (
      <>
        Results for <span className="font-editorial italic normal-case">“{query}”</span>
      </>
    );
    subLine = "Matching products across the full catalogue.";
  } else if (activeDept) {
    eyebrowText = "Department";
    title = activeDept.label;
    subLine = activeDept.tagline;
  } else if (category !== "all") {
    eyebrowText = "Category";
    title = categoryLabel(category);
    subLine = "Everything on this shelf, nothing padding it out.";
  }

  const priceBandLabel = PRICE_BANDS.find((b) => b.value === priceBand)?.label;

  // Each chip clears exactly the one filter it represents; "Clear all" is the
  // only control that touches every axis at once.
  const chips = [
    searching && {
      key: "query",
      label: `“${query.trim()}”`,
      onRemove: () => dispatch(queryChanged("")),
    },
    activeDept && {
      key: "department",
      label: activeDept.label,
      onRemove: () => dispatch(departmentChanged("all")),
    },
    category !== "all" && {
      key: "category",
      label: categoryLabel(category),
      onRemove: () => dispatch(categoryChanged("all")),
    },
    priceBand !== "any" && {
      key: "price",
      label: priceBandLabel,
      onRemove: () => dispatch(priceBandChanged("any")),
    },
    inStockOnly && {
      key: "stock",
      label: "In stock",
      onRemove: () => dispatch(inStockOnlyToggled(false)),
    },
  ].filter(Boolean);

  return (
    <>
      {/* --- page header --- */}
      <header className="border-b border-line">
        <div className="shell py-12 sm:py-16">
          <p className="eyebrow eyebrow-red flex items-center gap-3">
            <span className="h-px w-8 bg-red" aria-hidden="true" />
            {eyebrowText}
          </p>

          <h1 className="t-section mt-5 max-w-3xl text-ink text-balance">{title}</h1>

          {subLine && <p className="t-lead measure mt-4">{subLine}</p>}

          {/* Bound straight to the store rather than a local draft — there's
              no debounce here, and the filtered grid is cheap to recompute
              on every keystroke via the memoised selector. */}
          <div className="relative mt-8 max-w-md">
            <SearchIcon
              width={17}
              height={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => dispatch(queryChanged(e.target.value))}
              placeholder="Search this collection"
              aria-label="Search products"
              autoComplete="off"
              className="w-full rounded-sm border border-line-strong bg-surface py-3.5 pl-10 pr-10 text-[0.9375rem] text-ink outline-none transition-colors placeholder:text-faint hover:border-ink focus:border-red focus:ring-2 focus:ring-red/20"
            />
            {searching && (
              <button
                type="button"
                onClick={() => dispatch(queryChanged(""))}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-faint transition-colors hover:text-ink"
              >
                <CloseIcon width={14} height={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="shell py-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          {/* --- desktop sidebar --- */}
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-28">
              <div className="flex items-baseline justify-between">
                {/* A real h2 rather than a styled <p>: it's the landmark for
                    this region, and without one the page jumps h1 -> h3 at
                    the first product card. */}
                <h2 className="eyebrow">Filter</h2>
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
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
              <p className="nums text-sm text-muted" aria-live="polite">
                {loading ? (
                  "Loading products…"
                ) : (
                  <>
                    <span className="font-medium text-ink">{products.length}</span>
                    {products.length !== total && (
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
                      className="ml-0.5 h-1.5 w-1.5 rounded-full bg-red"
                      aria-hidden="true"
                    />
                  )}
                </button>

                <SortSelect className="hidden w-56 lg:block" />
              </div>
            </div>

            {chips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-b border-line py-5">
                {chips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onRemove}
                    className="group inline-flex max-w-full items-center gap-2 rounded-sm border border-line-strong bg-surface px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.06em] text-ink transition-colors hover:border-ink"
                  >
                    <span className="truncate">{chip.label}</span>
                    <CloseIcon
                      width={11}
                      height={11}
                      className="shrink-0 text-muted transition-colors group-hover:text-ink"
                    />
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => dispatch(filtersCleared())}
                  className="text-xs text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="mt-10">
              <h2 className="sr-only">Products</h2>

              {loading && <ProductGridSkeleton count={8} />}

              {failed && (
                <ErrorState
                  title="We couldn't load the collection."
                  description="The catalogue request didn't come back. It's usually temporary."
                  detail={error}
                  onRetry={retry}
                />
              )}

              {!loading && !failed && products.length === 0 && (
                <EmptyState
                  // h2, not the default h1 — this page already has one.
                  as="h2"
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
                <>
                  <ProductGrid products={visible} priorityCount={4} />

                  {remaining > 0 && (
                    <div className="mt-16 flex flex-col items-center gap-4">
                      <p className="nums text-xs text-faint">
                        Showing {visible.length} of {products.length}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShown((n) => n + PAGE_SIZE)}
                        className="btn btn-secondary btn-lg"
                      >
                        Load {Math.min(remaining, PAGE_SIZE)} more
                      </button>
                    </div>
                  )}
                </>
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
