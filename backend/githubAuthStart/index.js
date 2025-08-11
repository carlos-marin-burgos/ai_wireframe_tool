// Starts GitHub OAuth flow by redirecting to GitHub authorize URL
// Minimal, development-focused implementation (NOT production hardened)

const crypto = require("crypto");

// In-memory state store (resets on cold start)
const stateStore = require("../githubAuthState");

module.exports = async function (context, req) {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    // Check if credentials are missing or still set to placeholder values
    if (
      !clientId ||
      !clientSecret ||
      clientId === "__SET_ME__" ||
      clientSecret === "__SET_ME__"
    ) {
      context.res = {
        status: 501,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: {
          error: "GitHub OAuth not configured",
          message: "Please set up GitHub OAuth credentials",
          instructions: [
            "1. Go to GitHub Settings > Developer settings > OAuth Apps",
            "2. Create a new OAuth App with:",
            "   - Application name: Your app name",
            "   - Homepage URL: https://your-domain.com (or http://localhost:5173 for dev)",
            "   - Authorization callback URL: https://your-backend.azurewebsites.net/api/github/auth/callback (or http://localhost:7072/api/github/auth/callback for dev)",
            "3. Copy the Client ID and Client Secret",
            "4. For PRODUCTION: Set environment variables in Azure:",
            "   - GITHUB_CLIENT_ID: your_client_id",
            "   - GITHUB_CLIENT_SECRET: your_client_secret",
            "   - GITHUB_REDIRECT_URL: https://your-backend.azurewebsites.net/api/github/auth/callback",
            "5. For DEVELOPMENT: Update backend/local.settings.json and restart server",
            "6. You may need separate GitHub OAuth apps for dev and production",
          ],
          currentValues: {
            clientId: clientId || "not set",
            clientSecret: clientSecret
              ? clientSecret === "__SET_ME__"
                ? "placeholder"
                : "configured"
              : "not set",
            redirectUrl:
              process.env.GITHUB_REDIRECT_URL ||
              "http://localhost:7072/api/github/auth/callback",
          },
        },
      };
      return;
    }

    const state = crypto.randomBytes(16).toString("hex");
    stateStore.save(state, { created: Date.now() });

    const redirectBase =
      process.env.GITHUB_REDIRECT_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://your-backend.azurewebsites.net/api/github/auth/callback"
        : "http://localhost:7072/api/github/auth/callback");
    const scope = (process.env.GITHUB_OAUTH_SCOPES || "repo,user:email").trim();
    const authorizeUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(
      redirectBase
    )}&scope=${encodeURIComponent(scope)}&state=${state}`;

    // If request asks for JSON (e.g. XHR) return URL; else redirect
    const acceptsJson =
      (req.headers["accept"] || "").includes("application/json") ||
      req.query.return === "json";
    if (acceptsJson) {
      context.res = {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: { authorizeUrl, state },
      };
    } else {
      context.res = {
        status: 302,
        headers: { Location: authorizeUrl, "Access-Control-Allow-Origin": "*" },
        body: "",
      };
    }
  } catch (err) {
    context.log.error("GitHub auth start error", err);
    context.res = {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: { error: err.message },
    };
  }
};
