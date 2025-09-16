const { app } = require("@azure/functions");

/**
 * Figma OAuth2 Callback Endpoint
 * Handles the OAuth2 callback and exchanges code for access token
 */
app.http("figmaOAuthCallback", {
  methods: ["GET"],
  authLevel: "anonymous",
  // Keep route name aligned with start function; explicit route omitted so default becomes /api/figmaOAuthCallback
  handler: async (request, context) => {
    context.log("🔁 Handling Figma OAuth2 callback", { url: request.url });

    try {
      const url = new URL(request.url);
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      const error = url.searchParams.get("error");

      // Handle OAuth2 errors
      if (error) {
        context.log.error("OAuth2 error:", error);
        return {
          status: 400,
          headers: {
            "Content-Type": "text/html",
          },
          body: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Figma Authorization Error</title>
                            <style>
                                body { font-family: system-ui; padding: 40px; text-align: center; }
                                .error { color: #d73a49; background: #ffeef0; padding: 20px; border-radius: 6px; }
                            </style>
                        </head>
                        <body>
                            <h1>Authorization Failed</h1>
                            <div class="error">
                                <p>Figma authorization was denied or failed.</p>
                                <p>Error: ${error}</p>
                                <p><a href="/api/figmaOAuthStart">Try again</a></p>
                            </div>
                        </body>
                        </html>
                    `,
        };
      }

      if (!code) {
        return {
          status: 400,
          jsonBody: {
            error: "Missing authorization code",
          },
        };
      }

      // Exchange code for access token
      const wantsDebug = url.searchParams.get("debug") === "1";
      const tokenResponse = await exchangeCodeForToken(code, context);

      if (!tokenResponse.success) {
        if (wantsDebug) {
          return {
            status: 400,
            jsonBody: {
              error: "Token Exchange Failed",
              message: tokenResponse.error,
              debug: tokenResponse.debug || null,
              redirectUriUsed: tokenResponse.redirectUri,
            },
          };
        }
        return {
          status: 400,
          headers: { "Content-Type": "text/html" },
          body: createErrorPage("Token Exchange Failed", tokenResponse.error),
        };
      }

      // Store tokens securely (in production, use proper secure storage)
      const tokens = tokenResponse.data;

      // Test the access token
      const userInfo = await testFigmaAccess(tokens.access_token, context);

      // Return success page with tokens (in production, redirect to app with success message)
      return {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
        body: createSuccessPage(tokens, userInfo),
      };
    } catch (error) {
      context.log.error("OAuth2 callback error:", error);
      return {
        status: 500,
        jsonBody: {
          error: "OAuth2 callback failed",
          details: error.message,
        },
      };
    }
  },
});

/**
 * Exchange authorization code for access token
 */
async function exchangeCodeForToken(code, context) {
  try {
    const clientId = process.env.FIGMA_CLIENT_ID;
    const clientSecret = process.env.FIGMA_CLIENT_SECRET;
    const redirectUri =
      process.env.FIGMA_REDIRECT_URI ||
      process.env.FIGMA_REDIRECT_URI_DEV ||
      "http://localhost:7071/api/figmaOAuthCallback";

    if (!clientId || !clientSecret) {
      throw new Error("Missing Figma OAuth2 credentials");
    }

    const form = new URLSearchParams();
    form.set("client_id", clientId);
    form.set("client_secret", clientSecret);
    form.set("redirect_uri", redirectUri);
    form.set("code", code);
    form.set("grant_type", "authorization_code");

    context.log("📤 Exchanging code for token", {
      redirectUri,
      codePreview: code.substring(0, 6) + "***",
    });

    const response = await fetch("https://www.figma.com/api/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: form.toString(),
    });

    const rawText = await response.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      data = { parseError: e.message, rawText };
    }

    if (!response.ok) {
      context.log.error("❌ Token exchange failed", {
        status: response.status,
        statusText: response.statusText,
        data,
      });
      return {
        success: false,
        error: data.error || data.message || "Token exchange failed",
        debug: {
          status: response.status,
          statusText: response.statusText,
          raw: data,
        },
        redirectUri,
      };
    }

    context.log("✅ Token exchange successful");
    return { success: true, data };
  } catch (error) {
    context.log.error("💥 Token exchange error", { message: error.message });
    return { success: false, error: error.message, redirectUri };
  }
}

/**
 * Test Figma API access with token
 */
async function testFigmaAccess(accessToken, context) {
  try {
    const response = await fetch("https://api.figma.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to access Figma API");
    }

    const data = await response.json();
    context.log("Figma API access test successful for user:", data.handle);
    return data;
  } catch (error) {
    context.log.error("Figma API test failed:", error);
    return null;
  }
}

/**
 * Create success page HTML
 */
function createSuccessPage(tokens, userInfo) {
  const maskedToken = tokens.access_token.substring(0, 20) + "...";
  const expiresAt = new Date(
    Date.now() + tokens.expires_in * 1000
  ).toISOString();

  return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Figma Authorization Successful</title>
            <style>
                body { 
                    font-family: system-ui, -apple-system, sans-serif; 
                    padding: 40px; 
                    max-width: 800px; 
                    margin: 0 auto;
                    line-height: 1.6;
                }
                .success { 
                    color: #28a745; 
                    background: #d4edda; 
                    padding: 20px; 
                    border-radius: 8px; 
                    border: 1px solid #c3e6cb;
                }
                .info { 
                    background: #f8f9fa; 
                    padding: 20px; 
                    border-radius: 8px; 
                    margin: 20px 0;
                    border: 1px solid #dee2e6;
                }
                .token-info {
                    background: #fff3cd;
                    padding: 15px;
                    border-radius: 6px;
                    margin: 10px 0;
                    border: 1px solid #ffeaa7;
                    font-family: monospace;
                    font-size: 14px;
                }
                .actions {
                    margin-top: 30px;
                    text-align: center;
                }
                .btn {
                    background: #194a7a;
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 6px;
                    text-decoration: none;
                    display: inline-block;
                    margin: 0 10px;
                }
                .btn:hover {
                    background: #0056b3;
                }
            </style>
        </head>
        <body>
            <h1>🎉 Figma Authorization Successful!</h1>
            
            <div class="success">
                <p><strong>Great!</strong> Designetica now has access to your Figma account.</p>
            </div>

            ${
              userInfo
                ? `
            <div class="info">
                <h3>👤 Connected Account</h3>
                <p><strong>Handle:</strong> ${userInfo.handle}</p>
                <p><strong>Email:</strong> ${userInfo.email}</p>
            </div>
            `
                : ""
            }

            <div class="info">
                <h3>🔑 Access Token Information</h3>
                <div class="token-info">
                    <p><strong>Token:</strong> ${maskedToken}</p>
                    <p><strong>Expires:</strong> ${expiresAt}</p>
                    <p><strong>Scope:</strong> file_read</p>
                </div>
                <p><small><strong>Security Note:</strong> This access token allows Designetica to read your Figma files. Keep it secure!</small></p>
            </div>

            <div class="info">
                <h3>🚀 Next Steps</h3>
                <ol>
                    <li>The access token has been configured for your Designetica instance</li>
                    <li>You can now import Figma files and components</li>
                    <li>Test the integration by importing a Figma file</li>
                    <li>The token will automatically refresh when needed</li>
                </ol>
            </div>

            <div class="actions">
                <a href="/" class="btn">Return to Designetica</a>
                <a href="/api/figma/test" class="btn" style="background: #28a745;">Test Integration</a>
            </div>

            <script>
                // Store token in localStorage for frontend access (in production, use secure storage)
                localStorage.setItem('figma_access_token', '${
                  tokens.access_token
                }');
                localStorage.setItem('figma_token_expires', '${expiresAt}');
                
                // Auto-redirect after 10 seconds
                setTimeout(() => {
                    window.location.href = '/';
                }, 10000);
                
                console.log('Figma OAuth2 setup complete');
            </script>
        </body>
        </html>
    `;
}

/**
 * Create error page HTML
 */
function createErrorPage(title, error) {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                body { font-family: system-ui; padding: 40px; text-align: center; }
                .error { color: #d73a49; background: #ffeef0; padding: 20px; border-radius: 6px; }
                .btn { background: #194a7a; color: white; padding: 12px 24px; border: none; border-radius: 6px; text-decoration: none; }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <div class="error">
                <p>${error}</p>
                <p><a href="/api/figma/oauth/start" class="btn">Try Again</a></p>
            </div>
        </body>
        </html>
    `;
}
