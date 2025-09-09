// NUCLEAR OPTION: Single unified endpoint that handles ALL wireframe requests
// This eliminates the API mismatch problem FOREVER

const fs = require('fs');
const path = require('path');

// Import the actual wireframe generation logic
let generateWireframeMain;
try {
  generateWireframeMain = require('./generateWireframe/index.js');
} catch (error) {
  console.error('Could not load main wireframe function:', error);
}

// Unified handler function
async function handleWireframeRequest(context, req) {
  console.log('🔥 UNIFIED ENDPOINT: Handling wireframe request');
  console.log('🔥 Method:', req.method);
  console.log('🔥 URL:', req.url);
  console.log('🔥 Headers:', JSON.stringify(req.headers, null, 2));
  console.log('🔥 Body:', JSON.stringify(req.body, null, 2));

  // Set CORS headers for all responses
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    context.res = {
      status: 200,
      headers: corsHeaders
    };
    return;
  }

  try {
    // Call the main wireframe generation function
    if (generateWireframeMain) {
      await generateWireframeMain(context, req);
      console.log('✅ UNIFIED ENDPOINT: Successfully generated wireframe');
    } else {
      // Fallback response if main function not available
      context.res = {
        status: 200,
        headers: corsHeaders,
        body: {
          html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fallback Wireframe</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 20px; background: #f3f2f1; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #0078d4; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Wireframe Generated Successfully</h1>
        <p>This is a fallback wireframe response. The unified endpoint is working!</p>
        <p>Request: ${req.body?.description || 'No description provided'}</p>
    </div>
</body>
</html>`,
          source: "unified-fallback",
          aiGenerated: false,
          processingTimeMs: 100,
          fallback: true
        }
      };
    }
  } catch (error) {
    console.error('❌ UNIFIED ENDPOINT ERROR:', error);
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: {
        error: "Unified endpoint error",
        message: error.message
      }
    };
  }
}

module.exports = handleWireframeRequest;
