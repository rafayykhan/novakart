import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  queryChanged,
  categoryChanged,
  sortChanged,
  selectAllProducts,
} from "../features/products/productsSlice";
import { useCatalogue } from "../hooks/useCatalogue";
import Hero from "../components/home/Hero";
import ValueProps from "../components/home/ValueProps";
import DepartmentShowcase from "../components/home/DepartmentShowcase";
import ProductCarousel from "../components/product/ProductCarousel";
import BrandStory from "../components/home/BrandStory";
import CampaignSection from "../components/home/CampaignSection";
import Newsletter from "../components/home/Newsletter";

/**
 * The homepage's job is pacing.
 *
 * Full-viewport hero → four short promises → departments → products →
 * a paragraph with a point of view → full-bleed campaign → products again →
 * signup. Two product rails total, never back to back: everything between
 * them is there so the page has somewhere to breathe.
 */
export default function Home() {
  const { loading, failed, retry } = useCatalogue();
  const products = useSelector(selectAllProducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function browse(sort) {
    dispatch(queryChanged(""));
    dispatch(categoryChanged("all"));
    dispatch(sortChanged(sort));
    navigate("/products");
  }

  /**
   * "The selection" — one product per department, then whatever's next, so
   * the first rail shows the range of the shop rather than eight variations
   * of one thing. In stock only; a rail that opens with a sold-out item is a
   * bad first impression.
   */
  const selection = useMemo(() => {
    const seen = new Set();
    const leading = [];
    const rest = [];

    for (const p of products) {
      if (!p.inStock) continue;
      if (!seen.has(p.category)) {
        seen.add(p.category);
        leading.push(p);
      } else {
        rest.push(p);
      }
    }

    return [...leading, ...rest].slice(0, 10);
  }, [products]);

  /**
   * Genuinely the highest-rated things in the catalogue — a claim the `rating`
   * field can actually support, unlike "best sellers".
   */
  const topRated = useMemo(
    () =>
      [...products]
        .filter((p) => p.inStock && p.rating != null)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10),
    [products]
  );

  return (
    <>
      <Hero />

      <ValueProps />

      <DepartmentShowcase />

      <ProductCarousel
        id="selection"
        eyebrow="The selection"
        title="Worth making room for"
        description="A spread across every department — start here if you're not sure where to look."
        action="View everything"
        onAction={() => browse("featured")}
        products={selection}
        loading={loading}
        failed={failed}
        onRetry={retry}
        className="border-t border-line"
      />

      <BrandStory />

      <CampaignSection />

      <ProductCarousel
        id="top-rated"
        eyebrow="Most loved"
        title="Top rated"
        description="The best-scoring products we carry, ranked by their own ratings."
        action="Shop top rated"
        onAction={() => browse("rating-desc")}
        products={topRated}
        loading={loading}
        failed={failed}
        onRetry={retry}
      />

      <Newsletter />
    </>
  );
}
