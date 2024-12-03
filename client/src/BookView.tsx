import type { DetailedBook } from "./api.ts";

import { useLoaderData } from "react-router-dom";

import { setTitle } from "./helpers.ts";

export default function BookView() {
  const book = useLoaderData() as DetailedBook;
  setTitle("Book");
  return (
    <article>
      <h1>{book.title}</h1>
      <ul>
        <li>Author: {`${book.first_name} ${book.last_name}`}</li>
        <li>Publisher: {book.publisher}</li>
        <li>Year: {book.year}</li>
        <li>Pages: {book.pages}</li>
      </ul>
      <p>{book.summary}</p>
    </article>
  );
}
