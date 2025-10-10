/**
 * Accessibility Validation API Endpoint
 * Provides accessibility checking as a service
 */

const {
  AccessibilityValidationMiddleware,
} = require("../accessibility/validation-middleware");
const { requireMicrosoftAuth } = require("../lib/authMiddleware");

const accessibilityMiddleware = new AccessibilityValidationMiddleware();

module.exports = async function (context, req) {
  // Set CORS headers
  context.res.headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-MS-CLIENT-PRINCIPAL",
    "Content-Type": "application/json",
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    context.res.status = 200;
    context.res.body = "";
    return;
  }

  if (req.method !== "POST") {
    context.res.status = 405;
    context.res.body = {
      error: "Method not allowed. Use POST to validate HTML content.",
    };
    return;
  }

  // Require Microsoft employee authentication
  const auth = requireMicrosoftAuth(req);
  if (!auth.valid) {
    context.res.status = 403;
    context.res.body = {
      error: "Unauthorized",
      message: auth.error || "Microsoft employee authentication required",
    };
    return;
  }

  try {
    const { htmlContent, enforceCompliance = false } = req.body;

    if (!htmlContent) {
      context.res.status = 400;
      context.res.body = {
        error: "Missing required parameter 'htmlContent'",
        usage:
          "POST { htmlContent: '<html>...</html>', enforceCompliance: boolean }",
      };
      return;
    }

    // Validate and optionally fix the HTML content
    const result = accessibilityMiddleware.validateAndFixWireframe(
      htmlContent,
      { enforceCompliance, logIssues: true }
    );

    // Generate comprehensive report
    const report =
      accessibilityMiddleware.generateAccessibilityReport(htmlContent);

    // Success response
    context.res.status = 200;
    context.res.body = {
      success: true,
      validation: {
        isValid: result.isValid,
        wasFixed: result.wasFixed,
        issues: result.issues,
        fixedContent: enforceCompliance ? result.content : undefined,
      },
      report: {
        wcagLevel: report.wcagLevel,
        isCompliant: report.isCompliant,
        recommendations: report.recommendations,
        approvedColors: report.approvedColorPalette,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        enforceCompliance: enforceCompliance,
      },
    };
  } catch (error) {
    console.error("Accessibility validation error:", error);

    context.res.status = 500;
    context.res.body = {
      success: false,
      error: "Internal server error during accessibility validation",
      details: error.message,
    };
  }
};
