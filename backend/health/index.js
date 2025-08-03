module.exports = async function (context, req) {
  context.log("Health check requested");

  context.res = {
    status: 200,
    body: {
      status: "OK",
      timestamp: new Date().toISOString()
    }
  };
};
