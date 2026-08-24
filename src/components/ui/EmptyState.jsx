import { Link } from "react-router-dom";
import { ArrowRightIcon } from "../Icons";

/**
 * Empty states are a design surface, not an error. Every collection in the app
 * routes through this so "nothing here" always looks deliberate.
 *
 * The mark is three offset rules rather than an illustration or an emoji —
 * quiet, on-brand, and it costs nothing to render.
 */
export default function EmptyState({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  secondaryLabel,
  secondaryTo,
  // Usually this component IS the whole page (an empty cart, no saved items,
  // a product that doesn't exist), so its title is the page's h1 by default.
  // Rendering h2 unconditionally left those routes with no h1 at all.
  // Callers that drop it inside a page which already has one — the shop grid —
  // pass as="h2".
  as: Tag = "h1",
  children,
}) {
  return (
    <div className="flex flex-col items-center px-5 py-24 text-center sm:py-32">
      <div className="mb-10 flex flex-col items-center gap-2" aria-hidden="true">
        <span className="block h-px w-24 bg-line-strong" />
        <span className="block h-px w-12 bg-red" />
        <span className="block h-px w-20 bg-line-strong" />
      </div>

      {eyebrow && <p className="eyebrow">{eyebrow}</p>}

      <Tag className="t-sub mt-4 text-ink">{title}</Tag>

      {description && <p className="t-lead measure mt-4">{description}</p>}

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {actionTo && (
          <Link to={actionTo} className="btn btn-primary">
            {actionLabel}
            <ArrowRightIcon width={14} height={14} className="arrow" />
          </Link>
        )}

        {onAction && !actionTo && (
          <button type="button" onClick={onAction} className="btn btn-primary">
            {actionLabel}
          </button>
        )}

        {secondaryTo && (
          <Link to={secondaryTo} className="btn btn-secondary">
            {secondaryLabel}
          </Link>
        )}
      </div>

      {children}
    </div>
  );
}
