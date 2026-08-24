import { ShieldIcon, SparkIcon, TagIcon, TruckIcon } from "../Icons";
import { FREE_SHIPPING_OVER } from "../../features/cart/shipping";
import { money } from "../../utils/format";

/**
 * Four short promises, each one true of this build.
 *
 * No customer counts, no review totals, no star averages for the "store" —
 * there's no order history behind this app to draw any of that from, and a
 * fabricated "50,000 happy customers" is the single fastest way to make a
 * good-looking storefront feel fake.
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
    title: "Free over " + money(FREE_SHIPPING_OVER),
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
    <section className="band-tight border-t border-line">
      <div className="shell">
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <Icon width={20} height={20} className="text-muted" />
              <h3 className="mt-4 font-display text-sm font-semibold uppercase tracking-[0.12em] text-ink">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
