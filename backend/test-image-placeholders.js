#!/usr/bin/env node

// Test script to verify image placeholder utilities
const {
  fixWireframeImages,
  processImagePlaceholders,
  addImageErrorHandling,
} = require("./utils/imagePlaceholders");

// Test HTML with broken images
const testHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Wireframe</title>
</head>
<body>
    <header>
        <img src="logo.png" alt="Company Logo" class="logo">
    </header>
    
    <main>
        <h1>Welcome to Our Platform</h1>
        
        <section class="gallery">
            <img src="product1.jpg" alt="Product 1" class="product-image">
            <img src="product2.jpg" alt="Product 2" class="product-image">
            <img src="hero-banner.jpg" alt="Hero Banner" class="hero-image">
        </section>
        
        <section class="team">
            <img src="avatar1.png" alt="Team Member 1" class="avatar">
            <img src="icon-feature.svg" alt="Feature Icon" class="icon">
        </section>
        
        <!-- These should be left alone -->
        <img src="https://via.placeholder.com/150x150" alt="Already a placeholder">
        <img src="data:image/svg+xml;base64,PHN2Zz..." alt="Data URL">
    </main>
</body>
</html>`;

console.log("🧪 Testing Image Placeholder Utilities\n");

console.log("📝 Original HTML contains broken image references:");
console.log("- logo.png (should become logo placeholder)");
console.log(
  "- product1.jpg, product2.jpg (should become product placeholders)"
);
console.log("- hero-banner.jpg (should become hero banner placeholder)");
console.log("- avatar1.png (should become avatar placeholder)");
console.log("- icon-feature.svg (should become icon placeholder)\n");

console.log("🔧 Processing with fixWireframeImages()...\n");

try {
  const processedHtml = fixWireframeImages(testHtml);

  console.log("✅ Processing completed successfully!");
  console.log("\n📊 Results:");

  // Check for placeholders
  const placeholderCount = (processedHtml.match(/via\.placeholder\.com/g) || [])
    .length;
  console.log(`- Found ${placeholderCount} placeholder URLs`);

  // Check for onerror handlers
  const onerrorCount = (processedHtml.match(/onerror=/g) || []).length;
  console.log(`- Added ${onerrorCount} error handlers`);

  // Extract some sample URLs to verify they're working
  const placeholderUrls =
    processedHtml.match(/https:\/\/via\.placeholder\.com\/[^"']*/g) || [];

  console.log("\n🎨 Sample generated placeholder URLs:");
  placeholderUrls.slice(0, 3).forEach((url, index) => {
    console.log(`${index + 1}. ${url}`);
  });

  console.log("\n📄 Processed HTML snippet (first 500 chars):");
  console.log(processedHtml.substring(0, 500) + "...");

  // Verify Microsoft Learn themed colors
  const hasBlueColors = processedHtml.includes("0078d4");
  const hasNeutralColors = processedHtml.includes("f3f2f1");

  console.log("\n🎨 Theme verification:");
  console.log(
    `- Uses Microsoft Learn blue (#0078d4): ${hasBlueColors ? "✅" : "❌"}`
  );
  console.log(`- Uses neutral colors: ${hasNeutralColors ? "✅" : "❌"}`);
} catch (error) {
  console.error("❌ Error during processing:", error.message);
  console.error(error.stack);
}

console.log(
  "\n🎯 Test completed! Image placeholders should now be properly replaced."
);
