import { Route, Routes } from "react-router-dom";
import AnnouncementBar from "./components/layout/AnnouncementBar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollManager from "./components/layout/ScrollManager";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Saved from "./pages/Saved";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollManager />

      {/* First thing in the tab order — the nav has a lot of links and a
          keyboard user shouldn't have to walk them on every route. */}
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <AnnouncementBar />
      <Navbar />

      <main id="main" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/login" element={<Login />} />
          <Route path="/help" element={<Help />} />

          {/* everything nested in here needs a signed-in user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
