/**
 * 🚀 MAXIMUM AI MODE CONTROLLER
 *
 * This file controls whether to use:
 * - Current mode: 2 AI calls (emergency optimized)
 * - Maximum mode: 11+ AI calls (world-class)
 */

// Configuration - SET THIS TO TRUE AFTER AZURE OPENAI UPGRADE
const MAXIMUM_AI_MODE = {
  enabled: false, // Change to true after upgrading Azure OpenAI tier
  reason: "Waiting for Azure OpenAI tier upgrade",
  requiredTier: "Standard S1+ or Pay-as-you-go",
  requiredQuota: "120,000+ TPM (tokens per minute)",
  costPerWireframe: "~$0.33 (vs $0.06 in current mode)",
};

// Current mode stats
const CURRENT_MODE = {
  aiCalls: 2,
  tokensPerWireframe: 4000,
  costPerWireframe: "$0.06",
  powerLevel: "35%",
  quality: "Smart and functional",
};

// Maximum mode stats
const MAXIMUM_MODE = {
  aiCalls: 11,
  tokensPerWireframe: 11700,
  costPerWireframe: "$0.33",
  powerLevel: "100%",
  quality: "World-class professional",
};

function shouldUseMaximumAI() {
  return MAXIMUM_AI_MODE.enabled;
}

function getAIModeStatus() {
  return {
    currentMode: shouldUseMaximumAI() ? "MAXIMUM" : "CURRENT",
    aiCalls: shouldUseMaximumAI() ? MAXIMUM_MODE.aiCalls : CURRENT_MODE.aiCalls,
    powerLevel: shouldUseMaximumAI()
      ? MAXIMUM_MODE.powerLevel
      : CURRENT_MODE.powerLevel,
    quality: shouldUseMaximumAI() ? MAXIMUM_MODE.quality : CURRENT_MODE.quality,
    costPerWireframe: shouldUseMaximumAI()
      ? MAXIMUM_MODE.costPerWireframe
      : CURRENT_MODE.costPerWireframe,

    // Configuration info
    maxAIEnabled: MAXIMUM_AI_MODE.enabled,
    reason: MAXIMUM_AI_MODE.reason,
    upgradeRequired: !MAXIMUM_AI_MODE.enabled,
  };
}

function logAIModeStatus() {
  const status = getAIModeStatus();

  console.log("🤖 AI MODE STATUS");
  console.log("================");
  console.log(`Mode: ${status.currentMode}`);
  console.log(`AI Calls: ${status.aiCalls} per wireframe`);
  console.log(`Power Level: ${status.powerLevel}`);
  console.log(`Quality: ${status.quality}`);
  console.log(`Cost: ${status.costPerWireframe} per wireframe`);

  if (status.upgradeRequired) {
    console.log("");
    console.log("⚠️ MAXIMUM AI MODE AVAILABLE");
    console.log("Required: Azure OpenAI Standard tier upgrade");
    console.log("Benefit: 11 AI calls, world-class quality");
    console.log("Cost: ~$0.33 per wireframe");
  }

  console.log("");
}

// Instructions for enabling maximum AI mode
const ENABLE_MAXIMUM_AI_INSTRUCTIONS = `
🚀 TO ENABLE MAXIMUM AI MODE:

1. Upgrade Azure OpenAI tier:
   - Go to Azure Portal → Your OpenAI resource → Pricing tier
   - Upgrade from S0 to Standard S1+ or Pay-as-you-go
   
2. Request quota increase:
   - Visit: https://aka.ms/oai/quotaincrease
   - Request: 120,000+ TPM (tokens per minute)
   
3. Enable maximum mode:
   - In backend/MaximumAIModeController.js
   - Change: MAXIMUM_AI_MODE.enabled = true
   
4. Restart your backend service

RESULT: 11-stage AI pipeline creating world-class wireframes!
`;

module.exports = {
  shouldUseMaximumAI,
  getAIModeStatus,
  logAIModeStatus,
  MAXIMUM_AI_MODE,
  CURRENT_MODE,
  MAXIMUM_MODE,
  ENABLE_MAXIMUM_AI_INSTRUCTIONS,
};
