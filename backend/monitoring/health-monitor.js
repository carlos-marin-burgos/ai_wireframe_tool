// Comprehensive health monitoring system for Designetica API
const https = require("https");
const fs = require("fs");
const path = require("path");

class HealthMonitor {
  constructor() {
    this.apiEndpoint =
      "https://func-designetica-prod-xabnur6oyusju.azurewebsites.net/api/generate-html-wireframe";
    this.healthEndpoint =
      "https://func-designetica-prod-xabnur6oyusju.azurewebsites.net/api/health";
    this.websiteEndpoint =
      "https://white-flower-006d2370f.1.azurestaticapps.net";
    this.logFile = path.join(__dirname, "health-log.json");
    this.alertsFile = path.join(__dirname, "alerts.json");
    this.lastStatus = null;

    // Ensure log files exist
    this.initializeLogFiles();
  }

  initializeLogFiles() {
    if (!fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(this.alertsFile)) {
      fs.writeFileSync(this.alertsFile, JSON.stringify([], null, 2));
    }
  }

  async checkHealth() {
    const timestamp = new Date().toISOString();
    const results = {
      timestamp,
      checks: {},
    };

    console.log(`🔍 Starting health check at ${timestamp}`);

    try {
      // Check 1: Basic health endpoint
      results.checks.healthEndpoint = await this.checkEndpoint(
        this.healthEndpoint,
        "GET"
      );

      // Check 2: Main API functionality
      results.checks.apiEndpoint = await this.checkApiEndpoint();

      // Check 3: Website accessibility
      results.checks.website = await this.checkEndpoint(
        this.websiteEndpoint,
        "GET"
      );

      // Check 4: DNS resolution
      results.checks.dns = await this.checkDnsResolution();

      // Check 5: SSL certificate
      results.checks.ssl = await this.checkSslCertificate();

      // Determine overall status
      results.overall = this.determineOverallStatus(results.checks);

      // Log results
      this.logResults(results);

      // Check for alerts
      await this.checkForAlerts(results);

      console.log(
        `✅ Health check completed. Status: ${results.overall.status}`
      );
      return results;
    } catch (error) {
      console.error("❌ Health check failed:", error);
      results.overall = { status: "ERROR", error: error.message };
      this.logResults(results);
      await this.triggerAlert("HEALTH_CHECK_FAILED", error.message);
      return results;
    }
  }

  async checkEndpoint(url, method = "GET", data = null) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const urlObj = new URL(url);

      const options = {
        hostname: urlObj.hostname,
        port: 443,
        path: urlObj.pathname + urlObj.search,
        method: method,
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "DesigneticaHealthMonitor/1.0",
        },
        timeout: 10000,
      };

      if (data) {
        options.headers["Content-Length"] = Buffer.byteLength(data);
      }

      const req = https.request(options, (res) => {
        let responseData = "";

        res.on("data", (chunk) => {
          responseData += chunk;
        });

        res.on("end", () => {
          const responseTime = Date.now() - startTime;
          resolve({
            status: res.statusCode < 400 ? "HEALTHY" : "UNHEALTHY",
            statusCode: res.statusCode,
            responseTime,
            error: res.statusCode >= 400 ? `HTTP ${res.statusCode}` : null,
            responseSize: responseData.length,
          });
        });
      });

      req.on("error", (error) => {
        const responseTime = Date.now() - startTime;
        resolve({
          status: "UNHEALTHY",
          statusCode: null,
          responseTime,
          error: error.message,
          responseSize: 0,
        });
      });

      req.on("timeout", () => {
        req.destroy();
        const responseTime = Date.now() - startTime;
        resolve({
          status: "UNHEALTHY",
          statusCode: null,
          responseTime,
          error: "Request timeout",
          responseSize: 0,
        });
      });

      if (data) {
        req.write(data);
      }

      req.end();
    });
  }

  async checkApiEndpoint() {
    const testPayload = JSON.stringify({
      context: "health check test",
      requirements: "simple layout",
      additionalContext: "automated monitoring",
    });

    const result = await this.checkEndpoint(
      this.apiEndpoint,
      "POST",
      testPayload
    );

    // Additional validation for API response
    if (result.status === "HEALTHY" && result.responseSize > 0) {
      result.apiValidation = "PASSED";
    } else {
      result.apiValidation = "FAILED";
      result.status = "UNHEALTHY";
    }

    return result;
  }

  async checkDnsResolution() {
    return new Promise((resolve) => {
      const dns = require("dns");
      const startTime = Date.now();

      dns.lookup(
        "white-flower-006d2370f.1.azurestaticapps.net",
        (err, address) => {
          const responseTime = Date.now() - startTime;

          if (err) {
            resolve({
              status: "UNHEALTHY",
              error: err.message,
              responseTime,
            });
          } else {
            resolve({
              status: "HEALTHY",
              address,
              responseTime,
            });
          }
        }
      );
    });
  }

  async checkSslCertificate() {
    return new Promise((resolve) => {
      const tls = require("tls");
      const startTime = Date.now();

      const socket = tls.connect(
        443,
        "white-flower-006d2370f.1.azurestaticapps.net",
        () => {
          const cert = socket.getPeerCertificate();
          const responseTime = Date.now() - startTime;

          const now = new Date();
          const validFrom = new Date(cert.valid_from);
          const validTo = new Date(cert.valid_to);

          const daysUntilExpiry = Math.floor(
            (validTo - now) / (1000 * 60 * 60 * 24)
          );

          socket.end();

          resolve({
            status:
              now >= validFrom && now <= validTo ? "HEALTHY" : "UNHEALTHY",
            validFrom: cert.valid_from,
            validTo: cert.valid_to,
            daysUntilExpiry,
            issuer: cert.issuer.CN,
            responseTime,
            warning:
              daysUntilExpiry < 30
                ? `Certificate expires in ${daysUntilExpiry} days`
                : null,
          });
        }
      );

      socket.on("error", (error) => {
        const responseTime = Date.now() - startTime;
        resolve({
          status: "UNHEALTHY",
          error: error.message,
          responseTime,
        });
      });

      socket.setTimeout(10000, () => {
        socket.destroy();
        const responseTime = Date.now() - startTime;
        resolve({
          status: "UNHEALTHY",
          error: "SSL check timeout",
          responseTime,
        });
      });
    });
  }

  determineOverallStatus(checks) {
    const critical = ["apiEndpoint", "website"];
    const warnings = [];

    // Check critical services
    for (const check of critical) {
      if (checks[check]?.status !== "HEALTHY") {
        return {
          status: "CRITICAL",
          message: `Critical service ${check} is unhealthy`,
          details: checks[check],
        };
      }
    }

    // Check for warnings
    Object.keys(checks).forEach((check) => {
      if (checks[check]?.status === "UNHEALTHY") {
        warnings.push(check);
      }
      if (checks[check]?.warning) {
        warnings.push(`${check}: ${checks[check].warning}`);
      }
    });

    if (warnings.length > 0) {
      return {
        status: "WARNING",
        message: `Some services have issues: ${warnings.join(", ")}`,
        warnings,
      };
    }

    return {
      status: "HEALTHY",
      message: "All services are operating normally",
    };
  }

  logResults(results) {
    try {
      const logs = JSON.parse(fs.readFileSync(this.logFile, "utf8"));
      logs.push(results);

      // Keep only last 100 entries
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }

      fs.writeFileSync(this.logFile, JSON.stringify(logs, null, 2));
    } catch (error) {
      console.error("Failed to log results:", error);
    }
  }

  async checkForAlerts(results) {
    const currentStatus = results.overall.status;

    // Alert on status change
    if (this.lastStatus && this.lastStatus !== currentStatus) {
      await this.triggerAlert(
        "STATUS_CHANGE",
        `Status changed from ${this.lastStatus} to ${currentStatus}`
      );
    }

    // Alert on critical issues
    if (currentStatus === "CRITICAL") {
      await this.triggerAlert("CRITICAL_ISSUE", results.overall.message);
    }

    // Alert on SSL certificate expiry
    if (results.checks.ssl?.daysUntilExpiry < 30) {
      await this.triggerAlert(
        "SSL_EXPIRY_WARNING",
        `SSL certificate expires in ${results.checks.ssl.daysUntilExpiry} days`
      );
    }

    this.lastStatus = currentStatus;
  }

  async triggerAlert(type, message) {
    const alert = {
      timestamp: new Date().toISOString(),
      type,
      message,
      resolved: false,
    };

    console.log(`🚨 ALERT [${type}]: ${message}`);

    try {
      const alerts = JSON.parse(fs.readFileSync(this.alertsFile, "utf8"));
      alerts.push(alert);

      // Keep only last 50 alerts
      if (alerts.length > 50) {
        alerts.splice(0, alerts.length - 50);
      }

      fs.writeFileSync(this.alertsFile, JSON.stringify(alerts, null, 2));
    } catch (error) {
      console.error("Failed to log alert:", error);
    }
  }

  async getHealthSummary() {
    try {
      const logs = JSON.parse(fs.readFileSync(this.logFile, "utf8"));
      const alerts = JSON.parse(fs.readFileSync(this.alertsFile, "utf8"));

      const recentLogs = logs.slice(-10);
      const unresolvedAlerts = alerts.filter((alert) => !alert.resolved);

      return {
        lastCheck: recentLogs[recentLogs.length - 1],
        recentHistory: recentLogs,
        unresolvedAlerts,
        totalChecks: logs.length,
        totalAlerts: alerts.length,
      };
    } catch (error) {
      return {
        error: "Failed to load health summary",
        details: error.message,
      };
    }
  }

  // Continuous monitoring
  startMonitoring(intervalMinutes = 5) {
    console.log(
      `🚀 Starting continuous health monitoring (every ${intervalMinutes} minutes)`
    );

    // Initial check
    this.checkHealth();

    // Set up interval
    setInterval(() => {
      this.checkHealth();
    }, intervalMinutes * 60 * 1000);
  }
}

module.exports = HealthMonitor;

// If run directly, start monitoring
if (require.main === module) {
  const monitor = new HealthMonitor();

  // Check command line arguments
  const args = process.argv.slice(2);
  if (args.includes("--once")) {
    monitor.checkHealth().then((results) => {
      console.log("\n📊 Health Check Results:");
      console.log(JSON.stringify(results, null, 2));
      process.exit(0);
    });
  } else if (args.includes("--summary")) {
    monitor.getHealthSummary().then((summary) => {
      console.log("\n📊 Health Summary:");
      console.log(JSON.stringify(summary, null, 2));
      process.exit(0);
    });
  } else {
    const interval =
      parseInt(
        args.find((arg) => arg.startsWith("--interval="))?.split("=")[1]
      ) || 5;
    monitor.startMonitoring(interval);
  }
}
