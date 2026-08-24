import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Everything a modal surface needs to behave: scroll lock, focus moved in,
 * Tab trapped inside, Escape to close, and focus handed back to whatever
 * opened it. Shared by the search overlay, the filter drawer and the mobile
 * menu so all three behave identically for keyboard users.
 *
 * There's no `open` argument by design — callers mount the overlay only while
 * it's open. That keeps this hook to one code path, and it means each panel's
 * own state (the search field's draft query) resets on close for free instead
 * of needing an effect to clear it.
 *
 * Returns a ref to spread onto the panel element.
 */
export function useOverlay(onClose) {
  const ref = useRef(null);
  const restoreTo = useRef(null);

  // Scroll lock. Compensating for the scrollbar width stops the page behind
  // the overlay jumping sideways as it disappears.
  useEffect(() => {
    const { body, documentElement } = document;
    const gap = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, []);

  // Focus management + key handling.
  useEffect(() => {
    restoreTo.current = document.activeElement;

    // Focus moves in synchronously. This used to wait a frame via
    // requestAnimationFrame "to be safe", which was both unnecessary — refs
    // are attached before effects run, so the panel is already in the DOM —
    // and actively harmful: rAF callbacks don't fire while the page isn't
    // painting (background tab, throttled renderer), so the overlay would
    // open with focus left behind on the trigger and no way to notice.
    // preventScroll stops the browser jumping to an element still sliding in.
    const node = ref.current;
    if (node) {
      const first = node.querySelector(FOCUSABLE);
      (first ?? node).focus({ preventScroll: true });
    }

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const node = ref.current;
      if (!node) return;

      const items = [...node.querySelectorAll(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      // Wrap around at both ends, and pull focus back in if it has escaped
      // the panel entirely (browser chrome, address bar round trip).
      if (event.shiftKey && (document.activeElement === first || !node.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);

      const target = restoreTo.current;
      const active = document.activeElement;

      // Hand focus back to whatever opened this.
      //
      // Both conditions are needed because the cleanup can run on either side
      // of React removing the panel from the DOM. Before removal, focus is
      // still on a control *inside* the panel; after, the browser has already
      // dropped it to <body>. Checking only for <body> — as this did first —
      // meant the common case (focus inside, panel not yet removed) silently
      // skipped the restore and left focus on nothing at all.
      const focusWasInside = node ? node.contains(active) : false;
      const focusIsLoose = !active || active === document.body;

      if (target && document.contains(target) && (focusWasInside || focusIsLoose)) {
        target.focus({ preventScroll: true });
      }
    };
  }, [onClose]);

  return ref;
}
