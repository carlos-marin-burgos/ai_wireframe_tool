#!/bin/bash

# Cleanup Script - Removes test files and unnecessary documentation
# Run this to reduce project size

set -e

echo "🧹 Starting project cleanup..."
echo ""

# Counter for deleted files
deleted_count=0

# Function to safely delete files
safe_delete() {
    local pattern="$1"
    local description="$2"
    
    echo "🔍 Finding: $description"
    
    # Find and delete matching files
    while IFS= read -r file; do
        if [ -f "$file" ]; then
            echo "  ❌ Deleting: $file"
            rm "$file"
            ((deleted_count++))
        fi
    done < <(find . -type f -name "$pattern" \
        ! -path "./node_modules/*" \
        ! -path "./.git/*" \
        ! -path "./dist/*" \
        ! -path "./.deployment-backups/*")
}

# Delete test files
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Removing Test Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

safe_delete "*test*.js" "JavaScript test files"
safe_delete "*test*.sh" "Shell test scripts"

# Delete debug files
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🐛 Removing Debug Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

safe_delete "*debug*.js" "JavaScript debug files"
safe_delete "diagnostic-script.js" "Diagnostic scripts"

# Delete temporary/old documentation
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 Removing Old Documentation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# List of specific MD files to remove (keep README.md files and essential docs)
md_files_to_remove=(
    "AUTOMATION_GUIDE.md"
    "AUTO_RECOVERY_DISABLED.md"
    "FIXES_APPLIED.md"
    "FIX_LOGIN_LOOP.md"
    "STEP_1_COMPLETE.md"
    "STEP_2_COMPLETE.md"
    "QUICK_LOCALHOST_VS_PROD.md"
    "DESIGNETICA_PARTICIPANT_TASKS.md"
    "DESIGNETICA_TASK_COMPLETION_TEST_PLAN.md"
    "DESIGNETICA_MODERATOR_SCRIPT.md"
    "DESIGNETICA_USABILITY_TEST_PLAN.md"
    "GITHUB_INTEGRATION_REMOVED.md"
    "URL_WIREFRAME_ACCURACY_FIX.md"
    "MANUAL_SECURITY_TEST.md"
    "LOCALHOST_VS_PRODUCTION.md"
    "SMART_SIDEBAR_FRONTEND_PLAN.md"
    "FORMATTING_TOOLBAR_FIX.md"
    "PHASE_2_ACCURACY_IMPROVEMENTS.md"
    "PHASE_3_INTERACTIVE_IMPROVEMENTS.md"
    "PHASE_3_DEPLOYMENT_COMPLETE.md"
    "PHASE_4_PATTERN_RECOGNITION.md"
    "COMPLETE_PHASE_SUMMARY.md"
    "COMPLETE_JOURNEY_SUMMARY.md"
    "BUTTON_READABILITY_FIX_SUMMARY.md"
    "TESTING_GUIDE.md"
    "WIREFRAME_CSS_CONSOLIDATION.md"
    "PATTERN_ANALYZER_EXTRACTION_COMPLETE.md"
    "figma-admin-email.md"
    "FIGMA_CONNECTION_PERSISTENCE_FIX.md"
    "BEFORE_AFTER_COMPARISON.md"
    "presentation-inline-editing-script.md"
    "STOP_WORRYING_YOURE_GOOD.md"
    "AUTHENTICATION_TESTING.md"
    "SECURITY_TESTING_PLAN.md"
    "MANUAL_SECURITY_TEST.md"
    "CORRECT_FIXES.md"
    "LOVABLE_IMPLEMENTATION_COMPLETE.md"
    "LOVABLE_UPGRADE.md"
    "DEVICE_MANAGEMENT_WORKAROUNDS.md"
    "CLEANUP_SCRIPTS.md"
    "DEV_SCRIPTS_README.md"
    "API_VALIDATION_SYSTEM_SUMMARY.md"
    "HTML_VALIDATION_SYSTEM.md"
    "FEEDBACK_SYSTEM_SUMMARY.md"
    "SMART_SIDEBAR_QUICK_START.md"
    "QUICK_START.md"
)

for md_file in "${md_files_to_remove[@]}"; do
    if [ -f "$md_file" ]; then
        echo "  ❌ Deleting: $md_file"
        rm "$md_file"
        ((deleted_count++))
    fi
done

# Delete specific analysis/temp files
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🗑️  Removing Analysis & Temp Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

temp_files=(
    "analyze-components.js"
    "create-atlas-images.js"
    "backend-logs.txt"
    "frontend-logs.txt"
    "*.pid"
    "discovered-api-types.ts"
    "api-discovery.json"
    "atlas-heroes-data.json"
    "atlas-learning-path-result.json"
    "azure-resources-backup.json"
)

for pattern in "${temp_files[@]}"; do
    for file in $pattern; do
        if [ -f "$file" ]; then
            echo "  ❌ Deleting: $file"
            rm "$file"
            ((deleted_count++))
        fi
    done
done

# Delete backup folders (keep .deployment-backups for safety)
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💾 Checking Backup Folders"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "backups" ]; then
    echo "  ❌ Deleting: backups/ folder"
    rm -rf backups/
    ((deleted_count++))
fi

# Delete old script folders
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 Checking Old Script Folders"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

old_folders=(
    "backend/prevention-tests"
    "backend/debugOAuth"
    "backend/figmaOAuthDiagnostics"
    "backend/websiteAnalyzerDebug"
    "backend/websiteAnalyzerTest"
)

for folder in "${old_folders[@]}"; do
    if [ -d "$folder" ]; then
        echo "  ❌ Deleting: $folder/"
        rm -rf "$folder"
        ((deleted_count++))
    fi
done

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Cleanup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Total files/folders deleted: $deleted_count"
echo ""
echo "✅ Kept essential files:"
echo "   - README.md files"
echo "   - Core documentation (ARCHITECTURE.md, DEPLOYMENT_GUIDE.md, etc.)"
echo "   - Security docs (SECURITY.md, AZURE_KEY_VAULT_SETUP.md)"
echo "   - Active configuration files"
echo ""
echo "💡 Your deployment is still running in the background!"
echo ""
