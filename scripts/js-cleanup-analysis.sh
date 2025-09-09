#!/bin/bash

echo "🧹 COMPREHENSIVE JAVASCRIPT FILES CLEANUP ANALYSIS"
echo "=================================================="
echo ""

echo "📊 CURRENT SITUATION:"
total_js=$(find . -name "*.js" -type f | grep -v node_modules | wc -l | tr -d ' ')
echo "Total JS files (excluding node_modules): $total_js"
echo ""

echo "🎯 CLEANUP OPPORTUNITIES:"
echo ""

echo "1. 🗂️ PRE-DEPLOYMENT BACKUP (MASSIVE CLEANUP POTENTIAL):"
pre_deploy_js=$(find . -path "./pre_deployment_*" -name "*.js" | wc -l | tr -d ' ')
echo "   Files in pre_deployment_* folders: $pre_deploy_js"
echo "   ❌ RECOMMENDATION: DELETE ENTIRE pre_deployment_* folders"
echo "   💡 These are old backups and likely contain node_modules"

echo ""
echo "2. 📦 DIST FILES (Build artifacts):"
dist_js=$(find . -path "./dist/*" -name "*.js" | wc -l | tr -d ' ')
echo "   Files in dist/: $dist_js"
echo "   ✅ KEEP: These are built files needed for production"

echo ""
echo "3. 🧪 TEST FILES:"
test_js=$(find . -name "*.js" -type f | grep -v node_modules | grep -E "(test|Test|spec)" | wc -l | tr -d ' ')
echo "   Test files found: $test_js"
find . -name "*.js" -type f | grep -v node_modules | grep -E "(test|Test|spec)" | sed 's/^/   - /'

echo ""
echo "4. 🎛️ BACKEND FUNCTIONS (Azure Functions):"
backend_js=$(find ./backend -name "*.js" -type f | wc -l | tr -d ' ')
echo "   Files in backend/: $backend_js"
echo "   ✅ KEEP: These are functional Azure Functions"

echo ""
echo "5. 🛠️ UTILITY SCRIPTS:"
echo "   Files in js/: 14 (already organized)"
echo "   ✅ KEEP: These are utility scripts"

echo ""
echo "📈 CLEANUP IMPACT ESTIMATE:"
cleanup_potential=$pre_deploy_js
remaining=$((total_js - cleanup_potential))
echo "   Files to remove: ~$cleanup_potential (pre-deployment backups)"
echo "   Files to keep: ~$remaining"
echo "   Reduction: ~$((cleanup_potential * 100 / total_js))%"

echo ""
echo "🚨 RECOMMENDED ACTIONS:"
echo "1. DELETE: ./pre_deployment_* folders (old backups)"
echo "2. REVIEW: Remaining test files for deletion"
echo "3. KEEP: Backend functions, dist files, organized js/ files"

echo ""
echo "💡 SAFE EXECUTION COMMANDS:"
echo "# Create backup first:"
echo "./scripts/quick-backup.sh"
echo ""
echo "# Remove pre-deployment backups:"
echo "rm -rf ./pre_deployment_*"
echo ""
echo "# Remove remaining test files:"
echo "find . -name '*test*.js' -not -path './node_modules/*' -not -path './backend/node_modules/*' -delete"
