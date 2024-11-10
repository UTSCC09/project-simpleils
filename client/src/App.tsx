import "./App.css";

import type { ReactNode } from "react";

import { createTheme, useColorScheme, ThemeProvider } from "@mui/material/styles";
import { Link, Outlet } from "react-router-dom";

const theme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    cssVarPrefix: "",
    colorSchemeSelector: "class"
  }
});

function ThemeButton() {
  const { mode, setMode } = useColorScheme();
  return <button onClick={() => { setMode(mode == "light" ? "dark": "light"); }}>Color</button>
}

export default function App({ children }: { children?: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <header className="page-head">
        <Link to="/">SimpleILS</Link>
        <ThemeButton />
        <nav />
      </header>
      <main>
        { children ?? <Outlet />}
      </main>
      <footer className="page-foot">
        <Link to="/credits">Credits</Link>
      </footer>
    </ThemeProvider>
  );
}
