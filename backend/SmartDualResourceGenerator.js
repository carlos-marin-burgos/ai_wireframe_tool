/**
 * 🔄 SMART DUAL RESOURCE WIREFRAME GENERATOR
 *
 * Automatically switches between your two S0 OpenAI resources to:
 * - Double your quota capacity
 * - Avoid rate limits
 * - Use your Azure credits efficiently
 */

const { OpenAI } = require("openai");

class SmartDualResourceGenerator {
  constructor() {
    this.lastUsedResource = "current";
    this.resourceClients = {};
    this.resourceStatus = {
      current: { available: true, lastError: null },
      secondary: { available: true, lastError: null },
    };

    this.initializeResources();
  }

  initializeResources() {
    // Primary resource (current)
    this.resourceClients.current = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_KEY,
      baseURL: `${process.env.AZURE_OPENAI_ENDPOINT.replace(
        /\/$/,
        ""
      )}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o"}`,
      defaultQuery: {
        "api-version":
          process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview",
      },
      defaultHeaders: { "api-key": process.env.AZURE_OPENAI_KEY },
    });

    // Secondary resource (cog-production-txknroiw7uvto)
    // We'll need to get the key for this resource
    const secondaryEndpoint =
      "https://cog-production-txknroiw7uvto.openai.azure.com/";
    const secondaryKey =
      process.env.AZURE_OPENAI_SECONDARY_KEY || "NEED_TO_SET_THIS";

    if (secondaryKey !== "NEED_TO_SET_THIS") {
      this.resourceClients.secondary = new OpenAI({
        apiKey: secondaryKey,
        baseURL: `${secondaryEndpoint}/openai/deployments/${
          process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o"
        }`,
        defaultQuery: {
          "api-version":
            process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview",
        },
        defaultHeaders: { "api-key": secondaryKey },
      });
    } else {
      console.log("⚠️ Secondary resource key not configured yet");
    }
  }

  // Smart resource selection
  selectOptimalResource() {
    // Try to alternate between resources for load balancing
    if (this.lastUsedResource === "current") {
      if (
        this.resourceStatus.secondary.available &&
        this.resourceClients.secondary
      ) {
        return "secondary";
      } else if (this.resourceStatus.current.available) {
        return "current";
      }
    } else {
      if (this.resourceStatus.current.available) {
        return "current";
      } else if (
        this.resourceStatus.secondary.available &&
        this.resourceClients.secondary
      ) {
        return "secondary";
      }
    }

    throw new Error("Both resources unavailable - quota limits exceeded");
  }

  // Make AI call with automatic resource switching
  async makeAICall(prompt, maxTokens = 2000) {
    const maxRetries = 2;
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const selectedResource = this.selectOptimalResource();
        const client = this.resourceClients[selectedResource];

        console.log(
          `🔄 Using ${selectedResource} resource (attempt ${attempt + 1})`
        );

        const response = await client.chat.completions.create({
          model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          max_tokens: maxTokens,
          temperature: 0.7,
        });

        // Success - update status and record usage
        this.resourceStatus[selectedResource].available = true;
        this.resourceStatus[selectedResource].lastError = null;
        this.lastUsedResource = selectedResource;

        return {
          content: response.choices[0]?.message?.content || "",
          resourceUsed: selectedResource,
          success: true,
        };
      } catch (error) {
        lastError = error;

        // Check if it's a rate limit error
        if (
          error.message?.includes("429") ||
          error.message?.includes("rate limit")
        ) {
          console.log(
            `🚦 Rate limit hit on ${this.selectOptimalResource()} - marking unavailable`
          );
          const failedResource = this.selectOptimalResource();
          this.resourceStatus[failedResource].available = false;
          this.resourceStatus[failedResource].lastError = error.message;

          // Try the other resource
          continue;
        } else {
          // Non-rate-limit error, don't retry
          throw error;
        }
      }
    }

    // All attempts failed
    throw new Error(`All resources failed: ${lastError.message}`);
  }

  // Enhanced wireframe generation with dual resources
  async generateWireframe(description) {
    console.log("🔄 SMART DUAL RESOURCE WIREFRAME GENERATION");
    console.log("==========================================");

    const startTime = Date.now();

    try {
      // Load component library
      const availableComponents = await this.loadComponentLibrary();
      console.log(`📦 Loaded ${availableComponents.length} components`);

      // Component analysis (AI Call 1)
      const componentAnalysis = await this.makeAICall(
        `
Analyze this Microsoft Learn wireframe request: "${description}"

Available components:
${availableComponents
  .map((comp, index) => `${index + 1}. ${comp.name} - ${comp.description}`)
  .join("\n")}

Select the best components and provide integration guidance for Microsoft Learn platform.

Respond in JSON format:
{
  "recommendedComponents": [1, 3, 5],
  "reasoning": "...",
  "adaptations": "..."
}`,
        800
      );

      let selectedComponents = [];
      try {
        const analysis = JSON.parse(componentAnalysis.content);
        selectedComponents =
          analysis.recommendedComponents
            ?.map((index) => availableComponents[index - 1])
            .filter((comp) => comp) || [];
      } catch (e) {
        console.log("⚠️ Component analysis parsing failed, using fallback");
      }

      // Wireframe generation (AI Call 2)
      const wireframeResult = await this.makeAICall(
        `
Create a complete HTML wireframe for Microsoft Learn: "${description}"

Selected Components:
${selectedComponents
  .map((comp) => `- ${comp.name}: ${comp.htmlCode.substring(0, 200)}...`)
  .join("\n")}

Requirements:
- Start with Microsoft Learn header template
- Use Segoe UI font family 
- Include recommended components naturally
- Make it responsive and accessible
- Focus on educational content patterns

Generate ONLY the HTML code (starting with <!DOCTYPE html>).`,
        2000
      );

      const processingTime = Date.now() - startTime;

      return {
        html: wireframeResult.content,
        resourcesUsed: [
          componentAnalysis.resourceUsed,
          wireframeResult.resourceUsed,
        ],
        componentsAnalyzed: availableComponents.length,
        componentsSelected: selectedComponents.length,
        processingTimeMs: processingTime,
        dualResourceMode: true,
      };
    } catch (error) {
      console.error("❌ Dual resource generation failed:", error);
      throw error;
    }
  }

  // Load component library
  async loadComponentLibrary() {
    try {
      const fs = require("fs");
      const path = require("path");

      const libraryPath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "fluent-library.json"
      );
      if (fs.existsSync(libraryPath)) {
        const libraryData = JSON.parse(fs.readFileSync(libraryPath, "utf8"));
        return libraryData.components || [];
      }
      return [];
    } catch (error) {
      console.error("Error loading component library:", error);
      return [];
    }
  }

  // Get system status
  getSystemStatus() {
    return {
      mode: "Smart Dual Resource",
      resources: {
        current: {
          name: "cog-designetica-vdlmicyosd4ua",
          status: this.resourceStatus.current.available
            ? "Available"
            : "Rate Limited",
          lastError: this.resourceStatus.current.lastError,
        },
        secondary: {
          name: "cog-production-txknroiw7uvto",
          status: this.resourceStatus.secondary.available
            ? "Available"
            : "Rate Limited",
          configured: !!this.resourceClients.secondary,
          lastError: this.resourceStatus.secondary.lastError,
        },
      },
      lastUsedResource: this.lastUsedResource,
      benefits: [
        "Double quota capacity using both S0 resources",
        "Automatic failover when rate limits hit",
        "Free usage with your Azure credits",
        "Load balancing for better performance",
      ],
    };
  }
}

module.exports = SmartDualResourceGenerator;
