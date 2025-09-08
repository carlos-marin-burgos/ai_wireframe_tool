// Microsoft Fluent Web Community Library Integration
// Source: https://www.figma.com/design/O0op6M91bjezREayRT2LZI/Microsoft-Fluent-1-Web--Community-

const fluentCommunityLibrary = {
  // Library configuration
  figmaFileId: "O0op6M91bjezREayRT2LZI",
  baseNodeId: "8664-6959",
  libraryName: "Microsoft Fluent 1 Web - Community",

  // Component categories and their node IDs (to be populated from actual Figma inspection)
  components: {
    // Navigation Components
    navigation: {
      primaryNav: "8664-6959", // Main navigation bar
      breadcrumb: "8664-6960", // Breadcrumb navigation
      sideNav: "8664-6961", // Side navigation panel
      tabNav: "8664-6962", // Tab navigation
    },

    // Layout Components
    layout: {
      pageHeader: "8664-6970", // Page header with title and actions
      contentArea: "8664-6971", // Main content container
      sidebar: "8664-6972", // Sidebar layout
      footer: "8664-6973", // Page footer
    },

    // Interactive Components
    buttons: {
      primary: "8664-6980", // Primary action button
      secondary: "8664-6981", // Secondary action button
      ghost: "8664-6982", // Ghost/outline button
      iconButton: "8664-6983", // Icon-only button
    },

    // Form Components
    forms: {
      textInput: "8664-6990", // Text input field
      dropdown: "8664-6991", // Dropdown/select
      checkbox: "8664-6992", // Checkbox
      radio: "8664-6993", // Radio button
      searchBox: "8664-6994", // Search input
    },

    // Data Display
    cards: {
      basic: "8664-7000", // Basic card component
      withActions: "8664-7001", // Card with action buttons
      media: "8664-7002", // Card with media/image
      compact: "8664-7003", // Compact card variant
    },

    // Feedback & Communication
    feedback: {
      messageBar: "8664-7010", // Information/warning/error bar
      tooltip: "8664-7011", // Tooltip component
      modal: "8664-7012", // Modal dialog
      notification: "8664-7013", // Toast notification
    },
  },

  // Component style variants
  variants: {
    themes: ["light", "dark"],
    sizes: ["small", "medium", "large"],
    states: ["default", "hover", "active", "disabled"],
  },
};

// Generate HTML using Fluent Community components
function generateFluentWireframeHTML(description, componentPreferences = {}) {
  const {
    useNavigation = true,
    useCards = true,
    useForms = false,
    layout = "standard",
    theme = "light",
  } = componentPreferences;

  let html = `<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microsoft Learn - ${description}</title>
    
    <!-- Fluent UI Web Components -->
    <script type="module" src="https://unpkg.com/@fluentui/web-components"></script>
    
    <!-- Microsoft Fluent Design System Styles -->
    <style>
        /* Fluent Design System Base */
        :root {
            --fluent-neutral-foreground-1: #242424;
            --fluent-neutral-background-1: #ffffff;
            --fluent-neutral-background-2: #fafafa;
            --fluent-neutral-stroke-1: #e1e1e1;
            --fluent-accent-foreground-1: #0078d4;
            --fluent-accent-background-1: #0078d4;
        }
        
        [data-theme="dark"] {
            --fluent-neutral-foreground-1: #ffffff;
            --fluent-neutral-background-1: #1f1f1f;
            --fluent-neutral-background-2: #2d2d2d;
            --fluent-neutral-stroke-1: #454545;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            background: var(--fluent-neutral-background-1);
            color: var(--fluent-neutral-foreground-1);
            line-height: 1.5;
        }
        
        /* Layout Grid */
        .fluent-layout {
            display: grid;
            min-height: 100vh;
            grid-template-rows: auto 1fr auto;
            grid-template-areas: 
                "header"
                "main"
                "footer";
        }
        
        .fluent-header {
            grid-area: header;
            background: var(--fluent-neutral-background-2);
            border-bottom: 1px solid var(--fluent-neutral-stroke-1);
            padding: 0 24px;
        }
        
        .fluent-main {
            grid-area: main;
            padding: 24px;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
        }
        
        .fluent-footer {
            grid-area: footer;
            background: var(--fluent-neutral-background-2);
            border-top: 1px solid var(--fluent-neutral-stroke-1);
            padding: 16px 24px;
            text-align: center;
        }
        
        /* Navigation Styles */
        .fluent-nav {
            display: flex;
            align-items: center;
            height: 64px;
            gap: 24px;
        }
        
        .fluent-nav-brand {
            font-weight: 600;
            font-size: 18px;
            color: var(--fluent-accent-foreground-1);
        }
        
        .fluent-nav-links {
            display: flex;
            gap: 16px;
            margin-left: auto;
        }
        
        /* Card Components */
        .fluent-card {
            background: var(--fluent-neutral-background-1);
            border: 1px solid var(--fluent-neutral-stroke-1);
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 16px;
        }
        
        .fluent-card-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 12px;
        }
        
        .fluent-card-content {
            margin-bottom: 16px;
        }
        
        .fluent-card-actions {
            display: flex;
            gap: 12px;
            margin-top: 16px;
        }
        
        /* Grid Layout for Cards */
        .fluent-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .fluent-main {
                padding: 16px;
            }
            
            .fluent-nav {
                height: 56px;
                padding: 0 16px;
            }
            
            .fluent-nav-links {
                display: none;
            }
            
            .fluent-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="fluent-layout">`;

  // Add navigation if requested
  if (useNavigation) {
    html += `
        <header class="fluent-header">
            <nav class="fluent-nav">
                <div class="fluent-nav-brand">Microsoft Learn</div>
                <div class="fluent-nav-links">
                    <fluent-anchor href="#learn">Learn</fluent-anchor>
                    <fluent-anchor href="#docs">Documentation</fluent-anchor>
                    <fluent-anchor href="#community">Community</fluent-anchor>
                </div>
                <fluent-button appearance="primary">Sign In</fluent-button>
            </nav>
        </header>`;
  }

  // Main content area
  html += `
        <main class="fluent-main">
            <div class="fluent-card">
                <h1 class="fluent-card-title">${description}</h1>
                <div class="fluent-card-content">
                    <p>This wireframe demonstrates Microsoft Fluent Design components from the community library.</p>
                </div>
            </div>`;

  // Add cards if requested
  if (useCards) {
    html += `
            <div class="fluent-grid">
                <div class="fluent-card">
                    <h2 class="fluent-card-title">Getting Started</h2>
                    <div class="fluent-card-content">
                        <p>Begin your learning journey with our comprehensive guides and tutorials.</p>
                    </div>
                    <div class="fluent-card-actions">
                        <fluent-button appearance="primary">Start Learning</fluent-button>
                        <fluent-button appearance="secondary">Browse Topics</fluent-button>
                    </div>
                </div>
                
                <div class="fluent-card">
                    <h2 class="fluent-card-title">Documentation</h2>
                    <div class="fluent-card-content">
                        <p>Access detailed documentation and API references for all Microsoft products.</p>
                    </div>
                    <div class="fluent-card-actions">
                        <fluent-button appearance="primary">View Docs</fluent-button>
                        <fluent-button appearance="secondary">API Reference</fluent-button>
                    </div>
                </div>
                
                <div class="fluent-card">
                    <h2 class="fluent-card-title">Community</h2>
                    <div class="fluent-card-content">
                        <p>Connect with other developers and share your knowledge in our community forums.</p>
                    </div>
                    <div class="fluent-card-actions">
                        <fluent-button appearance="primary">Join Community</fluent-button>
                        <fluent-button appearance="secondary">View Forums</fluent-button>
                    </div>
                </div>
            </div>`;
  }

  // Add forms if requested
  if (useForms) {
    html += `
            <div class="fluent-card">
                <h2 class="fluent-card-title">Search & Filter</h2>
                <div class="fluent-card-content">
                    <fluent-text-field placeholder="Search learning paths..." style="width: 100%; margin-bottom: 16px;"></fluent-text-field>
                    
                    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                        <fluent-select style="min-width: 150px;">
                            <fluent-option value="all">All Topics</fluent-option>
                            <fluent-option value="azure">Azure</fluent-option>
                            <fluent-option value="microsoft365">Microsoft 365</fluent-option>
                            <fluent-option value="powerplatform">Power Platform</fluent-option>
                        </fluent-select>
                        
                        <fluent-select style="min-width: 150px;">
                            <fluent-option value="all">All Levels</fluent-option>
                            <fluent-option value="beginner">Beginner</fluent-option>
                            <fluent-option value="intermediate">Intermediate</fluent-option>
                            <fluent-option value="advanced">Advanced</fluent-option>
                        </fluent-select>
                    </div>
                </div>
                <div class="fluent-card-actions">
                    <fluent-button appearance="primary">Apply Filters</fluent-button>
                    <fluent-button appearance="secondary">Clear All</fluent-button>
                </div>
            </div>`;
  }

  // Close main content and add footer
  html += `
        </main>
        
        <footer class="fluent-footer">
            <p>&copy; 2025 Microsoft Corporation. All rights reserved.</p>
        </footer>
    </div>
    
    <!-- Fluent UI Web Components Initialization -->
    <script>
        // Initialize Fluent Design System
        import { 
            provideFluentDesignSystem, 
            fluentButton, 
            fluentAnchor,
            fluentTextField,
            fluentSelect,
            fluentOption
        } from "https://unpkg.com/@fluentui/web-components";
        
        provideFluentDesignSystem()
            .register(
                fluentButton(),
                fluentAnchor(),
                fluentTextField(),
                fluentSelect(),
                fluentOption()
            );
    </script>
</body>
</html>`;

  return html;
}

// Analyze description to determine appropriate components
function analyzeDescriptionForComponents(description) {
  const analysis = {
    useNavigation: true, // Always include navigation for Microsoft Learn
    useCards: false,
    useForms: false,
    layout: "standard",
    theme: "light",
  };

  const descLower = description.toLowerCase();

  // Check for card-related keywords
  if (
    descLower.includes("card") ||
    descLower.includes("grid") ||
    descLower.includes("dashboard") ||
    descLower.includes("gallery") ||
    descLower.includes("learning path") ||
    descLower.includes("course")
  ) {
    analysis.useCards = true;
  }

  // Check for form-related keywords
  if (
    descLower.includes("search") ||
    descLower.includes("filter") ||
    descLower.includes("form") ||
    descLower.includes("input") ||
    descLower.includes("signup") ||
    descLower.includes("login")
  ) {
    analysis.useForms = true;
  }

  // Determine layout
  if (descLower.includes("sidebar") || descLower.includes("side panel")) {
    analysis.layout = "sidebar";
  } else if (descLower.includes("full width") || descLower.includes("wide")) {
    analysis.layout = "wide";
  }

  // Theme detection
  if (descLower.includes("dark") || descLower.includes("night")) {
    analysis.theme = "dark";
  }

  return analysis;
}

module.exports = {
  fluentCommunityLibrary,
  generateFluentWireframeHTML,
  analyzeDescriptionForComponents,
};
