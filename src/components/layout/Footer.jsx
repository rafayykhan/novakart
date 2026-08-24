import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  departmentChanged,
  queryChanged,
  selectMenu,
  sortChanged,
  categoryChanged,
} from "../../features/products/productsSlice";
import { selectIsLoggedIn } from "../../features/auth/authSlice";
import Logo from "./Logo";

/**
 * Ink footer.
 *
 * Every link here goes somewhere that exists — the department column is built
 * from the catalogue that actually loaded, and the account column changes with
 * sign-in state. No dead "Careers / Press / Affiliates" filler, and no social
 * icons pointing at accounts nobody runs.
 */
export default function Footer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menu = useSelector(selectMenu);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  function browse(payload) {
    dispatch(queryChanged(""));
    if (payload.department) dispatch(departmentChanged(payload.department));
    else dispatch(categoryChanged("all"));
    if (payload.sort) dispatch(sortChanged(payload.sort));
    navigate("/products");
  }

  return (
    <footer className="on-ink mt-auto">
      <div className="shell py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10">
          <div className="max-w-xs">
            {/* White mark on the ink field — the knockout PNG bakes in its own
                background and would show a seam here. */}
            <Logo onDark size="md" />
            <p className="mt-6 text-sm leading-relaxed text-[#f4efe6]/60">
              Better things, chosen well. A short catalogue, presented properly,
              with nothing shouting at you.
            </p>
          </div>

          <Column title="Shop">
            <ActionLink onClick={() => browse({ sort: "featured" })}>
              All products
            </ActionLink>
            <ActionLink onClick={() => browse({ sort: "rating-desc" })}>
              Top rated
            </ActionLink>
            <PlainLink to="/saved">Saved items</PlainLink>
            <PlainLink to="/cart">Cart</PlainLink>
          </Column>

          <Column title="Categories">
            {menu.slice(0, 5).map((dept) => (
              <ActionLink
                key={dept.id}
                onClick={() => browse({ department: dept.id })}
              >
                {dept.label}
              </ActionLink>
            ))}
          </Column>

          {/* Anchors into the one information page that exists. A store this
              size doesn't need five policy stubs. */}
          <Column title="Help">
            <PlainLink to="/help#shipping">Shipping</PlainLink>
            <PlainLink to="/help#returns">Returns</PlainLink>
            <PlainLink to="/help#about">About this build</PlainLink>
            {isLoggedIn ? (
              <PlainLink to="/checkout">Checkout</PlainLink>
            ) : (
              <PlainLink to="/login">Sign in</PlainLink>
            )}
          </Column>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-[#f4efe6]/15 pt-8 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#f4efe6]/45">
            © {new Date().getFullYear()} NovaKart. A portfolio build — the
            catalogue is the public DummyJSON API and no orders are real.
          </p>

          <Link
            to="/help#about"
            className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f4efe6]/45 transition-colors hover:text-[#f4efe6]"
          >
            How this works
          </Link>
        </div>
      </div>
    </footer>
  );
}

function Column({ title, children }) {
  return (
    <div>
      <h2 className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4efe6]/50">
        {title}
      </h2>
      <ul className="mt-6 space-y-3.5">{children}</ul>
    </div>
  );
}

const linkClass =
  "text-sm text-[#f4efe6]/70 transition-colors hover:text-[#f4efe6] text-left";

function PlainLink({ to, children }) {
  return (
    <li>
      <Link to={to} className={linkClass}>
        {children}
      </Link>
    </li>
  );
}

function ActionLink({ onClick, children }) {
  return (
    <li>
      <button type="button" onClick={onClick} className={linkClass}>
        {children}
      </button>
    </li>
  );
}
