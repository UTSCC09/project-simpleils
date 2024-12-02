import config from "../../app-config.json";

const BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000" : `${config.url}/api`;

async function handleResponse(res: Response) {
  if (res.ok)
    return res.json();
  throw new Error((await res.json()).error);
}

export async function signUp(first: string, last: string, email: string,
                             password: string) {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ first, last, email, password })
  });
  return handleResponse(res);
}

export async function logIn(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password })
  });
  return handleResponse(res);
}

export interface User {
  id: number;
  type: string;
  first_name: string;
  last_name: string;
  email: string;
}

export async function getUsers(): Promise<Array<User>> {
  const res = await fetch(`${BASE_URL}/users`);
  return handleResponse(res);
}
