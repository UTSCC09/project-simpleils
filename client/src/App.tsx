import "./App.css";

import type { LinkProps } from "@mui/material";
import type { MouseEventHandler, ReactNode } from "react";
import type { LinkProps as RouterLinkProps } from "react-router-dom";

import { createTheme, useColorScheme, StyledEngineProvider,
         ThemeProvider } from "@mui/material/styles";
import { createContext, Dispatch, forwardRef, SetStateAction, useContext,
         useEffect, useState } from "react";
import { Button, Link } from "@mui/material";
import { useLocation, useNavigate, Link as RouterLink, Outlet,
         ScrollRestoration } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { logOut } from "./api.ts";
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

export interface UserData {
  loggedIn: boolean;
  id?: string;
  type?: "user" | "staff" | "admin";
  name?: { first: string; last: string };
  email?: string;
}

export const UserContext = createContext({} as {
  user: UserData;
  setUser: Dispatch<SetStateAction<UserData>>;
});

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
  const { user, setUser } = useContext(UserContext);
  const [menuOpen, setMenuState] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.loggedIn)
      navigate("/login");
  }, [user]);
  useEffect(() => {
    setMenuState(false);
  }, [location]);

  return (
    <header className={`page-head ${menuOpen ? "menu-open" : ""}`}>
      <Link href="/" className="site-title">{config.name}</Link>
      <nav>
        <Link href="/dashboard">Dashboard</Link>
      </nav>
      <ThemeButton className="header-theme-button" />
      <MenuButton
        className="header-menu-button"
        onClick={() => { setMenuState(!menuOpen); }}
        menuOpen={menuOpen}
      />
      <div className="header-auth">
        {
          user.loggedIn ? (
            <Button
              variant="contained"
              onClick={async () => {
                await logOut();
                setUser({ loggedIn: false });
              }}
            >
              Log out
            </Button>
          ) : <Button variant="contained" href="/login">Log in</Button>
        }
      </div>
    </header>
  );
}

export default function App({ children }: { children?: ReactNode }) {
  const userStore = localStorage.getItem("user");
  const [user, setUser] = useState((userStore === null ? { loggedIn: false }
    : JSON.parse(userStore)) as UserData);
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <GoogleOAuthProvider clientId="226296281130-pqdcnape7n1ui2ci40ejpdtqpf4is47q.apps.googleusercontent.com">
          <UserContext.Provider value={{ user, setUser }}>
            <PageHeader />
            <main>
              { children ?? <Outlet />}
            </main>
            <footer className="page-foot">
              <nav>
                <Link href="/credits">Credits</Link>
                <Link href="https://github.com/UTSCC09/project-simpleils">GitHub</Link>
              </nav>
            </footer>
            <ScrollRestoration />
          </UserContext.Provider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
