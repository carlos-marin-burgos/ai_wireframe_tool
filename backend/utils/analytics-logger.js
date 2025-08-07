/**
 * Enhanced Analytics Logger for Power BI Dashboard Integration
 * Provides structured logging for Application Insights with business intelligence metrics
 */

const appInsights = require("applicationinsights");

class AnalyticsLogger {
  constructor() {
    this.isInitialized = false;
    this.client = null;
    this.init();
  }

  init() {
    try {
      // Initialize Application Insights if connection string is available
      const connectionString =
        process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

      if (connectionString) {
        appInsights
          .setup(connectionString)
          .setAutoDependencyCorrelation(true)
          .setAutoCollectRequests(true)
          .setAutoCollectPerformance(true, true)
          .setAutoCollectExceptions(true)
          .setAutoCollectDependencies(true)
          .setAutoCollectConsole(true)
          .setUseDiskRetryCaching(true)
          .setSendLiveMetrics(true)
          .start();

        this.client = appInsights.defaultClient;
        this.isInitialized = true;

        console.log("✅ Application Insights Analytics Logger initialized");
      } else {
        console.warn(
          "⚠️ Application Insights connection string not found - using console logging"
        );
        this.isInitialized = false;
      }
    } catch (error) {
      console.error("❌ Failed to initialize Application Insights:", error);
      this.isInitialized = false;
    }
  }

  /**
   * Log wireframe generation request with comprehensive analytics
   * @param {Object} params - Analytics parameters
   */
  logWireframeGeneration(params) {
    const {
      correlationId,
      sessionId,
      description,
      method,
      processingTimeMs,
      success,
      aiGenerated,
      source,
      userAgent,
      colorScheme,
      htmlLength,
      errorMessage,
      attempt,
      hasImageAnalysis,
      imageAnalysisConfidence,
    } = params;

    // Create structured analytics event
    const analyticsEvent = {
      name: "WireframeGeneration",
      properties: {
        // Request Identification
        correlationId,
        sessionId,

        // User Input Analytics
        descriptionLength: description?.length || 0,
        descriptionComplexity: this.calculateComplexity(description),
        requestMethod: method,
        colorScheme,
        userAgent: userAgent ? this.parseUserAgent(userAgent) : "unknown",

        // Processing Analytics
        processingTimeMs,
        success,
        errorMessage: errorMessage || "",

        // AI Generation Analytics
        aiGenerated,
        generationSource: source,
        generationAttempt: attempt || 1,

        // Content Analytics
        outputLength: htmlLength || 0,
        contentQuality: this.assessContentQuality(htmlLength, success),

        // Image Analysis (if applicable)
        hasImageAnalysis: !!hasImageAnalysis,
        imageAnalysisConfidence: imageAnalysisConfidence || 0,

        // Business Metrics
        timestamp: new Date().toISOString(),
        businessDay: this.getBusinessDay(),
        timeOfDay: this.getTimeOfDay(),

        // Feature Usage
        featureCategory: this.categorizeRequest(description, hasImageAnalysis),
        usagePattern: this.identifyUsagePattern(sessionId, description),
      },
      measurements: {
        processingTime: processingTimeMs,
        descriptionLength: description?.length || 0,
        outputLength: htmlLength || 0,
        successRate: success ? 1 : 0,
        aiSuccessRate: aiGenerated && success ? 1 : 0,
        imageConfidence: imageAnalysisConfidence || 0,
      },
    };

    // Send to Application Insights
    if (this.isInitialized && this.client) {
      this.client.trackEvent(analyticsEvent);

      // Track custom metrics for Power BI dashboard
      this.client.trackMetric({
        name: "WireframeGeneration.ProcessingTime",
        value: processingTimeMs,
      });

      this.client.trackMetric({
        name: "WireframeGeneration.SuccessRate",
        value: success ? 1 : 0,
      });

      this.client.trackMetric({
        name: "WireframeGeneration.AIUsage",
        value: aiGenerated ? 1 : 0,
      });

      // Performance metrics
      this.client.trackMetric({
        name: "WireframeGeneration.ContentLength",
        value: htmlLength || 0,
      });
    }

    // Also log to console for development
    console.log(
      `📊 [ANALYTICS] WireframeGeneration: ${success ? "SUCCESS" : "FAILED"}`,
      {
        correlationId,
        processingTimeMs,
        source,
        aiGenerated,
        contentLength: htmlLength,
      }
    );
  }

  /**
   * Log user session analytics
   */
  logUserSession(
    sessionId,
    userAgent,
    sessionDuration,
    pageViews,
    wireframeGenerations
  ) {
    const sessionEvent = {
      name: "UserSession",
      properties: {
        sessionId,
        userAgent: this.parseUserAgent(userAgent),
        sessionDurationMs: sessionDuration,
        pageViews,
        wireframeGenerations,
        timestamp: new Date().toISOString(),
        businessDay: this.getBusinessDay(),
        sessionCategory: this.categorizeSession(
          sessionDuration,
          wireframeGenerations
        ),
      },
      measurements: {
        sessionDuration,
        pageViews,
        wireframeGenerations,
        avgTimePerGeneration:
          wireframeGenerations > 0 ? sessionDuration / wireframeGenerations : 0,
      },
    };

    if (this.isInitialized && this.client) {
      this.client.trackEvent(sessionEvent);
    }

    console.log(`📊 [ANALYTICS] UserSession: ${sessionId}`, {
      duration: sessionDuration,
      generations: wireframeGenerations,
    });
  }

  /**
   * Log API performance metrics
   */
  logAPIPerformance(
    endpoint,
    method,
    statusCode,
    responseTimeMs,
    errorDetails = null
  ) {
    const performanceEvent = {
      name: "APIPerformance",
      properties: {
        endpoint,
        method,
        statusCode,
        success: statusCode >= 200 && statusCode < 300,
        errorDetails: errorDetails || "",
        timestamp: new Date().toISOString(),
        businessDay: this.getBusinessDay(),
      },
      measurements: {
        responseTime: responseTimeMs,
        errorRate: errorDetails ? 1 : 0,
      },
    };

    if (this.isInitialized && this.client) {
      this.client.trackEvent(performanceEvent);

      this.client.trackMetric({
        name: "API.ResponseTime",
        value: responseTimeMs,
      });

      this.client.trackMetric({
        name: "API.ErrorRate",
        value: errorDetails ? 1 : 0,
      });
    }

    console.log(`📊 [ANALYTICS] API Performance: ${endpoint}`, {
      method,
      statusCode,
      responseTimeMs,
    });
  }

  /**
   * Log business intelligence metrics
   */
  logBusinessMetrics(metricType, value, properties = {}) {
    const businessEvent = {
      name: "BusinessMetrics",
      properties: {
        metricType,
        timestamp: new Date().toISOString(),
        businessDay: this.getBusinessDay(),
        timeOfDay: this.getTimeOfDay(),
        ...properties,
      },
      measurements: {
        value,
      },
    };

    if (this.isInitialized && this.client) {
      this.client.trackEvent(businessEvent);

      this.client.trackMetric({
        name: `Business.${metricType}`,
        value,
      });
    }

    console.log(`📊 [ANALYTICS] Business Metric: ${metricType} = ${value}`);
  }

  // Helper Methods for Analytics

  calculateComplexity(description) {
    if (!description) return "simple";

    const length = description.length;
    const wordCount = description.split(" ").length;
    const hasSpecialTerms =
      /form|dashboard|chart|table|grid|navigation|menu|button/i.test(
        description
      );

    if (length > 200 || wordCount > 40 || hasSpecialTerms) return "complex";
    if (length > 100 || wordCount > 20) return "medium";
    return "simple";
  }

  assessContentQuality(htmlLength, success) {
    if (!success) return "failed";
    if (!htmlLength) return "empty";
    if (htmlLength > 5000) return "rich";
    if (htmlLength > 2000) return "good";
    if (htmlLength > 500) return "basic";
    return "minimal";
  }

  parseUserAgent(userAgent) {
    if (!userAgent) return "unknown";

    // Simple user agent parsing for analytics
    if (userAgent.includes("Chrome")) return "chrome";
    if (userAgent.includes("Firefox")) return "firefox";
    if (userAgent.includes("Safari")) return "safari";
    if (userAgent.includes("Edge")) return "edge";
    return "other";
  }

  getBusinessDay() {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[new Date().getDay()];
  }

  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 6) return "night";
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  }

  categorizeRequest(description, hasImageAnalysis) {
    if (hasImageAnalysis) return "image-based";
    if (!description) return "basic";

    const desc = description.toLowerCase();
    if (desc.includes("form")) return "form";
    if (desc.includes("dashboard")) return "dashboard";
    if (desc.includes("landing")) return "landing";
    if (desc.includes("blog") || desc.includes("article")) return "content";
    return "general";
  }

  identifyUsagePattern(sessionId, description) {
    // This could be enhanced with session history analysis
    const desc = description?.toLowerCase() || "";
    if (desc.includes("test") || desc.includes("sample")) return "testing";
    if (desc.includes("prototype") || desc.includes("demo"))
      return "prototyping";
    if (desc.includes("client") || desc.includes("customer"))
      return "client-work";
    return "exploration";
  }

  categorizeSession(duration, generations) {
    if (generations === 0) return "bounce";
    if (generations === 1 && duration < 60000) return "quick-test";
    if (generations > 5) return "power-user";
    if (duration > 600000) return "deep-work";
    return "regular";
  }

  /**
   * Flush any pending telemetry (useful for Azure Functions)
   */
  flush() {
    if (this.isInitialized && this.client) {
      this.client.flush();
    }
  }
}

// Export singleton instance
const analyticsLogger = new AnalyticsLogger();
module.exports = analyticsLogger;
