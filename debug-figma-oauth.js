#!/usr/bin/env node

import axios from "axios";

// Debug script to test Figma OAuth token exchange
async function debugTokenExchange() {
  console.log("🔍 Debugging Figma OAuth Token Exchange\n");

  // Get config from environment (simulating local.settings.json)
  const config = {
    clientId: process.env.FIGMA_CLIENT_ID || "your-figma-client-id",
    clientSecret: process.env.FIGMA_CLIENT_SECRET || "your-figma-client-secret",
    redirectUri: "http://localhost:7071/api/figmaOAuthCallback",
  };

  console.log("📋 Configuration:");
  console.log(`Client ID: ${config.clientId.substring(0, 10)}...`);
  console.log(`Client Secret: ${config.clientSecret ? "Present" : "Missing"}`);
  console.log(`Redirect URI: ${config.redirectUri}\n`);

  // Test different redirect URI variations
  const variants = [
    config.redirectUri,
    config.redirectUri + "/",
    config.redirectUri.replace("http://", "https://"),
    "http://localhost:7071/api/figmaOAuthCallback",
    "https://localhost:7071/api/figmaOAuthCallback",
    "http://localhost:7071/api/figmaOAuthCallback/",
    "https://localhost:7071/api/figmaOAuthCallback/",
  ];

  // Remove duplicates
  const uniqueVariants = [...new Set(variants)];

  console.log("🔗 Testing redirect URI variants:");
  uniqueVariants.forEach((variant, i) => console.log(`${i + 1}. ${variant}`));
  console.log();

  // Test with a dummy code to see what error we get
  const testCode = "test_code_12345";

  for (const redirectUri of uniqueVariants) {
    try {
      console.log(`📤 Testing: ${redirectUri}`);

      const params = new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: redirectUri,
        code: testCode,
        grant_type: "authorization_code",
      });

      const response = await axios.post(
        "https://www.figma.com/api/oauth/token",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          timeout: 5000,
          validateStatus: () => true, // Don't throw on 4xx/5xx
        }
      );

      console.log(`   Status: ${response.status}`);
      console.log(`   Response:`, response.data);

      if (response.status === 400) {
        const error = response.data?.error;
        if (error === "invalid_grant") {
          console.log(
            "   ✅ Redirect URI is valid (invalid_grant expected with test code)"
          );
        } else if (error === "redirect_uri_mismatch") {
          console.log(
            "   ❌ Redirect URI mismatch - not registered in Figma app"
          );
        } else {
          console.log(`   ⚠️  Unexpected error: ${error}`);
        }
      }
    } catch (error) {
      console.log(`   ❌ Network error:`, error.message);
    }

    console.log();
  }

  console.log("💡 Next steps:");
  console.log(
    "1. Check your Figma app settings at https://www.figma.com/developers/apps"
  );
  console.log(
    "2. Verify the redirect URI exactly matches one that shows ✅ above"
  );
  console.log("3. Make sure your app is not in draft mode");
  console.log("4. Try the OAuth flow again with a real authorization code");
}

// Run the debug
debugTokenExchange().catch(console.error);
