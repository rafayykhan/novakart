import { ShieldIcon, SparkIcon, TagIcon, TruckIcon } from "../Icons";
import { FREE_SHIPPING_OVER } from "../../features/cart/shipping";
import { money } from "../../utils/format";

/**
 * Four short promises, each one true of this build.
 *
 * No customer counts, no review totals, no "trusted by 50,000 shoppers" —
 * there's no order history behind this app to draw any of that from, and
 * fabricated social proof is the fastest way to make a good-looking storefront
 * feel fake.
 */
const ITEMS = [
  {
    icon: SparkIcon,
    title: "Curated",
    body: "A short catalogue. Everything in it is here on purpose.",
  },
  {
    icon: TagIcon,
    title: "Plainly priced",
    body: "One price per product, shown up front. No struck-through theatre.",
  },
  {
    icon: TruckIcon,
    title: `Free over ${money(FREE_SHIPPING_OVER)}`,
    body: "Flat rate below that, and the cart tells you where you stand.",
  },
  {
    icon: ShieldIcon,
    title: "Nothing collected",
    body: "Your cart and saved items stay on your device.",
  },
];

export default function ValueProps() {
  return (
    <section className="border-b border-line bg-surface" aria-labelledby="valueprops-heading">
      <div className="shell">
        {/* Visually this band is just four labelled icons, but the items are
            h3s — without an h2 above them the homepage jumps h1 -> h3 right
            after the hero. */}
        <h2 id="valueprops-heading" className="sr-only">
          Why shop with NovaKart
        </h2>

        <ul className="grid gap-x-10 gap-y-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
          {ITEMS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4">
              <Icon width={20} height={20} className="mt-0.5 shrink-0 text-red" />
              <div>
                <h3 className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-ink">
                  {title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
