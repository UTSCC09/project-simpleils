import classes from "./auth.module.css";

import { Button, Paper, TextField } from "@mui/material";
import { Link } from "@mui/material";

import Password from "./Password.tsx";

import { setTitle } from "./helpers";

export default function LoginPage() {
  setTitle("Log in");
  return (
    <article className={classes.authContainer}>
      <Paper elevation={5} className={classes.auth}>
        <h1>Log in</h1>
        <form className={classes.authForm}>
          <TextField label="Username" />
          <Password />
          <Button variant="contained">Log in</Button>
        </form>
        Don't have an account? <Link href="/signup">Sign up</Link>
      </Paper>
    </article>
  );
}
