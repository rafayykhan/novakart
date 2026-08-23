import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import productsReducer from "../features/products/productsSlice";
import { save } from "./storage";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
  },
});

// Write the bits worth keeping back to localStorage after every dispatch.
// The catalogue is deliberately left out - it should come fresh from the API.
let lastCart = store.getState().cart.items;
let lastUser = store.getState().auth.user;

store.subscribe(() => {
  const { cart, auth } = store.getState();

  if (cart.items !== lastCart) {
    lastCart = cart.items;
    save("novakart_cart", cart.items);
  }

  if (auth.user !== lastUser) {
    lastUser = auth.user;
    save("novakart_user", auth.user);
  }
});
