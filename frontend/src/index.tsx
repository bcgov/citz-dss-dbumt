import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// testing frontend build and push action
// unsure why this is not triggering the action
function test() {
  console.log("test");
}
test();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
