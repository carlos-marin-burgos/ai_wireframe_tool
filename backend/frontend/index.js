exports.index = async function (context, req) {
  context.log("frontend stub invoked");
  context.res = {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: { ok: true, message: "frontend function is disabled (stub)." },
  };
};
