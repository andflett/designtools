import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BannerExploration } from "./components/banner-exploration.js";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BannerExploration />
  </StrictMode>,
);
