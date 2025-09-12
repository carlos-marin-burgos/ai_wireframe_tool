import React, { useState, useCallback, useRef, useEffect } from 'react';
import './LayoutManager.css';

interface LayoutManagerProps {
    htmlContent: string;
    addedComponents: any[];
    onUpdateLayout: (newLayout: string) => void;
    onComponentUpdate: (components: any[]) => void;
}

export interface ComponentPosition {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    isGenerated: boolean;
    isActive: boolean;
}

const LayoutManager: React.FC<LayoutManagerProps> = ({
    htmlContent,
    addedComponents,
    onUpdateLayout,
    onComponentUpdate
}) => {
    const [editMode, setEditMode] = useState(false);
    const [components, setComponents] = useState<ComponentPosition[]>([]);
    const [dragState, setDragState] = useState<{
        isDragging: boolean;
        componentId: string | null;
        offset: { x: number; y: number };
    }>({
        isDragging: false,
        componentId: null,
        offset: { x: 0, y: 0 }
    });

    const containerRef = useRef<HTMLDivElement>(null);

    // Enable edit mode when components are added from library
    useEffect(() => {
        if (addedComponents.length > 0 && !editMode) {
            setEditMode(true);
            showEditModeNotification();
        }
    }, [addedComponents.length, editMode]);

    const showEditModeNotification = () => {
        // Show a toast notification that edit mode is now active
        const notification = document.createElement('div');
        notification.className = 'edit-mode-notification';
        notification.innerHTML = `
      <div class="notification-content">
        🎯 <strong>Edit Mode Activated!</strong><br>
        All wireframe components are now draggable
      </div>
    `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    // Parse HTML and create component positions
    useEffect(() => {
        if (!editMode) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const elements = doc.querySelectorAll('[data-draggable="true"], .form-group, .hero-section, .nav-item');

        const newComponents: ComponentPosition[] = [];

        elements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            newComponents.push({
                id: `generated-${index}`,
                x: rect.left || index * 20,
                y: rect.top || index * 60,
                width: rect.width || 200,
                height: rect.height || 40,
                zIndex: 1,
                isGenerated: true,
                isActive: true
            });
        });

        // Add library components
        addedComponents.forEach((comp, index) => {
            newComponents.push({
                id: `added-${comp.id || index}`,
                x: comp.x || 20,
                y: comp.y || (400 + index * 60),
                width: comp.width || 200,
                height: comp.height || 40,
                zIndex: 2,
                isGenerated: false,
                isActive: true
            });
        });

        setComponents(newComponents);
    }, [htmlContent, addedComponents, editMode]);

    const handleMouseDown = useCallback((e: React.MouseEvent, componentId: string) => {
        if (!editMode) return;

        const component = components.find(c => c.id === componentId);
        if (!component) return;

        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setDragState({
            isDragging: true,
            componentId,
            offset: {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            }
        });

        e.preventDefault();
    }, [components, editMode]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragState.isDragging || !dragState.componentId || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const newX = e.clientX - containerRect.left - dragState.offset.x;
        const newY = e.clientY - containerRect.top - dragState.offset.y;

        setComponents(prev => prev.map(comp =>
            comp.id === dragState.componentId
                ? { ...comp, x: Math.max(0, newX), y: Math.max(0, newY) }
                : comp
        ));
    }, [dragState]);

    const handleMouseUp = useCallback(() => {
        if (dragState.isDragging) {
            // Auto-arrange components to prevent overlaps
            autoArrangeComponents();
        }
        setDragState({ isDragging: false, componentId: null, offset: { x: 0, y: 0 } });
    }, [dragState.isDragging]);

    const autoArrangeComponents = () => {
        setComponents(prev => {
            const sorted = [...prev].sort((a, b) => a.y - b.y);
            let currentY = 20;

            return sorted.map(comp => {
                const newComp = { ...comp, y: currentY };
                currentY += comp.height + 20; // 20px gap between components
                return newComp;
            });
        });
    };

    useEffect(() => {
        if (dragState.isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

    return (
        <div className="layout-manager" ref={containerRef}>
            {/* Edit Mode Controls */}
            {editMode && (
                <div className="edit-mode-controls">
                    <div className="control-panel">
                        <button
                            className="auto-arrange-btn"
                            onClick={autoArrangeComponents}
                            title="Auto-arrange components"
                        >
                            📐 Auto Arrange
                        </button>
                        <button
                            className="reset-layout-btn"
                            onClick={() => setEditMode(false)}
                            title="Exit edit mode"
                        >
                            🔒 Lock Layout
                        </button>
                        <div className="edit-mode-indicator">
                            Edit Mode Active
                        </div>
                    </div>
                </div>
            )}

            {/* Wireframe Content */}
            <div
                className={`wireframe-content ${editMode ? 'edit-mode' : 'view-mode'}`}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Overlay for draggable components in edit mode */}
            {editMode && (
                <div className="component-overlay">
                    {components.map(comp => (
                        <div
                            key={comp.id}
                            className={`draggable-overlay ${comp.isGenerated ? 'generated' : 'added'} ${dragState.componentId === comp.id ? 'dragging' : ''
                                }`}
                            style={{
                                '--comp-x': `${comp.x}px`,
                                '--comp-y': `${comp.y}px`,
                                '--comp-width': `${comp.width}px`,
                                '--comp-height': `${comp.height}px`,
                                '--comp-z': comp.zIndex
                            } as React.CSSProperties}
                            onMouseDown={(e) => handleMouseDown(e, comp.id)}
                            title={comp.isGenerated ? 'AI Generated Component' : 'Library Component'}
                        >
                            <div className="component-label">
                                {comp.isGenerated ? '🤖' : '📚'} {comp.id}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Snap guides */}
            {dragState.isDragging && (
                <div className="snap-guides">
                    <div className="snap-line vertical" />
                    <div className="snap-line horizontal" />
                </div>
            )}
        </div>
    );
};

export default LayoutManager;
