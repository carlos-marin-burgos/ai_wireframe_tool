#!/bin/bash

# Path Verification Script
# Verifies that all scripts can correctly find project paths

echo "🔍 Verifying script paths..."
echo "================================"

# Get the project root (parent of scripts directory)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "📁 Script directory: $SCRIPT_DIR"
echo "📁 Project root: $PROJECT_ROOT"
echo ""

# Check critical directories exist
echo "📂 Directory verification:"
check_dir() {
    if [ -d "$1" ]; then
        echo "✅ $1 - exists"
    else
        echo "❌ $1 - missing"
    fi
}

check_dir "$PROJECT_ROOT/backend"
check_dir "$PROJECT_ROOT/src"
check_dir "$PROJECT_ROOT/scripts"
check_dir "$PROJECT_ROOT/backups"

echo ""

# Check critical files exist
echo "📄 File verification:"
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1 - exists"
    else
        echo "❌ $1 - missing"
    fi
}

check_file "$PROJECT_ROOT/package.json"
check_file "$PROJECT_ROOT/backend/package.json"
check_file "$PROJECT_ROOT/backend/host.json"

echo ""
echo "✅ Path verification complete!"
