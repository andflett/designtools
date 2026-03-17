import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CascadePage } from "./components/cascade-page.js";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CascadePage />
  </StrictMode>,
);
