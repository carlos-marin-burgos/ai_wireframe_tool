import React from 'react';
  
  const FigmaOAuthDiagnostics = () =>  {
	return (
	  <div>
	  </div>
	);
  }
  
  export default FigmaOAuthDiagnostics;
  import React from 'react';
  
  const FigmaOAuthDiagnostics = () =>  {
	return (
	  <div>
	  </div>
	);
  }
  
  export default FigmaOAuthDiagnostics;
  // Figma OAuth Diagnostics Function
// Provides runtime visibility into configured environment variables and the derived redirect URI
// to help troubleshoot 404 "Not Found" responses from Figma's token endpoint.
// NOTE: Do NOT expose secrets directly; values are masked.

const { app } = require("@azure/functions");

// Simple diagnostics endpoint to surface current config & help debug 404 during token exchange
app.http("figmaOAuthDiagnostics", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "figmaOAuthDiagnostics",
  handler: async (req, context) => {
    const now = new Date().toISOString();
    const envSource = process.env.FIGMA_REDIRECT_URI
      ? "FIGMA_REDIRECT_URI"
      : process.env.FIGMA_REDIRECT_URI_DEV
      ? "FIGMA_REDIRECT_URI_DEV"
      : "default";

    const derivedRedirectUri =
      process.env.FIGMA_REDIRECT_URI ||
      process.env.FIGMA_REDIRECT_URI_DEV ||
      "http://localhost:7071/api/figmaOAuthCallback";

    const expectedCallbackPath = "/api/figmaOAuthCallback";
    const callbackMatches = derivedRedirectUri.endsWith(expectedCallbackPath);

    const cfg = {
      timestamp: now,
      envSource,
      FIGMA_CLIENT_ID: mask(process.env.FIGMA_CLIENT_ID),
      FIGMA_CLIENT_SECRET: mask(process.env.FIGMA_CLIENT_SECRET),
      FIGMA_REDIRECT_URI: process.env.FIGMA_REDIRECT_URI || null,
      FIGMA_REDIRECT_URI_DEV: process.env.FIGMA_REDIRECT_URI_DEV || null,
      derivedRedirectUri,
      callbackMatches,
      guidance: callbackMatches
        ? "Derived redirect URI path matches expected callback route."
        : `Derived redirect URI does NOT end with ${expectedCallbackPath}. Update your Figma app settings or environment variables.`,
    };

    if (req.query.get("raw") === "1") {
      return { status: 200, body: JSON.stringify(cfg, null, 2) };
    }

    return { status: 200, jsonBody: { status: "ok", config: cfg } };
  },
});

function mask(v) {
  if (!v) return null;
  return v.slice(0, 6) + "***";
}
