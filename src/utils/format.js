export const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

// "men's clothing" -> "Men's clothing"
export const titleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// Category strings arrive lowercased from the API. Nav and tiles want them
// shouty and short, so they get their own formatter rather than titleCase.
export const categoryLabel = (category) =>
  category === "all" ? "Everything" : titleCase(category);

// "men's clothing" -> "mens-clothing", for URLs.
export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Trims a description to a sentence boundary where it can, so card and
// summary copy doesn't cut off mid-word.
export const excerpt = (text, max = 120) => {
  if (!text || text.length <= max) return text ?? "";
  const cut = text.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf(" "));
  return `${cut.slice(0, lastStop > 40 ? lastStop : max).trimEnd()}…`;
};
