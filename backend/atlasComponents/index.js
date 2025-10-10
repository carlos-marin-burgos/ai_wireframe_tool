const path = require("path");
const { requireMicrosoftAuth } = require("../lib/authMiddleware");

// Import FigmaService from the services directory
const FigmaService = require(path.join(
  __dirname,
  "..",
  "..",
  "designetica-services",
  "figmaService.js"
));

module.exports = async function (context, req) {
  context.log(
    `🚀 atlasComponents function called with nodeId: ${req.params.nodeId}`
  );

  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-MS-CLIENT-PRINCIPAL",
    "Content-Type": "text/html",
  };

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    context.res = {
      status: 200,
      headers: headers,
      body: "",
    };
    return;
  }

  // Require Microsoft employee authentication
  const auth = requireMicrosoftAuth(req);
  if (!auth.valid) {
    context.res = {
      status: 403,
      headers: headers,
      body: JSON.stringify({
        error: "Unauthorized",
        message: auth.error || "Microsoft employee authentication required",
      }),
    };
    return;
  }

  context.log(`👤 Authenticated user: ${auth.email}`);

  try {
    const nodeId = req.params.nodeId;

    if (!nodeId) {
      context.res = {
        status: 400,
        headers: headers,
        body: "Node ID is required",
      };
      return;
    }

    context.log(`🔄 Fetching Atlas Hero component for node ID: ${nodeId}`);

    // Initialize FigmaService
    const figmaService = new FigmaService();

    // Generate the Atlas Hero component HTML
    const heroHTML = await figmaService.generateAtlasHeroFromFigma(nodeId);

    context.log(`✅ Successfully generated Atlas Hero HTML`);

    context.res = {
      status: 200,
      headers: headers,
      body: heroHTML,
    };
  } catch (error) {
    context.log.error(`❌ Error fetching Atlas Hero: ${error.message}`);

    // Return a fallback error component
    const errorHTML = `
        <div class="atlas-component atlas-hero-error" style="background: #fff4f4; padding: 48px 32px; border-radius: 8px; border: 1px solid #fde7e7; text-align: center; font-family: 'Segoe UI', system-ui, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto;">
                <h3 style="font-size: 18px; font-weight: 600; color: #d13438; margin-bottom: 12px;">Atlas Hero Component Error</h3>
                <p style="font-size: 14px; color: #68769C; margin-bottom: 8px;">Unable to fetch from Figma Atlas Design Library</p>
                <p style="font-size: 12px; color: #a19f9d; margin: 0;">Error: ${
                  error.message
                }</p>
                <p style="font-size: 11px; color: #c8c6c4; margin: 4px 0 0 0;">Node ID: ${
                  nodeId || "undefined"
                }</p>
            </div>
        </div>`;

    context.res = {
      status: 500,
      headers: headers,
      body: errorHTML,
    };
  }
};
