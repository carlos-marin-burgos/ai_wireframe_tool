// API configuration for different environments
const isDevelopment = import.meta.env.DEV;

export const API_CONFIG = {
  // Use fallback suggestions if Azure Functions fail
  BASE_URL: isDevelopment
    ? "http://localhost:7072"
    : "https://func-designetica-vjib6nx2wh4a4.azurewebsites.net",
  
  // Fallback suggestions for when API fails
  FALLBACK_SUGGESTIONS: [
    "Add clear visual hierarchy with consistent typography and spacing",
    "Implement responsive design with mobile-first approach", 
    "Include accessibility features like keyboard navigation and ARIA labels",
    "Use Microsoft Learn design system components for consistency",
    "Add loading states and error handling for better user feedback",
    "Create intuitive navigation with breadcrumbs and clear call-to-actions"
  ],

  ENDPOINTS: {
    GENERATE_WIREFRAME: "/api/generate-html-wireframe",
    GENERATE_SUGGESTIONS: "/api/generate-suggestions", 
    GET_TEMPLATE: "/api/get-template",
    HEALTH: "/api/health",
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
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
