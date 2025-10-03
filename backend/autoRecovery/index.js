const { exec } = require("child_process");
const path = require("path");

/**
 * Auto Recovery Trigger Function
 *
 * This function allows the frontend to automatically trigger recovery scripts
 * when system failures are detected.
 */
module.exports = async function (context, req) {
  context.log("🔧 Auto-recovery request received");

  try {
    const { action, scenario } = req.body || {};

    // Validate request
    if (!action) {
      context.res = {
        status: 400,
        body: {
          success: false,
          error: "missing_action",
          message: "Action parameter is required",
        },
      };
      return;
    }

    // Get the project root directory (parent of backend)
    const backendDir = process.cwd();
    const projectRoot = path.dirname(backendDir);
    const autoRecoveryScript = path.join(projectRoot, "auto-recovery.sh");
    const smartDevScript = path.join(projectRoot, "smart-dev-start.sh");

    context.log(`📁 Project root: ${projectRoot}`);
    context.log(`🔧 Auto-recovery script: ${autoRecoveryScript}`);

    // Check if we're in development mode
    const isDevelopment =
      process.env.NODE_ENV === "development" ||
      process.env.AZURE_FUNCTIONS_ENVIRONMENT === "Development";

    if (!isDevelopment) {
      context.res = {
        status: 400,
        body: {
          success: false,
          error: "recovery_not_allowed_in_production",
          message: "Auto-recovery is only allowed in development mode",
        },
      };
      return;
    }

    // Map action to script commands
    const actionMap = {
      "fix-backend": "./auto-recovery.sh fix-backend",
      "fix-ai": "./auto-recovery.sh fix-ai",
      "fix-ports": "./auto-recovery.sh fix-ports",
      "fix-memory": "./auto-recovery.sh fix-memory",
      "fix-dependencies": "./auto-recovery.sh fix-dependencies",
      "start-monitor": "./auto-recovery.sh start-monitor",
      "smart-start": "./smart-dev-start.sh",
      auto: "./auto-recovery.sh auto",
      diagnose: "./auto-recovery.sh diagnose",
    };

    const command = actionMap[action];
    if (!command) {
      context.res = {
        status: 400,
        body: {
          success: false,
          error: "invalid_action",
          message: `Invalid action: ${action}. Valid actions: ${Object.keys(
            actionMap
          ).join(", ")}`,
        },
      };
      return;
    }

    context.log(`🚀 Executing auto-recovery: ${action}`);
    context.log(`📜 Command: ${command}`);

    // Execute the recovery command asynchronously
    return new Promise((resolve) => {
      const fullCommand = `cd "${projectRoot}" && chmod +x auto-recovery.sh smart-dev-start.sh && ${command}`;

      exec(
        fullCommand,
        {
          timeout: 60000, // 60 seconds timeout
          cwd: projectRoot,
        },
        (error, stdout, stderr) => {
          if (error) {
            context.log(`❌ Auto-recovery failed:`, error);
            context.res = {
              status: 500,
              body: {
                success: false,
                error: "recovery_failed",
                message: `Recovery action '${action}' failed: ${error.message}`,
                details: {
                  stdout: stdout,
                  stderr: stderr,
                  scenario: scenario || "unknown",
                },
              },
            };
          } else {
            context.log(`✅ Auto-recovery completed: ${action}`);
            context.log(`📤 stdout:`, stdout);
            if (stderr) context.log(`📤 stderr:`, stderr);

            context.res = {
              status: 200,
              body: {
                success: true,
                message: `Auto-recovery action '${action}' completed successfully`,
                action: action,
                scenario: scenario || "unknown",
                output: stdout,
                timestamp: new Date().toISOString(),
              },
            };
          }
          resolve();
        }
      );
    });
  } catch (error) {
    context.log(`💥 Auto-recovery function error:`, error);

    context.res = {
      status: 500,
      body: {
        success: false,
        error: "internal_error",
        message: "Failed to execute auto-recovery",
        details: error.message,
      },
    };
  }
};
