#!/usr/bin/env node

import axios from "axios";

async function detailedFigmaDebug() {
  console.log("🔍 Detailed Figma OAuth Debug\n");

  const config = {
    clientId: process.env.FIGMA_CLIENT_ID || "your-figma-client-id",
    clientSecret: process.env.FIGMA_CLIENT_SECRET || "your-figma-client-secret",
    redirectUri: "http://localhost:7071/api/figmaOAuthCallback",
  };

  console.log("📋 Configuration:");
  console.log(`Client ID: ${config.clientId}`);
  console.log(`Client Secret: ${config.clientSecret ? "Present" : "Missing"}`);
  console.log(`Redirect URI: ${config.redirectUri}\n`);

  // Test 1: Try with a test code to see exact error response
  console.log("🧪 Test 1: Token exchange with test code");

  try {
    const params = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      code: "test_code_12345",
      grant_type: "authorization_code",
    });

    console.log("📤 Request parameters:");
    console.log("  URL:", "https://www.figma.com/api/oauth/token");
    console.log("  Method: POST");
    console.log("  Content-Type: application/x-www-form-urlencoded");
    console.log("  Body:", params.toString());
    console.log();

    const response = await axios.post(
      "https://www.figma.com/api/oauth/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "DesigneticaOAuthDebug/1.0",
        },
        timeout: 10000,
        validateStatus: () => true, // Don't throw on any status
      }
    );

    console.log("📥 Response:");
    console.log(`  Status: ${response.status} ${response.statusText}`);
    console.log("  Headers:", JSON.stringify(response.headers, null, 2));
    console.log("  Data:", JSON.stringify(response.data, null, 2));
    console.log();

    // Analyze the response
    if (response.status === 404) {
      console.log("❌ 404 Analysis:");
      console.log("   This suggests one of:");
      console.log("   1. The OAuth app does not exist");
      console.log("   2. The client_id is completely wrong");
      console.log("   3. The Figma API endpoint has changed");
      console.log("   4. The app was deleted or suspended");
      console.log();
    } else if (response.status === 400) {
      console.log("✅ 400 Analysis:");
      console.log("   This is expected with a test code. It means:");
      console.log("   - The app exists");
      console.log("   - The client credentials are recognized");
      console.log("   - Only the authorization code is invalid");
      console.log();
    } else if (response.status === 401) {
      console.log("⚠️ 401 Analysis:");
      console.log("   This suggests:");
      console.log("   - Client credentials are invalid");
      console.log("   - Client secret might be wrong");
      console.log();
    }
  } catch (error) {
    console.log("❌ Network Error:", error.message);
    if (error.code) {
      console.log("   Error Code:", error.code);
    }
  }

  // Test 2: Check if we can reach Figma API at all
  console.log("🌐 Test 2: Figma API connectivity");
  try {
    const response = await axios.get("https://api.figma.com/v1/me", {
      headers: {
        Authorization: "Bearer invalid_token",
      },
      validateStatus: () => true,
    });

    console.log(`📡 Figma API Status: ${response.status}`);
    if (response.status === 401) {
      console.log(
        "✅ Figma API is reachable (401 expected with invalid token)"
      );
    } else {
      console.log("⚠️ Unexpected response from Figma API");
    }
  } catch (error) {
    console.log("❌ Cannot reach Figma API:", error.message);
  }

  console.log("\n💡 Next Steps:");
  console.log(
    "1. Double-check your Figma app at https://www.figma.com/developers/apps"
  );
  console.log("2. Verify the exact client ID and secret");
  console.log("3. Ensure the app is published (not draft)");
  console.log("4. Try creating a completely new Figma app if needed");
  console.log("5. Check if there are any Figma service status issues");
}

detailedFigmaDebug().catch(console.error);
