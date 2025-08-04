/**
 * Site Header Generator
 * Generates HTML for website headers using Microsoft Learn design system
 * Styles are handled by frontend CSS files, not embedded here
 */

/**
 * Generates a complete site header with navigation using Atlas Component Library
 * @param {Object} options - Configuration options for the header
 * @returns {string} HTML string for the site header
 */
function generateSiteHeaderHTML(options = {}) {
  // Import Atlas Component Library
  const AtlasComponentLibrary = require("./AtlasComponentLibrary");
  const atlasLibrary = new AtlasComponentLibrary();

  // Use the Atlas Component Library's site header instead of custom HTML
  return atlasLibrary.generateComponent("site-header", options);
}

/**
 * Generates a Microsoft Learn site header using Atlas Component Library
 * This function now uses the official Microsoft Learn site header component
 * with proper branding, navigation, and Fluent UI styling
 * @param {Object} options - Configuration options (passed to Atlas Component Library)
 * @returns {string} HTML string for Microsoft Learn site header
 */
function generateSimpleSiteHeaderHTML(options = {}) {
  // Import Atlas Component Library
  const AtlasComponentLibrary = require("./AtlasComponentLibrary");
  const atlasLibrary = new AtlasComponentLibrary();

  // Use the Atlas Component Library's site header instead of custom HTML
  return atlasLibrary.generateComponent("site-header", options);
}

module.exports = {
  generateSiteHeaderHTML,
  generateSimpleSiteHeaderHTML,
};
