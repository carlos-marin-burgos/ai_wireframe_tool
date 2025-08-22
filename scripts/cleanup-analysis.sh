#!/bin/bash

echo "🧹 HTML Test File Cleanup Analysis for Designetica"
echo "=================================================="
echo ""

# Count total HTML files
total_html=$(find . -name "*.html" -maxdepth 1 | wc -l | tr -d ' ')
echo "📊 Total HTML files in root: $total_html"

# Count empty files
empty_files=$(find . -name "*.html" -maxdepth 1 -size 0 | wc -l | tr -d ' ')
echo "📭 Empty HTML files: $empty_files"

# Main application file
echo ""
echo "🎯 CORE APPLICATION FILES (KEEP):"
echo "- index.html (main React app entry)"

echo ""
echo "🚮 RECOMMENDED FOR DELETION:"
echo ""
echo "1. EMPTY FILES ($empty_files files):"
find . -name "*.html" -maxdepth 1 -size 0 | sed 's|^./|   - |'

echo ""
echo "2. DEVELOPMENT TEST FILES:"
echo "   - test*.html files"
echo "   - *-test.html files"
echo "   - enhanced-test*.html files"
echo "   - production-test*.html files"

echo ""
echo "3. LEGACY DEMO FILES:"
echo "   - *-demo.html files"
echo "   - demo-*.html files"

echo ""
echo "4. SPECIFIC FEATURE TESTS:"
echo "   - nav-*.html (navigation testing)"
echo "   - clean-*.html (cleanup tests)"
echo "   - wireframe-*.html (wireframe prototypes)"
echo "   - fluent-*.html (Fluent UI testing)"
echo "   - atlas-*.html (Atlas component testing)"
echo "   - figma-*.html (Figma integration tests)"

echo ""
echo "⚠️  REVIEW MANUALLY (may contain important code):"
echo "   - final-verification-test.html"
echo "   - working-learning-wireframe.html"
echo "   - rearrangeable-wireframe-demo.html"
echo "   - monitor-analytics.html"

echo ""
echo "📈 CLEANUP IMPACT:"
estimated_cleanup=$((empty_files + 30))  # rough estimate
echo "   - Estimated files for deletion: ~$estimated_cleanup"
echo "   - Remaining files: ~$((total_html - estimated_cleanup))"
echo "   - Disk space recovery: Minimal (mostly small test files)"
echo "   - Code clarity improvement: Significant"

echo ""
echo "🔧 SUGGESTED CLEANUP COMMANDS:"
echo ""
echo "# Remove empty files:"
echo "find . -name '*.html' -maxdepth 1 -size 0 -delete"
echo ""
echo "# Remove test files (run with caution):"
echo "rm -f *-test.html test*.html enhanced-test*.html production-test*.html"
echo ""
echo "# Remove demo files:"
echo "rm -f *-demo.html demo-*.html"
echo ""
echo "# Remove specific pattern files:"
echo "rm -f nav-*.html clean-*.html atlas-*.html figma-*.html fluent-*.html"

echo ""
echo "✅ RECOMMENDATION: Yes, cleanup is beneficial!"
echo "   Most of these files appear to be development artifacts"
echo "   that are no longer needed for production."
