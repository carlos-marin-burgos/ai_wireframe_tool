const {
  fluentCommunityLibrary,
  generateFluentWireframeHTML,
  analyzeDescriptionForComponents,
} = require("./backend/fluent-community-library");

console.log("Testing Fluent Community Library...");

// Test 1: Check if library loads
console.log("\n1. Library Configuration:");
console.log(
  "Components available:",
  Object.keys(fluentCommunityLibrary.components).length
);
console.log(
  "First few components:",
  Object.keys(fluentCommunityLibrary.components).slice(0, 5)
);

// Test 2: Test description analysis
console.log("\n2. Description Analysis:");
const testDescription =
  "Create a simple contact form with name, email, and message fields";
const analysis = analyzeDescriptionForComponents(testDescription);
console.log("Analysis result:", analysis);

// Test 3: Test HTML generation
console.log("\n3. HTML Generation:");
try {
  const html = generateFluentWireframeHTML(testDescription, { theme: "light" });
  console.log("Generated HTML length:", html.length);
  console.log("HTML preview (first 200 chars):", html.substring(0, 200));
} catch (error) {
  console.error("HTML generation error:", error.message);
}

console.log("\nTest completed.");
