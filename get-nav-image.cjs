#!/usr/bin/env node

const axios = require("axios");
require("dotenv").config();

const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const ATLAS_FILE_ID = "uVA2amRR71yJZ0GS6RI6zL";
const NAVIGATION_NODE_ID = "11530-113245";

async function getNavImage() {
  try {
    console.log("🔄 Getting fresh Atlas Navigation image...");

    if (!FIGMA_TOKEN) {
      console.log("❌ No FIGMA_ACCESS_TOKEN found");
      return;
    }

    const imageResponse = await axios.get(
      `https://api.figma.com/v1/images/${ATLAS_FILE_ID}?ids=${NAVIGATION_NODE_ID}&format=png&scale=2`,
      {
        headers: {
          "X-Figma-Token": FIGMA_TOKEN,
        },
      }
    );

    if (imageResponse.data && imageResponse.data.images) {
      const imageUrl = imageResponse.data.images[NAVIGATION_NODE_ID];
      console.log("✅ Fresh image URL:", imageUrl);
      return imageUrl;
    } else {
      console.log("❌ No image data received");
      console.log("Response:", imageResponse.data);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
  }
}

getNavImage();
