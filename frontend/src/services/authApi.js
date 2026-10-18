const KEY = "devnexus_user";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function getStoredUser() {
  try { return JSON.parse(localStorage.getItem(KEY) || sessionStorage.getItem(KEY)); }
  catch { return null; }
}

function store(user, remember = true) {
  localStorage.removeItem(KEY); sessionStorage.removeItem(KEY);
  (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(user));
}

/**
 * These functions simulate a backend. To connect your API (for example FastAPI),
 * replace the bodies with real requests, such as:
 *
 *   const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
 *     method: "POST", credentials: "include",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ email, password }),
 *   });
 *   if (!res.ok) throw new Error("Invalid email or password");
 *   return res.json();
 *
 * Prefer an httpOnly cookie for the session over storing tokens in localStorage.
 */
export async function login({ email, password, remember }) {
  await wait(900);
  if (!email || !password) throw new Error("Invalid email or password");
  const user = { name: email.split("@")[0], email };
  store(user, remember);
  return user;
}

export async function signup({ name, email, password }) {
  await wait(1000);
  if (!email || !password) throw new Error("Could not create the account");
  const user = { name, email };
  store(user, true);
  return user;
}

export async function logout() {
  localStorage.removeItem(KEY); sessionStorage.removeItem(KEY);
}
