import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";

import "./index.css";

import App from "./App.tsx";
import Catalogue from "./Catalogue.tsx";
import CreditsPage from "./CreditsPage.tsx";
import Dashboard from "./Dashboard.tsx";
import ErrorPage from "./ErrorPage.tsx";
import HomePage from "./HomePage.tsx";
import LoginPage from "./LoginPage.tsx";
import Records from "./Records.tsx";
import SignupPage from "./SignupPage.tsx";
import TestPage from "./TestPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: (
      <App>
        <ErrorPage />
      </App>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "browse", element: <Catalogue /> },
      { path: "credits", element: <CreditsPage /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "login", element: <LoginPage /> },
      { path: "records", element: <Records /> },
      { path: "signup", element: <SignupPage /> },
      { path: "test", element: <TestPage /> }
    ]
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
