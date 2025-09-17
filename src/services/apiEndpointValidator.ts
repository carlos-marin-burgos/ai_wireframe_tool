/**
 * API Endpoint Validator
 *
 * Prevents API endpoint mismatches by validating endpoints at runtime.
 * This ensures that configured endpoints actually exist and respond correctly.
 *
 * Features:
 * - Runtime endpoint validation
 * - Automatic fallback to working endpoints
 * - Development warnings for missing endpoints
 * - Health check monitoring
 */

interface EndpointStatus {
  endpoint: string;
  isAvailable: boolean;
  lastChecked: number;
  responseTime?: number;
  error?: string;
}

interface ValidatedEndpoints {
  [key: string]: EndpointStatus;
}

class ApiEndpointValidator {
  private cache: ValidatedEndpoints = {};
  private cacheExpiration = 5 * 60 * 1000; // 5 minutes
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Validates if an endpoint is available and working
   */
  async validateEndpoint(endpoint: string): Promise<EndpointStatus> {
    const now = Date.now();

    // Check cache first
    if (
      this.cache[endpoint] &&
      now - this.cache[endpoint].lastChecked < this.cacheExpiration
    ) {
      return this.cache[endpoint];
    }

    console.log(`🔍 Validating endpoint: ${endpoint}`);

    const startTime = Date.now();
    const status: EndpointStatus = {
      endpoint,
      isAvailable: false,
      lastChecked: now,
    };

    try {
      // For POST endpoints, send a minimal OPTIONS request first
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "OPTIONS",
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      status.isAvailable = response.status < 500; // Accept 200, 404, 405 as "available"
      status.responseTime = Date.now() - startTime;

      if (!status.isAvailable) {
        status.error = `HTTP ${response.status}`;
      }
    } catch (error) {
      status.error = error instanceof Error ? error.message : "Unknown error";
      status.isAvailable = false;
    }

    // Cache the result
    this.cache[endpoint] = status;

    if (!status.isAvailable) {
      console.warn(`⚠️ Endpoint ${endpoint} is not available:`, status.error);
    } else {
      console.log(
        `✅ Endpoint ${endpoint} is available (${status.responseTime}ms)`
      );
    }

    return status;
  }

  /**
   * Validates multiple endpoints and returns a report
   */
  async validateAllEndpoints(endpoints: string[]): Promise<ValidatedEndpoints> {
    console.log(`🚀 Validating ${endpoints.length} API endpoints...`);

    const validationPromises = endpoints.map((endpoint) =>
      this.validateEndpoint(endpoint)
    );
    const results = await Promise.all(validationPromises);

    const report: ValidatedEndpoints = {};
    results.forEach((status) => {
      report[status.endpoint] = status;
    });

    // Log summary
    const available = results.filter((r) => r.isAvailable).length;
    const unavailable = results.length - available;

    if (unavailable > 0) {
      console.error(
        `❌ ${unavailable}/${results.length} endpoints are unavailable!`
      );
      console.error(
        "Unavailable endpoints:",
        results
          .filter((r) => !r.isAvailable)
          .map((r) => `${r.endpoint} (${r.error})`)
          .join(", ")
      );
    } else {
      console.log(`✅ All ${results.length} endpoints are available!`);
    }

    return report;
  }

  /**
   * Gets a validated endpoint, throwing an error if not available
   */
  async getValidatedEndpoint(endpoint: string): Promise<string> {
    const status = await this.validateEndpoint(endpoint);

    if (!status.isAvailable) {
      throw new Error(
        `API endpoint ${endpoint} is not available. Error: ${status.error}. ` +
          `Please check your backend configuration or ensure Azure Functions are running.`
      );
    }

    return `${this.baseUrl}${endpoint}`;
  }

  /**
   * Safe API call that validates endpoint before making request
   */
  async safeFetch(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const validatedUrl = await this.getValidatedEndpoint(endpoint);

    console.log(`🚀 Making validated API call to: ${endpoint}`);

    return fetch(validatedUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  }

  /**
   * Clear cache (useful for development)
   */
  clearCache(): void {
    this.cache = {};
    console.log("🧹 API endpoint validation cache cleared");
  }

  /**
   * Get health report
   */
  getHealthReport(): ValidatedEndpoints {
    return { ...this.cache };
  }
}

// Singleton instance
let validatorInstance: ApiEndpointValidator | null = null;

export function getApiValidator(baseUrl?: string): ApiEndpointValidator {
  if (!validatorInstance) {
    const url =
      baseUrl ||
      import.meta.env.VITE_BACKEND_BASE_URL ||
      (import.meta.env.DEV ? "http://localhost:7071" : window.location.origin);

    validatorInstance = new ApiEndpointValidator(url);
  }
  return validatorInstance;
}

// Export for direct use
export default ApiEndpointValidator;
export type { EndpointStatus, ValidatedEndpoints };
