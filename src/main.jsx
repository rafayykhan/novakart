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
// then theme, then toasts, then the router.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
