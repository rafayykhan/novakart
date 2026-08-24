import { useDispatch, useSelector } from "react-redux";
import {
  PRICE_BANDS,
  categoryChanged,
  priceBandChanged,
  selectCategories,
  selectCategory,
  selectPriceBand,
} from "../../features/products/productsSlice";
import { categoryLabel } from "../../utils/format";

/**
 * The filter inputs themselves, with no chrome around them — rendered inline
 * in the desktop sidebar and again inside the mobile sheet so both surfaces
 * are guaranteed to offer the same choices.
 *
 * They're radios, not buttons: only one category and one price band can apply
 * at a time, and radio semantics say that for free (arrow keys, group
 * announcement, selected state) instead of a pile of aria-pressed buttons.
 */
export default function FilterControls() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const category = useSelector(selectCategory);
  const priceBand = useSelector(selectPriceBand);

  return (
    <div className="space-y-10">
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
    </div>
  );
}

function Choice({ name, value, checked, onChange, label }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 py-1.5">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />

      {/* Selection is carried by the dot AND the text weight/colour, so it
          doesn't rest on a single colour cue. */}
      <span
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-line-strong transition-colors peer-checked:border-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-2"
        aria-hidden="true"
      >
        <span
          className={`h-2 w-2 rounded-full transition-transform ${
            checked ? "scale-100 bg-ink" : "scale-0"
          }`}
        />
      </span>

      <span
        className={`text-sm transition-colors ${
          checked ? "font-medium text-ink" : "text-muted group-hover:text-ink"
        }`}
      >
        {label}
      </span>
    </label>
  );
}
