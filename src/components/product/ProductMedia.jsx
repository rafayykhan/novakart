import { useState } from "react";

/**
 * Every product image in the app goes through here.
 *
 * Three jobs:
 *
 * 1. Staging — catalogue shots are cutouts on white. Dropping them straight
 *    onto a cream page gives you a bright rectangle punched into the layout,
 *    so they sit on a warm plate and blend into it with multiply.
 *
 * 2. Hover swap — roughly 60% of the catalogue ships a second photograph.
 *    Those crossfade on hover. The rest pass hoverSrc={null} and simply don't,
 *    rather than dissolving an image into an identical copy of itself.
 *
 * 3. Failure — a dead CDN URL renders a neutral plate with the product's
 *    initial, never a broken-image glyph.
 *
 * The aspect ratio is fixed and the image contained, so the grid reserves its
 * space before anything loads and nothing shifts under the cursor.
 */
export default function ProductMedia({
  src,
  hoverSrc = null,
  alt,
  ratio = "4/5",
  zoom = true,
  priority = false,
  pad = "p-6 sm:p-8",
  className = "",
  children,
}) {
  const [failed, setFailed] = useState(false);
  const [hoverFailed, setHoverFailed] = useState(false);

  const showHover = Boolean(hoverSrc) && !hoverFailed && !failed;
  const zoomClass = zoom
    ? "group-hover:scale-[1.04] group-focus-within:scale-[1.04]"
    : "";

  return (
    <div
      className={`media-plate rounded-lg ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {failed ? (
        <div className="flex h-full w-full items-center justify-center">
          <span
            className="font-display text-4xl font-bold uppercase text-[#201e1d]/15"
            aria-hidden="true"
          >
            {(alt ?? "?").trim().charAt(0)}
          </span>
          <span className="sr-only">{alt} — image unavailable</span>
        </div>
      ) : (
        // Padding on the outer box, stacking on the inner one: absolutely
        // positioned children resolve against the padding box, so the two
        // images have to share a separate content-sized parent to line up.
        <div className={`h-full w-full ${pad}`}>
          <div className="relative h-full w-full">
            <img
              src={src}
              alt={alt}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={priority ? "high" : "auto"}
              draggable="false"
              onError={() => setFailed(true)}
              className={`absolute inset-0 h-full w-full object-contain transition-[opacity,transform] duration-500 ease-out ${zoomClass} ${
                showHover ? "group-hover:opacity-0 group-focus-within:opacity-0" : ""
              }`}
            />

            {showHover && (
              <img
                src={hoverSrc}
                alt=""
                loading="lazy"
                decoding="async"
                draggable="false"
                aria-hidden="true"
                onError={() => setHoverFailed(true)}
                className={`absolute inset-0 h-full w-full object-contain opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:opacity-100 group-focus-within:opacity-100 ${zoomClass}`}
              />
            )}
          </div>
        </div>
      )}

      {/* Overlay slot: wishlist, badges, quick add. */}
      {children}
    </div>
  );
}
