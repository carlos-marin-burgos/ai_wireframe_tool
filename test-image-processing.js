/**
 * Test Image Placeholder Processing
 * This script tests the image placeholder utilities
 */

import {
  fixWireframeImages,
  processImagePlaceholders,
  addImageErrorHandling,
} from "./src/utils/imagePlaceholders.js";

// Test HTML with various broken image scenarios
const testHTML = `
<div class="wireframe-container">
  <h1>Test Wireframe</h1>
  
  <!-- Broken images that should be fixed -->
  <img src="broken-image.jpg" alt="Broken Image" width="200" height="150">
  <img src="https://via.placeholder.com/300x200/broken" alt="Via Placeholder" width="300" height="200">
  <img src="" alt="Empty Source" width="150" height="150">
  <img src="./assets/nonexistent.png" alt="Missing Asset">
  
  <!-- Images that should remain unchanged -->
  <img src="https://placehold.co/200x150/0078d4/ffffff?text=Working" alt="Working Placeholder">
  <img src="/windowsLogo.png" alt="Microsoft Logo" width="24" height="24">
  <img src="data:image/svg+xml;base64,..." alt="Data URL">
  
  <!-- Microsoft-specific images -->
  <img src="microsoft-logo.png" alt="Microsoft Logo" width="100" height="40">
  <img src="mslearn-banner.jpg" alt="MS Learn Banner" width="400" height="200">
</div>
`;

console.log("🧪 Testing Image Placeholder Processing");
console.log("=".repeat(50));

console.log("\n📝 Original HTML:");
console.log(testHTML);

console.log("\n🔧 Processing images...");
const processedHTML = fixWireframeImages(testHTML);

console.log("\n✅ Processed HTML:");
console.log(processedHTML);

console.log("\n📊 Analysis:");
const originalImages = (testHTML.match(/<img[^>]*>/g) || []).length;
const processedImages = (processedHTML.match(/<img[^>]*>/g) || []).length;

console.log(`- Original images: ${originalImages}`);
console.log(`- Processed images: ${processedImages}`);
console.log(
  `- Images unchanged: ${processedImages === originalImages ? "✅" : "❌"}`
);

// Check for onerror handlers
const onerrorCount = (processedHTML.match(/onerror=/g) || []).length;
console.log(`- Onerror handlers added: ${onerrorCount}`);

// Check for placeholder URLs
const placeholderCount = (processedHTML.match(/placehold\.co/g) || []).length;
console.log(`- Placeholder URLs: ${placeholderCount}`);

// Check for Microsoft logos
const microsoftLogos = (processedHTML.match(/windowsLogo\.png/g) || []).length;
console.log(`- Microsoft logos: ${microsoftLogos}`);

console.log("\n🎯 Test Summary:");
if (onerrorCount > 0 && placeholderCount > 0) {
  console.log("✅ Image processing is working correctly!");
  console.log("✅ Broken images are being replaced with placeholders");
  console.log("✅ Error handlers are being added to remaining images");
} else {
  console.log("❌ Image processing may not be working correctly");
  console.log(`- Expected onerror handlers: > 0, got: ${onerrorCount}`);
  console.log(`- Expected placeholders: > 0, got: ${placeholderCount}`);
}
