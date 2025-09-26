// API configuration for different environments
const isDevelopment = import.meta.env.DEV;
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "[::1]");

// Environment detection - removed hardcoded production domain for flexibility
const isProduction = !isDevelopment && !isLocalhost;

// Always use Function App for production when on Static Web App hostname
const STATIC_WEB_APP_HOSTS = new Set([
  "delightful-pond-064d9a91e.1.azurestaticapps.net",
]);

const productionHostFallback =
  typeof window !== "undefined" &&
  STATIC_WEB_APP_HOSTS.has(window.location.hostname)
    ? "https://func-designetica-prod-working.azurewebsites.net"
    : undefined;

// Centralized port configuration to avoid conflicts
const PORTS = {
  development: {
    primary: 7071, // Azure Functions backend (current running port) - FIXED: Updated to match actual backend
    fallback: 5001, // Clean Express server with NO Microsoft Learn content
    frontend: 5173, // Frontend dev server
  },
  production: {
    primary: 443,
    frontend: 443,
  },
};

// Get the actual base URL that will be used
const getActualBaseUrl = () => {
  if (productionHostFallback) return productionHostFallback;
  if (import.meta.env.VITE_API_BASE_URL)
    return import.meta.env.VITE_API_BASE_URL;
  if (isDevelopment || isLocalhost)
    return `http://localhost:${PORTS.development.primary}`; // Use local functions in dev
  return ""; // Fallback to relative URLs
};

console.log("🔍 API Configuration:", {
  isDevelopment,
  isLocalhost,
  isProduction,
  hostname: typeof window !== "undefined" ? window.location.hostname : "server",
  actualBaseUrl: getActualBaseUrl(),
  hasProductionFallback: Boolean(productionHostFallback),
  willUseDirectFunctionApp: Boolean(productionHostFallback),
  finalBaseURL: getActualBaseUrl(),
});

export const API_CONFIG = {
  // Static configuration - Enhanced Microsoft ecosystem suggestions
  FALLBACK_SUGGESTIONS: [
    // Azure & Cloud Services
    "Create an Azure dashboard with service monitoring and resource management",
    "Design Azure certification journey pages with exam codes (AZ-900, AZ-104, AZ-204, AZ-305)",
    "Build cloud training dashboard with module completion tracking and time estimates",
    "Add skills assessment portal with technology-specific evaluation paths",

    // Documentation & Content
    "Generate Microsoft Docs-style API reference pages with code samples and Try It buttons",
    "Create training module structure with objectives, knowledge checks, and summary",
    "Design hands-on lab interface with Azure sandbox environment integration",
    "Build Q&A community pages with expert answers and voting system",

    // Product-Specific Content
    "Design Azure services catalog with pricing, regions, and getting started tutorials",
    "Create Microsoft 365 admin center with role-based permissions guides",
    "Build Power Platform center with app templates and connector documentation",
    "Generate Visual Studio Code extension marketplace with development tutorials",

    // Career & Professional Development
    "Create career path explorer with job role requirements and skill mapping",
    "Design certification preparation hub with study guides, practice exams, and community forums",
    "Build professional profile dashboard with achievements, transcripts, and learning streaks",
    "Add mentorship platform connecting learners with industry experts",

    // Interactive Learning
    "Generate interactive tutorials with step-by-step Azure portal guidance",
    "Create code playground with live compilation and Azure resource deployment",
    "Design assessment engine with adaptive questioning and personalized feedback",
    "Build virtual labs with real Azure environments and guided exercises",
  ],

  ENDPOINTS: {
    // ✨ AI Wireframe Generation - Using the correct Azure Function endpoint
    GENERATE_WIREFRAME: "/api/generate-wireframe",
    GENERATE_REACT_COMPONENT: "/api/generate-react-component", // NEW: Lovable-style component generation
    GENERATE_WIREFRAME_ENHANCED: "/api/generate-wireframe",
    GENERATE_FLUENT_WIREFRAME: "/api/generate-fluent-wireframe",
    GENERATE_SUGGESTIONS: "/api/generate-suggestions",
    GET_TEMPLATE: "/api/get-template",
    COMPONENT_LIBRARY: "/api/component-library",
    FLUENT_COMPONENTS: "/api/fluent-components",
    FLUENT_COMPONENTS_SEARCH: "/api/fluent-components/search",
    HEALTH: "/api/health",
    WEBSITE_ANALYZER: "/api/websiteAnalyzer", // NEW: Website analysis endpoint (matches Azure Function name)

    // 🔐 OAuth endpoints (align with Azure Function routes which are lowercase)
    FIGMA_OAUTH_STATUS: "/api/figmaoauthstatus",
    FIGMA_OAUTH_START: "/api/figmaoauthstart",
    FIGMA_OAUTH_CALLBACK: "/api/figmaoauthcallback",
    FIGMA_OAUTH_DIAGNOSTICS: "/api/figmaoauthdiagnostics",
    FIGMA_COMPONENTS: "/api/figma/components",
  },

  // Port configuration
  PORTS,

  // FIXED: Use proper URL for different environments
  // In production, Azure Static Web Apps automatically proxy /api/* to the Function App
  // In development, use local Azure Functions port
  BASE_URL: getActualBaseUrl(),
};

// Health check to verify backend has AI capabilities
export const verifyBackendAI = async (baseUrl: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${baseUrl}/api/generate-wireframe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description:
          "Create a certification preparation dashboard with Azure exam tracking, study progress analytics, hands-on lab access, and personalized learning path recommendations",
        fastMode: false,
        useTemplates: false,
        aiOnly: true,
      }),
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
  if (!isDevelopment && !isLocalhost) {
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
  const finalUrl = `${baseUrl}${endpoint}`;

  // Debug logging for Figma endpoints
  if (endpoint.includes("figma")) {
    console.log(`🔍 getApiUrl Debug:`, {
      endpoint,
      customBaseUrl,
      baseUrl,
      API_CONFIG_BASE_URL: API_CONFIG.BASE_URL,
      finalUrl,
      productionHostFallback:
        typeof window !== "undefined" &&
        STATIC_WEB_APP_HOSTS.has(window.location.hostname)
          ? "https://func-designetica-5gwyjxbwvr4s6.azurewebsites.net"
          : undefined,
    });
  }

  return finalUrl;
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
