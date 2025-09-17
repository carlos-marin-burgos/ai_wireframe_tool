/**
 * API Discovery Service - Browser Compatible
 *
 * Discovers and validates Azure Function endpoints at runtime
 */

import apiEndpointValidator from "./apiEndpointValidator";

export interface DiscoveredEndpoint {
  endpoint: string;
  isAvailable: boolean;
  responseTime?: number;
  lastChecked: Date;
  methods?: string[];
}

export interface ApiDiscoveryResult {
  discoveredEndpoints: DiscoveredEndpoint[];
  totalEndpoints: number;
  availableEndpoints: number;
  discoveryTime: Date;
  baseUrl: string;
}

class ApiDiscoveryService {
  private commonEndpoints = [
    "/api/generate-wireframe",
    "/api/generate-suggestions",
    "/api/generate-component",
    "/api/generate-layout",
    "/api/process-design",
    "/api/figmaOAuthCallback",
    "/api/figmaToken",
    "/api/health",
    "/api/status",
  ];

  private discoveryCache = new Map<string, DiscoveredEndpoint>();
  private cacheExpiration = 5 * 60 * 1000; // 5 minutes

  async discoverEndpoints(
    baseUrl: string = "http://localhost:7071"
  ): Promise<ApiDiscoveryResult> {
    console.log("🔍 Discovering Azure Function endpoints...");

    const discoveredEndpoints: DiscoveredEndpoint[] = [];
    const discoveryTime = new Date();

    // Test common endpoints
    for (const endpoint of this.commonEndpoints) {
      const fullUrl = `${baseUrl}${endpoint}`;
      const discovered = await this.discoverEndpoint(fullUrl);
      discoveredEndpoints.push(discovered);
    }

    // Try to discover additional endpoints by probing
    const additionalEndpoints = await this.probeAdditionalEndpoints(baseUrl);
    discoveredEndpoints.push(...additionalEndpoints);

    const availableEndpoints = discoveredEndpoints.filter(
      (e) => e.isAvailable
    ).length;

    const result: ApiDiscoveryResult = {
      discoveredEndpoints,
      totalEndpoints: discoveredEndpoints.length,
      availableEndpoints,
      discoveryTime,
      baseUrl,
    };

    console.log(
      `✅ Discovery complete: ${availableEndpoints}/${discoveredEndpoints.length} endpoints available`
    );
    return result;
  }

  private async discoverEndpoint(
    endpoint: string
  ): Promise<DiscoveredEndpoint> {
    const cached = this.getCachedEndpoint(endpoint);
    if (cached) {
      return cached;
    }

    const startTime = performance.now();

    try {
      const validator = new apiEndpointValidator("http://localhost:7071");
      const validation = await validator.validateEndpoint(endpoint);
      const responseTime = performance.now() - startTime;

      const discovered: DiscoveredEndpoint = {
        endpoint,
        isAvailable: validation.isAvailable,
        responseTime: validation.responseTime || Math.round(responseTime),
        lastChecked: new Date(),
      };

      this.cacheEndpoint(endpoint, discovered);
      return discovered;
    } catch (error) {
      const discovered: DiscoveredEndpoint = {
        endpoint,
        isAvailable: false,
        lastChecked: new Date(),
      };

      this.cacheEndpoint(endpoint, discovered);
      return discovered;
    }
  }

  private async probeAdditionalEndpoints(
    baseUrl: string
  ): Promise<DiscoveredEndpoint[]> {
    // Common Azure Function patterns to probe
    const probePatterns = [
      "/api/health-check",
      "/api/get-config",
      "/api/process-request",
      "/api/webhook",
      "/api/auth",
      "/api/data",
      "/api/upload",
      "/api/download",
    ];

    const results: DiscoveredEndpoint[] = [];

    for (const pattern of probePatterns) {
      try {
        const discovered = await this.discoverEndpoint(`${baseUrl}${pattern}`);
        if (discovered.isAvailable) {
          results.push(discovered);
        }
      } catch (error) {
        // Silently skip failed probes
      }
    }

    return results;
  }

  private getCachedEndpoint(endpoint: string): DiscoveredEndpoint | null {
    const cached = this.discoveryCache.get(endpoint);
    if (!cached) return null;

    const isExpired =
      Date.now() - cached.lastChecked.getTime() > this.cacheExpiration;
    if (isExpired) {
      this.discoveryCache.delete(endpoint);
      return null;
    }

    return cached;
  }

  private cacheEndpoint(
    endpoint: string,
    discovered: DiscoveredEndpoint
  ): void {
    this.discoveryCache.set(endpoint, discovered);
  }

  async validateDiscoveredEndpoints(
    discoveryResult: ApiDiscoveryResult
  ): Promise<DiscoveredEndpoint[]> {
    const revalidated: DiscoveredEndpoint[] = [];

    for (const endpoint of discoveryResult.discoveredEndpoints) {
      const current = await this.discoverEndpoint(endpoint.endpoint);
      revalidated.push(current);
    }

    return revalidated;
  }

  generateDiscoveryReport(result: ApiDiscoveryResult): string {
    const {
      discoveredEndpoints,
      totalEndpoints,
      availableEndpoints,
      discoveryTime,
      baseUrl,
    } = result;

    const report = [
      "📋 API Discovery Report",
      "=".repeat(50),
      `🕐 Discovery Time: ${discoveryTime.toLocaleString()}`,
      `🌐 Base URL: ${baseUrl}`,
      `📊 Status: ${availableEndpoints}/${totalEndpoints} endpoints available`,
      "",
      "📍 Discovered Endpoints:",
      ...discoveredEndpoints.map(
        (endpoint) =>
          `${endpoint.isAvailable ? "✅" : "❌"} ${endpoint.endpoint}${
            endpoint.responseTime ? ` (${endpoint.responseTime}ms)` : ""
          }`
      ),
      "",
      "💡 Available Methods:",
      ...discoveredEndpoints
        .filter((e) => e.isAvailable && e.methods)
        .map((e) => `   ${e.endpoint}: ${e.methods?.join(", ")}`),
    ].join("\n");

    return report;
  }

  async exportDiscoveryResult(result: ApiDiscoveryResult): Promise<void> {
    const report = this.generateDiscoveryReport(result);
    console.log(report);

    // Store in localStorage for debugging
    try {
      localStorage.setItem(
        "api-discovery-result",
        JSON.stringify(result, null, 2)
      );
      console.log(
        '💾 Discovery result stored in localStorage as "api-discovery-result"'
      );
    } catch (error) {
      console.warn(
        "⚠️ Could not store discovery result in localStorage:",
        error
      );
    }
  }

  clearDiscoveryCache(): void {
    this.discoveryCache.clear();
    console.log("🧹 Discovery cache cleared");
  }
}

export const apiDiscoveryService = new ApiDiscoveryService();
