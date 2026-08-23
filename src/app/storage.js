// Tiny localStorage wrapper. Wrapped in try/catch because private mode /
// disabled storage throws, and I'd rather lose the cart than crash the app.

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // nothing useful to do here
  }
}
