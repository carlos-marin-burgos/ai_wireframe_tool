module.exports = async function (context, req) {
  // Use dynamic import for ES module
  const figmaSetup = await import("../../figma-oauth2-setup.js");
  const { generateAuthUrl, loadTokens, testFigmaAccess } = figmaSetup;
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
    // Check if we already have valid tokens
    const existingTokens = loadTokens();

    if (existingTokens && !existingTokens.expired) {
      console.log("✅ Valid OAuth2 tokens found");

      // Test the token to make sure it's still valid
      const testResult = await testFigmaAccess(existingTokens.access_token);

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
      // Return authorization page
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
    context.res.status = 500;
    context.res.body = {
      error: "Failed to generate authorization URL",
      details: error.message,
    };
  }
};
