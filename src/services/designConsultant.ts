/**
 * Design Consultant Agent Service
 *
 * Frontend service to communicate with AI Foundry-powered Design Consultant
 */

interface DesignAnalysis {
  success: boolean;
  analysis?: string;
  model?: string;
  timestamp?: string;
  error?: string;
  fallback?: string;
}

interface QuickTips {
  success: boolean;
  tips?: string;
  type?: string;
  device?: string;
  error?: string;
}

interface AgentResponse {
  success: boolean;
  agent: string;
  powered_by: string;
  model: string;
  analysis?: string;
  tips?: string;
  error?: string;
}

class DesignConsultantService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    // Use environment-specific endpoint
    this.baseUrl = import.meta.env.PROD
      ? "https://func-original-app-pgno4orkguix6.azurewebsites.net/api"
      : "http://localhost:7071/api";

    this.apiKey = import.meta.env.VITE_WIREFRAME_API_KEY || "dev-key-2025";
  }

  /**
   * Get comprehensive design analysis of a wireframe
   */
  async analyzeWireframe(
    wireframeHtml: string,
    userContext: string = ""
  ): Promise<DesignAnalysis> {
    try {
      const response = await fetch(`${this.baseUrl}/designconsultant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
        body: JSON.stringify({
          action: "analyze",
          wireframeHtml,
          userContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: AgentResponse = await response.json();

      return {
        success: result.success,
        analysis: result.analysis,
        model: result.model,
        timestamp: new Date().toISOString(),
        error: result.error,
        fallback: result.success
          ? undefined
          : "Unable to analyze wireframe at this time.",
      };
    } catch (error) {
      console.error("Design Consultant Analysis Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        fallback:
          "🤖 I'm having trouble connecting right now. Please try again in a moment.",
      };
    }
  }

  /**
   * Get quick design tips for specific wireframe types
   */
  async getQuickTips(
    wireframeType: string = "landing page",
    deviceType: string = "desktop"
  ): Promise<QuickTips> {
    try {
      const response = await fetch(`${this.baseUrl}/designconsultant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
        body: JSON.stringify({
          action: "quickTips",
          wireframeType,
          deviceType,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: AgentResponse = await response.json();

      return {
        success: result.success,
        tips: result.tips,
        type: wireframeType,
        device: deviceType,
        error: result.error,
      };
    } catch (error) {
      console.error("Design Consultant Quick Tips Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Format analysis for display in chat
   */
  formatAnalysisMessage(analysis: DesignAnalysis): string {
    if (!analysis.success) {
      return `🤖 **Design Consultant** (Powered by Azure AI Foundry)

${
  analysis.fallback ||
  analysis.error ||
  "Sorry, I encountered an issue analyzing your wireframe."
}

💡 Try again in a moment, or ask me for quick design tips instead!`;
    }

    return `🎨 **Design Consultant Analysis** (Powered by Azure AI Foundry)

${analysis.analysis}

---
*Analysis powered by ${
      analysis.model || "Azure AI"
    } • ${new Date().toLocaleTimeString()}*`;
  }

  /**
   * Format quick tips for display in chat
   */
  formatTipsMessage(tips: QuickTips): string {
    if (!tips.success) {
      return `🤖 **Design Consultant** (Powered by Azure AI Foundry)

Sorry, I couldn't generate tips right now. ${tips.error}`;
    }

    return `💡 **Quick Design Tips** (${tips.type} • ${tips.device})

${tips.tips}

---
*Tips powered by Azure AI Foundry • Ask me to analyze your current wireframe for detailed feedback!*`;
  }

  /**
   * Check if the service is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
        headers: { "x-api-key": this.apiKey },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const designConsultant = new DesignConsultantService();

// Export types for use in components
export type { DesignAnalysis, QuickTips };
