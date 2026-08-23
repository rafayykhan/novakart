import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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

const initialState = {
  items: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  category: "all",
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    categoryChanged(state, action) {
      state.category = action.payload;
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

export const { categoryChanged } = productsSlice.actions;

// selectors - keeping them next to the slice so components never reach
// into the state shape directly
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectCategory = (state) => state.products.category;

export const selectCategories = (state) => [
  "all",
  ...new Set(state.products.items.map((p) => p.category)),
];

export const selectVisibleProducts = (state) => {
  const { items, category } = state.products;
  if (category === "all") return items;
  return items.filter((p) => p.category === category);
};

export default productsSlice.reducer;
