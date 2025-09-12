# Centralized Color Management System for Designetica

## Overview

All wireframe colors are now managed centrally in `/backend/config/colors.js`. This eliminates the problem of having colors scattered across multiple files and makes changing the entire color scheme as simple as editing one file.

## File Structure

```
/backend/config/colors.js      # ✅ SINGLE SOURCE OF TRUTH for all colors
├── WIREFRAME_COLORS          # Main color palette
├── SEMANTIC_COLORS          # Success, warning, error colors
├── DEPRECATED_COLORS        # Old colors to avoid
└── ColorUtils               # Utility functions
```

## How It Works

### Before (scattered colors):

- `fallback-generator.js`: `primary: "#8E9AAF"`
- `HeroGenerator.js`: `backgroundColor = "#E9ECEF"`
- `generateWireframe/index.js`: `color: #8E9AAF`
- `simple-server.cjs`: `main: "#8E9AAF"`
- And 50+ other hardcoded color references...

### After (centralized):

- All files import: `const { WIREFRAME_COLORS } = require('./config/colors')`
- All colors use: `WIREFRAME_COLORS.primary` instead of `"#8E9AAF"`
- Change the palette once in `colors.js` → updates everywhere automatically

## Current Color Palette

```javascript
WIREFRAME_COLORS = {
  // Primary neutral palette
  primary: "#8E9AAF", // Medium blue-gray - main accent
  secondary: "#68769C", // Darker blue-gray - secondary actions
  accent: "#3C4858", // Dark slate gray - strong accents
  light: "#E9ECEF", // Very light gray - backgrounds, cards
  medium: "#CBC2C2", // Light warm gray - subtle surfaces
  dark: "#3C4858", // Dark slate gray - text, headers

  // UI Elements
  text: "#3C4858", // Primary text color
  textSecondary: "#8E9AAF", // Secondary text color
  border: "#E9ECEF", // Border color
  background: "#FFFFFF", // Main background
  surface: "#E9ECEF", // Card/surface backgrounds

  // Buttons & States
  buttonPrimary: "#8E9AAF",
  buttonSecondary: "#68769C",
  hover: "#68769C",
  active: "#3C4858",
  disabled: "#CBC2C2",
};
```

## How to Change Colors

### To change the entire color scheme:

1. Edit `/backend/config/colors.js`
2. Modify the `WIREFRAME_COLORS` object
3. All wireframe generation will automatically use the new colors

### Example: Change to a blue theme

```javascript
// In /backend/config/colors.js
const WIREFRAME_COLORS = {
  primary: "#2563eb", // Blue
  secondary: "#1d4ed8", // Darker blue
  accent: "#1e40af", // Dark blue
  light: "#dbeafe", // Light blue
  // ... etc
};
```

## Files Using Centralized Colors

### ✅ Updated Files (using centralized colors):

- `/backend/config/colors.js` - Color definitions
- `/backend/fallback-generator.js` - Template-based generation
- `/backend/HeroGenerator.js` - Hero section generation
- `/backend/generateWireframe/index.js` - Standard wireframe generation
- `/backend/generateWireframe/minimal-wireframe-generator.js` - AI-powered generation
- `/backend/generateWireframeEnhanced/index.js` - Enhanced wireframe generation
- `/backend/simple-server.cjs` - Main server with intelligent fallback

### 🔍 Files to Check (may still have hardcoded colors):

- Other component generators in `/backend/components/`
- Template files in `/backend/templates/`
- Test files in `/backend/test*/`

## Utility Functions

The `ColorUtils` object provides helpful functions:

```javascript
// Get color with opacity
ColorUtils.withOpacity("#8E9AAF", 0.5); // "rgba(142, 154, 175, 0.5)"

// Get color scheme for specific context
ColorUtils.getColorScheme("hero"); // Returns hero-specific colors

// Generate CSS custom properties
ColorUtils.toCSSCustomProperties(); // Returns CSS :root variables

// Validate colors
ColorUtils.isApprovedColor("#8E9AAF"); // true
ColorUtils.isApprovedColor("#6c757d"); // false (deprecated)

// Get suggested replacement
ColorUtils.getSuggestedReplacement("#6c757d"); // "#68769C"
```

## Benefits

### ✅ Single Source of Truth

- All colors in one place
- No more hunting through files to change colors
- Guaranteed consistency across all wireframes

### ✅ Easy Maintenance

- Change entire theme in 30 seconds
- No risk of missing color references
- Clear documentation of color purpose

### ✅ Type Safety & Validation

- Utility functions to validate approved colors
- Suggestions for deprecated color replacements
- Prevents accidentally using old Microsoft branded colors

### ✅ Developer Experience

- Clear color naming (`.primary` vs `#8E9AAF`)
- Context-specific color schemes (hero, button, card)
- CSS custom property generation

## Migration Status

### ✅ Phase 1: Core Generation (COMPLETE)

- Centralized color definitions
- Updated main wireframe generation files
- Eliminated scattered color references

### 🚧 Phase 2: Component Library (IN PROGRESS)

- Update individual component generators
- Template system color integration
- Test file color cleanup

### 📋 Phase 3: Advanced Features (PLANNED)

- Theme switching (light/dark modes)
- Brand-specific color schemes
- Dynamic color generation

## Quick Commands

### Find remaining hardcoded colors:

```bash
grep -r "#[0-9a-f]\{6\}" backend/ --exclude-dir=node_modules
```

### Test color changes:

```bash
cd backend && node -e "
const { WIREFRAME_COLORS } = require('./config/colors');
console.log('Current primary color:', WIREFRAME_COLORS.primary);
"
```

## Next Steps

1. **Complete Migration**: Check remaining files for hardcoded colors
2. **Add Themes**: Create multiple color schemes (corporate, creative, minimal)
3. **Visual Testing**: Generate test wireframes to verify color consistency
4. **Documentation**: Add color usage guidelines for new components

## Support

If you find hardcoded colors that should use the centralized system:

1. Import: `const { WIREFRAME_COLORS } = require('./config/colors')`
2. Replace: `"#8E9AAF"` → `WIREFRAME_COLORS.primary`
3. Test to ensure no breaking changes

The centralized color system makes Designetica much more maintainable and flexible! 🎨
