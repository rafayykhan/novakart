import { useEffect, useRef } from "react";

/**
 * Fades and lifts its children in once, when they first scroll into view.
 *
 * Deliberately not state-driven: the observer toggles a class directly, so a
 * page full of these costs no React renders while scrolling, and each one
 * disconnects after firing — a section that re-animates every time you scroll
 * past is the fastest way to make a site feel cheap.
 *
 * ## Why the gate
 *
 * The hidden state lives behind `:root[data-reveal="on"]` and is only armed
 * once we've SEEN an IntersectionObserver callback arrive. Hiding content up
 * front and trusting an observer to reveal it means that anywhere the observer
 * doesn't run — a page rendered without painting, an offscreen webview, a
 * preview crawler, an aggressively throttled background tab — the content is
 * simply never visible. A decorative animation must not be able to blank the
 * page. So: unarmed by default, armed only on proof of life, and disarmed
 * again if that proof never comes.
 */

// Module-level so all instances share one verdict rather than each running
// its own watchdog.
let armed = false;
let observerProven = false;
let watchdog = null;

function arm() {
  if (armed || typeof document === "undefined") return;
  armed = true;
  document.documentElement.dataset.reveal = "on";

  // If nothing has reported an observer callback shortly after arming, assume
  // observers don't work here and un-hide everything for good.
  watchdog = setTimeout(() => {
    if (!observerProven) disarm();
  }, 1500);
}

function disarm() {
  clearTimeout(watchdog);
  if (typeof document === "undefined") return;
  delete document.documentElement.dataset.reveal;

  // Anything mounting later finds the gate off and never hides. Anything
  // already mounted needs its in-flight transition killed rather than
  // reversed: if we're disarming, frames probably aren't being produced, and
  // a transition back to opacity 1 would never advance — leaving the element
  // stuck at whatever value it had when the paint loop stopped. `transition:
  // none` makes it snap instead.
  for (const el of document.querySelectorAll(".reveal")) {
    el.style.transition = "none";
    el.classList.add("in-view");
  }
}

function proveObserver() {
  if (observerProven) return;
  observerProven = true;
  clearTimeout(watchdog);
}

export default function Reveal({ children, as: Tag = "div", delay = 0, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const unsupported =
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (unsupported) {
      node.classList.add("in-view");
      return;
    }

    arm();

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Any callback at all — intersecting or not — proves observers run.
        proveObserver();
        if (!entry.isIntersecting) return;
        node.classList.add("in-view");
        observer.disconnect();
      },
      // Fire slightly before the element reaches the fold so the motion has
      // finished by the time it's properly in view.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
