import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { getProducts } from "../../api/shopApi";
import { DEPARTMENTS, buildMenu } from "./taxonomy";

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
  { value: "rating-desc", label: "Top Rated" },
  { value: "name-asc", label: "Name: A–Z" },
];

export const PRICE_BANDS = [
  { value: "any", label: "Any price", test: () => true },
  { value: "under-25", label: "Under $25", test: (p) => p < 25 },
  { value: "25-100", label: "$25 – $100", test: (p) => p >= 25 && p <= 100 },
  { value: "100-250", label: "$100 – $250", test: (p) => p > 100 && p <= 250 },
  { value: "over-250", label: "$250+", test: (p) => p > 250 },
];

const bandTest = (value) =>
  (PRICE_BANDS.find((b) => b.value === value) ?? PRICE_BANDS[0]).test;

const initialState = {
  items: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  category: "all", // a raw slug, or "all"
  department: "all", // a department id, or "all"
  sort: "featured",
  query: "",
  priceBand: "any",
  inStockOnly: false,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Picking a category clears any department filter and vice versa — they
    // are two ways of narrowing the same axis, and leaving both on produces
    // empty grids that look like a bug.
    categoryChanged(state, action) {
      state.category = action.payload;
      state.department = "all";
    },
    departmentChanged(state, action) {
      state.department = action.payload;
      state.category = "all";
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
    inStockOnlyToggled(state, action) {
      state.inStockOnly = action.payload ?? !state.inStockOnly;
    },
    filtersCleared(state) {
      state.category = "all";
      state.department = "all";
      state.sort = "featured";
      state.query = "";
      state.priceBand = "any";
      state.inStockOnly = false;
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
  departmentChanged,
  sortChanged,
  queryChanged,
  priceBandChanged,
  inStockOnlyToggled,
  filtersCleared,
} = productsSlice.actions;

/* ------------------------------- selectors ------------------------------ */

export const selectAllProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectCategory = (state) => state.products.category;
export const selectDepartment = (state) => state.products.department;
export const selectSort = (state) => state.products.sort;
export const selectQuery = (state) => state.products.query;
export const selectPriceBand = (state) => state.products.priceBand;
export const selectInStockOnly = (state) => state.products.inStockOnly;

export const selectFiltersActive = (state) =>
  state.products.category !== "all" ||
  state.products.department !== "all" ||
  state.products.priceBand !== "any" ||
  state.products.inStockOnly ||
  state.products.query.trim() !== "";

// createSelector because these derive new arrays. Without memoising, every
// dispatch anywhere (adding to the cart, a toast) would hand useSelector a
// fresh array reference and re-render every subscriber.
export const selectCategories = createSelector([selectAllProducts], (items) => [
  "all",
  ...new Set(items.map((p) => p.category)),
]);

/** Departments that actually contain products, with counts. */
export const selectMenu = createSelector([selectAllProducts], buildMenu);

// Not memoised on purpose: it returns an object that already lives in the
// store, so the reference is stable and useSelector won't re-render on it.
export const selectProductById = (id) => (state) =>
  state.products.items.find((p) => String(p.id) === String(id));

/**
 * One representative product per category, used by the category tiles so the
 * artwork is always a real product rather than a stock photo. Prefers an item
 * that's in stock and well rated, so departments don't lead with a sold-out
 * one-star listing.
 */
export const selectCategoryPreviews = createSelector([selectAllProducts], (items) => {
  const byCategory = new Map();

  for (const p of items) {
    const current = byCategory.get(p.category);
    if (!current) {
      byCategory.set(p.category, { hero: p, count: 1 });
      continue;
    }
    current.count += 1;
    const better =
      (p.inStock ? 1 : 0) - (current.hero.inStock ? 1 : 0) ||
      (p.rating ?? 0) - (current.hero.rating ?? 0);
    if (better > 0) current.hero = p;
  }

  return [...byCategory.entries()].map(([category, { hero, count }]) => ({
    category,
    label: hero.categoryLabel,
    image: hero.image,
    count,
  }));
});

/** Department-level tiles for the homepage showcase. */
export const selectDepartmentPreviews = createSelector(
  [selectAllProducts, selectMenu],
  (items, menu) =>
    menu.map((dept) => {
      const inDept = items.filter((p) =>
        dept.categories.some((c) => c.slug === p.category)
      );
      // Best-rated in-stock item stands in for the department.
      const hero = [...inDept].sort(
        (a, b) =>
          (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0) ||
          (b.rating ?? 0) - (a.rating ?? 0)
      )[0];

      return {
        id: dept.id,
        label: dept.label,
        tagline: dept.tagline,
        count: inDept.length,
        image: hero?.image ?? null,
      };
    })
);

const applySort = (list, sort) => {
  switch (sort) {
    case "price-asc":
      return [...list].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...list].sort((a, b) => b.price - a.price);
    case "rating-desc":
      return [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
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
    product.categoryLabel.toLowerCase().includes(q) ||
    (product.brand ?? "").toLowerCase().includes(q) ||
    product.tags.some((t) => t.toLowerCase().includes(q))
  );
};

// Exported as a plain function rather than a selector factory: the search
// overlay holds its own draft query in local state, so it memoises this with
// useMemo instead of pushing every keystroke through the store.
export const searchProducts = (items, query) =>
  query.trim() ? items.filter((p) => matches(p, query)) : [];

const departmentSlugs = (id) =>
  DEPARTMENTS.find((d) => d.id === id)?.categories ?? [];

export const selectVisibleProducts = createSelector(
  [
    selectAllProducts,
    selectCategory,
    selectDepartment,
    selectSort,
    selectQuery,
    selectPriceBand,
    selectInStockOnly,
  ],
  (items, category, department, sort, query, priceBand, inStockOnly) => {
    const inBand = bandTest(priceBand);
    const deptSlugs = department === "all" ? null : departmentSlugs(department);

    const filtered = items.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (!deptSlugs || deptSlugs.includes(p.category)) &&
        (!inStockOnly || p.inStock) &&
        inBand(p.price) &&
        matches(p, query)
    );

    return applySort(filtered, sort);
  }
);

export default productsSlice.reducer;
