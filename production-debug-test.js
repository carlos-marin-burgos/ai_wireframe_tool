// Production Debug Test - Run this in the browser console on the production site
// https://lemon-field-08a1a0b0f.1.azurestaticapps.net

(function () {
  console.log("🔍 Production Debug Test Starting...");
  console.log("Environment Info:", {
    hostname: window.location.hostname,
    DEV: import.meta?.env?.DEV,
    MODE: import.meta?.env?.MODE,
  });

  // Test the actual API endpoint that should be used
  const testAPI = async () => {
    console.log("🧪 Testing API endpoints...");

    // Test 1: Direct Function App call
    try {
      console.log("1️⃣ Testing direct Function App call...");
      const directResponse = await fetch(
        "https://func-original-app-pgno4orkguix6.azurewebsites.net/api/generate-wireframe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: "test form",
            fastMode: true,
          }),
        }
      );
      console.log(
        "✅ Direct Function App:",
        directResponse.status,
        directResponse.ok
      );

      if (directResponse.ok) {
        const result = await directResponse.json();
        console.log(
          "✅ Direct Function App Result:",
          result.success ? "SUCCESS" : "FAILED"
        );
      }
    } catch (error) {
      console.error("❌ Direct Function App failed:", error.message);
    }

    // Test 2: Relative URL (what the app might be doing wrong)
    try {
      console.log("2️⃣ Testing relative URL call...");
      const relativeResponse = await fetch("/api/generate-wireframe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: "test form",
          fastMode: true,
        }),
      });
      console.log(
        "⚠️ Relative URL:",
        relativeResponse.status,
        relativeResponse.ok
      );
    } catch (error) {
      console.error("❌ Relative URL failed:", error.message);
    }
  };

  // Run the test
  testAPI();
})();

console.log(
  "📋 Copy and paste this entire script into the browser console on the production site to debug the API issue"
);
