import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectAllProducts,
  selectProductsStatus,
} from "../../features/products/productsSlice";
import { money } from "../../utils/format";
import { ArrowRightIcon } from "../Icons";

/**
 * Full-viewport editorial hero.
 *
 * Asymmetric on purpose — the type block sits left and slightly high, the
 * product composition falls right and slightly low, and the three plates are
 * different sizes at different vertical offsets. An even two-column split is
 * what makes a hero read as a layout rather than a campaign.
 *
 * There's no lifestyle photography in this project, and buying stock images of
 * a shop that doesn't exist would be worse than not having any, so real
 * catalogue products do the work. They're picked for visual variety — one
 * garment, one hard-goods item, one small object — and each one is a link.
 *
 * The parallax is deliberately tiny (max ~14px) and pointer-driven only. Type
 * never moves; text that drifts under the cursor is hostile to read.
 */
export default function Hero() {
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);

  const sectionRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    if (reduce.matches || !fine.matches) return;

    const node = sectionRef.current;
    if (!node) return;

    let frame = 0;
    function onMove(event) {
      // Coalesce to one update per frame — pointermove fires far more often
      // than the screen refreshes.
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = node.getBoundingClientRect();
        setTilt({
          x: (event.clientX - r.left) / r.width - 0.5,
          y: (event.clientY - r.top) / r.height - 0.5,
        });
      });
    }

    node.addEventListener("pointermove", onMove);
    return () => {
      node.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Three visually distinct picks spread across the catalogue rather than the
  // first three, which are all the same category.
  const showcase = pickShowcase(products);
  const loading = status === "loading" || status === "idle" || showcase.length < 3;

  const categoryCount = new Set(products.map((p) => p.category)).size;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col border-b border-line"
      aria-label="NovaKart — the new edit"
    >
      <div className="shell flex flex-1 items-center py-14 lg:py-20">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-16 xl:gap-24">
          {/* ------------------------------- copy ------------------------- */}
          <div className="min-w-0">
            <p className="eyebrow eyebrow-red flex items-center gap-3">
              <span className="h-px w-8 bg-red" aria-hidden="true" />
              The NovaKart Edit
            </p>

            <h1 className="t-hero mt-7 text-ink">
              Better
              <br />
              things.
              <br />
              {/* The one place the serif runs — and it's the half of the line
                  that's an opinion rather than a noun. */}
              <span className="t-quote block normal-case text-red">
                Chosen well.
              </span>
            </h1>

            <p className="t-lead measure mt-8">
              A curated edit of everyday essentials — shown properly, priced
              plainly, and never buried under six banners.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop the collection
                <ArrowRightIcon width={15} height={15} className="arrow" />
              </Link>
              <a href="#departments" className="btn btn-secondary btn-lg">
                Explore categories
              </a>
            </div>
          </div>

          {/* --------------------------- composition ---------------------- */}
          <div className="relative min-w-0">
            <div className="grid h-[26rem] grid-cols-5 grid-rows-6 gap-3 sm:h-[34rem] sm:gap-4 lg:h-[38rem] xl:h-[42rem]">
              <HeroTile
                product={showcase[0]}
                loading={loading}
                priority
                depth={1}
                tilt={tilt}
                className="col-span-3 col-start-1 row-span-5 row-start-1"
                pad="p-6 sm:p-10 lg:p-12"
                showMeta
              />
              <HeroTile
                product={showcase[1]}
                loading={loading}
                depth={-1.6}
                tilt={tilt}
                className="col-span-2 col-start-4 row-span-2 row-start-2"
                pad="p-4 sm:p-6"
              />
              <HeroTile
                product={showcase[2]}
                loading={loading}
                depth={0.7}
                tilt={tilt}
                className="col-span-2 col-start-4 row-span-3 row-start-4"
                pad="p-4 sm:p-7"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------- bottom information ------------------- */}
      <div className="shell border-t border-line">
        <div className="flex items-center justify-between gap-6 py-5">
          <dl className="flex items-center gap-6 sm:gap-12">
            <Stat label="Products" value={status === "succeeded" ? products.length : null} />
            <Stat label="Categories" value={status === "succeeded" ? categoryCount : null} />
            <div className="hidden sm:block">
              <dt className="eyebrow">Edit</dt>
              <dd className="font-display mt-1 text-sm font-bold uppercase tracking-[0.08em] text-ink">
                Curated
              </dd>
            </div>
          </dl>

          <a
            href="#departments"
            className="group hidden items-center gap-2.5 font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-faint transition-colors hover:text-ink sm:flex"
          >
            Scroll to explore
            <span className="scroll-hint" aria-hidden="true">
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */

function Stat({ label, value }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="nums font-display mt-1 text-sm font-bold uppercase tracking-[0.08em] text-ink">
        {value == null ? "—" : `${value}+`}
      </dd>
    </div>
  );
}

function HeroTile({
  product,
  loading,
  className = "",
  pad,
  showMeta = false,
  priority = false,
  depth = 0,
  tilt,
}) {
  if (loading || !product) {
    return <div className={`animate-pulse rounded-lg bg-surface-2 ${className}`} />;
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className={`group media-plate relative block rounded-lg ${className}`}
      style={{
        transform: `translate3d(${tilt.x * depth * 14}px, ${tilt.y * depth * 14}px, 0)`,
        transition: "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <span className={`flex h-full w-full items-center justify-center ${pad}`}>
        <img
          src={product.image}
          alt={product.title}
          fetchPriority={priority ? "high" : "auto"}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.05]"
        />
      </span>

      {showMeta && (
        /* Sits on the plate, which is light in both themes, so this text is
           deliberately a fixed dark neutral rather than theme-aware. */
        <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 sm:inset-x-7 sm:bottom-7">
          <span className="min-w-0">
            <span className="block font-display text-[9px] font-bold uppercase tracking-[0.22em] text-[#201e1d]/60">
              {product.brand ?? product.categoryLabel}
            </span>
            <span className="mt-1.5 block truncate font-display text-sm font-bold text-[#201e1d]">
              {product.title}
            </span>
          </span>
          <span className="nums shrink-0 font-display text-sm font-bold text-[#201e1d]">
            {money(product.price)}
          </span>
        </span>
      )}
    </Link>
  );
}

/**
 * Three products from three different departments, each in stock and well
 * photographed, so the hero shows the range of the shop instead of three
 * variations of one thing.
 */
function pickShowcase(products) {
  const usable = products.filter((p) => p.inStock && p.image);
  const picked = [];
  const seen = new Set();

  // Categories chosen for silhouette variety: something worn, something
  // technical, something small.
  for (const preferred of ["womens-bags", "laptops", "fragrances", "mens-shoes", "smartphones", "sunglasses"]) {
    const hit = usable.find((p) => p.category === preferred && !seen.has(p.id));
    if (hit) {
      picked.push(hit);
      seen.add(hit.id);
    }
    if (picked.length === 3) return picked;
  }

  // Fall back to anything, still one per category.
  for (const p of usable) {
    if (picked.length === 3) break;
    if (seen.has(p.id) || picked.some((q) => q.category === p.category)) continue;
    picked.push(p);
    seen.add(p.id);
  }

  return picked;
}
