// CORS Test - Check if frontend can communicate with backend
// This simulates browser behavior

const BACKEND_URL = "https://func-prod-fresh-u62277mynzfg4.azurewebsites.net";
const FRONTEND_URL = "https://calm-mud-06fa43c0f.2.azurestaticapps.net";

console.log("🔍 CORS CONNECTIVITY TEST");
console.log("═══════════════════════");

async function testCORS() {
  console.log("\n🌐 Testing Cross-Origin Resource Sharing...");

  try {
    // Test 1: Preflight OPTIONS request
    console.log("1️⃣ Testing Preflight Request...");
    const preflightResponse = await fetch(
      `${BACKEND_URL}/api/generate-wireframe`,
      {
        method: "OPTIONS",
        headers: {
          Origin: FRONTEND_URL,
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "Content-Type",
        },
      }
    );

    const corsAllowed = preflightResponse.headers.get(
      "Access-Control-Allow-Origin"
    );
    const methodsAllowed = preflightResponse.headers.get(
      "Access-Control-Allow-Methods"
    );
    const headersAllowed = preflightResponse.headers.get(
      "Access-Control-Allow-Headers"
    );

    console.log(`   Status: ${preflightResponse.status}`);
    console.log(`   CORS Origin: ${corsAllowed || "Not set"}`);
    console.log(`   Methods: ${methodsAllowed || "Default"}`);
    console.log(`   Headers: ${headersAllowed || "Default"}`);

    if (corsAllowed) {
      console.log("   ✅ CORS Preflight: PASSED");
    } else {
      console.log("   ❌ CORS Preflight: FAILED");
      return false;
    }

    // Test 2: Actual POST request with Origin header
    console.log("\n2️⃣ Testing Actual Request...");
    const actualResponse = await fetch(
      `${BACKEND_URL}/api/generate-wireframe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: FRONTEND_URL,
        },
        body: JSON.stringify({
          description: "CORS test wireframe",
          colorScheme: "primary",
        }),
      }
    );

    const responseCors = actualResponse.headers.get(
      "Access-Control-Allow-Origin"
    );
    console.log(`   Status: ${actualResponse.status}`);
    console.log(`   Response CORS: ${responseCors || "Not set"}`);

    if (responseCors) {
      console.log("   ✅ CORS Response: PASSED");

      if (actualResponse.status === 200) {
        console.log("   ✅ Backend Response: SUCCESS");
        const data = await actualResponse.json();
        console.log(`   🤖 AI Generated: ${data.aiGenerated ? "YES" : "NO"}`);
        return true;
      } else {
        console.log(
          `   ⚠️ Backend Response: ${actualResponse.status} (CORS working, but backend has issues)`
        );
        return "cors-ok-backend-issues";
      }
    } else {
      console.log("   ❌ CORS Response: FAILED");
      return false;
    }
  } catch (error) {
    console.log(`❌ CORS Test Error: ${error.message}`);
    return false;
  }
}

async function main() {
  const result = await testCORS();

  console.log("\n📊 CORS TEST RESULTS");
  console.log("═══════════════════");

  if (result === true) {
    console.log("🟢 CORS Status: FULLY WORKING");
    console.log("🟢 Backend Status: RESPONDING");
    console.log("✅ Frontend can communicate with backend successfully!");
  } else if (result === "cors-ok-backend-issues") {
    console.log("🟢 CORS Status: WORKING");
    console.log("🟡 Backend Status: HAS ISSUES");
    console.log("✅ CORS is fixed! Backend needs runtime debugging.");
  } else {
    console.log("🔴 CORS Status: BLOCKED");
    console.log("❌ Frontend cannot communicate with backend");
  }

  console.log("\n🌐 For testing in browser:");
  console.log(`   Open: ${FRONTEND_URL}`);
  console.log("   Try generating a wireframe to test real browser behavior");
}

main().catch(console.error);
