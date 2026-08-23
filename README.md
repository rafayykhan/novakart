# NovaKart

A small storefront I built to actually use the state management stuff from the
Chai aur Code React series instead of just watching it. Products come from a real
API, the cart is Redux, the theme and the toasts are Context, and checkout is
behind a login.

Live demo: _(add your Vercel link here)_

---

## Running it

```bash
npm install
npm run dev
```

Then open the printed localhost URL.

Demo account (also on the login screen, and there's a button that fills it in):

```
demo@novakart.dev
chaiaurcode
```

## What's inside

| Requirement                        | Where it lives                                                     |
| ---------------------------------- | ------------------------------------------------------------------ |
| Context API for shared state       | `src/context/ThemeContext.jsx`, `src/context/ToastContext.jsx`      |
| Redux store with 2+ slices         | `src/app/store.js` — `auth`, `cart`, `products`                     |
| `createAsyncThunk` for an API call | `fetchProducts` in `productsSlice.js`, `loginUser` in `authSlice.js` |

Stack: React 19, Redux Toolkit, React Redux, React Router 7, Tailwind CSS 4, Vite.

## Why some state is in Context and some is in Redux

This was the part I actually had to think about, so writing it down:

**Context** holds the theme and the toast queue. Both are UI-only, both are read
by whoever happens to need them, and neither one feeds into anything else. The
theme is one boolean-ish string; a toast lives for 2.6 seconds and then it's
gone. Giving either of them a slice would mean a reducer, actions and selectors
to move one value around.

**Redux** holds the cart, the user and the catalogue. These are shared by
components that sit far apart in the tree (the navbar badge and the cart page
never talk to each other), they change through actions I want to be able to
name and replay in DevTools, and two of them are filled by async calls with
loading and error states worth modelling properly.

The short version I landed on: Context is for passing a value down, Redux is for
managing state that changes over time. Context alone would work here, it would
just mean writing the reducer plumbing by hand.

## Folder layout

```
src/
├── api/shopApi.js          network calls (real products, faked login)
├── app/
│   ├── store.js            configureStore + localStorage persistence
│   └── storage.js          try/catch wrapper around localStorage
├── context/
│   ├── ThemeContext.jsx    dark / light, flips data-theme on <html>
│   └── ToastContext.jsx    notify() from anywhere
├── features/
│   ├── auth/authSlice.js       loginUser thunk, loggedOut, selectors
│   ├── cart/cartSlice.js       add / inc / dec / remove / clear
│   └── products/productsSlice.js  fetchProducts thunk + category filter
├── components/             Navbar, ProductCard, CartRow, Receipt, ProtectedRoute…
└── pages/                  Products, Cart, Checkout, Login, NotFound
```

The `features/` grouping is the one Redux Toolkit's own docs push — everything a
slice needs (reducer, actions, selectors) sits in one file, so components never
have to know the state shape.

## How the app actually behaves

- **Products** — `fetchProducts` fires once on the first mount (`status === "idle"`).
  Loading shows skeleton cards, a failure shows the message plus a retry button.
  The category chips filter the list through a selector, no second request.
- **Cart** — lives in Redux and is written to localStorage on every change, so a
  refresh doesn't wipe it. Dropping a quantity to zero removes the row instead of
  leaving a dead line item.
- **Auth** — `loginUser` is a thunk over a fake API that resolves after 800ms so
  the loading state is actually visible. `unwrap()` in the form lets me await the
  result and react to it. The user is persisted too, so a refresh keeps you in.
- **Checkout** — sits behind `<ProtectedRoute>`. If you're signed out it redirects
  to `/login` and remembers where you were headed, then sends you back after
  signing in.
- **Theme** — every colour in `index.css` is a CSS variable keyed off
  `data-theme`, so the toggle swaps one attribute and the whole app follows.

## Things that bit me

- The cart badge sat on 1 forever because I counted `items.length` instead of
  summing quantities. Fixed in `selectCartCount`.
- I wrote `state.items.push(...)` expecting a lint error and got confused when it
  worked. Immer, inside `createSlice` only — the same line in a plain reducer is
  still a bug.
- `fetch` doesn't reject on a 404 or a 500. Without the `res.ok` check the thunk
  fulfils with garbage and the UI shows nothing with no error.
- `selectQtyOf(id)` returns a selector rather than being one, because
  `useSelector` only passes state. Took me a minute to see why the first version
  didn't work.
- My `notify` was recreated on every render at first, which re-ran an effect that
  depended on it. `useCallback` plus a `useMemo` on the context value fixed it.

## Still to do

- Move the fake login to a real backend
- Search on the products page
- Quantity limits, since right now you can order 400 backpacks
