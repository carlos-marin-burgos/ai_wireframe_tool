#!/usr/bin/env node

/**
 * 🛡️ Server Health Monitor
 * Ensures the wireframe server stays alive and healthy for users
 */

const http = require("http");
const { spawn } = require("child_process");
const path = require("path");

const SERVER_PORT = 5001;
const CHECK_INTERVAL = 30000; // 30 seconds
const RESTART_DELAY = 5000; // 5 seconds

let serverProcess = null;
let isRestarting = false;

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

function checkServerHealth() {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: SERVER_PORT,
        path: "/api/health",
        method: "GET",
        timeout: 5000,
      },
      (res) => {
        resolve(res.statusCode === 200);
      }
    );

    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

function startServer() {
  if (serverProcess || isRestarting) return;

  log("🚀 Starting wireframe server...");

  serverProcess = spawn("node", ["simple-server.js"], {
    cwd: __dirname,
    stdio: ["ignore", "pipe", "pipe"],
    detached: false,
  });

  serverProcess.stdout.on("data", (data) => {
    process.stdout.write(data);
  });

  serverProcess.stderr.on("data", (data) => {
    process.stderr.write(data);
  });

  serverProcess.on("exit", (code, signal) => {
    log(`❌ Server process exited with code ${code}, signal ${signal}`);
    serverProcess = null;

    if (!isRestarting) {
      log(`🔄 Auto-restarting server in ${RESTART_DELAY / 1000} seconds...`);
      setTimeout(() => {
        isRestarting = false;
        startServer();
      }, RESTART_DELAY);
      isRestarting = true;
    }
  });

  serverProcess.on("error", (error) => {
    log(`💥 Server process error: ${error.message}`);
    serverProcess = null;
  });

  log("✅ Server process started");
}

async function monitorServer() {
  const isHealthy = await checkServerHealth();

  if (isHealthy) {
    log("💚 Server is healthy and responding");
  } else {
    log("🔴 Server is not responding - restarting...");

    if (serverProcess) {
      log("🛑 Killing unresponsive server process...");
      serverProcess.kill("SIGTERM");
      setTimeout(() => {
        if (serverProcess) {
          serverProcess.kill("SIGKILL");
        }
      }, 5000);
    } else {
      startServer();
    }
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  log("🔄 Monitor received SIGINT - shutting down gracefully...");
  if (serverProcess) {
    serverProcess.kill("SIGTERM");
  }
  process.exit(0);
});

process.on("SIGTERM", () => {
  log("🔄 Monitor received SIGTERM - shutting down gracefully...");
  if (serverProcess) {
    serverProcess.kill("SIGTERM");
  }
  process.exit(0);
});

// Start monitoring
log("🛡️ Server monitor starting...");
log(`📊 Health checks every ${CHECK_INTERVAL / 1000} seconds`);
log(`🔄 Auto-restart delay: ${RESTART_DELAY / 1000} seconds`);

startServer();
setInterval(monitorServer, CHECK_INTERVAL);

// Initial health check after server startup delay
setTimeout(monitorServer, 10000);
