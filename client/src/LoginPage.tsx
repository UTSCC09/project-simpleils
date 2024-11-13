import classes from "./LoginPage.module.css";

import { useState } from "react";
import { Button, InputAdornment, Paper, TextField } from "@mui/material";

import { IconButton } from "./icons.tsx";

import { setTitle } from "./helpers";

export default function CreditsPage() {
  const [passwdShow, setPasswdState] = useState(false);
  setTitle("Log in");
  return (
    <article className={classes.loginContainer}>
      <Paper elevation={5} className={classes.login}>
        <h1>Log in</h1>
        <form className={classes.loginForm}>
          <TextField label="Username" />
          <TextField
            type={passwdShow ? "text" : "password"}
            label="Password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      name={`visibility${passwdShow ? "-off" : ""}`}
                      onClick={
                        e => {
                          e.preventDefault();
                          setPasswdState(!passwdShow);
                        }
                      }
                    />
                  </InputAdornment>
                )
              }
            }}
          />
          <Button variant="contained">Log in</Button>
        </form>
      </Paper>
    </article>
  );
}
