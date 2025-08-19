#!/bin/bash

echo "🧪 Testing Enhanced Wireframe Generation with Figma Components"
echo "============================================================"

# Test if the component library is accessible
echo "📦 Checking component library..."
if [ -f "public/fluent-library.json" ]; then
    COMPONENT_COUNT=$(cat public/fluent-library.json | grep -c '"id":')
    echo "✅ Found fluent-library.json with $COMPONENT_COUNT components"
    
    # Check for our specific Figma component
    if grep -q "fluent-component-3232105" public/fluent-library.json; then
        echo "✅ Figma component (3232-105) found in library"
    else
        echo "❌ Figma component not found"
    fi
else
    echo "❌ fluent-library.json not found"
fi

echo ""
echo "📋 To test enhanced wireframe generation:"
echo "1. Start your development server"
echo "2. Create a wireframe with description: 'Create a dashboard with modern Fluent components'"
echo "3. The AI should now be aware of your Figma component and use it when relevant"
echo ""
echo "🎯 Your Figma component will be used when users request:"
echo "   - Modern UI elements"
echo "   - Fluent Extended components"  
echo "   - Interactive buttons or controls"
echo "   - Component library elements"
