import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/eldorado" element={<App tourId="eldorado" />} />
        <Route path="/lupuna" element={<App tourId="lupuna" />} />
        <Route path="/" element={<Navigate to="/eldorado" replace />} />
        <Route path="*" element={<Navigate to="/eldorado" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
