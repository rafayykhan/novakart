import { createSlice } from "@reduxjs/toolkit";
import { load } from "../../app/storage";

const initialState = {
  items: load("novakart_cart", []), // [{ id, title, price, image, qty }]
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    itemAdded(state, action) {
      const product = action.payload;

      // Cards dispatch the bare product and mean "one". The product page has
      // a quantity stepper, so it passes { ...product, qty } - reading the
      // amount off the payload keeps both call sites on the same action.
      const amount = Math.max(1, Math.trunc(Number(product.qty) || 1));
      const existing = state.items.find((i) => i.id === product.id);

      // Immer lets me push/mutate here - it's still immutable underneath.
      if (existing) {
        existing.qty += amount;
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          qty: amount,
        });
      }
    },
    qtyIncreased(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.qty += 1;
    },
    qtyDecreased(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;

      // dropping to 0 should remove the row, not leave a dead line item
      if (item.qty === 1) {
        state.items = state.items.filter((i) => i.id !== action.payload);
      } else {
        item.qty -= 1;
      }
    },
    itemRemoved(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    cartCleared(state) {
      state.items = [];
    },
  },
});

export const { itemAdded, qtyIncreased, qtyDecreased, itemRemoved, cartCleared } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

// counts units, not rows - had this wrong at first and the badge stayed on 1
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.qty, 0);

export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

export const selectQtyOf = (id) => (state) =>
  state.cart.items.find((i) => i.id === id)?.qty ?? 0;

export default cartSlice.reducer;
