// Use dynamic import for ES module
const figmaSetup = await import("../../figma-oauth2-setup.js");
const { loadTokens, refreshAccessToken, saveTokens } = figmaSetup;

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

    // Exchange code for tokens (this would normally call your OAuth2 setup)
    const { exchangeCodeForToken } = figmaSetup;
    const tokenResult = await exchangeCodeForToken(code);

    if (tokenResult.success) {
      // Save tokens securely
      saveTokens(tokenResult.data);

      console.log("✅ OAuth2 authorization successful!");

      // Return success page
      const successPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Figma OAuth2 Success</title>
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
        .success-icon {
            font-size: 64px;
            margin-bottom: 20px;
        }
        h1 {
            color: #28a745;
            margin-bottom: 16px;
            font-size: 24px;
        }
        p {
            color: #6c757d;
            margin-bottom: 20px;
            line-height: 1.6;
        }
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
            background: #007bff;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            margin-top: 20px;
        }
        .close-btn:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">✅</div>
        <h1>Figma OAuth2 Authorization Successful!</h1>
        <p>Your application now has access to the Figma API. You can close this window and return to your application.</p>
        
        <div class="token-info">
            <div class="token-label">Access Token</div>
            <div class="token-value">${tokenResult.data.access_token.substring(
              0,
              20
            )}...</div>
        </div>
        
        <div class="token-info">
            <div class="token-label">Expires In</div>
            <div class="token-value">${
              tokenResult.data.expires_in
            } seconds</div>
        </div>
        
        <div class="token-info">
            <div class="token-label">Scope</div>
            <div class="token-value">${tokenResult.data.scope}</div>
        </div>
        
        <p><strong>Next steps:</strong> Your Atlas wireframe tool can now access Figma components with proper OAuth2 authentication!</p>
        
        <button class="close-btn" onclick="window.close()">Close Window</button>
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
