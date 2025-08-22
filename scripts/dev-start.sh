#!/bin/bash

# Development Start Script
# This ensures a clean development environment every time

echo "🧹 Cleaning development environment..."

# Remove any build artifacts
if [ -d "dist" ]; then
    echo "   Removing dist/ folder..."
    rm -rf dist
fi

# Remove Vite cache
if [ -d ".vite" ]; then
    echo "   Removing .vite cache..."
    rm -rf .vite
fi

# Check that index.html points to development entry
if grep -q "/assets/index-" index.html; then
    echo "❌ WARNING: index.html contains production build references!"
    echo "   This will prevent development hot reloading from working."
    echo "   Please ensure index.html contains:"
    echo "   <script type=\"module\" src=\"/src/main.tsx\"></script>"
    echo ""
    read -p "Do you want me to fix this automatically? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Fix the index.html file
        sed -i '' 's|<script.*src="/assets/index-.*\.js"></script>|<script type="module" src="/src/main.tsx"></script>|g' index.html
        sed -i '' '/<link.*href="\/assets\/index-.*\.css">/d' index.html
        echo "✅ Fixed index.html for development!"
    fi
fi

echo "🚀 Starting Vite development server..."
npm run dev
