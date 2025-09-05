# 🎨 Figma Component Integration System

Complete integration of the Lookscout Low-Fi Wireframe Kit into Designetica's wireframe system.

## 📦 What's Included

### ✅ Imported Component Sections

- **Hero Sections** (225KB) - Complete hero layouts with CTAs and headlines
- **Forms** (180KB) - Input fields, dropdowns, checkboxes, and form layouts
- **Navigation** (123KB) - Desktop navigation bars and menu components
- **Page Headers** (84KB) - Page titles, breadcrumbs, and header sections
- **Call to Actions** (149KB) - Buttons, CTAs, and promotional sections
- **Mobile Navigation** (16KB) - Mobile-optimized navigation patterns

### 🔧 Integration Tools

- **Component Library Interface** (`component-library.html`) - Browse and preview all components
- **Integration Helper Class** (`src/figma-component-integrator.js`) - Programmatic integration
- **Live Demo** (`figma-integration-demo.html`) - Interactive integration demonstration
- **API Endpoint** (`/api/figma-wireframe-import`) - Real-time component importing

## 🚀 Quick Start

### 1. Browse Components

Open the **Component Library Interface**:

```
http://localhost:5173/component-library.html
```

Features:

- **Visual Preview** - See all components rendered
- **Search & Filter** - Find components by category or keywords
- **Copy Node IDs** - Quick access to Figma node identifiers
- **Integration Code** - Generated code snippets for each component

### 2. Live Integration Demo

Experience real-time integration:

```
http://localhost:5173/figma-integration-demo.html
```

Try these actions:

- **Create Full Landing Page** - Automatically adds navigation + hero + CTA
- **Add Individual Components** - Hero, navigation, forms, or CTAs
- **View Integration Log** - See real-time integration feedback

### 3. Programmatic Integration

```javascript
import { FigmaComponentIntegrator } from "./src/figma-component-integrator.js";

const integrator = new FigmaComponentIntegrator();
const container = document.getElementById("wireframe-container");

// Quick methods
await integrator.addHeroSection(container);
await integrator.addNavigationBar(container);
await integrator.addFormSection(container);

// Full layout
await integrator.createLandingPageLayout(container);

// Custom integration
const heroSection = await integrator.getComponentSection("hero");
integrator.integrateComponent(container, heroSection.html, {
  position: "prepend",
  wrapInContainer: true,
  addSpacing: true,
});
```

### 4. API Integration

Import components in real-time:

```javascript
// Import fresh from Figma
const response = await fetch("/api/figma-wireframe-import", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    nodeIds: "4302:1228097", // Hero sections
    preserveText: true,
    inlineCss: true,
    wrapRoot: true,
  }),
});

const result = await response.json();
const wireframeHTML = result.html;
```

## 📁 File Structure

```
designetica/
├── component-library.html              # Component browser interface
├── figma-integration-demo.html         # Live integration demo
├── component-library-manifest.json     # Component metadata
├── src/
│   └── figma-component-integrator.js   # Integration helper class
├── components-*.html                   # Full component HTML files
├── body-*.html                         # Body-only component files
└── backend/
    └── figmaWireframeImport/           # Azure Function for real-time import
        ├── function.json
        └── index.js
```

## 🎯 Integration Methods

### Method 1: Pre-imported Files (Fastest)

```javascript
// Use already imported component files
const heroHTML = await fetch("./body-hero-sections.html").then((r) => r.text());
document.getElementById("container").innerHTML = heroHTML;
```

### Method 2: API Integration (Real-time)

```javascript
// Import fresh from Figma API
const result = await integrator.importFromApi("4302:1228097");
container.innerHTML = result.html;
```

### Method 3: Integration Helper (Recommended)

```javascript
// Use the helper class for smart integration
await integrator.addHeroSection(container);
```

## 🎨 Component Categories

| Category              | Node ID        | Size  | Description                      |
| --------------------- | -------------- | ----- | -------------------------------- |
| **Hero Sections**     | `4302:1228097` | 225KB | Landing page heroes with CTAs    |
| **Forms**             | `4303:636742`  | 180KB | Input fields and form layouts    |
| **Navigation**        | `4302:1142033` | 123KB | Desktop navigation components    |
| **Page Headers**      | `3312:105535`  | 84KB  | Page titles and breadcrumbs      |
| **Call to Actions**   | `4302:1373485` | 149KB | Buttons and promotional sections |
| **Mobile Navigation** | `4302:1085774` | 16KB  | Mobile navigation patterns       |

## 🔧 Advanced Features

### Custom Component Extraction

```javascript
// Extract individual components from a section
const section = await integrator.getComponentSection("forms");
const components = integrator.extractComponents(section.html);

components.forEach((component) => {
  console.log(`Component: ${component.type}, ID: ${component.id}`);
});
```

### Event-Based Integration

```javascript
// Listen for integration events
container.addEventListener("figmaComponentIntegrated", (event) => {
  console.log("Component integrated:", event.detail);
});
```

### Search and Discovery

```javascript
// Search available components
const searchResults = integrator.searchComponents("navigation");
const availableSections = integrator.getAvailableSections();
```

## 🎛️ Configuration Options

When importing components, you can customize:

```javascript
{
    preserveText: true,      // Keep actual text content
    inlineCss: true,         // Include embedded CSS
    wrapRoot: true,          // Wrap in container div
    position: 'append',      // append | prepend | replace
    wrapInContainer: true,   // Add wrapper div
    addSpacing: true         // Add margin spacing
}
```

## 🔄 Updating Components

To refresh components with latest Figma changes:

```javascript
// Re-import a specific section
const freshHero = await integrator.importFromApi('4302:1228097', {
    preserveText: true
});

// Or run the import script again
node import-component-library.js
```

## 🌟 Best Practices

1. **Use the Integration Helper** - Provides consistent styling and spacing
2. **Cache Pre-imported Files** - Faster than real-time API calls
3. **Combine Components Thoughtfully** - Navigation + Hero + CTA works well
4. **Test Mobile Responsiveness** - Use mobile navigation for smaller screens
5. **Monitor Integration Events** - Track component additions for analytics

## 🆘 Troubleshooting

### Component Not Loading

```javascript
// Check if component exists
const sections = integrator.getAvailableSections();
console.log("Available sections:", sections);
```

### API Import Failing

```javascript
// Fallback to pre-imported files
try {
  await integrator.importFromApi(nodeId);
} catch (error) {
  const fallback = await fetch("./body-hero-sections.html").then((r) =>
    r.text()
  );
  container.innerHTML = fallback;
}
```

### CSS Conflicts

- Components include scoped CSS classes
- Use `inlineCss: false` to exclude embedded styles
- Custom CSS can override wireframe styles

## 📊 Performance

- **Pre-imported files**: ~776KB total, instant loading
- **API imports**: 2-5s depending on component complexity
- **Component library**: Optimized for browsing 6 sections
- **Integration helper**: Minimal overhead, event-driven

---

🎉 **Your Figma wireframe components are now fully integrated and ready to use!**
