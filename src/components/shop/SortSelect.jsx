import { useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SORT_OPTIONS,
  selectSort,
  sortChanged,
} from "../../features/products/productsSlice";
import { ChevronDownIcon } from "../Icons";

/**
 * A native <select> in a custom shell.
 *
 * A bespoke listbox would look marginally tidier and behave worse everywhere
 * that matters — mobile wheel pickers, screen readers, keyboard type-ahead.
 * Only the arrow is ours.
 *
 * Every option in the list actually reorders the grid; there's no "Relevance"
 * or "Newest" here because the payload carries neither.
 */
export default function SortSelect({ className = "" }) {
  const id = useId();
  const dispatch = useDispatch();
  const sort = useSelector(selectSort);

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Sort products
      </label>

      <select
        id={id}
        value={sort}
        onChange={(e) => dispatch(sortChanged(e.target.value))}
        className="w-full cursor-pointer appearance-none rounded-sm border border-line-strong bg-surface py-3 pl-3.5 pr-10 font-display text-[13px] font-semibold uppercase tracking-[0.04em] text-ink outline-none transition-colors hover:border-ink focus-visible:border-red"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDownIcon
        width={15}
        height={15}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
