/**
 * API Health Check Utility
 *
 * Provides comprehensive health monitoring for all API endpoints.
 * This utility helps developers quickly identify endpoint issues.
 */

import { getApiValidator } from "./apiEndpointValidator";
import type { ValidatedEndpoints } from "./apiEndpointValidator";

interface HealthCheckResult {
  timestamp: string;
  totalEndpoints: number;
  availableEndpoints: number;
  unavailableEndpoints: number;
  avgResponseTime: number;
  endpoints: ValidatedEndpoints;
  summary: string;
}

export class ApiHealthChecker {
  private validator = getApiValidator();

  /**
   * Comprehensive health check of all configured endpoints
   */
  async performHealthCheck(endpoints: string[]): Promise<HealthCheckResult> {
    console.log("🏥 Starting comprehensive API health check...");

    const startTime = Date.now();
    const validatedEndpoints = await this.validator.validateAllEndpoints(
      endpoints
    );
    const endTime = Date.now();

    const available = Object.values(validatedEndpoints).filter(
      (e) => e.isAvailable
    );
    const unavailable = Object.values(validatedEndpoints).filter(
      (e) => !e.isAvailable
    );

    const avgResponseTime =
      available.length > 0
        ? available.reduce((sum, e) => sum + (e.responseTime || 0), 0) /
          available.length
        : 0;

    const result: HealthCheckResult = {
      timestamp: new Date().toISOString(),
      totalEndpoints: endpoints.length,
      availableEndpoints: available.length,
      unavailableEndpoints: unavailable.length,
      avgResponseTime: Math.round(avgResponseTime),
      endpoints: validatedEndpoints,
      summary: this.generateSummary(
        available.length,
        unavailable.length,
        avgResponseTime
      ),
    };

    // Log results
    console.log(`🏥 Health Check Complete (${endTime - startTime}ms):`);
    console.log(
      `   📊 ${result.availableEndpoints}/${result.totalEndpoints} endpoints available`
    );
    console.log(`   ⚡ Average response time: ${result.avgResponseTime}ms`);

    if (result.unavailableEndpoints > 0) {
      console.error(
        `   ❌ ${result.unavailableEndpoints} endpoints are down:`,
        unavailable.map((e) => `${e.endpoint} (${e.error})`)
      );
    }

    return result;
  }

  /**
   * Quick health check for critical endpoints only
   */
  async quickHealthCheck(criticalEndpoints: string[]): Promise<boolean> {
    console.log("⚡ Quick health check for critical endpoints...");

    try {
      const results = await this.validator.validateAllEndpoints(
        criticalEndpoints
      );
      const allAvailable = Object.values(results).every((e) => e.isAvailable);

      if (!allAvailable) {
        const failed = Object.values(results).filter((e) => !e.isAvailable);
        console.error(
          "❌ Critical endpoints are down:",
          failed.map((e) => e.endpoint)
        );
      }

      return allAvailable;
    } catch (error) {
      console.error("❌ Quick health check failed:", error);
      return false;
    }
  }

  /**
   * Continuous health monitoring (for development)
   */
  startHealthMonitoring(
    endpoints: string[],
    intervalMinutes: number = 5
  ): () => void {
    console.log(
      `🔄 Starting health monitoring (every ${intervalMinutes} minutes)...`
    );

    const intervalMs = intervalMinutes * 60 * 1000;

    const interval = setInterval(async () => {
      try {
        await this.performHealthCheck(endpoints);
      } catch (error) {
        console.error("Health monitoring error:", error);
      }
    }, intervalMs);

    // Return cleanup function
    return () => {
      clearInterval(interval);
      console.log("🛑 Health monitoring stopped");
    };
  }

  /**
   * Generate human-readable summary
   */
  private generateSummary(
    available: number,
    unavailable: number,
    avgTime: number
  ): string {
    if (unavailable === 0) {
      return `✅ All systems operational (${Math.round(avgTime)}ms avg)`;
    } else if (unavailable < available) {
      return `⚠️ ${unavailable} endpoints down, ${available} working (${Math.round(
        avgTime
      )}ms avg)`;
    } else {
      return `❌ System degraded: ${unavailable} endpoints down`;
    }
  }

  /**
   * Export health report for debugging
   */
  async exportHealthReport(endpoints: string[]): Promise<string> {
    const result = await this.performHealthCheck(endpoints);

    const report = {
      "Health Check Report": result.summary,
      Timestamp: result.timestamp,
      Statistics: {
        "Total Endpoints": result.totalEndpoints,
        Available: result.availableEndpoints,
        Unavailable: result.unavailableEndpoints,
        "Average Response Time": `${result.avgResponseTime}ms`,
      },
      "Endpoint Details": Object.entries(result.endpoints).map(
        ([endpoint, status]) => ({
          endpoint,
          status: status.isAvailable ? "✅ Available" : `❌ ${status.error}`,
          responseTime: status.responseTime
            ? `${status.responseTime}ms`
            : "N/A",
          lastChecked: new Date(status.lastChecked).toLocaleString(),
        })
      ),
    };

    return JSON.stringify(report, null, 2);
  }
}

// Singleton instance
let healthCheckerInstance: ApiHealthChecker | null = null;

export function getApiHealthChecker(): ApiHealthChecker {
  if (!healthCheckerInstance) {
    healthCheckerInstance = new ApiHealthChecker();
  }
  return healthCheckerInstance;
}

// Development helper functions
export async function checkEndpointsHealth(
  endpoints: string[]
): Promise<HealthCheckResult> {
  const healthChecker = getApiHealthChecker();
  return healthChecker.performHealthCheck(endpoints);
}

export async function validateCriticalEndpoints(
  endpoints: string[]
): Promise<boolean> {
  const healthChecker = getApiHealthChecker();
  return healthChecker.quickHealthCheck(endpoints);
}
