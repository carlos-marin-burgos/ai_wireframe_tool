module.exports = async function (context, req) {
  try {
    // Set CORS headers
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      },
    };

    // Handle OPTIONS request
    if (req.method === "OPTIONS") {
      context.res.status = 200;
      context.res.body = "";
      return;
    }

    context.res.status = 200;
    context.res.body = JSON.stringify({
      message: "Test function working!",
      hasOpenAI: !!(
        process.env.AZURE_OPENAI_KEY && process.env.AZURE_OPENAI_ENDPOINT
      ),
      endpoint: process.env.AZURE_OPENAI_ENDPOINT || "not set",
      deployment: process.env.AZURE_OPENAI_DEPLOYMENT || "not set",
    });
  } catch (error) {
    context.res.status = 500;
    context.res.body = JSON.stringify({
      error: "Test function error",
      message: error.message,
    });
  }
};
