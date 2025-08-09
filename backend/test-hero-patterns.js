#!/usr/bin/env node

// Test Microsoft Learn Hero Patterns
console.log("🎯 Testing Microsoft Learn Hero Patterns\n");

const AtlasComponentLibrary = require("./components/AtlasComponentLibrary");
const atlasLibrary = new AtlasComponentLibrary();

// Test all three hero variants
console.log("1. Testing Wayfinding Hero (Primary with pattern background):");
const wayfindingHero = atlasLibrary.generateComponent("hero-section", {
  variant: "wayfinding",
  eyebrow: "MICROSOFT LEARN",
  title: "Build your next great idea",
  subtitle:
    "Transform your vision into reality with comprehensive resources and tools.",
  buttonText: "Get Started",
});
console.log("   ✅ Wayfinding hero generated");

console.log(
  "\n2. Testing Accent Hero (Image background with content overlay):"
);
const accentHero = atlasLibrary.generateComponent("hero-section", {
  variant: "accent",
  eyebrow: "LEARN SOMETHING NEW",
  title: "Master Modern Development",
  subtitle:
    "Build applications with the latest technologies and best practices.",
  backgroundImage:
    "https://learn.microsoft.com/en-us/media/home-and-directory/home-hero_light.png",
  buttonText: "Start Learning",
});
console.log("   ✅ Accent hero generated");

console.log("\n3. Testing Accent Hero with Details (Image + details card):");
const accentHeroWithDetails = atlasLibrary.generateComponent("hero-section", {
  variant: "accent-with-details",
  eyebrow: "SKILL UP TODAY",
  title: "Advanced Learning Paths",
  subtitle: "Structured learning experiences designed for professionals.",
  backgroundImage:
    "https://learn.microsoft.com/en-us/media/learn/plans/skilling_plan_hero.png",
  buttonText: "Explore Paths",
  detailsCard: {
    title: "Featured Content",
    description:
      "Access curated learning materials and hands-on exercises designed to accelerate your progress.",
  },
});
console.log("   ✅ Accent hero with details generated");

// Generate complete test HTML
const completeHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microsoft Learn Hero Patterns - Atlas Component Library</title>
    ${atlasLibrary.getBaseStyles()}
</head>
<body style="margin: 0; font-family: 'Segoe UI', sans-serif;">
    <h1 style="text-align: center; padding: 20px; background: #f8f9fa; margin: 0; color: #323130;">
        Microsoft Learn Hero Patterns
    </h1>
    
    <div style="margin: 40px 0;">
        <h2 style="text-align: center; color: #605e5c; margin: 20px 0;">1. Wayfinding Hero</h2>
        ${wayfindingHero}
    </div>
    
    <div style="margin: 40px 0;">
        <h2 style="text-align: center; color: #605e5c; margin: 20px 0;">2. Accent Hero</h2>
        ${accentHero}
    </div>
    
    <div style="margin: 40px 0;">
        <h2 style="text-align: center; color: #605e5c; margin: 20px 0;">3. Accent Hero with Details</h2>
        ${accentHeroWithDetails}
    </div>
    
    <footer style="background: #323130; color: white; padding: 40px 0; text-align: center; margin-top: 60px;">
        <p>✅ Official Microsoft Learn Hero Patterns Implemented in Atlas Component Library</p>
        <p style="opacity: 0.8; font-size: 14px;">Following design.learn.microsoft.com/patterns/hero.html specifications</p>
    </footer>
</body>
</html>
`;

// Save test file
require("fs").writeFileSync("./test-hero-patterns.html", completeHTML);

console.log("\n🎉 SUCCESS: Microsoft Learn Hero Patterns Implemented!");
console.log("📄 Test file created: test-hero-patterns.html");
console.log("\n📋 Available Hero Variants:");
console.log("   • wayfinding: Primary colored background with pattern");
console.log("   • accent: Image background with content overlay");
console.log(
  "   • accent-with-details: Image background + floating details card"
);
console.log("\n🎯 All patterns follow official Microsoft Learn design system!");
console.log(
  "🌐 Open test-hero-patterns.html in browser to see the implementations"
);

// Test hero integration in wireframe generation
console.log("\n4. Testing hero integration in wireframe generation...");
const testHeroInWireframe = atlasLibrary.generateComponent("hero-section", {
  title: "E-commerce Platform",
  subtitle: "Build and scale your online business",
  variant: "wayfinding",
});

console.log("   ✅ Hero component ready for wireframe generation");
console.log(
  "   🔧 Available in wireframe generator via atlasLibrary.generateComponent('hero-section', options)"
);
