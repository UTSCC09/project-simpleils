import type { ReactNode } from "react";

import { Link, Outlet } from "react-router-dom";

export default function Layout({ children }: { children?: ReactNode }) {
  return (
    <>
      <header>
        <nav>
          <Link to="/">SimpleILS</Link>
        </nav>
      </header>
      <main>
        { children ?? <Outlet />}
      </main>
      <footer>
        <Link to="/credits">Credits</Link>
      </footer>
    </>
  );
}
