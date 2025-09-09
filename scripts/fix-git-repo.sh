#!/bin/bash

# Script to remove node_modules from Git tracking and optimize repository

echo "🔧 Fixing Git repository - removing node_modules from tracking..."

# Remove node_modules from Git tracking (but keep local files)
echo "Removing node_modules from Git index..."
git rm -r --cached node_modules/ 2>/dev/null || echo "node_modules already removed from index"

# Also remove backend node_modules if it exists
git rm -r --cached backend/node_modules/ 2>/dev/null || echo "backend/node_modules not in index"

# Add all current changes
echo "Adding current changes..."
git add .

# Create a commit
echo "Creating commit to remove node_modules..."
git commit -m "Remove node_modules from Git tracking

- Remove node_modules/ from Git index
- Keep .gitignore rules to prevent future tracking
- Optimize repository size"

echo "✅ Repository optimized!"
echo ""
echo "📋 Next steps:"
echo "1. Run 'npm install' to restore dependencies locally"
echo "2. Future pushes will be much faster"
echo "3. node_modules will be ignored in future commits"
