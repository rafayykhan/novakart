# Notes

Rough notes I kept while going through the playlist. Mostly for me — leaving them
in the repo so future me doesn't have to rewatch a video for one line of syntax.

## Context

- `createContext()` → `<Ctx.Provider value={...}>` → `useContext(Ctx)`.
- Export a custom hook (`useTheme`, `useToast`) instead of the raw context. Then
  consumers can't forget the provider silently — the hook throws with a message
  that says what's wrong.
- Anything not memoised in `value` is a new object every render → every consumer
  re-renders. `useMemo` on the value, `useCallback` on the functions inside it.
- Context is not a state manager. It's a delivery pipe. The state still comes
  from `useState` / `useReducer` above it.

## Redux Toolkit

- `configureStore` already wires DevTools, thunk, and the immutability +
  serializability checks. No manual middleware setup.
- `createSlice` generates the action creators from the reducer keys. The action
  type is `sliceName/reducerName`, e.g. `cart/itemAdded`.
- Immer means you write mutations. Two rules: either mutate **or** return a new
  value, never both in the same reducer; and this only applies inside RTK.
- Naming: RTK docs prefer past-tense event names (`itemAdded`) over commands
  (`addItem`) — actions describe what happened, not what to do.
- Selectors go in the slice file. Components import `selectCartCount`, not
  `state.cart.items`, so the shape can change without touching the UI.

## createAsyncThunk

```js
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",     // action type prefix
  async (arg, thunkAPI) => { /* return data, or rejectWithValue(msg) */ }
);
```

- Gives three actions: `.pending`, `.fulfilled`, `.rejected`. Handle them in
  `extraReducers`, not `reducers` — the slice didn't define them.
- `rejectWithValue(x)` puts `x` on `action.payload`. Without it you get
  `action.error` with a stringified Error, which is usually not what you want to
  show a user.
- `dispatch(thunk()).unwrap()` returns a promise that resolves with the data or
  throws the rejected payload. That's how the login form knows to navigate.
- `status` as a string (`idle | loading | succeeded | failed`) beats
  `isLoading` + `isError` booleans — you can't accidentally be in two states.
- Guard the initial fetch with `status === "idle"` or StrictMode's double mount
  fires the request twice in dev.

## Router bits

- `<Outlet />` + a wrapper route = protected routes without repeating the check.
- `<Navigate replace />` so the redirect doesn't stack up in browser history.
- Pass `state={{ from }}` on the redirect to send someone back where they were.

## Tailwind v4

- No `tailwind.config.js` anymore. `@import "tailwindcss"` plus an `@theme`
  block in the CSS.
- Defining `--color-ink: var(--ink)` in `@theme` and setting `--ink` per
  `data-theme` gives theming for free — the utilities point at a variable that
  changes underneath them.
