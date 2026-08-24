import SectionHeading from "../ui/SectionHeading";
import Rating from "../ui/Rating";

const REVIEWS_HEADING_ID = "reviews-heading";

const formatDate = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null; // don't print "Invalid Date"
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

/**
 * Real reviews only — up to three per product, straight off the catalogue's
 * `reviews` array. There's no aggregate rating count in this data, so this
 * never prints a "4.5 (128 reviews)" style summary; the count in the heading
 * is `reviews.length`, nothing more.
 *
 * `reviews` is null while the full record is still in flight (the list
 * record the page paints from doesn't carry it) and `loading` disambiguates
 * that from a fetch that finished without one.
 */
export default function ProductReviews({ reviews, loading = false, className = "" }) {
  const title =
    reviews == null
      ? "Reviews"
      : reviews.length === 0
        ? "No reviews yet"
        : reviews.length === 1
          ? "1 review"
          : `${reviews.length} reviews`;

  return (
    <div className={className}>
      <SectionHeading as="h2" id={REVIEWS_HEADING_ID} eyebrow="Customer reviews" title={title} />

      {reviews == null && loading && (
        <ul className="mt-10 animate-pulse space-y-8" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="space-y-3">
              <div className="h-3 w-32 rounded-sm bg-surface-2" />
              <div className="h-3 w-20 rounded-sm bg-surface-2" />
              <div className="h-3 w-full max-w-md rounded-sm bg-surface-2" />
            </li>
          ))}
        </ul>
      )}

      {reviews == null && !loading && (
        <p className="mt-8 text-sm text-muted">
          Reviews couldn't be loaded right now.
        </p>
      )}

      {reviews != null && reviews.length === 0 && (
        <p className="mt-8 text-sm text-muted">
          This product doesn't have any reviews yet.
        </p>
      )}

      {reviews != null && reviews.length > 0 && (
        <ul className="mt-10 divide-y divide-line">
          {reviews.map((review, i) => {
            const date = formatDate(review.date);
            return (
              <li key={`${review.reviewerName}-${i}`} className="py-7 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="min-w-0 truncate font-display text-sm font-semibold text-ink">
                    {review.reviewerName}
                  </p>
                  {date && (
                    <time dateTime={review.date} className="nums shrink-0 text-xs text-faint">
                      {date}
                    </time>
                  )}
                </div>

                <Rating value={review.rating} size={13} className="mt-2" />

                <p className="measure mt-3 text-[15px] leading-relaxed text-muted">
                  {review.comment}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
