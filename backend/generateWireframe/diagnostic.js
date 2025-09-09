"use strict";
// Dedicated minimal diagnostic handler to bypass large legacy index.js
const crypto = require("crypto");

function cors(id) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "X-Correlation-ID": id,
  };
}

module.exports = async function (context, req) {
  const correlationId = crypto.randomUUID();
  if (req.method === "OPTIONS") {
    context.res = { status: 200, headers: cors(correlationId) };
    return;
  }
  let mode = "NORMAL";
  try {
    const q = req.method === "GET" ? req.query : req.body || {};
    if (q?.fastTest || q?.test || q?.ping) mode = "FAST_TEST";
  } catch {}
  context.res = {
    status: 200,
    headers: cors(correlationId),
    body: {
      ok: true,
      diagnostic: true,
      mode,
      correlationId,
      timestamp: new Date().toISOString(),
      env: {
        hasKey: !!process.env.AZURE_OPENAI_KEY,
        hasEndpoint: !!process.env.AZURE_OPENAI_ENDPOINT,
        deployment: process.env.AZURE_OPENAI_DEPLOYMENT || null,
        nodeVersion: process.version,
      },
    },
  };
};
