import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { load, save } from "../app/storage";

/**
 * Theme lives in Context, not Redux.
 * Reason: it's UI-only state, nothing else in the app derives from it, and
 * it changes on one click from one button. Putting it in the store would be
 * a slice with a single boolean in it.
 */
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Cream is the brand. Dark is a designed alternative, not the default.
  const [theme, setTheme] = useState(() => load("novakart_theme", "light"));

  // index.css keys every colour off this attribute
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    save("novakart_theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  // memo so every consumer doesn't re-render when the provider's parent does
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme has to be used inside <ThemeProvider>");
  }
  return ctx;
}
