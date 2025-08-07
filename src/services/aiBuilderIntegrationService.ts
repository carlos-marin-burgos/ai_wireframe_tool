// Cross-platform type definitions
type ImageBuffer = ArrayBuffer | Uint8Array | string; // Base64 string or binary data
type DocumentBuffer = ArrayBuffer | Uint8Array | string; // Base64 string or binary data

// Mock AI Builder interface for development - replace with actual SDK when available
interface AIBuilder {
  objectDetection: {
    predict: (options: any) => Promise<any>;
    train: (options: any) => Promise<any>;
  };
  formProcessor: {
    predict: (options: any) => Promise<any>;
    train: (options: any) => Promise<any>;
  };
}

/**
 * AI Builder Integration Service for Wireframe Analysis
 * Connects Designetica with Power Platform AI Builder capabilities
 */
export class AIBuilderIntegrationService {
  private aiBuilder: AIBuilder;
  private objectDetectionModelId: string;
  private formProcessorModelId: string;
  private environment: string;

  constructor(apiKey: string, environment: string) {
    this.environment = environment;
    // Mock implementation - replace with actual AI Builder SDK initialization
    this.aiBuilder = {
      objectDetection: {
        predict: async (options) => this.mockObjectDetection(options),
        train: async (options) => this.mockTrainingProcess(options),
      },
      formProcessor: {
        predict: async (options) => this.mockFormProcessing(options),
        train: async (options) => this.mockTrainingProcess(options),
      },
    };

    // Model IDs will be set after training
    this.objectDetectionModelId =
      this.getEnvironmentVariable("AI_BUILDER_OBJECT_DETECTION_MODEL_ID") || "";
    this.formProcessorModelId =
      this.getEnvironmentVariable("AI_BUILDER_FORM_PROCESSOR_MODEL_ID") || "";
  }

  private getEnvironmentVariable(key: string): string | undefined {
    // Browser-safe environment variable access
    if (typeof window !== "undefined") {
      return (window as any).__env?.[key];
    }
    // Node.js environment (with safe access)
    return typeof globalThis !== "undefined" && "process" in globalThis
      ? (globalThis as any).process?.env?.[key]
      : undefined;
  }

  private async mockObjectDetection(options: any): Promise<any> {
    // Mock implementation for development/testing
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate processing time

    return {
      detections: [
        {
          label: "button",
          confidence: 0.92,
          boundingBox: { left: 50, top: 100, width: 120, height: 40 },
        },
        {
          label: "navigation_bar",
          confidence: 0.88,
          boundingBox: { left: 0, top: 0, width: 800, height: 60 },
        },
        {
          label: "hero_banner",
          confidence: 0.85,
          boundingBox: { left: 0, top: 60, width: 800, height: 200 },
        },
      ],
      processingTime: 1200,
    };
  }

  private async mockFormProcessing(options: any): Promise<any> {
    // Mock implementation for development/testing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      fields: [
        { fieldName: "title", value: "E-commerce Dashboard Wireframe" },
        { fieldName: "requirement_1", value: "User authentication system" },
        { fieldName: "requirement_2", value: "Product catalog display" },
        {
          fieldName: "story_1",
          value: "As a user, I want to browse products easily",
        },
      ],
      tables: [
        {
          tableName: "specifications",
          rows: [
            {
              cells: [
                { text: "Component" },
                { text: "Priority" },
                { text: "Status" },
              ],
            },
            {
              cells: [
                { text: "Login Form" },
                { text: "High" },
                { text: "Required" },
              ],
            },
          ],
        },
      ],
      confidence: 0.89,
      processingTime: 1500,
    };
  }

  private async mockTrainingProcess(options: any): Promise<any> {
    // Mock training process
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      modelId: `mock-model-${Date.now()}`,
      status: "training",
      estimatedMinutes: 30,
    };
  }

  /**
   * Detect wireframe components using AI Builder Object Detection
   */
  async detectWireframeComponents(
    imageBuffer: ImageBuffer
  ): Promise<ComponentDetectionResult> {
    try {
      const result = await this.aiBuilder.objectDetection.predict({
        modelId: this.objectDetectionModelId,
        image: imageBuffer,
        confidenceThreshold: 0.6,
      });

      // Map AI Builder results to our wireframe component schema
      const components = result.detections.map((detection) => ({
        type: this.mapDetectionToComponentType(detection.label),
        confidence: detection.confidence,
        boundingBox: {
          x: detection.boundingBox.left,
          y: detection.boundingBox.top,
          width: detection.boundingBox.width,
          height: detection.boundingBox.height,
        },
        properties: this.extractComponentProperties(detection),
        aiBuilderData: detection, // Keep original data for advanced analysis
      }));

      return {
        components,
        layout: this.analyzeLayout(components),
        designPatterns: this.identifyDesignPatterns(components),
        confidence: this.calculateOverallConfidence(result.detections),
        processingTime: result.processingTime,
        metadata: {
          aiBuilderModelId: this.objectDetectionModelId,
          totalDetections: result.detections.length,
          highConfidenceDetections: result.detections.filter(
            (d) => d.confidence > 0.8
          ).length,
        },
      };
    } catch (error) {
      console.error("AI Builder component detection failed:", error);
      throw new Error(`Component detection failed: ${error.message}`);
    }
  }

  /**
   * Process wireframe design documents with AI Builder Form Processor
   */
  async processWireframeDocument(
    documentBuffer: DocumentBuffer
  ): Promise<DocumentProcessingResult> {
    try {
      const result = await this.aiBuilder.formProcessor.predict({
        modelId: this.formProcessorModelId,
        document: documentBuffer,
      });

      const extractedData = {
        wireframeTitle:
          result.fields.find((f) => f.fieldName === "title")?.value || "",
        requirements: result.fields
          .filter((f) => f.fieldName.includes("requirement"))
          .map((f) => f.value),
        userStories: result.fields
          .filter((f) => f.fieldName.includes("story"))
          .map((f) => f.value),
        designNotes: result.fields
          .filter((f) => f.fieldName.includes("note"))
          .map((f) => f.value),
        specifications:
          result.tables?.map((table) => ({
            name: table.tableName,
            data: table.rows.map((row) => row.cells.map((cell) => cell.text)),
          })) || [],
      };

      return {
        extractedData,
        confidence: result.confidence,
        wireframeDescription:
          this.generateDescriptionFromDocument(extractedData),
        suggestedComponents: this.suggestComponentsFromRequirements(
          extractedData.requirements
        ),
        processingTime: result.processingTime,
      };
    } catch (error) {
      console.error("AI Builder document processing failed:", error);
      throw new Error(`Document processing failed: ${error.message}`);
    }
  }

  /**
   * Compare two wireframes for similarity using AI Builder
   */
  async compareWireframes(
    image1: ImageBuffer,
    image2: ImageBuffer
  ): Promise<WireframeComparisonResult> {
    try {
      // Detect components in both images
      const [components1, components2] = await Promise.all([
        this.detectWireframeComponents(image1),
        this.detectWireframeComponents(image2),
      ]);

      const similarity = {
        overall: this.calculateOverallSimilarity(components1, components2),
        layout: this.calculateLayoutSimilarity(
          components1.layout,
          components2.layout
        ),
        components: this.calculateComponentSimilarity(
          components1.components,
          components2.components
        ),
        styling: this.calculateStylingSimilarity(components1, components2),
      };

      const differences = this.identifyDifferences(components1, components2);
      const recommendations = this.generateImprovementRecommendations(
        differences,
        similarity
      );

      return {
        similarity,
        differences,
        recommendations,
        detailedAnalysis: {
          components1: components1.components.length,
          components2: components2.components.length,
          commonComponents: this.findCommonComponents(
            components1.components,
            components2.components
          ),
          uniqueToFirst: this.findUniqueComponents(
            components1.components,
            components2.components
          ),
          uniqueToSecond: this.findUniqueComponents(
            components2.components,
            components1.components
          ),
        },
      };
    } catch (error) {
      console.error("Wireframe comparison failed:", error);
      throw new Error(`Comparison failed: ${error.message}`);
    }
  }

  /**
   * Generate wireframe variations using AI Builder insights
   */
  async generateWireframeVariations(
    baseComponents: WireframeComponent[],
    variationTypes: VariationType[]
  ): Promise<WireframeVariation[]> {
    const variations: WireframeVariation[] = [];

    for (const type of variationTypes) {
      switch (type) {
        case "layout":
          variations.push(...this.generateLayoutVariations(baseComponents));
          break;
        case "color":
          variations.push(...this.generateColorVariations(baseComponents));
          break;
        case "responsive":
          variations.push(...this.generateResponsiveVariations(baseComponents));
          break;
        case "component":
          variations.push(...this.generateComponentVariations(baseComponents));
          break;
      }
    }

    return variations.slice(0, 10); // Limit to 10 variations
  }

  /**
   * Train custom AI Builder models with wireframe data
   */
  async trainWireframeModels(
    trainingData: TrainingDataSet
  ): Promise<ModelTrainingResult> {
    try {
      // Object Detection Model Training
      const objectDetectionTraining =
        await this.aiBuilder.objectDetection.train({
          name: "Wireframe Component Detector v2.0",
          description: "Detects UI components in wireframe images",
          domain: "general", // or 'retail' for e-commerce wireframes
          images: trainingData.componentImages.map((img) => ({
            imageData: img.buffer,
            annotations: img.components.map((comp) => ({
              label: comp.type,
              boundingBox: comp.boundingBox,
              confidence: 1.0,
            })),
          })),
          tags: [
            "button",
            "input",
            "navigation",
            "header",
            "footer",
            "card",
            "form",
            "sidebar",
            "hero",
            "grid",
            "list",
            "modal",
            "dropdown",
            "tabs",
          ],
        });

      // Form Processor Model Training
      const formProcessorTraining = await this.aiBuilder.formProcessor.train({
        name: "Wireframe Specification Processor v2.0",
        description:
          "Extracts requirements and specifications from design documents",
        documents: trainingData.specificationDocuments.map((doc) => ({
          documentData: doc.buffer,
          fields: doc.extractedFields,
          tables: doc.extractedTables,
        })),
      });

      return {
        objectDetectionModelId: objectDetectionTraining.modelId,
        formProcessorModelId: formProcessorTraining.modelId,
        trainingStatus: {
          objectDetection: objectDetectionTraining.status,
          formProcessor: formProcessorTraining.status,
        },
        estimatedCompletionTime: Math.max(
          objectDetectionTraining.estimatedMinutes,
          formProcessorTraining.estimatedMinutes
        ),
      };
    } catch (error) {
      console.error("Model training failed:", error);
      throw new Error(`Model training failed: ${error.message}`);
    }
  }

  // Private helper methods
  private mapDetectionToComponentType(aiBuilderLabel: string): ComponentType {
    const labelMap: Record<string, ComponentType> = {
      button: "button",
      text_input: "input",
      navigation_bar: "navigation",
      header_section: "header",
      footer_section: "footer",
      card_component: "card",
      form_container: "form",
      sidebar_menu: "sidebar",
      hero_banner: "hero",
      grid_layout: "grid",
      list_view: "list",
      modal_dialog: "modal",
      dropdown_menu: "dropdown",
      tab_navigation: "tabs",
    };

    return labelMap[aiBuilderLabel] || "unknown";
  }

  private analyzeLayout(components: WireframeComponent[]): LayoutAnalysis {
    // Analyze component positions to determine layout structure
    const topComponents = components.filter((c) => c.boundingBox.y < 100);
    const bottomComponents = components.filter((c) => c.boundingBox.y > 500);
    const leftComponents = components.filter((c) => c.boundingBox.x < 200);
    const rightComponents = components.filter((c) => c.boundingBox.x > 600);

    let layoutType = "unknown";
    let columns = 1;

    // Determine layout type based on component distribution
    if (leftComponents.length > 3 && rightComponents.length > 3) {
      layoutType = "three-column";
      columns = 3;
    } else if (leftComponents.length > 2 || rightComponents.length > 2) {
      layoutType = "two-column";
      columns = 2;
    } else {
      layoutType = "single-column";
      columns = 1;
    }

    return {
      type: layoutType,
      columns,
      sections: [
        ...topComponents.map((c) => `header-${c.type}`),
        ...components
          .filter((c) => c.boundingBox.y >= 100 && c.boundingBox.y <= 500)
          .map((c) => `main-${c.type}`),
        ...bottomComponents.map((c) => `footer-${c.type}`),
      ],
    };
  }

  private identifyDesignPatterns(
    components: WireframeComponent[]
  ): DesignPattern[] {
    const patterns: DesignPattern[] = [];

    // Check for common design patterns
    const hasNavigation = components.some((c) => c.type === "navigation");
    const hasHero = components.some((c) => c.type === "hero");
    const hasCards = components.filter((c) => c.type === "card").length >= 3;
    const hasSidebar = components.some((c) => c.type === "sidebar");
    const hasForm = components.some((c) => c.type === "form");

    if (hasNavigation && hasHero) {
      patterns.push({ name: "Landing Page", confidence: 0.9 });
    }
    if (hasCards) {
      patterns.push({ name: "Card Grid", confidence: 0.85 });
    }
    if (hasSidebar) {
      patterns.push({ name: "Sidebar Layout", confidence: 0.8 });
    }
    if (hasForm) {
      patterns.push({ name: "Form-focused", confidence: 0.75 });
    }

    return patterns;
  }

  private calculateOverallConfidence(detections: any[]): number {
    if (detections.length === 0) return 0;
    const sum = detections.reduce(
      (acc, detection) => acc + detection.confidence,
      0
    );
    return sum / detections.length;
  }

  private extractComponentProperties(detection: any): ComponentProperties {
    // Extract additional properties based on component type and AI Builder data
    return {
      size: this.calculateComponentSize(detection.boundingBox),
      position: {
        x: detection.boundingBox.left,
        y: detection.boundingBox.top,
      },
      estimatedContent: this.estimateContentFromSize(detection),
      suggestedStyling: this.suggestStylingFromContext(detection),
    };
  }

  private calculateComponentSize(
    boundingBox: any
  ): "small" | "medium" | "large" {
    const area = boundingBox.width * boundingBox.height;
    if (area < 5000) return "small";
    if (area < 20000) return "medium";
    return "large";
  }

  private generateDescriptionFromDocument(extractedData: any): string {
    let description = "";

    if (extractedData.wireframeTitle) {
      description += `Create a wireframe for "${extractedData.wireframeTitle}". `;
    }

    if (extractedData.requirements.length > 0) {
      description += `Requirements: ${extractedData.requirements.join(", ")}. `;
    }

    if (extractedData.userStories.length > 0) {
      description += `User stories: ${extractedData.userStories.join("; ")}. `;
    }

    return (
      description ||
      "Create a professional wireframe based on the provided document."
    );
  }

  // Additional helper methods would be implemented here...
  private suggestComponentsFromRequirements(requirements: string[]): string[] {
    // Analyze requirements text and suggest appropriate components
    const suggestions: string[] = [];

    requirements.forEach((req) => {
      const lowerReq = req.toLowerCase();
      if (lowerReq.includes("login") || lowerReq.includes("sign in")) {
        suggestions.push("login-form", "authentication-components");
      }
      if (lowerReq.includes("dashboard") || lowerReq.includes("analytics")) {
        suggestions.push(
          "dashboard-layout",
          "chart-components",
          "metric-cards"
        );
      }
      if (lowerReq.includes("navigation") || lowerReq.includes("menu")) {
        suggestions.push("navigation-bar", "sidebar-menu");
      }
      // Add more requirement-to-component mappings...
    });

    return [...new Set(suggestions)]; // Remove duplicates
  }

  private calculateOverallSimilarity(
    comp1: ComponentDetectionResult,
    comp2: ComponentDetectionResult
  ): number {
    // Implement sophisticated similarity calculation
    const layoutSim = this.calculateLayoutSimilarity(
      comp1.layout,
      comp2.layout
    );
    const componentSim = this.calculateComponentSimilarity(
      comp1.components,
      comp2.components
    );
    const patternSim = this.calculatePatternSimilarity(
      comp1.designPatterns,
      comp2.designPatterns
    );

    return layoutSim * 0.4 + componentSim * 0.4 + patternSim * 0.2;
  }

  private calculateLayoutSimilarity(
    layout1: LayoutAnalysis,
    layout2: LayoutAnalysis
  ): number {
    if (layout1.type === layout2.type && layout1.columns === layout2.columns) {
      return 0.9;
    } else if (layout1.columns === layout2.columns) {
      return 0.7;
    } else {
      return 0.3;
    }
  }

  private calculateComponentSimilarity(
    components1: WireframeComponent[],
    components2: WireframeComponent[]
  ): number {
    const types1 = components1.map((c) => c.type).sort();
    const types2 = components2.map((c) => c.type).sort();

    const commonTypes = types1.filter((type) => types2.includes(type));
    const totalTypes = new Set([...types1, ...types2]).size;

    return commonTypes.length / totalTypes;
  }

  private calculateStylingSimilarity(
    comp1: ComponentDetectionResult,
    comp2: ComponentDetectionResult
  ): number {
    // Compare design tokens and styling patterns
    return 0.75; // Placeholder implementation
  }

  private calculatePatternSimilarity(
    patterns1: DesignPattern[],
    patterns2: DesignPattern[]
  ): number {
    const names1 = patterns1.map((p) => p.name);
    const names2 = patterns2.map((p) => p.name);
    const commonPatterns = names1.filter((name) => names2.includes(name));
    const totalPatterns = new Set([...names1, ...names2]).size;

    return totalPatterns > 0 ? commonPatterns.length / totalPatterns : 0;
  }

  private identifyDifferences(
    comp1: ComponentDetectionResult,
    comp2: ComponentDetectionResult
  ): Difference[] {
    const differences: Difference[] = [];

    // Compare layouts
    if (comp1.layout.type !== comp2.layout.type) {
      differences.push({
        type: "layout",
        description: `Layout type differs: ${comp1.layout.type} vs ${comp2.layout.type}`,
        severity: "medium",
      });
    }

    // Compare component counts
    const comp1Types = comp1.components.map((c) => c.type);
    const comp2Types = comp2.components.map((c) => c.type);

    comp1Types.forEach((type) => {
      const count1 = comp1Types.filter((t) => t === type).length;
      const count2 = comp2Types.filter((t) => t === type).length;

      if (count1 !== count2) {
        differences.push({
          type: "component",
          description: `${type} count differs: ${count1} vs ${count2}`,
          severity: Math.abs(count1 - count2) > 2 ? "high" : "low",
        });
      }
    });

    return differences;
  }

  private generateImprovementRecommendations(
    differences: Difference[],
    similarity: any
  ): string[] {
    const recommendations: string[] = [];

    if (similarity.overall < 0.7) {
      recommendations.push(
        "Consider aligning the overall structure and component placement"
      );
    }

    if (similarity.layout < 0.8) {
      recommendations.push(
        "Review layout structure - consider using similar column arrangements"
      );
    }

    if (similarity.components < 0.6) {
      recommendations.push(
        "Add missing components or remove excess components for better alignment"
      );
    }

    differences.forEach((diff) => {
      if (diff.severity === "high") {
        recommendations.push(
          `High priority: Address ${diff.type} difference - ${diff.description}`
        );
      }
    });

    return recommendations;
  }

  private findCommonComponents(
    components1: WireframeComponent[],
    components2: WireframeComponent[]
  ): WireframeComponent[] {
    return components1.filter((c1) =>
      components2.some((c2) => c2.type === c1.type)
    );
  }

  private findUniqueComponents(
    components1: WireframeComponent[],
    components2: WireframeComponent[]
  ): WireframeComponent[] {
    return components1.filter(
      (c1) => !components2.some((c2) => c2.type === c1.type)
    );
  }

  private generateLayoutVariations(
    components: WireframeComponent[]
  ): WireframeVariation[] {
    // Generate different layout arrangements
    return [
      {
        id: "layout-grid",
        description: "Grid-based layout variation",
        variationType: "layout",
        components: this.rearrangeInGrid(components),
        previewUrl: "/api/preview/layout-grid",
      },
      {
        id: "layout-sidebar",
        description: "Sidebar layout variation",
        variationType: "layout",
        components: this.rearrangeWithSidebar(components),
        previewUrl: "/api/preview/layout-sidebar",
      },
    ];
  }

  private generateColorVariations(
    components: WireframeComponent[]
  ): WireframeVariation[] {
    return [
      {
        id: "color-dark",
        description: "Dark theme variation",
        variationType: "color",
        components: this.applyDarkTheme(components),
        previewUrl: "/api/preview/color-dark",
      },
      {
        id: "color-branded",
        description: "Brand color variation",
        variationType: "color",
        components: this.applyBrandColors(components),
        previewUrl: "/api/preview/color-branded",
      },
    ];
  }

  private generateResponsiveVariations(
    components: WireframeComponent[]
  ): WireframeVariation[] {
    return [
      {
        id: "responsive-mobile",
        description: "Mobile-optimized layout",
        variationType: "responsive",
        components: this.optimizeForMobile(components),
        previewUrl: "/api/preview/responsive-mobile",
      },
      {
        id: "responsive-tablet",
        description: "Tablet-optimized layout",
        variationType: "responsive",
        components: this.optimizeForTablet(components),
        previewUrl: "/api/preview/responsive-tablet",
      },
    ];
  }

  private generateComponentVariations(
    components: WireframeComponent[]
  ): WireframeVariation[] {
    return [
      {
        id: "component-enhanced",
        description: "Enhanced component styling",
        variationType: "component",
        components: this.enhanceComponents(components),
        previewUrl: "/api/preview/component-enhanced",
      },
    ];
  }

  // Placeholder implementations for layout transformation methods
  private rearrangeInGrid(
    components: WireframeComponent[]
  ): WireframeComponent[] {
    // Implement grid-based rearrangement logic
    return components.map((component) => ({
      ...component,
      properties: {
        ...component.properties,
        layout: "grid",
      },
    }));
  }

  private rearrangeWithSidebar(
    components: WireframeComponent[]
  ): WireframeComponent[] {
    // Implement sidebar layout logic
    return components;
  }

  private applyDarkTheme(
    components: WireframeComponent[]
  ): WireframeComponent[] {
    // Apply dark theme styling
    return components;
  }

  private applyBrandColors(
    components: WireframeComponent[]
  ): WireframeComponent[] {
    // Apply brand color scheme
    return components;
  }

  private optimizeForMobile(
    components: WireframeComponent[]
  ): WireframeComponent[] {
    // Optimize layout for mobile devices
    return components;
  }

  private optimizeForTablet(
    components: WireframeComponent[]
  ): WireframeComponent[] {
    // Optimize layout for tablet devices
    return components;
  }

  private enhanceComponents(
    components: WireframeComponent[]
  ): WireframeComponent[] {
    // Enhance component styling and functionality
    return components;
  }

  private estimateContentFromSize(detection: any): string {
    // Estimate content type based on component size and position
    return "estimated-content";
  }

  private suggestStylingFromContext(detection: any): Record<string, any> {
    // Suggest styling based on component context
    return {};
  }
}

// Type definitions
export interface ComponentDetectionResult {
  components: WireframeComponent[];
  layout: LayoutAnalysis;
  designPatterns: DesignPattern[];
  confidence: number;
  processingTime: number;
  metadata: Record<string, any>;
}

export interface WireframeComponent {
  type: ComponentType;
  confidence: number;
  boundingBox: BoundingBox;
  properties: ComponentProperties;
  aiBuilderData?: any;
}

export interface LayoutAnalysis {
  type: string;
  columns: number;
  sections: string[];
}

export interface DesignPattern {
  name: string;
  confidence: number;
}

export interface ComponentProperties {
  size: "small" | "medium" | "large";
  position: { x: number; y: number };
  estimatedContent: string;
  suggestedStyling: Record<string, any>;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ComponentType =
  | "button"
  | "input"
  | "navigation"
  | "header"
  | "footer"
  | "card"
  | "form"
  | "sidebar"
  | "hero"
  | "grid"
  | "list"
  | "modal"
  | "dropdown"
  | "tabs"
  | "unknown";

export interface DocumentProcessingResult {
  extractedData: any;
  confidence: number;
  wireframeDescription: string;
  suggestedComponents: string[];
  processingTime: number;
}

export interface WireframeComparisonResult {
  similarity: {
    overall: number;
    layout: number;
    components: number;
    styling: number;
  };
  differences: Difference[];
  recommendations: string[];
  detailedAnalysis: any;
}

export interface Difference {
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export type VariationType = "layout" | "color" | "responsive" | "component";

export interface WireframeVariation {
  id: string;
  description: string;
  variationType: VariationType;
  components: WireframeComponent[];
  previewUrl: string;
  html?: string;
}

export interface TrainingDataSet {
  componentImages: Array<{
    buffer: ImageBuffer;
    components: Array<{
      type: string;
      boundingBox: BoundingBox;
    }>;
  }>;
  specificationDocuments: Array<{
    buffer: DocumentBuffer;
    extractedFields: any[];
    extractedTables: any[];
  }>;
}

export interface ModelTrainingResult {
  objectDetectionModelId: string;
  formProcessorModelId: string;
  trainingStatus: {
    objectDetection: string;
    formProcessor: string;
  };
  estimatedCompletionTime: number;
}
