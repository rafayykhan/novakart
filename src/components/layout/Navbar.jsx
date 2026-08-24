import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { loggedOut, selectUser } from "../../features/auth/authSlice";
import { cartCleared, selectCartCount } from "../../features/cart/cartSlice";
import { selectWishlistCount } from "../../features/wishlist/wishlistSlice";
import { categoryChanged, selectCategories } from "../../features/products/productsSlice";
import { categoryLabel } from "../../utils/format";
import {
  CartIcon,
  ChevronDownIcon,
  HeartIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  UserIcon,
} from "../Icons";
import Logo from "./Logo";
import SearchOverlay from "../search/SearchOverlay";
import MobileMenu from "./MobileMenu";

/**
 * Text-first navigation with a lot of air around it. No pills, no boxes —
 * the only enclosed things up here are the count badges, because a number
 * needs a shape to sit in.
 *
 * Layout is three zones: brand, links, actions. On mobile the links collapse
 * into a drawer and the actions shrink to search + cart + menu.
 */
export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme(); // context
  const { notify } = useToast(); // context
  const user = useSelector(selectUser); // redux
  const cartCount = useSelector(selectCartCount);
  const savedCount = useSelector(selectWishlistCount);
  const categories = useSelector(selectCategories);

  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const catsRef = useRef(null);

  const realCategories = categories.filter((c) => c !== "all");

  // Stable identities: the overlays key their focus/scroll-lock effects off
  // onClose, and the navbar re-renders on every cart change. An inline arrow
  // here would re-run those effects — and re-steal focus — each time.
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Close the category flyout on outside click. Escape is handled on the
  // panel itself so it doesn't need a document-level key listener.
  useEffect(() => {
    if (!catsOpen) return;
    function onPointerDown(event) {
      if (!catsRef.current?.contains(event.target)) setCatsOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [catsOpen]);

  // In-app navigation closes overlays at the call site — every link inside
  // one already fires onClose. Browser back/forward doesn't go through any of
  // those, so it's handled here, and popstate is a real external event rather
  // than a render-triggered reset.
  useEffect(() => {
    function closeAll() {
      setCatsOpen(false);
      setMenuOpen(false);
      setSearchOpen(false);
    }
    window.addEventListener("popstate", closeAll);
    return () => window.removeEventListener("popstate", closeAll);
  }, []);

  function handleSignOut() {
    dispatch(loggedOut());
    dispatch(cartCleared()); // someone else's cart shouldn't survive a sign out
    notify("Signed out.");
    navigate("/login");
  }

  function goToCategory(category) {
    dispatch(categoryChanged(category));
    setCatsOpen(false);
    navigate("/products");
  }

  const navLink = ({ isActive }) =>
    `relative py-2 font-display text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-200 hover:text-ink hover:after:scale-x-100 ${
      isActive ? "text-ink after:scale-x-100" : "text-muted"
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
        <nav className="shell flex h-16 items-center gap-4 sm:h-[72px]" aria-label="Main">
          <Logo />

          {/* --- desktop links --- */}
          <div className="ml-10 hidden items-center gap-8 lg:flex">
            <NavLink to="/products" className={navLink} end>
              Shop
            </NavLink>

            <div className="relative" ref={catsRef}>
              <button
                type="button"
                onClick={() => setCatsOpen((v) => !v)}
                onKeyDown={(e) => e.key === "Escape" && setCatsOpen(false)}
                aria-expanded={catsOpen}
                aria-haspopup="true"
                disabled={realCategories.length === 0}
                className="flex items-center gap-1.5 py-2 font-display text-sm font-medium text-muted transition-colors hover:text-ink disabled:opacity-50"
              >
                Categories
                <ChevronDownIcon
                  width={14}
                  height={14}
                  className={`transition-transform duration-200 ${catsOpen ? "rotate-180" : ""}`}
                />
              </button>

              {catsOpen && realCategories.length > 0 && (
                <div
                  className="slide-down absolute left-0 top-full mt-3 w-60 overflow-hidden rounded-lg border border-line bg-surface p-1.5 shadow-[var(--shadow-md)]"
                  onKeyDown={(e) => e.key === "Escape" && setCatsOpen(false)}
                >
                  {realCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => goToCategory(category)}
                      className="block w-full rounded-md px-3 py-2.5 text-left font-display text-sm text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                    >
                      {categoryLabel(category)}
                    </button>
                  ))}

                  <div className="my-1.5 border-t border-line" />

                  <button
                    type="button"
                    onClick={() => goToCategory("all")}
                    className="block w-full rounded-md px-3 py-2.5 text-left font-display text-sm text-ink transition-colors hover:bg-surface-2"
                  >
                    Everything
                  </button>
                </div>
              )}
            </div>

            <NavLink to="/saved" className={navLink}>
              Saved
            </NavLink>
          </div>

          {/* --- actions --- */}
          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded-md p-2.5 text-muted transition-colors hover:text-ink"
              aria-label="Search products"
            >
              <SearchIcon width={19} height={19} />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="hidden rounded-md p-2.5 text-muted transition-colors hover:text-ink sm:block"
              aria-label={
                theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
              }
            >
              {theme === "dark" ? (
                <SunIcon width={19} height={19} />
              ) : (
                <MoonIcon width={19} height={19} />
              )}
            </button>

            <Link
              to="/saved"
              className="relative hidden rounded-md p-2.5 text-muted transition-colors hover:text-ink sm:block"
              aria-label={`Saved items, ${savedCount} item${savedCount === 1 ? "" : "s"}`}
            >
              <HeartIcon width={19} height={19} />
              {savedCount > 0 && <Badge>{savedCount}</Badge>}
            </Link>

            {/* Account state is explicit: a name when signed in, the word
                "Sign in" when not — never just an anonymous avatar. */}
            {user ? (
              <div className="hidden items-center gap-1 lg:flex">
                <span className="flex items-center gap-2 pl-3 pr-1 text-sm text-muted">
                  <UserIcon width={17} height={17} />
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="btn btn-ghost text-sm"
                >
                  Sign out
                </button>
              </div>
            ) : (
              // Wrapped rather than given `hidden lg:inline-flex` directly:
              // .btn sets display and would win over the utility.
              <div className="hidden lg:block">
                <Link to="/login" className="btn btn-ghost text-sm">
                  Sign in
                </Link>
              </div>
            )}

            <Link
              to="/cart"
              className="relative rounded-md p-2.5 text-muted transition-colors hover:text-ink"
              aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            >
              <CartIcon width={19} height={19} />
              {cartCount > 0 && <Badge>{cartCount}</Badge>}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="-mr-1 rounded-md p-2.5 text-muted transition-colors hover:text-ink lg:hidden"
              aria-label="Open menu"
            >
              <MenuIcon width={20} height={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mounted only while open — see useOverlay. */}
      {searchOpen && <SearchOverlay onClose={closeSearch} />}

      {menuOpen && (
        <MobileMenu
          onClose={closeMenu}
          categories={realCategories}
          onCategory={goToCategory}
          user={user}
          onSignOut={handleSignOut}
          savedCount={savedCount}
        />
      )}
    </>
  );
}

// Small enough to live here — it's only ever a nav count.
function Badge({ children }) {
  return (
    <span
      className="nums absolute right-0.5 top-0.5 min-w-[17px] rounded-full bg-accent px-1 text-center text-[10px] font-semibold leading-[17px] text-white"
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
