// Ultra-minimal Azure Function for testing
module.exports = async function (context, req) {
  context.log("Test function called");

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    context.res = {
      status: 200,
      headers: corsHeaders,
      body: "",
    };
    return;
  }

  const fallbackTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Test Wireframe</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #0078d4; color: white; padding: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Test Wireframe Generated</h1>
        <p>This is a minimal test wireframe</p>
    </div>
    <div style="padding: 20px;">
        <h2>Test Content</h2>
        <p>Azure Functions is working!</p>
    </div>
</body>
</html>`;

  context.res = {
    status: 200,
    headers: corsHeaders,
    body: {
      success: true,
      wireframe: fallbackTemplate,
      source: "test-fallback",
      timestamp: new Date().toISOString(),
    },
  };
};
