import { setTitle } from "./helpers";

export default function CreditsPage() {
  setTitle("Credits");
  return (
    <>
      <h1>Credits</h1>
      <ul>
        <li>
          <a href="https://fonts.google.com">Google Fonts</a> for the Quicksand font
        </li>
        <li>
          StackOverflow for code snippets:
          <ul>
            <li>
              <a href="https://stackoverflow.com/a/76385223">React Router - How can I reuse my layout for the errorElement in the root route?</a>
            </li>
          </ul>
        </li>
      </ul>
    </>
  );
}
