import "./App.css";

import type { MouseEventHandler, ReactNode } from "react";

import { createTheme, useColorScheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useLocation, Link, Outlet, ScrollRestoration } from "react-router-dom";

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
  },
  typography: {
    fontFamily: "Quicksand,sans-serif",
    fontSize: 16,
    button: {
      textTransform: "none"
    }
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

function PageHeader() {
  const loggedIn = false;
  const [menuOpen, setMenuState] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setMenuState(false);
  }, [location]);
  return (
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
      {
        !loggedIn && (
          <div className="header-login">
            <Link to="/login">
              <Button variant="contained">Log in</Button>
            </Link>
          </div>
        )
      }
    </header>
  );
}

export default function App({ children }: { children?: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <PageHeader />
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
