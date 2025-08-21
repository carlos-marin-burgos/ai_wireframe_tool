#!/usr/bin/env node

const axios = require("axios");
require("dotenv").config();

async function testFigmaAPI() {
  const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
  const ATLAS_FILE_ID = "uVA2amRR71yJZ0GS6RI6zL";
  const LEARNING_PATH_NODE_ID = "14315:162386";

  console.log("🧪 Testing Figma API with timeout...");
  console.log(`🔑 Token: ${FIGMA_TOKEN ? "Found" : "Missing"}`);
  console.log(`📁 File ID: ${ATLAS_FILE_ID}`);
  console.log(`🎯 Node ID: ${LEARNING_PATH_NODE_ID}`);

  try {
    const response = await axios.get(
      `https://api.figma.com/v1/images/${ATLAS_FILE_ID}?ids=${LEARNING_PATH_NODE_ID}&format=png&scale=2`,
      {
        headers: {
          "X-Figma-Token": FIGMA_TOKEN,
        },
        timeout: 15000, // 15 second timeout
      }
    );

    console.log("✅ API Response received!");
    console.log("📊 Response data:", JSON.stringify(response.data, null, 2));

    if (response.data.images && response.data.images[LEARNING_PATH_NODE_ID]) {
      const imageUrl = response.data.images[LEARNING_PATH_NODE_ID];
      console.log("🖼️ Image URL:", imageUrl);

      // Update the component immediately
      console.log("\n🔄 Updating component library...");
      const componentHTML = `<div style="background: white; padding: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 100%;" data-figma-node="${LEARNING_PATH_NODE_ID}" data-figma-file="${ATLAS_FILE_ID}">
                <img src="${imageUrl}" alt="Atlas Learning Path Card from Figma" style="width: 100%; height: auto; display: block;" />
            </div>`;

      console.log("✅ Component HTML ready:");
      console.log(componentHTML);
    } else {
      console.log("❌ No image URL in response");
    }
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.log("⏰ Request timed out after 15 seconds");
    } else {
      console.log("❌ Error:", error.message);
      if (error.response) {
        console.log("📊 Status:", error.response.status);
        console.log("📄 Response:", error.response.data);
      }
    }
  }
}

testFigmaAPI();
