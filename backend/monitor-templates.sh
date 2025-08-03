#!/bin/bash

# Template Monitoring Script
# Monitors template files and creates backups when changes are detected

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATES_DIR="$SCRIPT_DIR/templates"
# Use the main backups directory
BACKUP_DIR="$SCRIPT_DIR/../backups"
LOG_FILE="$SCRIPT_DIR/template-monitor.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] SUCCESS:${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to create immediate backup
create_backup() {
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local backup_dir="$BACKUP_DIR/backup-$timestamp"
    
    mkdir -p "$backup_dir"
    
    # Copy all template files
    local count=0
    for template in "$TEMPLATES_DIR"/*.html; do
        if [ -f "$template" ]; then
            cp "$template" "$backup_dir/"
            ((count++))
        fi
    done
    
    if [ $count -gt 0 ]; then
        success "Created backup with $count templates: $backup_dir"
        
        # Create checksums
        cd "$backup_dir"
        for template in *.html; do
            if [ -f "$template" ]; then
                md5sum "$template" >> checksums.txt
            fi
        done
        cd - > /dev/null
        
        return 0
    else
        error "No templates found to backup"
        return 1
    fi
}

# Function to verify template integrity
verify_templates() {
    local issues=0
    
    log "Verifying template integrity..."
    
    for template in "$TEMPLATES_DIR"/*.html; do
        if [ -f "$template" ]; then
            local filename=$(basename "$template")
            
            # Check if file is empty
            if [ ! -s "$template" ]; then
                error "Template is empty: $filename"
                ((issues++))
                continue
            fi
            
            # Check for basic HTML structure
            if ! grep -q "<!DOCTYPE html>" "$template"; then
                error "Missing DOCTYPE in template: $filename"
                ((issues++))
            fi
            
            if ! grep -q "</html>" "$template"; then
                error "Missing closing HTML tag in template: $filename"
                ((issues++))
            fi
            
            # Check for reasonable file size (should be at least 1KB)
            local size=$(stat -f%z "$template" 2>/dev/null || stat -c%s "$template" 2>/dev/null)
            if [ "$size" -lt 1024 ]; then
                warning "Template seems too small: $filename ($size bytes)"
            fi
            
            # Check for duplicate content (basic check)
            local unique_lines=$(grep -v "^$" "$template" | sort | uniq | wc -l)
            local total_lines=$(grep -v "^$" "$template" | wc -l)
            
            if [ $total_lines -gt 0 ]; then
                local duplicate_ratio=$((100 * (total_lines - unique_lines) / total_lines))
                if [ $duplicate_ratio -gt 50 ]; then
                    warning "High duplicate content in template: $filename ($duplicate_ratio% duplicates)"
                fi
            fi
        fi
    done
    
    if [ $issues -eq 0 ]; then
        success "All templates passed verification"
    else
        error "Found $issues template issues"
    fi
    
    return $issues
}

# Function to monitor templates
monitor_templates() {
    log "Starting template monitoring..."
    
    # Create initial backup
    create_backup
    
    # Store initial checksums
    local checksum_file="$BACKUP_DIR/current_checksums.txt"
    cd "$TEMPLATES_DIR"
    md5sum *.html > "$checksum_file" 2>/dev/null
    cd - > /dev/null
    
    log "Template monitoring active. Press Ctrl+C to stop."
    
    while true; do
        sleep 30  # Check every 30 seconds
        
        # Check for changes
        local new_checksum_file="/tmp/new_checksums_$$"
        cd "$TEMPLATES_DIR"
        md5sum *.html > "$new_checksum_file" 2>/dev/null
        cd - > /dev/null
        
        if ! diff -q "$checksum_file" "$new_checksum_file" > /dev/null 2>&1; then
            warning "Template changes detected!"
            
            # Verify templates before creating backup
            if verify_templates; then
                create_backup
                mv "$new_checksum_file" "$checksum_file"
                success "Backup created due to template changes"
            else
                error "Template verification failed. Backup not created."
                rm -f "$new_checksum_file"
            fi
        else
            rm -f "$new_checksum_file"
        fi
    done
}

# Function to clean old backups (keep only last 10)
clean_old_backups() {
    log "Cleaning old backups..."
    
    local backup_count=$(ls -1 "$BACKUP_DIR" | grep "^backup-" | wc -l)
    
    if [ $backup_count -gt 10 ]; then
        local to_remove=$((backup_count - 10))
        ls -1t "$BACKUP_DIR" | grep "^backup-" | tail -n $to_remove | while read backup; do
            rm -rf "$BACKUP_DIR/$backup"
            log "Removed old backup: $backup"
        done
        success "Cleaned $to_remove old backups"
    else
        log "No old backups to clean (found $backup_count backups)"
    fi
}

# Main script logic
case "${1:-monitor}" in
    "backup")
        create_backup
        ;;
    "verify")
        verify_templates
        ;;
    "monitor")
        monitor_templates
        ;;
    "clean")
        clean_old_backups
        ;;
    "help")
        echo "Usage: $0 [backup|verify|monitor|clean|help]"
        echo "  backup  - Create immediate backup"
        echo "  verify  - Verify template integrity"
        echo "  monitor - Start continuous monitoring (default)"
        echo "  clean   - Clean old backups"
        echo "  help    - Show this help"
        ;;
    *)
        error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
