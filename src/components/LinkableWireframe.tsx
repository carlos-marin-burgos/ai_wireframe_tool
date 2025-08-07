import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../styles/LinkableWireframe.css';

interface LinkableWireframeProps {
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

const LinkableWireframe: React.FC<LinkableWireframeProps> = ({
    htmlContent,
    onUpdateHtml,
    onNavigateToPage,
    availablePages
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showLinkMenu, setShowLinkMenu] = useState(false);
    const [linkMenuPosition, setLinkMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);

    // Drag and drop state
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(null);
    const [showDragHint, setShowDragHint] = useState(false);
    const [dropZones, setDropZones] = useState<HTMLElement[]>([]);
    const [insertionPoint, setInsertionPoint] = useState<{ element: HTMLElement; position: 'before' | 'after' } | null>(null);
    const [snapPreview, setSnapPreview] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

    // Mouse tracking for drag detection
    const [mouseDownElement, setMouseDownElement] = useState<HTMLElement | null>(null);
    const [mouseDownPos, setMouseDownPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [hasMoved, setHasMoved] = useState(false);

    // Debug logging for props changes
    useEffect(() => {
        console.log('🔄 LinkableWireframe: htmlContent changed', {
            length: htmlContent?.length || 0,
            preview: htmlContent?.substring(0, 100) + '...',
            hasContent: !!htmlContent
        });
    }, [htmlContent]);

    // Debug logging
    console.log('LinkableWireframe mounted with:', {
        htmlContent: htmlContent?.substring(0, 100) + '...',
        availablePages: availablePages,
        availablePagesCount: availablePages.length
    });

    // Check if an element is linkable (button, link, or has specific data attributes)
    const isLinkableElement = useCallback((element: HTMLElement): boolean => {
        const tagName = element.tagName.toLowerCase();
        const hasLinkAttribute = element.hasAttribute('data-linkable') ||
            element.hasAttribute('data-page-link');

        // Common button/link patterns
        const hasButtonClass = element.classList.contains('button') ||
            element.classList.contains('btn') ||
            element.classList.contains('link') ||
            element.classList.contains('cta') ||
            element.classList.contains('primary') ||
            element.classList.contains('secondary') ||
            element.classList.contains('card') ||
            element.classList.contains('clickable');

        // Check if it's styled like a button (has cursor pointer or specific styling)
        const computedStyle = window.getComputedStyle(element);
        const looksClickable = computedStyle.cursor === 'pointer' ||
            computedStyle.cursor === 'hand';

        // Check if element has click-like text content
        const hasActionText = /^(click|learn|view|get|start|sign|join|book|call|contact|about|home|services|portfolio|blog)/i.test(element.textContent?.trim() || '');

        const isLinkable = tagName === 'button' ||
            tagName === 'a' ||
            hasLinkAttribute ||
            hasButtonClass ||
            element.role === 'button' ||
            looksClickable ||
            hasActionText;

        // Debug logging
        if (element.textContent && element.textContent.trim()) {
            console.log(`Checking element: "${element.textContent.trim()}"`, {
                tagName,
                hasLinkAttribute,
                hasButtonClass,
                looksClickable,
                hasActionText,
                isLinkable,
                classList: Array.from(element.classList),
                cursor: computedStyle.cursor
            });
        }

        return isLinkable;
    }, []);

    // Check if an element is draggable (Atlas components or positioned elements)
    const isDraggableElement = useCallback((element: HTMLElement): boolean => {
        // Check if it's an Atlas component or has specific draggable indicators
        const hasAtlasClass = element.classList.contains('atlas-component') ||
            element.classList.contains('component-container') ||
            element.classList.contains('card') ||
            element.classList.contains('button') ||
            element.classList.contains('form-group') ||
            element.classList.contains('hero-section') ||
            element.classList.contains('nav-section');

        // Check if it has absolute positioning (likely a placed component)
        const computedStyle = window.getComputedStyle(element);
        const isPositioned = computedStyle.position === 'absolute' ||
            computedStyle.position === 'relative';

        // Check if it's a significant container element
        const isContainer = element.tagName.toLowerCase() === 'div' &&
            (element.children.length > 0 || element.textContent?.trim());

        // Check if it has draggable data attribute
        const hasDraggableAttr = element.hasAttribute('data-draggable') ||
            element.getAttribute('draggable') === 'true';

        const isDraggable = Boolean(hasAtlasClass || isPositioned || isContainer || hasDraggableAttr);

        // Add accessibility attributes for draggable elements
        if (isDraggable) {
            element.setAttribute('role', 'button');
            element.setAttribute('aria-grabbed', 'false');
            element.setAttribute('tabindex', '0');
            element.setAttribute('aria-label', `Draggable ${element.tagName.toLowerCase()} element. Press Enter or Space to select, then use arrow keys to move.`);
        }

        return isDraggable;
    }, []);

    // Handle mouse down - Start tracking potential drag
    const handleMouseDown = useCallback((event: React.MouseEvent, element: HTMLElement) => {
        // Only track left clicks on draggable elements
        if (event.button !== 0 || !isDraggableElement(element)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        setMouseDownElement(element);
        setMouseDownPos({ x: event.clientX, y: event.clientY });
        setHasMoved(false);
        setSelectedElement(element);

        console.log('🎯 Mouse down on:', element.tagName, element.className);
    }, [isDraggableElement]);

    // Handle mouse up - Complete click or cleanup drag tracking
    const handleMouseUp = useCallback((event: React.MouseEvent) => {
        if (mouseDownElement && !hasMoved) {
            // This was a simple click, not a drag
            console.log('🎯 Simple click on:', mouseDownElement.tagName);
            // Don't convert to absolute positioning
        }

        // Reset tracking
        setMouseDownElement(null);
        setMouseDownPos({ x: 0, y: 0 });
        setHasMoved(false);

        // Handle drag end if we were dragging
        if (isDragging) {
            handleDragEnd();
        }
    }, [mouseDownElement, hasMoved, isDragging]);

    // Handle drag start - Fixed positioning with accessibility
    const handleDragStart = useCallback((event: React.MouseEvent, element: HTMLElement) => {
        event.preventDefault();
        event.stopPropagation();

        const rect = element.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();

        if (containerRect) {
            // Calculate correct offset relative to container
            setDragOffset({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            });

            setDraggedElement(element);
            setIsDragging(true);
            setSelectedElement(element);

            // Ensure element has absolute positioning from the start
            if (element.style.position !== 'absolute') {
                const currentLeft = rect.left - containerRect.left;
                const currentTop = rect.top - containerRect.top;

                // Make sure we don't set negative or invalid positions
                const safeLeft = Math.max(0, currentLeft);
                const safeTop = Math.max(0, currentTop);

                element.style.position = 'absolute';
                element.style.left = `${safeLeft}px`;
                element.style.top = `${safeTop}px`;

                console.log('🎯 Converting to absolute:', { currentLeft, currentTop, safeLeft, safeTop });
            }

            // Visual feedback
            element.style.zIndex = '1000';
            element.style.opacity = '0.7';
            element.style.cursor = 'grabbing';
            element.style.transform = 'scale(1.02)';
            element.setAttribute('data-dragging', 'true');

            // Accessibility: Announce drag start
            element.setAttribute('aria-grabbed', 'true');
            element.setAttribute('aria-describedby', 'drag-instructions');

            console.log('🎯 Drag started:', element.tagName, element.className);
        }
    }, []);

    // Handle mouse move - Detect if this is a drag operation OR continue existing drag
    const handleMouseMoveTracking = useCallback((event: React.MouseEvent) => {
        // If we're already dragging, continue the drag
        if (isDragging && draggedElement && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const newLeft = Math.max(0, event.clientX - containerRect.left - dragOffset.x);
            const newTop = Math.max(0, event.clientY - containerRect.top - dragOffset.y);

            draggedElement.style.left = `${newLeft}px`;
            draggedElement.style.top = `${newTop}px`;
            return;
        }

        // If we have a mouse down but haven't started dragging yet, check for movement
        if (mouseDownElement && !isDragging) {
            const deltaX = Math.abs(event.clientX - mouseDownPos.x);
            const deltaY = Math.abs(event.clientY - mouseDownPos.y);
            const threshold = 5; // pixels to start drag

            if (deltaX > threshold || deltaY > threshold) {
                setHasMoved(true);
                // Now start the actual drag
                handleDragStart(event, mouseDownElement);
            }
        }
    }, [mouseDownElement, mouseDownPos, isDragging, draggedElement, dragOffset]);

    // Handle drag move - Simplified for smooth experience
    const handleDragMove = useCallback((event: React.MouseEvent) => {
        if (!isDragging || !draggedElement || !containerRef.current) return;

        event.preventDefault();

        const containerRect = containerRef.current.getBoundingClientRect();
        const newX = event.clientX - containerRect.left - dragOffset.x;
        const newY = event.clientY - containerRect.top - dragOffset.y;

        // Simple boundary constraints
        const maxX = containerRect.width - draggedElement.offsetWidth;
        const maxY = containerRect.height - draggedElement.offsetHeight;

        const boundedX = Math.max(0, Math.min(maxX, newX));
        const boundedY = Math.max(0, Math.min(maxY, newY));

        // Update position smoothly
        draggedElement.style.position = 'absolute';
        draggedElement.style.left = `${boundedX}px`;
        draggedElement.style.top = `${boundedY}px`;
    }, [isDragging, draggedElement, dragOffset]);    // Helper function to find the closest drop zone
    const findClosestDropZone = (x: number, y: number) => {
        const elements = document.querySelectorAll('.wireframe-container, .wireframe-element-container');
        let closestElement = null;
        let minDistance = Infinity;

        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

            if (distance < minDistance && element !== draggedElement) {
                minDistance = distance;
                closestElement = element as HTMLElement;
            }
        });

        return minDistance < 100 ? closestElement : null;
    };

    // Helper function to detect collisions
    const detectCollisions = (element: HTMLElement, x: number, y: number) => {
        const rect = element.getBoundingClientRect();
        const elementRect = {
            left: x,
            top: y,
            right: x + rect.width,
            bottom: y + rect.height
        };

        const siblings = Array.from(element.parentElement?.children || [])
            .filter(child => child !== element && child.classList.contains('wireframe-element'));

        return siblings.filter(sibling => {
            const siblingRect = sibling.getBoundingClientRect();
            return !(elementRect.right < siblingRect.left ||
                elementRect.left > siblingRect.right ||
                elementRect.bottom < siblingRect.top ||
                elementRect.top > siblingRect.bottom);
        });
    };

    // Helper function to find insertion point
    const findInsertionPoint = (x: number, y: number, container: HTMLElement) => {
        const children = Array.from(container.children)
            .filter(child => child !== draggedElement && child.classList.contains('wireframe-element'));

        let insertionPoint = null;
        let minDistance = Infinity;

        children.forEach(child => {
            const rect = child.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const distance = Math.abs(y - centerY);

            if (distance < minDistance) {
                minDistance = distance;
                insertionPoint = {
                    element: child as HTMLElement,
                    position: y < centerY ? 'before' : 'after'
                };
            }
        });

        return insertionPoint;
    };

    // Helper function to snap to grid
    const snapToGrid = (x: number, y: number, gridSize = 10) => {
        return {
            x: Math.round(x / gridSize) * gridSize,
            y: Math.round(y / gridSize) * gridSize
        };
    };

    // Handle drag end - Fixed cleanup with accessibility
    const handleDragEnd = useCallback(() => {
        if (!draggedElement) return;

        // Clean reset of visual feedback
        draggedElement.style.zIndex = '';
        draggedElement.style.opacity = '';
        draggedElement.style.cursor = '';
        draggedElement.style.transform = '';
        draggedElement.removeAttribute('data-dragging');

        // Accessibility: Announce drag end
        draggedElement.setAttribute('aria-grabbed', 'false');
        draggedElement.removeAttribute('aria-describedby');

        // Reset state
        setIsDragging(false);
        setDraggedElement(null);

        // Update the HTML content
        if (containerRef.current && onUpdateHtml) {
            onUpdateHtml(containerRef.current.innerHTML);
        }

        console.log('🎯 Drag completed');
    }, [draggedElement, onUpdateHtml]);

    // Keyboard movement for accessibility
    const moveElementWithKeyboard = useCallback((element: HTMLElement, direction: string) => {
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const rect = element.getBoundingClientRect();

        // Ensure element has absolute positioning
        if (element.style.position !== 'absolute') {
            const currentLeft = rect.left - containerRect.left;
            const currentTop = rect.top - containerRect.top;
            element.style.position = 'absolute';
            element.style.left = `${currentLeft}px`;
            element.style.top = `${currentTop}px`;
        }

        const currentLeft = parseInt(element.style.left) || 0;
        const currentTop = parseInt(element.style.top) || 0;
        const step = 10; // 10px movement per arrow key press

        let newLeft = currentLeft;
        let newTop = currentTop;

        switch (direction) {
            case 'ArrowLeft':
                newLeft = Math.max(0, currentLeft - step);
                break;
            case 'ArrowRight':
                newLeft = Math.min(containerRect.width - element.offsetWidth, currentLeft + step);
                break;
            case 'ArrowUp':
                newTop = Math.max(0, currentTop - step);
                break;
            case 'ArrowDown':
                newTop = Math.min(containerRect.height - element.offsetHeight, currentTop + step);
                break;
        }

        element.style.left = `${newLeft}px`;
        element.style.top = `${newTop}px`;

        // Update HTML content
        if (onUpdateHtml) {
            onUpdateHtml(containerRef.current.innerHTML);
        }

        console.log(`🎯 Keyboard moved element ${direction}: ${newLeft}, ${newTop}`);
    }, [onUpdateHtml]);    // Auto-arrange elements to prevent overlaps
    const autoArrangeElements = (container: HTMLElement) => {
        const elements = Array.from(container.children)
            .filter(child => child.classList.contains('wireframe-element')) as HTMLElement[];

        if (elements.length <= 1) return;

        // Add arranging class for visual feedback
        elements.forEach(el => el.classList.add('auto-arranging'));

        // Sort elements by their current top position
        elements.sort((a, b) => {
            const aRect = a.getBoundingClientRect();
            const bRect = b.getBoundingClientRect();
            return aRect.top - bRect.top;
        });

        // Arrange elements with proper spacing
        let currentY = 20; // Start margin
        const spacing = 10;

        elements.forEach((element, index) => {
            // Check if element overlaps with previous elements
            const rect = element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            // Calculate relative position
            const relativeY = currentY;

            // Apply position if there's overlap or if element is too close
            if (rect.top - containerRect.top < currentY - spacing) {
                element.style.position = 'absolute';
                element.style.top = `${relativeY}px`;
                element.style.left = element.style.left || '20px'; // Maintain horizontal position

                // Show completion feedback after animation
                setTimeout(() => {
                    element.classList.remove('auto-arranging');
                    element.classList.add('auto-arranged');
                    setTimeout(() => element.classList.remove('auto-arranged'), 500);
                }, index * 100); // Stagger the feedback
            } else {
                // Remove arranging class if no changes needed
                setTimeout(() => element.classList.remove('auto-arranging'), index * 100);
            }

            // Update currentY for next element
            currentY += element.offsetHeight + spacing;
        });
    };    // Handle click on linkable elements
    const handleElementClick = useCallback((event: MouseEvent) => {
        const target = event.target as HTMLElement;
        console.log('Element clicked:', target, 'Text:', target.textContent);

        // Check if the clicked element is a toolbar button - if so, don't interfere
        if (target.closest('.toolbar-btn') || target.classList.contains('toolbar-btn')) {
            console.log('🔧 Toolbar button clicked, allowing event to proceed');
            return; // Don't prevent toolbar button clicks
        }

        // Check if the clicked element or its parent is linkable
        let linkableElement = target;
        let depth = 0;
        while (linkableElement && depth < 5) {
            console.log(`Checking element at depth ${depth}:`, linkableElement, 'Is linkable:', isLinkableElement(linkableElement));
            if (isLinkableElement(linkableElement)) {
                break;
            }
            linkableElement = linkableElement.parentElement as HTMLElement;
            depth++;
        }

        if (!linkableElement || !isLinkableElement(linkableElement)) {
            console.log('No linkable element found');
            setShowLinkMenu(false);
            setSelectedElement(null);
            return;
        }

        console.log('Found linkable element:', linkableElement);

        // Check if element already has a page link
        const existingLink = linkableElement.getAttribute('data-page-link');
        if (existingLink && availablePages.find(p => p.id === existingLink)) {
            console.log('Navigating to existing link:', existingLink);
            // Navigate to existing link
            event.preventDefault();
            onNavigateToPage(existingLink);
            return;
        }

        // Show link menu for new links
        event.preventDefault();
        const rect = linkableElement.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();

        if (containerRect) {
            setLinkMenuPosition({
                x: rect.left - containerRect.left + rect.width / 2,
                y: rect.bottom - containerRect.top + 10
            });
            setSelectedElement(linkableElement);
            setShowLinkMenu(true);
        }
    }, [isLinkableElement, availablePages, onNavigateToPage]);

    // Set up click listeners
    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            console.log('❌ No container ref found');
            return;
        }

        console.log('✅ Setting up click listeners on container:', container);

        // Use capture phase to ensure we catch all clicks
        const handleClickCapture = (event: Event) => {
            const target = event.target as HTMLElement;
            console.log('🎯 Click captured!', target);

            // Check if the clicked element is a toolbar button - if so, don't interfere
            if (target.closest('.toolbar-btn') || target.classList.contains('toolbar-btn')) {
                console.log('🔧 Toolbar button clicked in capture, allowing event to proceed');
                return; // Don't handle toolbar button clicks
            }

            handleElementClick(event as MouseEvent);
        };

        // Add both regular and capture listeners for better coverage
        container.addEventListener('click', handleElementClick);
        container.addEventListener('click', handleClickCapture, true);

        // Also try adding to document for debugging
        const documentClickHandler = (event: Event) => {
            console.log('📄 Document click:', event.target);
        };
        document.addEventListener('click', documentClickHandler);

        return () => {
            container.removeEventListener('click', handleElementClick);
            container.removeEventListener('click', handleClickCapture, true);
            document.removeEventListener('click', documentClickHandler);
        };
    }, [handleElementClick]);

    // Add link to element
    const handleAddLink = useCallback((pageId: string) => {
        if (!selectedElement) return;

        selectedElement.setAttribute('data-page-link', pageId);
        selectedElement.style.cursor = 'pointer';
        selectedElement.style.position = 'relative';        // Add visual indicator for linked elements
        if (!selectedElement.querySelector('.link-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'link-indicator';
            indicator.innerHTML = '🔗';
            indicator.title = `Links to: ${availablePages.find(p => p.id === pageId)?.name}`;
            selectedElement.appendChild(indicator);
        }

        // Update the HTML
        if (containerRef.current) {
            onUpdateHtml(containerRef.current.innerHTML);
        }

        setShowLinkMenu(false);
        setSelectedElement(null);
    }, [selectedElement, availablePages, onUpdateHtml]);

    // Remove link from element
    const handleRemoveLink = useCallback(() => {
        if (!selectedElement) return;

        selectedElement.removeAttribute('data-page-link');
        selectedElement.style.cursor = '';

        // Remove visual indicator
        const indicator = selectedElement.querySelector('.link-indicator');
        if (indicator) {
            indicator.remove();
        }

        // Update the HTML
        if (containerRef.current) {
            onUpdateHtml(containerRef.current.innerHTML);
        }

        setShowLinkMenu(false);
        setSelectedElement(null);
    }, [selectedElement, onUpdateHtml]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.link-menu') && !target.closest('[data-linkable]')) {
                setShowLinkMenu(false);
                setSelectedElement(null);
            }
        };

        if (showLinkMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showLinkMenu]);

    // Global mouse event listeners for drag functionality
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (isDragging && draggedElement && containerRef.current) {
                e.preventDefault();
                const containerRect = containerRef.current.getBoundingClientRect();

                // Calculate precise position with better bounds checking
                const newX = e.clientX - containerRect.left - dragOffset.x;
                const newY = e.clientY - containerRect.top - dragOffset.y;

                // Get element dimensions for better boundary calculations
                const elementRect = draggedElement.getBoundingClientRect();
                const maxX = containerRect.width - elementRect.width;
                const maxY = containerRect.height - elementRect.height;

                // Constrain to container bounds with smooth movement
                const constrainedX = Math.max(0, Math.min(maxX, newX));
                const constrainedY = Math.max(0, Math.min(maxY, newY));

                // Use transform instead of changing position properties to preserve layout
                draggedElement.style.transform = `translate(${constrainedX}px, ${constrainedY}px)`;
                draggedElement.style.position = 'absolute';
                draggedElement.style.left = '0';
                draggedElement.style.top = '0';
            }
        };

        const handleGlobalMouseUp = () => {
            if (isDragging && draggedElement) {
                // Reset visual feedback more cleanly
                draggedElement.style.zIndex = '';
                draggedElement.style.opacity = '';
                draggedElement.style.cursor = '';
                draggedElement.style.transition = 'transform 0.2s ease-out';
                draggedElement.removeAttribute('data-dragging');

                // Store final position using data attributes for persistence
                const finalTransform = draggedElement.style.transform;
                if (finalTransform && finalTransform.includes('translate')) {
                    draggedElement.setAttribute('data-position', finalTransform);
                }

                setIsDragging(false);
                setDraggedElement(null);

                if (containerRef.current && onUpdateHtml) {
                    onUpdateHtml(containerRef.current.innerHTML);
                }
            }
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleGlobalMouseMove);
                document.removeEventListener('mouseup', handleGlobalMouseUp);
            };
        }
    }, [isDragging, draggedElement, dragOffset, onUpdateHtml]);

    // Add component mount/unmount logging
    useEffect(() => {
        console.log('🚀 LinkableWireframe component mounted');
        return () => {
            console.log('💀 LinkableWireframe component unmounted');
        };
    }, []);

    // Clean HTML content before rendering
    const cleanHtmlContent = React.useMemo(() => {
        if (!htmlContent || typeof htmlContent !== 'string') {
            return '';
        }

        let cleaned = htmlContent.trim();
        // Remove any markdown artifacts or unwanted prefixes
        cleaned = cleaned.replace(/^[0'"]+|[0'"]+$/g, '');
        cleaned = cleaned.replace(/^'''html\s*/gi, '');
        cleaned = cleaned.replace(/^```html\s*/gi, '');
        cleaned = cleaned.replace(/```\s*$/gi, '');

        return cleaned.trim();
    }, [htmlContent]);

    return (
        <div
            className="linkable-wireframe"
            ref={containerRef}
            onMouseMove={handleMouseMoveTracking}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            role="application"
            aria-label="Wireframe editor - drag and drop elements to rearrange them"
        >
            {/* Hidden accessibility instructions */}
            <div id="drag-instructions" className="sr-only">
                Use mouse to drag elements around the wireframe.
                Elements will stay within the container boundaries.
                Press Escape to cancel dragging.
            </div>

            {(cleanHtmlContent && cleanHtmlContent.length > 0) ? (
                <div
                    dangerouslySetInnerHTML={{ __html: cleanHtmlContent }}
                    onMouseDown={(e) => {
                        const target = e.target as HTMLElement;

                        // Check if it's a right-click for context menu (links)
                        if (e.button === 2 && isLinkableElement(target)) {
                            handleElementClick(e.nativeEvent);
                            return;
                        }

                        // Check if it's draggable for left-click - START TRACKING, don't drag yet
                        if (e.button === 0 && isDraggableElement(target)) {
                            handleMouseDown(e, target);
                        }
                    }}
                    onKeyDown={(e) => {
                        const target = e.target as HTMLElement;

                        // Keyboard accessibility for dragging
                        if (isDraggableElement(target)) {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                // For now, just focus the element - could extend with keyboard dragging
                                target.focus();
                                console.log('🎯 Element selected via keyboard:', target.tagName);
                            }

                            // Arrow key movement for accessibility
                            if (selectedElement === target && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                e.preventDefault();
                                moveElementWithKeyboard(target, e.key);
                            }
                        }

                        // Escape to cancel any drag operation
                        if (e.key === 'Escape' && isDragging) {
                            handleDragEnd();
                        }
                    }}
                />
            ) : (
                <div className="empty-page">
                    <div className="empty-page-content">
                        <h3>📄 Empty Page</h3>
                        <p>This page doesn't have any content yet.</p>
                        <p>Ask the AI to generate content for this page, or copy content from another page.</p>
                    </div>
                </div>
            )}

            {showLinkMenu && (
                <div
                    className="link-menu"
                    style={{
                        '--menu-x': `${linkMenuPosition.x}px`,
                        '--menu-y': `${linkMenuPosition.y}px`
                    } as React.CSSProperties}
                >
                    <div className="link-menu-header">
                        <h4>Link to Page</h4>
                        <button
                            className="close-menu"
                            onClick={() => setShowLinkMenu(false)}
                        >
                            ×
                        </button>
                    </div>

                    <div className="link-menu-content">
                        {availablePages.length > 0 ? (
                            <div className="page-options">
                                {availablePages.map((page) => (
                                    <button
                                        key={page.id}
                                        className="page-option"
                                        onClick={() => handleAddLink(page.id)}
                                    >
                                        <span className="page-icon">
                                            {page.type === 'page' && '📄'}
                                            {page.type === 'modal' && '🔲'}
                                            {page.type === 'component' && '🧩'}
                                        </span>
                                        <div className="page-info">
                                            <div className="page-name">{page.name}</div>
                                            <div className="page-description">{page.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="no-pages">
                                <p>No pages available to link to.</p>
                                <p>Create some pages first!</p>
                            </div>
                        )}

                        {selectedElement?.hasAttribute('data-page-link') && (
                            <div className="link-actions">
                                <button
                                    className="remove-link"
                                    onClick={handleRemoveLink}
                                >
                                    Remove Link
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LinkableWireframe;
