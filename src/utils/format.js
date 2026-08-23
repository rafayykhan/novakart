export const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

// "men's clothing" -> "Men's clothing"
export const titleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);
