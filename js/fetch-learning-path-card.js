#!/usr/bin/env node

/**
 * Fetch Real Atlas Learning Path Card Component from Figma
 * This script fetches the actual learning path card from the Figma URL provided by the user
 */

const axios = require("axios");
const path = require("path");

// Load environment variables
require("dotenv").config();

const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const ATLAS_FILE_ID = "uVA2amRR71yJZ0GS6RI6zL"; // From your Figma URL
const LEARNING_PATH_NODE_ID = "49009:263718"; // From your Figma URL

async function fetchLearningPathCard() {
  try {
    console.log("🔄 Fetching Atlas Learning Path Card from Figma...");
    console.log(`📍 Node ID: ${LEARNING_PATH_NODE_ID}`);
    console.log(`📁 File ID: ${ATLAS_FILE_ID}`);

    if (!FIGMA_TOKEN) {
      console.log("❌ No FIGMA_ACCESS_TOKEN found in environment");
      console.log("Please set your Figma access token in .env file");
      return;
    }

    const response = await axios.get(
      `https://api.figma.com/v1/images/${ATLAS_FILE_ID}?ids=${LEARNING_PATH_NODE_ID}&format=png&scale=2`,
      {
        headers: {
          "X-Figma-Token": FIGMA_TOKEN,
        },
      }
    );

    if (
      response.data &&
      response.data.images &&
      response.data.images[LEARNING_PATH_NODE_ID]
    ) {
      const imageUrl = response.data.images[LEARNING_PATH_NODE_ID];
      console.log("✅ Successfully fetched Atlas Learning Path Card!");
      console.log(`🖼️ Image URL: ${imageUrl}`);

      // Extract the image ID from the S3 URL for easier use
      const imageIdMatch = imageUrl.match(/images\/([a-f0-9-]+)/);
      const imageId = imageIdMatch ? imageIdMatch[1] : "unknown";
      console.log(`🔑 Image ID: ${imageId}`);

      // Generate the component HTML that uses the real Figma image
      const componentHTML = `<div style="background: white; padding: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 100%;">
                <img src="${imageUrl}" 
                     alt="Atlas Learning Path Card Component from Figma" 
                     style="width: 100%; height: auto; display: block; object-fit: contain;" />
            </div>`;

      console.log("\n📋 Component HTML:");
      console.log(componentHTML);

      return {
        success: true,
        imageUrl,
        imageId,
        nodeId: LEARNING_PATH_NODE_ID,
        html: componentHTML,
      };
    } else {
      console.log("❌ No image URL returned from Figma API");
      console.log("Response:", JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error("❌ Error fetching from Figma:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the function
fetchLearningPathCard()
  .then((result) => {
    if (result && result.success) {
      console.log("\n🎯 SUCCESS: Ready to update component library!");
      console.log(
        `🔗 Figma source: https://www.figma.com/design/${ATLAS_FILE_ID}/%F0%9F%8C%9E-Atlas-Design-Library?node-id=${LEARNING_PATH_NODE_ID.replace(
          ":",
          "-"
        )}&m=dev`
      );
    }
  })
  .catch((error) => {
    console.error("❌ Script failed:", error.message);
  });
