import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./app/store";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import "./index.css";

// Provider order: Redux outermost (contexts don't depend on it, but toasts
// get fired from components that read the store, so this keeps it simple),
// then theme, then the router, then toasts.
//
// The router HAS to sit above ToastProvider: the provider renders the Toaster
// itself, and an "Added to cart / View cart" toast contains a <Link>. With
// the router inside, that Link has no context and throws - which unmounts the
// whole app the first time anything is added to the cart.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <ToastProvider>
            <App />
          </ToastProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
