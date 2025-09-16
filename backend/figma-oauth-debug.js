// Debug script to manually test Figma OAuth flow
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🔍 Figma OAuth Debug Tool");
console.log("==========================");

// Step 1: Generate OAuth URL
const client_id = "2079DJvSEXq7JypnjqIF8t";
const redirect_uri = "http://localhost:7071/api/figmaOAuthCallback";
const scope = "file_read";
const state = Math.random().toString(36).substring(7);

const oauth_url = `https://www.figma.com/oauth?client_id=${client_id}&redirect_uri=${encodeURIComponent(
  redirect_uri
)}&scope=${scope}&response_type=code&state=${state}`;

console.log("📋 OAuth URL Generated:");
console.log(oauth_url);
console.log("");

console.log("🔧 Redirect URI being used:");
console.log(redirect_uri);
console.log("");

console.log("📝 Instructions:");
console.log("1. Go to https://www.figma.com/developers/apps");
console.log('2. Find your app "2079DJvSEXq7JypnjqIF8t"');
console.log("3. Check if this EXACT redirect URI is registered:");
console.log("   http://localhost:7071/api/figmaOAuthCallback");
console.log("");
console.log("⚠️  Common issues:");
console.log("   - Missing http:// prefix");
console.log("   - Wrong port (7071 vs 5001)");
console.log("   - Trailing slash difference");
console.log("   - Case sensitivity");
console.log("");

rl.question("Press Enter to test the OAuth URL in your browser...", () => {
  console.log("Opening OAuth URL...");

  // For macOS
  require("child_process").exec(`open "${oauth_url}"`);

  rl.question(
    "After authorizing, paste the full callback URL here: ",
    (callback_url) => {
      try {
        const url = new URL(callback_url);
        const code = url.searchParams.get("code");
        const returned_state = url.searchParams.get("state");

        console.log("");
        console.log("✅ Callback URL parsed:");
        console.log("Code:", code ? code.substring(0, 20) + "..." : "MISSING");
        console.log("State:", returned_state);
        console.log("Expected State:", state);
        console.log("State matches:", returned_state === state ? "✅" : "❌");

        if (code) {
          console.log("");
          console.log("🎉 SUCCESS! OAuth authorization worked!");
          console.log("The issue is likely in the token exchange step.");
        } else {
          console.log("");
          console.log("❌ FAILED! No authorization code received.");
          console.log("Check your Figma app redirect URI configuration.");
        }
      } catch (error) {
        console.log("❌ Invalid callback URL format:", error.message);
      }

      rl.close();
    }
  );
});
