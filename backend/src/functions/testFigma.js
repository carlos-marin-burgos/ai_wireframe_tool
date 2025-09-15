const { app } = require("@azure/functions");

/**
 * Figma Integration Test Endpoint
 * Tests Figma API connection and token validity
 */
app.http("testFigma", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "figma/test",
  handler: async (request, context) => {
    context.log("Testing Figma integration");

    try {
      const accessToken =
        request.headers.authorization?.replace("Bearer ", "") ||
        process.env.FIGMA_ACCESS_TOKEN;

      if (!accessToken) {
        return {
          status: 400,
          jsonBody: {
            error: "No Figma access token found",
            message:
              "Please set FIGMA_ACCESS_TOKEN environment variable or use OAuth2",
            authUrl: "/api/figma/oauth/start",
          },
        };
      }

      // Test API connection
      const userResponse = await fetch("https://api.figma.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userResponse.ok) {
        const error = await userResponse.json();
        return {
          status: 401,
          jsonBody: {
            error: "Invalid Figma access token",
            details: error,
            message: "Token may be expired or invalid",
            authUrl: "/api/figma/oauth/start",
          },
        };
      }

      const userData = await userResponse.json();

      return {
        status: 200,
        jsonBody: {
          success: true,
          message: "Figma integration is working!",
          user: {
            id: userData.id,
            handle: userData.handle,
            email: userData.email,
            img_url: userData.img_url,
          },
          token: {
            valid: true,
            prefix: accessToken.substring(0, 20) + "...",
            type: accessToken.startsWith("figd_")
              ? "Personal Access Token"
              : "OAuth2 Token",
          },
          endpoints: {
            import: "POST /api/figma/components",
            oauth: "/api/figma/oauth/start",
            test: "GET /api/figma/test",
          },
        },
      };
    } catch (error) {
      context.log.error("Figma test error:", error);
      return {
        status: 500,
        jsonBody: {
          error: "Figma integration test failed",
          details: error.message,
          message: "Check your network connection and token validity",
        },
      };
    }
  },
});
