import { Link } from "react-router-dom";

/**
 * The mark is a slash cut through two bars — the "N" of NovaKart reduced to
 * its diagonal. It's drawn rather than imported so it inherits currentColor
 * and works in both themes without a second asset.
 *
 * The accent slash is the one place the brand violet appears unprompted.
 */
export default function Logo({ className = "" }) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="NovaKart — home"
    >
      <svg
        width="20"
        height="22"
        viewBox="0 0 20 22"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect x="0" y="0" width="4.4" height="22" fill="currentColor" />
        <rect x="15.6" y="0" width="4.4" height="22" fill="currentColor" />
        <path d="M11.6 0h4.2L8.4 22H4.2L11.6 0Z" fill="var(--accent)" />
      </svg>

      <span className="font-display text-[15px] font-bold uppercase tracking-[0.16em] text-ink">
        Novakart
      </span>
    </Link>
  );
}
