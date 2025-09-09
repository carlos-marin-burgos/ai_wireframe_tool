#!/usr/bin/env node

/**
 * Azure OpenAI Service Monitor
 *
 * This script monitors the Azure OpenAI service health and can:
 * 1. Check if the Azure OpenAI endpoint is reachable
 * 2. Validate API key and deployment configuration
 * 3. Send alerts when service is down
 * 4. Provide recovery suggestions
 * 5. Optionally attempt automatic recovery actions
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config();

const CONFIG = {
  // Azure OpenAI Configuration
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_KEY,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT,

  // Monitoring Configuration
  checkInterval: 60 * 1000, // Check every 60 seconds
  retryAttempts: 3,
  timeout: 10000, // 10 second timeout

  // Notification Configuration
  logFile: path.join(__dirname, "azure-openai-monitor.log"),
  alertsEnabled: true,

  // Recovery Configuration
  autoRecovery: false, // Set to true to enable automatic recovery attempts
};

class AzureOpenAIMonitor {
  constructor() {
    this.isServiceHealthy = false;
    this.lastSuccessfulCheck = null;
    this.consecutiveFailures = 0;
    this.isRunning = false;
  }

  /**
   * Start monitoring the Azure OpenAI service
   */
  start() {
    if (this.isRunning) {
      console.log("🟡 Monitor is already running");
      return;
    }

    console.log("🚀 Starting Azure OpenAI Service Monitor...");
    console.log(`📊 Check interval: ${CONFIG.checkInterval / 1000}s`);
    console.log(`🎯 Endpoint: ${CONFIG.endpoint}`);
    console.log(`📝 Deployment: ${CONFIG.deployment}`);
    console.log(`📄 Log file: ${CONFIG.logFile}`);

    this.isRunning = true;
    this.runHealthCheck();

    // Schedule regular health checks
    this.checkInterval = setInterval(() => {
      this.runHealthCheck();
    }, CONFIG.checkInterval);

    // Graceful shutdown
    process.on("SIGINT", () => this.stop());
    process.on("SIGTERM", () => this.stop());
  }

  /**
   * Stop monitoring
   */
  stop() {
    console.log("🛑 Stopping Azure OpenAI Service Monitor...");
    this.isRunning = false;

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.log("Monitor stopped");
    process.exit(0);
  }

  /**
   * Run a comprehensive health check
   */
  async runHealthCheck() {
    const timestamp = new Date().toISOString();

    try {
      console.log(`🔍 [${timestamp}] Running health check...`);

      // Step 1: Check configuration
      const configCheck = this.validateConfiguration();
      if (!configCheck.valid) {
        throw new Error(
          `Configuration invalid: ${configCheck.errors.join(", ")}`
        );
      }

      // Step 2: Check DNS resolution
      const dnsCheck = await this.checkDNSResolution();
      if (!dnsCheck.success) {
        throw new Error(`DNS resolution failed: ${dnsCheck.error}`);
      }

      // Step 3: Check HTTP connectivity
      const httpCheck = await this.checkHTTPConnectivity();
      if (!httpCheck.success) {
        throw new Error(`HTTP connectivity failed: ${httpCheck.error}`);
      }

      // Step 4: Check API authentication
      const authCheck = await this.checkAPIAuthentication();
      if (!authCheck.success) {
        throw new Error(`API authentication failed: ${authCheck.error}`);
      }

      // All checks passed
      this.onServiceHealthy();
    } catch (error) {
      this.onServiceUnhealthy(error);
    }
  }

  /**
   * Validate Azure OpenAI configuration
   */
  validateConfiguration() {
    const errors = [];

    if (!CONFIG.endpoint) {
      errors.push("AZURE_OPENAI_ENDPOINT is not set");
    } else if (!CONFIG.endpoint.includes("openai.azure.com")) {
      errors.push(
        "AZURE_OPENAI_ENDPOINT does not appear to be a valid Azure OpenAI endpoint"
      );
    }

    if (!CONFIG.apiKey) {
      errors.push("AZURE_OPENAI_KEY is not set");
    } else if (CONFIG.apiKey.length < 20) {
      errors.push("AZURE_OPENAI_KEY appears to be invalid (too short)");
    }

    if (!CONFIG.deployment) {
      errors.push("AZURE_OPENAI_DEPLOYMENT is not set");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check DNS resolution for the Azure OpenAI endpoint
   */
  async checkDNSResolution() {
    return new Promise((resolve) => {
      const dns = require("dns");
      const hostname = new URL(CONFIG.endpoint).hostname;

      dns.lookup(hostname, (err, address) => {
        if (err) {
          resolve({
            success: false,
            error: `Cannot resolve ${hostname}: ${err.message}`,
          });
        } else {
          resolve({
            success: true,
            address,
          });
        }
      });
    });
  }

  /**
   * Check HTTP connectivity to Azure OpenAI endpoint
   */
  async checkHTTPConnectivity() {
    return new Promise((resolve) => {
      const url = new URL(CONFIG.endpoint);

      const options = {
        hostname: url.hostname,
        port: 443,
        path: "/",
        method: "GET",
        timeout: CONFIG.timeout,
        headers: {
          "User-Agent": "Azure-OpenAI-Monitor/1.0",
        },
      };

      const req = https.request(options, (res) => {
        resolve({
          success: res.statusCode < 500, // Accept any non-server error status
          statusCode: res.statusCode,
        });
      });

      req.on("error", (err) => {
        resolve({
          success: false,
          error: err.message,
        });
      });

      req.on("timeout", () => {
        req.destroy();
        resolve({
          success: false,
          error: "Request timeout",
        });
      });

      req.end();
    });
  }

  /**
   * Check API authentication by making a simple API call
   */
  async checkAPIAuthentication() {
    return new Promise((resolve) => {
      const url = new URL(
        `${CONFIG.endpoint}openai/deployments/${CONFIG.deployment}/chat/completions?api-version=2024-02-01`
      );

      const postData = JSON.stringify({
        messages: [{ role: "user", content: "test" }],
        max_tokens: 1,
      });

      const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname + url.search,
        method: "POST",
        timeout: CONFIG.timeout,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
          "api-key": CONFIG.apiKey,
          "User-Agent": "Azure-OpenAI-Monitor/1.0",
        },
      };

      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          // Accept 2xx responses or 429 (rate limited) as valid authentication
          const success = res.statusCode < 300 || res.statusCode === 429;

          resolve({
            success,
            statusCode: res.statusCode,
            response: data.length > 0 ? JSON.parse(data) : null,
          });
        });
      });

      req.on("error", (err) => {
        resolve({
          success: false,
          error: err.message,
        });
      });

      req.on("timeout", () => {
        req.destroy();
        resolve({
          success: false,
          error: "API request timeout",
        });
      });

      req.write(postData);
      req.end();
    });
  }

  /**
   * Handle service healthy state
   */
  onServiceHealthy() {
    const wasUnhealthy = !this.isServiceHealthy;

    this.isServiceHealthy = true;
    this.lastSuccessfulCheck = new Date();
    this.consecutiveFailures = 0;

    if (wasUnhealthy) {
      console.log("✅ Azure OpenAI service is now HEALTHY");
      this.log("Service recovered - all health checks passed");

      if (CONFIG.alertsEnabled) {
        this.sendAlert(
          "SERVICE_RECOVERED",
          "Azure OpenAI service has recovered and is now operational"
        );
      }
    } else {
      console.log("✅ Azure OpenAI service is HEALTHY");
    }
  }

  /**
   * Handle service unhealthy state
   */
  async onServiceUnhealthy(error) {
    this.isServiceHealthy = false;
    this.consecutiveFailures++;

    const errorMessage = error.message || "Unknown error";
    console.log(`❌ Azure OpenAI service is UNHEALTHY: ${errorMessage}`);
    this.log(
      `Health check failed (attempt ${this.consecutiveFailures}): ${errorMessage}`
    );

    // Send alert for the first failure or every 5th consecutive failure
    if (
      CONFIG.alertsEnabled &&
      (this.consecutiveFailures === 1 || this.consecutiveFailures % 5 === 0)
    ) {
      this.sendAlert(
        "SERVICE_DOWN",
        `Azure OpenAI service is down (${this.consecutiveFailures} consecutive failures): ${errorMessage}`
      );
    }

    // Attempt recovery if enabled
    if (CONFIG.autoRecovery && this.consecutiveFailures >= 3) {
      await this.attemptRecovery();
    }
  }

  /**
   * Attempt automatic recovery
   */
  async attemptRecovery() {
    console.log("🔧 Attempting automatic recovery...");
    this.log("Attempting automatic recovery");

    // Add recovery logic here:
    // 1. Check if it's a temporary DNS issue
    // 2. Try alternative DNS servers
    // 3. Check Azure service status
    // 4. Restart local services if needed

    console.log(
      "⚠️ Automatic recovery not yet implemented - manual intervention required"
    );
  }

  /**
   * Send alert notification
   */
  sendAlert(type, message) {
    const timestamp = new Date().toISOString();
    const alert = `[${timestamp}] ALERT: ${type} - ${message}`;

    console.log(`🚨 ${alert}`);
    this.log(alert);

    // TODO: Add email, Slack, or other notification integrations here
  }

  /**
   * Log message to file
   */
  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;

    try {
      fs.appendFileSync(CONFIG.logFile, logEntry);
    } catch (error) {
      console.error("Failed to write to log file:", error.message);
    }
  }

  /**
   * Get current service status
   */
  getStatus() {
    return {
      isHealthy: this.isServiceHealthy,
      lastSuccessfulCheck: this.lastSuccessfulCheck,
      consecutiveFailures: this.consecutiveFailures,
      uptime: this.isRunning ? process.uptime() : 0,
    };
  }
}

// CLI Interface
if (require.main === module) {
  const monitor = new AzureOpenAIMonitor();

  const command = process.argv[2];

  switch (command) {
    case "start":
      monitor.start();
      break;

    case "check":
      console.log("🔍 Running one-time health check...");
      monitor.runHealthCheck().then(() => {
        setTimeout(() => process.exit(0), 1000);
      });
      break;

    case "status":
      monitor.runHealthCheck().then(() => {
        const status = monitor.getStatus();
        console.log("📊 Current Status:", status);
        process.exit(0);
      });
      break;

    default:
      console.log(`
🔧 Azure OpenAI Service Monitor

Usage:
  node azure-openai-monitor.js start   - Start continuous monitoring
  node azure-openai-monitor.js check   - Run one-time health check  
  node azure-openai-monitor.js status  - Get current service status

Configuration:
  Edit CONFIG object in this file or use environment variables:
  - AZURE_OPENAI_ENDPOINT
  - AZURE_OPENAI_KEY  
  - AZURE_OPENAI_DEPLOYMENT
      `);
      process.exit(1);
  }
}

module.exports = AzureOpenAIMonitor;
