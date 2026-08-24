import { StarIcon } from "../Icons";

/**
 * Ratings come straight from the Fake Store API payload (rating.rate and
 * rating.count). If a product has no rating the component renders nothing
 * rather than showing an empty five-star row, which would read as "0 stars".
 */
export default function Rating({ value, count, size = 13, showCount = true }) {
  if (value == null) return null;

  const rounded = Math.round(value * 10) / 10;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex text-warning" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} width={size} height={size} fillPercent={(value - i) * 100} />
        ))}
      </span>

      <span className="nums text-xs text-muted">
        {rounded}
        {showCount && count != null && (
          <span className="text-faint"> ({count})</span>
        )}
      </span>

      {/* The visual row is decorative; this carries the actual value. */}
      <span className="sr-only">
        Rated {rounded} out of 5{count != null ? ` from ${count} ratings` : ""}
      </span>
    </span>
  );
}
