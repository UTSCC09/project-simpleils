import classes from "./HomePage.module.css";

import { setTitle } from "./helpers.ts";

import config from "../../app-config.json";

export default function HomePage() {
  setTitle("");
  return (
    <article className={classes.home}>
      <h1>{config.name}</h1>
      <p>An easy-to-use system to manage your library.</p>
    </article>
  );
}
