import themeBtnClasses from "./ThemeButton.module.css";
import "./App.css";

import type { ReactNode } from "react";

import { createTheme, useColorScheme, ThemeProvider } from "@mui/material/styles";
import { Link, Outlet, ScrollRestoration } from "react-router-dom";

import config from "../../app-config.json";

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#317138" },
        secondary: { main: "#d84097" },
        contrastThreshold: 4.5
      }
    },
    dark: {
      palette: {
        primary: { main: "#317138" },
        secondary: { main: "#d84097" },
        contrastThreshold: 4.5
      }
    }
  },
  cssVariables: {
    cssVarPrefix: "",
    colorSchemeSelector: "class"
  }
});

function ThemeButton({ className }: { className: string }) {
  const { mode, setMode } = useColorScheme();
  const newMode = mode === "light" ? "dark" : "light";
  return (
    <button
      className={`material-symbols-outlined ${themeBtnClasses["theme-button"]} ${className}`}
      onClick={() => { setMode(newMode); }}
    >
      {`${newMode}_mode`}
    </button>
  );
}

export default function App({ children }: { children?: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <header className="page-head">
        <Link to="/" className="site-title">{config.name}</Link>
        <nav>
          <Link to="/test">Test</Link>
        </nav>
        <ThemeButton className="theme-button" />
      </header>
      <main>
        { children ?? <Outlet />}
      </main>
      <footer className="page-foot">
        <nav>
          <Link to="/credits">Credits</Link>
          <Link to="/test">Test</Link>
        </nav>
      </footer>
      <ScrollRestoration />
    </ThemeProvider>
  );
}
