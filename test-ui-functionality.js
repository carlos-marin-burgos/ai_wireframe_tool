// UI Testing Script for Designetica Wireframe Generator
// This script tests the main functionality of your application

const TEST_CONFIG = {
  FRONTEND_URL: "http://localhost:5173",
  BACKEND_URL: "https://func-prod-fresh-u62277mynzfg4.azurewebsites.net/api",
  TESTS: [
    {
      name: "Backend Health Check",
      endpoint: "/health",
      method: "GET",
      expected: 200,
    },
    {
      name: "AI Builder Health Check",
      endpoint: "/ai-builder/health",
      method: "GET",
      expected: 200,
    },
    {
      name: "Generate Wireframe (Fast Test)",
      endpoint: "/generate-wireframe?fastTest=true",
      method: "GET",
      expected: 200,
    },
    {
      name: "Generate Wireframe (Full Test)",
      endpoint: "/generate-wireframe",
      method: "POST",
      body: {
        description:
          "Create a simple landing page with header, hero section, and footer",
        theme: "microsoftlearn",
        colorScheme: "primary",
      },
      expected: 200,
    },
    {
      name: "Generate Suggestions",
      endpoint: "/generate-suggestions",
      method: "POST",
      body: {
        userInput: "dashboard",
      },
      expected: 200,
    },
  ],
};

async function testBackendEndpoint(test) {
  const url = `${TEST_CONFIG.BACKEND_URL}${test.endpoint}`;

  console.log(`\n🧪 Testing: ${test.name}`);
  console.log(`📡 URL: ${url}`);

  try {
    const options = {
      method: test.method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (test.body) {
      options.body = JSON.stringify(test.body);
    }

    const startTime = Date.now();
    const response = await fetch(url, options);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const isSuccess = response.status === test.expected;
    const statusIcon = isSuccess ? "✅" : "❌";

    console.log(
      `${statusIcon} Status: ${response.status} (Expected: ${test.expected})`
    );
    console.log(`⏱️  Response Time: ${responseTime}ms`);

    if (response.headers.get("content-type")?.includes("application/json")) {
      try {
        const data = await response.json();
        console.log(`📦 Response Type: JSON`);
        console.log(`📏 Response Size: ${JSON.stringify(data).length} chars`);

        // Log key fields for wireframe responses
        if (data.html) {
          console.log(`🎨 HTML Generated: ${data.html.length} chars`);
          console.log(`🤖 AI Generated: ${data.aiGenerated || "unknown"}`);
          console.log(
            `⚡ Processing Time: ${data.processingTimeMs || "unknown"}ms`
          );
        }

        // Log suggestions count
        if (data.suggestions) {
          console.log(`💡 Suggestions: ${data.suggestions.length} items`);
        }

        // Log health status
        if (data.status) {
          console.log(`💖 Health Status: ${data.status}`);
        }
      } catch (e) {
        console.log(`📦 Response Type: JSON (parse error)`);
      }
    } else {
      console.log(
        `📦 Response Type: ${response.headers.get("content-type") || "unknown"}`
      );
    }

    return {
      name: test.name,
      success: isSuccess,
      status: response.status,
      responseTime,
      error: isSuccess
        ? null
        : `Expected ${test.expected}, got ${response.status}`,
    };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return {
      name: test.name,
      success: false,
      status: "ERROR",
      responseTime: null,
      error: error.message,
    };
  }
}

async function runAllTests() {
  console.log("🚀 Starting Designetica UI & Backend Test Suite");
  console.log("=".repeat(60));

  const results = [];

  for (const test of TEST_CONFIG.TESTS) {
    const result = await testBackendEndpoint(test);
    results.push(result);

    // Small delay between tests
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("\n📊 TEST SUMMARY");
  console.log("=".repeat(60));

  const passed = results.filter((r) => r.success).length;
  const total = results.length;

  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);

  if (passed === total) {
    console.log("\n🎉 ALL TESTS PASSED! Your application is fully functional.");
    console.log("\n🔗 Ready to test frontend:");
    console.log(`   Open: ${TEST_CONFIG.FRONTEND_URL}`);
    console.log("   Try generating a wireframe with any description!");
  } else {
    console.log("\n🔧 Some tests failed. Check the details above.");
  }

  console.log("\n📋 Quick Test Steps for Frontend:");
  console.log(
    '1. 📝 Enter description: "Create a modern dashboard with cards and charts"'
  );
  console.log('2. 🎯 Click "Generate Wireframe"');
  console.log("3. ⏱️  Wait 10-20 seconds for AI processing");
  console.log("4. 🎨 View generated wireframe on right side");
  console.log("5. 💾 Save wireframe with a name");
  console.log("6. 📤 Load previously saved wireframes");

  return results;
}

// Run the tests
runAllTests().catch(console.error);
