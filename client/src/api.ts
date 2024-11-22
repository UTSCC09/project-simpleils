const BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000" : "https://simpleils.tech";

async function handleResponse(res: Response) {
  if (res.ok)
    return res.json();
  throw new Error((await res.json()).error);
}

export async function signUp(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  return handleResponse(res);
}

export async function logIn(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password })
  });
  return handleResponse(res);
}
