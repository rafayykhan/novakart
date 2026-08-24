// All network / fake-network stuff sits here so the slices stay readable.
// Products are real (DummyJSON), login is faked with a timeout because I
// didn't want to run a backend just for this.
//
// Everything leaving this file is NORMALISED. The rest of the app never sees
// a DummyJSON field name — swapping the catalogue source again should mean
// editing `normalise()` and nothing else.

const API = "https://dummyjson.com";

// Only the fields the browse experience needs. Pulling the full records for
// all 194 products (reviews, dimensions, meta) roughly quadruples the payload
// for data that's only ever read on a product page.
const LIST_FIELDS = [
  "id",
  "title",
  "description",
  "price",
  "discountPercentage",
  "rating",
  "stock",
  "brand",
  "category",
  "thumbnail",
  "images",
  "tags",
  "availabilityStatus",
].join(",");

/** "mens-shirts" -> "Men's Shirts" */
const LABELS = {
  beauty: "Beauty",
  fragrances: "Fragrances",
  furniture: "Furniture",
  groceries: "Groceries",
  "home-decoration": "Home Decoration",
  "kitchen-accessories": "Kitchen",
  laptops: "Laptops",
  "mens-shirts": "Men's Shirts",
  "mens-shoes": "Men's Shoes",
  "mens-watches": "Men's Watches",
  "mobile-accessories": "Mobile Accessories",
  motorcycle: "Motorcycles",
  "skin-care": "Skincare",
  smartphones: "Smartphones",
  "sports-accessories": "Sports",
  sunglasses: "Sunglasses",
  tablets: "Tablets",
  tops: "Tops",
  vehicle: "Vehicles",
  "womens-bags": "Women's Bags",
  "womens-dresses": "Women's Dresses",
  "womens-jewellery": "Women's Jewellery",
  "womens-shoes": "Women's Shoes",
  "womens-watches": "Women's Watches",
};

export const categoryLabelFor = (slug) =>
  LABELS[slug] ??
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// A discount of 0.04% is noise, not an offer. Below this the product is shown
// at one plain price with no strike-through — a "was $12.99 / now $12.98"
// badge is worse than no badge.
const MIN_MEANINGFUL_DISCOUNT = 5;

function normalise(p) {
  const images = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
  const primary = images[0] ?? p.thumbnail ?? null;

  // ~60% of the catalogue ships more than one photograph. The rest get null
  // here and the card simply doesn't do a hover swap, rather than crossfading
  // an image into a copy of itself.
  const hoverImage = images.length > 1 ? images[1] : null;

  const listPrice = Number(p.price) || 0;
  const discountPercent = Number(p.discountPercentage) || 0;
  const hasDiscount = discountPercent >= MIN_MEANINGFUL_DISCOUNT;

  // `price` is the list price and `discountPercentage` is what comes off it,
  // so the amount actually charged is the derived one.
  const price = hasDiscount
    ? Math.round(listPrice * (1 - discountPercent / 100) * 100) / 100
    : listPrice;

  const stock = Number.isFinite(p.stock) ? p.stock : null;

  return {
    id: p.id,
    title: p.title,
    description: p.description ?? "",
    brand: p.brand || null, // ~half the catalogue has no brand
    category: p.category,
    categoryLabel: categoryLabelFor(p.category),

    price,
    listPrice: hasDiscount ? listPrice : null,
    discountPercent: hasDiscount ? Math.round(discountPercent) : null,

    image: primary,
    hoverImage,
    images,
    thumbnail: p.thumbnail ?? primary,

    rating: Number.isFinite(p.rating) ? p.rating : null,
    stock,
    inStock: stock == null ? true : stock > 0,
    availability: p.availabilityStatus ?? null,
    tags: Array.isArray(p.tags) ? p.tags : [],

    // Detail-only fields; undefined on list records, which is why the product
    // page fetches the full record rather than trusting the cached one.
    reviews: Array.isArray(p.reviews) ? p.reviews : null,
    shippingInformation: p.shippingInformation ?? null,
    returnPolicy: p.returnPolicy ?? null,
    warrantyInformation: p.warrantyInformation ?? null,
    sku: p.sku ?? null,
    minimumOrderQuantity: Number.isFinite(p.minimumOrderQuantity)
      ? p.minimumOrderQuantity
      : null,
  };
}

async function getJSON(url) {
  const res = await fetch(url);

  // fetch doesn't throw on 404/500, so this has to be checked by hand
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  return res.json();
}

/** The whole catalogue, trimmed. One request for the entire session. */
export async function getProducts() {
  // limit=0 is DummyJSON's "everything"
  const data = await getJSON(`${API}/products?limit=0&select=${LIST_FIELDS}`);

  if (!Array.isArray(data?.products)) {
    throw new Error("Catalogue response was not in the expected shape.");
  }

  return data.products.map(normalise);
}

/** Full record for one product — reviews, shipping, warranty, all images. */
export async function getProduct(id) {
  return normalise(await getJSON(`${API}/products/${id}`));
}

// The one account that works. Printed on the login screen so nobody has to
// go digging through the source.
const DEMO_USER = {
  email: "demo@novakart.dev",
  password: "chaiaurcode",
  name: "Rafay",
};

export function login({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const emailOk = email.trim().toLowerCase() === DEMO_USER.email;
      const passOk = password === DEMO_USER.password;

      if (emailOk && passOk) {
        resolve({
          id: "u_01",
          name: DEMO_USER.name,
          email: DEMO_USER.email,
          token: "not-a-real-token-" + Date.now(),
        });
      } else {
        reject(new Error("That email and password don't match."));
      }
    }, 800); // fake latency, otherwise the loading state is invisible
  });
}

export const DEMO_CREDENTIALS = {
  email: DEMO_USER.email,
  password: DEMO_USER.password,
};
