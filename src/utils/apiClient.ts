import { API_CONFIG, getApiUrl } from "../config/api";

interface RetryConfig {
  maxRetries: number;
  delayMs: number;
  backoffFactor: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  delayMs: 1000,
  backoffFactor: 1.5,
};

// Backend health check cache
let backendHealthCache: { isHealthy: boolean; lastCheck: number } = {
  isHealthy: false,
  lastCheck: 0,
};

const HEALTH_CHECK_CACHE_DURATION = 30000; // 30 seconds

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// Check if backend is healthy
async function checkBackendHealth(): Promise<boolean> {
  // In production, always assume healthy to avoid blocking the UI
  // The actual network requests will handle connection failures
  if (!import.meta.env.DEV) {
    return true;
  }

  const now = Date.now();

  // Return cached result if recent
  if (now - backendHealthCache.lastCheck < HEALTH_CHECK_CACHE_DURATION) {
    return backendHealthCache.isHealthy;
  }

  try {
    const healthUrl = getApiUrl(API_CONFIG.ENDPOINTS.HEALTH);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(healthUrl, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const isHealthy = response.ok;
    backendHealthCache = {
      isHealthy,
      lastCheck: now,
    };

    console.log("🏥 Backend health check:", {
      isHealthy,
      url: healthUrl,
      status: response.status,
    });
    return isHealthy;
  } catch (error) {
    console.warn("Backend health check failed:", error);
    backendHealthCache = {
      isHealthy: false,
      lastCheck: now,
    };
    return false;
  }
}

// Enhanced error messages for better user experience
function getReadableErrorMessage(error: Error): string {
  const isDevelopment = import.meta.env.DEV;

  if (error.message.includes("Failed to fetch")) {
    if (isDevelopment) {
      return "Unable to connect to the local backend server. Please ensure the Azure Functions backend is running on localhost:7071";
    } else {
      return "Unable to connect to the backend server. Please check your internet connection or try again later.";
    }
  }
  if (error.message.includes("NetworkError")) {
    return "Network connection error. Please check your internet connection and try again";
  }
  if (error.message.includes("timeout")) {
    return "Request timed out. The backend may be overloaded, please try again in a moment";
  }
  return error.message;
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<Response> {
  let lastError: Error | null = null;
  let delay = retryConfig.delayMs;

  // Remove the health check blocking to avoid "offline mode" errors
  // Let the actual fetch requests handle network failures gracefully

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        // For 503 Service Unavailable (AI service down), return the error response as JSON
        // instead of throwing immediately so we can show the proper error message
        if (response.status === 503) {
          return response; // Let the caller handle the 503 response
        }

        throw new ApiError(
          response.status,
          `HTTP error! status: ${response.status}`
        );
      }

      return response;
    } catch (error) {
      lastError = error as Error;

      // If this was our last attempt, throw a readable error
      if (attempt === retryConfig.maxRetries) {
        const readableMessage = getReadableErrorMessage(lastError);
        throw new Error(readableMessage);
      }

      // If the error is a network error or 5xx server error, retry
      if (
        error instanceof TypeError ||
        (error instanceof ApiError && error.status >= 500)
      ) {
        console.warn(
          `Attempt ${attempt + 1} failed, retrying in ${delay}ms...`
        );
        await sleep(delay);
        delay *= retryConfig.backoffFactor;
        continue;
      }

      // For other errors (like 4xx), don't retry
      throw error;
    }
  }

  // This should never be reached due to the throw in the loop
  throw lastError;
}

export async function apiRequest<T>(
  endpoint: string | string[],
  options: RequestInit = {},
  retryConfig?: RetryConfig
): Promise<T> {
  // BULLETPROOF: Handle multiple endpoints for wireframe generation
  const endpoints = Array.isArray(endpoint) ? endpoint : [endpoint];

  let lastError: Error | null = null;

  // Build list of base URLs to try (multi-port resilience in dev only)
  const baseUrls: string[] = (() => {
    const primary = API_CONFIG.BASE_URL;
    // Only try alternate ports in actual development environment
    if (
      import.meta.env.DEV &&
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "[::1]")
    ) {
      const alternates = ["http://localhost:7071"].filter((u) => u !== primary);
      return [primary, ...alternates];
    }
    return [primary];
  })();

  for (const baseUrl of baseUrls) {
    for (const singleEndpoint of endpoints) {
      const url = `${baseUrl}${singleEndpoint}`;
      console.log(`🔧 BULLETPROOF: Trying endpoint: ${url}`);

      // Merge default headers with provided options
      const mergedOptions = {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      };

      // Add function key for Azure Functions authentication
      const functionKey = import.meta.env.VITE_AZURE_FUNCTION_KEY;
      let finalUrl = url;

      // Add function key as query parameter if available (production security)
      if (functionKey && !import.meta.env.DEV) {
        const separator = url.includes("?") ? "&" : "?";
        finalUrl = `${url}${separator}code=${functionKey}`;
        console.log(
          `🔐 Added function key authentication to production API call`
        );
      }

      try {
        const response = await fetchWithRetry(
          finalUrl,
          mergedOptions,
          retryConfig
        );

        // Handle 503 Service Unavailable responses specially
        if (response.status === 503) {
          const errorData = await response.json();
          throw new ApiError(
            503,
            errorData.message ||
              errorData.error ||
              "Service temporarily unavailable"
          );
        }

        console.log(`✅ BULLETPROOF: Success with endpoint: ${url}`);
        // Persist successful base for session to avoid future port hops
        (window as any).__DESIGNETICA_LAST_WORKING_BASE__ = baseUrl;
        return await response.json();
      } catch (error) {
        lastError = error as Error;
        console.log(
          `❌ BULLETPROOF: Failed with endpoint: ${url}, error:`,
          error instanceof Error ? error.message : error
        );

        // If this is a 404 (endpoint doesn't exist), try the next endpoint
        if (error instanceof ApiError && error.status === 404) {
          continue;
        }

        // For other errors, still try the next endpoint but log the error
        if (endpoints.length > 1) {
          console.log(`⚠️ BULLETPROOF: Trying next endpoint on same base...`);
          continue;
        }
      }
    }
  }

  // All endpoints failed, handle the last error
  if (lastError instanceof ApiError) {
    // Handle specific HTTP errors
    switch (lastError.status) {
      case 401:
        throw new Error("Unauthorized: Please check your API credentials");
      case 403:
        throw new Error(
          "Forbidden: You don't have permission to access this resource"
        );
      case 404:
        throw new Error("Not Found: The requested resource doesn't exist");
      case 429:
        throw new Error("Too Many Requests: Please try again later");
      case 500:
        throw new Error("Server Error: Something went wrong on our end");
      case 503:
        throw new Error(lastError.message); // Use the message from the server
      default:
        throw new Error(`API Error: ${lastError.message}`);
    }
  }

  // Handle network errors
  if (lastError instanceof TypeError) {
    throw new Error("Network Error: Please check your internet connection");
  }

  throw lastError || new Error("All API endpoints failed");
}

export const api = {
  get: <T>(endpoint: string | string[], options: RequestInit = {}) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(
    endpoint: string | string[],
    data: any,
    options: RequestInit = {}
  ) => {
    console.log("🔍 API POST Debug:", {
      endpoint,
      data,
      dataType: typeof data,
      stringifiedData: JSON.stringify(data),
      options,
    });

    return apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  },

  put: <T>(endpoint: string | string[], data: any, options: RequestInit = {}) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string | string[], options: RequestInit = {}) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};

// Export health check function for components to use
export { checkBackendHealth };
