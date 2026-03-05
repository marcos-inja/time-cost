import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "../styles/variables.css";

async function init() {
  const theme =
    ((await chrome.storage.sync.get("userSettings")) as { userSettings?: { theme?: "light" | "dark" } })
      ?.userSettings?.theme ?? "light";
  document.documentElement.setAttribute("data-theme", theme);

  const root = document.getElementById("root");
  if (root) {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
}

init();
