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

  // Remove code fences and markdown formatting
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/i, "");
  cleaned = cleaned.replace(/^```\s*/i, "").replace(/```$/i, "");

  // Try direct parse first
  try {
    const parsed = JSON.parse(cleaned);
    // Validate it has the expected structure
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch (_) {}

  // Look for JSON object patterns - more aggressive search
  const jsonPatterns = [
    /\{[\s\S]*\}/, // Basic { ... }
    /\{[^}]*"components"[^}]*\}[\s\S]*/, // Look for components field
    /(\{[\s\S]*"designTokens"[\s\S]*\})/, // Look for designTokens
  ];

  for (const pattern of jsonPatterns) {
    const match = cleaned.match(pattern);
    if (match) {
      try {
        const candidate = match[0];
        const parsed = JSON.parse(candidate);
        if (parsed && typeof parsed === "object") {
          return parsed;
        }
      } catch (_) {}
    }
  }

  // Try to extract just the main JSON structure if it's embedded in other text
  const lines = cleaned.split("\n");
  let jsonStart = -1;
  let braceCount = 0;
  let jsonEnd = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("{") && jsonStart === -1) {
      jsonStart = i;
    }
    if (jsonStart !== -1) {
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;
      braceCount += openBraces - closeBraces;

      if (braceCount === 0 && openBraces > 0) {
        jsonEnd = i;
        break;
      }
    }
  }

  if (jsonStart !== -1 && jsonEnd !== -1) {
    try {
      const jsonText = lines.slice(jsonStart, jsonEnd + 1).join("\n");
      const parsed = JSON.parse(jsonText);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch (_) {}
  }

  return null;
}

function buildPrompt(userPrompt) {
  return (
    userPrompt ||
    `Analyze this UI/screenshot and return JSON with EXACT text content and colors:
{
  "components": [ 
    { 
      "id": "component-1", 
      "type": "button|text|image|input|card|nav|header|footer|icon|form", 
      "bounds": {"x": %, "y": %, "width": %, "height": %}, 
      "text": "EXACT_TEXT_FROM_IMAGE", 
      "properties": { 
        "backgroundColor": "#exact_hex_color", 
        "textColor": "#exact_text_hex_color", 
        "borderColor": "#exact_border_hex_color",
        "fontSize": "16px",
        "fontWeight": "400|500|600|700",
        "style": "primary|secondary|neutral" 
      }, 
      "confidence": 0.0 
    } 
  ],
  "layout": { "type": "grid|flex|absolute|mixed", "columns": n?, "sections": [..] },
  "designTokens": { 
    "colors": ["#exact_hex1", "#exact_hex2", "#exact_hex3"], 
    "fonts": ["exact_font_name_1", "exact_font_name_2"], 
    "spacing": [8,16,24] 
  },
  "wireframeDescription": "natural language summary with exact color and text details",
  "confidence": 0.x
}
CRITICAL: Extract EXACT text content and EXACT colors from the image. Return ONLY JSON (no commentary).`
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
      context.log(
        `[${correlationId}] Raw vision response: ${rawContent.substring(
          0,
          500
        )}...`
      );

      parsedJson = extractJsonFromText(rawContent);
      if (parsedJson) {
        context.log(
          `[${correlationId}] Successfully parsed JSON with ${
            parsedJson.components?.length || 0
          } components`
        );
      } else {
        context.log(`[${correlationId}] Failed to parse JSON from response`);
      }
    }

    let finalAnalysis;
    if (parsedJson && (parsedJson.components || parsedJson.designTokens)) {
      // Ensure components is an array
      if (!Array.isArray(parsedJson.components)) {
        parsedJson.components = [];
      }

      // Ensure designTokens exists
      if (!parsedJson.designTokens) {
        parsedJson.designTokens = { colors: [], fonts: [], spacing: [] };
      }

      finalAnalysis = {
        components: parsedJson.components,
        layout: parsedJson.layout || { type: "flex", columns: 1 },
        designTokens: parsedJson.designTokens,
        wireframeDescription:
          parsedJson.wireframeDescription ||
          rawContent?.slice(0, 1000) ||
          "Analysis completed",
        confidence: parsedJson.confidence || 0.7,
        correlationId,
        model: visionResult.model,
        processingTimeMs: Date.now() - startTime,
        source: "vision-structured",
      };
    } else if (rawContent) {
      // Fallback: try to extract some information from unstructured response
      const textMatches = rawContent.match(/"([^"]+)"/g) || [];
      const colorMatches = rawContent.match(/#[0-9a-fA-F]{6}/g) || [];

      finalAnalysis = {
        components:
          textMatches.length > 0
            ? textMatches.map((text, idx) => ({
                id: `extracted-${idx}`,
                type: "text",
                text: text.replace(/"/g, ""),
                bounds: { x: 0, y: idx * 30, width: 200, height: 25 },
                properties: { color: colorMatches[idx] || "#333333" },
                confidence: 0.5,
              }))
            : [],
        layout: { type: "flex", columns: 1 },
        designTokens: {
          colors: colorMatches.slice(0, 5),
          fonts: ["Arial", "sans-serif"],
          spacing: [10, 20, 30],
        },
        wireframeDescription: rawContent.slice(0, 1000),
        confidence: 0.4,
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
            type: "text",
            bounds: { x: 10, y: 10, width: 200, height: 30 },
            text: "Analysis failed",
            properties: { color: "#666666" },
            confidence: 0.1,
          },
        ],
        layout: { type: "flex", columns: 1 },
        designTokens: { colors: ["#666666"], fonts: ["Arial"], spacing: [10] },
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
