import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { CascadePage } from "./components/cascade-page.js";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CascadePage />
    <Analytics />
  </StrictMode>,
);
