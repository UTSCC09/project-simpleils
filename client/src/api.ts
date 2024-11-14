async function handleResponse(res: Response) {
  if (res.ok)
    return res.json();
  throw new Error(`Status ${res.status}: ${await res.text()}`);
}

export async function signUp(username: string, password: string) {
  const res = await fetch("http://localhost:3000/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  return handleResponse(res);
}

export async function logIn(username: string, password: string) {
  const res = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  return handleResponse(res);
}
