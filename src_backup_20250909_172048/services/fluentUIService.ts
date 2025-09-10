/**
 * Fluent UI Integration Service
 * Handles communication with backend Figma/Fluent UI services
 */

import { API_CONFIG, getApiUrl } from "../config/api";

export interface FluentComponent {
  id: string;
  name: string;
  description: string;
  nodeId: string;
  category: string;
}

export interface FluentWireframeRequest {
  nodeIds: string[];
  layout?: string;
  fluentFileKey?: string;
}

export interface FluentWireframeResponse {
  success: boolean;
  html: string;
  components: FluentComponent[];
  layout: string;
  nodeIds: string[];
  timestamp: number;
  fluentUIGenerated: boolean;
}

export class FluentUIService {
  /**
   * Get all available Fluent UI components
   */
  async getFluentComponents(): Promise<{ [key: string]: FluentComponent }> {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.FLUENT_COMPONENTS)
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch Fluent components: ${response.status}`
        );
      }

      const data = await response.json();
      return data.components || {};
    } catch (error) {
      console.error("❌ Failed to get Fluent components:", error);
      throw error;
    }
  }

  /**
   * Search Fluent UI components
   */
  async searchFluentComponents(query: string): Promise<FluentComponent[]> {
    try {
      const response = await fetch(
        getApiUrl(
          `${
            API_CONFIG.ENDPOINTS.FLUENT_COMPONENTS_SEARCH
          }?q=${encodeURIComponent(query)}`
        )
      );

      if (!response.ok) {
        throw new Error(
          `Failed to search Fluent components: ${response.status}`
        );
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("❌ Failed to search Fluent components:", error);
      throw error;
    }
  }

  /**
   * Generate wireframe from Figma node IDs
   */
  async generateFluentWireframe(
    request: FluentWireframeRequest
  ): Promise<FluentWireframeResponse> {
    try {
      console.log("🎨 Generating Fluent UI wireframe:", request);

      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_FLUENT_WIREFRAME),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to generate Fluent wireframe: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("✅ Fluent wireframe generated:", {
        success: data.success,
        componentsCount: data.components?.length || 0,
        htmlLength: data.html?.length || 0,
      });

      return data;
    } catch (error) {
      console.error("❌ Failed to generate Fluent wireframe:", error);
      throw error;
    }
  }

  /**
   * Get component library information
   */
  async getComponentLibrary(): Promise<any> {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.COMPONENT_LIBRARY)
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch component library: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ Failed to get component library:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const fluentUIService = new FluentUIService();
