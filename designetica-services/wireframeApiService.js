/**
 * Wireframe API Integration Service
 * Connects component-driven wireframe generation to the backend API
 */

const ComponentDrivenWireframeGenerator = require("./componentDrivenWireframeGenerator");
const FigmaService = require("./figmaService");

class WireframeApiService {
  constructor() {
    this.wireframeGenerator = new ComponentDrivenWireframeGenerator();
    this.figmaService = new FigmaService();
    this.initialized = false;
  }

  /**
   * Initialize the service
   */
  async initialize() {
    if (!this.initialized) {
      await this.wireframeGenerator.init();

      // Make Figma service accessible to wireframe generator
      this.wireframeGenerator.figmaService = this.figmaService;

      this.initialized = true;
      console.log(
        "✅ Wireframe API Service initialized with Figma integration"
      );
    }
  }

  /**
   * Generate wireframe endpoint handler
   */
  async generateWireframe(req, res) {
    try {
      await this.initialize();

      const {
        description,
        designTheme = "modern",
        colorScheme = "primary",
        useComponents = true,
      } = req.body;

      console.log("🎨 Generating component-driven wireframe:", {
        description,
        designTheme,
        colorScheme,
      });

      if (!description) {
        return res.status(400).json({
          error: "Description is required",
          code: "MISSING_DESCRIPTION",
        });
      }

      // Generate wireframe using detected components
      const result = await this.wireframeGenerator.generateWireframe(
        description,
        {
          theme: designTheme,
          colorScheme: colorScheme,
        }
      );

      // Get component statistics for response
      const componentStats = this.wireframeGenerator.getComponentStatistics();

      res.json({
        html: result.html,
        components: result.components.map((c) => ({
          name: c.name,
          type: c.type,
          complexity: c.complexity,
        })),
        metadata: {
          ...result.metadata,
          componentStats,
          generationMethod: "component-driven",
          description,
          designTheme,
          colorScheme,
        },
        success: true,
      });
    } catch (error) {
      console.error("❌ Failed to generate component-driven wireframe:", error);
      res.status(500).json({
        error: "Failed to generate wireframe",
        details: error.message,
        success: false,
      });
    }
  }

  /**
   * Get available components endpoint
   */
  async getAvailableComponents(req, res) {
    try {
      await this.initialize();

      const componentTypes =
        this.wireframeGenerator.getAvailableComponentTypes();
      const componentStats = this.wireframeGenerator.getComponentStatistics();

      res.json({
        availableTypes: componentTypes,
        statistics: componentStats,
        totalComponents: componentStats.total,
        success: true,
      });
    } catch (error) {
      console.error("❌ Failed to get available components:", error);
      res.status(500).json({
        error: "Failed to retrieve components",
        details: error.message,
        success: false,
      });
    }
  }

  /**
   * Generate component preview endpoint
   */
  async generateComponentPreview(req, res) {
    try {
      await this.initialize();

      const { componentType, variant = "default", props = {} } = req.body;

      if (!componentType) {
        return res.status(400).json({
          error: "Component type is required",
          code: "MISSING_COMPONENT_TYPE",
        });
      }

      // Find component in library
      const component = Array.from(
        this.wireframeGenerator.componentLibrary.values()
      ).find((c) => c.type === componentType);

      if (!component) {
        return res.status(404).json({
          error: "Component type not found",
          availableTypes: this.wireframeGenerator.getAvailableComponentTypes(),
          code: "COMPONENT_NOT_FOUND",
        });
      }

      // Generate preview HTML
      const previewHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${componentType} Preview</title>
    ${this.wireframeGenerator.getWireframeStyles()}
    <style>
      body { padding: 40px; background: #f8f9fa; }
      .preview-container { 
        background: white; 
        padding: 40px; 
        border-radius: 8px; 
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        max-width: 600px;
        margin: 0 auto;
      }
      .preview-title { 
        margin-bottom: 24px; 
        color: #3C4858; 
        border-bottom: 1px solid #e1e5e9; 
        padding-bottom: 16px; 
      }
    </style>
</head>
<body>
    <div class="preview-container">
        <h2 class="preview-title">${componentType} Component Preview</h2>
        ${component.htmlTemplate(props)}
    </div>
</body>
</html>
      `;

      res.json({
        html: previewHtml,
        component: {
          name: component.name,
          type: component.type,
          complexity: component.complexity,
          variants: component.variants,
        },
        success: true,
      });
    } catch (error) {
      console.error("❌ Failed to generate component preview:", error);
      res.status(500).json({
        error: "Failed to generate component preview",
        details: error.message,
        success: false,
      });
    }
  }

  /**
   * Enhanced wireframe generation with fallback
   */
  async generateEnhancedWireframe(req, res) {
    try {
      await this.initialize();

      const {
        description,
        designTheme,
        colorScheme,
        fallbackToOriginal = true,
      } = req.body;

      // Try component-driven generation first
      try {
        const result = await this.wireframeGenerator.generateWireframe(
          description,
          {
            theme: designTheme,
            colorScheme: colorScheme,
          }
        );

        res.json({
          html: result.html,
          metadata: {
            ...result.metadata,
            generationMethod: "component-driven",
            fallbackUsed: false,
          },
          success: true,
        });
      } catch (componentError) {
        console.warn(
          "⚠️ Component-driven generation failed, using fallback:",
          componentError.message
        );

        if (fallbackToOriginal) {
          // Import and use your existing fallback system
          const {
            createFallbackWireframe,
          } = require("../backend/fallback-generator");
          const fallbackHtml = createFallbackWireframe(
            description,
            designTheme,
            colorScheme
          );

          res.json({
            html: fallbackHtml,
            metadata: {
              generatedAt: new Date().toISOString(),
              generationMethod: "fallback",
              fallbackUsed: true,
              originalError: componentError.message,
            },
            success: true,
          });
        } else {
          throw componentError;
        }
      }
    } catch (error) {
      console.error("❌ Enhanced wireframe generation failed:", error);
      res.status(500).json({
        error: "Failed to generate wireframe",
        details: error.message,
        success: false,
      });
    }
  }

  /**
   * Get wireframe templates endpoint
   */
  async getWireframeTemplates(req, res) {
    try {
      await this.initialize();

      const templates = [];
      for (const [templateName, template] of this.wireframeGenerator
        .wireframeTemplates) {
        templates.push({
          name: templateName,
          components: template.components,
          layout: template.layout,
          description: this.getTemplateDescription(templateName),
        });
      }

      res.json({
        templates,
        count: templates.length,
        success: true,
      });
    } catch (error) {
      console.error("❌ Failed to get wireframe templates:", error);
      res.status(500).json({
        error: "Failed to retrieve templates",
        details: error.message,
        success: false,
      });
    }
  }

  /**
   * Get template description
   */
  getTemplateDescription(templateName) {
    const descriptions = {
      landing: "Landing page with hero section, features, and call-to-action",
      dashboard: "Admin dashboard with sidebar navigation, metrics, and charts",
      form: "Centered form layout with validation and actions",
      modal: "Modal dialog with header, content, and action buttons",
    };
    return descriptions[templateName] || "Custom template";
  }

  /**
   * Setup Express routes
   */
  setupRoutes(app) {
    // Main wireframe generation endpoint
    app.post("/api/generate-component-wireframe", (req, res) =>
      this.generateWireframe(req, res)
    );

    // Enhanced wireframe with fallback
    app.post("/api/generate-enhanced-wireframe", (req, res) =>
      this.generateEnhancedWireframe(req, res)
    );

    // Component information endpoints
    app.get("/api/available-components", (req, res) =>
      this.getAvailableComponents(req, res)
    );
    app.post("/api/component-preview", (req, res) =>
      this.generateComponentPreview(req, res)
    );

    // Template information
    app.get("/api/wireframe-templates", (req, res) =>
      this.getWireframeTemplates(req, res)
    );

    console.log("✅ Wireframe API routes registered");
  }
}

module.exports = WireframeApiService;
