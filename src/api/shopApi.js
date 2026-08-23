// All network / fake-network stuff sits here so the slices stay readable.
// Products are real (Fake Store API), login is faked with a timeout because
// I didn't want to run a backend just for this.

const PRODUCTS_URL = "https://fakestoreapi.com/products?limit=12";

export async function getProducts() {
  const res = await fetch(PRODUCTS_URL);

  // fetch doesn't throw on 404/500, so this has to be checked by hand
  if (!res.ok) {
    throw new Error(`Products request failed (${res.status})`);
  }

  const data = await res.json();

  // trimming the payload down to what the UI actually renders
  return data.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    image: p.image,
    category: p.category,
    rating: p.rating?.rate ?? 0,
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
