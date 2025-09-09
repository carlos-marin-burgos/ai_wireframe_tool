#!/usr/bin/env node

/**
 * SIMPLE UNIFIED SERVER - ONE PORT SOLUTION
 * No more port conflicts!
 */

import { createServer } from "http";
import { readFileSync, existsSync } from "fs";
import { resolve, join, extname } from "path";
import { parse } from "url";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;
let azureFunctions = null;

console.log("🚀 Starting SIMPLE UNIFIED SERVER");

// Start Azure Functions
function startAzureFunctions() {
  console.log("📦 Starting Azure Functions...");

  azureFunctions = spawn("func", ["start", "--port", "7072"], {
    cwd: join(__dirname, "backend"),
    stdio: "pipe",
  });

  azureFunctions.stdout.on("data", (data) => {
    const output = data.toString();
    if (output.includes("Host started") || output.includes("Functions:")) {
      console.log("✅ Azure Functions ready on port 7072");
    }
  });

  azureFunctions.stderr.on("data", (data) => {
    console.log("⚠️ Azure Functions:", data.toString().trim());
  });
}

// Simple proxy function
async function proxyToAzureFunctions(req, res, url) {
  try {
    const fetch = (await import("node-fetch")).default;
    const azureUrl = `http://localhost:7072${url}`;

    let body = "";
    if (req.method === "POST") {
      req.on("data", (chunk) => (body += chunk));
      await new Promise((resolve) => req.on("end", resolve));
    }

    const response = await fetch(azureUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: req.method === "POST" ? body : undefined,
    });

    const data = await response.text();

    res.writeHead(response.status, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    });

    res.end(data);
  } catch (error) {
    console.error("❌ Proxy error:", error.message);
    res.writeHead(503, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Backend service unavailable",
        message: "Azure Functions are starting. Please wait and try again.",
        timestamp: new Date().toISOString(),
      })
    );
  }
}

// Simple file server
function serveFile(res, filePath) {
  try {
    if (existsSync(filePath)) {
      const content = readFileSync(filePath);
      const ext = extname(filePath);
      const contentType =
        {
          ".html": "text/html",
          ".js": "application/javascript",
          ".css": "text/css",
          ".json": "application/json",
          ".png": "image/png",
          ".ico": "image/x-icon",
        }[ext] || "text/plain";

      res.writeHead(200, {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
      });
      res.end(content);
      return true;
    }
  } catch (error) {
    console.error("File serve error:", error.message);
  }
  return false;
}

// Create server
const server = createServer(async (req, res) => {
  const parsed = parse(req.url, true);
  const pathname = parsed.pathname;

  console.log(`${req.method} ${pathname}`);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    });
    res.end();
    return;
  }

  // API proxy
  if (pathname.startsWith("/api/")) {
    await proxyToAzureFunctions(req, res, pathname + (parsed.search || ""));
    return;
  }

  // Health check
  if (pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "healthy",
        server: "unified-simple",
        port: PORT,
        azureFunctions: azureFunctions ? "running" : "stopped",
        timestamp: new Date().toISOString(),
      })
    );
    return;
  }

  // Static files - serve from dist directory
  let filePath;
  if (pathname === "/") {
    filePath = resolve(__dirname, "dist", "index.html");
  } else {
    filePath = resolve(__dirname, "dist", pathname.substring(1));
  }

  if (serveFile(res, filePath)) {
    return;
  }

  // Fallback to index.html for SPA - serve from dist
  if (!pathname.includes(".")) {
    if (serveFile(res, resolve(__dirname, "dist", "index.html"))) {
      return;
    }
  }

  // 404
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

// Start everything
startAzureFunctions();

server.listen(PORT, () => {
  console.log(`
🎉 UNIFIED SERVER RUNNING!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Frontend:        http://localhost:${PORT}
🔧 API Endpoints:   http://localhost:${PORT}/api/*
💚 Health Check:    http://localhost:${PORT}/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ ONE PORT FOR EVERYTHING - NO MORE CONFLICTS!
✨ NO MORE FALLBACK TEMPLATES - AI ONLY!
`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down...");
  if (azureFunctions) {
    azureFunctions.kill("SIGINT");
  }
  server.close();
  process.exit(0);
});
