import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DataSourcesCarousel } from "./components/data-sources-carousel.js";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DataSourcesCarousel />
  </StrictMode>,
);
