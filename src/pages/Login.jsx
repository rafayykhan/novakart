import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../context/ToastContext";
import {
  errorCleared,
  loginUser,
  selectAuthError,
  selectAuthStatus,
  selectIsLoggedIn,
} from "../features/auth/authSlice";
import { selectAllProducts } from "../features/products/productsSlice";
import { DEMO_CREDENTIALS } from "../api/shopApi";
import { AlertIcon } from "../components/Icons";
import Logo from "../components/layout/Logo";

/**
 * Split layout: a brand panel on the left, the form on the right.
 *
 * There are no social sign-in buttons. This app authenticates against one
 * hardcoded demo account — a row of Google/Apple/GitHub buttons that all did
 * nothing would look complete and be a lie, so the panel says plainly what
 * the one working account is.
 */
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { notify } = useToast();

  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const products = useSelector(selectAllProducts);

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
  const art = products[7] ?? products[0];

  return (
    <div className="grid min-h-[calc(100dvh-8rem)] lg:grid-cols-2">
      {/* --- brand panel --- */}
      <aside className="on-ink relative hidden flex-col justify-between p-12 lg:flex xl:p-16">
        <Logo onDark size="md" className="self-start" />

        <div className="max-w-md">
          <p className="t-quote text-[#f4efe6] text-balance">
            Less noise. Better products.
          </p>
          <p className="mt-6 text-[15px] leading-relaxed text-[#f4efe6]/70">
            Your cart works signed out. An account is only needed at the point
            of placing an order.
          </p>
        </div>

        {art ? (
          <div className="media-plate flex h-56 w-56 items-center justify-center rounded-lg p-10 xl:h-64 xl:w-64">
            <img
              src={art.image}
              alt=""
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <div className="h-56 w-56 rounded-lg bg-[#f4efe6]/10" aria-hidden="true" />
        )}
      </aside>

      {/* --- form --- */}
      <div className="flex items-center justify-center px-5 py-16 sm:px-8 lg:px-12">
        <div className="w-full max-w-sm">
          <p className="eyebrow lg:hidden">Account</p>

          <h1 className="t-sub mt-3 text-ink lg:mt-0">Sign in</h1>
          <p className="mt-3 text-sm text-muted">
            New here?{" "}
            <Link
              to="/products"
              className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
            >
              Have a look around first
            </Link>
            .
          </p>

          <form onSubmit={handleSubmit} className="mt-10" noValidate>
            <div>
              <label className="label" htmlFor="email">
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
                aria-invalid={Boolean(error)}
                className="field"
              />
            </div>

            <div className="mt-6">
              <div className="flex items-baseline justify-between">
                <label className="label" htmlFor="password">
                  Password
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "login-error" : undefined}
                className="field"
              />
            </div>

            {error && (
              <p
                id="login-error"
                role="alert"
                className="mt-5 flex items-start gap-2.5 rounded-md border border-danger/30 bg-danger/10 px-3.5 py-3 text-sm text-danger"
              >
                <AlertIcon width={16} height={16} className="mt-0.5 shrink-0" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="btn btn-primary btn-lg mt-8 w-full"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* The one working account, stated rather than hidden. */}
          <div className="mt-8 rounded-md border border-line bg-surface-2 p-4">
            <p className="text-xs leading-relaxed text-muted">
              <span className="text-ink">Demo account.</span> There's no user
              database behind this — one set of credentials works:
            </p>
            <p className="nums mt-2 font-mono text-xs text-ink">
              {DEMO_CREDENTIALS.email}
              <br />
              {DEMO_CREDENTIALS.password}
            </p>
            <button
              type="button"
              onClick={() => setForm(DEMO_CREDENTIALS)}
              className="btn btn-secondary btn-sm mt-4 w-full"
            >
              Fill it in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
