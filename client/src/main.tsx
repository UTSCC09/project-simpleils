import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";

import "./index.css";

import App from "./App.tsx";
import CreditsPage from "./CreditsPage.tsx";
import ErrorPage from "./ErrorPage.tsx";
import HomePage from "./HomePage.tsx";
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
      { path: "credits", element: <CreditsPage /> },
      { path: "test", element: <TestPage /> }
    ]
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
