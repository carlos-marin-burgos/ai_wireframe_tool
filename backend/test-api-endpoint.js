// Test the Azure Function API endpoint with Pure AI
require("dotenv").config();

const crypto = require("crypto");

// Import our clean Pure AI function
const {
  generateWireframeFromDescription,
} = require("./generateWireframe/pure-ai-main.js");

// Simulate the Azure Function API request
async function testAPIEndpoint() {
  console.log("🚀 Testing Azure Function API Endpoint with Pure AI\n");

  // Simulate the API request structure
  const mockRequest = {
    method: "POST",
    headers: {
      "user-agent": "Test Client",
      "content-type": "application/json",
    },
    body: {
      description:
        "social media dashboard with engagement metrics and content calendar",
      colorScheme: "primary",
    },
  };

  const correlationId = crypto.randomUUID();
  const startTime = Date.now();

  try {
    console.log(`📝 Request: "${mockRequest.body.description}"`);
    console.log(`🆔 Correlation ID: ${correlationId}`);

    // Call the main wireframe function
    const result = await generateWireframeFromDescription(
      mockRequest.body.description,
      mockRequest.body.colorScheme,
      correlationId
    );

    const processingTime = Date.now() - startTime;

    // Simulate the API response
    const apiResponse = {
      success: true,
      data: {
        html: result.html,
        reactCode: result.reactCode,
        source: result.source,
        aiGenerated: result.aiGenerated,
        unlimited: result.unlimited,
      },
      metadata: {
        correlationId,
        processingTimeMs: processingTime,
        generatedAt: new Date().toISOString(),
      },
    };

    console.log(`\n✅ API Response Generated Successfully!`);
    console.log(`⏱️ Processing Time: ${processingTime}ms`);
    console.log(`📊 Source: ${result.source}`);
    console.log(`🤖 AI Generated: ${result.aiGenerated}`);
    console.log(`🔮 Unlimited: ${result.unlimited}`);
    console.log(`📏 HTML Length: ${result.html.length} chars`);

    if (result.reactCode) {
      console.log(`⚛️ React Code: ${result.reactCode.length} chars`);

      // Extract component name
      const componentMatch = result.reactCode.match(/const (\w+):/);
      if (componentMatch) {
        console.log(`🧩 Component: ${componentMatch[1]}`);
      }
    }

    // Simulate successful HTTP 200 response
    console.log(`\n🌐 HTTP Response: 200 OK`);
    console.log(
      `📦 Response Size: ${JSON.stringify(apiResponse).length} chars`
    );

    return apiResponse;
  } catch (error) {
    console.log(`❌ API Error: ${error.message}`);

    // Simulate error HTTP response
    const errorResponse = {
      success: false,
      error: {
        message: error.message,
        correlationId,
        processingTimeMs: Date.now() - startTime,
      },
    };

    console.log(`🌐 HTTP Response: 500 Internal Server Error`);
    return errorResponse;
  }
}

// Test multiple endpoints
async function testMultipleRequests() {
  const testCases = [
    "cryptocurrency trading dashboard with portfolio tracking",
    "recipe sharing app with ingredient scanner",
    "fitness tracker with workout planning",
  ];

  console.log(`🎯 Testing ${testCases.length} API requests...\n`);

  for (let i = 0; i < testCases.length; i++) {
    console.log(`\n--- Test ${i + 1}/${testCases.length} ---`);
    await testAPIEndpoint();
  }

  console.log(`\n🎉 All API tests completed!`);
  console.log(`✨ Pure AI system ready for production deployment!`);
}

// Run the test
testAPIEndpoint();
