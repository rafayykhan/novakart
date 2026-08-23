import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login } from "../../api/shopApi";
import { load } from "../../app/storage";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      return await login(credentials);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  user: load("novakart_user", null), // stay logged in across refreshes
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedOut(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
    // so a stale error doesn't sit on the form while you're retyping
    errorCleared(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Login failed. Try again.";
      });
  },
});

export const { loggedOut, errorCleared } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => Boolean(state.auth.user);
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
