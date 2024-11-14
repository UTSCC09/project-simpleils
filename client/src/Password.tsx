import { useState } from "react";
import { InputAdornment, TextField } from "@mui/material";

import { IconButton } from "./icons.tsx";

export default function Password() {
  const [passwdShow, setPasswdState] = useState(false);
  return (
    <TextField
      type={passwdShow ? "text" : "password"}
      label="Password"
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                name={`visibility${passwdShow ? "-off" : ""}`}
                aria-label={`${passwdShow ? "Hide" : "Show"} password`}
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
  );
}
