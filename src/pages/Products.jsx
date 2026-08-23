import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import Skeleton from "../components/Skeleton";
import {
  categoryChanged,
  fetchProducts,
  selectCategories,
  selectCategory,
  selectProductsError,
  selectProductsStatus,
  selectVisibleProducts,
} from "../features/products/productsSlice";
import { titleCase } from "../utils/format";

export default function Products() {
  const dispatch = useDispatch();
  const products = useSelector(selectVisibleProducts);
  const categories = useSelector(selectCategories);
  const category = useSelector(selectCategory);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    // only the first mount hits the network - after that the store has it
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
        Catalogue · fetched live
      </p>
      <h1 className="mt-2 max-w-lg font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
        Twelve things, <span className="gradient-text">no upsells.</span>
      </h1>

      {categories.length > 1 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => dispatch(categoryChanged(c))}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                c === category
                  ? "border-transparent bg-violet/15 text-ink"
                  : "border-line text-muted hover:text-ink"
              }`}
            >
              {c === "all" ? "Everything" : titleCase(c)}
            </button>
          ))}
        </div>
      )}

      {status === "failed" && (
        <div className="panel mt-8 rounded-2xl p-6">
          <p className="font-medium">The catalogue didn't load.</p>
          <p className="mt-1 text-sm text-muted">{error}</p>
          <button
            onClick={() => dispatch(fetchProducts())}
            className="gradient-bg mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {status === "loading" && <Skeleton />}
        {status === "succeeded" &&
          products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
