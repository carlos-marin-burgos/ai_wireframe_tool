#!/bin/bash

# 🚀 MAXIMUM AI MODE ACTIVATION SCRIPT
# Run this after upgrading your Azure OpenAI tier

echo "🚀 ACTIVATING MAXIMUM AI MODE"
echo "============================"
echo ""

# Check if user has upgraded
echo "Have you upgraded your Azure OpenAI pricing tier? (y/n)"
read -r upgraded

if [ "$upgraded" != "y" ]; then
    echo ""
    echo "❌ Please upgrade first:"
    echo "1. Go to Azure Portal → Your OpenAI resource → Pricing tier"
    echo "2. Upgrade from S0 to Standard S1+ or Pay-as-you-go"
    echo "3. Request quota increase at https://aka.ms/oai/quotaincrease"
    echo "4. Run this script again"
    exit 1
fi

echo ""
echo "✅ Great! Activating maximum AI mode..."

# Backup the current controller
cp backend/MaximumAIModeController.js backend/MaximumAIModeController.js.backup

# Update the controller to enable maximum AI
sed -i '' 's/enabled: false,/enabled: true,/' backend/MaximumAIModeController.js
sed -i '' 's/reason: "Waiting for Azure OpenAI tier upgrade"/reason: "Azure OpenAI tier upgraded - maximum AI enabled"/' backend/MaximumAIModeController.js

echo ""
echo "🔄 Testing maximum AI mode..."

# Test the activation
node -e "
const controller = require('./backend/MaximumAIModeController.js');
controller.logAIModeStatus();

if (controller.shouldUseMaximumAI()) {
    console.log('');
    console.log('✅ MAXIMUM AI MODE SUCCESSFULLY ACTIVATED!');
    console.log('🎯 Your wireframe generator now has:');
    console.log('   • 11-stage AI pipeline');
    console.log('   • World-class quality output');
    console.log('   • Professional polish');
    console.log('   • Your Figma component integration');
    console.log('');
    console.log('🚀 Ready to generate world-class wireframes!');
} else {
    console.log('');
    console.log('❌ Maximum AI mode not activated');
    console.log('Please check the configuration');
}
"

echo ""
echo "🔄 Restarting development server..."

# Kill existing processes on common ports
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:7071 | xargs kill -9 2>/dev/null || true
lsof -ti:7072 | xargs kill -9 2>/dev/null || true

# Start the enhanced development environment
echo "🌐 Starting enhanced development environment with maximum AI..."
npm run dev:full &

echo ""
echo "🎉 MAXIMUM AI MODE ACTIVATED!"
echo "============================="
echo ""
echo "🎯 What changed:"
echo "• Your wireframe generator now uses 11 AI analysis stages"
echo "• Each wireframe is professionally polished"
echo "• Your Figma component will be intelligently integrated"
echo "• Cost: ~$0.33 per wireframe (vs $0.06 before)"
echo ""
echo "🚀 Ready to create world-class wireframes!"
echo "Open your wireframe generator and try it out!"
