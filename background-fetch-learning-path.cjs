#!/usr/bin/env node

/**
 * Background Figma Fetcher for Learning Path Card
 * This script will keep trying to fetch the real image in the background
 */

const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const ATLAS_FILE_ID = "uVA2amRR71yJZ0GS6RI6zL";
const LEARNING_PATH_NODE_ID = "14315:162386";

let retryCount = 0;
const maxRetries = 10;
const retryDelay = 5000; // 5 seconds

async function tryFetchLearningPath() {
  console.log(
    `🔄 Attempt ${
      retryCount + 1
    }/${maxRetries} - Fetching Atlas Learning Path Card...`
  );

  try {
    const response = await axios.get(
      `https://api.figma.com/v1/images/${ATLAS_FILE_ID}?ids=${LEARNING_PATH_NODE_ID}&format=png&scale=2`,
      {
        headers: { "X-Figma-Token": FIGMA_TOKEN },
        timeout: 10000, // 10 second timeout
      }
    );

    if (response.data.images && response.data.images[LEARNING_PATH_NODE_ID]) {
      const imageUrl = response.data.images[LEARNING_PATH_NODE_ID];
      console.log("✅ SUCCESS! Got learning path card image:", imageUrl);

      // Save the result
      const result = {
        nodeId: LEARNING_PATH_NODE_ID,
        imageUrl: imageUrl,
        fetchedAt: new Date().toISOString(),
        component: "atlas-learning-path-card",
      };

      fs.writeFileSync(
        "atlas-learning-path-result.json",
        JSON.stringify(result, null, 2)
      );
      console.log("💾 Result saved to atlas-learning-path-result.json");

      // Generate the updated component HTML
      const componentHTML = `<div style="background: white; padding: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); width: 100%;" data-figma-node="${LEARNING_PATH_NODE_ID}" data-figma-file="${ATLAS_FILE_ID}">
                <img src="${imageUrl}" alt="Atlas Learning Path Card from Figma" style="width: 100%; height: auto; display: block;" />
            </div>`;

      console.log("\n📋 Component HTML ready to use:");
      console.log(componentHTML);
      console.log(
        "\n🎯 You can now replace the placeholder in ComponentLibraryModal.tsx"
      );

      return true;
    } else {
      throw new Error("No image URL in response");
    }
  } catch (error) {
    retryCount++;

    if (error.code === "ECONNABORTED") {
      console.log(`⏰ Timeout on attempt ${retryCount}`);
    } else {
      console.log(`❌ Error on attempt ${retryCount}:`, error.message);
    }

    if (retryCount < maxRetries) {
      console.log(`🔄 Retrying in ${retryDelay / 1000} seconds...`);
      setTimeout(tryFetchLearningPath, retryDelay);
    } else {
      console.log(
        "❌ Max retries reached. The API might be temporarily unavailable."
      );
      console.log(
        "💡 The component library has a placeholder - try running this script again later."
      );
    }

    return false;
  }
}

// Start the fetch process
console.log("🚀 Starting background fetch for Atlas Learning Path Card...");
console.log(`📍 Node ID: ${LEARNING_PATH_NODE_ID}`);
console.log(`🔑 Token: ${FIGMA_TOKEN ? "Available" : "Missing"}`);

tryFetchLearningPath();
