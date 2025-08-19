/**
 * Designetica Services Entry Point
 * Command-line interface for Figma Code Connect services
 */

const path = require("path");

// Load environment variables from parent directory
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// Import services
const CodeConnectService = require('./codeConnectService');
const FigmaService = require('./figmaService');
const ComponentDetectionService = require('./componentDetectionService');
const ComponentDrivenWireframeGenerator = require('./componentDrivenWireframeGenerator');
const WireframeApiService = require('./wireframeApiService');

class DesigneticaServices {
  constructor() {
    this.codeConnect = new CodeConnectService();
    this.figma = new FigmaService();
    this.componentDetector = new ComponentDetectionService();
    this.wireframeGenerator = new ComponentDrivenWireframeGenerator();
    this.wireframeApi = new WireframeApiService();
  }

  /**
   * Initialize all services
   */
  async initialize() {
    try {
      console.log("🚀 Initializing Designetica Services...");

      // Validate Figma connection
      const connectionResult = await this.figma.validateConnection();
      if (!connectionResult.isValid) {
        throw new Error(`Figma connection failed: ${connectionResult.message}`);
      }

      // Initialize Code Connect service
      await this.codeConnect.init();

      console.log("✅ All services initialized successfully");
      return true;
    } catch (error) {
      console.error("❌ Service initialization failed:", error.message);
      throw error;
    }
  }

  /**
   * Run full component detection and mapping workflow
   */
  async runFullWorkflow() {
    try {
      console.log("🔄 Running full Code Connect workflow...");

      // Step 1: Detect React components
      const detectedComponents =
        await this.componentDetector.detectComponents();
      console.log(`📦 Detected ${detectedComponents.length} React components`);

      // Step 2: Get Figma components
      const figmaComponents = await this.figma.getComponents();
      console.log(
        `🎨 Found ${Object.keys(figmaComponents).length} Figma components`
      );

      // Step 3: Generate mappings
      const mappingReport = this.componentDetector.generateMappingReport();
      console.log("📊 Mapping report generated");

      // Step 4: Generate Code Connect files
      await this.codeConnect.generateCodeConnectFiles();
      console.log("📝 Code Connect files generated");

      // Step 5: Sync with Figma
      const syncResult = await this.codeConnect.syncWithFigma();
      console.log("🔄 Sync completed");

      return {
        detectedComponents,
        figmaComponents,
        mappingReport,
        syncResult,
      };
    } catch (error) {
      console.error("❌ Workflow failed:", error.message);
      throw error;
    }
  }

  /**
   * Get design tokens from Figma
   */
  async getDesignTokens() {
    return await this.figma.getDesignTokens();
  }

  /**
   * Search for components
   */
  async searchComponents(query) {
    return await this.figma.searchComponents(query);
  }

  /**
   * Validate all mappings
   */
  validateMappings() {
    return this.codeConnect.validateMappings();
  }

  /**
   * Get component analysis
   */
  async getComponentAnalysis() {
    const detectedComponents = await this.componentDetector.detectComponents();
    const mappingReport = this.componentDetector.generateMappingReport();

    return {
      components: detectedComponents,
      report: mappingReport,
      totalCount: detectedComponents.length,
    };
  }

  /**
   * Generate wireframe using detected components
   */
  async generateWireframe(description, options = {}) {
    try {
      console.log("🎨 Generating component-driven wireframe...");

      await this.wireframeGenerator.init();
      const result = await this.wireframeGenerator.generateWireframe(
        description,
        options
      );

      console.log(
        `✅ Generated wireframe with ${result.components.length} components`
      );
      return result;
    } catch (error) {
      console.error("❌ Wireframe generation failed:", error);
      throw error;
    }
  }

  /**
   * Get available components for wireframe generation
   */
  async getAvailableComponents() {
    try {
      await this.wireframeGenerator.init();
      return {
        types: this.wireframeGenerator.getAvailableComponentTypes(),
        statistics: this.wireframeGenerator.getComponentStatistics(),
      };
    } catch (error) {
      console.error("❌ Failed to get components:", error);
      throw error;
    }
  }
}

// CLI interface
if (require.main === module) {
  const services = new DesigneticaServices();

  const command = process.argv[2] || "workflow";

  async function runCommand() {
    try {
      await services.initialize();

      switch (command) {
        case "workflow":
          const result = await services.runFullWorkflow();
          console.log("\n📋 Workflow Results:");
          console.log(
            `   Components detected: ${result.detectedComponents.length}`
          );
          console.log(
            `   Figma components: ${Object.keys(result.figmaComponents).length}`
          );
          console.log(`   Sync status: ${result.syncResult.synced} synced`);
          break;

        case "detect":
          const analysis = await services.getComponentAnalysis();
          console.log("\n📦 Component Analysis:");
          console.log(`   Total components: ${analysis.totalCount}`);
          console.log(`   By type:`, analysis.report.componentsByType);
          console.log(
            `   By complexity:`,
            analysis.report.complexityDistribution
          );
          break;

        case "tokens":
          const tokens = await services.getDesignTokens();
          console.log("\n🎨 Design Tokens:");
          console.log(`   Colors: ${Object.keys(tokens.colors).length}`);
          console.log(
            `   Typography: ${Object.keys(tokens.typography).length}`
          );
          console.log(`   Spacing: ${Object.keys(tokens.spacing).length}`);
          break;

        case "validate":
          const validationResults = services.validateMappings();
          console.log("\n✅ Validation Results:");
          validationResults.forEach((result) => {
            console.log(
              `   ${result.figmaId}: ${result.isValid ? "✅" : "❌"}`
            );
            if (result.issues.length > 0) {
              result.issues.forEach((issue) => console.log(`     - ${issue}`));
            }
          });
          break;

        case "wireframe":
          const description =
            process.argv[3] ||
            "modern landing page with navigation and hero section";
          console.log(`\n🎨 Generating wireframe for: "${description}"`);

          const wireframeResult = await services.generateWireframe(
            description,
            {
              theme: "modern",
              colorScheme: "primary",
            }
          );

          console.log("\n📋 Wireframe Generated:");
          console.log(`   Template: ${wireframeResult.template}`);
          console.log(
            `   Components used: ${wireframeResult.components.length}`
          );
          console.log(
            `   Component types:`,
            wireframeResult.components.map((c) => c.type).join(", ")
          );
          console.log(
            `   Generated at: ${wireframeResult.metadata.generatedAt}`
          );
          break;

        case "components":
          const availableComponents = await services.getAvailableComponents();
          console.log("\n📦 Available Components:");
          console.log(`   Total: ${availableComponents.statistics.total}`);
          console.log(`   Types: ${availableComponents.types.join(", ")}`);
          console.log(`   By type:`, availableComponents.statistics.byType);
          console.log(
            `   By complexity:`,
            availableComponents.statistics.byComplexity
          );
          break;

        default:
          console.log(`
Usage: node index.js [command]

Commands:
  workflow    - Run full detection and mapping workflow (default)
  detect      - Detect and analyze React components
  tokens      - Extract design tokens from Figma
  validate    - Validate component mappings
  wireframe   - Generate wireframe using detected components
  components  - Show available components for wireframe generation
          `);
          break;
      }
    } catch (error) {
      console.error("❌ Command failed:", error.message);
      process.exit(1);
    }
  }

  runCommand();
}

module.exports = DesigneticaServices;
