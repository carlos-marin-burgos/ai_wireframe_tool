exports.index = async function (context, req) {
  context.log("wireframeAnalyze stub invoked");
  context.res = {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      ok: true,
      message: "wireframeAnalyze function is disabled (stub).",
    },
  };
};
