#!/bin/bash

# Batch color replacement script
# Replace old Microsoft colors with new neutral palette

echo "🎨 Fixing colors across frontend CSS files..."

# Define color mappings
declare -A color_map=(
    ["#f8f9fa"]="#E9ECEF"    # Light background
    ["#F8F9FA"]="#E9ECEF"    # Light background (uppercase)
    ["#dee2e6"]="#CBC2C2"    # Medium background
    ["#DEE2E6"]="#CBC2C2"    # Medium background (uppercase)
    ["#6c757d"]="#68769C"    # Secondary color
    ["#6C757D"]="#68769C"    # Secondary color (uppercase)
    ["#5a6268"]="#3C4858"    # Dark accent
    ["#5A6268"]="#3C4858"    # Dark accent (uppercase)
    ["#212529"]="#3C4858"    # Text/dark color
    ["#495057"]="#3C4858"    # Text color
)

# Find all CSS files in src directory
find src -name "*.css" -type f | while read file; do
    echo "Processing: $file"
    
    # Apply color replacements
    for old_color in "${!color_map[@]}"; do
        new_color="${color_map[$old_color]}"
        sed -i '' "s/$old_color/$new_color/g" "$file"
    done
done

echo "✅ Color replacement complete!"
echo "🔄 Please refresh your browser to see changes."