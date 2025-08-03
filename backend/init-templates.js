const { TemplateManager } = require("./template-manager");

/**
 * Template initialization and verification script
 */
async function initializeTemplates() {
  console.log("🚀 Initializing template system...");

  try {
    // Create template manager instance
    const templateManager = new TemplateManager();

    // Create initial backup
    console.log("📦 Creating initial backup...");
    const backupDir = templateManager.createBackup();

    if (backupDir) {
      console.log(`✅ Initial backup created: ${backupDir}`);
    } else {
      console.warn("⚠️ Failed to create initial backup");
    }

    // Update checksums
    console.log("🔍 Updating template checksums...");
    const checksums = templateManager.updateChecksums();

    if (checksums) {
      console.log("✅ Template checksums updated");
      console.log("📄 Templates:", Object.keys(checksums));
    } else {
      console.warn("⚠️ Failed to update checksums");
    }

    // Verify integrity
    console.log("🔍 Verifying template integrity...");
    const verification = templateManager.verifyIntegrity();

    console.log(`✅ Valid templates: ${verification.valid.length}`);
    if (verification.corrupted.length > 0) {
      console.log(`❌ Corrupted templates: ${verification.corrupted.length}`);
    }
    if (verification.missing.length > 0) {
      console.log(`⚠️ Missing templates: ${verification.missing.length}`);
    }

    // Test template loading
    console.log("🧪 Testing template loading...");
    const templates = [
      "learn-home-page",
      "microsoft-docs",
      "learn-doc-template",
    ];

    for (const templateName of templates) {
      const template = templateManager.loadTemplate(templateName);
      if (template) {
        console.log(`✅ ${templateName}: ${template.length} characters`);
      } else {
        console.error(`❌ Failed to load: ${templateName}`);
      }
    }

    console.log("🎉 Template system initialization complete!");
  } catch (error) {
    console.error("❌ Template initialization failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeTemplates();
}

module.exports = { initializeTemplates };
