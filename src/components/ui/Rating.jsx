import { StarIcon } from "../Icons";

/**
 * Ratings come straight from the catalogue payload's `rating` field.
 *
 * There is no rating *count* in the data — only a handful of individual
 * reviews per product — so this shows the score and nothing else. A
 * "(1,284 reviews)" next to it would be a number nobody supplied.
 *
 * If a product has no rating the component renders nothing rather than an
 * empty five-star row, which reads as "zero stars".
 */
export default function Rating({ value, size = 12, showValue = true, className = "" }) {
  if (value == null) return null;

  const rounded = Math.round(value * 10) / 10;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="flex gap-px text-red" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} width={size} height={size} fillPercent={(value - i) * 100} />
        ))}
      </span>

      {showValue && <span className="nums text-xs text-muted">{rounded}</span>}

      {/* The star row is decorative; this carries the actual value. */}
      <span className="sr-only">Rated {rounded} out of 5</span>
    </span>
  );
}
