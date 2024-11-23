import { Link } from "@mui/material";

import { setTitle } from "./helpers.ts";

export default function CreditsPage() {
  setTitle("Credits");
  return (
    <article>
      <h1>Credits</h1>
      <ul>
        <li>
          <Link href="https://fonts.google.com">Google Fonts</Link> for the Quicksand font and Material Symbols
        </li>
        <li>
          StackExchange/StackOverflow for code snippets:
          <ul>
            <li>
              <Link href="https://serverfault.com/a/812461">How to stop nginx 301 auto redirect when trailing slash is not in URI?</Link>
            </li>
            <li>
              <Link href="https://stackoverflow.com/a/43954597">React-router and nginx</Link>
            </li>
            <li>
              <Link href="https://stackoverflow.com/a/76385223">React Router - How can I reuse my layout for the errorElement in the root route?</Link>
            </li>
            <li>
              <Link href="https://stackoverflow.com/a/70918633">How to Close Navigation Menu on Route Change</Link>
            </li>
          </ul>
        </li>
      </ul>
    </article>
  );
}
