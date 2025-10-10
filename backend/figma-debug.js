#!/usr/bin/env node

// Figma OAuth Debug Tool
// Run this to help diagnose OAuth issues

const axios = require("axios");

async function testFigmaAPI() {
  console.log("🔍 Figma OAuth Debug Tool");
  console.log("========================\n");

  const CLIENT_ID = process.env.FIGMA_CLIENT_ID || "your-figma-client-id";
  const CLIENT_SECRET = process.env.FIGMA_CLIENT_SECRET || "your-figma-client-secret";
  const REDIRECT_URI = "http://localhost:7071/api/figmaOAuthCallback";

  console.log("📋 Configuration:");
  console.log(`Client ID: ${CLIENT_ID}`);
  console.log(
    `Client Secret: ${
      CLIENT_SECRET ? CLIENT_SECRET.substring(0, 8) + "..." : "Missing"
    }`
  );
  console.log(`Redirect URI: ${REDIRECT_URI}\n`);

  // Test 1: Check if we can reach Figma API
  console.log("🌐 Test 1: Figma API Connectivity");
  try {
    const response = await axios.get("https://api.figma.com/v1/me", {
      headers: {
        Authorization: "Bearer figd_GgDW0X-9x98osaRbrkDNffeaWKbVjP6cJ6ZMUS5G",
      },
      timeout: 5000,
    });
    console.log("✅ Can reach Figma API");
    console.log(`✅ Authenticated as: ${response.data.handle}\n`);
  } catch (error) {
    console.log("❌ Cannot reach Figma API or token invalid");
    console.log(`Error: ${error.message}\n`);
  }

  // Test 2: Generate OAuth URL manually
  console.log("🔗 Test 2: OAuth URL Generation");
  const state = Math.random().toString(36).substring(7);
  const oauthUrl = `https://www.figma.com/oauth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=file_read&response_type=code&state=${state}`;

  console.log("Generated OAuth URL:");
  console.log(oauthUrl);
  console.log("\n📝 Manual Test Instructions:");
  console.log("1. Copy the URL above");
  console.log("2. Open it in your browser");
  console.log(
    "3. If you get a Figma error page, the app/redirect URI is not configured"
  );
  console.log(
    "4. If you get an authorization page, the configuration is correct\n"
  );

  // Test 3: Test different redirect URI formats
  console.log("🧪 Test 3: Redirect URI Variations");
  const testURIs = [
    "http://localhost:7071/api/figmaOAuthCallback",
    "http://localhost:7071/api/figmaOAuthCallback/",
    "http://127.0.0.1:7071/api/figmaOAuthCallback",
    "https://localhost:7071/api/figmaOAuthCallback",
  ];

  for (const uri of testURIs) {
    const testUrl = `https://www.figma.com/oauth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      uri
    )}&scope=file_read&response_type=code&state=test`;
    console.log(`Testing: ${uri}`);
    console.log(`URL: ${testUrl}\n`);
  }

  console.log("🔍 Next Steps:");
  console.log("1. Test the manual OAuth URL above");
  console.log("2. If it fails, double-check your Figma app settings");
  console.log("3. Make sure you're logged into the correct Figma account");
  console.log(
    "4. Ensure your Figma app exists in your account"
  );
}

testFigmaAPI().catch(console.error);
