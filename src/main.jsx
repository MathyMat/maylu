import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import "./styles.css";
import { getRouter } from "./router.tsx";

const router = getRouter();
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se encontro el elemento root");
}

createRoot(rootElement).render(
  <RouterProvider router={router} />,
);
