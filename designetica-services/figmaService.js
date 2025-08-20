/**
 * Figma Service
 * Handles Figma API interactions for design system integration
 */

const axios = require("axios");
const path = require("path");
const fs = require("fs");

// Load environment variables from parent directory
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

class FigmaService {
  constructor() {
    this.apiToken = process.env.FIGMA_ACCESS_TOKEN;
    this.baseURL = "https://api.figma.com/v1";
    this.fileKey = "wSppVRlOi9JZO2LxtHUbbW"; // From figma.config.json
    this.fluentLibraryFileKey = "BNjrEE5xScFNrGY1w9rqBt"; // Microsoft Fluent UI Library
    this.axiosInstance = this.createAxiosInstance();

    // Enhanced node ID mapping for Fluent UI components
    this.fluentComponentMap = new Map();
    this.initializeFluentMapping();
  }

  /**
   * Create configured axios instance
   */
  createAxiosInstance() {
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        "X-Figma-Token": this.apiToken,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });
  }

  /**
   * Get Figma file information
   */
  async getFile(fileKey = this.fileKey) {
    try {
      console.log(`🔄 Fetching Figma file: ${fileKey}`);
      const response = await this.axiosInstance.get(`/files/${fileKey}`);
      console.log("✅ Figma file fetched successfully");
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch Figma file:", error.message);
      throw error;
    }
  }

  /**
   * Get specific components from Figma file
   */
  async getComponents(fileKey = this.fileKey) {
    try {
      console.log(`🔄 Fetching components from Figma file: ${fileKey}`);
      const response = await this.axiosInstance.get(
        `/files/${fileKey}/components`
      );
      console.log(
        `✅ Found ${
          Object.keys(response.data.meta.components).length
        } components`
      );
      return response.data.meta.components;
    } catch (error) {
      console.error("❌ Failed to fetch components:", error.message);
      throw error;
    }
  }

  /**
   * Get component styles (colors, typography, etc.)
   */
  async getStyles(fileKey = this.fileKey) {
    try {
      console.log(`🔄 Fetching styles from Figma file: ${fileKey}`);
      const response = await this.axiosInstance.get(`/files/${fileKey}/styles`);
      console.log(
        `✅ Found ${Object.keys(response.data.meta.styles).length} styles`
      );
      return response.data.meta.styles;
    } catch (error) {
      console.error("❌ Failed to fetch styles:", error.message);
      throw error;
    }
  }

  /**
   * Export components as images
   */
  async exportComponentImages(componentIds, options = {}) {
    try {
      const defaultOptions = {
        format: "png",
        scale: 2,
        ...options,
      };

      console.log(`🔄 Exporting ${componentIds.length} component images...`);

      const params = new URLSearchParams({
        ids: componentIds.join(","),
        format: defaultOptions.format,
        scale: defaultOptions.scale,
      });

      const response = await this.axiosInstance.get(
        `/images/${this.fileKey}?${params.toString()}`
      );

      console.log("✅ Component images exported successfully");
      return response.data.images;
    } catch (error) {
      console.error("❌ Failed to export component images:", error.message);
      throw error;
    }
  }

  /**
   * Get design tokens from Figma
   */
  async getDesignTokens() {
    try {
      console.log("🔄 Extracting design tokens from Figma...");

      const file = await this.getFile();
      const styles = await this.getStyles();

      const tokens = {
        colors: this.extractColorTokens(styles),
        typography: this.extractTypographyTokens(styles),
        spacing: this.extractSpacingTokens(file),
        borderRadius: this.extractBorderRadiusTokens(styles),
      };

      console.log("✅ Design tokens extracted successfully");
      return tokens;
    } catch (error) {
      console.error("❌ Failed to extract design tokens:", error.message);
      throw error;
    }
  }

  /**
   * Extract color tokens from styles
   */
  extractColorTokens(styles) {
    const colorTokens = {};

    Object.entries(styles).forEach(([key, style]) => {
      if (style.style_type === "FILL") {
        const name = style.name.toLowerCase().replace(/\s+/g, "-");
        colorTokens[name] =
          style.description || `Color token for ${style.name}`;
      }
    });

    return colorTokens;
  }

  /**
   * Extract typography tokens from styles
   */
  extractTypographyTokens(styles) {
    const typographyTokens = {};

    Object.entries(styles).forEach(([key, style]) => {
      if (style.style_type === "TEXT") {
        const name = style.name.toLowerCase().replace(/\s+/g, "-");
        typographyTokens[name] = {
          name: style.name,
          description:
            style.description || `Typography token for ${style.name}`,
        };
      }
    });

    return typographyTokens;
  }

  /**
   * Extract spacing tokens (simplified)
   */
  extractSpacingTokens(file) {
    // This would analyze the file structure for common spacing patterns
    return {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px",
    };
  }

  /**
   * Extract border radius tokens (simplified)
   */
  extractBorderRadiusTokens(styles) {
    return {
      none: "0px",
      sm: "4px",
      md: "8px",
      lg: "12px",
      xl: "16px",
    };
  }

  /**
   * Search for components by name
   */
  async searchComponents(query) {
    try {
      const components = await this.getComponents();

      const matchingComponents = Object.entries(components).filter(
        ([id, component]) =>
          component.name.toLowerCase().includes(query.toLowerCase())
      );

      console.log(
        `🔍 Found ${matchingComponents.length} components matching "${query}"`
      );
      return matchingComponents;
    } catch (error) {
      console.error("❌ Component search failed:", error.message);
      throw error;
    }
  }

  /**
   * Get component variants
   */
  async getComponentVariants(componentId) {
    try {
      console.log(`🔄 Fetching variants for component: ${componentId}`);

      const file = await this.getFile();
      // This would traverse the file structure to find component variants
      // Simplified implementation

      console.log("✅ Component variants fetched");
      return {
        componentId,
        variants: [], // Would contain actual variant data
      };
    } catch (error) {
      console.error("❌ Failed to fetch component variants:", error.message);
      throw error;
    }
  }

  /**
   * Validate Figma API connection
   */
  async validateConnection() {
    try {
      console.log("🔄 Validating Figma API connection...");

      if (!this.apiToken) {
        throw new Error("Figma API token not configured");
      }

      // Test API connection with a simple request
      await this.axiosInstance.get("/me");

      console.log("✅ Figma API connection validated");
      return { isValid: true, message: "Connection successful" };
    } catch (error) {
      console.error("❌ Figma API connection failed:", error.message);
      return { isValid: false, message: error.message };
    }
  }

  /**
   * Initialize Fluent UI component mapping with common node IDs
   */
  initializeFluentMapping() {
    // Common Fluent UI component node IDs (these would be actual node IDs from the Fluent library)
    this.fluentComponentMap.set("button-primary", {
      nodeId: "1:234",
      name: "Button/Primary",
      description: "Primary action button",
      variants: ["default", "hover", "pressed", "disabled"],
      props: ["text", "icon", "size", "disabled"],
    });

    this.fluentComponentMap.set("button-secondary", {
      nodeId: "1:235",
      name: "Button/Secondary",
      description: "Secondary action button",
      variants: ["default", "hover", "pressed", "disabled"],
      props: ["text", "icon", "size", "disabled"],
    });

    this.fluentComponentMap.set("input-text", {
      nodeId: "1:236",
      name: "Input/Text",
      description: "Text input field",
      variants: ["default", "focus", "error", "disabled"],
      props: ["placeholder", "value", "label", "required", "disabled"],
    });

    this.fluentComponentMap.set("card-basic", {
      nodeId: "1:237",
      name: "Card/Basic",
      description: "Basic content card",
      variants: ["default", "hover", "selected"],
      props: ["title", "content", "image", "actions"],
    });

    this.fluentComponentMap.set("navigation-horizontal", {
      nodeId: "1:238",
      name: "Navigation/Horizontal",
      description: "Horizontal navigation bar",
      variants: ["default", "compact", "expanded"],
      props: ["items", "activeItem", "brand"],
    });

    this.fluentComponentMap.set("modal-dialog", {
      nodeId: "1:239",
      name: "Modal/Dialog",
      description: "Modal dialog component",
      variants: ["small", "medium", "large", "fullscreen"],
      props: ["title", "content", "actions", "size", "dismissible"],
    });

    console.log(
      `🎨 Initialized ${this.fluentComponentMap.size} Fluent UI component mappings`
    );
  }

  /**
   * Get component by node ID from Fluent library
   */
  async getComponentByNodeId(nodeId, fileKey = this.fluentLibraryFileKey) {
    try {
      console.log(`🔄 Fetching component with node ID: ${nodeId}`);

      const response = await this.axiosInstance.get(
        `/files/${fileKey}/nodes?ids=${nodeId}`
      );

      if (response.data.nodes && response.data.nodes[nodeId]) {
        const nodeData = response.data.nodes[nodeId];
        console.log(`✅ Found component: ${nodeData.document.name}`);

        return {
          nodeId,
          name: nodeData.document.name,
          type: nodeData.document.type,
          properties: this.extractNodeProperties(nodeData.document),
          fileKey,
        };
      } else {
        console.warn(`⚠️ Node ${nodeId} not found in file ${fileKey}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Failed to fetch node ${nodeId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get multiple components by node IDs
   */
  async getComponentsByNodeIds(nodeIds, fileKey = this.fluentLibraryFileKey) {
    try {
      console.log(`🔄 Fetching ${nodeIds.length} components by node IDs`);

      const nodeIdsString = nodeIds.join(",");
      const response = await this.axiosInstance.get(
        `/files/${fileKey}/nodes?ids=${nodeIdsString}`
      );

      const components = [];
      for (const nodeId of nodeIds) {
        if (response.data.nodes && response.data.nodes[nodeId]) {
          const nodeData = response.data.nodes[nodeId];
          components.push({
            nodeId,
            name: nodeData.document.name,
            type: nodeData.document.type,
            properties: this.extractNodeProperties(nodeData.document),
            fileKey,
          });
        }
      }

      console.log(`✅ Successfully fetched ${components.length} components`);
      return components;
    } catch (error) {
      console.error(
        "❌ Failed to fetch components by node IDs:",
        error.message
      );
      throw error;
    }
  }

  /**
   * Export specific node IDs as images
   */
  async exportNodeImages(
    nodeIds,
    fileKey = this.fluentLibraryFileKey,
    options = {}
  ) {
    try {
      const defaultOptions = {
        format: "png",
        scale: 2,
        ...options,
      };

      console.log(`🔄 Exporting ${nodeIds.length} node images...`);

      const params = new URLSearchParams({
        ids: nodeIds.join(","),
        format: defaultOptions.format,
        scale: defaultOptions.scale,
      });

      const response = await this.axiosInstance.get(
        `/images/${fileKey}?${params.toString()}`
      );

      console.log("✅ Node images exported successfully");
      return response.data.images;
    } catch (error) {
      console.error("❌ Failed to export node images:", error.message);
      throw error;
    }
  }

  /**
   * Get Fluent UI components mapped to React components
   */
  getFluentComponentMapping() {
    const mapping = {};
    for (const [key, value] of this.fluentComponentMap) {
      mapping[key] = value;
    }
    return mapping;
  }

  /**
   * Search Fluent components by type or name
   */
  searchFluentComponents(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();

    for (const [key, component] of this.fluentComponentMap) {
      if (
        key.includes(lowerQuery) ||
        component.name.toLowerCase().includes(lowerQuery) ||
        component.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push({ key, ...component });
      }
    }

    console.log(
      `🔍 Found ${results.length} Fluent components matching "${query}"`
    );
    return results;
  }

  /**
   * Generate wireframe using specific Fluent node IDs
   */
  async generateFluentWireframe(componentNodeIds, layout = "default") {
    try {
      console.log(
        `🎨 Generating wireframe with ${componentNodeIds.length} Fluent components`
      );

      // Fetch component data for each node ID
      const components = await this.getComponentsByNodeIds(componentNodeIds);

      // Generate HTML structure based on components
      const wireframeHtml = this.generateWireframeHtml(components, layout);

      console.log("✅ Fluent wireframe generated successfully");
      return {
        html: wireframeHtml,
        components,
        layout,
        nodeIds: componentNodeIds,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Failed to generate Fluent wireframe:", error.message);
      throw error;
    }
  }

  /**
   * Extract properties from Figma node
   */
  extractNodeProperties(node) {
    const properties = {
      width: node.absoluteBoundingBox?.width || 0,
      height: node.absoluteBoundingBox?.height || 0,
      x: node.absoluteBoundingBox?.x || 0,
      y: node.absoluteBoundingBox?.y || 0,
    };

    // Extract fills (colors)
    if (node.fills && node.fills.length > 0) {
      properties.fills = node.fills.map((fill) => ({
        type: fill.type,
        color: fill.color,
        opacity: fill.opacity || 1,
      }));
    }

    // Extract effects (shadows, etc.)
    if (node.effects && node.effects.length > 0) {
      properties.effects = node.effects;
    }

    // Extract text properties if it's a text node
    if (node.type === "TEXT" && node.style) {
      properties.textStyle = {
        fontFamily: node.style.fontFamily,
        fontSize: node.style.fontSize,
        fontWeight: node.style.fontWeight,
        lineHeight: node.style.lineHeightPercentFontSize,
      };
    }

    return properties;
  }

  /**
   * Generate HTML wireframe from Fluent components
   */
  generateWireframeHtml(components, layout = "default") {
    const styles = this.getFluentWireframeStyles();

    let layoutClass = "fluent-layout-default";
    if (layout === "dashboard") layoutClass = "fluent-layout-dashboard";
    else if (layout === "form") layoutClass = "fluent-layout-form";
    else if (layout === "card-grid") layoutClass = "fluent-layout-cards";

    const componentHtml = components
      .map((component, index) => this.generateComponentHtml(component, index))
      .join("\n");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fluent UI Wireframe</title>
    ${styles}
</head>
<body>
    <div class="${layoutClass}">
        <header class="fluent-header">
            <h1>Fluent UI Wireframe</h1>
            <p>Generated from Figma node IDs: ${components
              .map((c) => c.nodeId)
              .join(", ")}</p>
        </header>
        <main class="fluent-main">
            ${componentHtml}
        </main>
    </div>
</body>
</html>`;
  }

  /**
   * Generate HTML for individual component
   */
  generateComponentHtml(component, index) {
    const componentType = this.detectComponentType(component.name);

    switch (componentType) {
      case "button":
        return `
        <div class="fluent-component fluent-button-container">
            <button class="fluent-button fluent-button-primary" data-node-id="${
              component.nodeId
            }">
                ${
                  component.name.includes("Primary")
                    ? "Primary Action"
                    : "Secondary Action"
                }
            </button>
        </div>`;

      case "input":
        return `
        <div class="fluent-component fluent-input-container">
            <label class="fluent-label">Input Field</label>
            <input type="text" class="fluent-input" placeholder="Enter text..." data-node-id="${component.nodeId}">
        </div>`;

      case "card":
        return `
        <div class="fluent-component fluent-card" data-node-id="${component.nodeId}">
            <div class="fluent-card-header">
                <h3>Card Title</h3>
            </div>
            <div class="fluent-card-content">
                <p>Card content based on Fluent UI component: ${component.name}</p>
            </div>
        </div>`;

      case "navigation":
        return `
        <nav class="fluent-component fluent-navigation" data-node-id="${component.nodeId}">
            <ul class="fluent-nav-list">
                <li class="fluent-nav-item"><a href="#" class="fluent-nav-link">Home</a></li>
                <li class="fluent-nav-item"><a href="#" class="fluent-nav-link">Products</a></li>
                <li class="fluent-nav-item"><a href="#" class="fluent-nav-link">Services</a></li>
                <li class="fluent-nav-item"><a href="#" class="fluent-nav-link">Contact</a></li>
            </ul>
        </nav>`;

      case "modal":
        return `
        <div class="fluent-component fluent-modal-overlay" data-node-id="${component.nodeId}">
            <div class="fluent-modal">
                <div class="fluent-modal-header">
                    <h2>Modal Title</h2>
                    <button class="fluent-modal-close">×</button>
                </div>
                <div class="fluent-modal-content">
                    <p>Modal content from Fluent UI component: ${component.name}</p>
                </div>
                <div class="fluent-modal-actions">
                    <button class="fluent-button fluent-button-primary">Confirm</button>
                    <button class="fluent-button fluent-button-secondary">Cancel</button>
                </div>
            </div>
        </div>`;

      default:
        return `
        <div class="fluent-component fluent-generic" data-node-id="${component.nodeId}">
            <h4>${component.name}</h4>
            <p>Generic Fluent UI component</p>
        </div>`;
    }
  }

  /**
   * Detect component type from name
   */
  detectComponentType(name) {
    const lowerName = name.toLowerCase();

    if (lowerName.includes("button")) return "button";
    if (lowerName.includes("input") || lowerName.includes("textfield"))
      return "input";
    if (lowerName.includes("card")) return "card";
    if (lowerName.includes("navigation") || lowerName.includes("nav"))
      return "navigation";
    if (lowerName.includes("modal") || lowerName.includes("dialog"))
      return "modal";

    return "generic";
  }

  /**
   * Get Fluent UI wireframe styles
   */
  getFluentWireframeStyles() {
    return `
    <style>
        /* Fluent UI Design System Styles */
        :root {
            --fluent-neutral-foreground-1: #242424;
            --fluent-neutral-foreground-2: #424242;
            --fluent-neutral-background-1: #ffffff;
            --fluent-neutral-background-2: #f5f5f5;
            --fluent-neutral-stroke-1: #e0e0e0;
            --fluent-brand-background-primary: #0078d4;
            --fluent-brand-background-secondary: #106ebe;
            --fluent-border-radius-medium: 6px;
            --fluent-shadow-2: 0px 2px 4px rgba(0, 0, 0, 0.1);
            --fluent-shadow-4: 0px 4px 8px rgba(0, 0, 0, 0.12);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif;
            color: var(--fluent-neutral-foreground-1);
            background: var(--fluent-neutral-background-1);
            line-height: 1.5;
        }

        /* Layout Styles */
        .fluent-layout-default {
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px;
        }

        .fluent-layout-dashboard {
            display: grid;
            grid-template-columns: 250px 1fr;
            min-height: 100vh;
        }

        .fluent-layout-form {
            max-width: 600px;
            margin: 0 auto;
            padding: 32px;
        }

        .fluent-layout-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            padding: 24px;
        }

        /* Header */
        .fluent-header {
            margin-bottom: 32px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--fluent-neutral-stroke-1);
        }

        .fluent-header h1 {
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .fluent-header p {
            color: var(--fluent-neutral-foreground-2);
            font-size: 14px;
        }

        /* Main Content */
        .fluent-main {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        /* Component Styles */
        .fluent-component {
            padding: 16px;
            border: 1px solid var(--fluent-neutral-stroke-1);
            border-radius: var(--fluent-border-radius-medium);
            background: var(--fluent-neutral-background-1);
            box-shadow: var(--fluent-shadow-2);
            position: relative;
        }

        .fluent-component::before {
            content: attr(data-node-id);
            position: absolute;
            top: -12px;
            right: 8px;
            background: var(--fluent-brand-background-primary);
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 500;
        }

        /* Button Styles */
        .fluent-button {
            padding: 8px 16px;
            border: none;
            border-radius: var(--fluent-border-radius-medium);
            font-family: inherit;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
        }

        .fluent-button-primary {
            background: var(--fluent-brand-background-primary);
            color: white;
        }

        .fluent-button-primary:hover {
            background: var(--fluent-brand-background-secondary);
        }

        .fluent-button-secondary {
            background: transparent;
            color: var(--fluent-brand-background-primary);
            border: 1px solid var(--fluent-brand-background-primary);
        }

        .fluent-button-secondary:hover {
            background: var(--fluent-neutral-background-2);
        }

        /* Input Styles */
        .fluent-input-container {
            margin-bottom: 16px;
        }

        .fluent-label {
            display: block;
            margin-bottom: 4px;
            font-weight: 500;
            font-size: 14px;
        }

        .fluent-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--fluent-neutral-stroke-1);
            border-radius: var(--fluent-border-radius-medium);
            font-family: inherit;
            font-size: 14px;
            transition: border-color 0.15s ease;
        }

        .fluent-input:focus {
            outline: none;
            border-color: var(--fluent-brand-background-primary);
            box-shadow: 0 0 0 1px var(--fluent-brand-background-primary);
        }

        /* Card Styles */
        .fluent-card {
            background: var(--fluent-neutral-background-1);
            border: 1px solid var(--fluent-neutral-stroke-1);
            border-radius: var(--fluent-border-radius-medium);
            overflow: hidden;
            transition: box-shadow 0.15s ease;
        }

        .fluent-card:hover {
            box-shadow: var(--fluent-shadow-4);
        }

        .fluent-card-header {
            padding: 16px;
            border-bottom: 1px solid var(--fluent-neutral-stroke-1);
        }

        .fluent-card-header h3 {
            font-size: 16px;
            font-weight: 600;
        }

        .fluent-card-content {
            padding: 16px;
        }

        /* Navigation Styles */
        .fluent-navigation {
            background: var(--fluent-neutral-background-2);
            border-radius: var(--fluent-border-radius-medium);
            padding: 8px;
        }

        .fluent-nav-list {
            display: flex;
            list-style: none;
            gap: 8px;
        }

        .fluent-nav-item {
            flex: 1;
        }

        .fluent-nav-link {
            display: block;
            padding: 8px 16px;
            text-decoration: none;
            color: var(--fluent-neutral-foreground-1);
            border-radius: var(--fluent-border-radius-medium);
            text-align: center;
            transition: background-color 0.15s ease;
        }

        .fluent-nav-link:hover {
            background: var(--fluent-neutral-background-1);
        }

        /* Modal Styles */
        .fluent-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .fluent-modal {
            background: var(--fluent-neutral-background-1);
            border-radius: var(--fluent-border-radius-medium);
            box-shadow: var(--fluent-shadow-4);
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow: hidden;
        }

        .fluent-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            border-bottom: 1px solid var(--fluent-neutral-stroke-1);
        }

        .fluent-modal-header h2 {
            font-size: 18px;
            font-weight: 600;
        }

        .fluent-modal-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 4px;
            border-radius: var(--fluent-border-radius-medium);
        }

        .fluent-modal-close:hover {
            background: var(--fluent-neutral-background-2);
        }

        .fluent-modal-content {
            padding: 16px;
        }

        .fluent-modal-actions {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
            padding: 16px;
            border-top: 1px solid var(--fluent-neutral-stroke-1);
        }

        /* Generic Component */
        .fluent-generic {
            text-align: center;
            padding: 24px;
        }

        .fluent-generic h4 {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .fluent-layout-dashboard {
                grid-template-columns: 1fr;
            }
            
            .fluent-nav-list {
                flex-direction: column;
            }
            
            .fluent-modal {
                width: 95%;
                margin: 16px;
            }
        }
    </style>`;
  }
}

module.exports = FigmaService;
