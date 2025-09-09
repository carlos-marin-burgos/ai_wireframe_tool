#!/usr/bin/env node

// Test script to generate and examine the actual wireframe HTML
const { createFallbackWireframe } = require("./backend/fallback-generator");

console.log("🔬 Analyzing Generated Wireframe HTML\n");

const testDescription =
  "a learning page with a hero and two cards and 2 textboxes and 2 buttons";
console.log(`📝 Input: "${testDescription}"`);

try {
  const wireframe = createFallbackWireframe(
    testDescription,
    "microsoftlearn",
    "primary"
  );

  // Save to file for examination
  require("fs").writeFileSync("test-wireframe-output.html", wireframe);

  console.log("✅ Wireframe saved to test-wireframe-output.html");
  console.log(`📊 Total length: ${wireframe.length} characters`);

  // Count specific elements
  const inputCount = (wireframe.match(/<input[^>]*>/g) || []).length;
  const textareaCount = (wireframe.match(/<textarea[^>]*>/g) || []).length;
  const buttonCount = (wireframe.match(/<button[^>]*>/g) || []).length;
  const cardCount = (wireframe.match(/class="card"/g) || []).length;
  const formCount = (wireframe.match(/<form[^>]*>/g) || []).length;

  console.log("\n📈 Element Count Analysis:");
  console.log(`   • Input fields: ${inputCount}`);
  console.log(`   • Textarea fields: ${textareaCount}`);
  console.log(`   • Buttons: ${buttonCount}`);
  console.log(`   • Cards: ${cardCount}`);
  console.log(`   • Forms: ${formCount}`);

  // Show form section
  const formSection = wireframe.match(/<form[\s\S]*?<\/form>/);
  if (formSection) {
    console.log("\n📝 Form Section Found:");
    console.log(formSection[0].substring(0, 300) + "...");
  } else {
    console.log("\n❌ No form section found in HTML");
  }

  // Show card section
  const cardSection = wireframe.match(
    /<div class="cards-grid">[\s\S]*?<\/div>/
  );
  if (cardSection) {
    console.log("\n🎴 Cards Section Found:");
    console.log(cardSection[0].substring(0, 300) + "...");
  } else {
    console.log("\n❌ No cards section found in HTML");
  }
} catch (error) {
  console.error("❌ Error:", error.message);
}

console.log("\n✅ Analysis complete!");
