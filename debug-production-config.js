// Debug script to test production configuration
// Run this after deployment to verify what URLs are being used

const testProductionConfig = async () => {
  console.log("🔍 Testing Production Configuration");
  console.log("=====================================");

  // Test the Static Web App URL
  const staticWebAppUrl = "https://lemon-field-08a1a0b0f.1.azurestaticapps.net";

  try {
    // Test if we can reach the static web app
    const staticResponse = await fetch(staticWebAppUrl);
    console.log(`✅ Static Web App reachable: ${staticResponse.status}`);

    // Test API endpoint through static web app (should fail with our current config)
    try {
      const apiResponse = await fetch(
        `${staticWebAppUrl}/api/generate-wireframe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: "test",
            fastMode: true,
          }),
        }
      );
      console.log(
        `⚠️ Static Web App API: ${apiResponse.status} (should be 404)`
      );
    } catch (error) {
      console.log(`❌ Static Web App API: ${error.message}`);
    }

    // Test direct Function App endpoint
    const functionAppUrl =
      "https://func-original-app-pgno4orkguix6.azurewebsites.net";
    try {
      const functionResponse = await fetch(
        `${functionAppUrl}/api/generate-wireframe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: "test login form",
            fastMode: true,
          }),
        }
      );
      console.log(
        `✅ Function App API: ${functionResponse.status} (should be 200)`
      );

      if (functionResponse.ok) {
        const result = await functionResponse.json();
        console.log(`✅ AI Generated: ${result.success ? "YES" : "NO"}`);
      }
    } catch (error) {
      console.log(`❌ Function App API: ${error.message}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
};

// For browser environment
if (typeof window !== "undefined") {
  // Add this function to window so it can be called from browser console
  window.testProductionConfig = testProductionConfig;
  console.log("Run testProductionConfig() in browser console to test");
} else {
  // For Node environment
  testProductionConfig();
}
