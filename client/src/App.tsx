import "./App.css";

import type { MouseEventHandler, ReactNode } from "react";

import { createTheme, useColorScheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { Link, Outlet, ScrollRestoration } from "react-router-dom";

import { IconButton } from "./icons.tsx";

import config from "../../app-config.json";

interface MenuButtonProps {
  className: string;
  onClick: MouseEventHandler;
  menuOpen: boolean;
}

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
    <IconButton
      name={`${newMode}-mode`}
      className={className}
      onClick={() => { setMode(newMode); }}
    />
  );
}

function MenuButton({ className, onClick, menuOpen }: MenuButtonProps) {
  return (
    <IconButton
      name={menuOpen ? "close" : "menu"}
      className={className}
      onClick={onClick}
    />
  );
}

export default function App({ children }: { children?: ReactNode }) {
  const [menuOpen, setMenuState] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <header className={`page-head ${menuOpen ? "menu-open" : ""}`}>
        <Link to="/" className="site-title">{config.name}</Link>
        <nav>
          <Link to="/test">Test</Link>
          <Link to="/test">Test</Link>
          <Link to="/test">Test</Link>
          <Link to="/test">Test</Link>
        </nav>
        <ThemeButton className="header-theme-button" />
        <MenuButton
          className="header-menu-button"
          onClick={() => { setMenuState(!menuOpen); }}
          menuOpen={menuOpen}
        />
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
