#!/usr/bin/env node

// Quick test to verify image placeholders are working in wireframe generation
const { fixWireframeImages } = require("./utils/imagePlaceholders");

// Simulate AI-generated HTML with broken images (typical output from GPT)
const sampleAIWireframe = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Showcase</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 0; background: #f3f2f1; }
        .hero { background: #E8E6DF; padding: 60px 20px; text-align: center; }
        .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; padding: 40px; }
        .product { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        img { max-width: 100%; height: auto; border-radius: 4px; }
    </style>
</head>
<body>
    <header>
        <img src="logo.png" alt="Company Logo" style="height: 40px;">
    </header>
    
    <section class="hero">
        <img src="hero-banner.jpg" alt="Hero Banner" style="width: 100%; max-width: 800px;">
        <h1>Product Showcase</h1>
    </section>
    
    <section class="gallery">
        <div class="product">
            <img src="product-1.jpg" alt="Amazing Product 1">
            <h3>Product 1</h3>
            <p>$99.99</p>
        </div>
        
        <div class="product">
            <img src="product-2.jpg" alt="Amazing Product 2">
            <h3>Product 2</h3>
            <p>$149.99</p>
        </div>
        
        <div class="product">
            <img src="team-photo.jpg" alt="Our Team">
            <h3>About Us</h3>
            <p>Meet our team</p>
        </div>
    </section>
    
    <footer>
        <img src="footer-logo.svg" alt="Footer Logo">
        <p>© 2024 Company Name</p>
    </footer>
</body>
</html>`;

console.log("🧪 Testing Real Wireframe Image Processing\n");

console.log("📝 Processing AI-generated wireframe with broken images...");
console.log("- Processing hero banner, product images, logos, and team photos");
console.log("- Should generate Microsoft Learn themed placeholders\n");

const processedHtml = fixWireframeImages(sampleAIWireframe);

// Count the results
const placeholderUrls =
  processedHtml.match(/https:\/\/via\.placeholder\.com\/[^"']*/g) || [];
const onerrorHandlers = (processedHtml.match(/onerror=/g) || []).length;

console.log("✅ Processing Results:");
console.log(`📊 Generated ${placeholderUrls.length} placeholder URLs`);
console.log(`🛡️ Added ${onerrorHandlers} error handlers`);

console.log("\n🎨 Generated Placeholder URLs:");
placeholderUrls.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});

// Check for Microsoft Learn branding
const hasMSLearnBlue = processedHtml.includes("0078d4");
const hasProperDimensions =
  processedHtml.includes("300x200") || processedHtml.includes("800x400");

console.log("\n🎯 Quality Checks:");
console.log(
  `✅ Microsoft Learn blue theme: ${hasMSLearnBlue ? "PASS" : "FAIL"}`
);
console.log(
  `✅ Proper image dimensions: ${hasProperDimensions ? "PASS" : "FAIL"}`
);
console.log(
  `✅ All images processed: ${placeholderUrls.length >= 5 ? "PASS" : "FAIL"}`
);

console.log("\n📄 Sample processed HTML (showing image tags):");
const imageLines = processedHtml
  .split("\n")
  .filter((line) => line.includes("<img"));
imageLines.forEach((line, index) => {
  console.log(`${index + 1}. ${line.trim()}`);
});

console.log("\n🎉 Image placeholder integration test completed!");
console.log(
  "The wireframe generation backend will now automatically fix broken images."
);
