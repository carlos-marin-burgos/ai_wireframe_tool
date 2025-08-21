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
    this.atlasLibraryFileKey = "uVA2amRR71yJZ0GS6RI6zL"; // Atlas Design Library
    this.axiosInstance = this.createAxiosInstance();

    // Enhanced node ID mapping for design systems
    this.fluentComponentMap = new Map();
    this.atlasComponentMap = new Map();
    this.initializeFluentMapping();
    this.initializeAtlasMapping();
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
   * Export components as images from Atlas Design Library
   */
  async exportAtlasComponentImages(componentIds, options = {}) {
    try {
      const defaultOptions = {
        format: "png",
        scale: 2,
        ...options,
      };

      console.log(
        `🔄 Exporting ${componentIds.length} Atlas component images...`
      );

      const params = new URLSearchParams({
        ids: componentIds.join(","),
        format: defaultOptions.format,
        scale: defaultOptions.scale,
      });

      const response = await this.axiosInstance.get(
        `/images/${this.atlasLibraryFileKey}?${params.toString()}`
      );

      console.log("✅ Atlas component images exported successfully");
      return response.data.images;
    } catch (error) {
      console.error(
        "❌ Failed to export Atlas component images:",
        error.message
      );
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
   * Initialize Atlas Design Library component mapping
   */
  initializeAtlasMapping() {
    // Atlas Design Library components based on the provided URL
    // Starting with the node ID from your URL: 14647-163530
    this.atlasComponentMap.set("atlas-button-primary", {
      nodeId: "14647:163530",
      name: "Atlas/Button/Primary",
      description: "Atlas primary button component",
      variants: ["default", "hover", "active", "disabled"],
      props: ["text", "icon", "size", "variant"],
    });

    this.atlasComponentMap.set("atlas-button-secondary", {
      nodeId: "14647:163531", // Assumed adjacent node ID
      name: "Atlas/Button/Secondary",
      description: "Atlas secondary button component",
      variants: ["default", "hover", "active", "disabled"],
      props: ["text", "icon", "size", "variant"],
    });

    this.atlasComponentMap.set("atlas-card", {
      nodeId: "14647:163532", // Assumed adjacent node ID
      name: "Atlas/Card",
      description: "Atlas card component",
      variants: ["default", "elevated", "outlined"],
      props: ["title", "content", "actions", "variant"],
    });

    this.atlasComponentMap.set("atlas-input", {
      nodeId: "14647:163533", // Assumed adjacent node ID
      name: "Atlas/Input",
      description: "Atlas input field component",
      variants: ["default", "focus", "error", "success"],
      props: ["label", "placeholder", "value", "type", "required"],
    });

    this.atlasComponentMap.set("atlas-navigation", {
      nodeId: "14647:163534", // Assumed adjacent node ID
      name: "Atlas/Navigation",
      description: "Atlas navigation component",
      variants: ["horizontal", "vertical", "breadcrumb"],
      props: ["items", "orientation", "active"],
    });

    this.atlasComponentMap.set("atlas-modal", {
      nodeId: "14647:163535", // Assumed adjacent node ID
      name: "Atlas/Modal",
      description: "Atlas modal dialog component",
      variants: ["small", "medium", "large", "fullscreen"],
      props: ["title", "content", "actions", "size", "backdrop"],
    });

    this.atlasComponentMap.set("atlas-hero", {
      nodeId: "14647:163530", // Hero component node ID (corrected from Figma URL)
      name: "Atlas/Hero",
      description: "Atlas hero section component",
      variants: ["default", "with-image", "with-video", "centered"],
      props: ["title", "subtitle", "image", "cta", "background", "overlay"],
    });

    this.atlasComponentMap.set("atlas-learning-path-card", {
      nodeId: "14315:162386", // Updated Learning Path Card component from Figma URL
      name: "Atlas/Learning Path Card",
      description: "Atlas learning path card component for educational content",
      variants: ["default", "completed", "in-progress", "locked"],
      props: [
        "title",
        "description",
        "progress",
        "duration",
        "modules",
        "status",
        "thumbnail",
      ],
    });

    // Add support for modules using the same card design
    this.atlasComponentMap.set("atlas-module-card", {
      nodeId: "14315:162386", // Same design as learning path, different content
      name: "Atlas/Module Card",
      description:
        "Atlas module card component for individual learning modules",
      variants: ["default", "completed", "in-progress", "locked"],
      props: [
        "title",
        "description",
        "duration",
        "difficulty",
        "progress",
        "status",
        "thumbnail",
      ],
    });

    console.log(
      `🎨 Initialized ${this.atlasComponentMap.size} Atlas Design Library component mappings`
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
   * Get component by node ID from Atlas Design Library
   */
  async getAtlasComponentByNodeId(nodeId) {
    return this.getComponentByNodeId(nodeId, this.atlasLibraryFileKey);
  }

  /**
   * Get Atlas component mapping
   */
  getAtlasComponentMapping() {
    const mapping = {};
    for (const [key, value] of this.atlasComponentMap.entries()) {
      mapping[key] = {
        nodeId: value.nodeId,
        name: value.name,
        description: value.description,
        variants: value.variants,
        props: value.props,
      };
    }
    return mapping;
  }

  /**
   * Search Atlas components by keyword
   */
  searchAtlasComponents(query) {
    const results = [];
    const searchTerm = query.toLowerCase();

    for (const [key, component] of this.atlasComponentMap.entries()) {
      if (
        component.name.toLowerCase().includes(searchTerm) ||
        component.description.toLowerCase().includes(searchTerm) ||
        key.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: key,
          name: component.name,
          description: component.description,
          nodeId: component.nodeId,
          variants: component.variants,
          props: component.props,
        });
      }
    }

    console.log(
      `🔍 Found ${results.length} Atlas components matching "${query}"`
    );
    return results;
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
      const wireframeHtml = await this.generateWireframeHtml(
        components,
        layout
      );

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
   * Generate wireframe using specific Atlas node IDs
   */
  async generateAtlasWireframe(componentNodeIds, layout = "default") {
    try {
      console.log(
        `🎨 Generating wireframe with ${componentNodeIds.length} Atlas components`
      );

      // Fetch component data for each node ID from Atlas library
      const components = await this.getComponentsByNodeIds(
        componentNodeIds,
        this.atlasLibraryFileKey
      );

      // Generate HTML structure based on components with Atlas styling
      const wireframeHtml = this.generateAtlasWireframeHtml(components, layout);

      console.log("✅ Atlas wireframe generated successfully");
      return {
        html: wireframeHtml,
        components,
        layout,
        nodeIds: componentNodeIds,
        designSystem: "atlas",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Failed to generate Atlas wireframe:", error.message);
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
  async generateWireframeHtml(components, layout = "default") {
    const styles = this.getFluentWireframeStyles();

    let layoutClass = "fluent-layout-default";
    if (layout === "dashboard") layoutClass = "fluent-layout-dashboard";
    else if (layout === "form") layoutClass = "fluent-layout-form";
    else if (layout === "card-grid") layoutClass = "fluent-layout-cards";

    const componentHtmlPromises = components.map((component, index) =>
      this.generateComponentHtml(component, index)
    );
    const componentHtmlArray = await Promise.all(componentHtmlPromises);
    const componentHtml = componentHtmlArray.join("\n");

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
   * Generate HTML wireframe from Atlas components
   */
  async generateAtlasWireframeHtml(components, layout = "default") {
    const styles = this.getAtlasWireframeStyles();

    let layoutClass = "atlas-layout-default";
    if (layout === "dashboard") layoutClass = "atlas-layout-dashboard";
    else if (layout === "form") layoutClass = "atlas-layout-form";
    else if (layout === "card-grid") layoutClass = "atlas-layout-cards";

    const componentHtmlPromises = components.map((component, index) =>
      this.generateAtlasComponentHtml(component, index)
    );
    const componentHtml = (await Promise.all(componentHtmlPromises)).join("\n");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atlas Design Wireframe</title>
    ${styles}
</head>
<body>
    <div class="${layoutClass}">
        <header class="atlas-header">
            <h1>Atlas Design Wireframe</h1>
            <p>Generated from Figma node IDs: ${components
              .map((c) => c.nodeId)
              .join(", ")}</p>
        </header>
        <main class="atlas-main">
            ${componentHtml}
        </main>
    </div>
</body>
</html>`;
  }

  /**
   * Generate HTML for individual component
   */
  async generateComponentHtml(component, index) {
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

      case "hero":
        // Use Atlas Hero component for all hero sections
        return await this.generateAtlasHeroFromFigma(
          component.nodeId || "14647:163530"
        );

      case "learning-path-card":
        // Use Atlas Learning Path Card component
        return await this.generateAtlasLearningPathCardFromFigma(
          component.nodeId || "14315:162386",
          { type: "learning-path" }
        );

      case "module-card":
        // Use Atlas Module Card component
        return await this.generateAtlasLearningPathCardFromFigma(
          component.nodeId || "14315:162386",
          { type: "module" }
        );

      default:
        return `
        <div class="fluent-component fluent-generic" data-node-id="${component.nodeId}">
            <h4>${component.name}</h4>
            <p>Generic Fluent UI component</p>
        </div>`;
    }
  }

  /**
   * Generate HTML for individual Atlas component
   */
  async generateAtlasComponentHtml(component, index) {
    const componentType = this.detectComponentType(component.name);

    switch (componentType) {
      case "button":
        return `
        <div class="atlas-component atlas-button-container">
            <button class="atlas-button ${
              component.name.includes("Primary")
                ? "atlas-button-primary"
                : "atlas-button-secondary"
            }" data-node-id="${component.nodeId}">
                ${
                  component.name.includes("Primary")
                    ? "Primary Action"
                    : "Secondary Action"
                }
            </button>
        </div>`;

      case "input":
        return `
        <div class="atlas-component atlas-input-container" data-node-id="${component.nodeId}">
            <label class="atlas-label">Input Field</label>
            <input class="atlas-input" type="text" placeholder="Enter text here..." />
        </div>`;

      case "card":
        return `
        <div class="atlas-component atlas-card" data-node-id="${component.nodeId}">
            <div class="atlas-card-header">
                <h3>Card Title</h3>
            </div>
            <div class="atlas-card-content">
                <p>Card content based on Atlas component: ${component.name}</p>
            </div>
        </div>`;

      case "navigation":
        return `
        <nav class="atlas-component atlas-navigation" data-node-id="${component.nodeId}">
            <ul class="atlas-nav-list">
                <li class="atlas-nav-item"><a href="#" class="atlas-nav-link">Home</a></li>
                <li class="atlas-nav-item"><a href="#" class="atlas-nav-link">Products</a></li>
                <li class="atlas-nav-item"><a href="#" class="atlas-nav-link">Services</a></li>
                <li class="atlas-nav-item"><a href="#" class="atlas-nav-link">Contact</a></li>
            </ul>
        </nav>`;

      case "modal":
        return `
        <div class="atlas-component atlas-modal-overlay" data-node-id="${component.nodeId}">
            <div class="atlas-modal">
                <div class="atlas-modal-header">
                    <h2>Modal Title</h2>
                    <button class="atlas-modal-close">×</button>
                </div>
                <div class="atlas-modal-content">
                    <p>Modal content from Atlas component: ${component.name}</p>
                </div>
                <div class="atlas-modal-actions">
                    <button class="atlas-button atlas-button-primary">Confirm</button>
                    <button class="atlas-button atlas-button-secondary">Cancel</button>
                </div>
            </div>
        </div>`;

      case "hero":
        // Fetch the actual Atlas Hero component from Figma using the node ID
        return await this.generateAtlasHeroFromFigma(component.nodeId);

      case "learning-path-card":
      case "learningpathcard":
      case "learning_path_card":
        // Fetch the actual Atlas Learning Path Card component from Figma using the node ID
        return await this.generateAtlasLearningPathCardFromFigma(
          component.nodeId,
          { type: "learning-path" }
        );

      case "module-card":
      case "modulecard":
      case "module_card":
      case "learning-module":
      case "learningmodule":
      case "learning_module":
        // Use the same Atlas card design but configure it for modules
        return await this.generateAtlasLearningPathCardFromFigma(
          component.nodeId || "14315:162386",
          { type: "module" }
        );

      default:
        return `
        <div class="atlas-component atlas-generic" data-node-id="${component.nodeId}">
            <h4>${component.name}</h4>
            <p>Generic Atlas component</p>
        </div>`;
    }
  }

  /**
   * Detect component type from name
   */
  detectComponentType(name) {
    const lowerName = name.toLowerCase();

    // Atlas Learning Path and Module detection (check these first before generic "card")
    if (lowerName.includes("learning") && lowerName.includes("path"))
      return "learning-path-card";
    if (
      lowerName.includes("module") ||
      (lowerName.includes("learning") && lowerName.includes("module"))
    )
      return "module-card";

    // Generic component types
    if (lowerName.includes("hero") || lowerName.includes("banner"))
      return "hero";
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
   * Generate Atlas Hero component from actual Figma data
   */
  async generateAtlasHeroFromFigma(nodeId) {
    try {
      // Fetch the actual component image from Atlas Design Library Figma file
      const componentImages = await this.exportAtlasComponentImages([nodeId], {
        format: "png",
        scale: 2,
      });

      const imageUrl = componentImages[nodeId];

      if (imageUrl) {
        return `
        <div class="atlas-component atlas-hero-figma" data-node-id="${nodeId}" style="max-width: 100%; overflow: hidden;">
            <img src="${imageUrl}" alt="Atlas Hero Component from Figma" style="width: 100%; height: auto; display: block; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);" />
            <div class="atlas-hero-overlay" style="text-align: center; margin-top: 12px;">
                <p style="font-size: 12px; color: #605e5c; margin: 0; opacity: 0.8;">Official Atlas Design Library Hero Component (Node: ${nodeId})</p>
                <p style="font-size: 11px; color: #8a8886; margin: 4px 0 0 0; opacity: 0.6;">Fetched directly from Figma Atlas Design Library</p>
            </div>
        </div>`;
      }
    } catch (error) {
      console.error("Failed to fetch Atlas Hero from Figma:", error);
    }

    // Fallback to a simple placeholder if Figma fetch fails
    return `
    <div class="atlas-component atlas-hero-fallback" data-node-id="${nodeId}" style="background: #f8f9fa; padding: 48px 32px; border-radius: 8px; border: 2px dashed #e1e5e9; text-align: center; font-family: 'Segoe UI', system-ui, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto;">
            <h2 style="font-size: 24px; font-weight: 600; color: #605e5c; margin-bottom: 16px;">Atlas Hero Component</h2>
            <p style="font-size: 16px; color: #8a8886; margin-bottom: 20px;">Unable to fetch from Figma Atlas Design Library</p>
            <p style="font-size: 12px; color: #a19f9d; margin: 0;">Node ID: ${nodeId}</p>
            <p style="font-size: 11px; color: #c8c6c4; margin: 4px 0 0 0;">Please check Figma connection and permissions</p>
        </div>
    </div>`;
  }

  /**
   * Generate Atlas Learning Path Card component from actual Figma data
   */
  async generateAtlasLearningPathCardFromFigma(nodeId, options = {}) {
    try {
      const { type = "learning-path" } = options;
      const isModule = type === "module";

      // Fetch the actual component image from Atlas Design Library Figma file
      console.log(
        `🔄 Fetching Atlas ${
          isModule ? "Module" : "Learning Path"
        } Card from Figma node: ${nodeId}`
      );
      const componentImages = await this.exportAtlasComponentImages([nodeId], {
        format: "png",
        scale: 2,
      });

      const imageUrl = componentImages[nodeId];

      if (imageUrl) {
        console.log(
          `✅ Successfully fetched Atlas ${
            isModule ? "Module" : "Learning Path"
          } Card from Figma: ${nodeId}`
        );

        const componentLabel = isModule ? "Module Card" : "Learning Path Card";
        const altText = `Atlas ${componentLabel} Component from Figma (Node: ${nodeId})`;

        return `
        <div class="atlas-component ${
          isModule
            ? "atlas-module-card-figma"
            : "atlas-learning-path-card-figma"
        }" data-node-id="${nodeId}" data-type="${type}" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <img src="${imageUrl}" 
                 alt="${altText}" 
                 style="width: 100%; height: auto; display: block; object-fit: contain;" />
            <div class="atlas-component-info" style="text-align: center; margin-top: 8px; padding: 8px;">
                <p style="font-size: 11px; color: #605e5c; margin: 0; opacity: 0.8;">Official Atlas Design Library ${componentLabel}</p>
                <p style="font-size: 10px; color: #8a8886; margin: 2px 0 0 0; opacity: 0.6;">Node ID: ${nodeId} • Fetched from Figma</p>
            </div>
        </div>`;
      }
    } catch (error) {
      console.error(
        `Failed to fetch Atlas ${
          options.type === "module" ? "Module" : "Learning Path"
        } Card from Figma:`,
        error
      );
    }

    // Fallback message - don't generate random HTML
    const isModule = options.type === "module";
    const componentLabel = isModule ? "Module Card" : "Learning Path Card";
    const icon = isModule ? "📖" : "📚";

    console.log(
      `⚠️ Falling back to placeholder for Atlas ${componentLabel} (Node: ${nodeId})`
    );
    return `
    <div class="atlas-component ${
      isModule
        ? "atlas-module-card-fallback"
        : "atlas-learning-path-card-fallback"
    }" data-node-id="${nodeId}" data-type="${
      options.type || "learning-path"
    }" style="background: #f8f9fa; padding: 24px; border-radius: 8px; border: 2px dashed #e1e5e9; text-align: center; font-family: 'Segoe UI', system-ui, sans-serif; max-width: 400px;">
        <div style="font-size: 32px; margin-bottom: 12px; opacity: 0.6;">${icon}</div>
        <h3 style="font-size: 16px; font-weight: 600; color: #323130; margin-bottom: 8px;">Atlas ${componentLabel}</h3>
        <p style="font-size: 14px; color: #605e5c; margin-bottom: 12px; line-height: 1.4;">Unable to fetch from Figma Atlas Design Library</p>
        <div style="background: #e1f5fe; padding: 8px 12px; border-radius: 4px; margin-bottom: 8px;">
            <p style="font-size: 12px; color: #0078d4; margin: 0; font-weight: 500;">Node ID: ${nodeId}</p>
        </div>
        <p style="font-size: 11px; color: #a19f9d; margin: 0;">Please check Figma connection and permissions</p>
        <p style="font-size: 10px; color: #c8c6c4; margin: 4px 0 0 0;">Atlas Design Library: uVA2amRR71yJZ0GS6RI6zL</p>
    </div>`;
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

  /**
   * Get Atlas Design Library specific CSS styles
   */
  getAtlasWireframeStyles() {
    return `
      <style>
        /* Atlas Design Library Styles */
        .atlas-component {
          margin: 15px 0;
          border: 2px solid #2563eb;
          border-radius: 8px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          box-shadow: 0 4px 6px rgba(37, 99, 235, 0.1);
          position: relative;
        }

        .atlas-component::before {
          content: 'ATLAS';
          position: absolute;
          top: -8px;
          right: 8px;
          background: #2563eb;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
        }

        .atlas-button-container {
          padding: 15px;
          text-align: center;
        }

        .atlas-button {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .atlas-button-primary {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
        }

        .atlas-button-primary:hover {
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
          transform: translateY(-1px);
        }

        .atlas-button-secondary {
          background: white;
          color: #2563eb;
          border: 2px solid #2563eb;
        }

        .atlas-button-secondary:hover {
          background: #f1f5f9;
          border-color: #1d4ed8;
        }

        .atlas-input-container {
          padding: 15px;
        }

        .atlas-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #1e293b;
        }

        .atlas-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .atlas-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .atlas-card {
          padding: 20px;
          background: white;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
        }

        .atlas-card-header h3 {
          margin: 0 0 12px 0;
          color: #1e293b;
          font-size: 18px;
        }

        .atlas-card-content p {
          margin: 0;
          color: #64748b;
          line-height: 1.5;
        }

        .atlas-navigation {
          padding: 15px;
          background: white;
          border-radius: 6px;
        }

        .atlas-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          gap: 20px;
        }

        .atlas-nav-item {
          margin: 0;
        }

        .atlas-nav-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
          padding: 8px 12px;
          border-radius: 4px;
          transition: background 0.2s ease;
        }

        .atlas-nav-link:hover {
          background: #f1f5f9;
          color: #1d4ed8;
        }

        .atlas-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .atlas-modal {
          background: white;
          border-radius: 8px;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow: hidden;
        }

        .atlas-modal-header {
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .atlas-modal-header h2 {
          margin: 0;
          color: #1e293b;
        }

        .atlas-modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #64748b;
        }

        .atlas-modal-content {
          padding: 20px;
          color: #64748b;
        }

        .atlas-modal-actions {
          padding: 20px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .atlas-hero {
          padding: 60px 40px;
          background: #f5f1eb;
          color: #323130;
          border-radius: 8px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
          min-height: 400px;
          border: 1px solid #e1dfdd;
        }

        .atlas-hero-content {
          text-align: left;
        }

        .atlas-hero-title {
          font-size: 48px;
          font-weight: 700;
          margin: 0 0 20px 0;
          line-height: 1.2;
          color: #323130;
        }

        .atlas-hero-subtitle {
          font-size: 20px;
          color: #605e5c;
          margin: 0 0 30px 0;
          line-height: 1.6;
        }

        .atlas-hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .atlas-hero-visual {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .atlas-hero-placeholder {
          width: 100%;
          height: 300px;
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 600;
          color: white;
          border: 2px dashed rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 768px) {
          .atlas-hero {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 40px 20px;
          }
          
          .atlas-hero-title {
            font-size: 36px;
          }
          
          .atlas-hero-subtitle {
            font-size: 18px;
          }
        }

        .atlas-generic {
          padding: 20px;
          text-align: center;
          background: white;
          border-radius: 6px;
        }

        .atlas-generic h4 {
          margin: 0 0 8px 0;
          color: #1e293b;
        }

        .atlas-generic p {
          margin: 0;
          color: #64748b;
        }

        /* Atlas Layout Styles */
        .atlas-layout-default {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: #f8fafc;
          min-height: 100vh;
        }

        .atlas-layout-dashboard {
          display: grid;
          grid-template-columns: 250px 1fr;
          grid-template-rows: auto 1fr;
          min-height: 100vh;
          background: #f8fafc;
        }

        .atlas-layout-form {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
          background: #f8fafc;
          min-height: 100vh;
        }

        .atlas-layout-cards {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          background: #f8fafc;
          min-height: 100vh;
        }

        .atlas-header {
          padding: 20px 0;
          border-bottom: 2px solid #e2e8f0;
          margin-bottom: 30px;
          text-align: center;
        }

        .atlas-header h1 {
          margin: 0 0 10px 0;
          color: #1e293b;
          font-size: 28px;
        }

        .atlas-header p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .atlas-main {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }

        @media (max-width: 768px) {
          .atlas-layout-dashboard {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto 1fr;
          }
          
          .atlas-main {
            grid-template-columns: 1fr;
          }
        }
      </style>
    `;
  }

  /**
   * Process HTML content and replace Atlas component classes with real Atlas components from Figma
   */
  async processHtmlForAtlasComponents(htmlContent) {
    if (!htmlContent || typeof htmlContent !== "string") {
      return htmlContent;
    }

    try {
      let processedHtml = htmlContent;

      // Define Atlas component patterns and their corresponding replacement functions
      const atlasPatterns = [
        // Hero components
        {
          patterns: [
            /<section[^>]*class\s*=\s*["'][^"']*hero[^"']*["'][^>]*>.*?<\/section>/gis,
            /<header[^>]*class\s*=\s*["'][^"']*hero[^"']*["'][^>]*>.*?<\/header>/gis,
            /<div[^>]*class\s*=\s*["'][^"']*hero[^"']*["'][^>]*>.*?<\/div>/gis,
          ],
          generator: () => this.generateAtlasHeroFromFigma("14647:163530"),
          name: "Hero",
        },

        // Learning Path Card components
        {
          patterns: [
            /<div[^>]*class\s*=\s*["'][^"']*learning[-_]?path[-_]?card[^"']*["'][^>]*>.*?<\/div>/gis,
            /<section[^>]*class\s*=\s*["'][^"']*learning[-_]?path[^"']*["'][^>]*>.*?<\/section>/gis,
            /<article[^>]*class\s*=\s*["'][^"']*learning[-_]?path[^"']*["'][^>]*>.*?<\/article>/gis,
          ],
          generator: () =>
            this.generateAtlasLearningPathCardFromFigma("14315:162386", {
              type: "learning-path",
            }),
          name: "Learning Path Card",
        },

        // Module Card components
        {
          patterns: [
            /<div[^>]*class\s*=\s*["'][^"']*module[-_]?card[^"']*["'][^>]*>.*?<\/div>/gis,
            /<section[^>]*class\s*=\s*["'][^"']*module[^"']*["'][^>]*>.*?<\/section>/gis,
            /<article[^>]*class\s*=\s*["'][^"']*module[^"']*["'][^>]*>.*?<\/article>/gis,
            /<div[^>]*class\s*=\s*["'][^"']*learning[-_]?module[^"']*["'][^>]*>.*?<\/div>/gis,
          ],
          generator: () =>
            this.generateAtlasLearningPathCardFromFigma("14315:162386", {
              type: "module",
            }),
          name: "Module Card",
        },

        // Atlas Button components
        {
          patterns: [
            /<button[^>]*class\s*=\s*["'][^"']*atlas[-_]?button[^"']*["'][^>]*>.*?<\/button>/gis,
            /<a[^>]*class\s*=\s*["'][^"']*atlas[-_]?button[^"']*["'][^>]*>.*?<\/a>/gis,
          ],
          generator: () =>
            this.generateAtlasComponentHtml(
              { name: "Atlas Button", nodeId: "14647:163531" },
              0
            ),
          name: "Button",
        },

        // Atlas Card components (generic)
        {
          patterns: [
            /<div[^>]*class\s*=\s*["'][^"']*atlas[-_]?card[^"']*["'][^>]*>.*?<\/div>/gis,
            /<section[^>]*class\s*=\s*["'][^"']*atlas[-_]?card[^"']*["'][^>]*>.*?<\/section>/gis,
          ],
          generator: () =>
            this.generateAtlasComponentHtml(
              { name: "Atlas Card", nodeId: "14647:163532" },
              0
            ),
          name: "Card",
        },

        // Atlas Navigation components
        {
          patterns: [
            /<nav[^>]*class\s*=\s*["'][^"']*atlas[-_]?nav[^"']*["'][^>]*>.*?<\/nav>/gis,
            /<div[^>]*class\s*=\s*["'][^"']*atlas[-_]?navigation[^"']*["'][^>]*>.*?<\/div>/gis,
          ],
          generator: () =>
            this.generateAtlasComponentHtml(
              { name: "Atlas Navigation", nodeId: "14647:163534" },
              0
            ),
          name: "Navigation",
        },

        // Atlas Input components
        {
          patterns: [
            /<input[^>]*class\s*=\s*["'][^"']*atlas[-_]?input[^"']*["'][^>]*>/gis,
            /<div[^>]*class\s*=\s*["'][^"']*atlas[-_]?input[^"']*["'][^>]*>.*?<\/div>/gis,
          ],
          generator: () =>
            this.generateAtlasComponentHtml(
              { name: "Atlas Input", nodeId: "14647:163533" },
              0
            ),
          name: "Input",
        },

        // Atlas Modal components
        {
          patterns: [
            /<div[^>]*class\s*=\s*["'][^"']*atlas[-_]?modal[^"']*["'][^>]*>.*?<\/div>/gis,
            /<section[^>]*class\s*=\s*["'][^"']*atlas[-_]?dialog[^"']*["'][^>]*>.*?<\/section>/gis,
          ],
          generator: () =>
            this.generateAtlasComponentHtml(
              { name: "Atlas Modal", nodeId: "14647:163535" },
              0
            ),
          name: "Modal",
        },
      ];

      // Process each Atlas component pattern
      for (const atlasComponent of atlasPatterns) {
        for (const pattern of atlasComponent.patterns) {
          const matches = processedHtml.match(pattern);
          if (matches) {
            console.log(
              `🔄 Found ${matches.length} ${atlasComponent.name} component(s) to replace...`
            );

            for (const match of matches) {
              try {
                // Generate the corresponding Atlas component
                const atlasComponentHtml = await atlasComponent.generator();

                // Replace the matched section with Atlas component
                processedHtml = processedHtml.replace(
                  match,
                  atlasComponentHtml
                );

                console.log(
                  `✅ Replaced ${atlasComponent.name} with Atlas component`
                );
              } catch (error) {
                console.error(
                  `❌ Failed to replace ${atlasComponent.name}:`,
                  error.message
                );
                // Continue with the next match if one fails
              }
            }
          }
        }
      }

      return processedHtml;
    } catch (error) {
      console.error("Error processing HTML for Atlas components:", error);
      return htmlContent; // Return original content if processing fails
    }
  }

  /**
   * Enhanced wireframe generation with Atlas component replacement
   */
  async generateFluentWireframeWithAtlasHeroes(components, layout = "default") {
    // Generate the base wireframe
    const baseWireframe = await this.generateWireframeHtml(components, layout);

    // Process the wireframe to replace hero sections with Atlas components
    const enhancedWireframe = await this.processHtmlForAtlasComponents(
      baseWireframe
    );

    return enhancedWireframe;
  }
}

module.exports = FigmaService;
