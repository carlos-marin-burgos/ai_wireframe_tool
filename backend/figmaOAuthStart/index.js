module.exports = async function (context, req) {module.exports = async function (context, req) {

  console.log("🚀 Figma OAuth2 Authorization Handler");  console.log("🚀 Figma OAuth2 Authorization Handler");



  // CORS headers  // CORS headers

  context.res = {  context.res = {

    headers: {    headers: {

      "Access-Control-Allow-Origin": "*",      "Access-Control-Allow-Origin": "*",

      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",

      "Access-Control-Allow-Headers": "Content-Type",      "Access-Control-Allow-Headers": "Content-Type",

    },    },

  };  };



  if (req.method === "OPTIONS") {  if (req.method === "OPTIONS") {

    context.res.status = 200;    context.res.status = 200;

    context.res.body = "";    context.res.body = "";

    return;    return;

  }  }



  try {  try {

    // Check if OAuth credentials are configured first    // Use dynamic import for ES module

    const hasOAuthCredentials = process.env.FIGMA_CLIENT_ID &&     const figmaSetup = await import("../figma-oauth2-setup.js");

                              process.env.FIGMA_CLIENT_SECRET &&    const { generateAuthUrl, loadTokens, testFigmaAccess, FIGMA_OAUTH_CONFIG } =

                              process.env.FIGMA_CLIENT_ID !== "YOUR_FIGMA_CLIENT_ID" &&      figmaSetup;

                              process.env.FIGMA_CLIENT_SECRET !== "YOUR_FIGMA_CLIENT_SECRET";

    // Check if OAuth2 credentials are properly configured

    if (!hasOAuthCredentials) {    if (

      console.log("⚠️ OAuth2 credentials not configured - OAuth flow unavailable");      FIGMA_OAUTH_CONFIG.clientId === "YOUR_FIGMA_CLIENT_ID" ||

            !process.env.FIGMA_CLIENT_ID ||

      // Check if we have a manual token available      process.env.FIGMA_CLIENT_ID === "YOUR_FIGMA_CLIENT_ID"

      const hasManualToken = process.env.FIGMA_ACCESS_TOKEN &&     ) {

                            process.env.FIGMA_ACCESS_TOKEN !== "" &&      console.log("⚠️ OAuth2 credentials not configured");

                            !process.env.FIGMA_ACCESS_TOKEN.includes("your_token_here");

      context.res.status = 503;

      context.res.status = 503;      context.res.body = {

      context.res.body = {        status: "oauth_not_configured",

        status: "oauth_not_configured",        error: "OAuth2 is not properly configured",

        error: "OAuth2 is not properly configured",        message:

        message: hasManualToken           "OAuth2 credentials are not set up. Please use manual token authentication instead.",

          ? "OAuth2 not configured, but manual token is available. Please use the Manual Token tab."        details:

          : "OAuth2 not configured and no manual token found. Please configure Figma access.",          "Figma OAuth2 Client ID and Secret need to be configured in environment variables",

        details: "Figma OAuth2 Client ID and Secret need to be configured in environment variables",      };

        hasManualToken: hasManualToken      return;

      };    }

      return;    // Check if we already have valid tokens

    }    const existingTokens = loadTokens();



    // Only try to import and use OAuth setup if credentials are available    if (existingTokens && !existingTokens.expired) {

    const figmaSetup = await import("../figma-oauth2-setup.js");      console.log("✅ Valid OAuth2 tokens found");

    const { generateAuthUrl, loadTokens, testFigmaAccess } = figmaSetup;

      // Test the token to make sure it's still valid

    // Check if we already have valid tokens      const testResult = await testFigmaAccess(existingTokens.access_token);

    const existingTokens = loadTokens();

      if (testResult.success) {

    if (existingTokens && !existingTokens.expired) {        context.res.status = 200;

      console.log("✅ Valid OAuth2 tokens found");        context.res.body = {

          status: "already_authorized",

      // Test the token to make sure it's still valid          message: "Already authorized with Figma",

      const testResult = await testFigmaAccess(existingTokens.access_token);          user: testResult.user,

          expires_at: existingTokens.expires_at,

      if (testResult.success) {        };

        context.res.status = 200;        return;

        context.res.body = {      }

          status: "already_authorized",    }

          message: "Already authorized with Figma",

          user: testResult.user,    // Generate new authorization URL

          expires_at: existingTokens.expires_at,    const state = Math.random().toString(36).substring(2, 15);

        };    const authUrl = generateAuthUrl(state);

        return;

      }    console.log("🔗 Generated OAuth2 authorization URL");

    }

    if (req.method === "GET") {

    // Generate new authorization URL      // Return authorization page

    const state = Math.random().toString(36).substring(2, 15);      const authPage = `

    const authUrl = generateAuthUrl(state);<!DOCTYPE html>

<html lang="en">

    console.log("🔗 Generated OAuth2 authorization URL");<head>

    <meta charset="UTF-8">

    if (req.method === "GET") {    <meta name="viewport" content="width=device-width, initial-scale=1.0">

      // Return authorization page    <title>Authorize Figma Access</title>

      const authPage = `    <style>

<!DOCTYPE html>        body {

<html lang="en">            font-family: 'Segoe UI', system-ui, sans-serif;

<head>            margin: 0;

    <meta charset="UTF-8">            padding: 40px 20px;

    <meta name="viewport" content="width=device-width, initial-scale=1.0">            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

    <title>Authorize Figma Access</title>            min-height: 100vh;

    <style>            display: flex;

        body {            align-items: center;

            font-family: 'Segoe UI', system-ui, sans-serif;            justify-content: center;

            margin: 0;        }

            padding: 40px 20px;        .container {

            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);            background: white;

            min-height: 100vh;            border-radius: 16px;

            display: flex;            padding: 40px;

            align-items: center;            box-shadow: 0 20px 40px rgba(0,0,0,0.1);

            justify-content: center;            text-align: center;

        }            max-width: 500px;

        .container {            width: 100%;

            background: white;        }

            border-radius: 16px;        .figma-icon {

            padding: 40px;            font-size: 64px;

            box-shadow: 0 20px 40px rgba(0,0,0,0.1);            margin-bottom: 20px;

            text-align: center;        }

            max-width: 500px;        h1 {

            width: 100%;            color: #333;

        }            margin-bottom: 16px;

        .figma-icon {            font-size: 24px;

            font-size: 64px;        }

            margin-bottom: 20px;        p {

        }            color: #6c757d;

        h1 {            margin-bottom: 20px;

            color: #333;            line-height: 1.6;

            margin-bottom: 16px;        }

            font-size: 24px;        .auth-btn {

        }            background: #18a0fb;

        p {            color: white;

            color: #6c757d;            border: none;

            margin-bottom: 20px;            padding: 16px 32px;

            line-height: 1.6;            border-radius: 8px;

        }            font-weight: 600;

        .auth-btn {            font-size: 16px;

            background: #18a0fb;            cursor: pointer;

            color: white;            text-decoration: none;

            border: none;            display: inline-block;

            padding: 16px 32px;            transition: background 0.2s ease;

            border-radius: 8px;            margin: 20px 0;

            font-weight: 600;        }

            font-size: 16px;        .auth-btn:hover {

            cursor: pointer;            background: #1492e6;

            text-decoration: none;        }

            display: inline-block;        .permissions {

            transition: background 0.2s ease;            background: #f8f9fa;

            margin: 20px 0;            border-radius: 8px;

        }            padding: 20px;

        .auth-btn:hover {            margin: 20px 0;

            background: #1492e6;            text-align: left;

        }        }

        .permissions {        .permissions h3 {

            background: #f8f9fa;            margin-top: 0;

            border-radius: 8px;            color: #495057;

            padding: 20px;        }

            margin: 20px 0;        .permissions ul {

            text-align: left;            color: #6c757d;

        }            margin: 0;

        .permissions h3 {            padding-left: 20px;

            margin-top: 0;        }

            color: #495057;        .permissions li {

        }            margin-bottom: 8px;

        .permissions ul {        }

            color: #6c757d;        .security-note {

            margin: 0;            background: #d1ecf1;

            padding-left: 20px;            border: 1px solid #bee5eb;

        }            border-radius: 6px;

        .permissions li {            padding: 12px;

            margin-bottom: 8px;            margin-top: 20px;

        }            font-size: 14px;

        .security-note {            color: #0c5460;

            background: #d1ecf1;        }

            border: 1px solid #bee5eb;    </style>

            border-radius: 6px;</head>

            padding: 12px;<body>

            margin-top: 20px;    <div class="container">

            font-size: 14px;        <div class="figma-icon">🎨</div>

            color: #0c5460;        <h1>Authorize Atlas Wireframe Tool</h1>

        }        <p>To access Figma components and generate accurate wireframes, we need permission to access your Figma files.</p>

    </style>        

</head>        <div class="permissions">

<body>            <h3>🔐 Requested Permissions</h3>

    <div class="container">            <ul>

        <div class="figma-icon">🎨</div>                <li>Read access to your Figma files</li>

        <h1>Authorize Atlas Wireframe Tool</h1>                <li>Access to Atlas Design Library components</li>

        <p>To access Figma components and generate accurate wireframes, we need permission to access your Figma files.</p>                <li>Export component images for wireframe generation</li>

                    </ul>

        <div class="permissions">        </div>

            <h3>🔐 Requested Permissions</h3>        

            <ul>        <a href="${authUrl}" class="auth-btn">

                <li>Read access to your Figma files</li>            🚀 Authorize with Figma

                <li>Access to Atlas Design Library components</li>        </a>

                <li>Export component images for wireframe generation</li>        

            </ul>        <div class="security-note">

        </div>            <strong>🛡️ Security:</strong> We only request read access to your files. We never modify your designs or access personal information beyond what's necessary for the wireframe tool.

                </div>

        <a href="${authUrl}" class="auth-btn">        

            🚀 Authorize with Figma        <p style="font-size: 14px; color: #8a8a8a; margin-top: 30px;">

        </a>            After authorization, you'll be redirected back to continue using the wireframe tool.

                </p>

        <div class="security-note">    </div>

            <strong>🛡️ Security:</strong> We only request read access to your files. We never modify your designs or access personal information beyond what's necessary for the wireframe tool.</body>

        </div></html>`;

        

        <p style="font-size: 14px; color: #8a8a8a; margin-top: 30px;">      context.res.status = 200;

            After authorization, you'll be redirected back to continue using the wireframe tool.      context.res.headers["Content-Type"] = "text/html";

        </p>      context.res.body = authPage;

    </div>    } else {

</body>      // Return JSON response for API calls

</html>`;      context.res.status = 200;

      context.res.body = {

      context.res.status = 200;        status: "authorization_required",

      context.res.headers["Content-Type"] = "text/html";        auth_url: authUrl,

      context.res.body = authPage;        message: "Visit the auth_url to authorize Figma access",

    } else {      };

      // Return JSON response for API calls    }

      context.res.status = 200;  } catch (error) {

      context.res.body = {    console.error("❌ OAuth2 authorization error:", error);

        status: "authorization_required",

        auth_url: authUrl,    // Check if it's a missing OAuth credentials error

        message: "Visit the auth_url to authorize Figma access",    if (error.message && error.message.includes("Cannot resolve module")) {

      };      context.res.status = 503;

    }      context.res.body = {

  } catch (error) {        status: "oauth_not_configured",

    console.error("❌ OAuth2 authorization error:", error);        error: "OAuth2 is not properly configured",

            message:

    // Check for different types of errors          "OAuth2 credentials are not set up. Please use manual token authentication instead.",

    const errorMessage = error.message || "Unknown error";        details: "Missing Figma OAuth2 setup file or credentials",

          };

    if (errorMessage.includes('Cannot find module') || errorMessage.includes('Cannot use import')) {    } else {

      context.res.status = 503;      context.res.status = 500;

      context.res.body = {      context.res.body = {

        status: "oauth_not_configured",        error: "Failed to generate authorization URL",

        error: "OAuth2 setup incomplete",        details: error.message,

        message: "OAuth2 system not properly configured. Please use manual token authentication.",        status: "oauth_error",

        details: "OAuth2 setup files missing or misconfigured"      };

      };    }

    } else {  }

      context.res.status = 500;};

      context.res.body = {
        status: "oauth_error",
        error: "Failed to process OAuth request",
        details: errorMessage
      };
    }
  }
};