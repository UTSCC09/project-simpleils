import { CredentialResponse } from "@react-oauth/google";

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

export async function googleLogin(credential: CredentialResponse) {
  const res = await fetch(`${BASE_URL}/login/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ credential })
  });
  return handleResponse(res);
}

export async function logOut() {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include"
  });
  return handleResponse(res);
}


export interface DataTable<T> {
  rows: number;
  data: Array<T>;
}

export interface User {
  id: string;
  type: string;
  first_name: string;
  last_name: string;
  email: string;
}

export async function getUsers(skip?: number): Promise<DataTable<User>> {
  const res = await fetch(`${BASE_URL}/users?skip=${skip ?? 0}`,
                          { credentials: "include" });
  return handleResponse(res);
}

export interface Author {
  id: string;
  first_name: string;
  last_name: string;
}

export async function getAuthors(skip?: number): Promise<DataTable<Author>> {
  const res = await fetch(`${BASE_URL}/authors?skip=${skip ?? 0}`);
  return handleResponse(res);
}

export interface Publisher {
  id: string;
  name: string;
}

export async function getPublishers(skip?: number):
Promise<DataTable<Publisher>> {
  const res = await fetch(`${BASE_URL}/publishers?skip=${skip ?? 0}`);
  return handleResponse(res);
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  year: number;
}

export async function getBooks(skip?: number): Promise<DataTable<Book>> {
  const res = await fetch(`${BASE_URL}/books?skip=${skip ?? 0}`);
  return handleResponse(res);
}

export async function changeUserType(id: string, type: string) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
    credentials: "include"
  });
  return handleResponse(res);
}
