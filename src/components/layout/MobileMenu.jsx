import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { categoryLabel } from "../../utils/format";
import { useOverlay } from "../../hooks/useOverlay";
import { ArrowRightIcon, CloseIcon, MoonIcon, SunIcon } from "../Icons";
import Logo from "./Logo";

/**
 * Full-height drawer from the right. Same overlay contract as search and the
 * filter sheet — scroll locked, focus trapped, Escape closes, focus restored.
 *
 * Type is larger than the desktop nav on purpose: these are thumb targets,
 * and a phone has the room for them.
 */
export default function MobileMenu({
  onClose,
  categories,
  onCategory,
  user,
  onSignOut,
  savedCount,
}) {
  const { theme, toggleTheme } = useTheme();
  const panelRef = useOverlay(onClose);

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="fade-in absolute inset-0 bg-black/45"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        tabIndex={-1}
        className="slide-in-right absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col border-l border-line bg-bg outline-none"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 rounded-md p-2 text-muted transition-colors hover:text-ink"
            aria-label="Close menu"
          >
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile">
          <Link
            to="/products"
            onClick={onClose}
            className="flex items-center justify-between border-b border-line py-4 font-display text-xl font-medium text-ink"
          >
            Shop
            <ArrowRightIcon width={17} height={17} className="text-faint" />
          </Link>

          <Link
            to="/saved"
            onClick={onClose}
            className="flex items-center justify-between border-b border-line py-4 font-display text-xl font-medium text-ink"
          >
            Saved
            {savedCount > 0 && (
              <span className="nums text-sm text-muted">{savedCount}</span>
            )}
          </Link>

          <Link
            to="/cart"
            onClick={onClose}
            className="flex items-center justify-between border-b border-line py-4 font-display text-xl font-medium text-ink"
          >
            Cart
            <ArrowRightIcon width={17} height={17} className="text-faint" />
          </Link>

          {categories.length > 0 && (
            <div className="pt-8">
              <p className="eyebrow">Categories</p>
              <ul className="mt-3">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      type="button"
                      onClick={() => {
                        onCategory(category);
                        onClose();
                      }}
                      className="w-full border-b border-line py-3.5 text-left text-[15px] text-muted transition-colors hover:text-ink"
                    >
                      {categoryLabel(category)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>

        <div className="shrink-0 border-t border-line px-5 py-5">
          <button
            type="button"
            onClick={toggleTheme}
            className="mb-4 flex w-full items-center gap-2.5 text-sm text-muted transition-colors hover:text-ink"
          >
            {theme === "dark" ? (
              <SunIcon width={17} height={17} />
            ) : (
              <MoonIcon width={17} height={17} />
            )}
            {theme === "dark" ? "Light theme" : "Dark theme"}
          </button>

          {user ? (
            <div className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-sm text-muted">
                Signed in as <span className="text-ink">{user.name}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="btn btn-secondary btn-sm shrink-0"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={onClose} className="btn btn-primary w-full">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
