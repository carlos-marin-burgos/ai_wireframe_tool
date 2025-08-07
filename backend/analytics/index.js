/**
 * Analytics Data Endpoint for Power BI Dashboard
 * Provides aggregated analytics data for business intelligence
 */

module.exports = async function (context, req) {
  const startTime = Date.now();
  const correlationId = require("crypto").randomUUID();

  try {
    // Set CORS headers
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "X-Correlation-ID": correlationId,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      context.res.status = 200;
      return;
    }

    // Get time range from query parameters (default: last 24 hours)
    const hoursBack = parseInt(req.query.hours) || 24;
    const fromDate = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
    const toDate = new Date();

    // Generate sample analytics data (in real implementation, this would query Application Insights)
    const analyticsData = {
      timeRange: {
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
        hoursBack,
      },
      summary: {
        totalRequests: Math.floor(Math.random() * 1000) + 500,
        successfulRequests: Math.floor(Math.random() * 900) + 450,
        aiGeneratedRequests: Math.floor(Math.random() * 700) + 350,
        averageResponseTime: Math.floor(Math.random() * 2000) + 1000,
        uniqueSessions: Math.floor(Math.random() * 200) + 100,
        totalErrors: Math.floor(Math.random() * 50) + 10,
      },
      trends: {
        requestsPerHour: generateHourlyData(hoursBack),
        responseTimePerHour: generatePerformanceData(hoursBack),
        aiUsagePerHour: generateAIUsageData(hoursBack),
        errorRatePerHour: generateErrorData(hoursBack),
      },
      topFeatures: [
        { feature: "Form Generation", usage: 45, trend: "+12%" },
        { feature: "Dashboard Creation", usage: 23, trend: "+8%" },
        { feature: "Landing Pages", usage: 18, trend: "+15%" },
        { feature: "Content Pages", usage: 14, trend: "+5%" },
      ],
      userBehavior: {
        averageSessionDuration: Math.floor(Math.random() * 600) + 300, // seconds
        averageGenerationsPerSession:
          Math.round((Math.random() * 3 + 1) * 10) / 10,
        topUserAgents: [
          { browser: "Chrome", percentage: 68 },
          { browser: "Firefox", percentage: 18 },
          { browser: "Safari", percentage: 10 },
          { browser: "Edge", percentage: 4 },
        ],
        peakUsageHours: [
          { hour: 14, requests: 120 },
          { hour: 15, requests: 135 },
          { hour: 16, requests: 118 },
          { hour: 10, requests: 98 },
        ],
      },
      qualityMetrics: {
        averageContentLength: Math.floor(Math.random() * 3000) + 2000,
        complexRequestPercentage: Math.floor(Math.random() * 30) + 20,
        imageAnalysisUsage: Math.floor(Math.random() * 15) + 5,
        fallbackUsagePercentage: Math.floor(Math.random() * 10) + 2,
      },
      businessMetrics: {
        costPerRequest: 0.02, // USD
        totalCostEstimate: (Math.random() * 50 + 20).toFixed(2),
        efficiency: {
          aiSuccessRate: Math.floor(Math.random() * 15) + 85, // 85-100%
          averageRetries: Math.round((Math.random() * 0.5 + 1) * 10) / 10,
          cacheHitRate: Math.floor(Math.random() * 20) + 70, // 70-90%
        },
      },
      timestamp: new Date().toISOString(),
      correlationId,
    };

    // Simple console logging instead of analytics logger
    console.log(`📊 [ANALYTICS] Request successful: ${correlationId}`, {
      hoursBack,
      dataPoints: analyticsData.trends.requestsPerHour.length,
      responseTimeMs: Date.now() - startTime,
    });

    context.res.status = 200;
    context.res.body = analyticsData;
  } catch (error) {
    const responseTime = Date.now() - startTime;

    // Simple console logging instead of analytics logger
    console.error(`❌ [ANALYTICS] Error: ${error.message}`, {
      correlationId,
      responseTimeMs: responseTime,
      stack: error.stack,
    });

    context.res.status = 500;
    context.res.body = {
      error: "Failed to retrieve analytics data",
      message: error.message,
      timestamp: new Date().toISOString(),
      correlationId,
    };
  }
};

// Helper functions to generate sample data
function generateHourlyData(hours) {
  const data = [];
  for (let i = hours - 1; i >= 0; i--) {
    const hour = new Date(Date.now() - i * 60 * 60 * 1000);
    data.push({
      hour: hour.toISOString(),
      requests: Math.floor(Math.random() * 100) + 20,
      hourOfDay: hour.getHours(),
    });
  }
  return data;
}

function generatePerformanceData(hours) {
  const data = [];
  for (let i = hours - 1; i >= 0; i--) {
    const hour = new Date(Date.now() - i * 60 * 60 * 1000);
    data.push({
      hour: hour.toISOString(),
      averageResponseTime: Math.floor(Math.random() * 1500) + 800,
      p95ResponseTime: Math.floor(Math.random() * 3000) + 1500,
      hourOfDay: hour.getHours(),
    });
  }
  return data;
}

function generateAIUsageData(hours) {
  const data = [];
  for (let i = hours - 1; i >= 0; i--) {
    const hour = new Date(Date.now() - i * 60 * 60 * 1000);
    const totalRequests = Math.floor(Math.random() * 100) + 20;
    const aiRequests = Math.floor(totalRequests * (Math.random() * 0.3 + 0.6)); // 60-90% AI usage
    data.push({
      hour: hour.toISOString(),
      totalRequests,
      aiRequests,
      aiUsagePercentage: Math.round((aiRequests / totalRequests) * 100),
      hourOfDay: hour.getHours(),
    });
  }
  return data;
}

function generateErrorData(hours) {
  const data = [];
  for (let i = hours - 1; i >= 0; i--) {
    const hour = new Date(Date.now() - i * 60 * 60 * 1000);
    const totalRequests = Math.floor(Math.random() * 100) + 20;
    const errors = Math.floor(totalRequests * (Math.random() * 0.1)); // 0-10% error rate
    data.push({
      hour: hour.toISOString(),
      totalRequests,
      errors,
      errorRate: Math.round((errors / totalRequests) * 100 * 10) / 10, // 1 decimal place
      hourOfDay: hour.getHours(),
    });
  }
  return data;
}
