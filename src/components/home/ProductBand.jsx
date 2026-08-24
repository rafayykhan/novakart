import SectionHeading from "../ui/SectionHeading";
import ProductGrid from "../product/ProductGrid";
import { ProductGridSkeleton } from "../ui/Skeleton";
import ErrorState from "../ui/ErrorState";

/**
 * A merchandised row of products with an editorial header.
 *
 * Note what these are *called*. There's no order history behind this app, so
 * nothing here is labelled "Best sellers" or "Trending" — those words claim
 * data we don't have. "Featured" and "The selection" claim only that someone
 * chose them, which is true.
 */
export default function ProductBand({
  id,
  eyebrow,
  title,
  description,
  action,
  actionTo,
  products,
  loading,
  failed,
  onRetry,
  columns = 4,
  className = "",
}) {
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section id={id} className={`band scroll-mt-24 ${className}`} aria-labelledby={headingId}>
      <div className="shell">
        <SectionHeading
          id={headingId}
          eyebrow={eyebrow}
          title={title}
          description={description}
          action={action}
          actionTo={actionTo}
        />

        <div className="mt-12 lg:mt-16">
          {loading && <ProductGridSkeleton count={columns} />}

          {failed && (
            <ErrorState
              title="Products couldn't be loaded right now."
              description="The catalogue didn't come back. It's usually worth another go."
              onRetry={onRetry}
            />
          )}

          {!loading && !failed && <ProductGrid products={products} columns={columns} />}
        </div>
      </div>
    </section>
  );
}
