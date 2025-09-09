/**
 * Backend Integration Example
 * Shows how to integrate component-driven wireframe generation into your existing backend
 */

const express = require("express");
const path = require("path");
const WireframeApiService = require("./wireframeApiService");

// Initialize the wireframe API service
const wireframeApi = new WireframeApiService();

/**
 * Example integration with your existing backend
 * Add this to your backend/simple-server.cjs
 */
function integrateWithBackend(app) {
  console.log("🔌 Integrating component-driven wireframe generation...");

  // Enhanced wireframe generation endpoint
  app.post("/api/generate-wireframe-enhanced", async (req, res) => {
    try {
      const {
        description,
        designTheme = "modern",
        colorScheme = "primary",
      } = req.body;

      console.log("🎨 Enhanced wireframe request:", {
        description,
        designTheme,
        colorScheme,
      });

      // Initialize services if not already done
      await wireframeApi.initialize();

      // Try component-driven generation first
      const wireframeRequest = {
        body: {
          description,
          designTheme,
          colorScheme,
          fallbackToOriginal: true,
        },
      };

      // Mock response object
      let responseData = null;
      const mockRes = {
        json: (data) => {
          responseData = data;
        },
        status: (code) => ({
          json: (data) => {
            responseData = { ...data, statusCode: code };
          },
        }),
      };

      // Generate wireframe
      await wireframeApi.generateEnhancedWireframe(wireframeRequest, mockRes);

      if (responseData && responseData.success) {
        res.json(responseData);
      } else {
        throw new Error(responseData?.details || "Unknown error");
      }
    } catch (error) {
      console.error("❌ Enhanced wireframe generation failed:", error);
      res.status(500).json({
        error: "Failed to generate enhanced wireframe",
        details: error.message,
        success: false,
      });
    }
  });

  // Component library information endpoint
  app.get("/api/component-library", async (req, res) => {
    try {
      await wireframeApi.initialize();

      const mockReq = { body: {} };
      let responseData = null;
      const mockRes = {
        json: (data) => {
          responseData = data;
        },
      };

      await wireframeApi.getAvailableComponents(mockReq, mockRes);
      res.json(responseData);
    } catch (error) {
      console.error("❌ Failed to get component library:", error);
      res.status(500).json({
        error: "Failed to retrieve component library",
        details: error.message,
      });
    }
  });

  // Component preview endpoint
  app.post("/api/component-preview", async (req, res) => {
    try {
      await wireframeApi.initialize();

      let responseData = null;
      const mockRes = {
        json: (data) => {
          responseData = data;
        },
        status: (code) => ({
          json: (data) => {
            responseData = { ...data, statusCode: code };
          },
        }),
      };

      await wireframeApi.generateComponentPreview(req, mockRes);

      if (responseData?.statusCode) {
        res.status(responseData.statusCode).json(responseData);
      } else {
        res.json(responseData);
      }
    } catch (error) {
      console.error("❌ Component preview failed:", error);
      res.status(500).json({
        error: "Failed to generate component preview",
        details: error.message,
      });
    }
  });

  // Fluent UI Node ID Wireframe Generation endpoint
  app.post("/api/generate-fluent-wireframe", async (req, res) => {
    try {
      const {
        nodeIds = [],
        layout = "default",
        fluentFileKey = null,
      } = req.body;

      if (!Array.isArray(nodeIds) || nodeIds.length === 0) {
        return res.status(400).json({
          error: "Node IDs are required",
          message:
            "Please provide an array of Figma node IDs from the Fluent UI library",
          example: {
            nodeIds: ["1:234", "1:235", "1:236"],
            layout: "default",
          },
        });
      }

      console.log("🎨 Fluent UI wireframe request:", {
        nodeIds,
        layout,
        fluentFileKey,
      });

      await wireframeApi.initialize();

      // Get Figma service from wireframe API
      const figmaService = wireframeApi.componentGenerator.figmaService;

      // Generate wireframe using Fluent node IDs
      const result = await figmaService.generateFluentWireframe(
        nodeIds,
        layout
      );

      res.json({
        success: true,
        html: result.html,
        components: result.components,
        layout: result.layout,
        nodeIds: result.nodeIds,
        timestamp: result.timestamp,
        fluentUIGenerated: true,
      });
    } catch (error) {
      console.error("❌ Fluent UI wireframe generation failed:", error);
      res.status(500).json({
        error: "Failed to generate Fluent UI wireframe",
        details: error.message,
        success: false,
      });
    }
  });

  // Get Fluent UI component mapping endpoint
  app.get("/api/fluent-components", async (req, res) => {
    try {
      await wireframeApi.initialize();

      const figmaService = wireframeApi.componentGenerator.figmaService;
      const fluentMapping = figmaService.getFluentComponentMapping();

      res.json({
        success: true,
        components: fluentMapping,
        totalComponents: Object.keys(fluentMapping).length,
        description: "Available Fluent UI components for wireframe generation",
      });
    } catch (error) {
      console.error("❌ Failed to get Fluent components:", error);
      res.status(500).json({
        error: "Failed to retrieve Fluent UI components",
        details: error.message,
      });
    }
  });

  // Search Fluent UI components endpoint
  app.get("/api/fluent-components/search", async (req, res) => {
    try {
      const { q: query = "" } = req.query;

      if (!query.trim()) {
        return res.status(400).json({
          error: "Query parameter 'q' is required",
          message: "Please provide a search query to find Fluent UI components",
        });
      }

      await wireframeApi.initialize();

      const figmaService = wireframeApi.componentGenerator.figmaService;
      const searchResults = figmaService.searchFluentComponents(query);

      res.json({
        success: true,
        query,
        results: searchResults,
        totalResults: searchResults.length,
      });
    } catch (error) {
      console.error("❌ Fluent component search failed:", error);
      res.status(500).json({
        error: "Failed to search Fluent UI components",
        details: error.message,
      });
    }
  });

  console.log("✅ Component-driven wireframe endpoints registered");
  console.log("   • POST /api/generate-wireframe-enhanced");
  console.log("   • GET  /api/component-library");
  console.log("   • POST /api/component-preview");
  console.log("   • POST /api/generate-fluent-wireframe");
  console.log("   • GET  /api/fluent-components");
  console.log("   • GET  /api/fluent-components/search");
}

/**
 * Standalone server for testing
 */
function createStandaloneServer() {
  const app = express();
  app.use(express.json());

  // Enable CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    next();
  });

  // Integrate wireframe services
  integrateWithBackend(app);

  // Test endpoint
  app.get("/api/test", (req, res) => {
    res.json({
      message: "Component-driven wireframe API is running!",
      endpoints: [
        "POST /api/generate-wireframe-enhanced",
        "GET  /api/component-library",
        "POST /api/component-preview",
      ],
    });
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Component-driven wireframe API running on port ${PORT}`);
    console.log(`🔗 Test at: http://localhost:${PORT}/api/test`);
  });
}

// Export for integration
module.exports = {
  integrateWithBackend,
  createStandaloneServer,
  WireframeApiService,
};

// Run standalone server if called directly
if (require.main === module) {
  createStandaloneServer();
}
