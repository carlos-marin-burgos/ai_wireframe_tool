#!/usr/bin/env node

const axios = require("axios");

const BASE_URL =
  process.env.BASE_URL ||
  "https://func-designetica-prod-working.azurewebsites.net";

console.log("🧪 Testing OAuth Flow with Persistent Storage");
console.log("🔗 Base URL:", BASE_URL);

async function testOAuthFlow() {
  try {
    console.log("\n🔄 Step 1: Starting OAuth flow...");

    // Step 1: Get OAuth start URL
    const startResponse = await axios.get(
      `${BASE_URL}/api/figmaOAuthStart?format=json`
    );
    console.log("✅ OAuth start response:", startResponse.data);

    if (!startResponse.data.authorization_url) {
      throw new Error("No authorization URL returned");
    }

    console.log("\n📋 Copy this URL to your browser to authorize:");
    console.log("🔗", startResponse.data.authorization_url);
    console.log(
      "\n⏳ Waiting 30 seconds for you to complete OAuth authorization..."
    );

    // Wait for user to complete OAuth
    await new Promise((resolve) => setTimeout(resolve, 30000));

    console.log("\n🔄 Step 2: Checking OAuth status after authorization...");

    // Step 2: Check OAuth status
    const statusResponse = await axios.get(`${BASE_URL}/api/figmaOAuthStatus`);
    console.log("📊 OAuth status response:", statusResponse.data);

    if (
      statusResponse.data.status === "authorized" &&
      statusResponse.data.token
    ) {
      console.log("✅ SUCCESS: OAuth tokens are persistent!");
      console.log(
        "🔑 Token found:",
        statusResponse.data.token.substring(0, 20) + "..."
      );
      console.log(
        "🕐 Expires at:",
        new Date(statusResponse.data.expires_at).toISOString()
      );

      // Test token by making a Figma API call
      console.log("\n🔄 Step 3: Testing token with Figma API...");
      try {
        const figmaResponse = await axios.get("https://api.figma.com/v1/me", {
          headers: {
            Authorization: `Bearer ${statusResponse.data.token}`,
          },
        });
        console.log("✅ Token works! User:", figmaResponse.data.handle);
      } catch (apiError) {
        console.error(
          "❌ Token test failed:",
          apiError.response?.data || apiError.message
        );
      }
    } else {
      console.error("❌ FAILED: Tokens are not persisting");
      console.error("Status:", statusResponse.data.status);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response?.data) {
      console.error("Response data:", error.response.data);
    }
  }
}

testOAuthFlow();
