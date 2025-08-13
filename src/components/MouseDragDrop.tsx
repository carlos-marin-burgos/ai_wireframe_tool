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
    insertAfter?: HTMLElement | null;
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

    // Setup draggable elements and apply automatic spacing
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

        // Apply automatic spacing to all wireframe components
        applyAutomaticSpacing();

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
                🎯 <strong>Smart Wireframe Layout!</strong><br>
                Automatic spacing applied to all components<br>
                <small style="opacity: 0.8; margin-top: 4px; display: block;">
                    ⌨️ Ctrl+Shift+A: Auto-arrange | Ctrl+Shift+Space: Apply spacing
                </small>
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
            max-width: 350px;
            font-size: 13px;
            line-height: 1.4;
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }, []);

    // Apply automatic spacing to all wireframe components
    const applyAutomaticSpacing = useCallback(() => {
        if (!containerRef.current) return;

        const elements = Array.from(containerRef.current.querySelectorAll('[data-draggable="true"]')) as HTMLElement[];

        if (elements.length === 0) return;

        // Sort elements by their current vertical position
        const elementsWithPositions = elements.map(el => {
            const rect = el.getBoundingClientRect();
            const containerRect = containerRef.current!.getBoundingClientRect();
            return {
                element: el,
                top: rect.top - containerRect.top,
                height: rect.height,
                rect: rect
            };
        }).sort((a, b) => a.top - b.top);

        // Apply consistent spacing between components
        let currentY = 20; // Start with 20px from top
        const standardSpacing = 20; // 20px between components

        elementsWithPositions.forEach((item, index) => {
            const element = item.element;

            // Calculate the desired position
            const desiredTop = currentY;
            const currentTop = item.top;

            // Only apply spacing if the element needs repositioning
            if (Math.abs(desiredTop - currentTop) > 5) {
                // Apply relative positioning with proper spacing
                element.style.position = 'relative';
                element.style.marginTop = index === 0 ? '20px' : `${standardSpacing}px`;
                element.style.marginBottom = '0px';
                element.style.display = 'block';
                element.style.width = 'auto';

                // Add smooth transition for the spacing application
                element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            } else {
                // Ensure consistent margin even if position doesn't change
                element.style.marginTop = index === 0 ? '20px' : `${standardSpacing}px`;
                element.style.marginBottom = '0px';
            }

            // Update currentY for next element
            currentY += item.height + standardSpacing;
        });

        console.log('📏 Applied automatic spacing to', elements.length, 'components');
    }, []);

    // Show insertion zones between components during drag
    const showInsertionZones = useCallback((dragY: number) => {
        if (!containerRef.current) return;

        // Remove existing insertion indicators
        const existingIndicators = containerRef.current.querySelectorAll('.insertion-zone');
        existingIndicators.forEach(indicator => indicator.remove());

        const dragState = dragStateRef.current;
        if (!dragState.dragElement) return;

        // Get all other draggable elements (excluding the one being dragged)
        const allElements = Array.from(containerRef.current.querySelectorAll('[data-draggable="true"]')) as HTMLElement[];
        const otherElements = allElements.filter(el => el !== dragState.dragElement);

        if (otherElements.length === 0) return;

        const containerRect = containerRef.current.getBoundingClientRect();

        // Sort elements by their Y position
        const elementsWithPositions = otherElements.map(el => {
            const rect = el.getBoundingClientRect();
            return {
                element: el,
                top: rect.top - containerRect.top,
                bottom: rect.bottom - containerRect.top,
                centerY: (rect.top + rect.bottom) / 2 - containerRect.top
            };
        }).sort((a, b) => a.centerY - b.centerY);

        // Create insertion zones between elements and at the edges
        const insertionPoints: Array<{ y: number, insertAfter: HTMLElement | null }> = [];

        // Before first element
        if (elementsWithPositions.length > 0) {
            insertionPoints.push({
                y: Math.max(0, elementsWithPositions[0].top - 10),
                insertAfter: null
            });
        }

        // Between elements
        for (let i = 0; i < elementsWithPositions.length - 1; i++) {
            const current = elementsWithPositions[i];
            const next = elementsWithPositions[i + 1];
            const midY = (current.bottom + next.top) / 2;

            insertionPoints.push({
                y: midY,
                insertAfter: current.element
            });
        }

        // After last element
        if (elementsWithPositions.length > 0) {
            const last = elementsWithPositions[elementsWithPositions.length - 1];
            insertionPoints.push({
                y: last.bottom + 10,
                insertAfter: last.element
            });
        }

        // Find the closest insertion point to the drag position
        let closestPoint = insertionPoints[0];
        let minDistance = Math.abs(dragY - closestPoint.y);

        insertionPoints.forEach(point => {
            const distance = Math.abs(dragY - point.y);
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = point;
            }
        });

        // Show insertion indicator if close enough (within 30px)
        if (minDistance < 30) {
            const indicator = document.createElement('div');
            indicator.className = 'insertion-zone';
            indicator.style.cssText = `
                position: absolute;
                left: 10px;
                right: 10px;
                top: ${closestPoint.y - 2}px;
                height: 4px;
                background: linear-gradient(90deg, #3b82f6, #06b6d4);
                border-radius: 2px;
                z-index: 999;
                opacity: 0.8;
                box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
                animation: pulseInsertionZone 1s ease-in-out infinite alternate;
            `;

            containerRef.current.appendChild(indicator);

            // Store the insertion target for use in handleMouseUp
            dragState.insertAfter = closestPoint.insertAfter;
        } else {
            dragState.insertAfter = undefined;
        }
    }, []);

    // Clear insertion zones
    const clearInsertionZones = useCallback(() => {
        if (!containerRef.current) return;

        const indicators = containerRef.current.querySelectorAll('.insertion-zone');
        indicators.forEach(indicator => indicator.remove());
    }, []);

    // Insert element at the specified position
    const insertElementAt = useCallback((elementToMove: HTMLElement, insertAfter: HTMLElement | null) => {
        if (!containerRef.current || !elementToMove) return;

        const container = containerRef.current;

        // Ensure the element is detached from its current position first
        // This prevents duplication by removing it from its current location
        if (elementToMove.parentNode) {
            elementToMove.parentNode.removeChild(elementToMove);
        }

        if (insertAfter === null) {
            // Insert at the beginning
            const firstChild = container.firstElementChild;
            if (firstChild) {
                container.insertBefore(elementToMove, firstChild);
            } else {
                container.appendChild(elementToMove);
            }
        } else {
            // Insert after the specified element
            const nextSibling = insertAfter.nextElementSibling;
            if (nextSibling) {
                container.insertBefore(elementToMove, nextSibling);
            } else {
                container.appendChild(elementToMove);
            }
        }

        console.log('📍 Element moved to new position (no duplication)');
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

        // Show insertion zones while dragging
        showInsertionZones(e.clientY - containerRect.top);
    }, []);

    const handleMouseUp = useCallback((e: React.MouseEvent) => {
        const dragState = dragStateRef.current;

        if (!dragState.isDragging || !dragState.dragElement) return;

        // Clear insertion zones
        clearInsertionZones();

        // Remove global dragging state
        if (containerRef.current) {
            containerRef.current.classList.remove('dragging-active');
        }

        // Check if we're inserting between components
        const shouldInsert = dragState.insertAfter !== undefined;

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

        // Reset positioning for insertion
        if (shouldInsert) {
            dragState.dragElement.style.position = '';
            dragState.dragElement.style.left = '';
            dragState.dragElement.style.top = '';
            dragState.dragElement.style.zIndex = '';
        }

        // Show success bounce animation
        dragState.dragElement.style.transform = 'scale(1.12)';
        setTimeout(() => {
            if (dragState.dragElement) {
                dragState.dragElement.style.transform = '';

                if (shouldInsert) {
                    // Insert element at the specified position
                    insertElementAt(dragState.dragElement, dragState.insertAfter!);

                    // Apply automatic spacing after insertion
                    setTimeout(() => {
                        applyAutomaticSpacing();

                        // Update HTML content after insertion and spacing are complete
                        setTimeout(() => {
                            if (containerRef.current) {
                                onUpdateHtml(containerRef.current.innerHTML);
                            }
                        }, 200);
                    }, 100);
                } else {
                    // Trigger smart rearrangement to make space for the dropped element
                    smartRearrangeComponents(dragState.dragElement);

                    // Update HTML content for regular drops (not insertions)
                    setTimeout(() => {
                        if (containerRef.current) {
                            onUpdateHtml(containerRef.current.innerHTML);
                        }
                    }, 350);
                }
            }
        }, 200);

        console.log('📍 Component dropped successfully', shouldInsert ? '(inserted between components)' : '');

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

    // Smart rearrangement: move other components to make space for the dragged element
    const smartRearrangeComponents = useCallback((draggedElement: HTMLElement) => {
        if (!containerRef.current) return;

        const allElements = Array.from(containerRef.current.querySelectorAll('[data-draggable="true"]')) as HTMLElement[];
        const otherElements = allElements.filter(el => el !== draggedElement);

        if (otherElements.length === 0) return;

        const draggedRect = draggedElement.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        // Convert dragged element position to container-relative coordinates
        const draggedPos = {
            top: draggedRect.top - containerRect.top,
            bottom: draggedRect.bottom - containerRect.top,
            left: draggedRect.left - containerRect.left,
            right: draggedRect.right - containerRect.left,
            centerY: (draggedRect.top + draggedRect.bottom) / 2 - containerRect.top
        };

        console.log('🎯 Smart rearranging around dragged element at Y:', draggedPos.centerY);

        // Sort other elements by their current position
        const elementsWithPositions = otherElements.map(el => {
            const rect = el.getBoundingClientRect();
            const relativeTop = rect.top - containerRect.top;
            const relativeBottom = rect.bottom - containerRect.top;

            return {
                element: el,
                originalTop: relativeTop,
                originalBottom: relativeBottom,
                height: rect.height,
                centerY: (rect.top + rect.bottom) / 2 - containerRect.top
            };
        });

        // Determine which elements need to move
        const elementsToPush = elementsWithPositions.filter(item => {
            // Check if this element overlaps with the dragged element
            const verticalOverlap = !(item.originalBottom < draggedPos.top || item.originalTop > draggedPos.bottom);
            return verticalOverlap;
        });

        // Push overlapping elements down
        elementsToPush.forEach(item => {
            const pushDistance = draggedPos.bottom - item.originalTop + 20; // 20px spacing

            if (pushDistance > 0) {
                item.element.style.transform = `translateY(${pushDistance}px)`;
                item.element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                item.element.style.zIndex = '10';

                console.log(`📦 Pushing element down by ${pushDistance}px`);
            }
        });

        // Arrange non-overlapping elements in natural flow
        const nonOverlappingElements = elementsWithPositions.filter(item => {
            const verticalOverlap = !(item.originalBottom < draggedPos.top || item.originalTop > draggedPos.bottom);
            return !verticalOverlap;
        });

        // Sort non-overlapping elements by their Y position
        nonOverlappingElements.sort((a, b) => a.centerY - b.centerY);

        // Ensure proper spacing for non-overlapping elements
        let currentY = 20; // Start position
        nonOverlappingElements.forEach((item, index) => {
            if (item.centerY < draggedPos.centerY) {
                // Elements above the dragged element
                const targetY = currentY;
                const translateY = targetY - item.originalTop;

                if (Math.abs(translateY) > 5) { // Only move if significant difference
                    item.element.style.transform = `translateY(${translateY}px)`;
                    item.element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    item.element.style.zIndex = '10';
                }

                currentY = targetY + item.height + 20; // Next position
            }
        });

        // Handle elements below the dragged element
        const belowDraggedY = draggedPos.bottom + 20;
        let belowCurrentY = belowDraggedY;

        nonOverlappingElements.forEach(item => {
            if (item.centerY > draggedPos.centerY) {
                const targetY = belowCurrentY;
                const translateY = targetY - item.originalTop;

                if (Math.abs(translateY) > 5) { // Only move if significant difference
                    item.element.style.transform = `translateY(${translateY}px)`;
                    item.element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    item.element.style.zIndex = '10';
                }

                belowCurrentY = targetY + item.height + 20;
            }
        });

    }, []);

    // Reset smart rearrangement transforms
    const resetSmartRearrangement = useCallback(() => {
        if (!containerRef.current) return;

        const allElements = Array.from(containerRef.current.querySelectorAll('[data-draggable="true"]')) as HTMLElement[];

        allElements.forEach(el => {
            if (el.style.transform && el.style.transform.includes('translateY')) {
                el.style.transform = '';
                el.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.zIndex = '';
            }
        });

        console.log('🔄 Reset smart rearrangement transforms');
    }, []);

    // Keyboard shortcuts for layout management
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (!editMode) return;

            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                autoArrangeComponents();
            }

            // Ctrl/Cmd+Shift+R to reset all positioning and flow naturally
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                autoRearrangeIntoFlow();
            }

            // Ctrl/Cmd+Shift+S to reset smart rearrangement transforms
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                resetSmartRearrangement();
            }

            // Ctrl/Cmd+Shift+Space to apply automatic spacing
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'Space') {
                e.preventDefault();
                applyAutomaticSpacing();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [editMode, autoArrangeComponents, autoRearrangeIntoFlow, resetSmartRearrangement, applyAutomaticSpacing]);

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
            {/* Edit Mode Toggle */}
            <div className="edit-mode-toggle-container">
                <label className="edit-mode-toggle">
                    <input
                        type="checkbox"
                        checked={editMode}
                        onChange={(e) => setEditMode(e.target.checked)}
                        className="edit-mode-checkbox"
                    />
                    <span className="edit-mode-slider"></span>
                    <span className="edit-mode-label">
                        {editMode ? '🎯 Edit Mode' : '👁️ View Mode'}
                    </span>
                </label>
            </div>

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
