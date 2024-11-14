import classes from "./auth.module.css";

import { Button, Paper, TextField } from "@mui/material";
import { Link } from "@mui/material";

import Password from "./Password.tsx";

import { setTitle } from "./helpers";

export default function SignupPage() {
  setTitle("Sign up");
  return (
    <article className={classes.authContainer}>
      <Paper elevation={5} className={classes.auth}>
        <h1>Sign up</h1>
        <form className={classes.authForm}>
          <TextField label="Username" />
          <Password />
          <Button variant="contained">Sign up</Button>
        </form>
        Already have an account? <Link href="/login">Log in</Link>
      </Paper>
    </article>
  );
}
