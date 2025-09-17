import React from 'react';
  
  const FigmaOAuthStart = () =>  {
	return (
	  <div>
	  </div>
	);
  }
  
  export default FigmaOAuthStart;
  import React from "react";

const FigmaOAuthStart = () => {
  return <div></div>;
};

export default FigmaOAuthStart;
const { app } = require("@azure/functions");

/**
 * Figma OAuth2 Authorization Endpoint
 * Initiates the OAuth2 flow by redirecting to Figma authorization
 */
app.http("figmaOAuthStart", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "figma/oauth/start",
  handler: async (request, context) => {
    context.log("Starting Figma OAuth2 flow");

    try {
      const clientId = process.env.FIGMA_CLIENT_ID;
      const redirectUri =
        process.env.FIGMA_REDIRECT_URI ||
        "http://localhost:7072/api/figma/oauth/callback";

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
      authUrl.searchParams.append("client_id", clientId);
      authUrl.searchParams.append("redirect_uri", redirectUri);
      authUrl.searchParams.append("scope", "file_read");
      authUrl.searchParams.append("response_type", "code");
      authUrl.searchParams.append("state", state);

      // Return redirect response
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
