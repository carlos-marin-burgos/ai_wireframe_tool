/**
 * Azure Function: Performance Statistics
 * Returns detailed performance metrics for wireframe generation
 */

const {
  getPerformanceStats,
} = require("../utils/performance-wireframe-generator");

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

    // Get performance statistics
    const stats = getPerformanceStats();

    context.res.status = 200;
    context.res.body = {
      success: true,
      timestamp: new Date().toISOString(),
      performance: stats,
      recommendations: generateRecommendations(stats),
    };
  } catch (error) {
    context.res.status = 500;
    context.res.body = {
      success: false,
      error: "Failed to retrieve performance stats",
      details: error.message,
    };
  }
};

/**
 * Generate performance recommendations based on stats
 */
function generateRecommendations(stats) {
  const recommendations = [];

  if (stats.cacheHitRate < 30) {
    recommendations.push({
      type: "performance",
      message:
        "Low cache hit rate detected. Consider using more common wireframe patterns.",
      impact: "medium",
    });
  }

  if (stats.aiUsageRate > 80) {
    recommendations.push({
      type: "cost",
      message:
        "High AI usage detected. Consider using fast mode for simple requests.",
      impact: "high",
    });
  }

  if (stats.fastModeRate < 50) {
    recommendations.push({
      type: "speed",
      message: "Fast mode underutilized. Enable for simple wireframe requests.",
      impact: "medium",
    });
  }

  if (stats.averageResponseTime > 5000) {
    recommendations.push({
      type: "performance",
      message:
        "High average response time. Consider optimizing complex requests.",
      impact: "high",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: "success",
      message: "Performance metrics look good! 🚀",
      impact: "positive",
    });
  }

  return recommendations;
}
