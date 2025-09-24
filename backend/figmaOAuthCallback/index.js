const axios = require("axios");

// Exchange authorization code for access token
async function exchangeCodeForToken(code, req) {
  try {
    // Get environment-appropriate redirect URI using the same logic as figmaOAuthStart
    let redirectUri = process.env.FIGMA_REDIRECT_URI;

    if (!redirectUri) {
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

    // Build a small set of candidate redirect URIs to tolerate tiny registration mismatches
    const candidates = [];
    const normalized = redirectUri.replace(/\s+/g, "").replace(/\/$/, "");
    candidates.push(normalized);
    // with and without trailing slash
    candidates.push(normalized + "/");
    // http/https variants
    if (normalized.startsWith("http://")) {
      candidates.push(normalized.replace(/^http:\/\//, "https://"));
    } else if (normalized.startsWith("https://")) {
      candidates.push(normalized.replace(/^https:\/\//, "http://"));
    }

    // Deduplicate
    const uniqueCandidates = [...new Set(candidates)];

    console.log("🔗 Redirect URI candidates:", uniqueCandidates);
    console.log(
      "🔑 Client ID:",
      process.env.FIGMA_CLIENT_ID?.substring(0, 10) + "..."
    );
    console.log(
      "🔐 Client Secret:",
      process.env.FIGMA_CLIENT_SECRET ? "Present" : "Missing"
    );

    // Try each candidate until one succeeds
    for (const candidate of uniqueCandidates) {
      try {
        const params = new URLSearchParams({
          client_id: process.env.FIGMA_CLIENT_ID,
          client_secret: process.env.FIGMA_CLIENT_SECRET,
          redirect_uri: candidate,
          code: code,
          grant_type: "authorization_code",
        });

        console.log("📤 Trying token exchange with redirect_uri:", candidate);

        const response = await axios.post(
          "https://api.figma.com/v1/oauth/token",
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            timeout: 10000, // 10 second timeout
          }
        );

        // If we get here, exchange succeeded
        return {
          success: true,
          data: response.data,
          usedRedirectUri: candidate,
        };
      } catch (err) {
        // Log and continue to next candidate on 4xx/5xx; rethrow on unexpected
        const status = err.response?.status;
        console.warn(
          `Attempt failed for ${candidate} with status ${status}:`,
          err.response?.data || err.message
        );
        // If it's not a 4xx/5xx response (network etc.), throw
        if (!status || (status >= 500 && status < 600)) {
          // server error or network error - rethrow to surface the problem
          throw err;
        }
        // else continue trying other candidates
      }
    }

    // All attempts failed
    return {
      success: false,
      error:
        "All redirect_uri variants failed to exchange the authorization code",
    };
  } catch (error) {
    console.error("❌ Full error details:");
    console.error("Status:", error.response?.status);
    console.error("Headers:", error.response?.headers);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
    console.error("Config URL:", error.config?.url);
    console.error("Config Data:", error.config?.data);

    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

module.exports = async function (context, req) {
  console.log("🔐 Figma OAuth2 Callback Handler");

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

  if (req.method !== "GET") {
    context.res.status = 405;
    context.res.body = { error: "Method not allowed" };
    return;
  }

  try {
    const { code, state, error } = req.query;

    if (error) {
      console.error("❌ OAuth2 error:", error);
      context.res.status = 400;
      context.res.body = {
        error: "OAuth2 authorization failed",
        details: error,
      };
      return;
    }

    if (!code) {
      context.res.status = 400;
      context.res.body = {
        error: "Authorization code not provided",
      };
      return;
    }

    console.log(
      "🔄 Processing OAuth2 callback with code:",
      code.substring(0, 10) + "..."
    );

    // Exchange code for tokens with proper environment handling
    const tokenResult = await exchangeCodeForToken(code, req);

    if (tokenResult.success) {
      console.log("✅ OAuth2 authorization successful!");

      // Store the access token for future use
      console.log(
        "🔑 Access token received:",
        tokenResult.data.access_token.substring(0, 20) + "..."
      );

      // Save tokens to persistent storage
      try {
        const { saveTokens } = require("../figmaOAuthStatus/index.js");
        const saved = saveTokens(tokenResult.data);
        if (saved) {
          console.log("💾 OAuth tokens saved successfully");
        } else {
          console.warn("⚠️ Failed to save OAuth tokens");
        }
      } catch (error) {
        console.error("❌ Error saving OAuth tokens:", error);
      }

      // Return success page
      const successPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Figma Connected Successfully</title>
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
        .success-icon { font-size: 64px; margin-bottom: 20px; }
        h1 { color: #28a745; margin-bottom: 16px; font-size: 24px; }
        p { color: #6c757d; margin-bottom: 20px; line-height: 1.6; }
        .token-info {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
            text-align: left;
        }
        .token-label {
            font-weight: 600;
            color: #495057;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .token-value {
            font-family: monospace;
            font-size: 14px;
            color: #212529;
            word-break: break-all;
        }
        .close-btn {
            background: #194a7a;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            margin-top: 20px;
        }
        .close-btn:hover { background: #0056b3; }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">✅</div>
        <h1>Figma Connected Successfully!</h1>
        <p>Your Atlas wireframe tool now has access to your Figma components. You can close this window and return to the wireframe generator.</p>
        
        <div class="token-info">
            <div class="token-label">Status</div>
            <div class="token-value">✅ Successfully authorized</div>
        </div>
        
        <div class="token-info">
            <div class="token-label">Access Level</div>
            <div class="token-value">${
              tokenResult.data.scope || "file_read"
            }</div>
        </div>
        
        <p><strong>🎉 You are all set!</strong> Your Atlas wireframe tool can now access Figma components with proper OAuth2 authentication.</p>
        
        <button class="close-btn" onclick="window.close()">Close Window</button>
        
        <script>
          // Auto-close and notify parent window
          setTimeout(() => {
            try {
              // Notify parent window of successful authorization with token info
              if (window.opener) {
                window.opener.postMessage({
                  type: 'FIGMA_OAUTH_SUCCESS',
                  data: {
                    status: 'success',
                    message: 'Successfully connected to Figma',
                    tokenInfo: {
                      scope: '${tokenResult.data.scope || "file_read"}',
                      expires_in: ${tokenResult.data.expires_in || 3600},
                      connected: true
                    }
                  }
                }, '*');
              }
              window.close();
            } catch (e) { 
              console.log('Auto-close not available'); 
            }
          }, 3000);
        </script>
    </div>
</body>
</html>`;

      context.res.status = 200;
      context.res.headers["Content-Type"] = "text/html";
      context.res.body = successPage;
    } else {
      console.error("❌ Failed to exchange code for token:", tokenResult.error);
      context.res.status = 400;
      context.res.body = {
        error: "Failed to exchange authorization code for access token",
        details: tokenResult.error,
      };
    }
  } catch (error) {
    console.error("❌ OAuth2 callback error:", error);
    context.res.status = 500;
    context.res.body = {
      error: "Internal server error during OAuth2 callback",
      details: error.message,
    };
  }
};
