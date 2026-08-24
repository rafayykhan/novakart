import { MinusIcon, PlusIcon } from "../Icons";

/**
 * Compact stepper. Deliberately small — quantity is a secondary decision and
 * oversized +/- controls make a cart look like a calculator.
 *
 * The live value is announced through aria-live so screen reader users hear
 * the change without the control stealing focus.
 */
export default function QuantitySelector({
  value,
  onIncrease,
  onDecrease,
  label,
  min = 1,
  size = "md",
}) {
  const pad = size === "sm" ? "p-1.5" : "p-2";
  const width = size === "sm" ? "w-7" : "w-9";

  return (
    <div className="inline-flex items-center rounded-md border border-line">
      <button
        type="button"
        onClick={onDecrease}
        disabled={value <= min}
        className={`${pad} rounded-l-md text-muted transition-colors hover:text-ink disabled:opacity-35 disabled:hover:text-muted`}
        aria-label={`Decrease quantity of ${label}`}
      >
        <MinusIcon width={14} height={14} />
      </button>

      <span
        className={`nums ${width} text-center text-sm tabular-nums`}
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        className={`${pad} rounded-r-md text-muted transition-colors hover:text-ink`}
        aria-label={`Increase quantity of ${label}`}
      >
        <PlusIcon width={14} height={14} />
      </button>
    </div>
  );
}
