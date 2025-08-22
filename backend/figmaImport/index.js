/**
 * Figma Component Import API Endpoint
 * Imports selected Figma components and converts them to wireframe HTML/CSS
 */

module.exports = async function (context, req) {
  try {
    context.log("Starting Figma component import");

    // Set CORS headers
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      },
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      context.res.status = 200;
      return;
    }

    if (req.method !== "POST") {
      context.res.status = 405;
      context.res.body = { error: "Method not allowed" };
      return;
    }

    const { componentIds, options = {} } = req.body;

    if (
      !componentIds ||
      !Array.isArray(componentIds) ||
      componentIds.length === 0
    ) {
      context.res.status = 400;
      context.res.body = { error: "componentIds array is required" };
      return;
    }

    context.log(`Importing ${componentIds.length} components:`, componentIds);

    // Mock component data with real component mappings
    const componentDatabase = {
      "fluent-button-001": {
        id: "fluent-button-001",
        name: "Button Primary",
        category: "Actions",
        library: "Fluent UI",
        htmlCode: `<button class="btn btn-primary" type="button">
  <span class="btn-text">Primary Action</span>
</button>`,
        cssCode: `.btn {
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #0078d4;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #106ebe;
}

.btn-primary:active {
  background-color: #005a9e;
}

.btn-text {
  display: inline-block;
}`,
      },
      "fluent-button-002": {
        id: "fluent-button-002",
        name: "Button Secondary",
        category: "Actions",
        library: "Fluent UI",
        htmlCode: `<button class="btn btn-secondary" type="button">
  <span class="btn-text">Secondary Action</span>
</button>`,
        cssCode: `.btn-secondary {
  background-color: transparent;
  color: #0078d4;
  border: 1px solid #0078d4;
}

.btn-secondary:hover {
  background-color: #0078d4;
  color: #ffffff;
}

.btn-secondary:active {
  background-color: #005a9e;
  border-color: #005a9e;
}`,
      },
      "atlas-hero-001": {
        id: "atlas-hero-001",
        name: "Hero Section",
        category: "Marketing",
        library: "Atlas Design",
        htmlCode: `<section class="hero-section">
  <div class="hero-container">
    <div class="hero-content">
      <h1 class="hero-title">Welcome to Microsoft Learn</h1>
      <p class="hero-description">
        Develop your skills with our comprehensive learning paths and hands-on labs.
      </p>
      <div class="hero-actions">
        <button class="btn btn-primary">Get Started</button>
        <button class="btn btn-secondary">Browse Catalog</button>
      </div>
    </div>
    <div class="hero-image">
      <div class="image-placeholder">📚</div>
    </div>
  </div>
</section>`,
        cssCode: `.hero-section {
  background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%);
  color: white;
  padding: 80px 20px;
  min-height: 500px;
  display: flex;
  align-items: center;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-content {
  max-width: 500px;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 20px 0;
  line-height: 1.2;
}

.hero-description {
  font-size: 18px;
  margin: 0 0 30px 0;
  opacity: 0.9;
  line-height: 1.5;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-image {
  text-align: center;
}

.image-placeholder {
  font-size: 120px;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .hero-title {
    font-size: 36px;
  }
}`,
      },
      "fluent-input-001": {
        id: "fluent-input-001",
        name: "Text Input",
        category: "Forms",
        library: "Fluent UI",
        htmlCode: `<div class="form-field">
  <label class="form-label" for="input-text">
    Label Text
  </label>
  <input 
    class="form-input" 
    type="text" 
    id="input-text"
    placeholder="Enter text here..."
  />
  <div class="form-helper">Helper text or validation message</div>
</div>`,
        cssCode: `.form-field {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #323130;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #8a8886;
  border-radius: 2px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  background-color: #ffffff;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #0078d4;
  box-shadow: 0 0 0 1px #0078d4;
}

.form-input::placeholder {
  color: #a19f9d;
}

.form-helper {
  font-size: 12px;
  color: #605e5c;
  margin-top: 4px;
}`,
      },
      "atlas-card-001": {
        id: "atlas-card-001",
        name: "Learning Path Card",
        category: "Cards",
        library: "Atlas Design",
        htmlCode: `<div class="learning-card">
  <div class="card-image">
    <div class="image-placeholder">🎓</div>
  </div>
  <div class="card-content">
    <div class="card-category">Learning Path</div>
    <h3 class="card-title">Azure Fundamentals</h3>
    <p class="card-description">
      Learn the basics of cloud computing and Microsoft Azure services.
    </p>
    <div class="card-meta">
      <span class="card-duration">4 hours</span>
      <span class="card-level">Beginner</span>
    </div>
    <div class="card-actions">
      <button class="btn btn-primary btn-small">Start Learning</button>
    </div>
  </div>
</div>`,
        cssCode: `.learning-card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  max-width: 320px;
}

.learning-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-image {
  height: 180px;
  background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  font-size: 48px;
  color: white;
}

.card-content {
  padding: 20px;
}

.card-category {
  font-size: 12px;
  color: #0078d4;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #323130;
}

.card-description {
  font-size: 14px;
  color: #605e5c;
  line-height: 1.4;
  margin: 0 0 16px 0;
}

.card-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.card-duration,
.card-level {
  font-size: 12px;
  color: #8a8886;
  background: #f3f2f1;
  padding: 4px 8px;
  border-radius: 12px;
}

.btn-small {
  padding: 6px 12px;
  font-size: 13px;
}`,
      },
      "fluent-dropdown-001": {
        id: "fluent-dropdown-001",
        name: "Dropdown Select",
        category: "Forms",
        library: "Fluent UI",
        htmlCode: `<div class="form-field">
  <label class="form-label" for="dropdown-select">
    Choose an option
  </label>
  <select class="form-select" id="dropdown-select">
    <option value="">Select an option...</option>
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    <option value="option3">Option 3</option>
  </select>
</div>`,
        cssCode: `.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #8a8886;
  border-radius: 2px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 8px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 32px;
  cursor: pointer;
}

.form-select:focus {
  outline: none;
  border-color: #0078d4;
  box-shadow: 0 0 0 1px #0078d4;
}`,
      },
      "fluent-nav-001": {
        id: "fluent-nav-001",
        name: "Navigation Bar",
        category: "Navigation",
        library: "Fluent UI",
        htmlCode: `<nav class="navbar">
  <div class="nav-container">
    <div class="nav-brand">
      <a href="#" class="brand-link">
        <span class="brand-text">Brand</span>
      </a>
    </div>
    <div class="nav-menu">
      <a href="#" class="nav-link active">Home</a>
      <a href="#" class="nav-link">Products</a>
      <a href="#" class="nav-link">Services</a>
      <a href="#" class="nav-link">About</a>
      <a href="#" class="nav-link">Contact</a>
    </div>
    <div class="nav-actions">
      <button class="btn btn-secondary btn-small">Sign In</button>
      <button class="btn btn-primary btn-small">Get Started</button>
    </div>
  </div>
</nav>`,
        cssCode: `.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #e1dfdd;
  padding: 0 20px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.nav-brand {
  flex-shrink: 0;
}

.brand-link {
  text-decoration: none;
  color: #323130;
  font-size: 20px;
  font-weight: 600;
}

.nav-menu {
  display: flex;
  gap: 24px;
  margin: 0 20px;
}

.nav-link {
  text-decoration: none;
  color: #605e5c;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #0078d4;
  background-color: #f3f2f1;
}

.nav-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
}`,
      },
    };

    // Process each component ID
    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (const componentId of componentIds) {
      try {
        const component = componentDatabase[componentId];

        if (!component) {
          results.push({
            componentId,
            success: false,
            error: `Component ${componentId} not found`,
          });
          failCount++;
          continue;
        }

        // Apply options to modify the component code
        let htmlCode = component.htmlCode;
        let cssCode = component.cssCode;

        // Apply design system preferences
        if (options.designSystem === "fluent") {
          cssCode = cssCode.replace(/#0078d4/g, "#0078d4"); // Keep Fluent blue
        } else if (options.designSystem === "atlas") {
          cssCode = cssCode.replace(/#0078d4/g, "#0078d4"); // Keep Atlas blue
        }

        // Apply responsive option
        if (options.responsive === false) {
          cssCode = cssCode.replace(/@media[^}]+}/g, ""); // Remove media queries
        }

        // Generate wireframe HTML (simplified for wireframing)
        const wireframeHtml = options.wireframeMode
          ? htmlCode.replace(/class="[^"]*"/g, 'class="wireframe-element"')
          : htmlCode;

        const wireframeCss = options.wireframeMode
          ? `
.wireframe-element {
  border: 2px dashed #8a8886;
  background: #f8f8f8;
  padding: 8px;
  margin: 4px;
  font-family: monospace;
  color: #605e5c;
}
        `
          : cssCode;

        results.push({
          componentId,
          componentName: component.name,
          htmlCode,
          cssCode,
          wireframeHtml,
          wireframeCss,
          success: true,
        });

        successCount++;
      } catch (error) {
        context.log.error(`Error processing component ${componentId}:`, error);
        results.push({
          componentId,
          success: false,
          error: error.message,
        });
        failCount++;
      }
    }

    const response = {
      results,
      summary: {
        total: componentIds.length,
        successful: successCount,
        failed: failCount,
      },
    };

    context.log(
      `Import completed: ${successCount} successful, ${failCount} failed`
    );

    context.res.status = 200;
    context.res.body = response;
  } catch (error) {
    context.log.error("Error importing Figma components:", error);

    context.res.status = 500;
    context.res.body = {
      error: "Failed to import components",
      details: error.message,
    };
  }
};
