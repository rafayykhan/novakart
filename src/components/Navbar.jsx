import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { loggedOut, selectUser } from "../features/auth/authSlice";
import { cartCleared, selectCartCount } from "../features/cart/cartSlice";
import { CartIcon, MoonIcon, SunIcon } from "./Icons";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // context
  const { notify } = useToast(); // context
  const user = useSelector(selectUser); // redux
  const count = useSelector(selectCartCount); // redux

  function handleSignOut() {
    dispatch(loggedOut());
    dispatch(cartCleared()); // someone else's cart shouldn't survive a sign out
    notify("Signed out.");
    navigate("/login");
  }

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-1.5 text-sm transition-colors ${
      isActive ? "bg-violet/15 text-ink" : "text-muted hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="gradient-bg h-7 w-7 rounded-lg" />
          <span className="font-display text-lg font-bold tracking-tight">
            Nova<span className="gradient-text">Kart</span>
          </span>
        </Link>

        <div className="ml-2 hidden items-center gap-1 sm:flex">
          <NavLink to="/" end className={linkClass}>
            Shop
          </NavLink>
          <NavLink to="/cart" className={linkClass}>
            Cart
          </NavLink>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-line p-2 text-muted transition-colors hover:text-ink"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <Link
            to="/cart"
            className="relative rounded-lg border border-line p-2 text-muted transition-colors hover:text-ink"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            <CartIcon />
            {count > 0 && (
              <span className="gradient-bg nums absolute -right-1.5 -top-1.5 min-w-[18px] rounded-full px-1 text-[11px] font-semibold leading-[18px] text-white">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2 pl-1">
              <span className="hidden text-sm text-muted sm:inline">{user.name}</span>
              <button
                onClick={handleSignOut}
                className="rounded-lg border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:text-ink"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="gradient-bg rounded-lg px-3 py-1.5 text-sm font-medium text-white"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
