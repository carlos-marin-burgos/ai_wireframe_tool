#!/bin/bash

# Template Creator Script
# This script helps you create new Microsoft Learn templates without breaking the system

set -e

echo "🎨 Microsoft Learn Template Creator"
echo "==================================="
echo

# Get template name
read -p "Enter template name (e.g., 'microsoft-tutorial'): " TEMPLATE_NAME

if [[ -z "$TEMPLATE_NAME" ]]; then
    echo "❌ Template name cannot be empty"
    exit 1
fi

TEMPLATE_FILE="./templates/${TEMPLATE_NAME}.html"

# Check if template already exists
if [[ -f "$TEMPLATE_FILE" ]]; then
    echo "⚠️ Template already exists: $TEMPLATE_FILE"
    read -p "Do you want to overwrite it? (y/N): " OVERWRITE
    if [[ "$OVERWRITE" != "y" && "$OVERWRITE" != "Y" ]]; then
        echo "❌ Aborted"
        exit 1
    fi
fi

# Get template conditions
echo
echo "Enter the trigger conditions for this template (one per line, press Enter twice when done):"
echo "Example conditions: 'tutorial', 'step by step', 'guide'"
echo

CONDITIONS=()
while true; do
    read -p "Condition: " CONDITION
    if [[ -z "$CONDITION" ]]; then
        break
    fi
    CONDITIONS+=("$CONDITION")
done

if [[ ${#CONDITIONS[@]} -eq 0 ]]; then
    echo "❌ At least one condition is required"
    exit 1
fi

# Get template description
read -p "Enter a brief description of this template: " DESCRIPTION

# Create the template file
cat > "$TEMPLATE_FILE" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}} - Microsoft Learn</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #F3F2F1;
      color: #323130;
      line-height: 1.6;
    }

    /* Add your custom styles here */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      background: {{primaryColor}};
      color: white;
      padding: 2rem 0;
      text-align: center;
    }

    .main-title {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin: 2rem 0;
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="container">
      <h1 class="main-title">{{title}}</h1>
      <p>Your new Microsoft Learn template</p>
    </div>
  </header>

  <main class="container">
    <div class="content">
      <h2>Welcome to Your New Template</h2>
      <p>This is a starter template for {{title}}. Customize the HTML and CSS to match your design requirements.</p>
      
      <!-- Add your template content here -->
      <p>Template variables available:</p>
      <ul>
        <li><strong>{{title}}</strong> - The page title</li>
        <li><strong>{{primaryColor}}</strong> - The primary color ({{primaryColor}})</li>
        <li><strong>{{colorScheme}}</strong> - The color scheme ({{colorScheme}})</li>
      </ul>
    </div>
  </main>
</body>
</html>
EOF

echo "✅ Created template file: $TEMPLATE_FILE"

# Update template-manager.js with new conditions
TEMP_FILE=$(mktemp)
NODE_SCRIPT=$(cat << 'SCRIPT'
const fs = require('fs');
const path = require('path');

const templateManagerPath = process.argv[2];
const templateName = process.argv[3];
const conditions = process.argv.slice(4);

// Read the current template-manager.js
let content = fs.readFileSync(templateManagerPath, 'utf8');

// Find the TEMPLATE_CONDITIONS object
const conditionsMatch = content.match(/(const TEMPLATE_CONDITIONS = \{[^}]+)\}/s);
if (!conditionsMatch) {
  console.error('❌ Could not find TEMPLATE_CONDITIONS in template-manager.js');
  process.exit(1);
}

// Add the new template conditions
const conditionsStr = conditions.map(c => `    '${c}'`).join(',\n');
const newEntry = `  '${templateName}': [\n${conditionsStr}\n  ]`;

// Insert before the closing brace
const updatedConditions = conditionsMatch[1] + ',\n' + newEntry + '\n}';
const updatedContent = content.replace(conditionsMatch[0], updatedConditions);

// Write back to file
fs.writeFileSync(templateManagerPath, updatedContent);
console.log(`✅ Added template conditions to template-manager.js`);
SCRIPT
)

echo "$NODE_SCRIPT" > "$TEMP_FILE"

# Convert conditions array to arguments
CONDITION_ARGS=()
for condition in "${CONDITIONS[@]}"; do
    CONDITION_ARGS+=("$condition")
done

node "$TEMP_FILE" "./template-manager.js" "$TEMPLATE_NAME" "${CONDITION_ARGS[@]}"
rm "$TEMP_FILE"

echo
echo "🎉 New template created successfully!"
echo "📋 Summary:"
echo "   Template Name: $TEMPLATE_NAME"
echo "   File: $TEMPLATE_FILE"
echo "   Conditions: ${CONDITIONS[*]}"
echo "   Description: $DESCRIPTION"
echo
echo "📝 Next steps:"
echo "1. Edit $TEMPLATE_FILE to customize your template"
echo "2. Test your template by using one of these conditions in a description:"
for condition in "${CONDITIONS[@]}"; do
    echo "   - \"$condition\""
done
echo "3. The template will be automatically loaded and cached by the system"
echo
echo "✨ No server restart required - templates are loaded dynamically!"
