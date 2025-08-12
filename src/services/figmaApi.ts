/**
 * Figma API Integration Service
 * Handles authentication, file fetching, and data conversion
 */

export interface FigmaConfig {
  accessToken: string;
  teamId?: string;
}

export interface FigmaFile {
  key: string;
  name: string;
  thumbnail_url: string;
  last_modified: string;
  version: string;
}

export interface FigmaFrame {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fills?: any[];
  strokes?: any[];
  strokeWeight?: number;
  cornerRadius?: number;
  characters?: string;
  style?: any;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fills?: any[];
  strokes?: any[];
  strokeWeight?: number;
  cornerRadius?: number;
  characters?: string;
  style?: any;
}

export interface FigmaDocument {
  id: string;
  name: string;
  type: string;
  children: FigmaNode[];
}

export interface FigmaFileResponse {
  document: FigmaDocument;
  components: Record<string, any>;
  styles: Record<string, any>;
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
}

class FigmaApiService {
  private accessToken: string = "";
  private baseUrl: string = "https://api.figma.com/v1";

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  private async makeRequest(endpoint: string): Promise<any> {
    if (!this.accessToken) {
      throw new Error("Figma access token not set. Please authenticate first.");
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "X-Figma-Token": this.accessToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Invalid Figma access token. Please check your credentials."
        );
      }
      if (response.status === 403) {
        throw new Error(
          "Access denied. Please check file permissions in Figma."
        );
      }
      if (response.status === 404) {
        throw new Error(
          "Figma file not found. Please check the file URL or ID."
        );
      }
      throw new Error(
        `Figma API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Get user's team files
   */
  async getTeamProjects(teamId: string): Promise<any> {
    return this.makeRequest(`/teams/${teamId}/projects`);
  }

  /**
   * Get files from a project
   */
  async getProjectFiles(projectId: string): Promise<{ files: FigmaFile[] }> {
    return this.makeRequest(`/projects/${projectId}/files`);
  }

  /**
   * Get file details and content
   */
  async getFile(fileKey: string): Promise<FigmaFileResponse> {
    const data = await this.makeRequest(`/files/${fileKey}`);

    return {
      document: data.document,
      components: data.components || {},
      styles: data.styles || {},
      name: data.name,
      lastModified: data.lastModified,
      thumbnailUrl: data.thumbnailUrl || "",
      version: data.version,
    };
  }

  /**
   * Get file images/thumbnails
   */
  async getFileImages(
    fileKey: string,
    nodeIds: string[]
  ): Promise<Record<string, string>> {
    const nodeIdParam = nodeIds.join(",");
    const data = await this.makeRequest(
      `/images/${fileKey}?ids=${nodeIdParam}&format=png&scale=2`
    );
    return data.images || {};
  }

  /**
   * Extract frames from Figma file
   */
  extractFrames(document: FigmaDocument): FigmaFrame[] {
    const frames: FigmaFrame[] = [];

    const extractFromNode = (node: FigmaNode) => {
      if (node.type === "FRAME" || node.type === "COMPONENT") {
        frames.push({
          id: node.id,
          name: node.name,
          type: node.type,
          children: node.children,
          absoluteBoundingBox: node.absoluteBoundingBox,
          fills: node.fills,
          strokes: node.strokes,
          strokeWeight: node.strokeWeight,
          cornerRadius: node.cornerRadius,
        });
      }

      if (node.children) {
        node.children.forEach(extractFromNode);
      }
    };

    document.children.forEach(extractFromNode);
    return frames;
  }

  /**
   * Convert Figma frames to HTML wireframe
   */
  async convertFramesToWireframe(
    frames: FigmaFrame[],
    fileKey: string
  ): Promise<string> {
    try {
      // Get frame images
      const frameIds = frames.map((frame) => frame.id);
      const images = await this.getFileImages(fileKey, frameIds);

      let wireframeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Figma Import - Wireframe</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        .figma-import-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .figma-header {
            background: #1e1e1e;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .figma-frames {
            padding: 20px;
            display: grid;
            gap: 20px;
        }
        .figma-frame {
            border: 1px solid #e1e1e1;
            border-radius: 8px;
            overflow: hidden;
            background: white;
        }
        .frame-header {
            background: #f8f9fa;
            padding: 12px 16px;
            border-bottom: 1px solid #e1e1e1;
            font-weight: 600;
            color: #333;
        }
        .frame-content {
            padding: 16px;
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .frame-image {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
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
        .frame-info {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="figma-import-container">
        <div class="figma-header">
            <h1>🎨 Imported from Figma</h1>
            <p>Wireframe generated from Figma frames</p>
        </div>
        <div class="figma-frames">
`;

      // Add each frame
      frames.forEach((frame, index) => {
        const imageUrl = images[frame.id];
        const dimensions = frame.absoluteBoundingBox;

        wireframeHtml += `
            <div class="figma-frame">
                <div class="frame-header">
                    ${frame.name || `Frame ${index + 1}`}
                </div>
                <div class="frame-content">
                    ${
                      imageUrl
                        ? `<img src="${imageUrl}" alt="${frame.name}" class="frame-image" />`
                        : `<div class="frame-placeholder">
                         <p>Frame: ${frame.name}</p>
                         <p>Type: ${frame.type}</p>
                         ${
                           dimensions
                             ? `<p>Size: ${Math.round(
                                 dimensions.width
                               )} × ${Math.round(dimensions.height)}</p>`
                             : ""
                         }
                       </div>`
                    }
                    ${
                      dimensions
                        ? `<div class="frame-info">${Math.round(
                            dimensions.width
                          )} × ${Math.round(dimensions.height)}</div>`
                        : ""
                    }
                </div>
            </div>
        `;
      });

      wireframeHtml += `
        </div>
    </div>
</body>
</html>
`;

      return wireframeHtml;
    } catch (error) {
      console.error("Error converting frames to wireframe:", error);
      throw new Error("Failed to convert Figma frames to wireframe");
    }
  }

  /**
   * Parse Figma file URL to extract file key
   */
  parseFileUrl(url: string): string | null {
    const match = url.match(/figma\.com\/file\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }

  /**
   * Validate access token
   */
  async validateToken(): Promise<boolean> {
    try {
      await this.makeRequest("/me");
      return true;
    } catch {
      return false;
    }
  }
}

export const figmaApi = new FigmaApiService();
export default figmaApi;
