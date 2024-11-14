import { useState } from "react";
import { InputAdornment, TextField } from "@mui/material";

import { IconButton } from "./icons.tsx";

export default function Password() {
  const [passwordShow, setPasswdState] = useState(false);
  return (
    <TextField
      type={passwordShow ? "text" : "password"}
      label="Password"
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                name={`visibility${passwordShow ? "-off" : ""}`}
                aria-label={`${passwordShow ? "Hide" : "Show"} password`}
                onClick={
                  e => {
                    e.preventDefault();
                    setPasswdState(!passwordShow);
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
