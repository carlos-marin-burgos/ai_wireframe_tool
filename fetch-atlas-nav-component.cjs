#!/usr/bin/env node

/**
 * Fetch Specific Atlas Navigation Component from Figma
 * This script fetches the navigation component from the Figma URL provided by the user
 * URL:   <!-- Profile Section -->
  <div style="display: flex; align-items: center; gap: 8px;">
    <!-- User Avatar with Mina image -->
    <img src="mina.png" alt="Mina" style="
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e1e1e1;
    " />
    <!-- CXS Logo -->
    <img src="/cxsLogo.png" alt="CXS Logo" style="height: 30px; object-fit: contain; margin-left: 8px;" />
  </div>/www.figma.com/design/uVA2amRR71yJZ0GS6RI6zL/%F0%9F%8C%9E-Atlas-Design-Library?node-id=11530-113245&m=dev
 */

const axios = require("axios");
const path = require("path");
const fs = require("fs");

// Load environment variables
require("dotenv").config();

const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const ATLAS_FILE_ID = "uVA2amRR71yJZ0GS6RI6zL"; // From your Figma URL
const NAVIGATION_NODE_ID = "11530-113245"; // From your specific node URL

async function fetchAtlasNavComponent() {
  try {
    console.log("🔄 Fetching Atlas Navigation Component from Figma...");
    console.log(`📍 Node ID: ${NAVIGATION_NODE_ID}`);
    console.log(`📁 File ID: ${ATLAS_FILE_ID}`);

    if (!FIGMA_TOKEN) {
      console.log("❌ No FIGMA_ACCESS_TOKEN found in environment");
      console.log("Please set your Figma access token in .env file");
      return;
    }

    console.log("✅ Figma token found in environment");

    // First, get the node details to understand its structure
    const nodeResponse = await axios.get(
      `https://api.figma.com/v1/files/${ATLAS_FILE_ID}/nodes?ids=${NAVIGATION_NODE_ID}`,
      {
        headers: {
          "X-Figma-Token": FIGMA_TOKEN,
        },
      }
    );

    console.log("📋 Node details fetched successfully");
    console.log(
      "Node structure:",
      JSON.stringify(nodeResponse.data.nodes[NAVIGATION_NODE_ID], null, 2)
    );

    // Get the image for this component
    const imageResponse = await axios.get(
      `https://api.figma.com/v1/images/${ATLAS_FILE_ID}?ids=${NAVIGATION_NODE_ID}&format=png&scale=2`,
      {
        headers: {
          "X-Figma-Token": FIGMA_TOKEN,
        },
      }
    );

    if (
      imageResponse.data &&
      imageResponse.data.images &&
      imageResponse.data.images[NAVIGATION_NODE_ID]
    ) {
      const imageUrl = imageResponse.data.images[NAVIGATION_NODE_ID];
      console.log("✅ Successfully fetched Atlas Navigation Component!");
      console.log("🖼️ Image URL:", imageUrl);

      // Create HTML template for this navigation component
      const navHTML = generateNavHTML(
        nodeResponse.data.nodes[NAVIGATION_NODE_ID],
        imageUrl
      );

      // Save the component data for integration
      const componentData = {
        nodeId: NAVIGATION_NODE_ID,
        name: "Atlas/TopNav",
        description: "Atlas top navigation component for all wireframes",
        imageUrl: imageUrl,
        html: navHTML,
        fetched: new Date().toISOString(),
        url: `https://www.figma.com/design/${ATLAS_FILE_ID}?node-id=${NAVIGATION_NODE_ID}&m=dev`,
      };

      // Save to JSON file for backend integration
      const outputPath = path.join(
        __dirname,
        "backend/components/atlas-nav-component.json"
      );
      fs.writeFileSync(outputPath, JSON.stringify(componentData, null, 2));

      // Save HTML template
      const htmlOutputPath = path.join(
        __dirname,
        "backend/components/atlas-nav-template.html"
      );
      fs.writeFileSync(htmlOutputPath, navHTML);

      console.log("💾 Component data saved to:", outputPath);
      console.log("📄 HTML template saved to:", htmlOutputPath);

      return componentData;
    } else {
      console.log("❌ Failed to fetch navigation component image");
      console.log("Response:", imageResponse.data);
      return null;
    }
  } catch (error) {
    console.error(
      "❌ Error fetching Atlas Navigation Component:",
      error.message
    );
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    return null;
  }
}

function generateNavHTML(nodeData, imageUrl) {
  // Generate a clean HTML representation of the navigation
  const node = nodeData.document;

  return `
<!-- Atlas Top Navigation - Always Present -->
<header class="atlas-top-navigation" data-node-id="${NAVIGATION_NODE_ID}" style="
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 24px;
  gap: 21px;
  width: 100%;
  height: 54px;
  box-sizing: border-box;
  background: #FFFFFF;
  border-bottom: 1px solid #E0E0E0;
  position: sticky;
  top: 0;
  z-index: 1000;
">
  <!-- Logo & Menu Section -->
  <div style="display: flex; flex-direction: row; align-items: center; padding: 0px; gap: 16px; flex-grow: 1;">
    <!-- Logo Container -->
    <div style="display: flex; flex-direction: row; align-items: center; padding: 0px; gap: 13px;">
      <!-- Microsoft Logo -->
      <div style="position: relative; width: 26px; height: 26px;">
        <div style="position: absolute; top: 0; left: 0; width: 12px; height: 12px; background: #F26522;"></div>
        <div style="position: absolute; top: 0; right: 0; width: 12px; height: 12px; background: #8DC63F;"></div>
        <div style="position: absolute; bottom: 0; left: 0; width: 12px; height: 12px; background: #00AEEF;"></div>
        <div style="position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; background: #FFC20E;"></div>
      </div>
      <!-- Separator -->
      <div style="width: 2px; height: 24px; background: #2F2F2F;"></div>
      <!-- Site Title -->
      <span class="ms-learn-brand">Learn</span>
    </div>
    
    <!-- Navigation Menu -->
    <nav class="wireframe-nav">
      <div class="wireframe-nav-item">
        <span class="wireframe-nav-link">Browse</span>
      </div>
      <div class="wireframe-nav-item">
        <span class="wireframe-nav-link">Reference</span>
      </div>
      <div class="wireframe-nav-item">
        <span class="wireframe-nav-link">Learn</span>
      </div>
      <div class="wireframe-nav-item">
        <span class="wireframe-nav-link">Q&A</span>
      </div>
    </nav>
  </div>
  
  <!-- Profile Section -->
  <div style="display: flex; align-items: center; gap: 8px;">
    <!-- User Avatar with Mona text -->
    <div style="padding: 8px 16px; background: #f5f5f5; border: 1px solid #e1e1e1; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: #323130; font-weight: 600; font-size: 14px; font-family: 'Segoe UI', sans-serif;">Mona</div>
    <!-- CXS Logo -->
    <img src="/cxsLogo.png" alt="CXS Logo" style="height: 30px; object-fit: contain; margin-left: 8px;" />
  </div>
</header>
  `;
}

// Run the function
fetchAtlasNavComponent()
  .then((result) => {
    if (result && result.nodeId) {
      console.log(
        "\n🎯 SUCCESS: Atlas Navigation Component fetched and ready!"
      );
      console.log(`📍 Node ID: ${result.nodeId}`);
      console.log(`🎨 Component Name: ${result.name}`);
      console.log(`🔗 Figma URL: ${result.url}`);
      console.log("\n📋 Next steps:");
      console.log("1. Update FigmaService.js with new node ID");
      console.log("2. Update HeroGenerator.js to always use this navigation");
      console.log("3. Add component to Atlas library");
    } else {
      console.log("❌ Failed to fetch Atlas Navigation Component");
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("💥 Script failed:", error.message);
    process.exit(1);
  });
