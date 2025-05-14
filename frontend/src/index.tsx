import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// testing frontend build and push action

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
