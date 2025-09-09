# Atlas Learning Path & Module Card - Smart Component System

## Overview

We've successfully enhanced the Atlas Design Library integration to support both **Learning Paths** and **Modules** using the same Figma component design. This smart approach provides consistency while allowing for contextual usage.

## Component Details

### Figma Source

- **File ID**: `uVA2amRR71yJZ0GS6RI6zL` (Atlas Design Library)
- **Node ID**: `14315:162386` (Learning Path Card component)
- **Image URL**: `https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e84821f9-29a4-4997-a8fe-674d906f613b`

## Smart Implementation

### 1. Dual Component Mapping

The system now supports two component types that use the same visual design:

```javascript
// Learning Path Card
this.atlasComponentMap.set("atlas-learning-path-card", {
  nodeId: "14315:162386",
  name: "Atlas/Learning Path Card",
  description: "Atlas learning path card component for educational content",
  props: [
    "title",
    "description",
    "progress",
    "duration",
    "modules",
    "status",
    "thumbnail",
  ],
});

// Module Card (same design, different purpose)
this.atlasComponentMap.set("atlas-module-card", {
  nodeId: "14315:162386", // Same Figma component
  name: "Atlas/Module Card",
  description: "Atlas module card component for individual learning modules",
  props: [
    "title",
    "description",
    "duration",
    "difficulty",
    "progress",
    "status",
    "thumbnail",
  ],
});
```

### 2. Enhanced Switch Case Resolution

The system intelligently detects different naming patterns:

```javascript
// Learning Path variants
case "learning-path-card":
case "learningpathcard":
case "learning_path_card":
  return await this.generateAtlasLearningPathCardFromFigma(component.nodeId, { type: "learning-path" });

// Module variants
case "module-card":
case "modulecard":
case "module_card":
case "learning-module":
case "learningmodule":
case "learning_module":
  return await this.generateAtlasLearningPathCardFromFigma(component.nodeId || "14315:162386", { type: "module" });
```

### 3. Context-Aware Generation

The enhanced generation method adapts based on the component type:

```javascript
async generateAtlasLearningPathCardFromFigma(nodeId, options = {}) {
  const { type = "learning-path" } = options;
  const isModule = type === "module";

  // Generates appropriate labels, classes, and metadata
  const componentLabel = isModule ? "Module Card" : "Learning Path Card";
  const altText = `Atlas ${componentLabel} Component from Figma`;

  // Applies correct CSS classes and data attributes
  return `<div class="atlas-component ${isModule ? 'atlas-module-card-figma' : 'atlas-learning-path-card-figma'}"
               data-node-id="${nodeId}"
               data-type="${type}">`;
}
```

## Component Library Integration

Both components are available in the Component Library:

### Atlas Learning Path Card

- **ID**: `atlas-learning-path-card`
- **Category**: Cards
- **Library**: Atlas
- **Use Case**: Complete learning journeys with multiple modules

### Atlas Module Card

- **ID**: `atlas-module-card`
- **Category**: Cards
- **Library**: Atlas
- **Use Case**: Individual learning modules within a path

## Smart Wireframe Generation

When generating wireframes, the system can intelligently choose the appropriate card type:

### Automatic Detection

- **"Learning Path"** → Uses Learning Path Card
- **"Module"**, **"Learning Module"** → Uses Module Card
- **Context-aware**: Detects from component names and descriptions

### Benefits

1. **Visual Consistency**: Same professional Figma design for both
2. **Semantic Clarity**: Proper labeling and metadata for each type
3. **Flexible Usage**: Can be used interchangeably based on context
4. **Developer Friendly**: Clear CSS classes and data attributes

## Technical Implementation

### CSS Classes Generated

```css
/* Learning Path */
.atlas-learning-path-card-figma[data-type="learning-path"]

/* Module */
.atlas-module-card-figma[data-type="module"];
```

### Data Attributes

```html
<div
  data-figma-node="14315:162386"
  data-figma-file="uVA2amRR71yJZ0GS6RI6zL"
  data-type="learning-path|module"
></div>
```

## Usage Examples

### In Wireframes

```javascript
// Automatically detects and uses appropriate card
"Create a learning path for Azure Fundamentals" → Learning Path Card
"Add a module about Azure Storage" → Module Card
"Show the Introduction to Cloud Computing module" → Module Card
```

### In Component Library

```javascript
// Explicit selection
addComponent("atlas-learning-path-card"); // For learning paths
addComponent("atlas-module-card"); // For individual modules
```

## Conclusion

This smart implementation provides:

- ✅ **Pixel-perfect design** from your Figma Atlas Design Library
- ✅ **Flexible usage** for both Learning Paths and Modules
- ✅ **Responsive width** (100% width, not fixed)
- ✅ **Intelligent detection** in wireframe generation
- ✅ **Semantic accuracy** with proper labeling and metadata

The system is now ready to automatically use the appropriate card type when generating wireframes for Microsoft Learn content!
