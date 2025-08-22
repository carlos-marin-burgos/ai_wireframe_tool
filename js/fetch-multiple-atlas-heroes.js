#!/usr/bin/env node

/**
 * Fetch Multiple Atlas Hero Components from Figma
 * This script fetches all 6 hero variations from the Atlas Design Library
 */

const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

// Atlas Design Library details
const FIGMA_TOKEN =
  process.env.FIGMA_ACCESS_TOKEN ||
  "figd_GgDW0X-9x98osaRbrkDNffeaWKbVjP6cJ6ZMUS5G";
const ATLAS_FILE_ID = "uVA2amRR71yJZ0GS6RI6zL";

// Atlas Hero node IDs provided by user from Figma URLs
const HERO_NODE_IDS = [
  "14678:163022", // Hero 1 from user's URL
  "14651:163352", // Hero 2 from user's URL
  "14651:163398", // Hero 3 from user's URL
  "14647:163531", // Hero 4 from user's URL
];

async function fetchMultipleAtlasHeroes() {
  try {
    console.log("🔄 Fetching multiple Atlas Hero components from Figma...");
    console.log(`📁 File ID: ${ATLAS_FILE_ID}`);
    console.log(`🎯 Testing Node IDs: ${HERO_NODE_IDS.join(", ")}`);

    // Fetch all hero component images at once
    const imageResponse = await axios.get(
      `https://api.figma.com/v1/images/${ATLAS_FILE_ID}?ids=${HERO_NODE_IDS.join(
        ","
      )}&format=png&scale=2`,
      {
        headers: {
          "X-Figma-Token": FIGMA_TOKEN,
        },
      }
    );

    console.log("📦 Response received, processing images...");

    const foundHeroes = [];
    const images = imageResponse.data.images || {};

    for (const nodeId of HERO_NODE_IDS) {
      if (images[nodeId]) {
        foundHeroes.push({
          nodeId,
          imageUrl: images[nodeId],
          name: `Atlas Hero ${foundHeroes.length + 1}`,
        });
        console.log(
          `✅ Found Hero ${foundHeroes.length}: ${nodeId} -> ${images[nodeId]}`
        );
      } else {
        console.log(`❌ No image for node: ${nodeId}`);
      }
    }

    if (foundHeroes.length === 0) {
      throw new Error("No hero images found");
    }

    console.log(
      `🎉 Successfully found ${foundHeroes.length} Atlas Hero components!`
    );

    // Save individual hero data
    const heroData = {
      fileId: ATLAS_FILE_ID,
      heroes: foundHeroes,
      fetchedAt: new Date().toISOString(),
    };

    fs.writeFileSync(
      "atlas-heroes-data.json",
      JSON.stringify(heroData, null, 2)
    );
    console.log("💾 Hero data saved to: atlas-heroes-data.json");

    return {
      success: true,
      heroes: foundHeroes,
      count: foundHeroes.length,
    };
  } catch (error) {
    console.error("❌ Failed to fetch Atlas Heroes:", error.message);
    if (error.response) {
      console.error("API Response Status:", error.response.status);
      console.error("API Response Data:", error.response.data);
    }
    return { success: false, error: error.message };
  }
}

// Run the script
if (require.main === module) {
  fetchMultipleAtlasHeroes().then((result) => {
    if (result.success) {
      console.log(`\n🎉 SUCCESS! Found ${result.count} Atlas Hero components.`);
      console.log("📋 Data saved to atlas-heroes-data.json");
      console.log("\n🔍 Found Heroes:");
      result.heroes.forEach((hero, index) => {
        console.log(`   ${index + 1}. ${hero.name} (${hero.nodeId})`);
      });
    } else {
      console.log("\n❌ FAILED to fetch Atlas Hero components.");
      process.exit(1);
    }
  });
}

module.exports = { fetchMultipleAtlasHeroes };
