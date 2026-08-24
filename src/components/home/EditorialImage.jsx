import { useState } from "react";

/**
 * The two editorial photographs on the site, and the only images that aren't
 * catalogue product shots.
 *
 * They're `cover`-cropped lifestyle images rather than `contain`-fitted
 * cutouts, so they get their own component: a fixed aspect box, a warm
 * placeholder behind them while they decode (which also becomes the permanent
 * state if the host is unreachable), and a fade-in so they don't pop.
 */
export default function EditorialImage({
  src,
  alt,
  ratio = "4/5",
  position = "center",
  priority = false,
  className = "",
  children,
}) {
  const [state, setState] = useState("loading"); // loading | ready | failed

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-surface-2 ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {state !== "failed" && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setState("ready")}
          onError={() => setState("failed")}
          style={{ objectPosition: position }}
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            state === "ready" ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* If the photograph never arrives the band still reads as designed
          rather than showing a broken-image glyph over the copy. */}
      {state === "failed" && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
          <span className="eyebrow">NovaKart</span>
        </div>
      )}

      {children}
    </div>
  );
}
