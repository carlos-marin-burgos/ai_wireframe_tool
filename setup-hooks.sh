#!/bin/bash

# Git hooks setup script
echo "🔧 Setting up Git hooks automation..."

# Create .githooks directory if it doesn't exist
mkdir -p .githooks

# Make hooks executable
chmod +x .githooks/pre-push
chmod +x .githooks/post-merge

# Configure Git to use our custom hooks directory
git config core.hooksPath .githooks

echo "✅ Git hooks configured!"
echo ""
echo "📋 Hooks installed:"
echo "   🔍 pre-push: Validates environment before pushing"
echo "   🚀 post-merge: Auto-deploys after pulling changes"
echo ""
echo "💡 To disable: git config --unset core.hooksPath"