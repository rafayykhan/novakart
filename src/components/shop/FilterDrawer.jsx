import { useDispatch } from "react-redux";
import { filtersCleared } from "../../features/products/productsSlice";
import { useOverlay } from "../../hooks/useOverlay";
import { CloseIcon } from "../Icons";
import FilterControls from "./FilterControls";
import SortSelect from "./SortSelect";

/**
 * Mobile filter sheet — rises from the bottom, where thumbs are.
 *
 * Filters apply live as they're tapped rather than on an "Apply" press, so
 * the result count in the footer updates while the sheet is open and the
 * button closes rather than commits. Nothing is lost if it's dismissed with
 * Escape or the backdrop, which is why there's no "Cancel".
 */
export default function FilterDrawer({ onClose, resultCount }) {
  const dispatch = useDispatch();
  const panelRef = useOverlay(onClose);

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="fade-in absolute inset-0 bg-black/45"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-drawer-title"
        tabIndex={-1}
        className="slide-up absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-xl border-t border-line bg-bg outline-none"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4">
          <h2 id="filter-drawer-title" className="font-display text-base font-semibold text-ink">
            Filter &amp; sort
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="-mr-2 rounded-md p-2 text-muted transition-colors hover:text-ink"
            aria-label="Close filters"
          >
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="mb-10">
            <p className="eyebrow mb-4">Sort</p>
            <SortSelect />
          </div>

          <FilterControls />
        </div>

        {/* pb accounts for the home indicator on gesture-nav phones */}
        <div className="shrink-0 border-t border-line px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => dispatch(filtersCleared())}
              className="btn btn-secondary flex-1"
            >
              Clear all
            </button>

            <button type="button" onClick={onClose} className="btn btn-primary flex-[2]">
              Show {resultCount} {resultCount === 1 ? "product" : "products"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
