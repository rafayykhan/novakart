import { Link } from "react-router-dom";

/**
 * Empty states are a design surface, not an error. Every collection in the
 * app routes through this so "nothing here" always looks deliberate.
 *
 * The mark is a pair of offset rules rather than an illustration or an emoji —
 * quiet, on-brand, and it costs nothing to render.
 */
export default function EmptyState({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  children,
}) {
  return (
    <div className="flex flex-col items-center px-4 py-20 text-center sm:py-28">
      <div className="mb-10 flex flex-col items-center gap-2" aria-hidden="true">
        <span className="block h-px w-24 bg-line-strong" />
        <span className="block h-px w-14 bg-line-strong" />
        <span className="block h-px w-20 bg-line-strong" />
      </div>

      {eyebrow && <p className="eyebrow">{eyebrow}</p>}

      <h2 className="t-sub mt-3 text-ink">{title}</h2>

      {description && <p className="t-lead measure mt-4">{description}</p>}

      {actionTo && (
        <Link to={actionTo} className="btn btn-primary mt-8">
          {actionLabel}
        </Link>
      )}

      {onAction && !actionTo && (
        <button type="button" onClick={onAction} className="btn btn-primary mt-8">
          {actionLabel}
        </button>
      )}

      {children}
    </div>
  );
}
