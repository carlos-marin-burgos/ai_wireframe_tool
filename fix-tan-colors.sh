#!/bin/bash

echo "🎨 Replacing tan colors with neutral palette..."

# Replace the tan colors with neutral equivalents
# #e8e6df / #E8E6DF (tan background) -> #E9ECEF (light neutral)  
# #e8e6de / #E8E6DE (tan border/accent) -> #CBC2C2 (medium neutral)

echo "Replacing #e8e6df with #E9ECEF..."
find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.css" | grep -v node_modules | grep -v .git | while read file; do
    sed -i '' 's/#e8e6df/#E9ECEF/g' "$file"
    sed -i '' 's/#E8E6DF/#E9ECEF/g' "$file"
done

echo "Replacing #e8e6de with #CBC2C2..."
find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.css" | grep -v node_modules | grep -v .git | while read file; do
    sed -i '' 's/#e8e6de/#CBC2C2/g' "$file"
    sed -i '' 's/#E8E6DE/#CBC2C2/g' "$file"
done

echo "✅ Tan color replacement complete!"
echo "🔄 Colors replaced:"
echo "   #e8e6df / #E8E6DF -> #E9ECEF (light neutral)"
echo "   #e8e6de / #E8E6DE -> #CBC2C2 (medium neutral)"