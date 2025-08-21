#!/usr/bin/env node

/**
 * Smart Cleanup Analysis for Designetica Project
 * Analyzes the project structure and identifies safe files to remove
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 DESIGNETICA PROJECT CLEANUP ANALYSIS");
console.log("=====================================\n");

const projectRoot = __dirname;
const results = {
  testFiles: [],
  duplicates: [],
  backups: [],
  unusedAssets: [],
  debugFiles: [],
  tempFiles: [],
  demoFiles: [],
  obsoleteFiles: [],
  totalSize: 0,
  safeToDelete: [],
};

// Patterns for different file categories
const patterns = {
  test: /^(test|spec|debug|api-test|demo|sample)-.*\.(html|js|ts|css|cjs)$/i,
  backup: /\.(backup|bak|old)(\.|$)/i,
  duplicate: /-copy\d*\.|duplicate|_copy|\.copy\./i,
  temp: /^(temp|tmp|\.tmp)/i,
  debug: /^(debug|console|log)-.*\.(js|html|css|cjs)$/i,
  demo: /^(demo|example|sample|prototype)-.*\.(html|js|css)$/i,
  analysis: /^(analyze|check|monitor|validate)-.*\.(cjs|js)$/i,
  obsolete: /^(old|legacy|deprecated|unused)-/i,
};

// Known safe-to-delete files (based on comprehensive-cleanup.sh)
const knownSafeFiles = [
  // Test and demo files
  "test-atlas-breadcrumb.html",
  "test-atlas-cards.html",
  "test-deploy.html",
  "test-fluent-ui-buttons.html",
  "test-windows-logo.html",
  "test-wireframe.html",
  "demo-refined-product.html",
  "enhanced-api-test.html",
  "api-test.html",
  "debug-test.html",
  "drag-test.html",
  "drag-drop-test.html",
  "enhanced-drag-drop-demo.html",
  "enhanced-snap-test.html",
  "enhanced-wireframe-demo.html",
  "ai-powered-demo.html",
  "chat-preview.html",
  "context-aware-success.html",
  "debug-frontend-api.html",
  "debug-react-error.html",
  "dual-resource-test.html",
  "edit-mode-test-guide.html",
  "go-live-test.html",
  "atlas-final-test.html",
  "atlas-hero-test-output.html",
  "all-atlas-components-test-output.html",
  "option-b-test.html",
  "option-b-color-test.html",

  // Debug and analysis files
  "debug-atlas-components.cjs",
  "debug-openai.cjs",
  "debug-openai.js",
  "analyze-components.cjs",
  "analyze-components.js",
  "check-footer.cjs",
  "cleanup-functions.cjs",
  "background-fetch-learning-path.cjs",

  // Backup and archive files
  "backend-deploy.zip",
  "deployment.zip",
  "emergency-deploy.tar.gz",

  // Logs and monitoring
  "backend-startup.log",
  "deployment.log",

  // Duplicate cleanup scripts (many are empty)
  "auto-delete-duplicates.sh",
  "delete-duplicates.sh",
  "delete-remaining-duplicates.sh",
  "cleanup-duplicates.sh",
  "conservative-cleanup.sh",
  "analyze-project-cleanup.cjs",
];

// Core project files that should never be deleted
const protectedFiles = [
  "package.json",
  "package-lock.json",
  "vite.config.ts",
  "tsconfig.json",
  "index.html",
  ".env",
  "azure.yaml",
  "staticwebapp.config.json",
  "README.md",
  "CNAME",
];

const protectedDirs = [
  "src",
  "backend",
  "node_modules",
  ".git",
  "public",
  ".azure",
  "designetica-services",
];

function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function analyzeFile(filePath, fileName) {
  const fullPath = path.join(projectRoot, filePath);
  const size = getFileSize(fullPath);
  results.totalSize += size;

  const fileInfo = {
    path: filePath,
    name: fileName,
    size: formatBytes(size),
    sizeBytes: size,
  };

  // Check against known safe files
  if (knownSafeFiles.includes(fileName)) {
    results.safeToDelete.push({ ...fileInfo, reason: "Known safe file" });
    return;
  }

  // Check patterns
  if (patterns.test.test(fileName)) {
    results.testFiles.push({ ...fileInfo, reason: "Test file" });
    results.safeToDelete.push({ ...fileInfo, reason: "Test file" });
  } else if (patterns.backup.test(fileName)) {
    results.backups.push({ ...fileInfo, reason: "Backup file" });
    results.safeToDelete.push({ ...fileInfo, reason: "Backup file" });
  } else if (patterns.duplicate.test(fileName)) {
    results.duplicates.push({ ...fileInfo, reason: "Duplicate file" });
    results.safeToDelete.push({ ...fileInfo, reason: "Duplicate file" });
  } else if (patterns.temp.test(fileName)) {
    results.tempFiles.push({ ...fileInfo, reason: "Temporary file" });
    results.safeToDelete.push({ ...fileInfo, reason: "Temporary file" });
  } else if (patterns.debug.test(fileName)) {
    results.debugFiles.push({ ...fileInfo, reason: "Debug file" });
    results.safeToDelete.push({ ...fileInfo, reason: "Debug file" });
  } else if (patterns.demo.test(fileName)) {
    results.demoFiles.push({ ...fileInfo, reason: "Demo file" });
    results.safeToDelete.push({ ...fileInfo, reason: "Demo file" });
  } else if (patterns.analysis.test(fileName)) {
    results.debugFiles.push({ ...fileInfo, reason: "Analysis file" });
    results.safeToDelete.push({ ...fileInfo, reason: "Analysis file" });
  } else if (patterns.obsolete.test(fileName)) {
    results.obsoleteFiles.push({ ...fileInfo, reason: "Obsolete file" });
    results.safeToDelete.push({ ...fileInfo, reason: "Obsolete file" });
  }
}

function scanDirectory(dir = "") {
  const fullPath = path.join(projectRoot, dir);

  try {
    const items = fs.readdirSync(fullPath);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const fullItemPath = path.join(fullPath, item);
      const stat = fs.statSync(fullItemPath);

      if (stat.isDirectory()) {
        // Skip protected directories
        if (!protectedDirs.includes(item) && !item.startsWith(".")) {
          scanDirectory(itemPath);
        }
      } else {
        // Skip protected files
        if (!protectedFiles.includes(item)) {
          analyzeFile(itemPath, item);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dir}:`, error.message);
  }
}

// Run analysis
console.log("🔍 Scanning project files...\n");
scanDirectory();

// Calculate total deletable size
const totalDeletableSize = results.safeToDelete.reduce(
  (sum, file) => sum + file.sizeBytes,
  0
);

// Print results
console.log("📊 ANALYSIS RESULTS");
console.log("==================\n");

console.log(
  `📁 Total files analyzed: ${
    results.safeToDelete.length + protectedFiles.length
  }`
);
console.log(`🗑️  Files safe to delete: ${results.safeToDelete.length}`);
console.log(`💾 Space that can be freed: ${formatBytes(totalDeletableSize)}`);
console.log(`🛡️  Protected files: ${protectedFiles.length}\n`);

if (results.testFiles.length > 0) {
  console.log(`🧪 Test Files (${results.testFiles.length}):`);
  results.testFiles.forEach((file) =>
    console.log(`   • ${file.name} (${file.size})`)
  );
  console.log();
}

if (results.demoFiles.length > 0) {
  console.log(`🎭 Demo Files (${results.demoFiles.length}):`);
  results.demoFiles.forEach((file) =>
    console.log(`   • ${file.name} (${file.size})`)
  );
  console.log();
}

if (results.debugFiles.length > 0) {
  console.log(`🐛 Debug/Analysis Files (${results.debugFiles.length}):`);
  results.debugFiles.forEach((file) =>
    console.log(`   • ${file.name} (${file.size})`)
  );
  console.log();
}

if (results.backups.length > 0) {
  console.log(`💾 Backup Files (${results.backups.length}):`);
  results.backups.forEach((file) =>
    console.log(`   • ${file.name} (${file.size})`)
  );
  console.log();
}

if (results.duplicates.length > 0) {
  console.log(`📋 Duplicate Files (${results.duplicates.length}):`);
  results.duplicates.forEach((file) =>
    console.log(`   • ${file.name} (${file.size})`)
  );
  console.log();
}

if (results.tempFiles.length > 0) {
  console.log(`🗂️  Temporary Files (${results.tempFiles.length}):`);
  results.tempFiles.forEach((file) =>
    console.log(`   • ${file.name} (${file.size})`)
  );
  console.log();
}

console.log("🚀 CLEANUP RECOMMENDATIONS");
console.log("==========================\n");

console.log("✅ SAFE TO DELETE:");
console.log(
  "   These files can be safely removed without affecting functionality:\n"
);

const groupedFiles = {};
results.safeToDelete.forEach((file) => {
  if (!groupedFiles[file.reason]) {
    groupedFiles[file.reason] = [];
  }
  groupedFiles[file.reason].push(file);
});

Object.keys(groupedFiles).forEach((reason) => {
  console.log(`   ${reason}:`);
  groupedFiles[reason].forEach((file) => {
    console.log(`      rm "${file.path}"`);
  });
  console.log();
});

console.log("🛡️  PROTECTED FILES:");
console.log("   These files are essential and will NOT be deleted:\n");
protectedFiles.forEach((file) => console.log(`   • ${file}`));
protectedDirs.forEach((dir) => console.log(`   • ${dir}/ (directory)`));

console.log("\n🎯 NEXT STEPS:");
console.log("==============\n");
console.log("1. Review the list above");
console.log(
  "2. Run: node smart-cleanup-analysis.cjs --execute (to actually delete files)"
);
console.log("3. Or manually delete specific files you want to remove");
console.log(
  `4. This will free up ${formatBytes(totalDeletableSize)} of space\n`
);

// Generate cleanup script
if (process.argv.includes("--execute")) {
  console.log("🗑️  EXECUTING CLEANUP...\n");

  let deletedCount = 0;
  let freedSpace = 0;

  results.safeToDelete.forEach((file) => {
    const fullPath = path.join(projectRoot, file.path);
    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        deletedCount++;
        freedSpace += file.sizeBytes;
        console.log(`✅ Deleted: ${file.name}`);
      }
    } catch (error) {
      console.log(`❌ Failed to delete: ${file.name} - ${error.message}`);
    }
  });

  console.log(`\n🎉 CLEANUP COMPLETE!`);
  console.log(`📁 Files deleted: ${deletedCount}`);
  console.log(`💾 Space freed: ${formatBytes(freedSpace)}`);
} else {
  console.log(
    "💡 To execute the cleanup, run: node smart-cleanup-analysis.cjs --execute"
  );
}
