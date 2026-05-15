import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Desktop } from "./components/os/Desktop";
import "./styles/os.css";

const mount = document.querySelector<HTMLElement>("[data-portfolio-os]");

if (mount) {
  createRoot(mount).render(
    <StrictMode>
      <Desktop />
    </StrictMode>
  );
}
