const fs = require("fs");
const path = require("path");
// const { TemplateBackup } = require("./template-backup");

/**
 * Template Manager - Handles loading and rendering HTML templates
 * This prevents template corruption by keeping HTML separate from JavaScript code
 */
class TemplateManager {
  constructor() {
    this.templatesDir = path.join(__dirname, "templates");
    this.templateCache = new Map();
    // this.backup = new TemplateBackup();

    // Verify template integrity on startup
    // this.verifyAndRepair();
  }
  /**
   * Verify template integrity and auto-repair if needed
   */
  verifyAndRepair() {
    console.warn(
      "⚠️ Template backup system is disabled - skipping verification"
    );
    return;
  }

  /**
   * Load a template from file with corruption detection
   * @param {string} templateName - Name of the template file (without extension)
   * @returns {string} - Template content
   */
  loadTemplate(templateName) {
    try {
      // DEVELOPMENT: Skip cache to always read fresh from disk
      // Check cache first
      // if (this.templateCache.has(templateName)) {
      //   return this.templateCache.get(templateName);
      // }

      const templatePath = path.join(this.templatesDir, `${templateName}.html`);

      if (!fs.existsSync(templatePath)) {
        console.warn(`⚠️ Template not found: ${templatePath}`);
        return null;
      }

      const templateContent = fs.readFileSync(templatePath, "utf8");

      // Basic corruption check - ensure it's valid HTML
      if (
        !templateContent.includes("<!DOCTYPE html>") ||
        !templateContent.includes("</html>") ||
        templateContent.length < 100
      ) {
        console.error(`❌ Template ${templateName} appears corrupted`);
        return null;
      }

      // DEVELOPMENT: Skip caching to always read fresh
      // Cache the template
      // this.templateCache.set(templateName, templateContent);

      console.log(`📄 Loaded template: ${templateName} (FRESH FROM DISK)`);
      return templateContent;
    } catch (error) {
      console.error(`❌ Error loading template ${templateName}:`, error);

      // Backup system is disabled - cannot restore from backup
      console.warn(
        `⚠️ Template ${templateName} could not be loaded and backup system is disabled`
      );
      return null;
    }
  }

  /**
   * Render a template with variables
   * @param {string} templateName - Name of the template
   * @param {Object} variables - Variables to replace in template
   * @returns {string} - Rendered HTML
   */
  renderTemplate(templateName, variables = {}) {
    const template = this.loadTemplate(templateName);

    if (!template) {
      return null;
    }

    // Replace template variables ({{variable}})
    let renderedTemplate = template;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      renderedTemplate = renderedTemplate.replace(
        new RegExp(placeholder, "g"),
        value
      );
    }

    console.log(
      `✅ Rendered template: ${templateName} with variables:`,
      Object.keys(variables)
    );
    return renderedTemplate;
  }

  /**
   * Clear template cache (useful for development)
   */
  clearCache() {
    this.templateCache.clear();
    console.log("📄 Template cache cleared");
  }

  /**
   * Create backup of all templates
   */
  createBackup() {
    console.warn("⚠️ Backup system is disabled");
    return { success: false, message: "Backup system disabled" };
  }

  /**
   * Verify template integrity
   */
  verifyIntegrity() {
    console.warn("⚠️ Backup system is disabled");
    return { valid: [], corrupted: [], missing: [] };
  }

  /**
   * Update template checksums
   */
  updateChecksums() {
    console.warn("⚠️ Backup system is disabled");
    return { success: false, message: "Backup system disabled" };
  }

  /**
   * List available templates
   * @returns {Array} - Array of available template names
   */
  listTemplates() {
    try {
      const files = fs.readdirSync(this.templatesDir);
      return files
        .filter((file) => file.endsWith(".html"))
        .map((file) => file.replace(".html", ""));
    } catch (error) {
      console.error("❌ Error listing templates:", error);
      return [];
    }
  }
}

// Template selection logic - moved from fallback-generator.js
const TEMPLATE_CONDITIONS = {
  "microsoft-learn-home": [
    "learn home page",
    "microsoft learn landing page",
    "microsoft learn course page",
    "course page",
    "learning modules",
    "progress tracking",
  ],
  "microsoft-docs": [
    "documentation page",
    "microsoft docs",
    "docs page",
    "microsoft documentation",
    "breadcrumb",
    "sidebar",
    "table of contents",
    "code examples",
  ],
  "azure-learning-path": [
    "create an azure learning path with course cards",
    "azure learning path with course cards",
    "azure learning path",
  ],
  "microsoft-learning-plan": [
    "microsoft learning plan",
    "microsoft learn plan",
    "ms learning plan",
  ],
  "certification-tracker": [
    "build a certification progress tracker with modules",
    "certification progress tracker with modules",
    "certification progress tracker",
    "certification tracker",
  ],
  "microsoft-docs": [
    "Microsoft Learn Doc page",
    "microsoft learn doc page",
    "learn doc page",
    "documentation page",
    "docs page",
    "microsoft docs",
  ],
};

/**
 * Determine which template to use based on description
 * @param {string} description - The description to analyze
 * @returns {string} - Template name to use
 */
function selectTemplate(description) {
  const lowerDesc = description.toLowerCase();

  // FORCE AI GENERATION for hero + navigation requests
  if (
    (lowerDesc.includes("hero") && lowerDesc.includes("nav")) ||
    (lowerDesc.includes("hero") && lowerDesc.includes("navigation")) ||
    (lowerDesc.includes("banner") && lowerDesc.includes("nav")) ||
    (lowerDesc.includes("header") && lowerDesc.includes("nav"))
  ) {
    console.log(
      `🚀 FORCE AI: Hero+Nav request detected - skipping templates: "${description}"`
    );
    return null; // Force AI generation
  }

  // Check each template condition
  for (const [templateName, conditions] of Object.entries(
    TEMPLATE_CONDITIONS
  )) {
    for (const condition of conditions) {
      if (lowerDesc.includes(condition)) {
        console.log(
          `🎯 Selected template: ${templateName} (matched: "${condition}")`
        );
        return templateName;
      }
    }
  }

  // Default: return null to force AI-generated wireframe (no docs template)
  console.log(
    `🎯 No template match for: "${description}" - will use AI-generated wireframe`
  );
  return null;
}

module.exports = {
  TemplateManager,
  selectTemplate,
  TEMPLATE_CONDITIONS,
};
