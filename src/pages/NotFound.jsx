import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="gradient-text font-display text-6xl font-bold">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold">That page isn't here</h1>
      <p className="mt-2 text-sm text-muted">Check the address, or start again from the shop.</p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-lg border border-line px-5 py-2.5 text-sm transition-colors hover:text-ink"
      >
        Back to the shop
      </Link>
    </div>
  );
}
