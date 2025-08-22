#!/bin/bash

# Component Cleanup Script
# Generated on 2025-07-31T19:20:44.758Z

echo "🧹 Starting component cleanup..."

# Backup first
echo "📁 Creating backup..."
cp -r src/components src/components.backup.$(date +%Y%m%d_%H%M%S)

# Remove unused components
rm "/Users/carlosmarinburgos/designetica/src/components/AtlasComponentLibrary.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/AtlasComponentLibrary.css"
rm "/Users/carlosmarinburgos/designetica/src/components/BackendStatus.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/BackendStatus.css"
rm "/Users/carlosmarinburgos/designetica/src/components/ConnectionStatusIndicator.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/DraggableWireframe.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/DraggableWireframe.css"
rm "/Users/carlosmarinburgos/designetica/src/components/EnhancedChatInput.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/EnhancedChatInput.css"
rm "/Users/carlosmarinburgos/designetica/src/components/ErrorWithActions.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/HeroExamples.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/LandingNavbar.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/LandingNavbar.css"
rm "/Users/carlosmarinburgos/designetica/src/components/MicrosoftLearnLayout.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/MicrosoftLearnLayout.css"
rm "/Users/carlosmarinburgos/designetica/src/components/ModernImportDialog.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/ModernImportDialog.css"
rm "/Users/carlosmarinburgos/designetica/src/components/ModernMultiStepWizard.clean.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/MultiStepWizard.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/NewImportDialog.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/NewImportDialog.css"
rm "/Users/carlosmarinburgos/designetica/src/components/NewSaveDialog.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/NewSaveDialog.css"
rm "/Users/carlosmarinburgos/designetica/src/components/OfflineBanner.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/PageContinuation.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/PageContinuation.css"
rm "/Users/carlosmarinburgos/designetica/src/components/QuickActions.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/QuickActions.css"
rm "/Users/carlosmarinburgos/designetica/src/components/SimpleComponentLibrary.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/SimpleComponentLibrary.css"
rm "/Users/carlosmarinburgos/designetica/src/components/SimpleComponentModal.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/SmartContextPanel.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/TypingIndicator.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/TypingIndicator.css"
rm "/Users/carlosmarinburgos/designetica/src/components/UnifiedComponentLibrary.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/UnifiedComponentLibrary.css"
rm "/Users/carlosmarinburgos/designetica/src/components/WireframeLibrary.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/WireframeLibrary.css"
rm "/Users/carlosmarinburgos/designetica/src/components/WireframeWithNavbar.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/WireframeWithNavbar.css"
rm "/Users/carlosmarinburgos/designetica/src/components/WireframeWithNavigation.tsx"
rm "/Users/carlosmarinburgos/designetica/src/components/WireframeWithNavigation.css"

echo "✅ Cleanup complete!"
echo "📊 Removed 25 unused components"
echo "💾 Backup saved in src/components.backup.*"
