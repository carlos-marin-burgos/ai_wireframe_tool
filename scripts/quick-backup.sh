#!/bin/bash

# Quick backup script for Designetica project
# Creates a timestamped backup in the backups directory

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="designetica_quick_backup_$TIMESTAMP.tar.gz"

echo "🔄 Creating quick backup..."
echo "📁 Backup name: $BACKUP_NAME"

# Go to parent directory and create backup
cd ..
tar -czf "designetica/backups/$BACKUP_NAME" \
  --exclude="designetica/backups" \
  --exclude="designetica/node_modules" \
  --exclude="designetica/.git" \
  --exclude="designetica/dist" \
  --exclude="designetica/build" \
  --exclude="designetica/*.log" \
  designetica

# Get backup size and display result
BACKUP_SIZE=$(du -h "designetica/backups/$BACKUP_NAME" | cut -f1)
echo "✅ Backup created successfully!"
echo "📄 File: $BACKUP_NAME"
echo "📏 Size: $BACKUP_SIZE"
echo "💾 Location: ./backups/$BACKUP_NAME"
