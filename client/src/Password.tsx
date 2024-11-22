import { useState, ComponentProps } from "react";
import { InputAdornment, TextField } from "@mui/material";

import { IconButton } from "./icons.tsx";

export default function Password(props: ComponentProps<typeof TextField>) {
  const [passwordShow, setPasswdState] = useState(false);
  return (
    <TextField
      {...props}
      type={passwordShow ? "text" : "password"}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="button"
                name={`visibility${passwordShow ? "-off" : ""}`}
                aria-label={`${passwordShow ? "Hide" : "Show"} password`}
                tabIndex={-1}
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
