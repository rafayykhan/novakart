import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { categoryChanged, selectCategories } from "../../features/products/productsSlice";
import { selectIsLoggedIn } from "../../features/auth/authSlice";
import { categoryLabel } from "../../utils/format";
import Logo from "./Logo";

/**
 * Four columns of real destinations.
 *
 * Every link here goes somewhere that exists — the category links are built
 * from the catalogue that actually loaded, and the account column changes
 * with sign-in state. No dead "Careers / Press / Affiliates" filler.
 */
export default function Footer() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories).filter((c) => c !== "all");
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="shell py-14 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-muted">
              A small catalogue, presented properly. Fewer things, chosen with
              some care, and nothing shouting at you.
            </p>
          </div>

          <FooterColumn title="Shop">
            <FooterLink to="/products">Everything</FooterLink>
            {categories.map((category) => (
              <li key={category}>
                <Link
                  to="/products"
                  onClick={() => dispatch(categoryChanged(category))}
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  {categoryLabel(category)}
                </Link>
              </li>
            ))}
          </FooterColumn>

          {/* These are anchors into the one information page that exists.
              A store this size doesn't need five policy stubs, and inventing
              a Careers page for a portfolio build helps nobody. */}
          <FooterColumn title="Help">
            <FooterLink to="/help#shipping">Shipping</FooterLink>
            <FooterLink to="/help#returns">Returns</FooterLink>
            <FooterLink to="/help#about">About this build</FooterLink>
          </FooterColumn>

          <FooterColumn title="Account">
            {isLoggedIn ? (
              <FooterLink to="/checkout">Checkout</FooterLink>
            ) : (
              <FooterLink to="/login">Sign in</FooterLink>
            )}
            <FooterLink to="/saved">Saved items</FooterLink>
            <FooterLink to="/cart">Cart</FooterLink>
          </FooterColumn>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-faint">
            © {new Date().getFullYear()} NovaKart. A learning project — the
            catalogue is the public Fake Store API and no orders are real.
          </p>

          <div className="flex gap-6">
            <Link
              to="/help"
              className="text-xs text-faint transition-colors hover:text-ink"
            >
              Information
            </Link>
            <Link
              to="/help#about"
              className="text-xs text-faint transition-colors hover:text-ink"
            >
              How this works
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <h2 className="eyebrow">{title}</h2>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="text-sm text-muted transition-colors hover:text-ink">
        {children}
      </Link>
    </li>
  );
}
