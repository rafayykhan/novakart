import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import EmptyState from "../components/ui/EmptyState";
import { useToast } from "../context/ToastContext";
import { cartCleared, selectCartCount, selectCartItems } from "../features/cart/cartSlice";
import { selectIsLoggedIn } from "../features/auth/authSlice";

export default function Cart() {
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notify } = useToast();

  if (items.length === 0) {
    return (
      <EmptyState
        eyebrow="Cart"
        title="Your cart is waiting."
        description="Nothing in it yet. The catalogue is short — it won't take long to find something."
        actionLabel="Continue shopping"
        actionTo="/products"
      />
    );
  }

  return (
    <div className="shell py-12 sm:py-16">
      <div className="flex items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow">Cart</p>
          <h1 className="t-section mt-3 text-ink">
            {count} {count === 1 ? "item" : "items"}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            dispatch(cartCleared());
            notify("Cart emptied.");
          }}
          className="pb-1 text-sm text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
        >
          Empty cart
        </button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
        {/* min-w-0 stops long product titles setting the grid column's
            intrinsic width and overflowing the page on narrow screens. */}
        <ul className="min-w-0">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </ul>

        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <CartSummary>
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="btn btn-primary mt-7 w-full"
            >
              Proceed to checkout
            </button>

            {/* Said here rather than discovered at the redirect. */}
            {!isLoggedIn && (
              <p className="mt-3.5 text-center text-xs text-muted">
                You'll be asked to sign in first.
              </p>
            )}
          </CartSummary>

          <Link
            to="/products"
            className="mt-6 block text-center text-sm text-muted transition-colors hover:text-ink"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
