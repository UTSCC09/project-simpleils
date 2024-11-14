import "./App.css";

import type { LinkProps } from "@mui/material";
import type { MouseEventHandler, ReactNode } from "react";
import type { LinkProps as RouterLinkProps } from "react-router-dom";

import { createTheme, useColorScheme, StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { forwardRef, useEffect, useState } from "react";
import { Button, Link } from "@mui/material";
import { useLocation, Link as RouterLink, Outlet, ScrollRestoration } from "react-router-dom";

import { IconButton } from "./icons.tsx";

import config from "../../app-config.json";

interface MenuButtonProps {
  className: string;
  onClick: MouseEventHandler;
  menuOpen: boolean;
}

const LinkBehavior = forwardRef<
  HTMLAnchorElement,
    Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"] }
>(({ href, ...other }, ref) => {
  // Map href (Material UI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { light: "#64af6e", main: "#317138" },
        secondary: { main: "#d84097" },
        contrastThreshold: 4.5
      }
    },
    dark: {
      palette: {
        primary: { light: "#64af6e", main: "#317138" },
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
    fontFamily: "Quicksand, sans-serif",
    fontSize: 16,
    button: {
      textTransform: "none"
    }
  },
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior
      } as LinkProps
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior
      }
    }
  }
});

theme.components!.MuiLink!.styleOverrides = {
  root: {
    color: "var(--link-color)",
    textDecorationColor: "var(--link-underline-color)"
  }
};

function ThemeButton({ className }: { className: string }) {
  const { mode, setMode } = useColorScheme();
  const newMode = mode === "light" ? "dark" : "light";
  return (
    <IconButton
      name={`${newMode}-mode`}
      aria-label={`Switch to ${newMode} mode`}
      className={className}
      onClick={() => { setMode(newMode); }}
    />
  );
}

function MenuButton({ className, onClick, menuOpen }: MenuButtonProps) {
  return (
    <IconButton
      name={menuOpen ? "close" : "menu"}
      aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
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
      <Link href="/" className="site-title">{config.name}</Link>
      <nav>
        <Link href="/test">Test</Link>
        <Link href="/test">Test</Link>
        <Link href="/test">Test</Link>
        <Link href="/test">Test</Link>
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
            <Button variant="contained" href="/login">Log in</Button>
          </div>
        )
      }
    </header>
  );
}

export default function App({ children }: { children?: ReactNode }) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <PageHeader />
        <main>
          { children ?? <Outlet />}
        </main>
        <footer className="page-foot">
          <nav>
            <Link href="/credits">Credits</Link>
            <Link href="/test">Test</Link>
          </nav>
        </footer>
        <ScrollRestoration />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
