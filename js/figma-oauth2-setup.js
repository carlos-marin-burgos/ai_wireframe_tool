#!/usr/bin/env node

/**
 * Figma OAuth2 Setup and Configuration
 * This script helps set up OAuth2 for non-specific access to Figma API
 */

import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

/**
 * Figma OAuth2 Configuration Guide
 *
 * To enable OAuth2 access to Figma API, you need to:
 * 1. Create a Figma App in your Figma account
 * 2. Configure redirect URIs
 * 3. Get client credentials
 * 4. Implement OAuth2 flow
 */

// OAuth2 Configuration
const FIGMA_OAUTH_CONFIG = {
  // These will be set from your Figma App
  clientId: process.env.FIGMA_CLIENT_ID || "YOUR_FIGMA_CLIENT_ID",
  clientSecret: process.env.FIGMA_CLIENT_SECRET || "YOUR_FIGMA_CLIENT_SECRET",
  redirectUri:
    process.env.FIGMA_REDIRECT_URI ||
    "http://localhost:7072/api/figma/oauth/callback",

  // Figma OAuth2 endpoints
  authUrl: "https://www.figma.com/oauth",
  tokenUrl: "https://www.figma.com/api/oauth/token",

  // Scopes for Figma API access
  scope: "file_read", // Basic file read access
};

/**
 * Step 1: Setup Instructions
 */
function printSetupInstructions() {
  console.log(`
🚀 FIGMA OAUTH2 SETUP GUIDE
============================

To enable OAuth2 access to the Figma API, follow these steps:

📋 STEP 1: Create a Figma App
-----------------------------
1. Go to: https://www.figma.com/developers/apps
2. Click "Create new app"
3. Fill in your app details:
   - Name: "Atlas Wireframe Tool"
   - Description: "Wireframe generator with Atlas components"
   - Website: "https://your-domain.com" (optional)

📋 STEP 2: Configure Redirect URIs
----------------------------------
Add these redirect URIs to your Figma app:
✅ http://localhost:7072/api/figma/oauth/callback (for local development)
✅ https://your-production-domain.com/api/figma/oauth/callback (for production)

📋 STEP 3: Get Your Credentials
-------------------------------
After creating the app, you'll get:
- Client ID (public)
- Client Secret (private - keep secure!)

📋 STEP 4: Update Environment Variables
---------------------------------------
Add these to your .env file:

FIGMA_CLIENT_ID=your_actual_client_id_here
FIGMA_CLIENT_SECRET=your_actual_client_secret_here
FIGMA_REDIRECT_URI=http://localhost:7072/api/figma/oauth/callback

📋 STEP 5: Test OAuth2 Flow
---------------------------
Run: node figma-oauth2-setup.js --test

🔐 SECURITY NOTES:
- Never commit client secrets to version control
- Use environment variables for all credentials
- Use HTTPS in production
- Implement proper token storage and refresh logic

`);
}

/**
 * Generate OAuth2 authorization URL
 */
function generateAuthUrl(state = null) {
  const params = new URLSearchParams({
    client_id: FIGMA_OAUTH_CONFIG.clientId,
    redirect_uri: FIGMA_OAUTH_CONFIG.redirectUri,
    scope: FIGMA_OAUTH_CONFIG.scope,
    response_type: "code",
  });

  if (state) {
    params.append("state", state);
  }

  return `${FIGMA_OAUTH_CONFIG.authUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
async function exchangeCodeForToken(code) {
  try {
    const response = await axios.post(
      FIGMA_OAUTH_CONFIG.tokenUrl,
      {
        client_id: FIGMA_OAUTH_CONFIG.clientId,
        client_secret: FIGMA_OAUTH_CONFIG.clientSecret,
        redirect_uri: FIGMA_OAUTH_CONFIG.redirectUri,
        code: code,
        grant_type: "authorization_code",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post(
      FIGMA_OAUTH_CONFIG.tokenUrl,
      {
        client_id: FIGMA_OAUTH_CONFIG.clientId,
        client_secret: FIGMA_OAUTH_CONFIG.clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

/**
 * Test Figma API access with OAuth2 token
 */
async function testFigmaAccess(accessToken) {
  try {
    // Test with a simple API call to get user info
    const response = await axios.get("https://api.figma.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("✅ Figma API access test successful!");
    console.log("👤 User:", response.data.handle);
    console.log("📧 Email:", response.data.email);

    return { success: true, user: response.data };
  } catch (error) {
    console.error(
      "❌ Figma API access test failed:",
      error.response?.data || error.message
    );
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Save OAuth2 tokens securely
 */
function saveTokens(tokens) {
  const tokensDir = path.join(__dirname, ".figma-tokens");
  if (!fs.existsSync(tokensDir)) {
    fs.mkdirSync(tokensDir, { mode: 0o700 }); // Private directory
  }

  const tokenFile = path.join(tokensDir, "oauth-tokens.json");
  const tokenData = {
    ...tokens,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
  };

  fs.writeFileSync(tokenFile, JSON.stringify(tokenData, null, 2), {
    mode: 0o600,
  }); // Private file
  console.log("💾 Tokens saved securely to:", tokenFile);
}

/**
 * Load saved OAuth2 tokens
 */
function loadTokens() {
  const tokenFile = path.join(__dirname, ".figma-tokens", "oauth-tokens.json");

  if (!fs.existsSync(tokenFile)) {
    return null;
  }

  try {
    const tokenData = JSON.parse(fs.readFileSync(tokenFile, "utf8"));

    // Check if token is expired
    const expiresAt = new Date(tokenData.expires_at);
    const now = new Date();

    if (now >= expiresAt) {
      console.log("⚠️  Stored token is expired");
      return { ...tokenData, expired: true };
    }

    return tokenData;
  } catch (error) {
    console.error("❌ Failed to load tokens:", error.message);
    return null;
  }
}

/**
 * Main OAuth2 setup function
 */
async function setupOAuth2() {
  console.log("🔐 Setting up Figma OAuth2...\n");

  // Check if credentials are configured
  if (FIGMA_OAUTH_CONFIG.clientId === "YOUR_FIGMA_CLIENT_ID") {
    console.log("⚠️  OAuth2 credentials not configured yet.\n");
    printSetupInstructions();
    return;
  }

  console.log("✅ OAuth2 credentials found in environment variables\n");

  // Check for existing tokens
  const existingTokens = loadTokens();
  if (existingTokens && !existingTokens.expired) {
    console.log("✅ Valid OAuth2 tokens found");
    console.log(
      "🔑 Access token:",
      existingTokens.access_token.substring(0, 20) + "..."
    );
    console.log("⏰ Expires at:", existingTokens.expires_at);

    // Test the token
    await testFigmaAccess(existingTokens.access_token);
    return existingTokens;
  }

  if (existingTokens?.expired && existingTokens.refresh_token) {
    console.log("🔄 Attempting to refresh expired token...");
    const refreshResult = await refreshAccessToken(
      existingTokens.refresh_token
    );

    if (refreshResult.success) {
      console.log("✅ Token refreshed successfully!");
      saveTokens(refreshResult.data);
      await testFigmaAccess(refreshResult.data.access_token);
      return refreshResult.data;
    } else {
      console.log("❌ Failed to refresh token:", refreshResult.error);
    }
  }

  // Generate new authorization URL
  const state = Math.random().toString(36).substring(2, 15);
  const authUrl = generateAuthUrl(state);

  console.log("🔗 To authorize access to Figma, visit this URL:");
  console.log("\n" + authUrl + "\n");
  console.log(
    "📋 After authorization, you'll be redirected to your callback URL"
  );
  console.log(
    '💡 Copy the "code" parameter from the callback URL and use it with:'
  );
  console.log("   node figma-oauth2-setup.js --code YOUR_CODE_HERE\n");
}

/**
 * Handle command line arguments
 */
async function handleCommands() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    printSetupInstructions();
    return;
  }

  if (args.includes("--test")) {
    const tokens = loadTokens();
    if (tokens && !tokens.expired) {
      await testFigmaAccess(tokens.access_token);
    } else {
      console.log("❌ No valid tokens found. Run setup first.");
    }
    return;
  }

  const codeIndex = args.indexOf("--code");
  if (codeIndex !== -1 && args[codeIndex + 1]) {
    const code = args[codeIndex + 1];
    console.log("🔄 Exchanging authorization code for access token...");

    const tokenResult = await exchangeCodeForToken(code);
    if (tokenResult.success) {
      console.log("✅ Successfully obtained access token!");
      saveTokens(tokenResult.data);
      await testFigmaAccess(tokenResult.data.access_token);
    } else {
      console.error("❌ Failed to exchange code for token:", tokenResult.error);
    }
    return;
  }

  // Default: run setup
  await setupOAuth2();
}

// Export functions for use in other modules
export {
  generateAuthUrl,
  exchangeCodeForToken,
  refreshAccessToken,
  testFigmaAccess,
  saveTokens,
  loadTokens,
  FIGMA_OAUTH_CONFIG,
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  handleCommands().catch(console.error);
}
