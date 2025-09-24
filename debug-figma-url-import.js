// Debug script to test Figma URL import functionality
console.log("🔍 Debug: Testing Figma URL import functionality...");

// Test the URL parsing function
const testUrls = [
  "https://www.figma.com/file/ABC123/Test-File",
  "https://www.figma.com/design/DEF456/Another-File",
  "https://www.figma.com/file/GHI789/File-With-Frames?node-id=1%3A2",
  "https://not-a-figma-url.com/test",
  "https://figma.com/file/JKL012/Short-Domain",
];

// Simple URL parsing test (mimics what figmaApi.parseFileUrl should do)
function testParseFileUrl(url) {
  try {
    // Match various Figma URL patterns
    const patterns = [
      /^https?:\/\/(?:www\.)?figma\.com\/(?:file|design)\/([A-Za-z0-9]+)/,
      /^https?:\/\/figma\.com\/(?:file|design)\/([A-Za-z0-9]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return null;
  }
}

console.log("\n📋 Testing URL parsing:");
testUrls.forEach((url) => {
  const fileKey = testParseFileUrl(url);
  console.log(`${url} → ${fileKey || "NOT FIGMA URL"}`);
});

// Test OAuth token availability (simulated)
console.log("\n🔐 Testing token availability:");
console.log(
  'localStorage.getItem("figma_oauth_tokens"):',
  localStorage?.getItem?.("figma_oauth_tokens") || "NOT AVAILABLE (Node.js)"
);

console.log(
  "\n✅ Debug script completed. Run this in browser console for localStorage access."
);
