const axios = require("axios");

module.exports = async function (context, req) {
  console.log("🔍 Debug OAuth Exchange");

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
    // Debug environment variables
    const debugInfo = {
      nodeEnv: process.env.NODE_ENV,
      hasClientId: !!process.env.FIGMA_CLIENT_ID,
      hasClientSecret: !!process.env.FIGMA_CLIENT_SECRET,
      clientId: process.env.FIGMA_CLIENT_ID?.substring(0, 10) + "...",
      redirectUriProd: process.env.FIGMA_REDIRECT_URI_PROD,
      redirectUriProduction: process.env.FIGMA_REDIRECT_URI_PRODUCTION,
      redirectUri: process.env.FIGMA_REDIRECT_URI,
    };

    // Determine which redirect URI would be used
    let redirectUri = process.env.FIGMA_REDIRECT_URI;
    if (!redirectUri) {
      if (process.env.NODE_ENV === "production") {
        redirectUri = process.env.FIGMA_REDIRECT_URI_PROD;
      } else {
        redirectUri = process.env.FIGMA_REDIRECT_URI_DEV;
      }
    }
    redirectUri =
      (redirectUri && redirectUri.trim()) ||
      "http://localhost:7071/api/figmaOAuthCallback";

    debugInfo.selectedRedirectUri = redirectUri;

    // If we have a test code, try the actual exchange
    const { testCode } = req.query;
    let exchangeResult = null;

    if (testCode) {
      try {
        const params = new URLSearchParams({
          client_id: process.env.FIGMA_CLIENT_ID,
          client_secret: process.env.FIGMA_CLIENT_SECRET,
          redirect_uri: redirectUri,
          code: testCode,
          grant_type: "authorization_code",
        });

        console.log("🚀 Testing token exchange with:", {
          client_id: process.env.FIGMA_CLIENT_ID,
          redirect_uri: redirectUri,
          code: testCode.substring(0, 10) + "...",
        });

        const response = await axios.post(
          "https://www.figma.com/api/oauth/token",
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            timeout: 10000,
          }
        );

        exchangeResult = {
          success: true,
          status: response.status,
          data: response.data,
        };
      } catch (err) {
        exchangeResult = {
          success: false,
          status: err.response?.status,
          error: err.response?.data || err.message,
          headers: err.response?.headers,
        };
      }
    }

    context.res.status = 200;
    context.res.body = {
      debugInfo,
      exchangeResult,
      instructions: "Add ?testCode=YOUR_REAL_CODE to test token exchange",
    };
  } catch (error) {
    console.error("❌ Debug error:", error);
    context.res.status = 500;
    context.res.body = {
      error: "Debug failed",
      details: error.message,
    };
  }
};
