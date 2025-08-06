#!/usr/bin/env node

// Comprehensive API Testing Script
// Tests all endpoints with correct parameters to avoid future issues

console.log("🧪 Comprehensive API Testing Script");
console.log("===================================");

const BASE_URL = process.env.API_BASE_URL || "http://localhost:7071";

// Test configurations
const tests = [
  {
    name: "🔥 Generate Wireframe (Simple - should use fast mode)",
    endpoint: "/api/generate-wireframe",
    method: "POST",
    body: {
      description: "Create a dashboard",
      theme: "microsoftlearn",
      colorScheme: "primary",
    },
    expectedSource: "fast-pattern",
  },
  {
    name: "🤖 Generate Wireframe (Complex - should use OpenAI)",
    endpoint: "/api/generate-wireframe",
    method: "POST",
    body: {
      description:
        "Create a comprehensive and advanced Microsoft Learn certification dashboard with interactive tracking, complex analytics, custom learning paths, and personalized recommendations",
      theme: "microsoftlearn",
      colorScheme: "primary",
      fastMode: false,
    },
    expectedSource: "openai-context-aware",
  },
  {
    name: "💡 Generate Suggestions",
    endpoint: "/api/generate-suggestions",
    method: "POST",
    body: {
      query: "Microsoft Learn dashboard",
    },
    expectedField: "suggestions",
  },
  {
    name: "❤️ Health Check",
    endpoint: "/api/health",
    method: "GET",
    expectedField: "status",
  },
];

async function runTest(test) {
  console.log(`\n${test.name}`);
  console.log("=".repeat(test.name.length));

  try {
    const options = {
      method: test.method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (test.body) {
      options.body = JSON.stringify(test.body);
      console.log("📤 Request body:", JSON.stringify(test.body, null, 2));
    }

    const response = await fetch(`${BASE_URL}${test.endpoint}`, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("✅ Response received");
    console.log("📊 Status:", response.status);

    if (test.expectedSource) {
      console.log("🔍 Source:", data.source || "unknown");
      console.log("🤖 AI Generated:", data.aiGenerated || false);
      console.log("⚡ Fast Mode:", data.fastMode || false);
      console.log("⏱️ Processing Time:", data.processingTimeMs || 0, "ms");

      if (data.source === test.expectedSource) {
        console.log("✅ Expected source confirmed");
      } else {
        console.log(
          "⚠️ Unexpected source:",
          data.source,
          "(expected:",
          test.expectedSource + ")"
        );
      }
    }

    if (test.expectedField) {
      if (data[test.expectedField]) {
        console.log(`✅ Expected field '${test.expectedField}' found`);
        if (Array.isArray(data[test.expectedField])) {
          console.log(`📝 Count: ${data[test.expectedField].length} items`);
        }
      } else {
        console.log(`❌ Expected field '${test.expectedField}' missing`);
      }
    }

    console.log("📋 Response keys:", Object.keys(data).join(", "));
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

async function runAllTests() {
  console.log(`🎯 Testing against: ${BASE_URL}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);

  for (const test of tests) {
    await runTest(test);
    // Small delay between tests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\n🎉 All tests completed!");
  console.log("\n📋 API Endpoint Summary:");
  console.log(
    '  ✅ /api/generate-wireframe (POST) - use "description" parameter'
  );
  console.log('  ✅ /api/generate-suggestions (POST) - use "query" parameter');
  console.log("  ✅ /api/health (GET) - no parameters needed");
  console.log("\n💡 Tips:");
  console.log('  - Use "description" not "request" for wireframes');
  console.log("  - Requests under 100 chars trigger fast mode automatically");
  console.log("  - Use fastMode: false to force OpenAI for testing");
  console.log(
    '  - Include "advanced", "complex", "custom", or "interactive" for AI mode'
  );
}

// Run if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, runTest };
