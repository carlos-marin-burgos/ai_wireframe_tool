const { app } = require("@azure/functions");

/**
 * Figma OAuth2 Callback Endpoint
 * Handles the OAuth2 callback and exchanges code for access token
 */
app.http("figmaOAuthCallback", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "figma/oauth/callback",
  handler: async (request, context) => {
    context.log("Handling Figma OAuth2 callback");

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
      const tokenResponse = await exchangeCodeForToken(code, context);

      if (!tokenResponse.success) {
        return {
          status: 400,
          headers: {
            "Content-Type": "text/html",
          },
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
      "http://localhost:7072/api/figma/oauth/callback";

    if (!clientId || !clientSecret) {
      throw new Error("Missing Figma OAuth2 credentials");
    }

    const response = await fetch("https://www.figma.com/api/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code,
        grant_type: "authorization_code",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      context.log.error("Token exchange failed:", data);
      return {
        success: false,
        error: data.error || "Token exchange failed",
      };
    }

    context.log("Token exchange successful");
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    context.log.error("Token exchange error:", error);
    return {
      success: false,
      error: error.message,
    };
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
                    background: #007bff;
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
                .btn { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 6px; text-decoration: none; }
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
