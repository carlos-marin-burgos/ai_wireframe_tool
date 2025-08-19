/**
 * 🔄 DUAL OPENAI RESOURCE MANAGER
 *
 * Manages two OpenAI resources for optimal cost and performance:
 * - Resource 1: Current mode (S0 tier) - 2 AI calls
 * - Resource 2: Maximum AI mode (Standard tier) - 11 AI calls
 */

const RESOURCE_CONFIGURATIONS = {
  // Current resource (what you're using now)
  current: {
    name: "cog-designetica-vdlmicyosd4ua",
    endpoint: "https://cog-designetica-vdlmicyosd4ua.openai.azure.com/",
    key: "CnGZHVd6QVM4mHigBcWm7tQ2yqoGIHiImCozLODvVXBAG2QVUWp1JQQJ99BHACYeBjFXJ3w3AAABACOGFPTI",
    deployment: "gpt-4o",
    tier: "S0 (assumed)",
    purpose: "Current mode - 2 AI calls",
    costPerWireframe: "$0.06",
    rateLimits: "Low (S0 tier)",
  },

  // Second resource (for load balancing)
  secondary: {
    name: "cog-production-txknroiw7uvto",
    endpoint: "https://cog-production-txknroiw7uvto.openai.azure.com/",
    key: "CJ3vHaBTCpX5lr6I7IsKMxtK1BZD0rmGPqDgjhNydBOy9IE55E0tJQQJ99BHACYeBjFXJ3w3AAABACOGsQ0c",
    deployment: "gpt-4o",
    tier: "S0 (free with credits)",
    purpose: "Load balancing - 2 AI calls",
    costPerWireframe: "Free (using credits)",
    rateLimits: "S0 tier (same as primary)",
  },
};

const DUAL_RESOURCE_BENEFITS = {
  costOptimization: [
    "Use both S0 resources with your Azure credits",
    "Double your quota without spending money",
    "Automatic load balancing between resources",
  ],

  reliability: [
    "Automatic fallback if one resource hits rate limits",
    "Never completely blocked from generating wireframes",
    "Load balancing across both S0 resources",
  ],

  flexibility: [
    "Intelligent resource selection",
    "Seamless switching between resources",
    "Maximum uptime with free credits",
  ],
};

// Smart resource selection logic for S0 load balancing
function selectOptimalResource(
  lastUsedResource,
  primaryQuotaStatus,
  secondaryQuotaStatus
) {
  // Try to alternate between resources for load balancing
  if (lastUsedResource === "current") {
    if (secondaryQuotaStatus.available) {
      return "secondary"; // Switch to secondary resource
    } else if (primaryQuotaStatus.available) {
      console.log("🔄 Secondary resource busy, using primary");
      return "current"; // Fallback to primary
    } else {
      throw new Error("Both resources at quota limit - wait 60 seconds");
    }
  } else {
    if (primaryQuotaStatus.available) {
      return "current"; // Switch to primary resource
    } else if (secondaryQuotaStatus.available) {
      console.log("� Primary resource busy, using secondary");
      return "secondary"; // Fallback to secondary
    } else {
      throw new Error("Both resources at quota limit - wait 60 seconds");
    }
  }
}

// Configuration for different scenarios
const UPGRADE_SCENARIOS = {
  scenario1: {
    name: "Upgrade Second Resource Only",
    description: "Keep current resource as-is, upgrade the second one",
    steps: [
      "Identify your second OpenAI resource in Azure Portal",
      "Upgrade second resource to Standard S1+",
      "Configure dual-resource system",
      "Use current resource for normal mode, second for maximum AI",
    ],
    cost: "Only pay premium for maximum AI usage",
  },

  scenario2: {
    name: "Upgrade Current Resource",
    description: "Upgrade the resource you're already using",
    steps: [
      "Upgrade cog-designetica-vdlmicyosd4ua to Standard",
      "Keep second resource as backup on S0",
      "Configure automatic failover",
      "Enjoy both modes on primary resource",
    ],
    cost: "Pay premium for all usage, but get maximum reliability",
  },

  scenario3: {
    name: "Smart Hybrid Approach",
    description: "Configure intelligent switching between resources",
    steps: [
      "Upgrade one resource to Standard",
      "Keep one resource on S0",
      "Implement smart resource selection",
      "Automatic cost optimization",
    ],
    cost: "Optimal cost - premium only when needed",
    recommended: true,
  },
};

console.log("🔄 DUAL OPENAI RESOURCE ANALYSIS");
console.log("=================================");
console.log("");
console.log("📊 CURRENT CONFIGURATION:");
console.log(`Resource 1: ${RESOURCE_CONFIGURATIONS.current.name}`);
console.log(`Endpoint: ${RESOURCE_CONFIGURATIONS.current.endpoint}`);
console.log(`Purpose: ${RESOURCE_CONFIGURATIONS.current.purpose}`);
console.log("");
console.log("❓ NEED TO IDENTIFY:");
console.log("• What is your second OpenAI resource name?");
console.log("• What is the endpoint of your second resource?");
console.log("• Which resource would you prefer to upgrade?");
console.log("");
console.log("💡 RECOMMENDED APPROACH:");
console.log("1. Upgrade your second resource to Standard tier");
console.log("2. Keep current resource (cog-designetica-vdlmicyosd4ua) on S0");
console.log("3. Use current for normal mode, second for maximum AI");
console.log("4. Only pay premium when using maximum AI features");

module.exports = {
  RESOURCE_CONFIGURATIONS,
  DUAL_RESOURCE_BENEFITS,
  selectOptimalResource,
  UPGRADE_SCENARIOS,
};
