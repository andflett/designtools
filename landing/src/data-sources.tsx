import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Nav } from "./components/nav.js";
import { DataSourcesExploration } from "./components/data-sources-exploration.js";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Nav />
    <DataSourcesExploration />
  </StrictMode>,
);
