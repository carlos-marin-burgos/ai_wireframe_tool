#!/bin/bash

# 🚀 Microsoft Transfer Preparation Script
# Run this before transferring the repository

echo "🚀 Preparing repository for Microsoft transfer..."

# 1. Clean up any remaining sensitive files
echo "🧹 Cleaning up sensitive files..."
find . -name "*.log" -delete
find . -name ".DS_Store" -delete

# 2. Verify no sensitive data in files
echo "🔍 Checking for sensitive data..."
if grep -r "sk-[a-zA-Z0-9]\{40,\}" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude="*.backup*" . 2>/dev/null; then
    echo "❌ WARNING: Found potential OpenAI API keys!"
    exit 1
fi

if grep -r "EAXLS[a-zA-Z0-9]\{40,\}" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude="*.backup*" . 2>/dev/null; then
    echo "❌ WARNING: Found potential Azure credentials!"
    exit 1
fi

# 3. Verify template files exist
echo "📋 Checking template files..."
if [ ! -f "backend/local.settings.json.template" ]; then
    echo "❌ Missing: backend/local.settings.json.template"
    exit 1
fi

# 4. Verify documentation exists
echo "📚 Checking documentation..."
if [ ! -f "MICROSOFT_TRANSFER_PACKAGE.md" ]; then
    echo "❌ Missing: MICROSOFT_TRANSFER_PACKAGE.md"
    exit 1
fi

if [ ! -f "TRANSFER_CHECKLIST.md" ]; then
    echo "❌ Missing: TRANSFER_CHECKLIST.md"
    exit 1
fi

# 5. Test build
echo "🔨 Testing build..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# 6. Final verification
echo "✅ Repository is ready for Microsoft transfer!"
echo ""
echo "📋 Transfer Checklist:"
echo "  ✅ Sensitive data removed"
echo "  ✅ Template files created"
echo "  ✅ Documentation complete"
echo "  ✅ Build successful"
echo ""
echo "🚀 Next steps:"
echo "  1. Commit all changes: git add . && git commit -m 'Prepare for Microsoft transfer'"
echo "  2. Push to main: git push origin main"
echo "  3. Go to GitHub repository settings"
echo "  4. Transfer ownership to Microsoft account"
echo ""
echo "📞 Support: @carlosUX available for transition questions"
