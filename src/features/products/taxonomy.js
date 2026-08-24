/**
 * Department grouping for the mega-menu and the category showcase.
 *
 * DummyJSON returns 24 flat category slugs with no hierarchy. Twenty-four
 * items in a dropdown is a list, not navigation, so they're grouped into six
 * departments here.
 *
 * The grouping is the only editorial layer over the catalogue — the slugs
 * themselves and which products belong to them still come from the API. Any
 * department whose categories all turn out empty is dropped at render time
 * rather than shown as a dead link.
 */
export const DEPARTMENTS = [
  {
    id: "women",
    label: "Women",
    tagline: "Dresses, shoes, bags and fine things",
    categories: [
      "womens-dresses",
      "tops",
      "womens-shoes",
      "womens-bags",
      "womens-jewellery",
      "womens-watches",
    ],
  },
  {
    id: "men",
    label: "Men",
    tagline: "Shirts, shoes and watches worth keeping",
    categories: ["mens-shirts", "mens-shoes", "mens-watches", "sunglasses"],
  },
  {
    id: "tech",
    label: "Tech",
    tagline: "Everyday technology, better chosen",
    categories: ["smartphones", "laptops", "tablets", "mobile-accessories"],
  },
  {
    id: "home",
    label: "Home",
    tagline: "For the rooms you actually live in",
    categories: [
      "furniture",
      "home-decoration",
      "kitchen-accessories",
      "groceries",
    ],
  },
  {
    id: "beauty",
    label: "Beauty",
    tagline: "Skincare, scent and colour",
    categories: ["beauty", "skin-care", "fragrances"],
  },
  {
    id: "motion",
    label: "Motion",
    tagline: "Sport, road and everything moving",
    categories: ["sports-accessories", "motorcycle", "vehicle"],
  },
];

/** Which department a raw category slug belongs to, or null. */
export function departmentFor(categorySlug) {
  return (
    DEPARTMENTS.find((d) => d.categories.includes(categorySlug))?.id ?? null
  );
}

/**
 * Departments with their categories filtered down to the ones that actually
 * have products, and a count attached. Empty departments are removed.
 */
export function buildMenu(products) {
  const counts = new Map();
  for (const p of products) {
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }

  return DEPARTMENTS.map((dept) => {
    const categories = dept.categories
      .filter((slug) => counts.has(slug))
      .map((slug) => ({
        slug,
        label: products.find((p) => p.category === slug).categoryLabel,
        count: counts.get(slug),
      }));

    return {
      ...dept,
      categories,
      count: categories.reduce((sum, c) => sum + c.count, 0),
    };
  }).filter((dept) => dept.categories.length > 0);
}
