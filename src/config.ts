// API configuration
export const API_ENDPOINT =
  import.meta.env.VITE_API_ENDPOINT || 
  (import.meta.env.DEV || 
   (typeof window !== "undefined" && 
    (window.location.hostname === "localhost" ||
     window.location.hostname === "127.0.0.1" ||
     window.location.hostname === "[::1]"))
    ? "http://localhost:7071/api"
    : "https://func-designetica-prod-xabnur6oyusju.azurewebsites.net/api");

export const DELAY_CONFIG = {
  DEFAULT_WAIT: 2000,
  RETRY_DELAY: 5000,
};
