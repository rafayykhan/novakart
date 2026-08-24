import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PRICE_BANDS,
  categoryChanged,
  departmentChanged,
  inStockOnlyToggled,
  priceBandChanged,
  selectAllProducts,
  selectCategories,
  selectCategory,
  selectDepartment,
  selectInStockOnly,
  selectMenu,
  selectPriceBand,
} from "../../features/products/productsSlice";
import { categoryLabel } from "../../utils/format";
import { CheckIcon } from "../Icons";

/**
 * The filter inputs themselves, with no chrome around them — rendered inline
 * in the desktop sidebar and again inside the mobile sheet so both surfaces
 * are guaranteed to offer the same choices.
 *
 * Department and category are radios: only one of each can apply at a time
 * (the reducer clears the other axis the moment either changes), and radio
 * semantics give arrow-key navigation and group announcement for free
 * instead of a pile of aria-pressed buttons. Availability is the one real
 * checkbox — it's independent of everything else.
 */
export default function FilterControls() {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const menu = useSelector(selectMenu);
  const categories = useSelector(selectCategories);
  const category = useSelector(selectCategory);
  const department = useSelector(selectDepartment);
  const priceBand = useSelector(selectPriceBand);
  const inStockOnly = useSelector(selectInStockOnly);

  // Counted from the live catalogue rather than trusted from anywhere else —
  // a stale number next to a filter is worse than no number at all.
  const categoryCounts = useMemo(() => {
    const counts = new Map();
    for (const p of products) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return counts;
  }, [products]);

  return (
    <div className="space-y-9">
      <fieldset>
        <legend className="eyebrow">Department</legend>
        <div className="mt-4 space-y-1">
          <Choice
            name="department"
            value="all"
            checked={department === "all"}
            onChange={() => dispatch(departmentChanged("all"))}
            label="All departments"
          />
          {menu.map((dept) => (
            <Choice
              key={dept.id}
              name="department"
              value={dept.id}
              checked={dept.id === department}
              onChange={() => dispatch(departmentChanged(dept.id))}
              label={dept.label}
              count={dept.count}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow">Category</legend>
        <div className="mt-4 space-y-1">
          {categories.map((value) => (
            <Choice
              key={value}
              name="category"
              value={value}
              checked={value === category}
              onChange={() => dispatch(categoryChanged(value))}
              label={categoryLabel(value)}
              count={value === "all" ? products.length : categoryCounts.get(value)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow">Price</legend>
        <div className="mt-4 space-y-1">
          {PRICE_BANDS.map((band) => (
            <Choice
              key={band.value}
              name="price"
              value={band.value}
              checked={band.value === priceBand}
              onChange={() => dispatch(priceBandChanged(band.value))}
              label={band.label}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow">Availability</legend>
        <div className="mt-4">
          <Choice
            shape="checkbox"
            name="in-stock"
            checked={inStockOnly}
            onChange={(e) => dispatch(inStockOnlyToggled(e.target.checked))}
            label="In stock only"
          />
        </div>
      </fieldset>
    </div>
  );
}

/**
 * One control, two shapes. `shape="checkbox"` renders a real checkbox (the
 * availability toggle doesn't share a group with anything); everything else
 * is a radio sharing `name` with its section. Either way, selection reads
 * from weight + a filled mark, never colour alone.
 */
function Choice({ name, value, checked, onChange, label, count, shape = "radio" }) {
  const isCheckbox = shape === "checkbox";

  return (
    <label className="group flex cursor-pointer items-center justify-between gap-3 py-1.5">
      <span className="flex min-w-0 items-center gap-3">
        <input
          type={isCheckbox ? "checkbox" : "radio"}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />

        {isCheckbox ? (
          <span
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-line-strong text-bg transition-colors peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-red"
            aria-hidden="true"
          >
            <CheckIcon
              width={10}
              height={10}
              strokeWidth={3}
              className={checked ? "opacity-100" : "opacity-0"}
            />
          </span>
        ) : (
          <span
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-line-strong transition-colors peer-checked:border-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-red"
            aria-hidden="true"
          >
            <span
              className={`h-2 w-2 rounded-full transition-transform ${
                checked ? "scale-100 bg-ink" : "scale-0"
              }`}
            />
          </span>
        )}

        <span
          className={`truncate text-sm transition-colors ${
            checked ? "font-medium text-ink" : "text-muted group-hover:text-ink"
          }`}
        >
          {label}
        </span>
      </span>

      {count != null && <span className="nums shrink-0 text-xs text-faint">{count}</span>}
    </label>
  );
}
