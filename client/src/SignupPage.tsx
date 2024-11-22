import classes from "./auth.module.css";

import type { FormEvent } from "react";

import { Button, Paper, TextField } from "@mui/material";
import { Link } from "@mui/material";

import Password from "./Password.tsx";

import { signUp } from "./api.ts";
import { setTitle } from "./helpers.ts";

async function handleSignup(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  try {
    const data = new FormData(e.currentTarget);
    if (data.get("password") as string !== data.get("confirm") as string)
      throw new Error("Passwords do not match.");
    await signUp(data.get("first") as string, data.get("last") as string,
                 data.get("email") as string, data.get("password") as string);
  } catch (err) {
    document.getElementById("error")!.innerHTML = (err as Error).message;
  }
}

export default function SignupPage() {
  setTitle("Sign up");
  return (
    <article className={classes.authContainer}>
      <Paper elevation={5} className={classes.auth}>
        <h1>Sign up</h1>
        <div id="error" className={classes.error} />
        <form className={classes.authForm} onSubmit={handleSignup}>
          <TextField name="first" label="First name" autoComplete="given-name" />
          <TextField name="last" label="Last name" autoComplete="family-name" required />
          <TextField type="email" name="email" label="Email" autoComplete="email" required />
          <Password name="password" label="Password" autoComplete="new-password" required />
          <Password name="confirm" label="Confirm password" autoComplete="new-password" required />
          <Button type="submit" variant="contained">Sign up</Button>
        </form>
        Already have an account? <Link href="/login">Log in</Link>
      </Paper>
    </article>
  );
}
