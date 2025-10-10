/**
 * Authentication Middleware for Azure Functions
 * Validates that requests come from authenticated Microsoft employees
 */

/**
 * Validates that the request is from an authenticated Microsoft employee
 * @param {Object} req - The Azure Function request object
 * @returns {Object} - { valid: boolean, email?: string, error?: string }
 */
function validateMicrosoftEmployee(req) {
  // Get the client principal header from Azure Static Web Apps
  const clientPrincipal = req.headers["x-ms-client-principal"];

  if (!clientPrincipal) {
    return {
      valid: false,
      error: "Authentication required. Please sign in with your Microsoft account.",
    };
  }

  try {
    // Decode the base64-encoded principal
    const decoded = JSON.parse(
      Buffer.from(clientPrincipal, "base64").toString("utf-8")
    );

    // Extract email from claims
    const userEmail =
      decoded?.claims?.find(
        (c) =>
          c.typ ===
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      )?.val || decoded?.userDetails;

    if (!userEmail) {
      return {
        valid: false,
        error: "Unable to determine user email from authentication.",
      };
    }

    // Validate that the user is a Microsoft employee
    const isMicrosoftEmployee =
      userEmail && userEmail.toLowerCase().endsWith("@microsoft.com");

    if (!isMicrosoftEmployee) {
      return {
        valid: false,
        error:
          "Access denied. This application is restricted to @microsoft.com email addresses only.",
      };
    }

    return {
      valid: true,
      email: userEmail,
      userId: decoded?.userId,
      userDetails: decoded?.userDetails,
    };
  } catch (error) {
    console.error("❌ Failed to parse authentication header:", error);
    return {
      valid: false,
      error: "Invalid authentication data.",
    };
  }
}

/**
 * Express-style middleware wrapper for Azure Functions
 * Use this at the start of your Azure Function handler
 * 
 * @example
 * const { requireMicrosoftAuth } = require("../lib/authMiddleware");
 * 
 * module.exports = async function (context, req) {
 *   const auth = requireMicrosoftAuth(req);
 *   if (!auth.valid) {
 *     context.res = {
 *       status: 403,
 *       headers: { "Content-Type": "application/json" },
 *       body: { error: auth.error }
 *     };
 *     return;
 *   }
 *   
 *   // Continue with authenticated user (auth.email available)
 *   context.log(`✅ Authenticated request from ${auth.email}`);
 *   // ... rest of your function
 * };
 */
function requireMicrosoftAuth(req) {
  return validateMicrosoftEmployee(req);
}

/**
 * Get user information from authenticated request
 * Only call this after validating authentication
 */
function getUserInfo(req) {
  const auth = validateMicrosoftEmployee(req);
  if (!auth.valid) {
    return null;
  }
  return {
    email: auth.email,
    userId: auth.userId,
    userDetails: auth.userDetails,
  };
}

module.exports = {
  validateMicrosoftEmployee,
  requireMicrosoftAuth,
  getUserInfo,
};
