// Dumb component - ToastProvider owns the state and renders this.
export default function Toaster({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 left-1/2 z-50 flex w-[min(92vw,26rem)] -translate-x-1/2 flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <button
          key={toast.id}
          onClick={() => onDismiss(toast.id)}
          className="panel rise flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm shadow-lg"
        >
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              toast.tone === "error" ? "bg-rose-400" : "gradient-bg"
            }`}
          />
          <span className="flex-1">{toast.message}</span>
          <span className="text-xs text-muted">dismiss</span>
        </button>
      ))}
    </div>
  );
}
