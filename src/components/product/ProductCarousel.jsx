import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import SectionHeading from "../ui/SectionHeading";
import { ProductCardSkeleton } from "../ui/Skeleton";
import ErrorState from "../ui/ErrorState";
import { ArrowLeftIcon, ArrowRightIcon } from "../Icons";

/**
 * Horizontal product rail.
 *
 * Native scroll-snap rather than a JS carousel: real momentum and rubber-band
 * on touch, keyboard scrolling for free, and no library. The arrows are a
 * progressive enhancement that just call scrollBy() — remove the JS and the
 * rail is still a perfectly good horizontal scroller.
 *
 * Card widths are set so the next card is partly visible at every breakpoint
 * (~1.3 cards on a phone), which is what tells a thumb there's more to the
 * right without needing a hint arrow.
 *
 * Note what these are called: there's no order history behind this app, so
 * nothing is labelled "Best Sellers". "Top rated" is a claim the data can
 * actually support.
 */
export default function ProductCarousel({
  id,
  eyebrow,
  title,
  description,
  action,
  actionTo,
  onAction,
  products,
  loading,
  failed,
  onRetry,
  className = "",
}) {
  const railRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const syncEdges = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({
      start: el.scrollLeft <= 2,
      // 2px of slack: sub-pixel widths mean scrollLeft rarely hits max exactly.
      end: el.scrollLeft >= max - 2,
    });
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    syncEdges();
    el.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      el.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  }, [syncEdges, products, loading]);

  function scrollBy(direction) {
    const el = railRef.current;
    if (!el) return;
    // One "page" is most of the visible width, so a click never leaves a card
    // half-scrolled off the left edge.
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section id={id} className={`band scroll-mt-24 ${className}`} aria-labelledby={headingId}>
      <div className="shell">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id={headingId}
            eyebrow={eyebrow}
            title={title}
            description={description}
            action={action}
            actionTo={actionTo}
            onAction={onAction}
            className="flex-1"
          />

          {/* Arrows are supplementary — the rail scrolls without them, so they
              are hidden from assistive tech rather than duplicating navigation
              a screen reader already has. */}
          <div className="hidden shrink-0 gap-2 lg:flex" aria-hidden="true">
            <RailButton
              onClick={() => scrollBy(-1)}
              disabled={edges.start}
              label="Previous products"
            >
              <ArrowLeftIcon width={16} height={16} />
            </RailButton>
            <RailButton
              onClick={() => scrollBy(1)}
              disabled={edges.end}
              label="Next products"
            >
              <ArrowRightIcon width={16} height={16} />
            </RailButton>
          </div>
        </div>
      </div>

      <div className="mt-12 lg:mt-14">
        {failed ? (
          <div className="shell">
            <ErrorState
              title="We couldn't load the collection."
              description="The catalogue didn't come back. It's usually worth another go."
              onRetry={onRetry}
            />
          </div>
        ) : (
          <div
            ref={railRef}
            className="rail no-scrollbar px-5 sm:px-8 lg:px-14"
            tabIndex={0}
            role="group"
            aria-label={`${title} — scrollable product list`}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-[72vw] max-w-[19rem] sm:w-[46vw] lg:w-[23rem]">
                    <ProductCardSkeleton />
                  </div>
                ))
              : products.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={i < 2}
                    className="w-[72vw] max-w-[19rem] sm:w-[46vw] lg:w-[23rem]"
                  />
                ))}
          </div>
        )}
      </div>
    </section>
  );
}

function RailButton({ onClick, disabled, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      tabIndex={-1}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-sm border border-line-strong text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg disabled:pointer-events-none disabled:opacity-25"
    >
      {children}
    </button>
  );
}
