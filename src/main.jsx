import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const EL_DORADO_PATH = "/eldorado";

if (!window.location.pathname.startsWith(EL_DORADO_PATH)) {
  window.location.replace(EL_DORADO_PATH);
} else {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
