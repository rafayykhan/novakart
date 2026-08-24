import { useId } from "react";

// One icon family, hand-rolled instead of pulling in an icon package.
// Everything shares the same 24-unit grid, 1.6 stroke and round joins so the
// set reads as one thing — mixing libraries is what makes UI look assembled.
const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const CartIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="9" cy="20" r="1.3" />
    <circle cx="18" cy="20" r="1.3" />
    <path d="M2.5 3h2.2l2.4 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.3L21 7H6" />
  </svg>
);

export const SunIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const MoonIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M20 14.5A8.2 8.2 0 0 1 9.5 4 8.4 8.4 0 1 0 20 14.5Z" />
  </svg>
);

export const TrashIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M4 7h16M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7" />
  </svg>
);

export const PlusIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M5 12h14" />
  </svg>
);

export const SearchIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);

export const CloseIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const MenuIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const UserIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="8.5" r="3.7" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </svg>
);

// `filled` swaps the outline for a solid — used to show saved state without
// relying on colour alone.
export const HeartIcon = ({ filled = false, ...props }) => (
  <svg {...base} fill={filled ? "currentColor" : "none"} {...props}>
    <path d="M12 20.2s-7.5-4.4-7.5-9.4A4.3 4.3 0 0 1 12 8.2a4.3 4.3 0 0 1 7.5 2.6c0 5-7.5 9.4-7.5 9.4Z" />
  </svg>
);

export const ArrowRightIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const ArrowLeftIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M20 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const ChevronDownIcon = (props) => (
  <svg {...base} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const CheckIcon = (props) => (
  <svg {...base} {...props}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

const STAR_PATH =
  "m12 3.6 2.6 5.3 5.8.85-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.85Z";

// Solid star with a partial fill, so a 4.1 rating shows as 4.1 rather than
// being rounded to whole stars. useId keeps each clipPath unique — several
// ratings on one page would otherwise all clip against the first one's rect.
export const StarIcon = ({ fillPercent = 100, ...props }) => {
  const clipId = `nk-star-${useId()}`;
  const clamped = Math.min(100, Math.max(0, fillPercent));

  return (
    <svg {...base} strokeWidth={0} fill="currentColor" {...props}>
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={(24 * clamped) / 100} height="24" />
        </clipPath>
      </defs>
      <path d={STAR_PATH} opacity="0.25" />
      <path d={STAR_PATH} clipPath={`url(#${clipId})`} />
    </svg>
  );
};

export const SlidersIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="8" cy="17" r="2" />
  </svg>
);

export const TruckIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M2.5 7.5h11v9h-11z" />
    <path d="M13.5 11h4l3 3v2.5h-7z" />
    <circle cx="7" cy="18.5" r="1.6" />
    <circle cx="17" cy="18.5" r="1.6" />
  </svg>
);

export const ShieldIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3.2 19 6v5.5c0 4.3-2.9 7.6-7 9.3-4.1-1.7-7-5-7-9.3V6Z" />
    <path d="m9 12 2 2 4-4.2" />
  </svg>
);

export const SparkIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
    <path d="M12 8.5a3.5 3.5 0 0 0 3.5 3.5A3.5 3.5 0 0 0 12 15.5 3.5 3.5 0 0 0 8.5 12 3.5 3.5 0 0 0 12 8.5Z" />
  </svg>
);

export const TagIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M11.5 3.5H20v8.5l-8.8 8.8a1.6 1.6 0 0 1-2.3 0l-6.2-6.2a1.6 1.6 0 0 1 0-2.3Z" />
    <circle cx="16" cy="8" r="1.4" />
  </svg>
);

export const AlertIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v5M12 16.2v.1" />
  </svg>
);
