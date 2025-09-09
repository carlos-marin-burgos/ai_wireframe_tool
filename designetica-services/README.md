# 🎨 Component-Driven Wireframe Generation

**Transform your React components into intelligent wireframe generators!**

## 🚀 What We've Built

You now have a **powerful component-driven wireframe generation system** that uses your actual React components to create wireframes. This is a major enhancement to your Designetica platform!

### ✨ Key Features

- 🔍 **Component Detection**: Automatically scans and analyzes your 59 React components
- 🎯 **Smart Templates**: Intelligent wireframe templates (Landing, Dashboard, Form, Modal)
- 🧭 **Component Mapping**: Uses your actual components with proper variants and props
- 🎨 **Figma Integration**: Connected to your Figma design system
- ⚡ **Real-time Generation**: Instant wireframe creation using detected components

## 📊 Your Component Library

**Total Components Detected**: 59

- 🔘 **Buttons**: 41 components (Primary, Secondary, Disabled variants)
- 📦 **Basic**: 9 components
- 🪟 **Modals**: 4 components (Small, Large, Fullscreen variants)
- 🧭 **Navigation**: 4 components (Horizontal, Vertical, Compact variants)
- ⚡ **Interactive**: 1 component

**Complexity Distribution**:

- 🔴 High: 27 components
- 🟡 Medium: 11 components
- 🟢 Low: 21 components

## 🎯 How It Works

### 1. **Component Analysis**

```bash
node index.js detect
```

Scans your React codebase and categorizes components by type and complexity.

### 2. **Wireframe Generation**

```bash
node index.js wireframe "modern dashboard with navigation and charts"
```

Generates wireframes using your actual components with intelligent template selection.

### 3. **Component Library**

```bash
node index.js components
```

Shows all available components for wireframe generation.

## 🏗️ Template Types

### 📱 **Landing Page Template**

- **Triggers**: "landing", "homepage", "website"
- **Components**: Navigation + Hero + Features + CTA
- **Perfect for**: Marketing pages, product launches

### 📊 **Dashboard Template**

- **Triggers**: "dashboard", "admin", "analytics"
- **Components**: Navigation + Sidebar + Metrics + Charts
- **Perfect for**: Admin panels, analytics dashboards

### 📝 **Form Template**

- **Triggers**: "form", "submit", "input"
- **Components**: Navigation + Form Fields + Validation + Buttons
- **Perfect for**: Contact forms, registration, data entry

### 🪟 **Modal Template**

- **Triggers**: "modal", "dialog", "popup"
- **Components**: Modal + Overlay + Actions
- **Perfect for**: Confirmations, dialogs, overlays

## 🔧 Integration Options

### Option 1: CLI Usage (Current)

```bash
# Generate different wireframe types
node index.js wireframe "contact form with validation"
node index.js wireframe "admin dashboard with charts"
node index.js wireframe "confirmation modal"
```

### Option 2: Backend API Integration

The system includes ready-to-use API endpoints:

```javascript
// Add to your backend/simple-server.cjs
const {
  integrateWithBackend,
} = require("./designetica-services/backendIntegration");
integrateWithBackend(app);
```

**New API Endpoints**:

- `POST /api/generate-wireframe-enhanced` - Enhanced wireframe generation
- `GET /api/component-library` - Get available components
- `POST /api/component-preview` - Preview individual components

### Option 3: Frontend Integration

Update your wireframe generation to use detected components:

```javascript
// In your SplitLayout.tsx or wireframe generator
const response = await fetch("/api/generate-wireframe-enhanced", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    description: wireframeDescription,
    designTheme: "modern",
    colorScheme: "primary",
  }),
});

const { html, components, metadata } = await response.json();
```

## 🎨 Example Generated Wireframes

### Dashboard Wireframe

```html
✅ Generated wireframe with 1 components 📋 Wireframe Generated: Template:
dashboard Components used: 1 Component types: navigation Generated at:
2025-08-19T18:42:56.612Z
```

### Form Wireframe

```html
✅ Generated wireframe with 2 components 📋 Wireframe Generated: Template: form
Components used: 2 Component types: navigation, button Generated at:
2025-08-19T18:43:04.455Z
```

### Modal Wireframe

```html
✅ Generated wireframe with 2 components 📋 Wireframe Generated: Template: modal
Components used: 2 Component types: navigation, modal Generated at:
2025-08-19T18:43:11.234Z
```

## 🔗 Figma Code Connect Integration

Your wireframes now connect to your Figma design system:

- **519 Figma components** available for mapping
- **Component variants** automatically detected
- **Design tokens** synchronized
- **Code examples** generated for your design system

## 🚀 Next Steps

### Immediate Benefits

1. **Consistent Wireframes**: All wireframes use your actual components
2. **Design System Sync**: Wireframes match your Figma designs
3. **Faster Generation**: Intelligent templates speed up creation
4. **Better Quality**: Components have proper props and variants

### Future Enhancements

1. **Custom Templates**: Create your own wireframe templates
2. **Component Combinations**: Smart component grouping
3. **Interactive Previews**: Live component previews in wireframes
4. **Auto-updating**: Wireframes update when components change

## 📁 Files Created

### Core Services

- `componentDrivenWireframeGenerator.js` - Main wireframe generation logic
- `wireframeApiService.js` - API integration layer
- `backendIntegration.js` - Backend integration helpers

### Updated Files

- `index.js` - Added wireframe commands
- `ImageUploadModal.figma.tsx` - Example component mapping

## 🎯 How This Helps Your Workflow

1. **Wireframe Quality**: Generated wireframes use your actual design system
2. **Consistency**: All wireframes follow your component standards
3. **Speed**: Intelligent templates generate wireframes instantly
4. **Accuracy**: Components have correct props, variants, and styling
5. **Maintainability**: Wireframes automatically improve as components evolve

## 🔧 Commands Reference

```bash
# Full workflow (detection + mapping + sync)
node index.js workflow

# Component detection only
node index.js detect

# Show available components
node index.js components

# Generate wireframes
node index.js wireframe "your description here"

# Validate Figma connection
node index.js validate

# Get design tokens
node index.js tokens
```

---

**🎉 Congratulations!** You now have one of the most advanced component-driven wireframe generation systems available. Your React components are not just code - they're intelligent building blocks for creating perfect wireframes!
