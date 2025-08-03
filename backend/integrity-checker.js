const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// File integrity checker to detect corruption
class IntegrityChecker {
  constructor() {
    this.checksumFile = path.join(__dirname, ".file-checksums.json");
    this.watchedFiles = [
      "simple-server.js",
      "package.json",
      "local.settings.json",
    ];
    this.loadChecksums();
  }

  loadChecksums() {
    try {
      if (fs.existsSync(this.checksumFile)) {
        this.checksums = JSON.parse(fs.readFileSync(this.checksumFile, "utf8"));
      } else {
        this.checksums = {};
      }
    } catch (error) {
      console.error("❌ Error loading checksums:", error);
      this.checksums = {};
    }
  }

  saveChecksums() {
    try {
      fs.writeFileSync(
        this.checksumFile,
        JSON.stringify(this.checksums, null, 2)
      );
    } catch (error) {
      console.error("❌ Error saving checksums:", error);
    }
  }

  calculateChecksum(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      return crypto.createHash("sha256").update(content).digest("hex");
    } catch (error) {
      console.error(`❌ Error calculating checksum for ${filePath}:`, error);
      return null;
    }
  }

  validateJavaScript(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");

      // First, check for basic JavaScript syntax - this is the most important check
      try {
        new Function(content);
      } catch (syntaxError) {
        return {
          valid: false,
          issues: [{ type: "Syntax error", error: syntaxError.message }],
        };
      }

      // Check for corruption patterns, but be smart about HTML in strings
      const issues = [];

      // Check for HTML entities (these are usually corruption)
      const htmlEntities = content.match(/&lt;|&gt;|&amp;/g);
      if (htmlEntities) {
        issues.push({
          type: "HTML entities (possible corruption)",
          matches: htmlEntities.slice(0, 3),
        });
      }

      // Check for non-breaking spaces (these are usually corruption)
      const nonBreakingSpaces = content.match(/\u00A0/g);
      if (nonBreakingSpaces) {
        issues.push({
          type: "Non-breaking spaces (possible corruption)",
          matches: [`Found ${nonBreakingSpaces.length} instances`],
        });
      }

      // Check for byte order mark (these are usually corruption)
      const byteOrderMark = content.match(/\uFEFF/g);
      if (byteOrderMark) {
        issues.push({
          type: "Byte order mark (possible corruption)",
          matches: [`Found ${byteOrderMark.length} instances`],
        });
      }

      // Check for control characters (these are usually corruption)
      const controlChars = content.match(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g);
      if (controlChars) {
        issues.push({
          type: "Control characters (possible corruption)",
          matches: [`Found ${controlChars.length} instances`],
        });
      }

      // Smart HTML tag detection - only flag if HTML appears outside of strings
      const suspiciousHtmlPattern =
        /baseURL:\s*`[^`]*<span[^>]*>[^<]*<\/span>/i;
      if (suspiciousHtmlPattern.test(content)) {
        issues.push({
          type: "HTML in critical configuration (likely corruption)",
          matches: ["HTML found in baseURL configuration"],
        });
      }

      // Check for HTML in variable assignments (outside of template strings for HTML generation)
      const htmlInAssignments = content.match(
        /(?:const|let|var)\s+\w+\s*=\s*[^`"']*<[a-zA-Z][^>]*>/g
      );
      if (htmlInAssignments) {
        issues.push({
          type: "HTML in variable assignments (possible corruption)",
          matches: htmlInAssignments.slice(0, 2),
        });
      }

      return {
        valid: issues.length === 0,
        issues: issues,
      };
    } catch (error) {
      return {
        valid: false,
        issues: [{ type: "File read error", error: error.message }],
      };
    }
  }

  checkFile(fileName) {
    const filePath = path.join(__dirname, fileName);

    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${fileName}`);
      return false;
    }

    const currentChecksum = this.calculateChecksum(filePath);
    const storedChecksum = this.checksums[fileName];

    console.log(`🔍 Checking integrity of: ${fileName}`);

    // Validate JavaScript files
    if (fileName.endsWith(".js")) {
      const validation = this.validateJavaScript(filePath);
      if (!validation.valid) {
        console.log(`🚨 CORRUPTION DETECTED in ${fileName}:`);
        validation.issues.forEach((issue) => {
          console.log(
            `  - ${issue.type}: ${
              issue.matches ? issue.matches.join(", ") : issue.error
            }`
          );
        });
        return false;
      }
    }

    if (storedChecksum && currentChecksum !== storedChecksum) {
      console.log(`⚠️ File modified: ${fileName}`);
      console.log(`  Previous: ${storedChecksum.substring(0, 16)}...`);
      console.log(`  Current:  ${currentChecksum.substring(0, 16)}...`);
    } else if (!storedChecksum) {
      console.log(`📝 New file tracked: ${fileName}`);
    } else {
      console.log(`✅ File integrity OK: ${fileName}`);
    }

    // Update checksum
    this.checksums[fileName] = currentChecksum;
    this.saveChecksums();

    return true;
  }

  checkAllFiles() {
    console.log("🔍 Checking file integrity...\n");

    let allValid = true;
    this.watchedFiles.forEach((fileName) => {
      const isValid = this.checkFile(fileName);
      if (!isValid) allValid = false;
      console.log(""); // Empty line for readability
    });

    if (allValid) {
      console.log("✅ All files passed integrity check");
    } else {
      console.log(
        "🚨 Some files failed integrity check - consider restoring from backup"
      );
    }

    return allValid;
  }

  startMonitoring() {
    console.log("👀 Starting file integrity monitoring...\n");

    // Initial check
    this.checkAllFiles();

    // Monitor files for changes
    this.watchedFiles.forEach((fileName) => {
      const filePath = path.join(__dirname, fileName);

      if (fs.existsSync(filePath)) {
        fs.watchFile(filePath, { interval: 3000 }, () => {
          console.log(`\n📝 File changed detected: ${fileName}`);
          setTimeout(() => {
            this.checkFile(fileName);
          }, 1000); // Wait a bit for file to be fully written
        });
      }
    });

    console.log("🛡️ File integrity monitoring active");
  }
}

// CLI interface
if (require.main === module) {
  const checker = new IntegrityChecker();
  const command = process.argv[2];
  const fileName = process.argv[3];

  switch (command) {
    case "check":
      if (fileName) {
        checker.checkFile(fileName);
      } else {
        checker.checkAllFiles();
      }
      break;

    case "monitor":
      checker.startMonitoring();
      // Keep process alive
      process.on("SIGINT", () => {
        console.log("\n👋 Stopping integrity monitor");
        process.exit(0);
      });
      break;

    default:
      console.log("🛡️ File Integrity Checker");
      console.log("Usage:");
      console.log(
        "  node integrity-checker.js check [fileName]    - Check file integrity"
      );
      console.log(
        "  node integrity-checker.js monitor            - Start continuous monitoring"
      );
  }
}

module.exports = IntegrityChecker;
