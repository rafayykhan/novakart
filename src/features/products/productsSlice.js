import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { getProducts } from "../../api/shopApi";

// This is the createAsyncThunk one. It gives me three action types for free
// (pending / fulfilled / rejected) which I handle in extraReducers below.
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await getProducts();
    } catch (err) {
      // whatever I return here lands in action.payload of the rejected case
      return rejectWithValue(err.message);
    }
  }
);

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
];

// Fixed bands rather than a range slider: with a catalogue this size a
// two-handle slider is a lot of interaction for four meaningful buckets.
export const PRICE_BANDS = [
  { value: "any", label: "Any price", test: () => true },
  { value: "under-25", label: "Under $25", test: (p) => p < 25 },
  { value: "25-100", label: "$25 – $100", test: (p) => p >= 25 && p <= 100 },
  { value: "over-100", label: "Over $100", test: (p) => p > 100 },
];

const bandTest = (value) =>
  (PRICE_BANDS.find((b) => b.value === value) ?? PRICE_BANDS[0]).test;

const initialState = {
  items: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  category: "all",
  sort: "featured",
  query: "",
  priceBand: "any",
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    categoryChanged(state, action) {
      state.category = action.payload;
    },
    sortChanged(state, action) {
      state.sort = action.payload;
    },
    queryChanged(state, action) {
      state.query = action.payload;
    },
    priceBandChanged(state, action) {
      state.priceBand = action.payload;
    },
    filtersCleared(state) {
      state.category = "all";
      state.sort = "featured";
      state.query = "";
      state.priceBand = "any";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Couldn't load the catalogue.";
      });
  },
});

export const {
  categoryChanged,
  sortChanged,
  queryChanged,
  priceBandChanged,
  filtersCleared,
} = productsSlice.actions;

// selectors - keeping them next to the slice so components never reach
// into the state shape directly
export const selectAllProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectCategory = (state) => state.products.category;
export const selectSort = (state) => state.products.sort;
export const selectQuery = (state) => state.products.query;
export const selectPriceBand = (state) => state.products.priceBand;

export const selectFiltersActive = (state) =>
  state.products.category !== "all" ||
  state.products.priceBand !== "any" ||
  state.products.query.trim() !== "";

// createSelector because these derive new arrays. Without memoising, every
// dispatch anywhere (adding to the cart, a toast) would hand useSelector a
// fresh array reference and re-render every subscriber.
export const selectCategories = createSelector([selectAllProducts], (items) => [
  "all",
  ...new Set(items.map((p) => p.category)),
]);

// Not memoised on purpose: it returns an object that already lives in the
// store, so the reference is stable and useSelector won't re-render on it.
export const selectProductById = (id) => (state) =>
  state.products.items.find((p) => String(p.id) === String(id));

// One representative product per category, used by the category tiles so the
// artwork is always a real product rather than a stock photo.
export const selectCategoryPreviews = createSelector([selectAllProducts], (items) => {
  const seen = new Map();
  for (const p of items) {
    if (!seen.has(p.category)) {
      seen.set(p.category, { category: p.category, image: p.image, count: 1 });
    } else {
      seen.get(p.category).count += 1;
    }
  }
  return [...seen.values()];
});

const applySort = (list, sort) => {
  switch (sort) {
    case "price-asc":
      return [...list].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...list].sort((a, b) => b.price - a.price);
    case "name-asc":
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    default:
      // "featured" = the order the API sent, which is the only ordering the
      // data actually supports. Nothing here is ranked by sales.
      return list;
  }
};

const matches = (product, query) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    product.title.toLowerCase().includes(q) ||
    product.category.toLowerCase().includes(q)
  );
};

// Exported as a plain function rather than a selector factory: the search
// overlay holds its own draft query in local state, so it memoises this with
// useMemo instead of pushing every keystroke through the store.
export const searchProducts = (items, query) =>
  query.trim() ? items.filter((p) => matches(p, query)) : [];

export const selectVisibleProducts = createSelector(
  [selectAllProducts, selectCategory, selectSort, selectQuery, selectPriceBand],
  (items, category, sort, query, priceBand) => {
    const inBand = bandTest(priceBand);

    const filtered = items.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        inBand(p.price) &&
        matches(p, query)
    );

    return applySort(filtered, sort);
  }
);

export default productsSlice.reducer;
