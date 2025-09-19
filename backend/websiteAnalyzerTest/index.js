module.exports = async function (context, req) {
  context.log("HTTP trigger function processed a request.");

  context.res = {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      success: true,
      message: "Test endpoint working",
      timestamp: new Date().toISOString(),
    }),
  };
};
