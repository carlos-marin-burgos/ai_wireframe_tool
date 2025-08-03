import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/themes.css";
import App from "./App";

// Expose React globally for dynamic code execution
declare global {
  interface Window {
    React: typeof React;
  }
}
window.React = React;

// Navigation initialization removed - Microsoft Learn navigation should only appear within wireframe content, not at application level

// Get the root element
const rootElement = document.getElementById("root");

// Create the React application
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
