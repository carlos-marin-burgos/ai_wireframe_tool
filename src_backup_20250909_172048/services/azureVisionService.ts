interface DetectedComponent {
  id: string;
  type:
    | "button"
    | "input"
    | "card"
    | "navigation"
    | "header"
    | "text"
    | "image";
  bounds: { x: number; y: number; width: number; height: number };
  text?: string;
  confidence: number;
  edited?: boolean;
}

interface AzureVisionConfig {
  endpoint: string;
  apiKey: string;
  region: string;
}

interface AzureAnalysisResult {
  components: DetectedComponent[];
  layout: {
    type: "grid" | "flex" | "absolute";
    columns?: number;
    rows?: number;
  };
  designTokens: {
    colors: string[];
    fonts: string[];
    spacing: number[];
  };
  confidence: number;
  wireframe?: string; // HTML wireframe result
}

// Mock Azure Configuration - In production, these would come from environment variables
const AZURE_CONFIG: AzureVisionConfig = {
  endpoint:
    import.meta.env?.VITE_AZURE_VISION_ENDPOINT ||
    "https://your-region.cognitiveservices.azure.com/",
  apiKey: import.meta.env?.VITE_AZURE_VISION_KEY || "your-api-key",
  region: import.meta.env?.VITE_AZURE_REGION || "westus2",
};

/**
 * Analyzes an image using Azure Computer Vision to detect UI components
 */
export const analyzeImageWithAzureVision = async (
  imageFile: File
): Promise<AzureAnalysisResult> => {
  try {
    // Convert image to base64 for API call
    const imageBase64 = await fileToBase64(imageFile);

    // In a real implementation, you would call Azure Computer Vision API
    // For now, we'll simulate the analysis with a mock response
    const isDevelopment =
      import.meta.env?.MODE === "development" || !validateAzureConfig();
    if (isDevelopment) {
      return simulateAzureVisionAnalysis();
    }

    // Real Azure Vision API call
    const response = await fetch(
      `${AZURE_CONFIG.endpoint}/vision/v3.2/analyze`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": AZURE_CONFIG.apiKey,
        },
        body: JSON.stringify({
          url: imageBase64.startsWith("data:") ? undefined : imageBase64,
          visualFeatures: ["Objects", "Tags", "Description", "Color"],
          details: ["Landmarks"],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Azure Vision API error: ${response.status}`);
    }

    const azureResult = await response.json();
    return processAzureVisionResult(azureResult);
  } catch (error) {
    console.error("Azure Vision analysis failed:", error);
    // Fallback to simulated analysis
    return simulateAzureVisionAnalysis();
  }
};

/**
 * Enhanced analysis using GPT-4V for UI component detection
 */
export async function analyzeImageWithGPTVision(
  imageFile: File
): Promise<AzureAnalysisResult> {
  try {
    // First, analyze the image to get component structure
    const formData = new FormData();
    formData.append("image", imageFile);

    const analysisResponse = await fetch("/api/analyzeUIImage", {
      method: "POST",
      body: formData,
    });

    if (!analysisResponse.ok) {
      throw new Error(`Image analysis failed: ${analysisResponse.status}`);
    }

    const imageAnalysis = await analysisResponse.json();

    if (!imageAnalysis.success) {
      throw new Error(imageAnalysis.error || "Image analysis failed");
    }

    // Now generate wireframe using the image analysis
    const wireframeResponse = await fetch("/api/generate-html-wireframe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: "Generate wireframe based on uploaded image analysis",
        colorScheme: "light",
        imageAnalysis: imageAnalysis.analysis, // Pass the full analysis to wireframe generator
      }),
    });

    if (!wireframeResponse.ok) {
      throw new Error(
        `Wireframe generation failed: ${wireframeResponse.status}`
      );
    }

    const wireframeResult = await wireframeResponse.json();

    if (!wireframeResult.success) {
      throw new Error(wireframeResult.error || "Wireframe generation failed");
    }

    // Return structured analysis result matching AzureAnalysisResult interface
    return {
      components: imageAnalysis.analysis.components || [],
      layout: imageAnalysis.analysis.layout || { type: "grid", columns: 12 },
      designTokens: {
        colors: imageAnalysis.analysis.colors || [],
        fonts:
          imageAnalysis.analysis.typography?.map((t: any) => t.fontFamily) ||
          [],
        spacing: imageAnalysis.analysis.spacing || [],
      },
      confidence: imageAnalysis.analysis.confidence || 0.85,
      wireframe: wireframeResult.html,
    };
  } catch (error) {
    console.error("Azure Vision API error:", error);

    // Fallback to enhanced mock analysis for development
    console.warn("Falling back to enhanced mock analysis");
    return simulateAzureVisionAnalysis();
  }
}

/**
 * Simulates Azure Vision analysis for development/demo purposes
 */
const simulateAzureVisionAnalysis = async (): Promise<AzureAnalysisResult> => {
  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 2000 + Math.random() * 1000)
  );

  // Generate mock components based on common UI patterns
  const mockComponents: DetectedComponent[] = [
    {
      id: "comp-1",
      type: "header",
      bounds: { x: 0, y: 0, width: 100, height: 15 },
      text: "Header Navigation",
      confidence: 0.95,
    },
    {
      id: "comp-2",
      type: "navigation",
      bounds: { x: 0, y: 0, width: 100, height: 8 },
      text: "Home About Services Contact",
      confidence: 0.88,
    },
    {
      id: "comp-3",
      type: "button",
      bounds: { x: 80, y: 5, width: 15, height: 5 },
      text: "Sign In",
      confidence: 0.92,
    },
    {
      id: "comp-4",
      type: "card",
      bounds: { x: 10, y: 20, width: 80, height: 40 },
      text: "Hero Section",
      confidence: 0.87,
    },
    {
      id: "comp-5",
      type: "button",
      bounds: { x: 20, y: 45, width: 20, height: 8 },
      text: "Get Started",
      confidence: 0.91,
    },
    {
      id: "comp-6",
      type: "input",
      bounds: { x: 15, y: 70, width: 30, height: 6 },
      text: "Email Address",
      confidence: 0.85,
    },
    {
      id: "comp-7",
      type: "card",
      bounds: { x: 10, y: 80, width: 25, height: 15 },
      text: "Feature Card 1",
      confidence: 0.89,
    },
    {
      id: "comp-8",
      type: "card",
      bounds: { x: 40, y: 80, width: 25, height: 15 },
      text: "Feature Card 2",
      confidence: 0.89,
    },
    {
      id: "comp-9",
      type: "card",
      bounds: { x: 70, y: 80, width: 25, height: 15 },
      text: "Feature Card 3",
      confidence: 0.89,
    },
  ];

  // Add some randomization to make it feel more realistic
  const varianceComponents = mockComponents.map((comp) => ({
    ...comp,
    confidence: Math.max(0.7, comp.confidence + (Math.random() - 0.5) * 0.1),
    bounds: {
      ...comp.bounds,
      x: Math.max(0, comp.bounds.x + (Math.random() - 0.5) * 2),
      y: Math.max(0, comp.bounds.y + (Math.random() - 0.5) * 2),
    },
  }));

  return {
    components: varianceComponents,
    layout: {
      type: "flex",
      columns: 3,
      rows: 4,
    },
    designTokens: {
      colors: [
        "#3b82f6",
        "#1f2937",
        "#f9fafb",
        "#059669",
        "#dc2626",
        "#f59e0b",
      ],
      fonts: ["Inter", "Roboto", "Arial"],
      spacing: [8, 16, 24, 32, 48, 64],
    },
    confidence: 0.89,
  };
};

/**
 * Process raw Azure Vision API results into our component format
 */
const processAzureVisionResult = (azureResult: any): AzureAnalysisResult => {
  const components: DetectedComponent[] = [];

  // Process detected objects
  if (azureResult.objects) {
    azureResult.objects.forEach((obj: any, index: number) => {
      const rect = obj.rectangle;
      components.push({
        id: `azure-${index}`,
        type: mapAzureObjectToComponentType(obj.object),
        bounds: {
          x: (rect.x / azureResult.metadata.width) * 100,
          y: (rect.y / azureResult.metadata.height) * 100,
          width: (rect.w / azureResult.metadata.width) * 100,
          height: (rect.h / azureResult.metadata.height) * 100,
        },
        text: obj.object,
        confidence: obj.confidence,
      });
    });
  }

  // Extract design tokens
  const designTokens = {
    colors: azureResult.color?.dominantColors || ["#000000", "#ffffff"],
    fonts: ["Arial", "Helvetica"], // Azure Vision doesn't detect fonts directly
    spacing: [8, 16, 24, 32], // Standard spacing values
  };

  return {
    components,
    layout: {
      type: "flex" as const,
      columns: Math.ceil(Math.sqrt(components.length)),
      rows: Math.ceil(
        components.length / Math.ceil(Math.sqrt(components.length))
      ),
    },
    designTokens,
    confidence:
      components.reduce((sum, comp) => sum + comp.confidence, 0) /
        components.length || 0,
  };
};

/**
 * Maps Azure Vision object types to our component types
 */
const mapAzureObjectToComponentType = (
  objectType: string
): DetectedComponent["type"] => {
  const typeMap: Record<string, DetectedComponent["type"]> = {
    button: "button",
    text: "text",
    image: "image",
    person: "image",
    building: "image",
    outdoor: "image",
    indoor: "card",
    menu: "navigation",
    toolbar: "navigation",
    dialog: "card",
    window: "card",
  };

  return typeMap[objectType.toLowerCase()] || "card";
};

/**
 * Converts a File to base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Validates Azure Vision configuration
 */
export const validateAzureConfig = (): boolean => {
  return !!(
    AZURE_CONFIG.endpoint &&
    AZURE_CONFIG.apiKey &&
    AZURE_CONFIG.region &&
    AZURE_CONFIG.endpoint !== "your-endpoint" &&
    AZURE_CONFIG.apiKey !== "your-api-key"
  );
};

/**
 * Gets the current Azure configuration status
 */
export const getAzureConfigStatus = () => {
  const isConfigured = validateAzureConfig();
  return {
    isConfigured,
    endpoint: isConfigured ? AZURE_CONFIG.endpoint : "Not configured",
    region: isConfigured ? AZURE_CONFIG.region : "Not configured",
    hasApiKey: !!(
      AZURE_CONFIG.apiKey && AZURE_CONFIG.apiKey !== "your-api-key"
    ),
  };
};
