#!/bin/bash

# Simple backup management script for Designetica project
# Usage: ./manage-backups.sh [create|list|clean]

set -e

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
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
    
    # Create backup excluding unnecessary files
    cd "$(dirname "$PROJECT_ROOT")"
    tar -czf "$BACKUP_PATH" \
        --exclude="$(basename "$PROJECT_ROOT")/backups" \
        --exclude="$(basename "$PROJECT_ROOT")/node_modules" \
        --exclude="$(basename "$PROJECT_ROOT")/.git" \
        --exclude="$(basename "$PROJECT_ROOT")/dist" \
        --exclude="$(basename "$PROJECT_ROOT")/build" \
        --exclude="$(basename "$PROJECT_ROOT")/*.log" \
        --exclude="$(basename "$PROJECT_ROOT")/.DS_Store" \
        --exclude="$(basename "$PROJECT_ROOT")/Thumbs.db" \
        --exclude="$(basename "$PROJECT_ROOT")/*.tmp" \
        --exclude="$(basename "$PROJECT_ROOT")/*.temp" \
        "$(basename "$PROJECT_ROOT")"
    
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
