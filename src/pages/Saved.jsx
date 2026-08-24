import { useDispatch, useSelector } from "react-redux";
import ProductGrid from "../components/product/ProductGrid";
import EmptyState from "../components/ui/EmptyState";
import { ProductGridSkeleton } from "../components/ui/Skeleton";
import ErrorState from "../components/ui/ErrorState";
import { useCatalogue } from "../hooks/useCatalogue";
import { selectAllProducts } from "../features/products/productsSlice";
import { selectWishlistIds, wishlistCleared } from "../features/wishlist/wishlistSlice";

/**
 * Saved items.
 *
 * The wishlist stores ids only, so the products are resolved against the
 * catalogue on render. Anything saved that's no longer in the catalogue
 * simply doesn't appear — better a shorter list than a card with a missing
 * image and a blank price.
 */
export default function Saved() {
  const dispatch = useDispatch();
  const { loading, failed, error, retry } = useCatalogue();

  const ids = useSelector(selectWishlistIds);
  const products = useSelector(selectAllProducts);

  const saved = ids
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  if (!loading && !failed && ids.length === 0) {
    return (
      <EmptyState
        eyebrow="Saved"
        title="Nothing saved yet."
        description="Tap the heart on anything worth coming back to. It'll stay here on this device."
        actionLabel="Browse the shop"
        actionTo="/products"
      />
    );
  }

  return (
    <div className="shell py-12 sm:py-16">
      <div className="flex items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow">Saved</p>
          <h1 className="t-section mt-3 text-ink">
            {loading ? "Saved items" : `${saved.length} ${saved.length === 1 ? "item" : "items"}`}
          </h1>
        </div>

        {saved.length > 0 && (
          <button
            type="button"
            onClick={() => dispatch(wishlistCleared())}
            className="pb-1 text-sm text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
          >
            Clear all
          </button>
        )}
      </div>

      <p className="mt-5 text-sm text-muted">
        Kept in this browser only — there's no account sync behind it.
      </p>

      <div className="mt-10">
        {loading && <ProductGridSkeleton count={Math.min(ids.length || 4, 8)} />}

        {failed && (
          <ErrorState
            title="Your saved items couldn't be loaded."
            description="The catalogue didn't come back, so there's nothing to match your saved products against."
            detail={error}
            onRetry={retry}
          />
        )}

        {!loading && !failed && saved.length > 0 && <ProductGrid products={saved} />}

        {!loading && !failed && ids.length > 0 && saved.length === 0 && (
          <EmptyState
            eyebrow="Saved"
            title="None of these are in the catalogue anymore."
            description="The products you saved aren't in the current catalogue."
            actionLabel="Clear saved items"
            onAction={() => dispatch(wishlistCleared())}
          />
        )}
      </div>
    </div>
  );
}
