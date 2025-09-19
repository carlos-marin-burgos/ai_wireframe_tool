// Debug script to test production API from browser console
// Paste this into the browser console at https://lemon-field-08a1a0b0f.1.azurestaticapps.net

console.log("🔍 Starting Production API Debug Test");

// Test what API endpoint the current page is configured to use
const currentHostname = window.location.hostname;
const isProduction =
  currentHostname === "lemon-field-08a1a0b0f.1.azurestaticapps.net";

console.log("📍 Environment Detection:", {
  hostname: currentHostname,
  isProduction: isProduction,
  expectedAPI: isProduction
    ? "https://func-original-app-pgno4orkguix6.azurewebsites.net/api"
    : "localhost or fallback",
});

// Test direct API call with same parameters as the app would use
async function testProductionAPI() {
  const apiUrl =
    "https://func-original-app-pgno4orkguix6.azurewebsites.net/api/generate-wireframe";

  console.log("🧪 Testing API call to:", apiUrl);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: window.location.origin,
      },
      body: JSON.stringify({
        description: "Simple contact form test",
        theme: "professional",
        colorScheme: "blue",
        fastMode: true,
      }),
    });

    console.log("📡 Response status:", response.status);
    console.log("📡 Response headers:", [...response.headers.entries()]);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ API Success:", {
        success: data.success,
        hasHTML: !!data.html,
        processingTime: data.metadata?.processingTimeMs,
        fallback: data.fallback,
      });

      if (data.html && data.html.includes("Smart Template")) {
        console.error("❌ Got Smart Template instead of AI-generated content!");
        return false;
      } else {
        console.log("✅ Received real AI-generated wireframe!");
        return true;
      }
    } else {
      console.error("❌ API Error:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      return false;
    }
  } catch (error) {
    console.error("❌ Network Error:", error);
    return false;
  }
}

// Run the test
testProductionAPI().then((success) => {
  console.log(
    success
      ? "🎉 Production API is working correctly!"
      : "💥 Production API has issues!"
  );
});

// Also test what the current page configuration looks like
console.log("🔧 Current page config check:");
console.log("- isDev:", import.meta?.env?.DEV);
console.log("- Location:", window.location.href);
console.log("- Origin:", window.location.origin);
