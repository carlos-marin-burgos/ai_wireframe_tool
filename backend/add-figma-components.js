#!/usr/bin/env node

/**
 * Admin Script: Add Figma Components to Library
 * Usage: node add-figma-components.js
 */

const axios = require("axios");

// Configuration
const BACKEND_URL = "http://localhost:7072/api/figmaNodeImporter";

// Component URLs to add (you can modify this list)
const COMPONENTS_TO_ADD = [
  {
    figmaUrl:
      "https://www.figma.com/design/PuWj05uKXhfbqrhmJLtCij/Atlas-library-for-designetica?node-id=1-3762&t=ZZG7ksmOtnLfGef2-4",
    componentName: "Atlas Component 1",
    category: "Components",
  },
  {
    figmaUrl:
      "https://www.figma.com/design/PuWj05uKXhfbqrhmJLtCij/Atlas-library-for-designetica?node-id=1-4688&t=ZZG7ksmOtnLfGef2-4",
    componentName: "Atlas Component 2",
    category: "Components",
  },
  {
    figmaUrl:
      "https://www.figma.com/design/PuWj05uKXhfbqrhmJLtCij/Atlas-library-for-designetica?node-id=1-4786&t=ZZG7ksmOtnLfGef2-4",
    componentName: "Atlas Component 3",
    category: "Components",
  },
  {
    figmaUrl:
      "https://www.figma.com/design/PuWj05uKXhfbqrhmJLtCij/Atlas-library-for-designetica?node-id=1-4886&t=ZZG7ksmOtnLfGef2-4",
    componentName: "Atlas Component 4",
    category: "Components",
  },
  {
    figmaUrl:
      "https://www.figma.com/design/PuWj05uKXhfbqrhmJLtCij/Atlas-library-for-designetica?node-id=1-2249&t=ZZG7ksmOtnLfGef2-4",
    componentName: "Atlas Secondary Button",
    category: "Actions",
  },
  {
    figmaUrl:
      "https://www.figma.com/design/PuWj05uKXhfbqrhmJLtCij/Atlas-library-for-designetica?node-id=1-2274&t=ZZG7ksmOtnLfGef2-4",
    componentName: "Atlas Primary Button",
    category: "Actions",
  },
  {
    figmaUrl:
      "https://www.figma.com/design/PuWj05uKXhfbqrhmJLtCij/Atlas-library-for-designetica?node-id=2-393&t=ZZG7ksmOtnLfGef2-4",
    componentName: "Atlas Navigation Component",
    category: "Navigation",
  },
  {
    figmaUrl:
      "https://www.figma.com/design/PuWj05uKXhfbqrhmJLtCij/Atlas-library-for-designetica?node-id=1-3993&t=ZZG7ksmOtnLfGef2-4",
    componentName: "Atlas Card Certification",
    category: "Cards",
  },
  {
    figmaUrl:
      "https://www.figma.com/design/PuWj05uKXhfbqrhmJLtCij/Atlas-library-for-designetica?node-id=1-4069&t=ZZG7ksmOtnLfGef2-4",
    componentName: "Atlas Card Content",
    category: "Cards",
  },
  {
    figmaUrl:
      "https://www.figma.com/design/PuWj05uKXhfbqrhmJLtCij/Atlas-library-for-designetica?node-id=2-276&t=ZZG7ksmOtnLfGef2-4",
    componentName: "Atlas Layout Component",
    category: "Layout",
  },
  {
    figmaUrl:
      "https://www.figma.com/design/PuWj05uKXhfbqrhmJLtCij/Atlas-library-for-designetica?node-id=2-8&t=ZZG7ksmOtnLfGef2-4",
    componentName: "Atlas Base Component",
    category: "Components",
  },
];

async function addComponent(componentData) {
  try {
    console.log(`🎨 Adding component: ${componentData.componentName}`);

    const response = await axios.post(
      BACKEND_URL,
      {
        figmaUrl: componentData.figmaUrl,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    if (response.data.success) {
      console.log(`✅ Successfully added: ${componentData.componentName}`);
      console.log(`   - Name: ${response.data.component.name}`);
      console.log(`   - Category: ${response.data.component.category}`);
      console.log(
        `   - HTML Generated: ${response.data.component.html ? "Yes" : "No"}`
      );
      return response.data.component;
    } else {
      console.error(
        `❌ Failed to add ${componentData.componentName}: ${response.data.error}`
      );
      return null;
    }
  } catch (error) {
    console.error(
      `❌ Error adding ${componentData.componentName}:`,
      error.response?.data?.details || error.message
    );
    return null;
  }
}

async function addAllComponents() {
  console.log("🚀 Starting to add Figma components to library...\n");

  const results = [];

  for (const componentData of COMPONENTS_TO_ADD) {
    const result = await addComponent(componentData);
    results.push(result);

    // Add delay between requests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\n📊 Summary:");
  const successful = results.filter((r) => r !== null).length;
  const failed = results.length - successful;

  console.log(`✅ Successfully added: ${successful} components`);
  console.log(`❌ Failed: ${failed} components`);

  if (successful > 0) {
    console.log(
      "\n🎉 Components added! Clear your cache and refresh to see them in the component browser."
    );
  }
}

// Run the script
if (require.main === module) {
  addAllComponents().catch(console.error);
}

module.exports = { addComponent, addAllComponents };
