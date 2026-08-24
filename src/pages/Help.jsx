import { Link } from "react-router-dom";
import { FREE_SHIPPING_OVER, SHIPPING_FLAT } from "../features/cart/shipping";
import { money } from "../utils/format";

/**
 * One information page instead of five policy stubs.
 *
 * Everything on it is either read from the app's own constants or a plain
 * statement about what this build does and doesn't do. The alternative —
 * a Returns page describing a 30-day process that doesn't exist — is exactly
 * the kind of filler that makes a portfolio storefront read as fake.
 */
export default function Help() {
  return (
    <div className="shell py-14 sm:py-20">
      <div className="max-w-2xl">
        <p className="eyebrow">Information</p>
        <h1 className="t-section mt-4 text-ink text-balance">
          How NovaKart works
        </h1>
        <p className="t-lead mt-5">
          Short answers, and no policy pages written for the sake of having
          them.
        </p>
      </div>

      <div className="mt-16 max-w-2xl space-y-14">
        <Block id="shipping" title="Shipping">
          <p>
            Orders over <Strong>{money(FREE_SHIPPING_OVER)}</Strong> ship free.
            Below that, a flat <Strong>{money(SHIPPING_FLAT)}</Strong> is added.
          </p>
          <p>
            That's the whole rule — there are no zones, weights or express
            tiers. The cart shows the shipping line and how far an order is
            from the free threshold before you reach checkout.
          </p>
        </Block>

        <Block id="returns" title="Returns">
          <p>
            There isn't a returns process, because there isn't a fulfilment
            process. No order placed on this site is picked, packed or posted,
            so nothing ever needs sending back.
          </p>
        </Block>

        <Block id="about" title="About this build">
          <p>
            NovaKart is a portfolio project — a React front end built to
            practise Redux Toolkit, the Context API and React Router, then
            redesigned as a piece of interface work.
          </p>
          <p>
            The catalogue is the public{" "}
            <a
              href="https://dummyjson.com"
              target="_blank"
              rel="noreferrer noopener"
              className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
            >
              DummyJSON
            </a>{" "}
            API. Product titles, prices, photographs and ratings are its data,
            shown as-is. Nothing on this site is a real product for sale.
          </p>
          <p>
            Sign-in checks against one hardcoded demo account with a simulated
            delay; there's no user database. Your cart and saved items are kept
            in this browser's local storage and are never transmitted. No
            payment provider is connected, so placing an order records a
            reference number locally and empties the cart — nothing is charged
            and no email is sent.
          </p>
        </Block>

        <Block id="contact" title="Questions">
          <p>
            There's no support desk behind a demo store. If you've found
            something broken, the most useful place for it is the project's
            repository rather than an inbox that doesn't exist.
          </p>
        </Block>
      </div>

      <div className="mt-16 border-t border-line pt-10">
        <Link to="/products" className="link-arrow">
          Back to the shop
        </Link>
      </div>
    </div>
  );
}

function Block({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="t-sub text-ink">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}

const Strong = ({ children }) => (
  <span className="nums text-ink">{children}</span>
);
