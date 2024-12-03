import { isRouteErrorResponse, useRouteError } from "react-router-dom";

import { setTitle } from "./helpers.ts";

export default function ErrorPage() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    setTitle(`Error ${error.status}`);
    return (
      <article>
        <h1>Oops!</h1>
        <p>
          <strong>{error.status}</strong>: {
            {
              404: "The requested page could not be found."
            }[error.status] || "An unexpected error occurred."
          }
        </p>
      </article>
    );
  }
  setTitle("Oops!");
  return (
    <article>
      <h1>Oops!</h1>
      <p>An unexpected error occurred.</p>
    </article>
  );
}
