// API configuration for different environments
const isDevelopment = import.meta.env.DEV;

// Centralized port configuration to avoid conflicts
const PORTS = {
  development: {
    primary: 7072, // Azure Functions backend (actually running)
    fallback: 5001, // Simple Express server
    frontend: 5173, // Frontend dev server
  },
  production: {
    primary: 443,
    frontend: 443,
  },
};

export const API_CONFIG = {
  // Static configuration - Enhanced Microsoft Learn ecosystem suggestions
  FALLBACK_SUGGESTIONS: [
    // Learning Paths & Training
    "Create a Microsoft Learn learning path browser with role-based filtering (Developer, Admin, Architect)",
    "Design Azure certification journey pages with exam codes (AZ-900, AZ-104, AZ-204, AZ-305)",
    "Build Microsoft Learn training dashboard with module completion tracking and time estimates",
    "Add Microsoft Learn skills assessment portal with technology-specific evaluation paths",

    // Documentation & Content
    "Generate Microsoft Docs-style API reference pages with code samples and Try It buttons",
    "Create Microsoft Learn module structure with objectives, knowledge checks, and summary",
    "Design Microsoft Learn hands-on lab interface with Azure sandbox environment integration",
    "Build Microsoft Learn Q&A community pages with expert answers and voting system",

    // Product-Specific Content
    "Design Azure services catalog with pricing, regions, and getting started tutorials",
    "Create Microsoft 365 admin center training modules with role-based permissions guides",
    "Build Power Platform learning center with app templates and connector documentation",
    "Generate Visual Studio Code extension marketplace with development tutorials",

    // Career & Professional Development
    "Create Microsoft Learn career path explorer with job role requirements and skill mapping",
    "Design certification preparation hub with study guides, practice exams, and community forums",
    "Build Microsoft Learn profile dashboard with achievements, transcripts, and learning streaks",
    "Add Microsoft Learn mentorship platform connecting learners with industry experts",

    // Interactive Learning
    "Generate Microsoft Learn interactive tutorials with step-by-step Azure portal guidance",
    "Create Microsoft Learn code playground with live compilation and Azure resource deployment",
    "Design Microsoft Learn assessment engine with adaptive questioning and personalized feedback",
    "Build Microsoft Learn virtual labs with real Azure environments and guided exercises",
  ],

  ENDPOINTS: {
    // NUCLEAR OPTION: Single endpoint that works no matter what
    GENERATE_WIREFRAME: "/api/generate-wireframe",
    GENERATE_WIREFRAME_ENHANCED: "/api/generate-wireframe-enhanced",
    GENERATE_FLUENT_WIREFRAME: "/api/generate-fluent-wireframe",
    GENERATE_SUGGESTIONS: "/api/generate-suggestions",
    GET_TEMPLATE: "/api/get-template",
    COMPONENT_LIBRARY: "/api/component-library",
    FLUENT_COMPONENTS: "/api/fluent-components",
    FLUENT_COMPONENTS_SEARCH: "/api/fluent-components/search",
    HEALTH: "/api/health",
  },

  // Port configuration
  PORTS,

  // Get BASE_URL - use environment variable if available, then fallback logic
  BASE_URL:
    import.meta.env.VITE_BACKEND_BASE_URL ||
    (isDevelopment
      ? `http://localhost:7072`
      : "https://func-designetica-vdlmicyosd4ua.azurewebsites.net"),
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
          "Create a Microsoft Learn certification preparation dashboard with Azure exam tracking, study progress analytics, hands-on lab access, and personalized learning path recommendations",
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
