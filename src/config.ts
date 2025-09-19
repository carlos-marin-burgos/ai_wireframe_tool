// API configuration - PRODUCTION HOTFIX: hardcoded for reliability
const PRODUCTION_DOMAIN = "lemon-field-08a1a0b0f.1.azurestaticapps.net";
const FUNCTION_APP_URL =
  "https://func-original-app-pgno4orkguix6.azurewebsites.net";

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
    ? `${FUNCTION_APP_URL}/api` // Direct to Function App for production
    : isDevelopment || isLocalhost
    ? "http://localhost:7071/api"
    : `${FUNCTION_APP_URL}/api`);
export const DELAY_CONFIG = {
  DEFAULT_WAIT: 2000,
  RETRY_DELAY: 5000,
};
