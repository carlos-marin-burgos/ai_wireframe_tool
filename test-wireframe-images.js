// Simple test to verify image processing in wireframe generation
// This file tests the generateWireframe API endpoint with broken images

const testWireframeWithImages = async () => {
  console.log("🧪 Testing wireframe generation with images...");

  try {
    const response = await fetch("/api/generateWireframe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description:
          "Create a simple card layout with user avatars, product images, and hero banner",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Wireframe generated successfully");

    // Check if the HTML contains placeholder URLs
    const html = result.html;
    const hasPlaceholders = html.includes("placehold.co");
    const hasErrorHandlers = html.includes("onerror=");

    console.log("🔍 Image Analysis:");
    console.log(`- Contains placeholders: ${hasPlaceholders ? "✅" : "❌"}`);
    console.log(`- Has error handlers: ${hasErrorHandlers ? "✅" : "❌"}`);

    // Count images
    const imageCount = (html.match(/<img[^>]*>/g) || []).length;
    console.log(`- Total images: ${imageCount}`);

    if (imageCount > 0 && (hasPlaceholders || hasErrorHandlers)) {
      console.log("✅ Image placeholder system appears to be working!");
    } else {
      console.log("⚠️ Image processing may need verification");
    }

    // Display a sample of the HTML
    console.log("\n📄 Sample HTML (first 500 chars):");
    console.log(html.substring(0, 500) + "...");

    return result;
  } catch (error) {
    console.error("❌ Test failed:", error);
    return null;
  }
};

// Auto-run test when this script is loaded
if (typeof window !== "undefined") {
  console.log("🌐 Running in browser - test will execute automatically");
  testWireframeWithImages();
} else {
  console.log("📝 This test should be run in a browser console");
  module.exports = { testWireframeWithImages };
}
