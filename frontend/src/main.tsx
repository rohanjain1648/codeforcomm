import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./components/ThemeProvider";
import { MagneticCursor } from "./components/ui/MagneticCursor";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
      <MagneticCursor />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
