module.exports = async function (context, req) {
  context.res = {
    status: 200,
    body: {
      message: "TEST SUCCESS - Function App is working!",
      timestamp: new Date().toISOString(),
    },
  };
};
