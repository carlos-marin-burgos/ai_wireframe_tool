# Microsoft Learn Template System

## Overview

This system prevents template corruption by separating HTML templates from JavaScript code. Templates are stored as separate `.html` files and loaded dynamically by the `TemplateManager`.

## Architecture

```
backend/
├── templates/                    # Template files directory
│   ├── microsoft-docs.html      # Microsoft Docs template
│   ├── microsoft-learn-home.html # Microsoft Learn home template
│   └── [your-template].html     # Additional templates
├── template-manager.js          # Template loading and rendering logic
├── fallback-generator.js        # Simplified wireframe generator
└── create-template.sh           # Script to create new templates
```

## Key Components

### 1. TemplateManager Class

- **Purpose**: Loads, caches, and renders HTML templates
- **Features**:
  - Template caching for performance
  - Variable substitution with `{{variable}}` syntax
  - Error handling and fallbacks
  - Template discovery

### 2. Template Selection Logic

- Moved from inline code to `template-manager.js`
- Easy to modify without risking file corruption
- Centralized condition management

### 3. Template Files

- Pure HTML with CSS styling
- Use `{{variable}}` placeholders for dynamic content
- No embedded JavaScript to prevent corruption

## Benefits

### ✅ Prevents Corruption

- **Before**: Massive HTML strings embedded in JavaScript
- **After**: Clean separation of concerns
- **Result**: No more syntax errors from broken templates

### ✅ Easy Maintenance

- **Before**: Edit complex nested strings in JavaScript
- **After**: Edit clean HTML files with proper syntax highlighting
- **Result**: Faster development and fewer errors

### ✅ Simple Template Addition

- **Before**: Manual code changes with risk of breaking existing templates
- **After**: Run `./create-template.sh` script
- **Result**: Zero-risk template creation

### ✅ Dynamic Loading

- Templates loaded on-demand
- Automatic caching for performance
- No server restarts required

## How to Add New Templates

### Method 1: Using the Script (Recommended)

```bash
cd backend
./create-template.sh
```

Follow the prompts to:

1. Enter template name
2. Define trigger conditions
3. Add description
4. Script creates template file and updates conditions

### Method 2: Manual Creation

1. **Create Template File**

   ```bash
   touch templates/my-new-template.html
   ```

2. **Add Template Content**

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <title>{{title}} - Microsoft Learn</title>
       <!-- Add your styles -->
     </head>
     <body>
       <h1>{{title}}</h1>
       <!-- Add your content -->
     </body>
   </html>
   ```

3. **Update template-manager.js**
   ```javascript
   const TEMPLATE_CONDITIONS = {
     'microsoft-docs': [...],
     'microsoft-learn-home': [...],
     'my-new-template': [
       'my condition',
       'another condition'
     ]
   };
   ```

## Template Variables

All templates have access to these variables:

- `{{title}}` - The description/title from the request
- `{{primaryColor}}` - The primary color (e.g., "#0078d4")
- `{{colorScheme}}` - The color scheme name (e.g., "primary")

## Template Conditions

Templates are selected based on description matching. The system checks conditions in order:

```javascript
const TEMPLATE_CONDITIONS = {
  "microsoft-docs": [
    "learn doc template",
    "doc template",
    "documentation",
    "docs template",
    "microsoft docs",
    "learn docs",
  ],
  "microsoft-learn-home": [
    "hero",
    "landing",
    "home",
    "banner",
    "header",
    "welcome",
    "learn home page",
  ],
};
```

## Testing Templates

Test your templates using curl:

```bash
# Test Microsoft Docs template
curl -X POST http://localhost:7071/api/generate-html-wireframe \
  -H "Content-Type: application/json" \
  -d '{"description": "documentation example", "designTheme": "microsoftlearn"}'

# Test Microsoft Learn Home template
curl -X POST http://localhost:7071/api/generate-html-wireframe \
  -H "Content-Type: application/json" \
  -d '{"description": "hero section example", "designTheme": "microsoftlearn"}'
```

## Debugging

The system provides detailed logging:

```javascript
console.log("🎯 Selected template:", templateName);
console.log("📄 Loaded template:", templateName);
console.log("✅ Rendered template:", templateName);
```

Check the Azure Functions logs to see which template was selected and why.

## Migration from Old System

The old system had templates embedded as strings in `fallback-generator.js`. The new system:

1. ✅ Extracted templates to separate files
2. ✅ Implemented template manager
3. ✅ Created automated template creation
4. ✅ Added comprehensive error handling
5. ✅ Maintained backward compatibility

## Best Practices

### Template Design

- Use semantic HTML
- Include responsive CSS
- Follow Microsoft design guidelines
- Use consistent class naming

### Template Conditions

- Make conditions specific enough to avoid conflicts
- Use descriptive condition names
- Test condition matching thoroughly

### Template Variables

- Always include fallback values
- Escape user input if needed
- Use meaningful variable names

## Troubleshooting

### Template Not Loading

- Check file exists in `templates/` directory
- Verify file permissions
- Check for syntax errors in HTML

### Wrong Template Selected

- Review condition matching in logs
- Check condition order (first match wins)
- Verify condition strings are correct

### Template Rendering Issues

- Check variable substitution syntax
- Verify template file encoding (UTF-8)
- Test with simple template first

## Future Enhancements

Possible improvements:

- Template inheritance/extends
- More template variables
- Template validation
- Visual template editor
- Template preview system
