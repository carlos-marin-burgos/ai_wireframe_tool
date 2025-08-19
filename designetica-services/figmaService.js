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
    this.axiosInstance = this.createAxiosInstance();
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
}

module.exports = FigmaService;
