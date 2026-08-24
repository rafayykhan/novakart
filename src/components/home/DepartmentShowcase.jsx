import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  departmentChanged,
  queryChanged,
  selectDepartmentPreviews,
  selectProductsStatus,
} from "../../features/products/productsSlice";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { ArrowRightIcon } from "../Icons";

/**
 * Department tiles.
 *
 * Deliberately not six identical rectangles: the first two run wide and tall,
 * the rest sit shorter beneath them. An even row of equal cards is the single
 * thing that makes a category section read as a template.
 *
 * Each tile's artwork is the best-rated in-stock product in that department —
 * real merchandise, not a stock photo of a category.
 */
export default function DepartmentShowcase() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const departments = useSelector(selectDepartmentPreviews);
  const status = useSelector(selectProductsStatus);

  const loading = status === "loading" || status === "idle";

  function open(id) {
    dispatch(queryChanged(""));
    dispatch(departmentChanged(id));
    navigate("/products");
  }

  return (
    <section id="departments" className="band scroll-mt-24" aria-labelledby="departments-heading">
      <div className="shell">
        <SectionHeading
          id="departments-heading"
          eyebrow="Shop by category"
          title="Start somewhere"
          description="Six departments, everything in each one hand-picked."
          action="View everything"
          actionTo="/products"
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`animate-pulse rounded-lg bg-surface-2 ${
                  i < 2 ? "aspect-[4/3] lg:col-span-3 lg:aspect-[16/10]" : "aspect-[4/3] lg:col-span-2"
                }`}
                aria-hidden="true"
              />
            ))}

          {!loading &&
            departments.map((dept, i) => {
              const wide = i < 2;
              return (
                <Reveal
                  key={dept.id}
                  delay={Math.min(i, 3) * 60}
                  className={wide ? "lg:col-span-3" : "lg:col-span-2"}
                >
                  <button
                    type="button"
                    onClick={() => open(dept.id)}
                    className={`group media-plate relative flex w-full flex-col justify-end overflow-hidden rounded-lg p-6 text-left sm:p-7 ${
                      wide ? "aspect-[4/3] lg:aspect-[16/10]" : "aspect-[4/3]"
                    }`}
                  >
                    {dept.image && (
                      <img
                        src={dept.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className={`pointer-events-none absolute object-contain transition-transform duration-500 ease-out group-hover:scale-[1.06] ${
                          wide
                            ? "right-6 top-6 h-2/3 w-[45%] sm:right-10"
                            : "right-5 top-5 h-1/2 w-2/5"
                        }`}
                      />
                    )}

                    {/* Fixed neutrals, not theme tokens: the plate behind this
                        is light in both themes. Checked against --media. */}
                    <span className="relative">
                      <span className="block font-display text-[9px] font-bold uppercase tracking-[0.22em] text-[#201e1d]/55">
                        {dept.count} {dept.count === 1 ? "product" : "products"}
                      </span>

                      <span
                        className={`mt-2.5 block font-display font-extrabold uppercase leading-none tracking-[-0.02em] text-[#201e1d] ${
                          wide ? "text-3xl sm:text-5xl" : "text-2xl sm:text-3xl"
                        }`}
                      >
                        {dept.label}
                      </span>

                      <span className="mt-3 flex items-center gap-2 text-[13px] text-[#201e1d]/70 transition-[gap] duration-200 group-hover:gap-3.5">
                        {dept.tagline}
                        <ArrowRightIcon
                          width={14}
                          height={14}
                          className="shrink-0 text-[#ec3013]"
                        />
                      </span>
                    </span>
                  </button>
                </Reveal>
              );
            })}
        </div>
      </div>
    </section>
  );
}
