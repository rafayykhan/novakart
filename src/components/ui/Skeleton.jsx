/**
 * Skeletons, not spinners. Each one mirrors the real component's box model so
 * the page doesn't reflow the moment data lands.
 */

const Bar = ({ className = "" }) => (
  <div className={`rounded-sm bg-surface-2 ${className}`} />
);

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Same 4:5 plate the real card uses, then a bar per row of it —
          eyebrow, two title lines, rating, price/button. Measured against a
          loaded card so the grid barely moves when the catalogue arrives; a
          skeleton that's short is just a slower shift. */}
      <div className="aspect-[4/5] w-full rounded-lg bg-surface-2" />
      <Bar className="mt-4 h-2.5 w-1/3" />
      <Bar className="mt-3.5 h-3.5 w-5/6" />
      <Bar className="mt-2 h-3.5 w-1/2" />
      <Bar className="mt-3 h-3 w-20" />
      <div className="mt-3.5 flex items-center justify-between">
        <Bar className="h-4 w-16" />
        <Bar className="h-9 w-16" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div
      className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid animate-pulse gap-10 lg:grid-cols-2 lg:gap-16" aria-hidden="true">
      <div className="aspect-square w-full rounded-lg bg-surface-2" />
      <div className="lg:py-6">
        <Bar className="h-2.5 w-24" />
        <Bar className="mt-6 h-9 w-4/5" />
        <Bar className="mt-3 h-9 w-3/5" />
        <Bar className="mt-8 h-6 w-28" />
        <Bar className="mt-10 h-3 w-full" />
        <Bar className="mt-2.5 h-3 w-full" />
        <Bar className="mt-2.5 h-3 w-2/3" />
        <Bar className="mt-10 h-14 w-full" />
      </div>
    </div>
  );
}

export function ListRowSkeleton({ count = 3 }) {
  return (
    <div className="animate-pulse" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-line py-6">
          <div className="h-24 w-24 shrink-0 rounded-lg bg-surface-2" />
          <div className="min-w-0 flex-1">
            <Bar className="h-3 w-3/5" />
            <Bar className="mt-2.5 h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
