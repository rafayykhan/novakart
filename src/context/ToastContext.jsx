import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import Toaster from "../components/Toaster";

/**
 * Same call as the theme: toasts are throwaway UI state. Any component can
 * grab notify() from here without wiring an action through the store.
 */
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));

    // clear the pending timer too, otherwise it fires on a toast that's gone
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const notify = useCallback(
    (message, tone = "info") => {
      const id = crypto.randomUUID();
      setToasts((list) => [...list, { id, message, tone }]);
      timers.current.set(id, setTimeout(() => dismiss(id), 2600));
    },
    [dismiss]
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast has to be used inside <ToastProvider>");
  }
  return ctx;
}
