import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectAllProducts } from "../features/products/productsSlice";
import { useCatalogue } from "../hooks/useCatalogue";
import Hero from "../components/home/Hero";
import ValueProps from "../components/home/ValueProps";
import CategoryGrid from "../components/home/CategoryGrid";
import ProductBand from "../components/home/ProductBand";
import EditorialSection from "../components/home/EditorialSection";
import PromoSection from "../components/home/PromoSection";
import Newsletter from "../components/home/Newsletter";

/**
 * The homepage's job is pacing.
 *
 * Hero → four short promises → categories → products → a paragraph with a
 * point of view → one promo → products again → signup. Two product grids
 * total, and never back to back: everything between them is there so the
 * page has somewhere to breathe.
 */
export default function Home() {
  const { loading, failed, retry } = useCatalogue();
  const products = useSelector(selectAllProducts);

  // "Featured" is one per category then whatever's next, so the first grid
  // shows the range of the shop rather than eight variations of one thing.
  const featured = useMemo(() => {
    const seen = new Set();
    const leading = [];
    const rest = [];

    for (const product of products) {
      if (!seen.has(product.category)) {
        seen.add(product.category);
        leading.push(product);
      } else {
        rest.push(product);
      }
    }

    return [...leading, ...rest].slice(0, 8);
  }, [products]);

  // A real, checkable claim: these genuinely are the sub-$50 items.
  const affordable = useMemo(
    () =>
      [...products]
        .filter((p) => p.price < 50)
        .sort((a, b) => a.price - b.price)
        .slice(0, 4),
    [products]
  );

  return (
    <>
      <Hero />

      <ValueProps />

      <CategoryGrid />

      <ProductBand
        id="featured"
        eyebrow="The selection"
        title="Worth making room for"
        description="A spread across every category — start here if you're not sure where to look."
        action="View everything"
        actionTo="/products"
        products={featured}
        loading={loading}
        failed={failed}
        onRetry={retry}
        columns={4}
        className="border-t border-line"
      />

      <EditorialSection />

      <PromoSection />

      {affordable.length === 4 && (
        <ProductBand
          id="under-fifty"
          eyebrow="Small spend"
          title="Everything under $50"
          description="The least expensive things we carry, and none of them feel like it."
          action="Sort by price"
          actionTo="/products"
          products={affordable}
          loading={false}
          failed={false}
          columns={4}
          className="border-t border-line"
        />
      )}

      <Newsletter />
    </>
  );
}
