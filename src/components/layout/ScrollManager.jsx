import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Client-side routing doesn't reset the scroll position, so without this you
 * land halfway down a new page. Hash links (the footer's /help#shipping, the
 * hero's /#categories) scroll to their target instead — React Router won't
 * do that for you either.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Runs after the route has committed, so the target is already in the
      // DOM — no need to wait a frame for it, and waiting would mean the
      // scroll never happens on a page that isn't painting.
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}
