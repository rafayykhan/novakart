import { useEffect, useRef } from "react";
import { money } from "../../utils/format";

/**
 * Category mega-menu.
 *
 * Twenty-four flat slugs from the API grouped into six departments (see
 * taxonomy.js), laid out as columns with a real product standing in as the
 * panel's artwork. Counts are live — a department with nothing in it never
 * renders.
 *
 * Keyboard: Escape closes, Tab out of the last item closes, and the trigger
 * keeps aria-expanded in sync. Hover opens it on pointer devices; click works
 * everywhere.
 */
export default function MegaMenu({ menu, feature, onPick, onClose, panelRef }) {
  const localRef = useRef(null);
  const ref = panelRef ?? localRef;

  // Close when focus leaves the panel entirely — covers tabbing past the last
  // link without trapping focus, which would be wrong for a menu.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    function onFocusOut(event) {
      if (!node.contains(event.relatedTarget)) onClose();
    }
    node.addEventListener("focusout", onFocusOut);
    return () => node.removeEventListener("focusout", onFocusOut);
  }, [ref, onClose]);

  return (
    <div
      ref={ref}
      className="slide-down absolute inset-x-0 top-full z-40 border-t border-line bg-surface shadow-[var(--shadow-md)]"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="shell py-10 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <div>
            <p className="eyebrow">Shop by category</p>

            <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3">
              {menu.map((dept) => (
                <div key={dept.id}>
                  <button
                    type="button"
                    onClick={() => onPick({ department: dept.id })}
                    className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:text-red"
                  >
                    {dept.label}
                  </button>

                  <ul className="mt-4 space-y-2.5">
                    {dept.categories.map((cat) => (
                      <li key={cat.slug}>
                        <button
                          type="button"
                          onClick={() => onPick({ category: cat.slug })}
                          className="group flex items-baseline gap-2 text-left text-[13px] text-muted transition-colors hover:text-ink"
                        >
                          <span className="border-b border-transparent transition-colors group-hover:border-ink">
                            {cat.label}
                          </span>
                          <span className="nums text-[11px] text-faint">
                            {cat.count}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Panel artwork — a real product, linked, not a decorative photo. */}
          {feature && (
            <div className="hidden lg:block">
              <button
                type="button"
                onClick={() => onPick({ productId: feature.id })}
                className="group block w-full text-left"
              >
                <span className="media-plate block aspect-[4/5] w-full rounded-lg">
                  <span className="flex h-full w-full items-center justify-center p-10">
                    <img
                      src={feature.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                    />
                  </span>
                </span>

                <span className="mt-5 block">
                  <span className="eyebrow eyebrow-red block">Top rated</span>
                  <span className="mt-2 block font-display text-sm font-semibold text-ink">
                    {feature.title}
                  </span>
                  <span className="nums mt-1 block text-sm text-muted">
                    {money(feature.price)}
                  </span>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
