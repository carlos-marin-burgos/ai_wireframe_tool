/**
 * Lovable-Style Wireframe Service
 * Frontend service for iterative AI wireframe generation and refinement
 */

interface WireframeMetadata {
  model?: string;
  tokens?: number;
  processingTimeMs?: number;
  refinementNumber?: number;
  generatedAt?: string;
}

interface GenerateResponse {
  success: boolean;
  html: string;
  metadata?: WireframeMetadata;
  error?: string;
}

interface RefineResponse {
  success: boolean;
  html: string;
  metadata?: WireframeMetadata;
  error?: string;
}

interface ConversationEntry {
  feedback: string;
  response?: string;
  timestamp?: string;
}

class LovableWireframeService {
  private baseUrl: string;
  private conversationHistory: ConversationEntry[] = [];

  constructor(baseUrl: string = "http://localhost:7071/api") {
    this.baseUrl = baseUrl;
  }

  /**
   * Generate initial wireframe (Lovable-style with Claude)
   */
  async generate(
    description: string,
    options: {
      theme?: string;
      colorScheme?: string;
      websiteAnalysis?: any;
    } = {}
  ): Promise<GenerateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generateWireframe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          theme: options.theme || "professional",
          colorScheme: options.colorScheme || "blue",
          websiteAnalysis: options.websiteAnalysis,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      // Reset conversation history for new generation
      this.conversationHistory = [];

      return data;
    } catch (error) {
      console.error("Wireframe generation failed:", error);
      throw error;
    }
  }

  /**
   * Refine existing wireframe based on feedback (Lovable-style iteration)
   */
  async refine(currentHtml: string, feedback: string): Promise<RefineResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/refineWireframe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentHtml,
          feedback,
          conversationHistory: this.conversationHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Refinement failed");
      }

      // Add to conversation history
      this.conversationHistory.push({
        feedback,
        response: "Wireframe refined",
        timestamp: new Date().toISOString(),
      });

      return data;
    } catch (error) {
      console.error("Wireframe refinement failed:", error);
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  getConversationHistory(): ConversationEntry[] {
    return [...this.conversationHistory];
  }

  /**
   * Clear conversation history
   */
  clearConversationHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Get refinement count
   */
  getRefinementCount(): number {
    return this.conversationHistory.length;
  }
}

// Export singleton instance
export const lovableWireframeService = new LovableWireframeService();
export default lovableWireframeService;
