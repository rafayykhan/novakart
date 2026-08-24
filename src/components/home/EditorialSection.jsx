import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllProducts } from "../../features/products/productsSlice";
import { categoryLabel, money } from "../../utils/format";

/**
 * The point-of-view band. One image, one idea, one link.
 *
 * This is the section that stops the homepage being a stack of grids — it's
 * the only place the serif face gets a full run, and the only place a
 * paragraph is allowed to be about the shop rather than a product.
 *
 * The image is a real catalogue item, credited underneath and linked, so the
 * editorial framing never becomes a picture of something you can't buy.
 */
export default function EditorialSection() {
  const products = useSelector(selectAllProducts);
  const feature = products[3] ?? products[0];

  return (
    <section className="band border-y border-line bg-surface">
      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <p className="eyebrow">Why we picked it</p>

            <p className="t-quote mt-6 text-ink text-balance">
              Good products don't need to shout.
            </p>

            <div className="measure mt-7 space-y-4 text-[15px] leading-relaxed text-muted">
              <p>
                Most shops solve choice by adding more of it — more listings,
                more badges, more urgency. We'd rather solve it by carrying
                less and saying why.
              </p>
              <p>
                Everything here gets one honest photograph, its real price, and
                room to be looked at. If a product needs a countdown timer to
                seem worth it, it isn't.
              </p>
            </div>

            <Link to="/products" className="link-arrow mt-9">
              Explore the collection
            </Link>
          </div>

          <div className="order-1 lg:order-2">
            {feature ? (
              <figure>
                <Link
                  to={`/product/${feature.id}`}
                  className="group media-plate block aspect-[5/4] rounded-lg lg:aspect-[4/5]"
                >
                  <span className="flex h-full w-full items-center justify-center p-10 sm:p-16">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                    />
                  </span>
                </Link>

                <figcaption className="mt-4 flex items-baseline justify-between gap-4 text-sm">
                  <span className="min-w-0">
                    <span className="eyebrow block">
                      {categoryLabel(feature.category)}
                    </span>
                    <Link
                      to={`/product/${feature.id}`}
                      className="mt-1.5 block truncate text-ink hover:underline decoration-line-strong underline-offset-4"
                    >
                      {feature.title}
                    </Link>
                  </span>
                  <span className="nums shrink-0 font-display font-medium text-ink">
                    {money(feature.price)}
                  </span>
                </figcaption>
              </figure>
            ) : (
              <div
                className="aspect-[5/4] animate-pulse rounded-lg bg-surface-2 lg:aspect-[4/5]"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
