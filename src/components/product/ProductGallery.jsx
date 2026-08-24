import { useState } from "react";
import ProductMedia from "./ProductMedia";

/**
 * Product gallery.
 *
 * ~60% of the catalogue ships 2-6 photographs, the rest exactly one. A
 * single-image product gets the plain frame — no dead thumbnail rail, no
 * decorative dots standing in for photos that don't exist. The multi-image
 * layout is a column of real thumbnail buttons that sits left of the frame
 * on desktop and a horizontal swipe strip below it on mobile.
 */
export default function ProductGallery({ images = [], title }) {
  const gallery = images.length ? images : [""]; // one stable frame even with no photos
  const [active, setActive] = useState(0);
  const activeIndex = Math.min(active, gallery.length - 1);
  const single = gallery.length < 2;

  if (single) {
    return (
      <ProductMedia
        src={gallery[0]}
        alt={title}
        ratio="1/1"
        priority
        pad="p-10 sm:p-16"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row-reverse sm:gap-6">
      <div className="min-w-0 flex-1">
        <ProductMedia
          src={gallery[activeIndex]}
          alt={`${title} — view ${activeIndex + 1} of ${gallery.length}`}
          ratio="1/1"
          priority
          pad="p-10 sm:p-16"
        />
      </div>

      <div
        className="no-scrollbar flex gap-3 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-visible"
        role="group"
        aria-label={`${title} images`}
        onKeyDown={(event) => {
          // The rail reads as one control: arrow keys move the selection and
          // focus together rather than tabbing through unrelated buttons.
          const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
          const backward = event.key === "ArrowLeft" || event.key === "ArrowUp";
          if (!forward && !backward) return;
          event.preventDefault();
          const next = (activeIndex + (forward ? 1 : -1) + gallery.length) % gallery.length;
          setActive(next);
          event.currentTarget.children[next]?.focus();
        }}
      >
        {gallery.map((src, i) => (
          <Thumbnail
            key={`${src}-${i}`}
            src={src}
            index={i}
            count={gallery.length}
            active={i === activeIndex}
            onSelect={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  );
}

/** One thumbnail button. Failures fall back to a numbered plate rather than
 * a broken-image glyph — the same promise ProductMedia makes for the main
 * frame, kept here independently since these are plain <img>s. */
function Thumbnail({ src, index, count, active, onSelect }) {
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Show view ${index + 1} of ${count}`}
      aria-current={active}
      className={`media-plate h-20 w-20 shrink-0 rounded-lg border-2 p-2 transition-colors ${
        active ? "border-ink" : "border-transparent hover:border-line-strong"
      }`}
    >
      {failed || !src ? (
        <span className="flex h-full w-full items-center justify-center font-display text-xs font-bold text-faint" aria-hidden="true">
          {index + 1}
        </span>
      ) : (
        <img
          src={src}
          alt=""
          loading="lazy"
          className="h-full w-full object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </button>
  );
}
