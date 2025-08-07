#!/usr/bin/env node
/**
 * Designetica Analytics Monitor - Terminal Dashboard
 * Real-time monitoring of API performance and business metrics
 */

const https = require("https");
const http = require("http");

// ANSI color codes for terminal styling
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bg: {
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
  },
};

// Configuration
const config = {
  apiUrl: process.env.API_URL || "http://localhost:7072/api",
  refreshInterval: 5000, // 5 seconds
  maxLogs: 20,
};

// Global state
let analyticsData = null;
let healthData = null;
let activityLog = [];
let isMonitoring = true;
let lastUpdate = null;

// Utility functions
function clearScreen() {
  console.clear();
}

function formatNumber(num) {
  return num.toLocaleString();
}

function formatPercentage(decimal, total = null) {
  if (total) decimal = decimal / total;
  return `${(decimal * 100).toFixed(1)}%`;
}

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatTime(date = new Date()) {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function addToLog(type, message, details = "") {
  activityLog.unshift({
    timestamp: new Date(),
    type,
    message,
    details,
  });

  if (activityLog.length > config.maxLogs) {
    activityLog = activityLog.slice(0, config.maxLogs);
  }
}

// API functions
async function fetchData(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${config.apiUrl}${endpoint}`;
    const client = url.startsWith("https") ? https : http;

    const req = client.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`JSON parse error: ${error.message}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
  });
}

async function loadAnalytics() {
  try {
    analyticsData = await fetchData("/analytics");
    addToLog(
      "success",
      "Analytics data loaded",
      `${analyticsData.summary.totalRequests} total requests`
    );
    return true;
  } catch (error) {
    addToLog("error", "Failed to load analytics", error.message);
    return false;
  }
}

async function loadHealth() {
  try {
    healthData = await fetchData("/health");
    addToLog("info", "Health check completed", `Status: ${healthData.status}`);
    return true;
  } catch (error) {
    addToLog("error", "Health check failed", error.message);
    return false;
  }
}

// Display functions
function drawHeader() {
  const title = "🚀 DESIGNETICA ANALYTICS MONITOR";
  const subtitle = "Real-time API Performance Dashboard";
  const status = isMonitoring ? "🟢 LIVE" : "🔴 PAUSED";
  const timestamp = `Last Update: ${
    lastUpdate ? formatTime(lastUpdate) : "Never"
  }`;

  console.log(`${colors.bg.blue}${colors.white}${colors.bright}`);
  console.log(`${"=".repeat(80)}`);
  console.log(
    `${title.padStart(Math.floor((80 + title.length) / 2)).padEnd(80)}`
  );
  console.log(
    `${subtitle.padStart(Math.floor((80 + subtitle.length) / 2)).padEnd(80)}`
  );
  console.log(`${"=".repeat(80)}${colors.reset}`);
  console.log(
    `${colors.bright}${status.padEnd(40)}${timestamp.padStart(40)}${
      colors.reset
    }`
  );
  console.log();
}

function drawMetrics() {
  if (!analyticsData) {
    console.log(
      `${colors.yellow}⚠️  No analytics data available${colors.reset}`
    );
    console.log();
    return;
  }

  const { summary, userBehavior, performance } = analyticsData;

  console.log(`${colors.bright}${colors.cyan}📊 KEY METRICS${colors.reset}`);
  console.log(`${"-".repeat(80)}`);

  // Row 1: Core metrics
  const totalReqs = formatNumber(summary.totalRequests);
  const successRate = formatPercentage(
    summary.successfulRequests,
    summary.totalRequests
  );
  const aiRate = formatPercentage(
    summary.aiGeneratedRequests,
    summary.totalRequests
  );
  const avgResponse = formatDuration(summary.averageResponseTime);

  console.log(
    `${colors.green}📈 Total Requests: ${colors.bright}${totalReqs}${colors.reset}` +
      `${colors.green}    ✅ Success Rate: ${colors.bright}${successRate}${colors.reset}`
  );
  console.log(
    `${colors.magenta}🤖 AI Generated: ${colors.bright}${aiRate}${colors.reset}` +
      `${colors.yellow}     ⚡ Avg Response: ${colors.bright}${avgResponse}${colors.reset}`
  );

  // Row 2: User metrics
  const sessions = formatNumber(summary.uniqueSessions);
  const errors = formatNumber(summary.totalErrors);
  const peakHour = `${userBehavior.peakUsageHour}:00`;
  const topAgent = userBehavior.topUserAgent.split(" ")[0];

  console.log(
    `${colors.blue}👥 Active Sessions: ${colors.bright}${sessions}${colors.reset}` +
      `${colors.red}    ❌ Total Errors: ${colors.bright}${errors}${colors.reset}`
  );
  console.log(
    `${colors.cyan}🎯 Peak Hour: ${colors.bright}${peakHour}${colors.reset}` +
      `${colors.white}        🌐 Top Client: ${colors.bright}${topAgent}${colors.reset}`
  );

  console.log();
}

function drawHealthStatus() {
  if (!healthData) {
    console.log(`${colors.yellow}⚠️  No health data available${colors.reset}`);
    console.log();
    return;
  }

  console.log(`${colors.bright}${colors.green}🏥 SYSTEM HEALTH${colors.reset}`);
  console.log(`${"-".repeat(80)}`);

  const status =
    healthData.status === "OK"
      ? `${colors.green}✅ HEALTHY${colors.reset}`
      : `${colors.red}❌ UNHEALTHY${colors.reset}`;

  const uptime = `${Math.floor(healthData.system.uptime / 3600)}h ${Math.floor(
    (healthData.system.uptime % 3600) / 60
  )}m`;
  const memory = `${Math.round(
    healthData.system.memoryUsage.used / 1024 / 1024
  )}MB`;
  const nodeVersion = healthData.system.nodeVersion;

  console.log(
    `${colors.bright}Status: ${status}${colors.reset}` +
      `    🕐 Uptime: ${colors.bright}${uptime}${colors.reset}` +
      `    💾 Memory: ${colors.bright}${memory}${colors.reset}`
  );

  console.log(
    `${colors.blue}⚙️  Node: ${colors.bright}${nodeVersion}${colors.reset}` +
      `    🌍 Environment: ${colors.bright}${healthData.environment}${colors.reset}`
  );

  // Service status
  const openAI = healthData.services.hasOpenAI
    ? `${colors.green}✅ Connected${colors.reset}`
    : `${colors.red}❌ Disconnected${colors.reset}`;

  const appInsights = healthData.services.hasAppInsights
    ? `${colors.green}✅ Connected${colors.reset}`
    : `${colors.yellow}⚠️  Local Mode${colors.reset}`;

  console.log(
    `${colors.magenta}🤖 OpenAI: ${openAI}${colors.reset}` +
      `    📊 App Insights: ${appInsights}${colors.reset}`
  );

  console.log();
}

function drawActivityLog() {
  console.log(
    `${colors.bright}${colors.white}⚡ RECENT ACTIVITY${colors.reset}`
  );
  console.log(`${"-".repeat(80)}`);

  if (activityLog.length === 0) {
    console.log(`${colors.yellow}No recent activity${colors.reset}`);
    console.log();
    return;
  }

  const maxDisplay = Math.min(10, activityLog.length);

  for (let i = 0; i < maxDisplay; i++) {
    const log = activityLog[i];
    const time = formatTime(log.timestamp);

    let icon, color;
    switch (log.type) {
      case "success":
        icon = "✅";
        color = colors.green;
        break;
      case "error":
        icon = "❌";
        color = colors.red;
        break;
      case "info":
        icon = "ℹ️";
        color = colors.blue;
        break;
      default:
        icon = "📝";
        color = colors.white;
    }

    console.log(`${color}${time} ${icon} ${log.message}${colors.reset}`);
    if (log.details) {
      console.log(
        `${" ".repeat(12)}${colors.cyan}└─ ${log.details}${colors.reset}`
      );
    }
  }

  console.log();
}

function drawControls() {
  const controls = [
    "Press [q] to quit",
    "[p] to pause/resume",
    "[r] to refresh now",
    "[c] to clear logs",
    "[h] for help",
  ];

  console.log(
    `${colors.bright}${colors.yellow}CONTROLS: ${controls.join(" • ")}${
      colors.reset
    }`
  );
}

function drawProgress() {
  if (!isMonitoring) return;

  const elapsed = Date.now() - (lastUpdate ? lastUpdate.getTime() : Date.now());
  const progress = Math.min(elapsed / config.refreshInterval, 1);
  const barLength = 40;
  const filled = Math.floor(progress * barLength);

  const bar = "█".repeat(filled) + "░".repeat(barLength - filled);
  const remaining = Math.max(
    0,
    Math.ceil((config.refreshInterval - elapsed) / 1000)
  );

  process.stdout.write(
    `\r${colors.cyan}Next refresh: [${bar}] ${remaining}s${colors.reset}`
  );
}

function renderDashboard() {
  clearScreen();
  drawHeader();
  drawMetrics();
  drawHealthStatus();
  drawActivityLog();
  drawControls();
  console.log();
}

// Main monitoring loop
async function updateData() {
  if (!isMonitoring) return;

  const analyticsSuccess = await loadAnalytics();
  const healthSuccess = await loadHealth();

  if (analyticsSuccess || healthSuccess) {
    lastUpdate = new Date();
  }

  renderDashboard();
}

function startMonitoring() {
  isMonitoring = true;

  // Initial load
  updateData();

  // Set up refresh interval
  const interval = setInterval(() => {
    if (isMonitoring) {
      updateData();
    } else {
      clearInterval(interval);
    }
  }, config.refreshInterval);

  // Progress bar update
  const progressInterval = setInterval(() => {
    if (isMonitoring) {
      drawProgress();
    } else {
      clearInterval(progressInterval);
    }
  }, 100);

  return { interval, progressInterval };
}

// Keyboard input handling
function setupKeyboardInput() {
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  process.stdin.on("data", (key) => {
    switch (key.toLowerCase()) {
      case "q":
      case "\u0003": // Ctrl+C
        console.log(`\n${colors.green}👋 Goodbye!${colors.reset}`);
        process.exit(0);
        break;

      case "p":
        isMonitoring = !isMonitoring;
        if (isMonitoring) {
          addToLog("info", "Monitoring resumed");
          startMonitoring();
        } else {
          addToLog("info", "Monitoring paused");
        }
        renderDashboard();
        break;

      case "r":
        addToLog("info", "Manual refresh triggered");
        updateData();
        break;

      case "c":
        activityLog = [];
        addToLog("info", "Activity log cleared");
        renderDashboard();
        break;

      case "h":
        addToLog("info", "Help requested");
        renderDashboard();
        break;
    }
  });
}

// Error handling
process.on("uncaughtException", (error) => {
  console.error(
    `${colors.red}Uncaught Exception: ${error.message}${colors.reset}`
  );
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(
    `${colors.red}Unhandled Rejection at:`,
    promise,
    "reason:",
    reason,
    `${colors.reset}`
  );
});

// Startup
function main() {
  console.log(
    `${colors.green}🚀 Starting Designetica Analytics Monitor...${colors.reset}`
  );
  console.log(
    `${colors.blue}📡 Connecting to: ${config.apiUrl}${colors.reset}`
  );
  console.log(
    `${colors.yellow}⏱️  Refresh interval: ${config.refreshInterval / 1000}s${
      colors.reset
    }`
  );
  console.log();

  addToLog("info", "Analytics monitor started", `API: ${config.apiUrl}`);

  setupKeyboardInput();
  startMonitoring();
}

// Start the application
if (require.main === module) {
  main();
}

module.exports = {
  loadAnalytics,
  loadHealth,
  renderDashboard,
  formatNumber,
  formatPercentage,
  formatDuration,
};
