import classes from "./auth.module.css";

import type { FormEvent } from "react";

import { Button, Paper, TextField } from "@mui/material";
import { Link } from "@mui/material";

import Password from "./Password.tsx";

import { logIn } from "./api.ts";
import { setTitle } from "./helpers.ts";

async function handleLogin(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  try {
    const data = new FormData(e.currentTarget);
    await logIn(data.get("email") as string, data.get("password") as string);
  } catch (err) {
    document.getElementById("error")!.innerHTML = (err as Error).message;
  }
}

export default function LoginPage() {
  setTitle("Log in");
  return (
    <article className={classes.authContainer}>
      <Paper elevation={5} className={classes.auth}>
        <h1>Log in</h1>
        <div id="error" className={classes.error} />
        <form className={classes.authForm} onSubmit={handleLogin}>
          <TextField type="email" name="email" label="Email" autoComplete="email" required />
          <Password name="password" label="Password" autoComplete="current-password" required />
          <Button type="submit" variant="contained">Log in</Button>
        </form>
        Don't have an account? <Link href="/signup">Sign up</Link>
      </Paper>
    </article>
  );
}
