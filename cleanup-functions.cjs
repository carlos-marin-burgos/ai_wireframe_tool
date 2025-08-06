#!/usr/bin/env node

// Cleanup Empty Function JSON Files
// Removes or fixes empty function.json files that cause validation errors

console.log("🧹 Azure Functions Cleanup Script");
console.log("=================================");

const fs = require("fs");
const path = require("path");

function cleanupEmptyFunctionFiles() {
  const backendDir = path.join(__dirname, "backend");

  try {
    const functionDirs = fs.readdirSync(backendDir).filter((dir) => {
      const fullPath = path.join(backendDir, dir);
      return (
        fs.statSync(fullPath).isDirectory() &&
        fs.existsSync(path.join(fullPath, "function.json"))
      );
    });

    const emptyFiles = [];
    const validFiles = [];

    functionDirs.forEach((funcDir) => {
      const functionJsonPath = path.join(backendDir, funcDir, "function.json");
      const fileContent = fs.readFileSync(functionJsonPath, "utf8").trim();

      if (!fileContent) {
        emptyFiles.push({ dir: funcDir, path: functionJsonPath });
      } else {
        try {
          JSON.parse(fileContent);
          validFiles.push(funcDir);
        } catch (error) {
          console.error(`❌ Invalid JSON in ${funcDir}: ${error.message}`);
        }
      }
    });

    console.log(`📊 Found ${validFiles.length} valid function.json files`);
    console.log(`📊 Found ${emptyFiles.length} empty function.json files`);

    if (emptyFiles.length > 0) {
      console.log("\n🗑️ Empty function.json files found:");
      emptyFiles.forEach((file) => {
        console.log(`  - ${file.dir}/function.json`);
      });

      console.log("\n🤔 Options:");
      console.log("  1. Delete empty files (recommended)");
      console.log("  2. Create minimal function.json templates");
      console.log("  3. Leave as-is");

      // For now, we'll just report and let user decide
      console.log(
        "\n💡 Recommendation: Delete these empty files as they are likely test artifacts"
      );
      console.log("💡 Run: rm backend/*/function.json (where files are empty)");

      return emptyFiles;
    } else {
      console.log("\n✅ No empty function.json files found!");
      return [];
    }
  } catch (error) {
    console.error("❌ Error during cleanup:", error.message);
    return [];
  }
}

function deleteEmptyFiles() {
  const emptyFiles = cleanupEmptyFunctionFiles();

  if (emptyFiles.length > 0) {
    console.log("\n🗑️ Deleting empty function.json files...");

    emptyFiles.forEach((file) => {
      try {
        fs.unlinkSync(file.path);
        console.log(`  ✅ Deleted: ${file.dir}/function.json`);
      } catch (error) {
        console.error(
          `  ❌ Failed to delete ${file.dir}/function.json: ${error.message}`
        );
      }
    });

    console.log("\n🎉 Cleanup completed!");
  }
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--delete")) {
    deleteEmptyFiles();
  } else {
    cleanupEmptyFunctionFiles();
    console.log(
      "\n💡 To delete empty files, run: node cleanup-functions.cjs --delete"
    );
  }
}

module.exports = { cleanupEmptyFunctionFiles, deleteEmptyFiles };
