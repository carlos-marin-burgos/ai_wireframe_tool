// Test script to verify the final fix is working
// Run this in the browser console at https://lemon-field-08a1a0b0f.1.azurestaticapps.net

console.log("🧪 Testing Final CORS Fix");

// Test direct API call with proper CORS
async function testFinalFix() {
  console.log("🔍 Testing API with new Function App URL...");

  try {
    const response = await fetch(
      "https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net/api/generate-wireframe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify({
          description: "Test contact form",
          theme: "professional",
          colorScheme: "blue",
          fastMode: true,
        }),
      }
    );

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
        console.error("❌ Still getting Smart Template fallback!");
        return false;
      } else {
        console.log("🎉 SUCCESS: Got real AI-generated wireframe!");
        return true;
      }
    } else {
      console.error("❌ API Error:", response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error("❌ Network Error:", error);
    return false;
  }
}

// Run the test
testFinalFix().then((success) => {
  console.log(success ? "🎉 CORS is FIXED!" : "💥 Still having issues");
});
