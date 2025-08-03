#!/bin/bash

# Automated backup and recovery system for Designetica
# Prevents data loss and enables quick recovery

set -e

BACKUP_DIR="/Users/carlosmarinburgos/designetica/backups"
BACKEND_DIR="/Users/carlosmarinburgos/designetica/backend"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="designetica_backup_${TIMESTAMP}"
MAX_BACKUPS=10

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to create full backup
create_backup() {
    log "Creating backup: $BACKUP_NAME"
    
    local backup_path="$BACKUP_DIR/$BACKUP_NAME"
    mkdir -p "$backup_path"
    
    # Backup critical files
    cp -r "$BACKEND_DIR/generateWireframe" "$backup_path/"
    cp -r "$BACKEND_DIR/generateSuggestions" "$backup_path/" 2>/dev/null || true
    cp -r "$BACKEND_DIR/health" "$backup_path/" 2>/dev/null || true
    cp "$BACKEND_DIR/package.json" "$backup_path/"
    cp "$BACKEND_DIR/host.json" "$backup_path/" 2>/dev/null || true
    cp "$BACKEND_DIR/local.settings.json" "$backup_path/" 2>/dev/null || true
    cp "$BACKEND_DIR/fallback-generator.js" "$backup_path/" 2>/dev/null || true
    
    # Backup frontend config
    cp "/Users/carlosmarinburgos/designetica/src/config/api.ts" "$backup_path/" 2>/dev/null || true
    
    # Create metadata
    cat > "$backup_path/metadata.json" << EOF
{
    "timestamp": "$TIMESTAMP",
    "type": "full_backup",
    "version": "1.0",
    "created_by": "automated_backup_system",
    "files_backed_up": [
        "generateWireframe/",
        "generateSuggestions/",
        "health/",
        "package.json",
        "host.json",
        "local.settings.json",
        "fallback-generator.js",
        "api.ts"
    ]
}
EOF
    
    # Create archive
    cd "$BACKUP_DIR"
    tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"
    rm -rf "$BACKUP_NAME"
    
    success "Backup created: ${BACKUP_NAME}.tar.gz"
}

# Function to clean old backups
cleanup_old_backups() {
    log "Cleaning up old backups (keeping last $MAX_BACKUPS)"
    
    cd "$BACKUP_DIR"
    local backup_count=$(ls -1 designetica_backup_*.tar.gz 2>/dev/null | wc -l || echo 0)
    
    if [ "$backup_count" -gt "$MAX_BACKUPS" ]; then
        local excess=$((backup_count - MAX_BACKUPS))
        ls -1t designetica_backup_*.tar.gz | tail -n "$excess" | xargs rm -f
        success "Removed $excess old backups"
    else
        success "No cleanup needed (have $backup_count backups)"
    fi
}

# Function to verify backup integrity
verify_backup() {
    local backup_file="$BACKUP_DIR/${BACKUP_NAME}.tar.gz"
    
    log "Verifying backup integrity"
    
    if [ -f "$backup_file" ]; then
        if tar -tzf "$backup_file" > /dev/null 2>&1; then
            success "Backup integrity verified"
            return 0
        else
            error "Backup is corrupted!"
            return 1
        fi
    else
        error "Backup file not found!"
        return 1
    fi
}

# Function to restore from backup
restore_backup() {
    local backup_name="$1"
    
    if [ -z "$backup_name" ]; then
        error "Please specify backup name to restore"
        list_backups
        return 1
    fi
    
    local backup_file="$BACKUP_DIR/${backup_name}"
    if [[ ! "$backup_file" == *.tar.gz ]]; then
        backup_file="${backup_file}.tar.gz"
    fi
    
    if [ ! -f "$backup_file" ]; then
        error "Backup file not found: $backup_file"
        return 1
    fi
    
    warning "This will overwrite current files. Are you sure? (y/N)"
    read -r confirmation
    if [[ "$confirmation" != "y" && "$confirmation" != "Y" ]]; then
        log "Restore cancelled"
        return 0
    fi
    
    log "Restoring from backup: $backup_name"
    
    # Create emergency backup of current state
    local emergency_backup="emergency_backup_$(date +"%Y%m%d_%H%M%S")"
    log "Creating emergency backup: $emergency_backup"
    BACKUP_NAME="$emergency_backup"
    create_backup
    
    # Extract and restore
    cd "$BACKUP_DIR"
    local extract_dir="restore_temp_$$"
    mkdir -p "$extract_dir"
    tar -xzf "$backup_file" -C "$extract_dir"
    
    local backup_folder=$(ls "$extract_dir")
    local source_dir="$extract_dir/$backup_folder"
    
    # Restore files
    if [ -d "$source_dir/generateWireframe" ]; then
        cp -r "$source_dir/generateWireframe" "$BACKEND_DIR/"
        success "Restored generateWireframe function"
    fi
    
    if [ -f "$source_dir/package.json" ]; then
        cp "$source_dir/package.json" "$BACKEND_DIR/"
        success "Restored package.json"
    fi
    
    if [ -f "$source_dir/fallback-generator.js" ]; then
        cp "$source_dir/fallback-generator.js" "$BACKEND_DIR/"
        success "Restored fallback-generator.js"
    fi
    
    if [ -f "$source_dir/api.ts" ]; then
        cp "$source_dir/api.ts" "/Users/carlosmarinburgos/designetica/src/config/"
        success "Restored api.ts"
    fi
    
    # Cleanup
    rm -rf "$extract_dir"
    
    success "Restore completed! Emergency backup saved as: $emergency_backup"
    warning "Remember to redeploy after restore: azd deploy"
}

# Function to list available backups
list_backups() {
    log "Available backups:"
    cd "$BACKUP_DIR"
    
    if ls designetica_backup_*.tar.gz 1> /dev/null 2>&1; then
        for backup in $(ls -1t designetica_backup_*.tar.gz); do
            local size=$(du -h "$backup" | cut -f1)
            local date=$(echo "$backup" | sed 's/designetica_backup_\([0-9]\{8\}_[0-9]\{6\}\).*/\1/' | sed 's/\([0-9]\{4\}\)\([0-9]\{2\}\)\([0-9]\{2\}\)_\([0-9]\{2\}\)\([0-9]\{2\}\)\([0-9]\{2\}\)/\1-\2-\3 \4:\5:\6/')
            echo -e "  ${GREEN}${backup}${NC} (${size}) - ${date}"
        done
    else
        warning "No backups found"
    fi
}

# Function to test backup system
test_backup_system() {
    log "Testing backup system"
    
    # Create test backup
    create_backup
    
    # Verify integrity
    if verify_backup; then
        success "Backup system test passed"
        return 0
    else
        error "Backup system test failed"
        return 1
    fi
}

# Function to create pre-deployment backup
pre_deployment_backup() {
    log "Creating pre-deployment backup"
    BACKUP_NAME="pre_deployment_$(date +"%Y%m%d_%H%M%S")"
    create_backup
    success "Pre-deployment backup created: $BACKUP_NAME"
}

# Main script logic
case "$1" in
    "create"|"backup")
        create_backup
        verify_backup
        cleanup_old_backups
        ;;
    "restore")
        restore_backup "$2"
        ;;
    "list")
        list_backups
        ;;
    "cleanup")
        cleanup_old_backups
        ;;
    "test")
        test_backup_system
        ;;
    "pre-deploy")
        pre_deployment_backup
        ;;
    "help"|"--help"|"-h")
        echo "Designetica Backup & Recovery System"
        echo ""
        echo "Usage: $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  create, backup    Create a new backup"
        echo "  restore [name]    Restore from backup"
        echo "  list              List available backups"
        echo "  cleanup           Remove old backups"
        echo "  test              Test backup system"
        echo "  pre-deploy        Create pre-deployment backup"
        echo "  help              Show this help"
        echo ""
        echo "Examples:"
        echo "  $0 create"
        echo "  $0 restore designetica_backup_20250731_140000"
        echo "  $0 list"
        ;;
    *)
        warning "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
