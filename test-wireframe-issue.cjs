#!/usr/bin/env node

// Test script to debug the wireframe generation issue
// Tests your specific input: "a learning page with a hero and two cards and 2 textboxes and 2 buttons"

const {
  createFallbackWireframe,
  analyzeDescription,
} = require("./backend/fallback-generator");

console.log("🧪 Testing Wireframe Generation Issue\n");

const testDescription =
  "a learning page with a hero and two cards and 2 textboxes and 2 buttons";

console.log(`📝 Input: "${testDescription}"`);
console.log(
  "   Expected: Learning page with hero + 2 cards + 2 textboxes + 2 buttons"
);

// Test the analysis function
console.log("\n🔍 Analyzing description...");
try {
  const analysis = analyzeDescription(testDescription);

  console.log("📊 Analysis Results:");
  console.log("   Elements detected:");
  console.log(`     • Buttons: ${JSON.stringify(analysis.elements.buttons)}`);
  console.log(`     • Forms: ${JSON.stringify(analysis.elements.forms)}`);
  console.log(`     • Cards: ${JSON.stringify(analysis.elements.cards)}`);
  console.log(`     • Layout: ${analysis.elements.layout}`);
  console.log(`     • Content: ${JSON.stringify(analysis.elements.content)}`);
  console.log(`   Purpose: ${analysis.purpose}`);
  console.log(`   Requirements: ${JSON.stringify(analysis.requirements)}`);

  // Check for specific issues
  console.log("\n🔍 Issue Analysis:");

  // Check textbox detection
  const hasTextboxes = testDescription.includes("textbox");
  const formsDetected =
    analysis.elements.forms && analysis.elements.forms.length > 0;
  console.log(`   • Textbox keyword found: ${hasTextboxes ? "✅" : "❌"}`);
  console.log(`   • Forms detected: ${formsDetected ? "✅" : "❌"}`);

  // Check card detection
  const hasCards = testDescription.includes("cards");
  const cardsDetected =
    analysis.elements.cards && analysis.elements.cards.length > 0;
  console.log(`   • Card keyword found: ${hasCards ? "✅" : "❌"}`);
  console.log(`   • Cards detected: ${cardsDetected ? "✅" : "❌"}`);

  // Check learning page detection
  const isLearningPage = testDescription.includes("learning");
  console.log(`   • Learning keyword found: ${isLearningPage ? "✅" : "❌"}`);
} catch (error) {
  console.error("❌ Analysis failed:", error.message);
}

// Test the wireframe generation
console.log("\n🎨 Generating wireframe...");
try {
  const wireframe = createFallbackWireframe(
    testDescription,
    "microsoftlearn",
    "primary"
  );

  console.log("✅ Wireframe generated successfully!");
  console.log(`   Length: ${wireframe.length} characters`);

  // Check for specific elements in the generated HTML
  console.log("\n🔍 Generated Content Analysis:");

  const hasHero = wireframe.includes("hero") || wireframe.includes("Hero");
  const hasInputs = (wireframe.match(/<input/g) || []).length;
  const hasTextareas = (wireframe.match(/<textarea/g) || []).length;
  const hasButtons = (wireframe.match(/<button/g) || []).length;
  const hasCards = (wireframe.match(/card/gi) || []).length;

  console.log(`   • Hero section: ${hasHero ? "✅" : "❌"}`);
  console.log(`   • Input fields: ${hasInputs} (expected: ~2)`);
  console.log(`   • Textarea fields: ${hasTextareas}`);
  console.log(`   • Buttons: ${hasButtons} (expected: ~2)`);
  console.log(`   • Card elements: ${hasCards} (expected: ~2)`);

  // Save a sample of the output for inspection
  const preview = wireframe.substring(0, 500) + "...";
  console.log("\n📄 HTML Preview (first 500 chars):");
  console.log(preview);
} catch (error) {
  console.error("❌ Wireframe generation failed:", error.message);
}

console.log("\n🎯 Recommendations:");
console.log(
  '1. Check if "textbox" keyword is properly handled in extractForms()'
);
console.log('2. Verify card count extraction from "two cards"');
console.log("3. Ensure learning page theme is applied correctly");
console.log("4. Test with AI backend if available");

console.log("\n🧪 Test completed!");
