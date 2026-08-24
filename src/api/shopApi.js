// All network / fake-network stuff sits here so the slices stay readable.
// Products are real (Fake Store API), login is faked with a timeout because
// I didn't want to run a backend just for this.

const PRODUCTS_URL = "https://fakestoreapi.com/products";

export async function getProducts() {
  const res = await fetch(PRODUCTS_URL);

  // fetch doesn't throw on 404/500, so this has to be checked by hand
  if (!res.ok) {
    throw new Error(`Products request failed (${res.status})`);
  }

  const data = await res.json();

  // Trimming the payload down to what the UI renders. `description` and the
  // rating pair are kept now that there's a product page to show them on —
  // everything here comes straight from the API, nothing is synthesised.
  return data.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    image: p.image,
    category: p.category,
    description: p.description ?? "",
    rating: p.rating?.rate ?? null,
    ratingCount: p.rating?.count ?? null,
  }));
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
