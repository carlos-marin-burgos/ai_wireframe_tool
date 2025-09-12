// Enhanced analyzeUIImage implementation: supports JSON payload with vision analysis
// Uses direct OpenAI client initialization (simplified for debugging)

const { OpenAI } = require("openai");

function generateCorrelationId() {
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function setCors(context) {
  context.res = context.res || {};
  context.res.headers = Object.assign({}, context.res.headers, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  });
}

function extractImageFromJson(body) {
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

function normalizeDataUrl(image) {
  if (!image) return null;
  if (image.startsWith("data:")) return image; // already a data URL
  // Heuristic: assume base64 png if raw base64 (no http prefix and mostly base64 chars)
  if (
    !/^https?:/i.test(image) &&
    /^[A-Za-z0-9+/=\n\r]+$/.test(image.slice(0, 200))
  ) {
    return `data:image/png;base64,${image.replace(/\s+/g, "")}`;
  }
  return image; // may be remote URL
}

function extractJsonFromText(text) {
  if (!text || typeof text !== "string") return null;
  // Remove code fences
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\n?/i, "").replace(/```$/i, "");
  // Try direct parse
  try {
    return JSON.parse(cleaned);
  } catch (_) {}
  // Regex to find first { ... } block reasonably
  const match = cleaned.match(/\{[\s\S]*\}$/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch (_) {}
  }
  return null;
}

function buildPrompt(userPrompt) {
  return (
    userPrompt ||
    `Analyze this UI/screenshot and return JSON with:
{
  "components": [ { "id": "component-1", "type": "button|text|image|input|card|nav|header|footer|icon|form", "bounds": {"x": %, "y": %, "width": %, "height": %}, "text": "...", "properties": { "color": "#hex?", "style": "primary|secondary|neutral" }, "confidence": 0.0 } ],
  "layout": { "type": "grid|flex|absolute|mixed", "columns": n?, "sections": [..] },
  "designTokens": { "colors": ["#"], "fonts": ["..."], "spacing": [8,16,24] },
  "wireframeDescription": "natural language summary",
  "confidence": 0.x
}
Return ONLY JSON (no commentary).`
  );
}

async function callVision(imageDataUrl, prompt) {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
  const apiKey = process.env.AZURE_OPENAI_KEY;
  const apiVersion =
    process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";

  if (!endpoint || !apiKey) {
    throw new Error(
      "Missing OpenAI configuration: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY required"
    );
  }

  const client = new OpenAI({
    apiKey,
    baseURL: `${endpoint}/openai/deployments/${deployment}`,
    defaultQuery: { "api-version": apiVersion },
    defaultHeaders: { "api-key": apiKey },
  });

  const start = Date.now();
  const response = await client.chat.completions.create({
    model: deployment,
    temperature: 0.1,
    max_tokens: 3500,
    messages: [
      {
        role: "system",
        content:
          "You are a precise UI analyzer that outputs STRICT JSON describing components and layout.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: { url: imageDataUrl, detail: "auto" },
          },
        ],
      },
    ],
  });

  const durationMs = Date.now() - start;
  return { response, durationMs, model: deployment };
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

    const contentType = (
      req.headers["content-type"] ||
      req.headers["Content-Type"] ||
      ""
    ).toLowerCase();
    let body = req.body;
    if (!body && req.rawBody && typeof req.rawBody === "string") {
      try {
        body = JSON.parse(req.rawBody);
      } catch (_) {}
    }

    let image = null;
    let userPrompt = null;
    let parsingMeta = { source: "json" };

    // For now, support only JSON input to simplify debugging
    if (body && typeof body === "object") {
      image = extractImageFromJson(body);
      userPrompt = body.prompt || body.analysisPrompt || null;
      parsingMeta = { source: "json", bodyKeys: Object.keys(body) };
    }

    // Query fallback
    if (!image && req.query) {
      image = req.query.image || req.query.image_url || req.query.imageBase64;
      userPrompt = userPrompt || req.query.prompt;
      if (!parsingMeta.source) parsingMeta.source = "query";
    }

    image = normalizeDataUrl(image);

    if (!image) {
      context.res.status = 400;
      context.res.body = JSON.stringify({
        success: false,
        error: "missing_image",
        message:
          "Image data required (JSON field: image / imageBase64 / image_url).",
        correlationId,
        parsing: parsingMeta,
      });
      return;
    }

    // Basic size guard (if data URL)
    if (image.startsWith("data:")) {
      const b64 = image.split(",")[1] || "";
      const approxBytes = (b64.length * 3) / 4;
      context.log(
        `Incoming image approx size: ${approxBytes} bytes (correlationId=${correlationId})`
      );
      if (approxBytes > 8 * 1024 * 1024) {
        context.res.status = 400;
        context.res.body = JSON.stringify({
          success: false,
          error: "image_too_large",
          message: "Image exceeds 8MB limit.",
          correlationId,
          sizeBytes: approxBytes,
        });
        return;
      }
      if (approxBytes < 200) {
        // Warn about extremely small images which may be rejected by vision models.
        context.log.warn(
          `Image extremely small (<200 bytes). Vision may reject it. correlationId=${correlationId}`
        );
      }
    }

    // Allow skipping OpenAI for diagnostics / offline
    if (process.env.SKIP_OPENAI_VISION === "1") {
      context.res.status = 200;
      context.res.body = JSON.stringify({
        success: true,
        analysis: {
          components: [
            {
              id: "stub-1",
              type: "image",
              bounds: { x: 5, y: 5, width: 90, height: 90 },
              confidence: 0.5,
            },
          ],
          layout: { type: "unknown" },
          designTokens: { colors: [], fonts: [], spacing: [] },
          wireframeDescription: "Vision skipped (stub mode).",
          confidence: 0.1,
          correlationId,
          processingTimeMs: Date.now() - startTime,
          source: "stub",
        },
      });
      return;
    }

    const prompt = buildPrompt(userPrompt);
    let visionResult = null;
    let visionError = null;
    try {
      visionResult = await callVision(image, prompt);
    } catch (err) {
      visionError = err;
      context.log.error("Vision API call failed:", err.message);
    }

    let parsedJson = null;
    let rawContent = null;
    if (visionResult?.response?.choices?.[0]?.message?.content) {
      rawContent = visionResult.response.choices[0].message.content.trim();
      parsedJson = extractJsonFromText(rawContent);
    }

    let finalAnalysis;
    if (parsedJson && Array.isArray(parsedJson.components)) {
      finalAnalysis = {
        ...parsedJson,
        correlationId,
        model: visionResult.model,
        processingTimeMs: Date.now() - startTime,
        source: "vision-structured",
      };
    } else if (rawContent) {
      finalAnalysis = {
        components: [],
        layout: { type: "unknown" },
        designTokens: { colors: [], fonts: [], spacing: [] },
        wireframeDescription: rawContent.slice(0, 4000),
        confidence: 0.3,
        correlationId,
        model: visionResult?.model,
        processingTimeMs: Date.now() - startTime,
        source: "vision-unstructured",
      };
    } else {
      finalAnalysis = {
        components: [
          {
            id: "fallback-1",
            type: "image",
            bounds: { x: 10, y: 10, width: 80, height: 60 },
            text: null,
            confidence: 0.2,
          },
        ],
        layout: { type: "unknown" },
        designTokens: { colors: [], fonts: [], spacing: [] },
        wireframeDescription: visionError
          ? `Vision call failed: ${visionError.message}`
          : "No content returned by model",
        confidence: 0.1,
        correlationId,
        model: visionResult?.model,
        processingTimeMs: Date.now() - startTime,
        source: visionError ? "error-fallback" : "empty-fallback",
        error: visionError ? visionError.message : undefined,
      };
    }

    context.res.status = 200;
    context.res.body = JSON.stringify({
      success: true,
      analysis: finalAnalysis,
      correlationId,
      meta: {
        contentType,
        parsing: parsingMeta,
        hadVisionError: !!visionError,
      },
    });
  } catch (err) {
    context.log.error("analyzeUIImage fatal error", err);
    context.res.status = 500;
    context.res.body = JSON.stringify({
      success: false,
      error: "internal_error",
      message: err.message,
      correlationId,
    });
  }
};
