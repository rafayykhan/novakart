import ProductCard from "./ProductCard";

/**
 * The catalogue grid.
 *
 * Two columns on phones (these are cutout product shots — they stay legible
 * small), three on tablet, four on desktop. The row gap is much larger than
 * the column gap: that vertical air is what separates one product from the
 * next without needing a card border.
 *
 * `priorityCount` marks the first row as eager-loaded so the top of the page
 * isn't waiting on the lazy-load observer.
 */
export default function ProductGrid({ products, columns = 4, priorityCount = 0 }) {
  const lg = columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";

  return (
    <div className={`grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:gap-x-8 lg:gap-y-16 ${lg}`}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < priorityCount} />
      ))}
    </div>
  );
}
