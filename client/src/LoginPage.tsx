import classes from "./auth.module.css";

import type { FormEvent } from "react";

import { Button, Paper, TextField } from "@mui/material";
import { Link } from "@mui/material";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import Password from "./Password.tsx";

import { googleLogin, logIn } from "./api.ts";
import { UserContext } from "./App.tsx";
import { setTitle } from "./helpers.ts";

async function handleLogin(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  try {
    const data = new FormData(e.currentTarget);
    const res = await logIn(data.get("email") as string, data.get("password") as string);
    return [true, res];
  } catch (err) {
    document.getElementById("error")!.innerHTML = (err as Error).message;
    return [false, undefined];
  }
}

export default function LoginPage() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (user.loggedIn)
      navigate("/dashboard");
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
            const res = await handleLogin(e);
            if (res[0])
              setUser({ loggedIn: true, ...res[1] });
          }}
        >
          <TextField type="email" name="email" label="Email" autoComplete="email" required />
          <Password name="password" label="Password" autoComplete="current-password" required />
          <Button type="submit" variant="contained">Log in</Button>
        </form>
        <div className={classes.googleButton}>
          <GoogleLogin
            onSuccess={
              async credential => {
                const res = await googleLogin(credential);
                setUser({ loggedIn: true, ...res });
              }
            }
          />
        </div>
        Don't have an account? <Link href="/signup">Sign up</Link>
      </Paper>
    </article>
  );
}
