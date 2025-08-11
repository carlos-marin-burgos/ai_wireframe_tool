// Test script to verify full stack is working
console.log("🧪 Testing full stack connection...\n");

// Test 1: Health endpoint
console.log("1️⃣ Testing health endpoint...");
fetch("http://localhost:7072/api/health")
  .then((response) => response.json())
  .then((data) => {
    console.log("✅ Health check passed:");
    console.log(`   - Status: ${data.status}`);
    console.log(`   - OpenAI: ${data.services.openaiStatus}`);
    console.log(`   - Endpoint: ${data.services.openaiEndpoint}`);
    console.log("");

    // Test 2: Wireframe generation
    console.log("2️⃣ Testing wireframe generation...");
    return fetch("http://localhost:7072/api/generate-html-wireframe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: "A simple test landing page with header and footer",
      }),
    });
  })
  .then((response) => response.json())
  .then((data) => {
    console.log("✅ Wireframe generation passed:");
    console.log(`   - AI Generated: ${data.aiGenerated}`);
    console.log(`   - Source: ${data.source}`);
    console.log(`   - Processing time: ${data.processingTimeMs}ms`);
    console.log(`   - HTML length: ${data.html.length} characters`);
    console.log("");

    console.log("🎉 All tests passed! Your development environment is ready.");
    console.log("");
    console.log("📍 Access points:");
    console.log("   - Frontend: http://localhost:5173");
    console.log("   - Backend: http://localhost:7072");
    console.log("   - Health: http://localhost:7072/api/health");
  })
  .catch((error) => {
    console.error("❌ Test failed:", error.message);
    console.log("");
    console.log("🔧 Troubleshooting:");
    console.log("   1. Make sure Azure Functions are running on port 7072");
    console.log("   2. Check that OpenAI configuration is correct");
    console.log("   3. Verify network connectivity");
  });
