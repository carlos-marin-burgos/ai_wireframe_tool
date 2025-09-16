#!/usr/bin/env node

import axios from "axios";

async function testFigmaApp() {
  console.log("🔍 Testing Figma App Configuration\n");

  const clientId = "2079DJvSEXq7JypnjqIF8t";
  const clientSecret = "E8pn4Q8Rz61DCpRhiKKCd5a9GXOnZc";

  console.log(`Client ID: ${clientId.substring(0, 10)}...`);
  console.log(`Client Secret: ${clientSecret ? "Present" : "Missing"}\n`);

  // Test 1: Try to get an authorization URL (this should work even if redirect URI is wrong)
  console.log("📝 Test 1: Authorization URL generation");
  const authUrl = `https://www.figma.com/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    "http://localhost:7071/api/figmaOAuthCallback"
  )}&scope=file_read&state=test123&response_type=code`;
  console.log("Auth URL:", authUrl);
  console.log("✅ If this URL works in browser, your client ID is valid\n");

  // Test 2: Try token endpoint with minimal payload
  console.log("📝 Test 2: Token endpoint availability");
  try {
    const response = await axios.post(
      "https://www.figma.com/api/oauth/token",
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: "http://test.example.com",
        code: "invalid_code",
        grant_type: "authorization_code",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        validateStatus: () => true,
        timeout: 10000,
      }
    );

    console.log(`Response Status: ${response.status}`);
    console.log(`Response:`, response.data);

    if (response.status === 404) {
      console.log("❌ 404 suggests either:");
      console.log("   - App does not exist or is deleted");
      console.log("   - Client ID is incorrect");
      console.log("   - Figma API endpoint changed");
    } else if (response.status === 400) {
      console.log("✅ 400 is expected - app exists and API is responding");
    }
  } catch (error) {
    console.log("❌ Network error:", error.message);
  }

  console.log("\n💡 Troubleshooting:");
  console.log("1. Visit: https://www.figma.com/developers/apps");
  console.log("2. Verify your app exists and is not in draft mode");
  console.log("3. Check that client ID matches exactly");
  console.log("4. Verify redirect URIs in app settings");
  console.log("5. Try the auth URL above in a browser");
}

testFigmaApp().catch(console.error);
