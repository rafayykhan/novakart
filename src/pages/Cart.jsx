import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CartRow from "../components/CartRow";
import Receipt from "../components/Receipt";
import { useToast } from "../context/ToastContext";
import { cartCleared, selectCartItems } from "../features/cart/cartSlice";

export default function Cart() {
  const items = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notify } = useToast();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">Nothing in the cart</h1>
        <p className="mt-2 text-sm text-muted">Pick something from the shop and it'll show up here.</p>
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-bold tracking-tight">Your cart</h1>
        <button
          onClick={() => {
            dispatch(cartCleared());
            notify("Cart emptied.");
          }}
          className="text-sm text-muted transition-colors hover:text-ink"
        >
          Empty cart
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <ul className="panel rounded-2xl px-5">
          {items.map((item) => (
            <CartRow key={item.id} item={item} />
          ))}
        </ul>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Receipt>
            <button
              onClick={() => navigate("/checkout")}
              className="gradient-bg mt-6 w-full rounded-lg py-2.5 text-sm font-semibold text-white"
            >
              Checkout
            </button>
          </Receipt>
        </div>
      </div>
    </div>
  );
}
