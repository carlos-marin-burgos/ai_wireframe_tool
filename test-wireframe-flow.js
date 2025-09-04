#!/usr/bin/env node

/**
 * Test script to debug the exact wireframe flow from the frontend
 * This simulates the App.tsx handleAnalyzeImage function step by step
 */

async function debugFrontendFlow() {
  console.log("🔍 Debugging exact frontend wireframe flow...\n");

  // Step 1: Simulate image analysis result (what the app creates)
  console.log("1️⃣ Simulating image analysis result...");
  const imageAnalysis = {
    wireframeDescription:
      "Create a dashboard with navigation, hero section, and cards",
    components: [
      { type: "navigation", description: "Top nav bar", confidence: 0.9 },
      { type: "hero", description: "Hero section", confidence: 0.8 },
      { type: "content", description: "Content grid", confidence: 0.85 },
      { type: "footer", description: "Footer", confidence: 0.7 },
    ],
    designTokens: {
      primaryColor: "#0078d4",
      backgroundColor: "#ffffff",
      textColor: "#323130",
    },
    confidence: 0.85,
  };

  const fileName = "screenshot_401.png";
  const wireframeDescription =
    imageAnalysis.wireframeDescription ||
    `Create a wireframe based on the detected components: ${
      imageAnalysis.components?.map((c) => c.type).join(", ") ||
      "various UI elements"
    }`;

  console.log("✅ Image analysis simulated");
  console.log("   Components:", imageAnalysis.components.length);
  console.log("   Description:", wireframeDescription);

  // Step 2: Test the exact request the frontend makes
  console.log("\n2️⃣ Testing exact frontend request...");

  try {
    console.log("📤 Sending request to: /api/generate-html-wireframe");
    console.log("📤 Request payload:", {
      description: `Generated from uploaded image: ${fileName}`,
      colorScheme: "light",
      hasImageAnalysis: !!imageAnalysis,
    });

    // This matches exactly what App.tsx sends
    const wireframeResponse = await fetch(
      "http://localhost:5173/api/generate-html-wireframe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: wireframeDescription,
          colorScheme: "light",
          imageAnalysis: imageAnalysis, // Complete image analysis object
        }),
      }
    );

    console.log("📥 Response status:", wireframeResponse.status);
    console.log("📥 Response OK:", wireframeResponse.ok);

    if (!wireframeResponse.ok) {
      const errorText = await wireframeResponse.text();
      console.error("❌ Response not OK - Error text:", errorText);
      throw new Error(
        `Wireframe generation failed: ${wireframeResponse.status}`
      );
    }

    const wireframeResult = await wireframeResponse.json();

    console.log("📥 Response structure:", {
      hasHtml: !!wireframeResult.html,
      htmlLength: wireframeResult.html?.length || 0,
      source: wireframeResult.source,
      processingTime: wireframeResult.processingTimeMs,
      success: wireframeResult.success,
      error: wireframeResult.error,
      hasStats: !!wireframeResult.stats,
    });

    // Check for explicit error response (exact frontend logic)
    if (wireframeResult.success === false) {
      console.error(
        "❌ Explicit error response:",
        wireframeResult.error || wireframeResult.message
      );
      throw new Error(
        wireframeResult.error ||
          wireframeResult.message ||
          "Wireframe generation failed"
      );
    }

    // Check if we have the expected HTML content (exact frontend logic)
    if (!wireframeResult.html) {
      console.error("❌ No HTML content in response");
      throw new Error("No wireframe HTML content received from backend");
    }

    console.log("✅ Wireframe generation successful!");
    console.log(
      "   HTML preview:",
      wireframeResult.html.substring(0, 100) + "..."
    );
  } catch (error) {
    console.error("❌ Error caught:", error.message);
    console.error("❌ Error type:", error.constructor.name);

    // This is what the frontend shows to the user
    console.error(
      "🚨 Frontend would show toast:",
      `Image analysis failed: ${error.message}`
    );
    return;
  }

  console.log("\n🎉 Frontend flow completed successfully!");
}

// Helper to test just the proxy
async function testProxy() {
  console.log("\n🔧 Testing proxy configuration...");

  try {
    const response = await fetch("http://localhost:5173/api/health");
    const data = await response.json();
    console.log("✅ Proxy working - Backend status:", data.status);
  } catch (error) {
    console.error("❌ Proxy test failed:", error.message);
  }
}

// Run both tests
async function runAll() {
  await testProxy();
  console.log("\n" + "=".repeat(60));
  await debugFrontendFlow();
}

runAll().catch(console.error);
