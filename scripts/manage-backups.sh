#!/bin/bash

# Simple backup management script for Designetica project
# Usage: ./manage-backups.sh [create|list|clean]

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_DIR="$PROJECT_ROOT/backups"
PROJECT_NAME="designetica"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to create backup
create_backup() {
    echo -e "${BLUE}🔄 Creating backup of Designetica project...${NC}"
    
    BACKUP_FILENAME="${PROJECT_NAME}_backup_${TIMESTAMP}.tar.gz"
    BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILENAME"
    
    echo -e "${YELLOW}📁 Project root: $PROJECT_ROOT${NC}"
    echo -e "${YELLOW}💾 Backup location: $BACKUP_PATH${NC}"
    
    # Ensure backup directory exists
    mkdir -p "$BACKUP_DIR"
    
    # Create backup excluding unnecessary files
    cd "$PROJECT_ROOT"
    tar -czf "$BACKUP_PATH" \
        --exclude="backups" \
        --exclude="node_modules" \
        --exclude=".git" \
        --exclude="dist" \
        --exclude="build" \
        --exclude="*.log" \
        --exclude=".DS_Store" \
        --exclude="Thumbs.db" \
        --exclude="*.tmp" \
        --exclude="*.temp" \
        .
    
    # Get backup size
    BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
    
    echo -e "${GREEN}✅ Backup created successfully!${NC}"
    echo -e "${GREEN}📄 Filename: $BACKUP_FILENAME${NC}"
    echo -e "${GREEN}📏 Size: $BACKUP_SIZE${NC}"
    echo ""
}

# Function to list backups
list_backups() {
    echo -e "${BLUE}📋 Available backups:${NC}"
    if ls "$BACKUP_DIR"/*.tar.gz >/dev/null 2>&1; then
        ls -lah "$BACKUP_DIR"/*.tar.gz | while read -r line; do
            echo -e "${YELLOW}   $line${NC}"
        done
    else
        echo -e "${YELLOW}   No backups found${NC}"
    fi
}

# Function to clean old backups
clean_backups() {
    echo -e "${BLUE}🧹 Cleaning old backups (keeping 5 most recent)...${NC}"
    BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/*.tar.gz 2>/dev/null | wc -l)
    if [[ $BACKUP_COUNT -gt 5 ]]; then
        ls -1t "$BACKUP_DIR"/*.tar.gz | tail -n +6 | xargs rm -f
        echo -e "${GREEN}✅ Old backups cleaned${NC}"
    else
        echo -e "${YELLOW}No old backups to clean${NC}"
    fi
}

# Main script logic
case "${1:-create}" in
    create)
        create_backup
        ;;
    list)
        list_backups
        ;;
    clean)
        clean_backups
        ;;
    *)
        echo "Usage: $0 [create|list|clean]"
        echo "  create - Create a new backup (default)"
        echo "  list   - List existing backups"
        echo "  clean  - Remove old backups (keep 5 most recent)"
        exit 1
        ;;
esac
