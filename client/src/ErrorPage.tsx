import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function CreditsPage() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
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
  return (
    <article>
      <h1>Oops!</h1>
      <p>An unexpected error occurred.</p>
    </article>
  );
}
