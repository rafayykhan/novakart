/**
 * Every product image in the app goes through here.
 *
 * The catalogue images are cutouts shot on white. Dropping them straight onto
 * the page means a bright rectangle punched into a dark layout, so instead
 * they sit on a warm neutral "plate" (--media) in both themes and blend into
 * it with multiply — the white background disappears, the product doesn't.
 *
 * The aspect ratio is fixed and the image is contained, so the grid reserves
 * its space before anything loads and nothing shifts underneath the cursor.
 */
export default function ProductMedia({
  src,
  alt,
  ratio = "4/5",
  zoom = false,
  priority = false,
  className = "",
  pad = "p-6 sm:p-8",
  children,
}) {
  return (
    <div
      className={`media-plate rounded-lg ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <div className={`flex h-full w-full items-center justify-center ${pad}`}>
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          draggable="false"
          className={`h-full w-full object-contain transition-transform duration-300 ease-out ${
            zoom ? "group-hover:scale-[1.04] group-focus-within:scale-[1.04]" : ""
          }`}
        />
      </div>

      {/* Overlay slot: wishlist button, badges, quick add. */}
      {children}
    </div>
  );
}
