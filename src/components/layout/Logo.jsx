import { Link } from "react-router-dom";

/**
 * The NovaKart lockup, assembled exactly as the supplied logo-snippet.html
 * defines it: the provided mark SVG plus the wordmark in Archivo 800,
 * uppercase, +0.02em tracking.
 *
 * The mark is loaded as a file rather than redrawn inline — novakart-mark.svg
 * and novakart-mark-white.svg are the brand assets and stay the single source
 * of truth for the geometry.
 *
 * The knockout PNG is deliberately not used: per the brand readme it carries a
 * baked ink field, so it only sits cleanly on exactly #201e1d. `onDark` swaps
 * to the white mark instead, which works on any dark surface.
 */
export default function Logo({ onDark = false, size = "md", className = "" }) {
  const dims = {
    sm: { mark: 22, text: "text-[15px]", gap: "gap-2.5" },
    md: { mark: 28, text: "text-[19px]", gap: "gap-3" },
    lg: { mark: 40, text: "text-[27px]", gap: "gap-4" },
  }[size];

  return (
    <Link
      to="/"
      className={`inline-flex items-center ${dims.gap} ${className}`}
      aria-label="NovaKart — home"
    >
      <img
        src={onDark ? "/brand/novakart-mark-white.svg" : "/brand/novakart-mark.svg"}
        alt=""
        width={Math.round((dims.mark * 56) / 100)}
        height={dims.mark}
        style={{ height: dims.mark, width: "auto" }}
        className="shrink-0"
        aria-hidden="true"
      />

      <span
        className={`font-display font-extrabold uppercase leading-none tracking-[0.02em] ${dims.text} ${
          onDark ? "text-[#f4efe6]" : "text-ink"
        }`}
      >
        Novakart
      </span>
    </Link>
  );
}
