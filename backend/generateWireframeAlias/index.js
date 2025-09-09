// NUCLEAR OPTION: Use unified handler to eliminate API mismatch forever
const unifiedHandler = require("../unified-wireframe-endpoint.js");

module.exports = async function (context, req) {
  console.log("� ALIAS ENDPOINT: Redirecting to unified handler");
  await unifiedHandler(context, req);
};
