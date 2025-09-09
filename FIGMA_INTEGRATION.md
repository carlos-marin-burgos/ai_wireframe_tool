# 🎨 Figma Design System Integration

## Overview

This project integrates with Figma Design Systems to provide real-time component synchronization for both **Fluent 2** and **Atlas** design libraries.

## 🚀 Features

- **Real-time API Integration**: Automatically fetches components from Figma files
- **Dual Library Support**: Separate libraries for Fluent and Atlas design systems
- **Fallback System**: Mock components when API is unavailable
- **Automatic Categorization**: Components organized by type (Buttons, Navigation, etc.)
- **HTML Generation**: Creates styled HTML previews for each component

## 📁 File Structure

```
scripts/
  └── fetch-figma-components.cjs    # Main fetcher script
public/
  ├── figma-fluent-library.json    # Fluent components
  ├── figma-atlas-library.json     # Atlas components
  └── figma-library.json           # Combined library
src/components/
  └── EnhancedComponentLibrary.tsx  # UI component
```

## 🔑 Setup Instructions

### 1. Get Figma Personal Access Token

1. Go to [Figma Developer Settings](https://www.figma.com/developers/api#access-tokens)
2. Click "Create new personal access token"
3. Name it "Designetica Integration"
4. Copy the generated token

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Figma API Integration
FIGMA_ACCESS_TOKEN=your_figma_token_here
```

Or set as environment variable:

```bash
export FIGMA_ACCESS_TOKEN=your_figma_token_here
```

### 3. Run the Component Fetcher

```bash
# Generate component libraries
node scripts/fetch-figma-components.cjs
```

## 🎯 Figma Files Configuration

### Fluent 2 Design System

- **File ID**: `GvIcCw0tWaJVDSWD4f1OIW`
- **URL**: https://www.figma.com/design/GvIcCw0tWaJVDSWD4f1OIW/Fluent-2-web
- **Library**: `figma-fluent-library.json`

### Atlas Design System

- **File ID**: `PuWj05uKXhfbqrhmJLtCij`
- **URL**: https://www.figma.com/design/PuWj05uKXhfbqrhmJLtCij/Atlas-library-for-designetica
- **Library**: `figma-atlas-library.json`

## 🔧 How It Works

### 1. Component Fetching

The script connects to Figma's REST API to fetch:

- Component definitions and metadata
- Design tokens and styling information
- Component hierarchy and relationships

### 2. Processing Pipeline

1. **Extract**: Parse Figma file structure
2. **Categorize**: Organize components by type
3. **Generate**: Create HTML previews
4. **Save**: Write to JSON libraries

### 3. Fallback System

When API is unavailable:

- Uses predefined mock components
- Maintains UI functionality
- Shows "Fallback" indicators

## 📊 Generated Libraries

### Library Structure

```json
{
  "version": "1.0.0",
  "name": "Design System Name",
  "figmaFileId": "file_id",
  "apiEnabled": true,
  "categories": ["Buttons", "Navigation", "Content"],
  "components": [
    {
      "id": "unique-component-id",
      "name": "Component Name",
      "description": "Component description",
      "category": "Buttons",
      "source": "figma-fluent",
      "playbook": "Figma Design System",
      "sourceUrl": "https://figma.com/...",
      "htmlCode": "<div>...</div>"
    }
  ]
}
```

## 🎨 Component Categories

- **Buttons**: Primary, Secondary, Tertiary actions
- **Navigation**: Menus, breadcrumbs, tabs
- **Content**: Cards, lists, typography
- **Forms**: Inputs, dropdowns, checkboxes
- **Feedback**: Alerts, notifications, progress
- **Layout**: Grids, containers, dividers

## 🔄 Updating Components

### Manual Update

```bash
node scripts/fetch-figma-components.cjs
```

### Automated Updates

Add to your CI/CD pipeline:

```yaml
- name: Update Figma Components
  run: |
    export FIGMA_ACCESS_TOKEN=${{ secrets.FIGMA_TOKEN }}
    node scripts/fetch-figma-components.cjs
```

## 🐛 Troubleshooting

### API Token Issues

```bash
# Check token is set
echo $FIGMA_ACCESS_TOKEN

# Test API connection
curl -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/files/GvIcCw0tWaJVDSWD4f1OIW"
```

### Common Errors

- **401 Unauthorized**: Invalid or missing token
- **403 Forbidden**: No access to Figma file
- **Rate Limited**: Too many API calls (wait and retry)

### Debug Mode

Enable verbose logging:

```bash
DEBUG=1 node scripts/fetch-figma-components.cjs
```

## 📈 Usage Statistics

The Enhanced Component Library tracks:

- Component usage counts
- Popular categories
- Source preferences (Fluent vs Atlas vs Figma)
- Playbook engagement

## 🚀 Next Steps

1. Set up Figma API token
2. Run the fetcher script
3. Explore components in the Enhanced Component Library
4. Customize component categories as needed
5. Set up automated updates

## 📞 Support

For issues with Figma integration:

1. Check the console for error messages
2. Verify API token permissions
3. Ensure Figma files are accessible
4. Review the generated library files

---

_Last updated: January 2025_
