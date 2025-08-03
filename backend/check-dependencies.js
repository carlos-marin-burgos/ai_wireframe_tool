#!/usr/bin/env node

/**
 * Dependency integrity checker for the backend
 * This script verifies that critical dependencies haven't been corrupted
 */

const fs = require("fs");
const path = require("path");

const criticalFiles = [
  "node_modules/debug/src/index.js",
  "node_modules/debug/src/node.js",
  "node_modules/express/index.js",
  "node_modules/cors/lib/index.js",
];

const expectedPatterns = [
  {
    file: "node_modules/debug/src/index.js",
    shouldContain: ["module.exports", "process.type"],
    shouldNotContain: ["import React", "export default", "const Index = ()"],
  },
  {
    file: "node_modules/debug/src/node.js",
    shouldContain: ["exports.init", "exports.log", "tty.isatty"],
    shouldNotContain: ["import React", "export default", "const Index = ()"],
  },
];

function checkFile(filePath, patterns) {
  try {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File missing: ${filePath}`);
      return false;
    }

    const content = fs.readFileSync(fullPath, "utf8");

    // Check required patterns
    for (const required of patterns.shouldContain) {
      if (!content.includes(required)) {
        console.error(`❌ ${filePath} missing required pattern: ${required}`);
        return false;
      }
    }

    // Check forbidden patterns
    for (const forbidden of patterns.shouldNotContain) {
      if (content.includes(forbidden)) {
        console.error(
          `❌ ${filePath} contains forbidden pattern: ${forbidden}`
        );
        return false;
      }
    }

    console.log(`✅ ${filePath} integrity check passed`);
    return true;
  } catch (error) {
    console.error(`❌ Error checking ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log("🔍 Checking backend dependency integrity...\n");

  let allChecksPass = true;

  // Check if node_modules exists
  if (!fs.existsSync(path.join(__dirname, "node_modules"))) {
    console.error(
      '❌ node_modules directory not found. Run "npm install" first.'
    );
    process.exit(1);
  }

  // Check critical files exist
  for (const file of criticalFiles) {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Critical file missing: ${file}`);
      allChecksPass = false;
    }
  }

  // Check patterns in specific files
  for (const check of expectedPatterns) {
    if (!checkFile(check.file, check)) {
      allChecksPass = false;
    }
  }

  if (allChecksPass) {
    console.log("\n✅ All dependency integrity checks passed!");
    process.exit(0);
  } else {
    console.log(
      '\n❌ Some integrity checks failed. Consider running "npm run fresh-install"'
    );
    process.exit(1);
  }
}

main();
