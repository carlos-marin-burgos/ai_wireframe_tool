import React, { useCallback, useRef, useState, useEffect } from 'react';
import { fixWireframeImages } from '../utils/imagePlaceholders';
import './MouseDragDrop.css';

interface MouseDragDropProps {
    htmlContent: string;
    onUpdateHtml: (newHtml: string) => void;
    onNavigateToPage: (pageId: string) => void;
    availablePages: Array<{
        id: string;
        name: string;
        description: string;
        type: 'page' | 'modal' | 'component';
    }>;
}

interface DragState {
    isDragging: boolean;
    dragElement: HTMLElement | null;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
}

const MouseDragDrop: React.FC<MouseDragDropProps> = ({
    htmlContent,
    onUpdateHtml,
    onNavigateToPage,
    availablePages
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const dragStateRef = useRef<DragState>({
        isDragging: false,
        dragElement: null,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0
    });

    const [editMode, setEditMode] = useState(false);

    // Clean HTML content
    const cleanHtmlContent = React.useMemo(() => {
        if (!htmlContent || typeof htmlContent !== 'string') {
            return '';
        }

        let cleaned = htmlContent.trim();
        cleaned = cleaned.replace(/^[0'"]+|[0'"]+$/g, '');
        cleaned = cleaned.replace(/^'''html\s*/gi, '');
        cleaned = cleaned.replace(/^```html\s*/gi, '');
        cleaned = cleaned.replace(/```\s*$/gi, '');
        cleaned = fixWireframeImages(cleaned);

        return cleaned.trim();
    }, [htmlContent]);

    // Setup draggable elements
    useEffect(() => {
        if (!containerRef.current) return;

        const elements = containerRef.current.querySelectorAll('.form-group, .form-submit, .card, .hero-section, .nav-section, button:not(.control-panel button), [data-user-added="true"]');

        elements.forEach((element) => {
            const el = element as HTMLElement;
            el.setAttribute('data-draggable', 'true');
            el.style.cursor = editMode ? 'grab' : 'default';
            el.style.userSelect = 'none';

            if (editMode) {
                el.style.transition = 'transform 0.2s ease';
            }
        });

        // Auto-activate edit mode if user-added components exist
        const userAddedElements = containerRef.current.querySelectorAll('[data-user-added="true"]');
        if (userAddedElements.length > 0 && !editMode) {
            setEditMode(true);
            showEditModeNotification();
        }
    }, [cleanHtmlContent, editMode]);

    const showEditModeNotification = useCallback(() => {
        const notification = document.createElement('div');
        notification.className = 'edit-mode-notification';
        notification.innerHTML = `
            <div class="notification-content">
                🎯 <strong>Edit Mode Activated!</strong><br>
                All wireframe components are now draggable
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #107c10, #0b5394);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInNotification 0.3s ease-out;
            max-width: 280px;
            font-size: 13px;
            line-height: 1.4;
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }, []);

    // Mouse event handlers for drag and drop
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!editMode) return;

        const target = e.target as HTMLElement;
        const draggableElement = target.closest('[data-draggable="true"]') as HTMLElement;

        if (!draggableElement || !containerRef.current) return;

        e.preventDefault();

        const rect = draggableElement.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        dragStateRef.current = {
            isDragging: true,
            dragElement: draggableElement,
            startX: e.clientX,
            startY: e.clientY,
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top
        };

        // Add dragging class to container for global state
        containerRef.current.classList.add('dragging-active');

        // Visual feedback with smooth animations
        draggableElement.classList.add('being-dragged');
        draggableElement.style.cursor = 'grabbing';
        draggableElement.style.opacity = '0.9';
        draggableElement.style.transform = 'scale(1.08) rotate(3deg)';
        draggableElement.style.zIndex = '1000';
        draggableElement.style.pointerEvents = 'none';
        draggableElement.style.transition = 'transform 0.15s ease';
        draggableElement.style.boxShadow = '0 8px 25px rgba(0, 123, 255, 0.4)';
        draggableElement.style.filter = 'brightness(1.05)';

        console.log('🎯 Drag started:', draggableElement.textContent?.slice(0, 30));
    }, [editMode]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const dragState = dragStateRef.current;

        if (!dragState.isDragging || !dragState.dragElement || !containerRef.current) return;

        e.preventDefault();

        const containerRect = containerRef.current.getBoundingClientRect();

        // Calculate new position
        const newX = e.clientX - containerRect.left - dragState.offsetX;
        const newY = e.clientY - containerRect.top - dragState.offsetY;

        // Apply bounds checking
        const elementRect = dragState.dragElement.getBoundingClientRect();
        const maxX = containerRect.width - elementRect.width;
        const maxY = containerRect.height - elementRect.height;

        const boundedX = Math.max(10, Math.min(maxX - 10, newX));
        const boundedY = Math.max(10, Math.min(maxY - 10, newY));

        // Update position with smooth movement
        dragState.dragElement.style.position = 'absolute';
        dragState.dragElement.style.left = `${boundedX}px`;
        dragState.dragElement.style.top = `${boundedY}px`;
        dragState.dragElement.style.transition = 'none'; // Disable transition during drag
    }, []);

    const handleMouseUp = useCallback((e: React.MouseEvent) => {
        const dragState = dragStateRef.current;

        if (!dragState.isDragging || !dragState.dragElement) return;

        // Remove global dragging state
        if (containerRef.current) {
            containerRef.current.classList.remove('dragging-active');
        }

        // Clean up visual feedback with smooth animations
        dragState.dragElement.classList.remove('being-dragged');
        dragState.dragElement.style.cursor = 'grab';
        dragState.dragElement.style.opacity = '';
        dragState.dragElement.style.transform = '';
        dragState.dragElement.style.pointerEvents = '';
        dragState.dragElement.style.boxShadow = '';
        dragState.dragElement.style.filter = '';
        dragState.dragElement.style.transition = 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
        dragState.dragElement.setAttribute('data-user-added', 'true');

        // Show success bounce animation
        dragState.dragElement.style.transform = 'scale(1.12)';
        setTimeout(() => {
            if (dragState.dragElement) {
                dragState.dragElement.style.transform = '';

                // Auto-rearrange all components into natural flow after drop
                autoRearrangeIntoFlow();
            }
        }, 200);

        console.log('📍 Component dropped successfully');

        // Update HTML content - clean up positioning styles before saving
        setTimeout(() => {
            if (containerRef.current) {
                // Create a temporary container to clean up styles
                const tempContainer = containerRef.current.cloneNode(true) as HTMLElement;

                // Remove all positioning styles from draggable elements
                const draggableElements = tempContainer.querySelectorAll('[data-draggable="true"]');
                draggableElements.forEach((element) => {
                    const el = element as HTMLElement;
                    el.style.position = '';
                    el.style.left = '';
                    el.style.top = '';
                    el.style.transform = '';
                    el.style.zIndex = '';
                    el.style.transition = '';
                    el.style.opacity = '';
                    el.style.cursor = '';
                    el.style.pointerEvents = '';
                    el.style.boxShadow = '';
                    el.style.filter = '';
                    el.classList.remove('being-dragged');
                });

                // Also clean up container classes
                tempContainer.classList.remove('dragging-active');

                onUpdateHtml(tempContainer.innerHTML);
            }
        }, 350);

        // Reset drag state
        dragStateRef.current = {
            isDragging: false,
            dragElement: null,
            startX: 0,
            startY: 0,
            offsetX: 0,
            offsetY: 0
        };
    }, [onUpdateHtml]);

    // Auto-arrange components (can be triggered programmatically)
    const autoArrangeComponents = useCallback(() => {
        if (!containerRef.current) return;

        const elements = Array.from(containerRef.current.querySelectorAll('[data-draggable="true"]')) as HTMLElement[];

        if (elements.length === 0) return;

        // Reset all positioning styles to ensure clean layout
        elements.forEach(el => {
            el.style.position = '';
            el.style.top = '';
            el.style.left = '';
            el.style.transform = '';
            el.style.zIndex = '';
            el.style.transition = '';
            el.style.opacity = '';
            el.style.cursor = '';
            el.style.pointerEvents = '';
            el.style.boxShadow = '';
            el.style.filter = '';
            el.classList.remove('being-dragged');
        });

        // Apply vertical arrangement with proper spacing
        elements.forEach((element, index) => {
            element.style.position = 'relative';
            element.style.marginBottom = '20px';
            element.style.transition = 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';

            // Staggered animation
            setTimeout(() => {
                element.style.transform = 'translateX(0)';
                element.style.opacity = '1';
            }, index * 50);
        });

        // Update HTML with cleaned styles
        setTimeout(() => {
            if (containerRef.current) {
                // Create a temporary container to clean up any remaining styles
                const tempContainer = containerRef.current.cloneNode(true) as HTMLElement;

                // Final cleanup of any leftover positioning styles
                const draggableElements = tempContainer.querySelectorAll('[data-draggable="true"]');
                draggableElements.forEach((element) => {
                    const el = element as HTMLElement;
                    // Keep only the margin and position relative for auto-arrange
                    const marginBottom = el.style.marginBottom;
                    const position = el.style.position;

                    // Clear all styles
                    el.style.cssText = '';

                    // Restore only the necessary auto-arrange styles
                    if (position === 'relative') el.style.position = position;
                    if (marginBottom) el.style.marginBottom = marginBottom;
                });

                onUpdateHtml(tempContainer.innerHTML);
            }
        }, 500);

        console.log('📐 Auto-arranged components');
    }, [onUpdateHtml]);

    // Auto-rearrange components into natural flow after drag and drop
    const autoRearrangeIntoFlow = useCallback(() => {
        if (!containerRef.current) return;

        const elements = Array.from(containerRef.current.querySelectorAll('[data-draggable="true"]')) as HTMLElement[];

        if (elements.length === 0) return;

        // Clean up all absolute positioning and restore natural flow
        elements.forEach((element, index) => {
            // Clear absolute positioning
            element.style.position = '';
            element.style.left = '';
            element.style.top = '';
            element.style.zIndex = '';

            // Apply relative positioning with proper spacing
            element.style.position = 'relative';
            element.style.marginBottom = '15px';
            element.style.display = 'block';
            element.style.width = 'auto';

            // Add smooth transition for the rearrangement
            element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

            // Staggered entrance effect
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 30);
        });

        console.log('🔄 Components rearranged into natural flow');
    }, []);

    // Keyboard shortcut for auto-arrange (Ctrl/Cmd + Shift + A)
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A' && editMode) {
                e.preventDefault();
                autoArrangeComponents();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [editMode, autoArrangeComponents]);

    return (
        <div
            ref={containerRef}
            className={`mouse-drag-drop ${editMode ? 'edit-mode' : 'view-mode'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            role="application"
            aria-label="Wireframe editor - drag and drop elements to rearrange"
        >
            {/* Content */}
            {(cleanHtmlContent && cleanHtmlContent.length > 0) ? (
                <div dangerouslySetInnerHTML={{ __html: cleanHtmlContent }} />
            ) : (
                <div className="empty-page">
                    <div className="empty-page-content">
                        <h3>📄 Empty Page</h3>
                        <p>This page doesn't have any content yet.</p>
                        <p>Ask the AI to generate content for this page, or add components from the library.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MouseDragDrop;
