module.exports = async function (context, req) {
  context.res = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  context.res.status = 200;
  context.res.body = {
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "production",
  };
};
