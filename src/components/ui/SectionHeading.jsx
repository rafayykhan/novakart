import { Link } from "react-router-dom";
import { ArrowRightIcon } from "../Icons";

/**
 * The recurring section header: red rule, eyebrow, headline, one line of
 * supporting copy, and an optional link off to the right.
 *
 * Having it in one place is what keeps the homepage's rhythm consistent
 * instead of every band inventing its own spacing. `as` lets a section drop to
 * h3 where the page's heading order needs it — the visual size never changes
 * with the level.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  actionTo,
  onAction,
  as: Tag = "h2",
  align = "start",
  id,
  className = "",
}) {
  const centered = align === "center";

  const actionEl = action ? (
    actionTo ? (
      <Link to={actionTo} className="link-arrow shrink-0">
        {action}
        <ArrowRightIcon width={13} height={13} />
      </Link>
    ) : (
      <button type="button" onClick={onAction} className="link-arrow shrink-0">
        {action}
        <ArrowRightIcon width={13} height={13} />
      </button>
    )
  ) : null;

  return (
    <div
      className={`flex flex-col gap-6 ${
        centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"
      } ${className}`}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p
            className={`eyebrow eyebrow-red flex items-center gap-3 ${
              centered ? "justify-center" : ""
            }`}
          >
            <span className="h-px w-8 bg-red" aria-hidden="true" />
            {eyebrow}
          </p>
        )}

        <Tag id={id} className="t-section mt-5 text-ink text-balance">
          {title}
        </Tag>

        {description && (
          <p className={`t-lead mt-4 max-w-xl ${centered ? "mx-auto" : ""}`}>
            {description}
          </p>
        )}
      </div>

      {actionEl}
    </div>
  );
}
