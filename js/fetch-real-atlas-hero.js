#!/usr/bin/env node

/**
 * Fetch Real Atlas Hero Component from Figma
 * This script fetches the actual Atlas Hero from the Figma URL provided by the user
 */

const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

// Atlas Design Library details from user's URL
const FIGMA_TOKEN =
  process.env.FIGMA_ACCESS_TOKEN ||
  "figd_GgDW0X-9x98osaRbrkDNffeaWKbVjP6cJ6ZMUS5G";
const ATLAS_FILE_ID = "uVA2amRR71yJZ0GS6RI6zL"; // From user's URL
const ATLAS_HERO_NODE_ID = "14647:163530"; // From user's URL

async function fetchRealAtlasHero() {
  try {
    console.log("🔄 Fetching real Atlas Hero component from Figma...");
    console.log(`📁 File ID: ${ATLAS_FILE_ID}`);
    console.log(`🎯 Node ID: ${ATLAS_HERO_NODE_ID}`);

    // Fetch the Atlas Hero component image
    const imageResponse = await axios.get(
      `https://api.figma.com/v1/images/${ATLAS_FILE_ID}?ids=${ATLAS_HERO_NODE_ID}&format=png&scale=2`,
      {
        headers: {
          "X-Figma-Token": FIGMA_TOKEN,
        },
      }
    );

    if (
      imageResponse.data.images &&
      imageResponse.data.images[ATLAS_HERO_NODE_ID]
    ) {
      const imageUrl = imageResponse.data.images[ATLAS_HERO_NODE_ID];
      console.log("✅ Successfully fetched Atlas Hero image URL:", imageUrl);

      // Generate HTML for the real Atlas Hero component
      const atlasHeroHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Real Atlas Hero Component</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
            background: #f5f5f5;
        }
        .atlas-hero-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .atlas-hero-header {
            background: linear-gradient(135deg, #8E9AAF, #68769C);
            color: white;
            padding: 20px;
            text-align: center;
        }
        .atlas-hero-image {
            width: 100%;
            height: auto;
            display: block;
            border: none;
        }
        .atlas-hero-footer {
            padding: 20px;
            background: #f8f9fa;
            border-top: 1px solid #e1e5e9;
        }
        .atlas-hero-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 16px;
        }
        .atlas-hero-detail {
            background: white;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e1e5e9;
        }
        .atlas-hero-detail-label {
            font-size: 12px;
            font-weight: 600;
            color: #68769C;
            margin-bottom: 4px;
            text-transform: uppercase;
        }
        .atlas-hero-detail-value {
            font-size: 14px;
            color: #3C4858;
            word-break: break-all;
        }
        .atlas-hero-link {
            display: inline-block;
            background: #8E9AAF;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: background 0.2s ease;
        }
        .atlas-hero-link:hover {
            background: #68769C;
        }
    </style>
</head>
<body>
    <div class="atlas-hero-container">
        <div class="atlas-hero-header">
            <h1>🎨 Real Atlas Design Library Hero</h1>
            <p>Fetched directly from Figma Atlas Design Library</p>
        </div>
        
        <img src="${imageUrl}" alt="Atlas Hero Component from Figma" class="atlas-hero-image" />
        
        <div class="atlas-hero-footer">
            <div class="atlas-hero-info">
                <div class="atlas-hero-detail">
                    <div class="atlas-hero-detail-label">Source</div>
                    <div class="atlas-hero-detail-value">Atlas Design Library</div>
                </div>
                <div class="atlas-hero-detail">
                    <div class="atlas-hero-detail-label">File ID</div>
                    <div class="atlas-hero-detail-value">${ATLAS_FILE_ID}</div>
                </div>
                <div class="atlas-hero-detail">
                    <div class="atlas-hero-detail-label">Node ID</div>
                    <div class="atlas-hero-detail-value">${ATLAS_HERO_NODE_ID}</div>
                </div>
                <div class="atlas-hero-detail">
                    <div class="atlas-hero-detail-label">Image URL</div>
                    <div class="atlas-hero-detail-value">${imageUrl}</div>
                </div>
            </div>
            
            <div style="text-align: center;">
                <a href="https://www.figma.com/design/${ATLAS_FILE_ID}/%F0%9F%8C%9E-Atlas-Design-Library?m=auto&node-id=${ATLAS_HERO_NODE_ID.replace(
        ":",
        "-"
      )}" 
                   target="_blank" 
                   class="atlas-hero-link">
                    🔗 View in Figma Atlas Design Library
                </a>
            </div>
        </div>
    </div>
</body>
</html>`;

      // Save the HTML file
      fs.writeFileSync("real-atlas-hero-output.html", atlasHeroHTML);
      console.log(
        "✅ Real Atlas Hero HTML saved to: real-atlas-hero-output.html"
      );
      console.log(
        `📏 File size: ${fs.statSync("real-atlas-hero-output.html").size} bytes`
      );

      return {
        success: true,
        imageUrl,
        htmlFile: "real-atlas-hero-output.html",
        figmaUrl: `https://www.figma.com/design/${ATLAS_FILE_ID}/%F0%9F%8C%9E-Atlas-Design-Library?m=auto&node-id=${ATLAS_HERO_NODE_ID.replace(
          ":",
          "-"
        )}`,
      };
    } else {
      throw new Error("No image URL returned from Figma API");
    }
  } catch (error) {
    console.error("❌ Failed to fetch real Atlas Hero:", error.message);
    if (error.response) {
      console.error("API Response Status:", error.response.status);
      console.error("API Response Data:", error.response.data);
    }
    return { success: false, error: error.message };
  }
}

// Run the script
if (require.main === module) {
  fetchRealAtlasHero().then((result) => {
    if (result.success) {
      console.log("\n🎉 SUCCESS! Real Atlas Hero component fetched and saved.");
      console.log(`🌐 View the result: open real-atlas-hero-output.html`);
      console.log(`🔗 Figma source: ${result.figmaUrl}`);
    } else {
      console.log("\n❌ FAILED to fetch real Atlas Hero component.");
      process.exit(1);
    }
  });
}

module.exports = { fetchRealAtlasHero };
