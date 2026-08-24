import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] items-center py-20">
      <div className="max-w-lg">
        {/* Big, quiet, and set in the display face rather than dressed up in
            a gradient — the page is an apology, not a feature. */}
        <p
          className="font-display text-[clamp(4rem,14vw,9rem)] font-bold leading-none tracking-tighter text-line-strong"
          aria-hidden="true"
        >
          404
        </p>

        <h1 className="t-sub mt-6 text-ink">That page isn't here.</h1>

        <p className="t-lead measure mt-4">
          The address may be wrong, or whatever was here has moved. The
          catalogue is short — it's easy enough to find your way back.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link to="/products" className="btn btn-primary">
            Browse the shop
          </Link>
          <Link to="/" className="btn btn-secondary">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
