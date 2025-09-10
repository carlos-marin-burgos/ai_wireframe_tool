const AutoBackup = require("./auto-backup.js");

// Restore all files from most recent backups
const backup = new AutoBackup({
  maxBackups: 20,
  watchFiles: [
    "simple-server.js",
    "package.json",
    "local.settings.json",
    "components/HeroGenerator.js",
  ],
});

const filesToRestore = [
  "simple-server.js",
  "package.json",
  "local.settings.json",
  "HeroGenerator.js",
];

console.log("🚀 Starting batch restore of all files...");

filesToRestore.forEach((fileName) => {
  console.log(`\n🔄 Restoring ${fileName}...`);
  const success = backup.restoreFromBackup(fileName);
  if (success) {
    console.log(`✅ Successfully restored ${fileName}`);
  } else {
    console.log(`❌ Failed to restore ${fileName}`);
  }
});

console.log("\n🎉 Batch restore completed!");
