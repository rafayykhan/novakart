import { Link } from "react-router-dom";

/**
 * The recurring section header: eyebrow, headline, one line of supporting
 * copy, and an optional link off to the right. Having it in one place is what
 * keeps the homepage's rhythm consistent instead of every band inventing its
 * own spacing.
 *
 * `as` lets a section drop to h3 where the page's heading order needs it —
 * the visual size never changes with the level.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  actionTo,
  as: Tag = "h2",
  align = "start",
  id,
}) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col gap-6 ${
        centered
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between"
      }`}
    >
      <div className={centered ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <Tag id={id} className="t-section mt-3 text-ink text-balance">
          {title}
        </Tag>
        {description && (
          <p className={`t-lead mt-4 ${centered ? "mx-auto" : ""} max-w-lg`}>
            {description}
          </p>
        )}
      </div>

      {action && actionTo && (
        <Link to={actionTo} className="link-arrow shrink-0">
          {action}
        </Link>
      )}
    </div>
  );
}
