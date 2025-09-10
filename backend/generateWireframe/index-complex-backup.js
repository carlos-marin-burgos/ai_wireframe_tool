// Simple test function to verify Azure Functions are working
module.exports = async function (context, req) {
  try {
    // Set CORS headers
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
      },
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      context.res.status = 200;
      return;
    }

    console.log("Simple function called with:", req.body);

    // Return a simple response
    context.res.status = 200;
    context.res.body = {
      html: "<html><body><h1>Test Wireframe</h1><p>This is a simple test response</p></body></html>",
      fallback: false,
      message: "Simple function working",
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error("Error in simple function:", error);
    context.res = {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: {
        error: "Internal server error",
        message: error.message
      }
    };
  }
};
