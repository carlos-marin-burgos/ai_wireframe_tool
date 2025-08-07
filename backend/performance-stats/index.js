/**
 * Azure Function: Performance Statistics - Simple Version
 * Returns basic performance metrics without complex dependencies
 */

module.exports = async function (context, req) {
  try {
    // Set CORS headers
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      },
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      context.res.status = 200;
      return;
    }

    // Mock performance data for now
    const performanceData = {
      timestamp: new Date().toISOString(),
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
      wireframeGeneration: {
        totalRequests: 150,
        averageResponseTime: 2500,
        successRate: 0.95,
        errorRate: 0.05,
      },
      resourceUsage: {
        cpuUsage: 45,
        memoryUsage: 65,
        diskUsage: 30,
      },
      apiEndpoints: [
        {
          endpoint: "/api/generate-wireframe",
          requests: 120,
          averageResponseTime: 2800,
          successRate: 0.96,
        },
        {
          endpoint: "/api/health",
          requests: 25,
          averageResponseTime: 150,
          successRate: 0.99,
        },
        {
          endpoint: "/api/performance-stats",
          requests: 5,
          averageResponseTime: 200,
          successRate: 1.0,
        },
      ],
    };

    context.res.status = 200;
    context.res.body = performanceData;
  } catch (error) {
    context.res.status = 500;
    context.res.body = {
      error: "Internal server error",
      message: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};
