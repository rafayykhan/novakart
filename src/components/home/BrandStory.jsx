import { Link } from "react-router-dom";
import EditorialImage from "./EditorialImage";
import Reveal from "../ui/Reveal";
import { ArrowRightIcon } from "../Icons";

const IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80&auto=format&fit=crop";

/**
 * The point-of-view band. One photograph, one idea, one link.
 *
 * This is the section that stops the homepage being a stack of grids. It's the
 * only place a paragraph is allowed to be about the shop rather than a
 * product, and the only place the serif gets a full run at display size.
 */
export default function BrandStory() {
  return (
    <section className="band" aria-labelledby="story-heading">
      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20 xl:gap-28">
          <Reveal className="order-2 lg:order-1">
            <p className="eyebrow eyebrow-red flex items-center gap-3">
              <span className="h-px w-8 bg-red" aria-hidden="true" />
              Why we picked it
            </p>

            <p id="story-heading" className="t-quote mt-7 text-ink text-balance">
              Good products don't need to shout.
            </p>

            <div className="measure mt-8 space-y-5 text-[15px] leading-relaxed text-muted">
              <p>
                Most shops solve choice by adding more of it — more listings,
                more badges, more urgency. We'd rather solve it by carrying
                less and saying why.
              </p>
              <p>
                Everything here gets a proper photograph, its real price and
                room to be looked at. If a product needs a countdown timer to
                seem worth it, it isn't.
              </p>
            </div>

            <Link to="/products" className="link-arrow mt-10">
              Explore the collection
              <ArrowRightIcon width={13} height={13} />
            </Link>
          </Reveal>

          <Reveal delay={80} className="order-1 lg:order-2">
            <EditorialImage
              src={IMAGE}
              alt="The interior of a small curated shop, garments and objects arranged on open shelving"
              ratio="4/3"
              className="lg:aspect-[4/5]"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
