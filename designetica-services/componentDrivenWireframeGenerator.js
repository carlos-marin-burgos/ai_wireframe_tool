/**
 * Component-Driven Wireframe Generator
 * Integrates detected React components with wireframe generation
 */

const path = require("path");
const fs = require("fs");

// Import our existing services
const ComponentDetectionService = require("./componentDetectionService");
const FigmaService = require("./figmaService");

class ComponentDrivenWireframeGenerator {
  constructor() {
    this.componentDetector = new ComponentDetectionService();
    this.figmaService = new FigmaService();
    this.componentLibrary = new Map();
    this.wireframeTemplates = new Map();
    this.init();
  }

  /**
   * Initialize the generator with detected components
   */
  async init() {
    try {
      console.log("🔄 Initializing Component-Driven Wireframe Generator...");

      // Detect available React components
      const components = await this.componentDetector.detectComponents();
      this.buildComponentLibrary(components);

      // Initialize wireframe templates
      this.initializeWireframeTemplates();

      console.log(
        `✅ Initialized with ${this.componentLibrary.size} components`
      );
    } catch (error) {
      console.error("❌ Failed to initialize generator:", error);
    }
  }

  /**
   * Build a library of available React components
   */
  buildComponentLibrary(components) {
    components.forEach((component) => {
      const componentData = {
        name: component.name,
        type: component.type,
        complexity: component.complexity,
        filePath: component.filePath,
        props: component.props || [],
        variants: this.detectComponentVariants(component),
        htmlTemplate: this.generateComponentHtmlTemplate(component),
      };

      this.componentLibrary.set(component.name, componentData);
    });
  }

  /**
   * Detect component variants based on props and usage
   */
  detectComponentVariants(component) {
    const variants = [];

    // Detect common variants for buttons
    if (component.type === "button") {
      variants.push(
        {
          name: "primary",
          props: { variant: "primary", className: "btn-primary" },
        },
        {
          name: "secondary",
          props: { variant: "secondary", className: "btn-secondary" },
        },
        {
          name: "disabled",
          props: { disabled: true, className: "btn-disabled" },
        }
      );
    }

    // Detect modal variants
    if (component.type === "modal") {
      variants.push(
        { name: "small", props: { size: "small", className: "modal-sm" } },
        { name: "large", props: { size: "large", className: "modal-lg" } },
        {
          name: "fullscreen",
          props: { fullscreen: true, className: "modal-fullscreen" },
        }
      );
    }

    // Detect navigation variants
    if (component.type === "navigation") {
      variants.push(
        {
          name: "horizontal",
          props: { orientation: "horizontal", className: "nav-horizontal" },
        },
        {
          name: "vertical",
          props: { orientation: "vertical", className: "nav-vertical" },
        },
        { name: "compact", props: { compact: true, className: "nav-compact" } }
      );
    }

    return variants;
  }

  /**
   * Generate HTML template for a component
   */
  generateComponentHtmlTemplate(component) {
    const templates = {
      button: (props = {}) => `
        <button 
          class="btn ${props.className || "btn-primary"}" 
          ${props.disabled ? "disabled" : ""}
        >
          ${props.text || "Button"}
        </button>
      `,

      modal: (props = {}) => `
        <div class="modal ${props.className || "modal-default"}" ${
        props.fullscreen ? 'data-fullscreen="true"' : ""
      }>
          <div class="modal-content">
            <div class="modal-header">
              <h3>${props.title || "Modal Title"}</h3>
              <button class="modal-close">×</button>
            </div>
            <div class="modal-body">
              ${props.content || "Modal content goes here..."}
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary">${
                props.primaryAction || "Save"
              }</button>
              <button class="btn btn-secondary">${
                props.secondaryAction || "Cancel"
              }</button>
            </div>
          </div>
        </div>
      `,

      navigation: (props = {}) => `
        <nav class="navbar ${props.className || "navbar-default"}">
          <div class="navbar-brand">
            ${props.brand || "Brand"}
          </div>
          <ul class="navbar-nav ${
            props.orientation === "vertical" ? "flex-column" : "flex-row"
          }">
            <li class="nav-item"><a href="#" class="nav-link">Home</a></li>
            <li class="nav-item"><a href="#" class="nav-link">Products</a></li>
            <li class="nav-item"><a href="#" class="nav-link">About</a></li>
            <li class="nav-item"><a href="#" class="nav-link">Contact</a></li>
          </ul>
        </nav>
      `,

      basic: (props = {}) => `
        <div class="component ${props.className || "component-basic"}">
          ${props.content || "Component content"}
        </div>
      `,
    };

    return templates[component.type] || templates.basic;
  }

  /**
   * Initialize wireframe templates using detected components
   */
  initializeWireframeTemplates() {
    // Landing page template
    this.wireframeTemplates.set("landing", {
      components: ["navigation", "hero", "features", "footer"],
      layout: "standard",
      generateHtml: (description, components) =>
        this.generateLandingPageWireframe(description, components),
    });

    // Dashboard template
    this.wireframeTemplates.set("dashboard", {
      components: ["navigation", "sidebar", "metrics", "charts", "tables"],
      layout: "dashboard",
      generateHtml: (description, components) =>
        this.generateDashboardWireframe(description, components),
    });

    // Form template
    this.wireframeTemplates.set("form", {
      components: ["navigation", "form", "buttons", "validation"],
      layout: "centered",
      generateHtml: (description, components) =>
        this.generateFormWireframe(description, components),
    });

    // Modal/Dialog template
    this.wireframeTemplates.set("modal", {
      components: ["modal", "overlay", "buttons"],
      layout: "overlay",
      generateHtml: (description, components) =>
        this.generateModalWireframe(description, components),
    });
  }

  /**
   * Generate wireframe based on description and available components
   */
  async generateWireframe(description, options = {}) {
    try {
      console.log("🎨 Generating component-driven wireframe for:", description);

      // Analyze description to determine template and components needed
      const analysis = this.analyzeDescription(description);

      // Select appropriate template
      const template =
        this.wireframeTemplates.get(analysis.templateType) ||
        this.wireframeTemplates.get("landing");

      // Get available components that match the requirements
      const requiredComponents = this.getRequiredComponents(analysis);

      // Generate the wireframe HTML
      const wireframeHtml = template.generateHtml(
        description,
        requiredComponents
      );

      // Apply styling and theming
      const styledWireframe = this.applyWireframeStyles(wireframeHtml, options);

      console.log("✅ Generated component-driven wireframe");

      return {
        html: styledWireframe,
        components: requiredComponents,
        template: analysis.templateType,
        metadata: {
          generatedAt: new Date().toISOString(),
          componentCount: requiredComponents.length,
          templateUsed: analysis.templateType,
        },
      };
    } catch (error) {
      console.error("❌ Failed to generate wireframe:", error);
      throw error;
    }
  }

  /**
   * Analyze description to determine wireframe requirements
   */
  analyzeDescription(description) {
    const lowerDesc = description.toLowerCase();

    // Template detection
    let templateType = "landing"; // default

    if (
      lowerDesc.includes("dashboard") ||
      lowerDesc.includes("admin") ||
      lowerDesc.includes("analytics")
    ) {
      templateType = "dashboard";
    } else if (
      lowerDesc.includes("form") ||
      lowerDesc.includes("submit") ||
      lowerDesc.includes("input")
    ) {
      templateType = "form";
    } else if (
      lowerDesc.includes("modal") ||
      lowerDesc.includes("dialog") ||
      lowerDesc.includes("popup")
    ) {
      templateType = "modal";
    }

    // Component requirements
    const requiredComponents = [];

    if (lowerDesc.includes("button")) requiredComponents.push("button");
    if (lowerDesc.includes("navigation") || lowerDesc.includes("menu"))
      requiredComponents.push("navigation");
    if (lowerDesc.includes("modal") || lowerDesc.includes("dialog"))
      requiredComponents.push("modal");
    if (lowerDesc.includes("form") || lowerDesc.includes("input"))
      requiredComponents.push("form");
    if (lowerDesc.includes("table") || lowerDesc.includes("list"))
      requiredComponents.push("table");

    return {
      templateType,
      requiredComponents,
      description,
      complexity: this.estimateComplexity(requiredComponents),
    };
  }

  /**
   * Get required components from the library
   */
  getRequiredComponents(analysis) {
    const components = [];

    analysis.requiredComponents.forEach((componentType) => {
      // Find components of the required type
      for (const [name, component] of this.componentLibrary) {
        if (component.type === componentType) {
          components.push(component);
          break; // Take the first matching component for now
        }
      }
    });

    // Always include navigation if not specified
    if (!components.some((c) => c.type === "navigation")) {
      const navComponent = Array.from(this.componentLibrary.values()).find(
        (c) => c.type === "navigation"
      );
      if (navComponent) components.unshift(navComponent);
    }

    return components;
  }

  /**
   * Generate landing page wireframe
   */
  generateLandingPageWireframe(description, components) {
    const navComponent = components.find((c) => c.type === "navigation");
    const buttonComponents = components.filter((c) => c.type === "button");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page Wireframe</title>
    ${this.getWireframeStyles()}
</head>
<body>
    <!-- Navigation -->
    ${navComponent ? navComponent.htmlTemplate({ brand: "Your Brand" }) : ""}
    
    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h1>Welcome to Our Platform</h1>
            <p>Built with your React components for ${description}</p>
            ${
              buttonComponents[0]
                ? buttonComponents[0].htmlTemplate({
                    text: "Get Started",
                    className: "btn-primary btn-large",
                  })
                : ""
            }
        </div>
    </section>
    
    <!-- Features Section -->
    <section class="features">
        <div class="container">
            <h2>Key Features</h2>
            <div class="feature-grid">
                <div class="feature-item">
                    <h3>Feature 1</h3>
                    <p>Description of your first key feature</p>
                </div>
                <div class="feature-item">
                    <h3>Feature 2</h3>
                    <p>Description of your second key feature</p>
                </div>
                <div class="feature-item">
                    <h3>Feature 3</h3>
                    <p>Description of your third key feature</p>
                </div>
            </div>
        </div>
    </section>
    
    <!-- CTA Section -->
    <section class="cta">
        <div class="container">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of users who trust our platform</p>
            ${
              buttonComponents[1]
                ? buttonComponents[1].htmlTemplate({
                    text: "Start Free Trial",
                    className: "btn-primary",
                  })
                : ""
            }
        </div>
    </section>
</body>
</html>
    `;
  }

  /**
   * Generate dashboard wireframe
   */
  generateDashboardWireframe(description, components) {
    const navComponent = components.find((c) => c.type === "navigation");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Wireframe</title>
    ${this.getWireframeStyles()}
</head>
<body>
    <div class="dashboard-layout">
        <!-- Top Navigation -->
        ${
          navComponent
            ? navComponent.htmlTemplate({
                brand: "Dashboard",
                className: "navbar-dashboard",
              })
            : ""
        }
        
        <!-- Main Content -->
        <div class="dashboard-main">
            <!-- Sidebar -->
            <aside class="dashboard-sidebar">
                <nav class="sidebar-nav">
                    <ul>
                        <li><a href="#" class="active">Overview</a></li>
                        <li><a href="#">Analytics</a></li>
                        <li><a href="#">Reports</a></li>
                        <li><a href="#">Settings</a></li>
                    </ul>
                </nav>
            </aside>
            
            <!-- Content Area -->
            <main class="dashboard-content">
                <h1>Dashboard</h1>
                
                <!-- Metrics Cards -->
                <div class="metrics-grid">
                    <div class="metric-card">
                        <h3>Total Users</h3>
                        <div class="metric-value">1,234</div>
                    </div>
                    <div class="metric-card">
                        <h3>Revenue</h3>
                        <div class="metric-value">$56,789</div>
                    </div>
                    <div class="metric-card">
                        <h3>Orders</h3>
                        <div class="metric-value">890</div>
                    </div>
                    <div class="metric-card">
                        <h3>Conversion</h3>
                        <div class="metric-value">3.2%</div>
                    </div>
                </div>
                
                <!-- Charts Section -->
                <div class="charts-section">
                    <div class="chart-card">
                        <h3>Revenue Trend</h3>
                        <div class="chart-placeholder">[Chart Area]</div>
                    </div>
                    <div class="chart-card">
                        <h3>User Growth</h3>
                        <div class="chart-placeholder">[Chart Area]</div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Generate form wireframe
   */
  generateFormWireframe(description, components) {
    const navComponent = components.find((c) => c.type === "navigation");
    const buttonComponents = components.filter((c) => c.type === "button");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Wireframe</title>
    ${this.getWireframeStyles()}
</head>
<body>
    ${navComponent ? navComponent.htmlTemplate() : ""}
    
    <div class="form-container">
        <div class="form-card">
            <h2>Contact Form</h2>
            <form class="wireframe-form">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" class="form-control" placeholder="Your name">
                </div>
                
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" class="form-control" placeholder="your@email.com">
                </div>
                
                <div class="form-group">
                    <label for="subject">Subject</label>
                    <input type="text" id="subject" class="form-control" placeholder="Message subject">
                </div>
                
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" class="form-control" rows="4" placeholder="Your message..."></textarea>
                </div>
                
                <div class="form-actions">
                    ${
                      buttonComponents[0]
                        ? buttonComponents[0].htmlTemplate({
                            text: "Send Message",
                            className: "btn-primary",
                          })
                        : ""
                    }
                    ${
                      buttonComponents[1]
                        ? buttonComponents[1].htmlTemplate({
                            text: "Cancel",
                            className: "btn-secondary",
                          })
                        : ""
                    }
                </div>
            </form>
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Generate modal wireframe
   */
  generateModalWireframe(description, components) {
    const modalComponent = components.find((c) => c.type === "modal");

    return modalComponent
      ? modalComponent.htmlTemplate({
          title: "Confirmation",
          content: "Are you sure you want to proceed with this action?",
          primaryAction: "Confirm",
          secondaryAction: "Cancel",
        })
      : this.generateBasicModal();
  }

  /**
   * Get comprehensive wireframe styles
   */
  getWireframeStyles() {
    return `
    <style>
        /* Reset and base styles */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #323130; }
        
        /* Container */
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        /* Navigation */
        .navbar { background: #f8f9fa; padding: 12px 0; border-bottom: 1px solid #e1e5e9; }
        .navbar-brand { font-weight: 600; font-size: 18px; }
        .navbar-nav { display: flex; list-style: none; gap: 24px; }
        .nav-link { text-decoration: none; color: #605e5c; font-weight: 500; }
        .nav-link:hover { color: #0078d4; }
        
        /* Buttons */
        .btn { 
            padding: 8px 16px; 
            border: none; 
            border-radius: 4px; 
            font-weight: 500; 
            cursor: pointer; 
            text-decoration: none; 
            display: inline-block;
            transition: all 0.2s ease;
        }
        .btn-primary { background: #0078d4; color: white; }
        .btn-primary:hover { background: #106ebe; }
        .btn-secondary { background: #f3f2f1; color: #323130; }
        .btn-secondary:hover { background: #edebe9; }
        .btn-large { padding: 12px 24px; font-size: 16px; }
        
        /* Hero section */
        .hero { 
            background: linear-gradient(135deg, #0078d4, #40e0d0); 
            color: white; 
            padding: 80px 0; 
            text-align: center; 
        }
        .hero h1 { font-size: 48px; margin-bottom: 16px; font-weight: 600; }
        .hero p { font-size: 20px; margin-bottom: 32px; opacity: 0.9; }
        
        /* Features */
        .features { padding: 80px 0; }
        .features h2 { text-align: center; margin-bottom: 48px; font-size: 32px; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; }
        .feature-item { text-align: center; padding: 24px; }
        .feature-item h3 { margin-bottom: 16px; }
        
        /* CTA */
        .cta { background: #f8f9fa; padding: 80px 0; text-align: center; }
        .cta h2 { margin-bottom: 16px; }
        .cta p { margin-bottom: 32px; font-size: 18px; }
        
        /* Dashboard */
        .dashboard-layout { min-height: 100vh; }
        .dashboard-main { display: flex; }
        .dashboard-sidebar { 
            width: 250px; 
            background: #f8f9fa; 
            border-right: 1px solid #e1e5e9; 
            min-height: calc(100vh - 60px); 
        }
        .sidebar-nav ul { list-style: none; padding: 16px 0; }
        .sidebar-nav li a { 
            display: block; 
            padding: 12px 24px; 
            text-decoration: none; 
            color: #605e5c; 
        }
        .sidebar-nav li a:hover, .sidebar-nav li a.active { 
            background: #e1e5e9; 
            color: #323130; 
        }
        .dashboard-content { flex: 1; padding: 32px; }
        
        /* Metrics */
        .metrics-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 24px; 
            margin-bottom: 32px; 
        }
        .metric-card { 
            background: white; 
            border: 1px solid #e1e5e9; 
            border-radius: 8px; 
            padding: 24px; 
            text-align: center; 
        }
        .metric-value { font-size: 32px; font-weight: 600; color: #0078d4; margin-top: 8px; }
        
        /* Charts */
        .charts-section { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .chart-card { 
            background: white; 
            border: 1px solid #e1e5e9; 
            border-radius: 8px; 
            padding: 24px; 
        }
        .chart-placeholder { 
            height: 200px; 
            background: #f8f9fa; 
            border: 2px dashed #e1e5e9; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: #605e5c; 
            margin-top: 16px; 
        }
        
        /* Forms */
        .form-container { 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: calc(100vh - 60px); 
            padding: 40px 20px; 
        }
        .form-card { 
            background: white; 
            border: 1px solid #e1e5e9; 
            border-radius: 8px; 
            padding: 40px; 
            width: 100%; 
            max-width: 500px; 
        }
        .form-group { margin-bottom: 24px; }
        .form-group label { 
            display: block; 
            margin-bottom: 8px; 
            font-weight: 500; 
            color: #323130; 
        }
        .form-control { 
            width: 100%; 
            padding: 8px 12px; 
            border: 1px solid #e1e5e9; 
            border-radius: 4px; 
            font-size: 14px; 
        }
        .form-control:focus { 
            outline: none; 
            border-color: #0078d4; 
            box-shadow: 0 0 0 1px #0078d4; 
        }
        .form-actions { display: flex; gap: 12px; justify-content: flex-end; }
        
        /* Modal */
        .modal { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background: rgba(0, 0, 0, 0.5); 
            display: flex; 
            align-items: center; 
            justify-content: center; 
        }
        .modal-content { 
            background: white; 
            border-radius: 8px; 
            width: 90%; 
            max-width: 500px; 
        }
        .modal-header { 
            padding: 24px 24px 0; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
        }
        .modal-close { 
            background: none; 
            border: none; 
            font-size: 24px; 
            cursor: pointer; 
            color: #605e5c; 
        }
        .modal-body { padding: 24px; }
        .modal-footer { 
            padding: 0 24px 24px; 
            display: flex; 
            gap: 12px; 
            justify-content: flex-end; 
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .hero h1 { font-size: 32px; }
            .hero p { font-size: 16px; }
            .dashboard-main { flex-direction: column; }
            .dashboard-sidebar { width: 100%; }
            .charts-section { grid-template-columns: 1fr; }
            .metrics-grid { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
        }
    </style>
    `;
  }

  /**
   * Apply styles and theming to wireframe
   */
  applyWireframeStyles(html, options = {}) {
    const theme = options.theme || "default";
    const colorScheme = options.colorScheme || "primary";

    // Add theme-specific classes or styles if needed
    if (theme === "dark") {
      html = html.replace("<body>", '<body class="theme-dark">');
    }

    return html;
  }

  /**
   * Estimate wireframe complexity
   */
  estimateComplexity(components) {
    const complexityScores = {
      button: 1,
      navigation: 2,
      modal: 3,
      form: 3,
      table: 4,
      chart: 5,
    };

    const totalScore = components.reduce((sum, component) => {
      return sum + (complexityScores[component] || 2);
    }, 0);

    if (totalScore <= 3) return "low";
    if (totalScore <= 8) return "medium";
    return "high";
  }

  /**
   * Generate basic modal fallback
   */
  generateBasicModal() {
    return `
    <div class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Modal Title</h3>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p>This is a basic modal generated from your component library.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary">Confirm</button>
          <button class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
    `;
  }

  /**
   * Get available component types
   */
  getAvailableComponentTypes() {
    const types = new Set();
    for (const component of this.componentLibrary.values()) {
      types.add(component.type);
    }
    return Array.from(types);
  }

  /**
   * Get component statistics
   */
  getComponentStatistics() {
    const stats = {
      total: this.componentLibrary.size,
      byType: {},
      byComplexity: {},
    };

    for (const component of this.componentLibrary.values()) {
      stats.byType[component.type] = (stats.byType[component.type] || 0) + 1;
      stats.byComplexity[component.complexity] =
        (stats.byComplexity[component.complexity] || 0) + 1;
    }

    return stats;
  }
}

module.exports = ComponentDrivenWireframeGenerator;
