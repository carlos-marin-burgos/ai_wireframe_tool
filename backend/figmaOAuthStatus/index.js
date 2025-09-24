const axios = require("axios");

// Simple in-memory token storage (temporary for demo)
// In production, use Azure Key Vault, Cosmos DB, or similar
let tokenStorage = null;

function loadTokens() {
  try {
    console.log("🔍 Attempting to load tokens...");
    console.log(
      "🔍 Environment FIGMA_STORED_TOKENS exists:",
      !!process.env.FIGMA_STORED_TOKENS
    );
    console.log("🔍 In-memory tokenStorage exists:", !!tokenStorage);

    // Try to load from environment variable first (for persistence between function calls)
    if (process.env.FIGMA_STORED_TOKENS) {
      const tokens = JSON.parse(process.env.FIGMA_STORED_TOKENS);
      console.log("📖 Successfully loaded tokens from environment variable");
      console.log(
        "📖 Token expires at:",
        new Date(tokens.expires_at).toISOString()
      );
      return tokens;
    }

    // Fallback to in-memory storage
    if (tokenStorage) {
      console.log("📖 Successfully loaded tokens from in-memory storage");
      console.log(
        "📖 Token expires at:",
        new Date(tokenStorage.expires_at).toISOString()
      );
      return tokenStorage;
    }

    console.log("❌ No tokens found in either storage location");
  } catch (error) {
    console.error("❌ Error loading tokens:", error);
  }
  return null;
}

function saveTokens(tokens) {
  try {
    const tokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_at || Date.now() + tokens.expires_in * 1000,
      scope: tokens.scope,
      created_at: Date.now(),
    };

    // Store in memory
    tokenStorage = tokenData;
    console.log("💾 Tokens saved to in-memory storage");

    // Also try to save to environment (won't persist but worth trying)
    try {
      process.env.FIGMA_STORED_TOKENS = JSON.stringify(tokenData);
      console.log("💾 Tokens also stored in environment variable");
    } catch (envError) {
      console.warn(
        "⚠️ Could not save to environment variable:",
        envError.message
      );
    }

    return true;
  } catch (error) {
    console.error("Error saving tokens:", error);
    return false;
  }
}

async function validateToken(accessToken) {
  try {
    const response = await axios.get("https://api.figma.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: 5000,
    });

    return {
      valid: true,
      user: response.data,
    };
  } catch (error) {
    console.error(
      "Token validation failed:",
      error.response?.status,
      error.response?.data
    );
    return {
      valid: false,
      error: error.response?.data || error.message,
    };
  }
}

module.exports = async function (context, req) {
  console.log("🔍 Figma OAuth Status Check");

  // CORS headers
  context.res = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  };

  if (req.method === "OPTIONS") {
    context.res.status = 200;
    context.res.body = "";
    return;
  }

  try {
    // Handle token saving from callback
    if (req.method === "POST" && req.body && req.body.access_token) {
      const saved = saveTokens(req.body);
      if (saved) {
        context.res.status = 200;
        context.res.body = {
          status: "token_saved",
          message: "OAuth token saved successfully",
        };
      } else {
        context.res.status = 500;
        context.res.body = {
          status: "save_failed",
          message: "Failed to save OAuth token",
        };
      }
      return;
    }

    // Handle status check (GET request)
    if (req.method === "GET") {
      const tokens = loadTokens();

      if (!tokens || !tokens.access_token) {
        context.res.status = 200;
        context.res.body = {
          status: "authorization_required",
          connected: false,
          message: "No OAuth tokens found",
        };
        return;
      }

      // Check if token is expired
      if (tokens.expires_at && Date.now() > tokens.expires_at) {
        context.res.status = 200;
        context.res.body = {
          status: "authorization_required",
          connected: false,
          message: "OAuth tokens expired",
        };
        return;
      }

      // Validate token with Figma API
      const validation = await validateToken(tokens.access_token);

      if (validation.valid) {
        context.res.status = 200;
        context.res.body = {
          status: "already_authorized",
          connected: true,
          message: "Connected to Figma",
          user: validation.user,
          expires_at: tokens.expires_at,
        };
      } else {
        context.res.status = 200;
        context.res.body = {
          status: "authorization_required",
          connected: false,
          message: "Invalid or expired OAuth token",
          error: validation.error,
        };
      }
      return;
    }

    context.res.status = 405;
    context.res.body = { error: "Method not allowed" };
  } catch (error) {
    console.error("❌ OAuth status check error:", error);
    context.res.status = 500;
    context.res.body = {
      status: "error",
      connected: false,
      error: "Failed to check OAuth status",
      details: error.message,
    };
  }
};

// Export helper functions for use in other modules
module.exports.saveTokens = saveTokens;
module.exports.loadTokens = loadTokens;
module.exports.validateToken = validateToken;
