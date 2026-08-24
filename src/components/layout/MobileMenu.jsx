import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useOverlay } from "../../hooks/useOverlay";
import { ArrowRightIcon, ChevronDownIcon, CloseIcon, MoonIcon, SunIcon } from "../Icons";
import Logo from "./Logo";

/**
 * Full-height slide-over.
 *
 * Departments are accordions rather than a flat list of 24 categories — the
 * same grouping the desktop mega-menu uses, collapsed for a thumb. Same
 * overlay contract as search and the filter sheet: scroll locked, focus
 * trapped, Escape closes, focus restored.
 */
export default function MobileMenu({
  onClose,
  menu,
  onBrowse,
  user,
  onSignOut,
  savedCount,
  cartCount,
}) {
  const { theme, toggleTheme } = useTheme();
  const panelRef = useOverlay(onClose);
  const [openDept, setOpenDept] = useState(null);

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="fade-in absolute inset-0 bg-[#201e1d]/55"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        tabIndex={-1}
        className="slide-in-right absolute inset-y-0 right-0 flex w-[min(24rem,90vw)] flex-col border-l border-line bg-bg outline-none"
      >
        <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-line px-5">
          <Logo size="sm" />
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 rounded-sm p-2 text-muted transition-colors hover:text-ink"
            aria-label="Close menu"
          >
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile">
          <button
            type="button"
            onClick={() => onBrowse({ category: "all" })}
            className="flex w-full items-center justify-between border-b border-line py-4 text-left font-display text-lg font-bold uppercase tracking-[0.06em] text-ink"
          >
            Shop All
            <ArrowRightIcon width={17} height={17} className="text-faint" />
          </button>

          {menu.map((dept) => {
            const open = openDept === dept.id;
            return (
              <div key={dept.id} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpenDept(open ? null : dept.id)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between py-4 text-left font-display text-lg font-bold uppercase tracking-[0.06em] text-ink"
                >
                  {dept.label}
                  <ChevronDownIcon
                    width={17}
                    height={17}
                    className={`text-faint transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  />
                </button>

                {open && (
                  <ul className="pb-4">
                    <li>
                      <button
                        type="button"
                        onClick={() => onBrowse({ department: dept.id })}
                        className="w-full py-2.5 text-left text-[15px] text-ink underline decoration-line-strong underline-offset-4"
                      >
                        All {dept.label}
                        <span className="nums ml-2 text-xs text-faint">{dept.count}</span>
                      </button>
                    </li>
                    {dept.categories.map((cat) => (
                      <li key={cat.slug}>
                        <button
                          type="button"
                          onClick={() => onBrowse({ category: cat.slug })}
                          className="flex w-full items-baseline gap-2 py-2.5 text-left text-[15px] text-muted transition-colors hover:text-ink"
                        >
                          {cat.label}
                          <span className="nums text-xs text-faint">{cat.count}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => onBrowse({ category: "all", sort: "rating-desc" })}
            className="flex w-full items-center justify-between border-b border-line py-4 text-left font-display text-lg font-bold uppercase tracking-[0.06em] text-ink"
          >
            Top Rated
            <ArrowRightIcon width={17} height={17} className="text-faint" />
          </button>

          <div className="mt-8 space-y-1">
            <MiniLink to="/saved" onClose={onClose} count={savedCount}>
              Saved
            </MiniLink>
            <MiniLink to="/cart" onClose={onClose} count={cartCount}>
              Cart
            </MiniLink>
            <MiniLink to="/help" onClose={onClose}>
              Help &amp; Information
            </MiniLink>
          </div>
        </nav>

        <div className="shrink-0 border-t border-line px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
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

function MiniLink({ to, onClose, count, children }) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className="flex items-center justify-between py-2 text-[15px] text-muted transition-colors hover:text-ink"
    >
      {children}
      {count > 0 && <span className="nums text-xs text-faint">{count}</span>}
    </Link>
  );
}
