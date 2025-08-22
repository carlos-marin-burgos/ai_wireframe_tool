#!/usr/bin/env node

/**
 * UNIFIED SERVER - ONE PORT TO RULE THEM ALL
 * Combines Azure Functions + Static Frontend + Simple Backend
 * No more port conflicts, no more confusion!
 */

import express from "express";
import cors from "cors";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000; // ONE PORT FOR EVERYTHING

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.static("."));

console.log("🚀 Starting UNIFIED SERVER - One Port Solution");

// Start Azure Functions in the background
let azureFunctions = null;

function startAzureFunctions() {
  console.log("📦 Starting Azure Functions...");

  azureFunctions = spawn("func", ["start", "--port", "7071"], {
    cwd: path.join(__dirname, "backend"),
    stdio: "pipe",
  });

  azureFunctions.stdout.on("data", (data) => {
    const output = data.toString();
    if (output.includes("Functions:") || output.includes("Host started")) {
      console.log("✅ Azure Functions ready");
    }
  });

  azureFunctions.stderr.on("data", (data) => {
    console.log("⚠️ Azure Functions error:", data.toString());
  });

  azureFunctions.on("close", (code) => {
    console.log(`❌ Azure Functions exited with code ${code}`);
    if (code !== 0) {
      console.log("🔄 Restarting Azure Functions in 5 seconds...");
      setTimeout(startAzureFunctions, 5000);
    }
  });
}

// Proxy all /api requests to Azure Functions
app.use("/api", async (req, res) => {
  const fetch = (await import("node-fetch")).default;

  try {
    const azureFunctionUrl = `http://localhost:7071${req.originalUrl}`;

    const response = await fetch(azureFunctionUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...req.headers,
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.text();

    res.status(response.status);
    res.set(Object.fromEntries(response.headers.entries()));

    try {
      res.json(JSON.parse(data));
    } catch {
      res.send(data);
    }
  } catch (error) {
    console.error("❌ API Proxy Error:", error.message);
    res.status(503).json({
      error: "Backend service unavailable",
      message:
        "Azure Functions are starting up. Please wait a moment and try again.",
      timestamp: new Date().toISOString(),
    });
  }
});

// Serve the main application
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    server: "unified",
    port: PORT,
    azureFunctions: azureFunctions ? "running" : "stopped",
    timestamp: new Date().toISOString(),
  });
});

// Catch-all for SPA routing
app.get("*", (req, res) => {
  if (req.path.includes(".")) {
    // Serve static files
    res.sendFile(path.join(__dirname, req.path));
  } else {
    // Serve main app for SPA routes
    res.sendFile(path.join(__dirname, "index.html"));
  }
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down unified server...");
  if (azureFunctions) {
    azureFunctions.kill("SIGINT");
  }
  process.exit(0);
});

// Start everything
startAzureFunctions();

app.listen(PORT, () => {
  console.log(`
🎉 UNIFIED SERVER RUNNING!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Frontend:        http://localhost:${PORT}
🔧 API Endpoints:   http://localhost:${PORT}/api/*
💚 Health Check:    http://localhost:${PORT}/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ ONE PORT FOR EVERYTHING - NO MORE CONFLICTS!
`);
});
