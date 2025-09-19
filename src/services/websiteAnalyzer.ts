import { API_CONFIG, getApiUrl } from "../config/api";

interface WebsiteAnalysis {
  url: string;
  pageInfo: {
    title: string;
    description: string;
    url: string;
  };
  layout: {
    header?: {
      selector: string;
      text: string;
      height: string | number;
      hasNav: boolean;
    };
    navigation?: {
      selector: string;
      links: string[];
      isHorizontal: boolean;
    };
    main?: {
      selector: string;
      hasColumns: boolean;
      sections: number;
    };
    sidebar?: {
      selector: string;
      position: "left" | "right";
      width: string | number;
    };
    footer?: {
      selector: string;
      text: string;
      hasColumns: boolean;
    };
    sections: Array<{
      tag: string;
      classes: string;
      text: string;
      hasImages: boolean;
      hasButtons: boolean;
    }>;
    components: any[];
  };
  styling: {
    primaryColors: string[];
    fonts: string[];
    layout: string;
    components: Array<{
      name: string;
      count: number;
    }>;
  };
  screenshot: string;
  wireframePrompt: string;
  analyzedAt: string;
}

interface AnalysisOptions {
  timeout?: number;
  viewport?: {
    width: number;
    height: number;
  };
  fullPageScreenshot?: boolean;
}

class WebsiteAnalyzer {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getApiUrl("/api");
  }

  /**
   * Analyze a website URL and extract structure, layout, and styling information
   */
  async analyzeWebsite(
    url: string,
    options: AnalysisOptions = {}
  ): Promise<WebsiteAnalysis> {
    console.log(`🔍 Starting website analysis for: ${url}`);

    try {
      // Validate URL format
      const urlObj = new URL(url);
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        throw new Error("URL must use HTTP or HTTPS protocol");
      }

      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.WEBSITE_ANALYZER),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      console.log(`✅ Website analysis completed for: ${url}`);
      console.log(
        `📋 Found ${data.analysis.layout.sections.length} sections, ${data.analysis.styling.components.length} components`
      );

      return data.analysis;
    } catch (error) {
      console.error("❌ Website analysis failed:", error);
      throw error;
    }
  }

  /**
   * Check if a string contains a URL
   */
  static isUrlPresent(text: string): boolean {
    const urlPattern =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    return urlPattern.test(text);
  }

  /**
   * Extract URLs from text
   */
  static extractUrls(text: string): string[] {
    const urlPattern =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    return text.match(urlPattern) || [];
  }

  /**
   * Generate an enhanced wireframe prompt based on website analysis
   */
  static generateEnhancedPrompt(
    originalPrompt: string,
    analysis: WebsiteAnalysis
  ): string {
    console.log(
      "🎯 Generating enhanced wireframe prompt with website analysis"
    );

    let enhancedPrompt = `${originalPrompt}\n\n`;
    enhancedPrompt += `=== WEBSITE ANALYSIS DATA ===\n`;
    enhancedPrompt += `Analyzed URL: ${analysis.url}\n`;
    enhancedPrompt += `Page Title: ${analysis.pageInfo.title}\n\n`;

    enhancedPrompt += analysis.wireframePrompt;

    enhancedPrompt += `\n\n=== REQUIREMENTS ===\n`;
    enhancedPrompt += `- Match the exact layout structure from the analyzed website\n`;
    enhancedPrompt += `- Use similar navigation patterns and content hierarchy\n`;
    enhancedPrompt += `- Include all major sections and components found in the analysis\n`;
    enhancedPrompt += `- Apply Microsoft Design System styling while maintaining the original layout\n`;
    enhancedPrompt += `- Ensure responsive design that works on desktop and mobile\n`;
    enhancedPrompt += `- Use semantic HTML and proper accessibility attributes\n`;

    return enhancedPrompt;
  }

  /**
   * Create a comparison view between original and generated wireframe
   */
  static createComparisonHtml(
    analysis: WebsiteAnalysis,
    generatedWireframe: string
  ): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Analysis Comparison - ${analysis.pageInfo.title}</title>
    <style>
        body {
            margin: 0;
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: #f5f5f5;
        }
        .comparison-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            height: 100vh;
        }
        .comparison-panel {
            padding: 20px;
            overflow: auto;
        }
        .original-panel {
            background: #ffffff;
            border-right: 2px solid #e5e7eb;
        }
        .wireframe-panel {
            background: #fafafa;
        }
        .panel-header {
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
        }
        .panel-title {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin: 0 0 5px 0;
        }
        .panel-subtitle {
            font-size: 14px;
            color: #6b7280;
            margin: 0;
        }
        .original-screenshot {
            max-width: 100%;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .wireframe-content {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: white;
            min-height: 500px;
        }
        .analysis-summary {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 20px;
        }
        .analysis-item {
            font-size: 14px;
            margin-bottom: 5px;
        }
        .analysis-label {
            font-weight: 600;
            color: #0369a1;
        }
        @media (max-width: 768px) {
            .comparison-container {
                grid-template-columns: 1fr;
                grid-template-rows: 50vh 50vh;
            }
        }
    </style>
</head>
<body>
    <div class="comparison-container">
        <div class="comparison-panel original-panel">
            <div class="panel-header">
                <h2 class="panel-title">Original Website</h2>
                <p class="panel-subtitle">${analysis.url}</p>
            </div>
            
            <div class="analysis-summary">
                <div class="analysis-item">
                    <span class="analysis-label">Title:</span> ${
                      analysis.pageInfo.title
                    }
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">Sections Found:</span> ${
                      analysis.layout.sections.length
                    }
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">Components:</span> ${analysis.styling.components
                      .map((c) => c.name)
                      .join(", ")}
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">Layout Type:</span> ${
                      analysis.styling.layout
                    }
                </div>
            </div>
            
            <img src="${
              analysis.screenshot
            }" alt="Original website screenshot" class="original-screenshot" />
        </div>
        
        <div class="comparison-panel wireframe-panel">
            <div class="panel-header">
                <h2 class="panel-title">Generated Wireframe</h2>
                <p class="panel-subtitle">Based on website analysis</p>
            </div>
            
            <div class="wireframe-content">
                ${generatedWireframe}
            </div>
        </div>
    </div>
</body>
</html>`;
  }
}

export { WebsiteAnalyzer, type WebsiteAnalysis, type AnalysisOptions };
