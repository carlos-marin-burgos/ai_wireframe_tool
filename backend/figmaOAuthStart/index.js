module.exports = async function (context, req) {
  console.log("🚀 Figma OAuth2 Authorization Handler");

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
    // Debug logging for OAuth credentials
    console.log("🔍 Debug - Environment variables:", {
      hasClientId: !!process.env.FIGMA_CLIENT_ID,
      clientIdValue: process.env.FIGMA_CLIENT_ID
        ? process.env.FIGMA_CLIENT_ID.substring(0, 8) + "..."
        : "undefined",
      hasClientSecret: !!process.env.FIGMA_CLIENT_SECRET,
      clientSecretValue: process.env.FIGMA_CLIENT_SECRET
        ? process.env.FIGMA_CLIENT_SECRET.substring(0, 8) + "..."
        : "undefined",
      redirectUri: process.env.FIGMA_REDIRECT_URI,
    });

    // Check if OAuth credentials are configured first
    const hasOAuthCredentials =
      process.env.FIGMA_CLIENT_ID &&
      process.env.FIGMA_CLIENT_SECRET &&
      process.env.FIGMA_CLIENT_ID !== "YOUR_FIGMA_CLIENT_ID" &&
      process.env.FIGMA_CLIENT_ID !== "YOUR_FIGMA_CLIENT_ID_HERE" &&
      process.env.FIGMA_CLIENT_SECRET !== "YOUR_FIGMA_CLIENT_SECRET" &&
      process.env.FIGMA_CLIENT_SECRET !== "YOUR_FIGMA_CLIENT_SECRET_HERE";

    if (!hasOAuthCredentials) {
      console.log(
        "⚠️ OAuth2 credentials not configured - OAuth flow unavailable"
      );

      // Check if we have a manual token available
      const hasManualToken =
        process.env.FIGMA_ACCESS_TOKEN &&
        process.env.FIGMA_ACCESS_TOKEN !== "" &&
        !process.env.FIGMA_ACCESS_TOKEN.includes("your_token_here");

      context.res.status = 503;
      context.res.body = {
        status: "oauth_not_configured",
        error: "OAuth2 is not properly configured",
        message: hasManualToken
          ? "OAuth2 not configured, but manual token is available. Please use the Manual Token tab."
          : "OAuth2 not configured and no manual token found. Please configure Figma access.",
        details:
          "Figma OAuth2 Client ID and Secret need to be configured in environment variables",
        hasManualToken: hasManualToken,
      };
      return;
    }

    // Only try to import and use OAuth setup if credentials are available
    // Note: Temporarily skip the setup import to avoid ES module issues
    const generateAuthUrl = (state) => {
      // Determine redirect URI based on environment
      let redirectUri = process.env.FIGMA_REDIRECT_URI;

      if (!redirectUri) {
        // Auto-detect based on request headers
        const host = req.headers.host;
        if (
          host &&
          (host.includes("azurewebsites.net") ||
            host.includes("azurestaticapps.net"))
        ) {
          // Production environment - use production URI
          redirectUri =
            process.env.FIGMA_REDIRECT_URI_PROD ||
            `https://${host}/api/figmaOAuthCallback`;
          console.log(`🔧 Using PRODUCTION redirect URI: ${redirectUri}`);
        } else {
          // Development environment - require DEV environment variable
          redirectUri = process.env.FIGMA_REDIRECT_URI_DEV;
          if (!redirectUri) {
            throw new Error(
              "FIGMA_REDIRECT_URI_DEV must be set for development environment"
            );
          }
          console.log(`🔧 Using DEVELOPMENT redirect URI: ${redirectUri}`);
        }
      } else {
        console.log(`🔧 Using configured redirect URI: ${redirectUri}`);
      }

      const params = new URLSearchParams({
        client_id: process.env.FIGMA_CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: "code",
      });

      if (state) {
        params.append("state", state);
      }

      return `https://www.figma.com/oauth?${params.toString()}`;
    };

    // Check if we already have valid tokens (simplified for now)
    const existingTokens = null; // TODO: Implement token loading

    if (existingTokens && !existingTokens.expired) {
      console.log("✅ Valid OAuth2 tokens found");

      // Test the token to make sure it's still valid
      const testResult = { success: false }; // TODO: Implement token testing

      if (testResult.success) {
        context.res.status = 200;
        context.res.body = {
          status: "already_authorized",
          message: "Already authorized with Figma",
          user: testResult.user,
          expires_at: existingTokens.expires_at,
        };
        return;
      }
    }

    // Generate new authorization URL
    const state = Math.random().toString(36).substring(2, 15);
    const authUrl = generateAuthUrl(state);

    console.log("🔗 Generated OAuth2 authorization URL");

    if (req.method === "GET") {
      // Content negotiation: if the caller explicitly requests JSON (Accept header or format param), return JSON status instead of HTML page
      const acceptHeader = (req.headers["accept"] || "").toLowerCase();
      const wantsJson =
        acceptHeader.includes("application/json") ||
        (req.query &&
          (req.query.format === "json" || req.query.response_type === "json"));

      if (wantsJson) {
        context.res.status = 200;
        context.res.headers["Content-Type"] = "application/json";
        context.res.body = {
          status: "authorization_required",
          auth_url: authUrl,
          mode: "json",
          message:
            "Open auth_url in a browser window to authorize Figma access",
        };
        return;
      }

      // Return interactive authorization HTML page (default)
      const authPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Authorize Figma Access</title>
    <style>
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            margin: 0;
            padding: 40px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
            width: 100%;
        }
        .figma-icon {
            font-size: 64px;
            margin-bottom: 20px;
        }
        h1 {
            color: #333;
            margin-bottom: 16px;
            font-size: 24px;
        }
        p {
            color: #6c757d;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        .auth-btn {
            background: #18a0fb;
            color: white;
            border: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: background 0.2s ease;
            margin: 20px 0;
        }
        .auth-btn:hover {
            background: #1492e6;
        }
        .permissions {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
        }
        .permissions h3 {
            margin-top: 0;
            color: #495057;
        }
        .permissions ul {
            color: #6c757d;
            margin: 0;
            padding-left: 20px;
        }
        .permissions li {
            margin-bottom: 8px;
        }
        .security-note {
            background: #d1ecf1;
            border: 1px solid #bee5eb;
            border-radius: 6px;
            padding: 12px;
            margin-top: 20px;
            font-size: 14px;
            color: #0c5460;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="figma-icon">🎨</div>
        <h1>Authorize Atlas Wireframe Tool</h1>
        <p>To access Figma components and generate accurate wireframes, we need permission to access your Figma files.</p>
        
        <div class="permissions">
            <h3>🔐 Requested Permissions</h3>
            <ul>
                <li>Read access to your Figma files</li>
                <li>Access to Atlas Design Library components</li>
                <li>Export component images for wireframe generation</li>
            </ul>
        </div>
        
        <a href="${authUrl}" class="auth-btn">
            🚀 Authorize with Figma
        </a>
        
        <div class="security-note">
            <strong>🛡️ Security:</strong> We only request read access to your files. We never modify your designs or access personal information beyond what's necessary for the wireframe tool.
        </div>
        
        <p style="font-size: 14px; color: #8a8a8a; margin-top: 30px;">
            After authorization, you'll be redirected back to continue using the wireframe tool.
        </p>
    </div>
</body>
</html>`;

      context.res.status = 200;
      context.res.headers["Content-Type"] = "text/html";
      context.res.body = authPage;
    } else {
      // Return JSON response for API calls
      context.res.status = 200;
      context.res.body = {
        status: "authorization_required",
        auth_url: authUrl,
        message: "Visit the auth_url to authorize Figma access",
      };
    }
  } catch (error) {
    console.error("❌ OAuth2 authorization error:", error);

    // Check if it's a missing OAuth credentials error
    if (error.message && error.message.includes("Cannot resolve module")) {
      context.res.status = 503;
      context.res.body = {
        status: "oauth_not_configured",
        error: "OAuth2 is not properly configured",
        message:
          "OAuth2 credentials are not set up. Please use manual token authentication instead.",
        details: "Missing Figma OAuth2 setup file or credentials",
      };
    } else {
      context.res.status = 500;
      context.res.body = {
        error: "Failed to generate authorization URL",
        details: error.message,
        status: "oauth_error",
      };
    }
  }
};
