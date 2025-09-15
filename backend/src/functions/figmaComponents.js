const { app } = require("@azure/functions");

/**
 * Figma Integration API
 * Handles file imports, component extraction, and wireframe generation
 */
app.http("figmaComponents", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "figma/components",
  handler: async (request, context) => {
    context.log("Figma components request");

    try {
      if (request.method === "GET") {
        return await handleGetComponents(request, context);
      } else if (request.method === "POST") {
        return await handleImportFigmaFile(request, context);
      }
    } catch (error) {
      context.log.error("Figma components error:", error);
      return {
        status: 500,
        jsonBody: {
          error: "Figma integration failed",
          details: error.message,
        },
      };
    }
  },
});

/**
 * Handle GET request - return available Figma components
 */
async function handleGetComponents(request, context) {
  const accessToken =
    request.headers.authorization?.replace("Bearer ", "") ||
    process.env.FIGMA_ACCESS_TOKEN;

  if (!accessToken) {
    return {
      status: 401,
      jsonBody: {
        error: "Figma access token required",
        authUrl: "/api/figma/oauth/start",
      },
    };
  }

  try {
    // Get user's team files
    const userInfo = await getFigmaUserInfo(accessToken);

    return {
      status: 200,
      jsonBody: {
        user: userInfo,
        message: "Figma integration active",
        endpoints: {
          import: "POST /api/figma/components",
          oauth: "/api/figma/oauth/start",
        },
      },
    };
  } catch (error) {
    context.log.error("Failed to get Figma components:", error);
    return {
      status: 400,
      jsonBody: {
        error: "Failed to access Figma API",
        details: error.message,
        authUrl: "/api/figma/oauth/start",
      },
    };
  }
}

/**
 * Handle POST request - import Figma file and generate wireframe
 */
async function handleImportFigmaFile(request, context) {
  const body = await request.json();
  const { fileUrl, fileKey, generateWireframe = true } = body;

  const accessToken =
    request.headers.authorization?.replace("Bearer ", "") ||
    process.env.FIGMA_ACCESS_TOKEN;

  if (!accessToken) {
    return {
      status: 401,
      jsonBody: {
        error: "Figma access token required",
        authUrl: "/api/figma/oauth/start",
      },
    };
  }

  let finalFileKey = fileKey;

  // Extract file key from URL if provided
  if (fileUrl && !fileKey) {
    finalFileKey = extractFileKeyFromUrl(fileUrl);
  }

  if (!finalFileKey) {
    return {
      status: 400,
      jsonBody: {
        error: "Figma file key or URL required",
        example: {
          fileUrl: "https://www.figma.com/file/ABC123/My-Design-File",
          fileKey: "ABC123",
        },
      },
    };
  }

  try {
    // Get Figma file data
    const fileData = await getFigmaFile(finalFileKey, accessToken);

    // Extract frames and components
    const frames = extractFramesFromFile(fileData);
    const components = extractComponentsFromFile(fileData);

    let wireframeHtml = null;
    if (generateWireframe && frames.length > 0) {
      // Generate images for frames
      const frameIds = frames.map((frame) => frame.id);
      const images = await getFigmaImages(finalFileKey, frameIds, accessToken);

      // Convert to wireframe HTML
      wireframeHtml = generateWireframeFromFrames(
        frames,
        images,
        fileData.name
      );
    }

    return {
      status: 200,
      jsonBody: {
        success: true,
        file: {
          key: finalFileKey,
          name: fileData.name,
          lastModified: fileData.lastModified,
          version: fileData.version,
        },
        frames: frames.map((frame) => ({
          id: frame.id,
          name: frame.name,
          type: frame.type,
          width: frame.absoluteBoundingBox?.width,
          height: frame.absoluteBoundingBox?.height,
        })),
        components: components.map((comp) => ({
          id: comp.id,
          name: comp.name,
          type: comp.type,
          description: comp.description,
        })),
        wireframeHtml: wireframeHtml,
        message: `Successfully imported ${frames.length} frames and ${components.length} components from Figma`,
      },
    };
  } catch (error) {
    context.log.error("Figma file import failed:", error);
    return {
      status: 400,
      jsonBody: {
        error: "Failed to import Figma file",
        details: error.message,
      },
    };
  }
}

/**
 * Utility Functions
 */

async function getFigmaUserInfo(accessToken) {
  const response = await fetch("https://api.figma.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get user info: ${response.statusText}`);
  }

  return await response.json();
}

async function getFigmaFile(fileKey, accessToken) {
  const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
    headers: {
      "X-Figma-Token": accessToken,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get Figma file: ${response.statusText}`);
  }

  return await response.json();
}

async function getFigmaImages(fileKey, nodeIds, accessToken) {
  const nodeIdParam = nodeIds.join(",");
  const response = await fetch(
    `https://api.figma.com/v1/images/${fileKey}?ids=${nodeIdParam}&format=png&scale=2`,
    {
      headers: {
        "X-Figma-Token": accessToken,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get Figma images: ${response.statusText}`);
  }

  const data = await response.json();
  return data.images || {};
}

function extractFileKeyFromUrl(url) {
  const match = url.match(/figma\.com\/file\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

function extractFramesFromFile(fileData) {
  const frames = [];

  function extractFromNode(node) {
    if (node.type === "FRAME" || node.type === "COMPONENT") {
      frames.push(node);
    }

    if (node.children) {
      node.children.forEach(extractFromNode);
    }
  }

  fileData.document.children.forEach(extractFromNode);
  return frames;
}

function extractComponentsFromFile(fileData) {
  const components = [];

  if (fileData.components) {
    Object.values(fileData.components).forEach((component) => {
      components.push({
        id: component.key,
        name: component.name,
        type: "COMPONENT",
        description: component.description || "",
      });
    });
  }

  return components;
}

function generateWireframeFromFrames(frames, images, fileName) {
  const frameElements = frames
    .map((frame, index) => {
      const imageUrl = images[frame.id];
      const dimensions = frame.absoluteBoundingBox;

      return `
            <div class="figma-frame" data-frame-id="${frame.id}">
                <div class="frame-header">
                    <h3>${frame.name || `Frame ${index + 1}`}</h3>
                    ${
                      dimensions
                        ? `<span class="frame-dimensions">${Math.round(
                            dimensions.width
                          )} × ${Math.round(dimensions.height)}</span>`
                        : ""
                    }
                </div>
                <div class="frame-content">
                    ${
                      imageUrl
                        ? `<img src="${imageUrl}" alt="${frame.name}" class="frame-image" />`
                        : `<div class="frame-placeholder">
                            <p>Frame: ${frame.name}</p>
                            <p>Type: ${frame.type}</p>
                        </div>`
                    }
                </div>
            </div>
        `;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Figma Import - ${fileName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
            background: #f5f7fa;
            padding: 20px;
            line-height: 1.6;
        }
        .figma-import-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .figma-header {
            background: linear-gradient(135deg, #0078d4 0%, #005a9e 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .figma-header h1 { font-size: 2rem; margin-bottom: 10px; }
        .figma-frames {
            padding: 30px;
            display: grid;
            gap: 30px;
        }
        .figma-frame {
            border: 1px solid #e1e5e9;
            border-radius: 8px;
            overflow: hidden;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .frame-header {
            background: #f8f9fa;
            padding: 15px 20px;
            border-bottom: 1px solid #e1e5e9;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .frame-content {
            padding: 20px;
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .frame-image {
            max-width: 100%;
            height: auto;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .frame-placeholder {
            background: #f1f3f4;
            border: 2px dashed #dadce0;
            border-radius: 8px;
            padding: 40px;
            text-align: center;
            color: #5f6368;
        }
    </style>
</head>
<body>
    <div class="figma-import-container">
        <div class="figma-header">
            <h1>🎨 Imported from Figma</h1>
            <p>${fileName} • ${frames.length} frames imported</p>
        </div>
        <div class="figma-frames">
            ${frameElements}
        </div>
    </div>
</body>
</html>`;
}
