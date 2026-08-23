import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../context/ToastContext";
import { itemAdded, selectQtyOf } from "../features/cart/cartSlice";
import { money, titleCase } from "../utils/format";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { notify } = useToast();
  const qty = useSelector(selectQtyOf(product.id));

  function handleAdd() {
    dispatch(itemAdded(product));
    notify(`Added ${product.title.slice(0, 28)}${product.title.length > 28 ? "…" : ""}`);
  }

  return (
    <article className="panel flex flex-col gap-3 rounded-2xl p-3">
      {/* API images are PNGs on white, so they get a white tile in both themes */}
      <div className="flex h-40 items-center justify-center rounded-xl bg-white p-4">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="max-h-full max-w-full object-contain mix-blend-multiply"
        />
      </div>

      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
        {titleCase(product.category)}
      </p>

      <h3 className="line-clamp-2 text-sm font-medium leading-snug">{product.title}</h3>

      <div className="mt-auto flex items-center justify-between pt-1">
        <span className="nums font-display text-lg font-semibold">{money(product.price)}</span>
        <button
          onClick={handleAdd}
          className="gradient-bg rounded-lg px-3.5 py-2 text-sm font-medium text-white transition-transform active:scale-95"
        >
          {qty > 0 ? `In cart · ${qty}` : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
