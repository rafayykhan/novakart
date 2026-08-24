import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  queryChanged,
  searchProducts,
  selectAllProducts,
  selectCategories,
  selectProductsStatus,
  categoryChanged,
} from "../../features/products/productsSlice";
import { load, save } from "../../app/storage";
import { categoryLabel, money } from "../../utils/format";
import { useOverlay } from "../../hooks/useOverlay";
import { CloseIcon, SearchIcon } from "../Icons";

const RECENTS_KEY = "novakart_recent_searches";
const MAX_RECENTS = 5;

/**
 * Search runs entirely over the catalogue that's already in the store — there
 * is no search endpoint behind this API, so pretending to hit one would just
 * be a spinner over a filter. Matching is on title and category.
 *
 * Recent searches are kept on the device, the same as the cart. Nothing is
 * sent anywhere.
 */
export default function SearchOverlay({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(selectAllProducts);
  const categories = useSelector(selectCategories);
  const status = useSelector(selectProductsStatus);

  // Mounted only while open, so the draft starts empty on every open without
  // an effect to clear it — a stale query from ten minutes ago isn't a useful
  // starting point.
  const [draft, setDraft] = useState("");
  const [recents, setRecents] = useState(() => load(RECENTS_KEY, []));

  const panelRef = useOverlay(onClose);

  const results = useMemo(
    () => searchProducts(products, draft).slice(0, 6),
    [products, draft]
  );

  const totalMatches = useMemo(
    () => searchProducts(products, draft).length,
    [products, draft]
  );

  function remember(term) {
    const trimmed = term.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recents.filter((r) => r !== trimmed)].slice(0, MAX_RECENTS);
    setRecents(next);
    save(RECENTS_KEY, next);
  }

  function submit(event) {
    event.preventDefault();
    if (!draft.trim()) return;
    remember(draft);
    dispatch(queryChanged(draft.trim()));
    dispatch(categoryChanged("all"));
    navigate("/products");
    onClose();
  }

  function pickCategory(category) {
    dispatch(queryChanged(""));
    dispatch(categoryChanged(category));
    navigate("/products");
    onClose();
  }

  const typing = draft.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop is a plain div, not a button: the panel traps focus and
          Escape closes, so it doesn't need to be in the tab order. */}
      <div
        className="fade-in absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        tabIndex={-1}
        className="slide-down absolute inset-x-0 top-0 max-h-[100dvh] overflow-y-auto border-b border-line bg-bg outline-none"
      >
        <div className="shell py-5 sm:py-6">
          <form onSubmit={submit} className="flex items-center gap-3 sm:gap-4">
            <SearchIcon width={20} height={20} className="shrink-0 text-faint" />

            <input
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              autoComplete="off"
              className="min-w-0 flex-1 border-0 bg-transparent py-2 font-display text-lg text-ink outline-none placeholder:text-faint sm:text-2xl"
            />

            {typing && (
              <button
                type="button"
                onClick={() => setDraft("")}
                className="shrink-0 rounded-md px-2 py-1 text-xs text-muted transition-colors hover:text-ink"
              >
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-md p-2 text-muted transition-colors hover:text-ink"
              aria-label="Close search"
            >
              <CloseIcon width={20} height={20} />
            </button>
          </form>
        </div>

        <div className="border-t border-line">
          <div className="shell py-6 sm:py-8">
            {!typing && (
              <div className="grid gap-8 sm:grid-cols-2">
                {recents.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="eyebrow">Recent</p>
                      <button
                        type="button"
                        onClick={() => {
                          setRecents([]);
                          save(RECENTS_KEY, []);
                        }}
                        className="text-xs text-faint transition-colors hover:text-ink"
                      >
                        Clear
                      </button>
                    </div>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {recents.map((term) => (
                        <li key={term}>
                          <button
                            type="button"
                            onClick={() => setDraft(term)}
                            className="rounded-md border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:border-ink hover:text-ink"
                          >
                            {term}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <p className="eyebrow">Browse by category</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {categories
                      .filter((c) => c !== "all")
                      .map((category) => (
                        <li key={category}>
                          <button
                            type="button"
                            onClick={() => pickCategory(category)}
                            className="rounded-md border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:border-ink hover:text-ink"
                          >
                            {categoryLabel(category)}
                          </button>
                        </li>
                      ))}
                  </ul>

                  {status !== "succeeded" && categories.length <= 1 && (
                    <p className="mt-4 text-sm text-faint">
                      Categories appear once the catalogue loads.
                    </p>
                  )}
                </div>
              </div>
            )}

            {typing && results.length === 0 && (
              <div className="py-8 text-center">
                <p className="t-sub text-ink">No products match that search.</p>
                <p className="t-lead measure mx-auto mt-3">
                  Try a shorter term, or browse the full catalogue.
                </p>
                <Link to="/products" onClick={onClose} className="btn btn-secondary mt-6">
                  View everything
                </Link>
              </div>
            )}

            {typing && results.length > 0 && (
              <div>
                <p className="eyebrow">
                  {totalMatches} {totalMatches === 1 ? "match" : "matches"}
                </p>

                <ul className="mt-4">
                  {results.map((product) => (
                    <li key={product.id}>
                      <Link
                        to={`/product/${product.id}`}
                        onClick={() => {
                          remember(draft);
                          onClose();
                        }}
                        className="flex items-center gap-4 border-b border-line py-3 transition-colors hover:bg-surface-2"
                      >
                        <span className="media-plate flex h-14 w-14 shrink-0 items-center justify-center rounded-md p-2">
                          <img
                            src={product.image}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-contain"
                          />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-ink">
                            {product.title}
                          </span>
                          <span className="block text-xs text-faint">
                            {categoryLabel(product.category)}
                          </span>
                        </span>

                        <span className="nums shrink-0 font-display text-sm font-medium text-ink">
                          {money(product.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {totalMatches > results.length && (
                  <button type="button" onClick={submit} className="link-arrow mt-6">
                    See all {totalMatches} results
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
