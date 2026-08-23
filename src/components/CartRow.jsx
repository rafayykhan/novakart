import { useDispatch } from "react-redux";
import { itemRemoved, qtyDecreased, qtyIncreased } from "../features/cart/cartSlice";
import { MinusIcon, PlusIcon, TrashIcon } from "./Icons";
import { money } from "../utils/format";

export default function CartRow({ item }) {
  const dispatch = useDispatch();

  return (
    <li className="flex items-center gap-4 border-b border-line py-4 last:border-b-0">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-2">
        <img
          src={item.image}
          alt=""
          className="max-h-full max-w-full object-contain mix-blend-multiply"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
        <p className="nums text-sm text-muted">{money(item.price)} each</p>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-line p-1">
        <button
          onClick={() => dispatch(qtyDecreased(item.id))}
          className="rounded-md p-1.5 text-muted transition-colors hover:text-ink"
          aria-label={`Reduce quantity of ${item.title}`}
        >
          <MinusIcon width={14} height={14} />
        </button>
        <span className="nums w-6 text-center text-sm">{item.qty}</span>
        <button
          onClick={() => dispatch(qtyIncreased(item.id))}
          className="rounded-md p-1.5 text-muted transition-colors hover:text-ink"
          aria-label={`Increase quantity of ${item.title}`}
        >
          <PlusIcon width={14} height={14} />
        </button>
      </div>

      <span className="nums hidden w-20 text-right font-display font-semibold sm:block">
        {money(item.price * item.qty)}
      </span>

      <button
        onClick={() => dispatch(itemRemoved(item.id))}
        className="rounded-md p-2 text-muted transition-colors hover:text-rose-400"
        aria-label={`Remove ${item.title}`}
      >
        <TrashIcon />
      </button>
    </li>
  );
}
