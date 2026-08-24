import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectProductsError,
  selectProductsStatus,
} from "../features/products/productsSlice";

/**
 * Pulls the catalogue in once, on whichever route the visitor happened to
 * land on.
 *
 * It used to live in the products page, which meant deep-linking straight to
 * a product, the search overlay and the footer's category list all had an
 * empty store to work from. The `idle` guard keeps it to a single request for
 * the whole session — status only leaves `idle` once.
 */
export function useCatalogue() {
  const dispatch = useDispatch();
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [status, dispatch]);

  return {
    status,
    error,
    loading: status === "loading" || status === "idle",
    failed: status === "failed",
    ready: status === "succeeded",
    retry: () => dispatch(fetchProducts()),
  };
}
