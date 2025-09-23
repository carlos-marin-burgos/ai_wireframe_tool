# Drag and Drop Version Backup

This directory contains the original drag-and-drop enabled wireframe components that were created before removing drag functionality to improve layout rendering.

## Files Backed Up:

- `DragWireframe.tsx` - React component with drag and drop functionality
- `DragWireframe.css` - CSS styles for drag mode, editing, and wireframe display

## Why Backup Was Created:

The drag and drop functionality was adding significant CSS complexity that interfered with AI-generated wireframe layouts, particularly:

- Sidebar positioning issues (left sidebars appearing at top)
- CSS constraints overriding flex layouts
- Complex CSS cascade causing layout conflicts

## To Restore Drag Functionality:

1. Copy files from this backup directory back to `/src/components/`
2. Update imports in the main application
3. Re-enable drag mode toggle in PageNavigation component

Created: September 23, 2025
