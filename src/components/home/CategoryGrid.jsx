import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  categoryChanged,
  queryChanged,
  selectCategoryPreviews,
  selectProductsStatus,
} from "../../features/products/productsSlice";
import { categoryLabel } from "../../utils/format";
import { ArrowRightIcon } from "../Icons";
import SectionHeading from "../ui/SectionHeading";

/**
 * A short descriptor per category. These are editorial lines about how the
 * shop thinks, not claims about the products — deliberately written so they
 * stay true whatever the API returns.
 */
const DESCRIPTORS = {
  electronics: "Everyday technology, better chosen",
  jewelery: "Small things, made to be kept",
  "men's clothing": "Built to be worn, not just bought",
  "women's clothing": "Considered shapes, quiet colour",
};

/**
 * Category tiles.
 *
 * The first tile is deliberately twice the width of the rest — an even row of
 * four identical rectangles is the thing that makes category sections read as
 * a template. Each tile's artwork is a real product from that category.
 */
export default function CategoryGrid() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const previews = useSelector(selectCategoryPreviews);
  const status = useSelector(selectProductsStatus);

  function open(category) {
    dispatch(queryChanged(""));
    dispatch(categoryChanged(category));
    navigate("/products");
  }

  const loading = status === "loading" || status === "idle";

  return (
    <section id="categories" className="band scroll-mt-24">
      <div className="shell">
        <SectionHeading
          eyebrow="Departments"
          title="Start somewhere"
          description="Four categories, everything in each one hand-picked."
          action="View everything"
          actionTo="/products"
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-[4/3] animate-pulse rounded-lg bg-surface-2 ${
                  i === 0 ? "lg:col-span-2 lg:aspect-[8/5]" : ""
                }`}
                aria-hidden="true"
              />
            ))}

          {!loading &&
            previews.map((preview, i) => (
              <button
                key={preview.category}
                type="button"
                onClick={() => open(preview.category)}
                className={`group media-plate relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-lg p-6 text-left sm:p-7 ${
                  i === 0 ? "lg:col-span-2 lg:aspect-[8/5]" : ""
                }`}
              >
                {/* Artwork sits behind the label, pushed to the top-right so
                    the copy always has clean space to sit on. */}
                <img
                  src={preview.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={`pointer-events-none absolute object-contain transition-transform duration-300 ease-out group-hover:scale-[1.05] ${
                    i === 0
                      ? "right-6 top-6 h-2/3 w-1/2 sm:right-10"
                      : "right-4 top-4 h-1/2 w-2/5"
                  }`}
                />

                <span className="relative">
                  {/* Fixed neutrals, not theme tokens: the plate behind this
                      is light in both themes. Checked against --media for
                      contrast rather than assumed. */}
                  <span className="block font-display text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                    {preview.count} {preview.count === 1 ? "product" : "products"}
                  </span>

                  <span
                    className={`mt-2 block font-display font-bold uppercase tracking-tight text-neutral-900 ${
                      i === 0 ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"
                    }`}
                  >
                    {categoryLabel(preview.category)}
                  </span>

                  <span className="mt-2 flex items-center gap-2 text-sm text-neutral-600 transition-[gap] duration-200 group-hover:gap-3">
                    {DESCRIPTORS[preview.category] ?? "See what's here"}
                    <ArrowRightIcon
                      width={15}
                      height={15}
                      className="shrink-0 text-neutral-900"
                    />
                  </span>
                </span>
              </button>
            ))}
        </div>
      </div>
    </section>
  );
}
