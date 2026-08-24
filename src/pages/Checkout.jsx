import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CartSummary from "../components/cart/CartSummary";
import EmptyState from "../components/ui/EmptyState";
import { CheckIcon, ShieldIcon } from "../components/Icons";
import { useToast } from "../context/ToastContext";
import { cartCleared, selectCartItems } from "../features/cart/cartSlice";
import { selectUser } from "../features/auth/authSlice";
import { money } from "../utils/format";

/**
 * Checkout.
 *
 * This is the one page where the design gets quieter on purpose — no serif,
 * no editorial composition, one column of clearly labelled fields and the
 * summary pinned alongside. Confidence here comes from legibility, not
 * art direction.
 *
 * There is no payment step, and the page says so rather than dressing up a
 * card form that goes nowhere. Everything above it is real: the address is
 * validated, and the totals are the same ones the cart showed.
 *
 * Only reachable through ProtectedRoute, so `user` is guaranteed here.
 */

const FIELDS = [
  { name: "name", label: "Full name", autoComplete: "name", section: "shipping" },
  { name: "address", label: "Address", autoComplete: "address-line1", section: "shipping" },
  {
    name: "address2",
    label: "Apartment, suite, etc.",
    autoComplete: "address-line2",
    section: "shipping",
    optional: true,
  },
  { name: "city", label: "City", autoComplete: "address-level2", section: "shipping", half: true },
  { name: "postcode", label: "Postal code", autoComplete: "postal-code", section: "shipping", half: true },
  { name: "country", label: "Country", autoComplete: "country-name", section: "shipping" },
];

export default function Checkout() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const user = useSelector(selectUser);
  const { notify } = useToast();

  const [order, setOrder] = useState(null);
  const [values, setValues] = useState(() => ({
    email: user?.email ?? "",
    name: user?.name ?? "",
    address: "",
    address2: "",
    city: "",
    postcode: "",
    country: "",
  }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const formRef = useRef(null);

  // Snapshot for the confirmation screen — the cart is emptied on submit, so
  // the totals have to be captured before that happens.
  const placedTotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  function validate(next = values) {
    const found = {};

    if (!next.email.trim()) found.email = "Enter an email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(next.email.trim()))
      found.email = "That doesn't look like an email address.";

    for (const field of FIELDS) {
      if (field.optional) continue;
      if (!next[field.name].trim()) found[field.name] = `Enter a ${field.label.toLowerCase()}.`;
    }

    return found;
  }

  function handleChange(name, value) {
    const next = { ...values, [name]: value };
    setValues(next);
    // Re-validate only fields already blurred, so errors appear after a first
    // attempt and then clear live as they're fixed.
    if (touched[name]) setErrors(validate(next));
  }

  function handleBlur(name) {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate());
  }

  function placeOrder(event) {
    event.preventDefault();

    const found = validate();
    setErrors(found);
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])));

    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      notify("Check the highlighted fields.", "error");
      return;
    }

    // No payment provider here - just mint an id and empty the cart.
    setOrder({
      id: "NK-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      email: values.email.trim(),
      total: placedTotal,
    });
    dispatch(cartCleared());
    notify("Order placed.");
  }

  /* ---------------- confirmation ---------------- */

  if (order) {
    return (
      <div className="shell py-20 sm:py-28">
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink text-bg">
            <CheckIcon width={22} height={22} />
          </span>

          <p className="eyebrow mt-8">Confirmed</p>
          <h1 className="t-section mt-3 text-ink">Order placed.</h1>

          <p className="t-lead mt-5">
            Reference <span className="nums text-ink">{order.id}</span>. A
            confirmation would go to{" "}
            <span className="text-ink">{order.email}</span>.
          </p>

          <p className="mt-6 rounded-md border border-line bg-surface-2 p-4 text-sm leading-relaxed text-muted">
            To be clear: this is a portfolio build. Nothing was charged, nothing
            was shipped, and no email was sent.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/products" className="btn btn-primary">
              Back to the shop
            </Link>
            <Link to="/help#about" className="btn btn-secondary">
              How this works
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- nothing to buy ---------------- */

  if (items.length === 0) {
    return (
      <EmptyState
        eyebrow="Checkout"
        title="There's nothing to check out."
        description="Your cart is empty, so there's no order to place yet."
        actionLabel="Browse the shop"
        actionTo="/products"
      />
    );
  }

  /* ---------------- the form ---------------- */

  return (
    <div className="shell py-12 sm:py-16">
      <div className="border-b border-line pb-6">
        <p className="eyebrow">Checkout</p>
        <h1 className="t-section mt-3 text-ink">Where's it going?</h1>
      </div>

      {/* min-w-0 on both columns: a grid item's automatic minimum is its
          content's min-content width, and nowrap text inside (the order
          lines) pushes that past the viewport on a phone. */}
      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
        <form ref={formRef} onSubmit={placeOrder} noValidate className="min-w-0">
          {/* --- contact --- */}
          <Section number="1" title="Contact">
            <Field
              name="email"
              type="email"
              label="Email"
              autoComplete="email"
              value={values.email}
              error={touched.email && errors.email}
              onChange={handleChange}
              onBlur={handleBlur}
              hint="Where an order confirmation would be sent."
            />
          </Section>

          {/* --- shipping --- */}
          <Section number="2" title="Shipping address">
            <div className="grid gap-5 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <div key={field.name} className={field.half ? "" : "sm:col-span-2"}>
                  <Field
                    {...field}
                    value={values[field.name]}
                    error={touched[field.name] && errors[field.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              ))}
            </div>
          </Section>

          {/* --- payment --- */}
          <Section number="3" title="Payment" last>
            <div className="flex items-start gap-4 rounded-md border border-line bg-surface-2 p-5">
              <ShieldIcon width={20} height={20} className="mt-0.5 shrink-0 text-muted" />
              <div className="text-sm leading-relaxed text-muted">
                <p className="font-medium text-ink">No payment is taken here.</p>
                <p className="mt-1.5">
                  NovaKart has no payment provider connected, so there's no card
                  form on this page — asking for card details we couldn't
                  process wouldn't be honest. Placing the order records it
                  locally and clears your cart.
                </p>
              </div>
            </div>
          </Section>

          <div className="mt-10 lg:hidden">
            <OrderLines items={items} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg mt-8 w-full">
            Place order · {money(placedTotal)}
          </button>
        </form>

        {/* --- summary --- */}
        <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <CartSummary heading="Your order">
            <div className="mt-6 hidden lg:block">
              <OrderLines items={items} compact />
            </div>
          </CartSummary>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Section({ number, title, children, last = false }) {
  return (
    <section className={last ? "" : "mb-12"}>
      <h2 className="mb-6 flex items-center gap-3 font-display text-base font-semibold text-ink">
        <span
          className="nums flex h-6 w-6 items-center justify-center rounded-full border border-line-strong text-xs text-muted"
          aria-hidden="true"
        >
          {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  autoComplete,
  value,
  error,
  hint,
  optional,
  onChange,
  onBlur,
}) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;

  return (
    <div>
      <label htmlFor={name} className="label">
        {label}
        {optional && <span className="ml-1.5 normal-case text-faint">(optional)</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={() => onBlur(name)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className="field"
      />

      {error ? (
        <p id={errorId} className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="mt-2 text-xs text-faint">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function OrderLines({ items, compact = false }) {
  return (
    <div className={compact ? "" : "rounded-md border border-line p-5"}>
      {!compact && <p className="eyebrow mb-4">In this order</p>}

      <ul className={compact ? "space-y-3 border-t border-line pt-5" : "space-y-3"}>
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 text-sm">
            <span className="nums w-7 shrink-0 text-faint">×{item.qty}</span>
            {/* Truncated in the narrow sidebar, wrapped in the full-width
                mobile block — there's room for two lines there, and a title
                cut off mid-word right above the Place order button is a poor
                last thing to read. */}
            <span
              className={`min-w-0 flex-1 text-muted ${compact ? "truncate" : "break-words"}`}
            >
              {item.title}
            </span>
            <span className="nums shrink-0 text-ink">
              {money(item.price * item.qty)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
