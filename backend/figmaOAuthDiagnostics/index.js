module.exports = async function (context, req) {
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
    FIGMA_REDIRECT_URI_PROD: process.env.FIGMA_REDIRECT_URI_PROD || null,
    derivedRedirectUri,
    callbackMatches,
    guidance: callbackMatches
      ? "Derived redirect URI path matches expected callback route."
      : `Derived redirect URI does NOT end with ${expectedCallbackPath}. Update your Figma app settings or environment variables.`,
  };

  if (req.query && req.query.raw === "1") {
    context.res = {
      status: 200,
      body: JSON.stringify(cfg, null, 2),
      headers: { "Content-Type": "application/json" },
    };
    return;
  }

  context.res = {
    status: 200,
    body: { status: "ok", config: cfg },
    headers: { "Content-Type": "application/json" },
  };
};

function mask(v) {
  if (!v) return null;
  return v.slice(0, 6) + "***";
}
