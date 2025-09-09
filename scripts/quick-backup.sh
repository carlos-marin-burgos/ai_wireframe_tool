#!/bin/bash

# Quick backup script for Designetica project
# Creates a timestamped backup in the backups directory

# Get the project root (one level up from scripts directory)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_DIR="$PROJECT_ROOT/backups"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="designetica_quick_backup_$TIMESTAMP.tar.gz"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

echo "🔄 Creating quick backup..."
echo "📁 Backup name: $BACKUP_NAME"
echo "📂 Project root: $PROJECT_ROOT"
echo "💾 Backup directory: $BACKUP_DIR"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Create backup from project root
cd "$PROJECT_ROOT"
tar -czf "$BACKUP_PATH" \
  --exclude="backups" \
  --exclude="node_modules" \
  --exclude=".git" \
  --exclude="dist" \
  --exclude="build" \
  --exclude="*.log" \
  .

# Get backup size and display result
BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
echo "✅ Backup created successfully!"
echo "📄 File: $BACKUP_NAME"
echo "📏 Size: $BACKUP_SIZE"
echo "💾 Location: $BACKUP_PATH"
