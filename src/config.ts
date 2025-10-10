// API configuration - Use relative paths in production for Static Web App proxy
const PRODUCTION_DOMAIN = "delightful-pond-064d9a91e.1.azurestaticapps.net";

const isDevelopment = import.meta.env.DEV;
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "[::1]");
const isProduction =
  typeof window !== "undefined" &&
  window.location.hostname === PRODUCTION_DOMAIN;

export const API_ENDPOINT =
  import.meta.env.VITE_API_ENDPOINT ||
  (isProduction
    ? "/api" // Relative path uses Static Web App authenticated proxy
    : isDevelopment || isLocalhost
    ? "http://localhost:7071/api"
    : "/api"); // Default to relative path for other deployments
export const DELAY_CONFIG = {
  DEFAULT_WAIT: 2000,
  RETRY_DELAY: 5000,
};
