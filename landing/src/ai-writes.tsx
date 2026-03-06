import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AiWritesExploration } from "./components/ai-writes-exploration.js";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AiWritesExploration />
  </StrictMode>,
);
