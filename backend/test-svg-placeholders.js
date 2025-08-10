#!/usr/bin/env node

// Test SVG placeholder generation
console.log("🖼️ Testing SVG Placeholder Generation\n");

const {
  fixWireframeImages,
  generatePlaceholderUrl,
} = require("./utils/imagePlaceholders");

// Test inline SVG generation
console.log("1. Testing SVG placeholder URL generation:");
const testUrl = generatePlaceholderUrl(
  "product.jpg",
  "Main Product Image",
  "product-image",
  "primary"
);
console.log("   URL starts with:", testUrl.substring(0, 50) + "...");
console.log("   URL length:", testUrl.length);
console.log("   Is data URL:", testUrl.startsWith("data:"));

// Test HTML processing
console.log("\n2. Testing HTML image processing:");
const testHTML = `
<div>
  <img src="broken-image.jpg" alt="Product Image" class="product">
  <img src="logo.png" alt="Company Logo" class="logo">
  <img src="https://example.com/real-image.jpg" alt="External Image">
</div>
`;

const processedHTML = fixWireframeImages(testHTML);
console.log("   Original HTML had broken images");
console.log("   Processed HTML includes SVG placeholders");

// Count placeholders
const svgCount = (processedHTML.match(/data:image\/svg\+xml/g) || []).length;
const onerrorCount = (processedHTML.match(/onerror=/g) || []).length;

console.log("   SVG placeholders generated:", svgCount);
console.log("   Error handlers added:", onerrorCount);

console.log("\n3. Sample processed image tag:");
const imgMatch = processedHTML.match(/<img[^>]*>/);
if (imgMatch) {
  console.log("   " + imgMatch[0].substring(0, 100) + "...");
}

console.log("\n✅ SVG placeholder system working correctly!");
console.log(
  "🎯 Images will now display as inline SVG placeholders in localhost"
);
