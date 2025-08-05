// API configuration for different environments
const isDevelopment = import.meta.env.DEV;

// Centralized port configuration to avoid conflicts
const PORTS = {
  development: {
    primary: 5001, // Simple Express server
    fallback: 7072, // Fallback backend
    frontend: 5173, // Frontend dev server
  },
  production: {
    primary: 443,
    frontend: 443,
  },
};

export const API_CONFIG = {
  // Static configuration
  FALLBACK_SUGGESTIONS: [
    "Create a Microsoft Learn-style documentation layout with step-by-step tutorials",
    "Add Microsoft Learn navigation with breadcrumbs and learning path indicators",
    "Include learning progress tracking and achievement badges",
    "Design with Microsoft Learn color palette (tan/gold accents on white)",
    "Add Microsoft Learn components: code samples, callout boxes, and next steps",
    "Implement Microsoft Learn module structure with clear objectives and assessments",
  ],

  ENDPOINTS: {
    GENERATE_WIREFRAME: "/api/generate-html-wireframe", // Updated for simple server
    GENERATE_SUGGESTIONS: "/api/generate-suggestions",
    GET_TEMPLATE: "/api/get-template",
    HEALTH: "/api/health",
  },

  // Port configuration
  PORTS,

  // Get BASE_URL (always use Azure Functions in production)
  BASE_URL: "https://func-designetica-vjib6nx2wh4a4.azurewebsites.net",
};

// Health check to verify backend has AI capabilities
export const verifyBackendAI = async (baseUrl: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${baseUrl}/api/generate-wireframe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "AI capability test" }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data.aiGenerated === true && data.source?.includes("openai");
    }
    return false;
  } catch (error) {
    console.warn("Backend AI verification failed:", error);
    return false;
  }
};

// Auto-detect working backend (can be called at runtime)
export const detectWorkingBackend = async (): Promise<string> => {
  if (!isDevelopment) {
    return API_CONFIG.BASE_URL;
  }

  const portsToTest = [PORTS.development.primary, PORTS.development.fallback];

  for (const port of portsToTest) {
    const testUrl = `http://localhost:${port}`;
    try {
      // Test health endpoint first
      const healthResponse = await fetch(`${testUrl}/api/health`, {
        method: "GET",
        signal: AbortSignal.timeout(2000),
      });

      if (healthResponse.ok) {
        // Test AI capabilities
        const hasAI = await verifyBackendAI(testUrl);
        if (hasAI) {
          console.log(`✅ AI-enabled backend detected on port ${port}`);
          return testUrl;
        } else {
          console.log(`⚠️ Backend on port ${port} has no AI capabilities`);
        }
      }
    } catch (error) {
      console.log(`❌ Port ${port} not available`);
    }
  }

  console.warn("⚠️ No AI-enabled backend detected, using primary port");
  return API_CONFIG.BASE_URL;
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string, customBaseUrl?: string) => {
  const baseUrl = customBaseUrl || API_CONFIG.BASE_URL;
  return `${baseUrl}${endpoint}`;
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  timeout = 90000, // Increased to 90 seconds for OpenAI rate limiting
  maxRetries = 2 // Reduced retries since backend already handles retries
) => {
  let retries = 0;

  while (retries <= maxRetries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(getApiUrl(endpoint), {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      // Don't retry if it was a user abort (not a timeout abort)
      if (
        error instanceof Error &&
        error.name === "AbortError" &&
        controller.signal.aborted
      ) {
        throw new Error(
          "Request was cancelled. This may be due to Azure OpenAI rate limiting taking longer than expected."
        );
      }

      if (retries >= maxRetries) {
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error(
            "Request timed out. Azure OpenAI may be experiencing rate limits. The fallback wireframe should still work."
          );
        }
        throw error;
      }

      retries++;
      // Exponential backoff with jitter
      const delay = Math.min(1000 * 2 ** retries + Math.random() * 1000, 10000);
      console.log(
        `API request failed, retrying in ${delay}ms (attempt ${retries}/${maxRetries})`,
        error
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Maximum retries exceeded");
};
