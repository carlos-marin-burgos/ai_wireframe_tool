const fs = require("fs");
const path = require("path");

// Auto-backup system for critical files
class AutoBackup {
  constructor(options = {}) {
    this.backupDir = options.backupDir || path.join(__dirname, "backups");
    this.maxBackups = options.maxBackups || 10;
    this.watchFiles = options.watchFiles || [
      "simple-server.js",
      "package.json",
      "local.settings.json",
    ];

    this.ensureBackupDir();
    this.startWatching();
  }

  ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      console.log(`✅ Created backup directory: ${this.backupDir}`);
    }
  }

  createBackup(filePath) {
    if (!fs.existsSync(filePath)) return;

    const fileName = path.basename(filePath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupName = `${fileName}.backup.${timestamp}`;
    const backupPath = path.join(this.backupDir, backupName);

    try {
      fs.copyFileSync(filePath, backupPath);
      console.log(`💾 Backup created: ${backupName}`);

      // Clean old backups
      this.cleanOldBackups(fileName);
    } catch (error) {
      console.error(`❌ Backup failed for ${fileName}:`, error);
    }
  }

  cleanOldBackups(fileName) {
    try {
      const backups = fs
        .readdirSync(this.backupDir)
        .filter((file) => file.startsWith(`${fileName}.backup.`))
        .map((file) => ({
          name: file,
          path: path.join(this.backupDir, file),
          stat: fs.statSync(path.join(this.backupDir, file)),
        }))
        .sort((a, b) => b.stat.mtime - a.stat.mtime);

      // Remove old backups if we exceed maxBackups
      if (backups.length > this.maxBackups) {
        const toDelete = backups.slice(this.maxBackups);
        toDelete.forEach((backup) => {
          fs.unlinkSync(backup.path);
          console.log(`🗑️ Removed old backup: ${backup.name}`);
        });
      }
    } catch (error) {
      console.error("❌ Error cleaning old backups:", error);
    }
  }

  startWatching() {
    this.watchFiles.forEach((fileName) => {
      const filePath = path.join(__dirname, fileName);

      if (fs.existsSync(filePath)) {
        // Create initial backup
        this.createBackup(filePath);

        // Watch for changes
        fs.watchFile(filePath, { interval: 2000 }, (curr, prev) => {
          if (curr.mtime !== prev.mtime) {
            console.log(`📝 File changed: ${fileName}`);
            this.createBackup(filePath);
          }
        });

        console.log(`👀 Watching: ${fileName}`);
      }
    });
  }

  restoreFromBackup(fileName, backupTimestamp = null) {
    const filePath = path.join(__dirname, fileName);

    try {
      const backups = fs
        .readdirSync(this.backupDir)
        .filter((file) => file.startsWith(`${fileName}.backup.`))
        .sort()
        .reverse();

      if (backups.length === 0) {
        console.log(`❌ No backups found for ${fileName}`);
        return false;
      }

      let backupToRestore;
      if (backupTimestamp) {
        backupToRestore = backups.find((backup) =>
          backup.includes(backupTimestamp)
        );
      } else {
        backupToRestore = backups[0]; // Most recent
      }

      if (!backupToRestore) {
        console.log(`❌ Backup not found for ${fileName}`);
        return false;
      }

      const backupPath = path.join(this.backupDir, backupToRestore);
      fs.copyFileSync(backupPath, filePath);
      console.log(`✅ Restored ${fileName} from ${backupToRestore}`);
      return true;
    } catch (error) {
      console.error(`❌ Error restoring ${fileName}:`, error);
      return false;
    }
  }

  listBackups(fileName = null) {
    try {
      let backups = fs.readdirSync(this.backupDir);

      if (fileName) {
        backups = backups.filter((file) =>
          file.startsWith(`${fileName}.backup.`)
        );
      }

      const backupInfo = backups
        .map((backup) => {
          const backupPath = path.join(this.backupDir, backup);
          const stat = fs.statSync(backupPath);
          return {
            name: backup,
            created: stat.mtime,
            size: stat.size,
          };
        })
        .sort((a, b) => b.created - a.created);

      return backupInfo;
    } catch (error) {
      console.error("❌ Error listing backups:", error);
      return [];
    }
  }
}

// Usage example and CLI interface
if (require.main === module) {
  const backup = new AutoBackup({
    maxBackups: 20, // Keep more backups for critical files
    watchFiles: [
      "simple-server.js",
      "package.json",
      "local.settings.json",
      "components/HeroGenerator.js",
    ],
  });

  // CLI commands
  const command = process.argv[2];
  const fileName = process.argv[3];
  const timestamp = process.argv[4];

  switch (command) {
    case "restore":
      if (!fileName) {
        console.log(
          "Usage: node auto-backup.js restore <fileName> [timestamp]"
        );
        process.exit(1);
      }
      backup.restoreFromBackup(fileName, timestamp);
      break;

    case "list":
      const backups = backup.listBackups(fileName);
      console.log("\n📋 Available backups:");
      backups.forEach((backup) => {
        console.log(
          `  ${backup.name} (${backup.created.toISOString()}) - ${
            backup.size
          } bytes`
        );
      });
      break;

    default:
      console.log("🔄 Auto-backup system started");
      console.log("Available commands:");
      console.log("  node auto-backup.js restore <fileName> [timestamp]");
      console.log("  node auto-backup.js list [fileName]");
  }
}

module.exports = AutoBackup;
