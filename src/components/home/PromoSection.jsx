import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  categoryChanged,
  queryChanged,
  selectAllProducts,
} from "../../features/products/productsSlice";

/**
 * The one promotional block, and it promotes a category rather than a
 * discount. There are no sale prices in the catalogue, so "40% OFF" would be
 * a number invented for the sake of a red badge.
 *
 * The gradient the old design used everywhere gets its one appearance here,
 * as a thin accent rule — not as a section background.
 */
export default function PromoSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(selectAllProducts);

  const electronics = products.filter((p) => p.category === "electronics").slice(0, 4);

  // Nothing to show until the catalogue lands — better to render nothing than
  // a promo block full of grey rectangles.
  if (electronics.length < 3) return null;

  function open() {
    dispatch(queryChanged(""));
    dispatch(categoryChanged("electronics"));
    navigate("/products");
  }

  return (
    <section className="band">
      <div className="shell">
        <div className="relative overflow-hidden rounded-xl border border-line bg-surface">
          <span
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent to-accent-2"
            aria-hidden="true"
          />

          <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:p-16">
            <div>
              <p className="eyebrow">The desk edit</p>
              <h2 className="t-section mt-4 text-ink text-balance">
                Build your next setup.
              </h2>
              <p className="t-lead measure mt-5">
                Drives, displays and the rest of the electronics shelf — in one
                place, without the spec-sheet noise.
              </p>
              <button type="button" onClick={open} className="btn btn-primary mt-8">
                Shop electronics
              </button>
            </div>

            <ul className="grid grid-cols-4 gap-3">
              {electronics.map((product) => (
                <li key={product.id} className="media-plate aspect-square rounded-md">
                  <span className="flex h-full w-full items-center justify-center p-3 sm:p-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain"
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
