#!/usr/bin/env node

// Route Validation Script
// Ensures consistent routing between frontend and backend

console.log("🛣️ Route Validation Script");
console.log("==========================");

const fs = require("fs");
const path = require("path");

// Function to extract routes from Azure Functions
function getAzureFunctionRoutes() {
  const backendDir = path.join(__dirname, "backend");
  const routes = {};

  try {
    const functionDirs = fs.readdirSync(backendDir).filter((dir) => {
      const fullPath = path.join(backendDir, dir);
      return (
        fs.statSync(fullPath).isDirectory() &&
        fs.existsSync(path.join(fullPath, "function.json"))
      );
    });

    functionDirs.forEach((funcDir) => {
      try {
        const functionJsonPath = path.join(
          backendDir,
          funcDir,
          "function.json"
        );
        const fileContent = fs.readFileSync(functionJsonPath, "utf8").trim();

        // Skip empty files
        if (!fileContent) {
          console.log(`⚠️ Skipping empty function.json in ${funcDir}`);
          return;
        }

        const functionConfig = JSON.parse(fileContent);

        const httpBinding = functionConfig.bindings?.find(
          (b) => b.type === "httpTrigger"
        );
        if (httpBinding && httpBinding.route) {
          routes[funcDir] = {
            route: httpBinding.route,
            methods: httpBinding.methods || ["GET", "POST"],
            fullUrl: `/api/${httpBinding.route}`,
          };
        }
      } catch (error) {
        console.error(
          `❌ Error reading function.json in ${funcDir}:`,
          error.message
        );
      }
    });
  } catch (error) {
    console.error("❌ Error reading Azure Functions:", error.message);
  }

  return routes;
}

// Function to extract routes from frontend config
function getFrontendRoutes() {
  const configPath = path.join(__dirname, "src", "config", "api.ts");
  const routes = {};

  try {
    const configContent = fs.readFileSync(configPath, "utf8");

    // Extract ENDPOINTS object
    const endpointsMatch = configContent.match(/ENDPOINTS:\s*{([^}]+)}/s);
    if (endpointsMatch) {
      const endpointsContent = endpointsMatch[1];

      // Extract each endpoint
      const endpointMatches = endpointsContent.matchAll(/(\w+):\s*"([^"]+)"/g);
      for (const match of endpointMatches) {
        routes[match[1]] = match[2];
      }
    }
  } catch (error) {
    console.error("❌ Error reading frontend config:", error.message);
  }

  return routes;
}

function validateRoutes() {
  console.log("🔍 Scanning Azure Functions...");
  const backendRoutes = getAzureFunctionRoutes();

  console.log("🔍 Scanning Frontend Config...");
  const frontendRoutes = getFrontendRoutes();

  console.log("\n📋 Backend Routes (Azure Functions):");
  Object.entries(backendRoutes).forEach(([name, config]) => {
    console.log(
      `  ✅ ${name}: ${config.fullUrl} [${config.methods.join(", ")}]`
    );
  });

  console.log("\n📋 Frontend Routes (Config):");
  Object.entries(frontendRoutes).forEach(([name, url]) => {
    console.log(`  ✅ ${name}: ${url}`);
  });

  console.log("\n🔍 Route Consistency Check:");

  // Check if frontend routes match backend routes
  const issues = [];

  // Common mappings
  const routeMappings = {
    GENERATE_WIREFRAME: "generateWireframe",
    GENERATE_SUGGESTIONS: "generateSuggestions",
    GET_TEMPLATE: "get-template",
    HEALTH: "health",
  };

  Object.entries(routeMappings).forEach(([frontendKey, backendKey]) => {
    const frontendRoute = frontendRoutes[frontendKey];
    const backendConfig = backendRoutes[backendKey];

    if (!frontendRoute) {
      issues.push(`❌ Missing frontend route for ${frontendKey}`);
      return;
    }

    if (!backendConfig) {
      issues.push(`❌ Missing backend function for ${backendKey}`);
      return;
    }

    const expectedBackendUrl = `/api/${backendConfig.route}`;

    if (frontendRoute === expectedBackendUrl) {
      console.log(`  ✅ ${frontendKey} -> ${expectedBackendUrl} ✓`);
    } else {
      issues.push(
        `❌ Route mismatch: ${frontendKey} expects ${frontendRoute} but backend has ${expectedBackendUrl}`
      );
    }
  });

  if (issues.length === 0) {
    console.log("\n🎉 All routes are consistent!");
  } else {
    console.log("\n⚠️ Issues found:");
    issues.forEach((issue) => console.log(`  ${issue}`));
  }

  console.log("\n📝 Route Guidelines:");
  console.log("  - Backend Azure Functions use kebab-case: generate-wireframe");
  console.log("  - Frontend config should match backend exactly");
  console.log("  - Always use /api/ prefix for Azure Functions");
  console.log(
    '  - Parameter names: "description" for wireframes, "query" for suggestions'
  );

  return issues.length === 0;
}

// Run if called directly
if (require.main === module) {
  const isValid = validateRoutes();
  process.exit(isValid ? 0 : 1);
}

module.exports = { validateRoutes, getAzureFunctionRoutes, getFrontendRoutes };
