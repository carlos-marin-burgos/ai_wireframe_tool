const {
  generateDirectWireframeFromImage,
} = require("../direct-image-converter");

function generateCorrelationId() {
  return `direct-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function setCors(context) {
  context.res = context.res || {};
  context.res.headers = Object.assign({}, context.res.headers, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Pragma",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json",
    Vary: "Origin",
  });
}

function extractImageFromRequest(body) {
  if (!body) return null;
  const candidates = [
    body.image,
    body.imageBase64,
    body.image_url,
    body.imageUrl,
    body.data,
  ].filter(Boolean);
  return candidates.length ? candidates[0] : null;
}

function normalizeImageUrl(image) {
  if (!image) return null;
  if (image.startsWith("data:")) return image;
  // Add data URL prefix if it looks like base64
  if (
    !/^https?:/i.test(image) &&
    /^[A-Za-z0-9+/=\n\r]+$/.test(image.slice(0, 100))
  ) {
    return `data:image/png;base64,${image.replace(/\s+/g, "")}`;
  }
  return image;
}

module.exports = async function (context, req) {
  const correlationId = generateCorrelationId();
  const startTime = Date.now();
  setCors(context);

  try {
    if (req.method === "OPTIONS") {
      context.res.status = 200;
      context.res.body = "";
      return;
    }

    if (req.method !== "POST") {
      context.res.status = 405;
      context.res.body = JSON.stringify({
        success: false,
        error: "Method not allowed",
        correlationId,
      });
      return;
    }

    // Extract image from request
    let body = req.body;
    if (!body && req.rawBody && typeof req.rawBody === "string") {
      try {
        body = JSON.parse(req.rawBody);
      } catch (_) {}
    }

    let image = extractImageFromRequest(body);
    image = normalizeImageUrl(image);

    if (!image) {
      context.res.status = 400;
      context.res.body = JSON.stringify({
        success: false,
        error: "missing_image",
        message: "Image data required (imageBase64, image, or image_url field)",
        correlationId,
      });
      return;
    }

    context.log(
      `[${correlationId}] Starting direct image-to-wireframe conversion`
    );

    // Extract design theme and color scheme from request
    const designTheme = body?.designTheme || "microsoftlearn";
    const colorScheme = body?.colorScheme || "light";

    context.log(
      `[${correlationId}] Using design theme: ${designTheme}, color scheme: ${colorScheme} (with image color extraction)`
    );

    // Generate HTML directly from image with design system context
    const result = await generateDirectWireframeFromImage(
      image,
      correlationId,
      designTheme,
      colorScheme
    );
    const processingTime = Date.now() - startTime;

    context.res.status = 200;
    context.res.body = JSON.stringify({
      success: true,
      data: {
        html: result.html,
        source: result.source,
        confidence: result.confidence,
        framework: "html",
        styling: "inline-css",
      },
      metadata: {
        correlationId,
        processingTimeMs: processingTime,
        generatedAt: new Date().toISOString(),
        method: "direct-vision-conversion",
      },
    });

    context.log(
      `[${correlationId}] Direct conversion completed in ${processingTime}ms`
    );
  } catch (error) {
    context.log.error(`[${correlationId}] Direct conversion failed:`, error);

    context.res.status = 500;
    context.res.body = JSON.stringify({
      success: false,
      error: "conversion_failed",
      message: error.message || "Failed to convert image to wireframe",
      correlationId,
    });
  }
};
