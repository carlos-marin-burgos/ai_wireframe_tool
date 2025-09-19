/**
 * Debug Website Analyzer Azure Function
 * Simple test to check if basic functionality works
 */

module.exports = async function (context, req) {
  // Set CORS headers for all responses
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    context.res = {
      status: 200,
      headers: corsHeaders,
      body: "",
    };
    return;
  }

  context.log("🔍 Website Analyzer Debug function triggered");

  try {
    // Parse request body
    const { url } = req.body || {};

    if (!url) {
      context.res = {
        status: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: "URL is required",
        }),
      };
      return;
    }

    context.log(`📋 Debug analysis for: ${url}`);

    // Try basic cheerio functionality first
    const cheerio = require("cheerio");

    // Simple HTML test
    const testHtml =
      "<html><head><title>Test</title></head><body><h1>Hello World</h1></body></html>";
    const $ = cheerio.load(testHtml);
    const title = $("title").text();

    context.log(`Cheerio test successful: ${title}`);

    // Try to check if puppeteer is available
    let puppeteerStatus = "not tested";
    try {
      const puppeteer = require("puppeteer");
      puppeteerStatus = "module loaded";
      context.log("Puppeteer module loaded successfully");
    } catch (error) {
      puppeteerStatus = `module error: ${error.message}`;
      context.log("Puppeteer module error:", error.message);
    }

    context.res = {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        debug: {
          url: url,
          cheerioTest: title,
          puppeteerStatus: puppeteerStatus,
          timestamp: new Date().toISOString(),
        },
      }),
    };
  } catch (error) {
    context.log("❌ Debug analysis error:", error);

    context.res = {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: "Debug analysis failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
