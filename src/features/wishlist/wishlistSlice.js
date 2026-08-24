import { createSlice } from "@reduxjs/toolkit";
import { load } from "../../app/storage";

/**
 * Saved items.
 *
 * There's no accounts backend here, so this is honestly what it looks like:
 * a list of product ids kept on the device, persisted to localStorage the
 * same way the cart is. It does not sync anywhere and the UI says so on the
 * saved-items page rather than implying a server-side wishlist.
 */
const initialState = {
  ids: load("novakart_wishlist", []),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    wishlistToggled(state, action) {
      const id = action.payload;
      const at = state.ids.indexOf(id);
      if (at === -1) {
        state.ids.push(id);
      } else {
        state.ids.splice(at, 1);
      }
    },
    wishlistRemoved(state, action) {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
    wishlistCleared(state) {
      state.ids = [];
    },
  },
});

export const { wishlistToggled, wishlistRemoved, wishlistCleared } =
  wishlistSlice.actions;

export const selectWishlistIds = (state) => state.wishlist.ids;
export const selectWishlistCount = (state) => state.wishlist.ids.length;
export const selectIsWishlisted = (id) => (state) => state.wishlist.ids.includes(id);

export default wishlistSlice.reducer;
