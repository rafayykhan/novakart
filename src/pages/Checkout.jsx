import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Receipt from "../components/Receipt";
import { useToast } from "../context/ToastContext";
import { cartCleared, selectCartItems } from "../features/cart/cartSlice";
import { selectUser } from "../features/auth/authSlice";
import { money } from "../utils/format";

// Only reachable through ProtectedRoute, so `user` is guaranteed here.
export default function Checkout() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const user = useSelector(selectUser);
  const { notify } = useToast();
  const [orderId, setOrderId] = useState(null);

  function placeOrder() {
    // no payment provider here - just mint an id and empty the cart
    setOrderId("NK-" + Math.random().toString(36).slice(2, 8).toUpperCase());
    dispatch(cartCleared());
    notify("Order placed.");
  }

  if (orderId) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <span className="gradient-bg mx-auto block h-12 w-12 rounded-2xl" />
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">Order placed</h1>
        <p className="nums mt-2 text-sm text-muted">
          Reference {orderId} · confirmation sent to {user.email}
        </p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-lg border border-line px-5 py-2.5 text-sm transition-colors hover:text-ink"
        >
          Back to the shop
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">There's nothing to check out</h1>
        <Link
          to="/"
          className="gradient-bg mt-6 inline-block rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Checkout</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
        Signed in as {user.name}
      </h1>
      <p className="mt-2 text-sm text-muted">{user.email}</p>

      <ul className="panel mt-8 divide-y divide-line rounded-2xl px-5">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 py-3 text-sm">
            <span className="nums w-8 text-muted">×{item.qty}</span>
            <span className="line-clamp-1 flex-1">{item.title}</span>
            <span className="nums">{money(item.price * item.qty)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Receipt>
          <button
            onClick={placeOrder}
            className="gradient-bg mt-6 w-full rounded-lg py-2.5 text-sm font-semibold text-white"
          >
            Place order
          </button>
        </Receipt>
      </div>
    </div>
  );
}
