// Test local OAuth endpoints
const testLocalOAuth = async () => {
  const baseUrl = "http://localhost:7071";

  console.log("🧪 Testing Local OAuth Endpoints");
  console.log("================================");

  // Test OAuth Status
  try {
    console.log("\n1. Testing figmaOAuthStatus...");
    const statusResponse = await fetch(`${baseUrl}/api/figmaOAuthStatus`);
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log("✅ OAuth Status Response:", statusData);
    } else {
      console.log(
        "❌ OAuth Status failed:",
        statusResponse.status,
        statusResponse.statusText
      );
    }
  } catch (error) {
    console.log("❌ OAuth Status error:", error.message);
  }

  // Test OAuth Start (GET request to get HTML)
  try {
    console.log("\n2. Testing figmaOAuthStart...");
    const startResponse = await fetch(`${baseUrl}/api/figmaOAuthStart`);
    if (startResponse.ok) {
      const startData = await startResponse.text();
      console.log(
        "✅ OAuth Start Response length:",
        startData.length,
        "characters"
      );
      console.log(
        "✅ Contains authorization URL:",
        startData.includes("figma.com/oauth")
      );
    } else {
      console.log(
        "❌ OAuth Start failed:",
        startResponse.status,
        startResponse.statusText
      );
    }
  } catch (error) {
    console.log("❌ OAuth Start error:", error.message);
  }

  // Test health endpoint
  try {
    console.log("\n3. Testing health endpoint...");
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log("✅ Health Response:", healthData);
    } else {
      console.log(
        "❌ Health failed:",
        healthResponse.status,
        healthResponse.statusText
      );
    }
  } catch (error) {
    console.log("❌ Health error:", error.message);
  }

  console.log("\n🎉 Local OAuth testing complete!");
};

// Run the test
testLocalOAuth().catch(console.error);
