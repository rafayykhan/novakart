import { Link } from "react-router-dom";
import { CheckIcon, CloseIcon, AlertIcon } from "./Icons";

/**
 * Dumb component — ToastProvider owns the state and renders this.
 *
 * Deliberately not a modal: adding something to the cart shouldn't take over
 * the page. It sits bottom-left on desktop, bottom-centre on mobile, and
 * carries at most one follow-up action.
 */
export default function Toaster({ toasts, onDismiss }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:left-6 sm:bottom-6 sm:items-start sm:p-0"
      role="status"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => {
        const isError = toast.tone === "error";

        return (
          <div
            key={toast.id}
            className="rise pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-sm border border-line bg-surface px-4 py-3 shadow-[var(--shadow-md)] sm:w-auto sm:min-w-[20rem]"
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                isError ? "bg-danger/10 text-danger" : "bg-success/10 text-success"
              }`}
            >
              {isError ? (
                <AlertIcon width={14} height={14} />
              ) : (
                <CheckIcon width={13} height={13} />
              )}
            </span>

            <p className="min-w-0 flex-1 truncate text-sm text-ink">{toast.message}</p>

            {toast.action && (
              <Link
                to={toast.action.to}
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 whitespace-nowrap font-display text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
              >
                {toast.action.label}
              </Link>
            )}

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="-mr-1 shrink-0 rounded p-1 text-faint transition-colors hover:text-ink"
              aria-label="Dismiss notification"
            >
              <CloseIcon width={14} height={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
