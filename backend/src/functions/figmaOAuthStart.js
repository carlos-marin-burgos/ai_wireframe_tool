const { app } = require("@azure/functions");

/**
 * Figma OAuth2 Authorization Endpoint
 * Initiates the OAuth2 flow by redirecting to Figma authorization
 */
// NOTE: Frontend currently calls /api/figmaOAuthStart so we keep the function name but
// also expose a friendly route alias "figmaOAuthStart" (no nested path) for consistency.
app.http("figmaOAuthStart", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  // Provide both legacy explicit route and flat route (Functions will map name -> /api/figmaOAuthStart)
  route: "figmaOAuthStart",
  handler: async (request, context) => {
    context.log("🚀 Starting Figma OAuth2 flow");

    try {
      const clientId = process.env.FIGMA_CLIENT_ID;
      // SINGLE SOURCE OF TRUTH for redirect URI
      const redirectUri =
        process.env.FIGMA_REDIRECT_URI ||
        process.env.FIGMA_REDIRECT_URI_DEV ||
        "http://localhost:7071/api/figmaOAuthCallback"; // Matches callback function route

      if (!clientId) {
        return {
          status: 400,
          jsonBody: {
            error: "Figma OAuth2 not configured. Missing FIGMA_CLIENT_ID.",
          },
        };
      }

      // Generate a state parameter for security
      const state = Math.random().toString(36).substring(2, 15);

      // Store state in session/memory for validation (in production, use proper session storage)
      // For now, we'll include it in the redirect and validate on callback

      const authUrl = new URL("https://www.figma.com/oauth");
      authUrl.searchParams.set("client_id", clientId);
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("scope", "file_read");
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("state", state);

      context.log("🔐 OAuth Authorization URL Prepared", {
        clientId: clientId.slice(0, 6) + "***",
        redirectUri,
        state,
      });

      // Return redirect response
      // Support JSON discovery for frontend status check (?format=json)
      const urlObj = new URL(request.url);
      const wantsJson =
        urlObj.searchParams.get("format") === "json" ||
        request.headers.get("accept")?.includes("application/json");

      if (wantsJson) {
        return {
          status: 200,
          jsonBody: {
            status: "authorization_required",
            auth_url: authUrl.toString(),
            redirect_uri: redirectUri,
            state,
          },
        };
      }

      return {
        status: 302,
        headers: {
          Location: authUrl.toString(),
          "Cache-Control": "no-cache",
        },
      };
    } catch (error) {
      context.log.error("OAuth2 start error:", error);
      return {
        status: 500,
        jsonBody: {
          error: "Failed to initiate OAuth2 flow",
          details: error.message,
        },
      };
    }
  },
});
