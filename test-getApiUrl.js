// Test what URL getApiUrl is generating
import { getApiUrl, API_CONFIG } from "../src/config/api.ts";

console.log("🧪 Testing getApiUrl function");
console.log("==============================");

console.log("API_CONFIG.BASE_URL:", API_CONFIG.BASE_URL);
console.log(
  "OAuth Status URL:",
  getApiUrl(API_CONFIG.ENDPOINTS.FIGMA_OAUTH_STATUS)
);
console.log(
  "OAuth Start URL:",
  getApiUrl(API_CONFIG.ENDPOINTS.FIGMA_OAUTH_START)
);

// Test environment detection
console.log("\n🔍 Environment Detection:");
console.log("import.meta.env.DEV:", import.meta.env.DEV);
console.log("window.location available:", typeof window !== "undefined");

if (typeof window !== "undefined") {
  console.log("window.location.hostname:", window.location.hostname);
  console.log("window.location.port:", window.location.port);
}
