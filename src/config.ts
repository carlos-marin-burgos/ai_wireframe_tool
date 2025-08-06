// API configuration
export const API_ENDPOINT =
  import.meta.env.VITE_API_ENDPOINT || "http://localhost:7071/api";

export const DELAY_CONFIG = {
  DEFAULT_WAIT: 2000,
  RETRY_DELAY: 5000,
};
