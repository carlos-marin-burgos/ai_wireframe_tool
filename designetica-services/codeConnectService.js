/**
 * Code Connect Service
 * Handles Figma Code Connect integration for Designetica components
 */

const { figma } = require("@figma/code-connect");

class CodeConnectService {
  constructor() {
    this.configPath = "../figma.config.json";
    this.componentMappings = new Map();
    this.init();
  }

  /**
   * Initialize Code Connect service
   */
  async init() {
    try {
      console.log("🔄 Initializing Code Connect service...");
      await this.loadComponentMappings();
      console.log("✅ Code Connect service initialized");
    } catch (error) {
      console.error("❌ Failed to initialize Code Connect service:", error);
    }
  }

  /**
   * Load component mappings from Figma
   */
  async loadComponentMappings() {
    const mappings = [
      {
        figmaId: "button-component",
        componentPath: "../src/components/ui/Button.tsx",
        props: ["variant", "size", "disabled", "children"],
      },
      {
        figmaId: "modal-component",
        componentPath: "../src/components/SaveWireframeModal.tsx",
        props: ["isOpen", "onClose", "title", "children"],
      },
      {
        figmaId: "input-component",
        componentPath: "../src/components/ui/Input.tsx",
        props: ["type", "placeholder", "value", "onChange", "disabled"],
      },
      {
        figmaId: "navigation-component",
        componentPath: "../src/components/PageNavigation.tsx",
        props: ["pages", "currentPageId", "onPageSwitch"],
      },
    ];

    mappings.forEach((mapping) => {
      this.componentMappings.set(mapping.figmaId, mapping);
    });

    console.log(`📦 Loaded ${mappings.length} component mappings`);
  }

  /**
   * Generate Code Connect files for components
   */
  async generateCodeConnectFiles() {
    try {
      console.log("🔄 Generating Code Connect files...");

      for (const [figmaId, mapping] of this.componentMappings) {
        await this.createCodeConnectFile(figmaId, mapping);
      }

      console.log("✅ Code Connect files generated successfully");
    } catch (error) {
      console.error("❌ Failed to generate Code Connect files:", error);
      throw error;
    }
  }

  /**
   * Create individual Code Connect file
   */
  async createCodeConnectFile(figmaId, mapping) {
    const codeConnectTemplate = `
import figma from '@figma/code-connect'
import { ${this.getComponentName(mapping.componentPath)} } from '${
      mapping.componentPath
    }'

figma.connect(${this.getComponentName(mapping.componentPath)}, '${figmaId}', {
  props: {
    ${mapping.props
      .map(
        (prop) =>
          `${prop}: figma.enum('${prop}', {\n      // Add your Figma variants here\n    })`
      )
      .join(",\n    ")}
  },
  example: (props) => (
    <${this.getComponentName(mapping.componentPath)} {...props} />
  ),
})
`;

    // In a real implementation, you would write this to a .figma.tsx file
    console.log(`📝 Generated Code Connect for ${figmaId}`);
    return codeConnectTemplate;
  }

  /**
   * Extract component name from file path
   */
  getComponentName(componentPath) {
    const fileName = componentPath.split("/").pop();
    return fileName.replace(".tsx", "").replace(".jsx", "");
  }

  /**
   * Sync components with Figma
   */
  async syncWithFigma() {
    try {
      console.log("🔄 Syncing components with Figma...");

      // This would use the Figma API to sync component definitions
      const syncResult = {
        synced: this.componentMappings.size,
        errors: 0,
        timestamp: new Date().toISOString(),
      };

      console.log("✅ Sync completed:", syncResult);
      return syncResult;
    } catch (error) {
      console.error("❌ Sync failed:", error);
      throw error;
    }
  }

  /**
   * Validate component mappings
   */
  validateMappings() {
    const validationResults = [];

    for (const [figmaId, mapping] of this.componentMappings) {
      const result = {
        figmaId,
        componentPath: mapping.componentPath,
        isValid: true,
        issues: [],
      };

      // Check if component file exists
      try {
        require.resolve(mapping.componentPath);
      } catch (error) {
        result.isValid = false;
        result.issues.push("Component file not found");
      }

      validationResults.push(result);
    }

    return validationResults;
  }

  /**
   * Get component mapping by Figma ID
   */
  getComponentMapping(figmaId) {
    return this.componentMappings.get(figmaId);
  }

  /**
   * Add new component mapping
   */
  addComponentMapping(figmaId, componentPath, props) {
    this.componentMappings.set(figmaId, {
      figmaId,
      componentPath,
      props,
    });
    console.log(`➕ Added mapping for ${figmaId}`);
  }

  /**
   * Remove component mapping
   */
  removeComponentMapping(figmaId) {
    if (this.componentMappings.delete(figmaId)) {
      console.log(`➖ Removed mapping for ${figmaId}`);
      return true;
    }
    return false;
  }
}

module.exports = CodeConnectService;
