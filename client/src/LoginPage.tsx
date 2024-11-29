import classes from "./auth.module.css";

import type { FormEvent } from "react";

import { Button, Paper, TextField } from "@mui/material";
import { Link } from "@mui/material";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Password from "./Password.tsx";

import { logIn } from "./api.ts";
import { UserContext } from "./App.tsx";
import { setTitle } from "./helpers.ts";

async function handleLogin(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  try {
    const data = new FormData(e.currentTarget);
    await logIn(data.get("email") as string, data.get("password") as string);
    return true;
  } catch (err) {
    document.getElementById("error")!.innerHTML = (err as Error).message;
    return false;
  }
}

export default function LoginPage() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (user.loggedIn)
      navigate("/");
  }, [user]);
  setTitle("Log in");

  return (
    <article className={classes.authContainer}>
      <Paper elevation={5} className={classes.auth}>
        <h1>Log in</h1>
        <div id="error" className={classes.error} />
        <form
          className={classes.authForm}
          onSubmit={async e => {
            if (await handleLogin(e))
              setUser({ loggedIn: true });
          }}
        >
          <TextField type="email" name="email" label="Email" autoComplete="email" required />
          <Password name="password" label="Password" autoComplete="current-password" required />
          <Button type="submit" variant="contained">Log in</Button>
        </form>
        Don't have an account? <Link href="/signup">Sign up</Link>
      </Paper>
    </article>
  );
}
