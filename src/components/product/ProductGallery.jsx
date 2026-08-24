import { useState } from "react";
import ProductMedia from "./ProductMedia";

/**
 * Product gallery.
 *
 * The catalogue API returns exactly one image per product, so that's what
 * this shows — no duplicated "angles", no placeholder tiles padding out a
 * thumbnail rail. The multi-image path (thumbnail column on desktop, swipe
 * strip with dots on mobile) is here and works the moment a product arrives
 * with more than one, but it stays out of the way until then.
 */
export default function ProductGallery({ images, title }) {
  const [active, setActive] = useState(0);
  const single = images.length < 2;

  if (single) {
    return (
      <ProductMedia
        src={images[0]}
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
          src={images[active]}
          alt={`${title} — view ${active + 1} of ${images.length}`}
          ratio="1/1"
          priority
          pad="p-10 sm:p-16"
        />
      </div>

      <div
        className="no-scrollbar flex gap-3 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-visible"
        role="group"
        aria-label={`${title} images`}
      >
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show view ${i + 1} of ${images.length}`}
            aria-current={i === active}
            className={`media-plate h-20 w-20 shrink-0 rounded-md border-2 p-2 transition-colors ${
              i === active ? "border-ink" : "border-transparent hover:border-line-strong"
            }`}
          >
            <img src={src} alt="" loading="lazy" className="h-full w-full object-contain" />
          </button>
        ))}
      </div>
    </div>
  );
}
