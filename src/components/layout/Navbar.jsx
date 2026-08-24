import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { loggedOut, selectUser } from "../../features/auth/authSlice";
import { cartCleared, selectCartCount } from "../../features/cart/cartSlice";
import { selectWishlistCount } from "../../features/wishlist/wishlistSlice";
import {
  categoryChanged,
  departmentChanged,
  queryChanged,
  selectAllProducts,
  selectMenu,
  sortChanged,
} from "../../features/products/productsSlice";
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
import MegaMenu from "./MegaMenu";
import SearchOverlay from "../search/SearchOverlay";
import MobileMenu from "./MobileMenu";

/**
 * Primary navigation.
 *
 * Text-first and spacious — the only enclosed shapes up here are the count
 * badges, because a number needs something to sit in. A hairline underneath,
 * no shadow, no floating pill.
 */
export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, toggleTheme } = useTheme(); // context
  const { notify } = useToast(); // context
  const user = useSelector(selectUser); // redux
  const cartCount = useSelector(selectCartCount);
  const savedCount = useSelector(selectWishlistCount);
  const menu = useSelector(selectMenu);
  const products = useSelector(selectAllProducts);

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  const megaWrapRef = useRef(null);
  const closeTimer = useRef(null);

  // Stable identities: the overlays key their focus/scroll-lock effects off
  // onClose, and the navbar re-renders on every cart change. An inline arrow
  // would re-run those effects — and re-steal focus — each time.
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const closeMega = useCallback(() => setMegaOpen(false), []);

  // The mega-menu's feature slot: best-rated in-stock product in the catalogue.
  const feature = products.length
    ? [...products].sort(
        (a, b) =>
          (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0) || (b.rating ?? 0) - (a.rating ?? 0)
      )[0]
    : null;

  useEffect(() => {
    if (!megaOpen) return;
    function onPointerDown(event) {
      if (!megaWrapRef.current?.contains(event.target)) setMegaOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [megaOpen]);

  // Browser back/forward doesn't go through any link handler, so close here.
  useEffect(() => {
    function closeAll() {
      setMegaOpen(false);
      setMobileOpen(false);
      setSearchOpen(false);
    }
    window.addEventListener("popstate", closeAll);
    return () => window.removeEventListener("popstate", closeAll);
  }, []);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  function handleSignOut() {
    dispatch(loggedOut());
    dispatch(cartCleared()); // someone else's cart shouldn't survive a sign out
    notify("Signed out.");
    navigate("/login");
  }

  /** One entry point for every way the nav can send you to the catalogue. */
  function browse({ category, department, sort, productId } = {}) {
    setMegaOpen(false);
    setMobileOpen(false);

    if (productId) {
      navigate(`/product/${productId}`);
      return;
    }

    dispatch(queryChanged(""));
    if (department) dispatch(departmentChanged(department));
    else dispatch(categoryChanged(category ?? "all"));
    if (sort) dispatch(sortChanged(sort));

    navigate("/products");
  }

  const isShop = location.pathname.startsWith("/product");

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur-md">
        <nav
          className="shell flex h-[68px] items-center gap-4 lg:h-20"
          aria-label="Main"
        >
          <Logo size="md" />

          {/* --- desktop links --- */}
          <div className="ml-12 hidden items-center gap-9 xl:gap-11 lg:flex">
            <button
              type="button"
              onClick={() => browse({ category: "all" })}
              className="nav-link"
              data-active={isShop || undefined}
            >
              Shop
            </button>

            <div
              ref={megaWrapRef}
              onMouseEnter={() => {
                clearTimeout(closeTimer.current);
                if (menu.length) setMegaOpen(true);
              }}
              onMouseLeave={() => {
                closeTimer.current = setTimeout(() => setMegaOpen(false), 160);
              }}
            >
              <button
                type="button"
                onClick={() => menu.length && setMegaOpen((v) => !v)}
                aria-expanded={megaOpen}
                aria-haspopup="true"
                disabled={menu.length === 0}
                className="nav-link flex items-center gap-1.5 disabled:opacity-40"
                data-active={megaOpen || undefined}
              >
                Categories
                <ChevronDownIcon
                  width={13}
                  height={13}
                  className={`transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={() => browse({ category: "all", sort: "featured" })}
              className="nav-link"
            >
              New Arrivals
            </button>

            <button
              type="button"
              onClick={() => browse({ category: "all", sort: "rating-desc" })}
              className="nav-link"
            >
              Top Rated
            </button>
          </div>

          {/* --- actions --- */}
          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded-sm p-2.5 text-muted transition-colors hover:text-ink"
              aria-label="Search products"
            >
              <SearchIcon width={19} height={19} />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="hidden rounded-sm p-2.5 text-muted transition-colors hover:text-ink sm:block"
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

            {user ? (
              <div className="hidden items-center lg:flex">
                <Link
                  to="/checkout"
                  className="flex items-center gap-2 px-3 text-[13px] text-muted transition-colors hover:text-ink"
                >
                  <UserIcon width={17} height={17} />
                  {user.name}
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="btn btn-ghost text-[11px]"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden rounded-sm p-2.5 text-muted transition-colors hover:text-ink lg:block"
                aria-label="Sign in to your account"
              >
                <UserIcon width={19} height={19} />
              </Link>
            )}

            <Link
              to="/saved"
              className="relative hidden rounded-sm p-2.5 text-muted transition-colors hover:text-ink sm:block"
              aria-label={`Saved items, ${savedCount} item${savedCount === 1 ? "" : "s"}`}
            >
              <HeartIcon width={19} height={19} />
              {savedCount > 0 && <Badge>{savedCount}</Badge>}
            </Link>

            <Link
              to="/cart"
              className="relative rounded-sm p-2.5 text-muted transition-colors hover:text-ink"
              aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            >
              <CartIcon width={19} height={19} />
              {cartCount > 0 && <Badge>{cartCount}</Badge>}
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="-mr-1 rounded-sm p-2.5 text-muted transition-colors hover:text-ink lg:hidden"
              aria-label="Open menu"
            >
              <MenuIcon width={20} height={20} />
            </button>
          </div>
        </nav>

        {megaOpen && menu.length > 0 && (
          <div
            onMouseEnter={() => clearTimeout(closeTimer.current)}
            onMouseLeave={() => {
              closeTimer.current = setTimeout(() => setMegaOpen(false), 160);
            }}
          >
            <MegaMenu
              menu={menu}
              feature={feature}
              onPick={browse}
              onClose={closeMega}
            />
          </div>
        )}
      </header>

      {/* Mounted only while open — see useOverlay. */}
      {searchOpen && <SearchOverlay onClose={closeSearch} />}

      {mobileOpen && (
        <MobileMenu
          onClose={closeMobile}
          menu={menu}
          onBrowse={browse}
          user={user}
          onSignOut={handleSignOut}
          savedCount={savedCount}
          cartCount={cartCount}
        />
      )}
    </>
  );
}

function Badge({ children }) {
  return (
    <span
      className="nums absolute right-0.5 top-1 min-w-[16px] rounded-full bg-red-solid px-1 text-center font-display text-[10px] font-bold leading-4 text-white"
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
