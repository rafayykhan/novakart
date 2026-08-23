import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../context/ToastContext";
import {
  errorCleared,
  loginUser,
  selectAuthError,
  selectAuthStatus,
  selectIsLoggedIn,
} from "../features/auth/authSlice";
import { DEMO_CREDENTIALS } from "../api/shopApi";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { notify } = useToast();

  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [form, setForm] = useState({ email: "", password: "" });

  // where ProtectedRoute wanted to send them before the redirect
  const from = location.state?.from ?? "/";

  useEffect(() => {
    if (isLoggedIn) navigate(from, { replace: true });
  }, [isLoggedIn, from, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (error) dispatch(errorCleared());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // unwrap() re-throws the rejected payload so I can react right here
      const user = await dispatch(loginUser(form)).unwrap();
      notify(`Welcome back, ${user.name}.`);
    } catch {
      // the error is already in the store, the form below renders it
      notify("Login failed.", "error");
    }
  }

  const busy = status === "loading";

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Account</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
        Sign in to <span className="gradient-text">NovaKart</span>
      </h1>
      <p className="mt-2 text-sm text-muted">
        The cart is public. Checkout needs an account.
      </p>

      <form onSubmit={handleSubmit} className="panel mt-8 rounded-2xl p-6">
        <label className="block text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-lg border border-line bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted/60"
        />

        <label className="mt-5 block text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          className="mt-2 w-full rounded-lg border border-line bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted/60"
        />

        {error && (
          <p className="mt-4 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="gradient-bg mt-6 w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <button
          type="button"
          onClick={() => setForm(DEMO_CREDENTIALS)}
          className="mt-3 w-full rounded-lg border border-line py-2.5 text-sm text-muted transition-colors hover:text-ink"
        >
          Fill the demo account
        </button>
      </form>

      <p className="nums mt-4 text-center text-xs text-muted">
        {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
      </p>
    </div>
  );
}
