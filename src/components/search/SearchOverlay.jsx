import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  categoryChanged,
  departmentChanged,
  queryChanged,
  searchProducts,
  selectAllProducts,
  selectMenu,
  selectProductsStatus,
} from "../../features/products/productsSlice";
import { load, save } from "../../app/storage";
import { money } from "../../utils/format";
import { useOverlay } from "../../hooks/useOverlay";
import { CloseIcon, SearchIcon } from "../Icons";

const RECENTS_KEY = "novakart_recent_searches";
const MAX_RECENTS = 6;

/**
 * Search runs entirely over the catalogue already in the store — there's no
 * search endpoint behind this API, so pretending to hit one would just be a
 * spinner over a filter. Matching is on title, brand, category and tags.
 *
 * Recent searches are kept on the device, the same as the cart. Nothing is
 * sent anywhere.
 */
export default function SearchOverlay({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(selectAllProducts);
  const menu = useSelector(selectMenu);
  const status = useSelector(selectProductsStatus);

  // Mounted only while open, so the draft starts empty every time without an
  // effect to clear it — a stale query from ten minutes ago is a bad start.
  const [draft, setDraft] = useState("");
  const [recents, setRecents] = useState(() => load(RECENTS_KEY, []));

  const panelRef = useOverlay(onClose);

  const all = useMemo(() => searchProducts(products, draft), [products, draft]);
  const results = all.slice(0, 6);

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
    dispatch(categoryChanged("all"));
    dispatch(queryChanged(draft.trim()));
    navigate("/products");
    onClose();
  }

  function pickDepartment(id) {
    dispatch(queryChanged(""));
    dispatch(departmentChanged(id));
    navigate("/products");
    onClose();
  }

  const typing = draft.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop is a plain div, not a button: the panel traps focus and
          Escape closes, so it doesn't need to be in the tab order. */}
      <div
        className="fade-in absolute inset-0 bg-[#201e1d]/50"
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
        <div className="shell py-6 sm:py-7">
          <form onSubmit={submit} className="flex items-center gap-4">
            <SearchIcon width={22} height={22} className="shrink-0 text-red" />

            <input
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Search products, brands, categories"
              aria-label="Search products"
              autoComplete="off"
              className="min-w-0 flex-1 border-0 bg-transparent py-2 font-display text-lg font-medium text-ink outline-none placeholder:font-normal placeholder:text-faint sm:text-2xl"
            />

            {typing && (
              <button
                type="button"
                onClick={() => setDraft("")}
                className="shrink-0 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
              >
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-sm p-2 text-muted transition-colors hover:text-ink"
              aria-label="Close search"
            >
              <CloseIcon width={21} height={21} />
            </button>
          </form>
        </div>

        <div className="border-t border-line">
          <div className="shell py-8 sm:py-10">
            {!typing && (
              <div className="grid gap-10 sm:grid-cols-2">
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
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {recents.map((term) => (
                        <li key={term}>
                          <button
                            type="button"
                            onClick={() => setDraft(term)}
                            className="rounded-sm border border-line px-3.5 py-2 text-sm text-muted transition-colors hover:border-ink hover:text-ink"
                          >
                            {term}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <p className="eyebrow">Browse departments</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {menu.map((dept) => (
                      <li key={dept.id}>
                        <button
                          type="button"
                          onClick={() => pickDepartment(dept.id)}
                          className="rounded-sm border border-line px-3.5 py-2 text-sm text-muted transition-colors hover:border-ink hover:text-ink"
                        >
                          {dept.label}
                          <span className="nums ml-2 text-xs text-faint">{dept.count}</span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  {status !== "succeeded" && menu.length === 0 && (
                    <p className="mt-5 text-sm text-faint">
                      Departments appear once the catalogue loads.
                    </p>
                  )}
                </div>
              </div>
            )}

            {typing && results.length === 0 && (
              <div className="py-10 text-center">
                <p className="t-sub text-ink">No products match that search.</p>
                <p className="t-lead measure mx-auto mt-4">
                  Try a shorter term, or browse the full catalogue.
                </p>
                <Link to="/products" onClick={onClose} className="btn btn-secondary mt-8">
                  View everything
                </Link>
              </div>
            )}

            {typing && results.length > 0 && (
              <div>
                <p className="eyebrow">
                  {all.length} {all.length === 1 ? "match" : "matches"}
                </p>

                <ul className="mt-5">
                  {results.map((product) => (
                    <li key={product.id}>
                      <Link
                        to={`/product/${product.id}`}
                        onClick={() => {
                          remember(draft);
                          onClose();
                        }}
                        className="group flex items-center gap-4 border-b border-line py-3.5 transition-colors hover:bg-surface-2"
                      >
                        <span className="media-plate flex h-16 w-16 shrink-0 items-center justify-center rounded-sm p-2">
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
                            {product.brand ?? product.categoryLabel}
                          </span>
                        </span>

                        <span className="nums shrink-0 font-display text-sm font-bold text-ink">
                          {money(product.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {all.length > results.length && (
                  <button type="button" onClick={submit} className="link-arrow mt-8">
                    See all {all.length} results
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
