import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />

          {/* everything nested in here needs a signed-in user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="border-t border-line px-4 py-6 text-center text-xs text-muted sm:px-6">
        NovaKart — built while working through the Chai aur Code React series.
      </footer>
    </div>
  );
}
