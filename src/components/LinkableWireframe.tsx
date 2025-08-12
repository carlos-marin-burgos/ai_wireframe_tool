import React, { useCallback, useEffect, useRef, useState } from 'react';
import { fixWireframeImages } from '../utils/imagePlaceholders';
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

    // Enhanced drag and drop state
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(null);
    const [showDragHint, setShowDragHint] = useState(false);
    const [dropZones, setDropZones] = useState<HTMLElement[]>([]);
    const [insertionPoint, setInsertionPoint] = useState<{ element: HTMLElement; position: 'before' | 'after' } | null>(null);
    const [snapPreview, setSnapPreview] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

    // Enhanced fancy drag states
    const [dragGhost, setDragGhost] = useState<HTMLElement | null>(null);
    const [snapPoints, setSnapPoints] = useState<Array<{ x: number; y: number; type: 'grid' | 'element' | 'edge' }>>([]);
    const [nearestSnapPoint, setNearestSnapPoint] = useState<{ x: number; y: number; type: string } | null>(null);
    const [isRearranging, setIsRearranging] = useState(false);
    const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number; type: 'success' | 'drag' | 'snap' }>>([]);
    const [rippleEffect, setRippleEffect] = useState<{ x: number; y: number; timestamp: number } | null>(null);
    const [magneticAreas, setMagneticAreas] = useState<Array<{ x: number; y: number; width: number; height: number; element: HTMLElement }>>([]);

    // Mouse tracking for drag detection
    const [mouseDownElement, setMouseDownElement] = useState<HTMLElement | null>(null);
    const [mouseDownPos, setMouseDownPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [hasMoved, setHasMoved] = useState(false);

    // Track content changes

    // Component initialization

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
        // Don't allow direct dragging of input/textarea elements - only their containers
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
            return false;
        }

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

        // Check if it's a significant container element (but not input elements)
        const isContainer = element.tagName.toLowerCase() === 'div' &&
            (element.children.length > 0 || element.textContent?.trim()) &&
            !element.closest('input, textarea, select');

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

    // Enhanced helper functions for fancy drag effects

    // Generate snap points for magnetic alignment
    const generateSnapPoints = useCallback((container: HTMLElement, excludeElement?: HTMLElement) => {
        const points: Array<{ x: number; y: number; type: 'grid' | 'element' | 'edge' }> = [];
        const containerRect = container.getBoundingClientRect();
        const containerStyles = window.getComputedStyle(container);
        const padding = parseInt(containerStyles.paddingLeft) || 20;

        // Grid snap points (every 20px)
        const gridSize = 20;
        for (let x = padding; x < containerRect.width - padding; x += gridSize) {
            for (let y = padding; y < containerRect.height - padding; y += gridSize) {
                points.push({ x, y, type: 'grid' });
            }
        }

        // Element-based snap points (edges and centers of other elements)
        const elements = container.querySelectorAll('[data-user-added="true"]');
        elements.forEach(el => {
            if (el === excludeElement) return;

            const rect = el.getBoundingClientRect();
            const relativeRect = {
                left: rect.left - containerRect.left,
                top: rect.top - containerRect.top,
                right: rect.right - containerRect.left,
                bottom: rect.bottom - containerRect.top,
                centerX: (rect.left + rect.right) / 2 - containerRect.left,
                centerY: (rect.top + rect.bottom) / 2 - containerRect.top
            };

            // Add snap points for element edges and center
            points.push(
                { x: relativeRect.left, y: relativeRect.centerY, type: 'element' },
                { x: relativeRect.right, y: relativeRect.centerY, type: 'element' },
                { x: relativeRect.centerX, y: relativeRect.top, type: 'element' },
                { x: relativeRect.centerX, y: relativeRect.bottom, type: 'element' },
                { x: relativeRect.centerX, y: relativeRect.centerY, type: 'element' }
            );
        });

        // Container edge snap points
        points.push(
            { x: padding, y: padding, type: 'edge' },
            { x: containerRect.width - padding, y: padding, type: 'edge' },
            { x: padding, y: containerRect.height - padding, type: 'edge' },
            { x: containerRect.width - padding, y: containerRect.height - padding, type: 'edge' }
        );

        return points;
    }, []);

    // Find nearest snap point for magnetic effect
    const findNearestSnapPoint = useCallback((x: number, y: number, snapPoints: Array<{ x: number; y: number; type: string }>) => {
        const snapDistance = 15; // Pixels to trigger snap
        let nearest = null;
        let minDistance = snapDistance;

        snapPoints.forEach(point => {
            const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
            if (distance < minDistance) {
                minDistance = distance;
                nearest = point;
            }
        });

        return nearest;
    }, []);

    // Create particle effect at position
    const createParticleEffect = useCallback((x: number, y: number, type: 'success' | 'drag' | 'snap') => {
        const particleId = `particle_${Date.now()}_${Math.random()}`;
        const newParticle = { id: particleId, x, y, type };

        setParticles(prev => [...prev, newParticle]);

        // Auto-remove particle after animation
        setTimeout(() => {
            setParticles(prev => prev.filter(p => p.id !== particleId));
        }, 1000);
    }, []);

    // Create ripple effect at mouse position
    const createRippleEffect = useCallback((x: number, y: number) => {
        setRippleEffect({ x, y, timestamp: Date.now() });

        // Clear ripple after animation
        setTimeout(() => {
            setRippleEffect(null);
        }, 600);
    }, []);

    // Smart auto-arrangement with smooth animations
    const smartAutoArrange = useCallback((container: HTMLElement, newElement?: HTMLElement) => {
        setIsRearranging(true);

        const elements = Array.from(container.children)
            .filter(child => {
                const el = child as HTMLElement;
                return el.hasAttribute('data-user-added') &&
                    el !== draggedElement &&
                    !el.classList.contains('delete-btn') &&
                    !el.classList.contains('link-indicator');
            }) as HTMLElement[];

        if (newElement && !elements.includes(newElement)) {
            elements.push(newElement);
        }

        if (elements.length <= 1) {
            setIsRearranging(false);
            return;
        }

        // Sort elements by priority: buttons first, then cards, then others
        elements.sort((a, b) => {
            const getPriority = (el: HTMLElement) => {
                if (el.tagName === 'BUTTON' || el.classList.contains('btn')) return 3;
                if (el.classList.contains('card')) return 2;
                return 1;
            };
            return getPriority(b) - getPriority(a);
        });

        // Calculate optimal positions with spacing
        const containerRect = container.getBoundingClientRect();
        const padding = 20;
        const spacing = 15;
        let currentY = padding;
        const centerX = containerRect.width / 2;

        elements.forEach((element, index) => {
            // Add staggered animation class
            element.classList.add('auto-arranging');
            element.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.transitionDelay = `${index * 0.1}s`;

            // Calculate position based on element type and content
            const elementRect = element.getBoundingClientRect();
            let targetX = centerX - elementRect.width / 2;

            // Adjust for buttons vs cards
            if (element.classList.contains('card')) {
                targetX = padding; // Cards align to left
            }

            // Ensure element stays within bounds
            targetX = Math.max(padding, Math.min(containerRect.width - elementRect.width - padding, targetX));

            // Set new position
            element.style.position = 'absolute';
            element.style.left = `${targetX}px`;
            element.style.top = `${currentY}px`;
            element.style.zIndex = '10';

            // Update Y position for next element
            currentY += elementRect.height + spacing;

            // Create success particle effect
            setTimeout(() => {
                createParticleEffect(targetX + elementRect.width / 2, currentY - spacing / 2, 'success');
                element.classList.remove('auto-arranging');
                element.classList.add('auto-arranged');

                // Remove animation classes after completion
                setTimeout(() => {
                    element.classList.remove('auto-arranged');
                    element.style.transition = '';
                    element.style.transitionDelay = '';
                }, 300);
            }, index * 100 + 400);
        });

        // Update container minimum height to accommodate all elements
        if (currentY > containerRect.height) {
            container.style.minHeight = `${currentY + padding}px`;
        }

        setTimeout(() => setIsRearranging(false), elements.length * 100 + 500);
    }, [draggedElement, createParticleEffect]);

    // Detect and resolve overlapping elements
    const detectAndResolveOverlaps = useCallback((container: HTMLElement, movedElement: HTMLElement) => {
        const elements = Array.from(container.children)
            .filter(child => {
                const el = child as HTMLElement;
                return el.hasAttribute('data-user-added') &&
                    el !== movedElement &&
                    !el.classList.contains('delete-btn') &&
                    !el.classList.contains('link-indicator');
            }) as HTMLElement[];

        const movedRect = movedElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const overlapping = elements.filter(el => {
            const rect = el.getBoundingClientRect();
            return !(movedRect.right < rect.left ||
                movedRect.left > rect.right ||
                movedRect.bottom < rect.top ||
                movedRect.top > rect.bottom);
        });

        if (overlapping.length > 0) {
            // Push overlapping elements away smoothly
            overlapping.forEach(el => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2 - containerRect.left;
                const centerY = rect.top + rect.height / 2 - containerRect.top;
                const movedCenterX = movedRect.left + movedRect.width / 2 - containerRect.left;
                const movedCenterY = movedRect.top + movedRect.height / 2 - containerRect.top;

                // Calculate push direction
                const deltaX = centerX - movedCenterX;
                const deltaY = centerY - movedCenterY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                if (distance > 0) {
                    const pushDistance = 80; // Minimum separation distance
                    const normalizedX = deltaX / distance;
                    const normalizedY = deltaY / distance;

                    const newX = movedCenterX + normalizedX * pushDistance - rect.width / 2;
                    const newY = movedCenterY + normalizedY * pushDistance - rect.height / 2;

                    // Ensure element stays within bounds
                    const boundedX = Math.max(20, Math.min(containerRect.width - rect.width - 20, newX));
                    const boundedY = Math.max(20, Math.min(containerRect.height - rect.height - 20, newY));

                    // Apply smooth transition
                    el.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    el.style.left = `${boundedX}px`;
                    el.style.top = `${boundedY}px`;

                    // Create particle effect for push
                    createParticleEffect(boundedX + rect.width / 2, boundedY + rect.height / 2, 'drag');

                    // Clear transition after animation
                    setTimeout(() => {
                        el.style.transition = '';
                    }, 300);
                }
            });
        }
    }, [createParticleEffect]);

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
            // This was a simple click, not a drag - DO NOTHING TO POSITIONING
            console.log('🎯 Simple click detected on:', mouseDownElement.tagName, '- no positioning changes');
        }

        // Reset tracking
        setMouseDownElement(null);
        setMouseDownPos({ x: 0, y: 0 });
        setHasMoved(false);

        // Handle drag end if we were dragging
        if (isDragging) {
            console.log('🎯 Ending drag operation');
            handleDragEnd();
        }
    }, [mouseDownElement, hasMoved, isDragging]);

    // Enhanced drag start with fancy effects
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

            // Generate snap points for this drag session
            const points = generateSnapPoints(containerRef.current, element);
            setSnapPoints(points);

            // Create ripple effect at drag start position
            createRippleEffect(event.clientX - containerRect.left, event.clientY - containerRect.top);

                    // Remove any existing ghost elements first
            const existingGhosts = containerRef.current.querySelectorAll('.drag-ghost');
            existingGhosts.forEach(ghost => ghost.remove());

            // Create drag ghost element for enhanced visual feedback
            const ghost = element.cloneNode(true) as HTMLElement;
            ghost.classList.add('drag-ghost');
            ghost.style.position = 'absolute';
            ghost.style.pointerEvents = 'none';
            ghost.style.opacity = '0.6';
            ghost.style.transform = 'scale(0.95) rotate(2deg)';
            ghost.style.zIndex = '999';
            ghost.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
            containerRef.current.appendChild(ghost);
            setDragGhost(ghost);

            // ONLY convert to absolute positioning if it's not already positioned correctly
            const isAlreadyAbsolute = element.style.position === 'absolute';

            if (!isAlreadyAbsolute) {
                // Store the original position before conversion
                const computedStyle = window.getComputedStyle(element);
                const originalRect = element.getBoundingClientRect();

                // Calculate where it should be positioned
                const currentLeft = originalRect.left - containerRect.left;
                const currentTop = originalRect.top - containerRect.top;

                // Make sure we don't set negative or invalid positions
                const safeLeft = Math.max(0, currentLeft);
                const safeTop = Math.max(0, currentTop);

                // Set the position to match its current visual location
                element.style.position = 'absolute';
                element.style.left = `${safeLeft}px`;
                element.style.top = `${safeTop}px`;

                // Preserve the element's original size
                element.style.width = computedStyle.width;
                element.style.height = computedStyle.height;

                // Mark as user-modified since it's now being repositioned
                element.setAttribute('data-user-added', 'true');

                console.log('🎯 Converting to absolute and marking as user-added:', {
                    original: { left: originalRect.left, top: originalRect.top },
                    container: { left: containerRect.left, top: containerRect.top },
                    calculated: { left: currentLeft, top: currentTop },
                    safe: { left: safeLeft, top: safeTop }
                });
            }

            // Enhanced visual feedback with fancy animations
            element.style.zIndex = '1000';
            element.style.cursor = 'grabbing';
            element.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.transform = 'scale(1.05) rotate(-1deg)';
            element.style.boxShadow = '0 8px 25px rgba(0, 123, 212, 0.3), 0 4px 12px rgba(0, 123, 212, 0.2)';
            element.style.border = '2px solid rgba(0, 123, 212, 0.6)';
            element.style.filter = 'brightness(1.1) saturate(1.2)';
            element.setAttribute('data-dragging', 'true');

            // Add pulsing glow effect
            element.classList.add('fancy-dragging');

            // Add global drag state
            document.body.classList.add('dragging-active');

            // Accessibility: Announce drag start
            element.setAttribute('aria-grabbed', 'true');
            element.setAttribute('aria-describedby', 'drag-instructions');

            console.log('✨ Fancy drag started:', element.tagName, element.className);
        }
    }, [generateSnapPoints, createRippleEffect]);

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
            const threshold = 25; // Increased threshold - needs more deliberate movement to start drag

            if (deltaX > threshold || deltaY > threshold) {
                setHasMoved(true);
                // Now start the actual drag
                handleDragStart(event, mouseDownElement);
            }
        }
    }, [mouseDownElement, mouseDownPos, isDragging, draggedElement, dragOffset]);

    // Handle drag move - Enhanced with snap points and magnetic effects
    const handleDragMove = useCallback((event: React.MouseEvent) => {
        if (!isDragging || !draggedElement || !containerRef.current) return;

        event.preventDefault();

        const containerRect = containerRef.current.getBoundingClientRect();
        let newX = event.clientX - containerRect.left - dragOffset.x;
        let newY = event.clientY - containerRect.top - dragOffset.y;

        // Find nearest snap point for magnetic effect
        const nearest = findNearestSnapPoint(newX + draggedElement.offsetWidth / 2, newY + draggedElement.offsetHeight / 2, snapPoints);

        if (nearest) {
            // Apply magnetic snap with smooth interpolation
            const snapStrength = 0.3;
            newX = newX + (nearest.x - draggedElement.offsetWidth / 2 - newX) * snapStrength;
            newY = newY + (nearest.y - draggedElement.offsetHeight / 2 - newY) * snapStrength;

            setNearestSnapPoint(nearest);

            // Create snap particle effect
            if (Math.abs(newX + draggedElement.offsetWidth / 2 - nearest.x) < 5) {
                createParticleEffect(nearest.x, nearest.y, 'snap');
            }
        } else {
            setNearestSnapPoint(null);
        }

        // Enhanced boundary constraints with padding for borders/outlines
        const elementRect = draggedElement.getBoundingClientRect();
        const borderPadding = 15; // Extra space to account for borders and outlines
        const maxX = containerRect.width - draggedElement.offsetWidth - borderPadding;
        const maxY = containerRect.height - draggedElement.offsetHeight - borderPadding;

        const boundedX = Math.max(borderPadding, Math.min(maxX, newX));
        const boundedY = Math.max(borderPadding, Math.min(maxY, newY));

        // Update position smoothly with enhanced transitions
        draggedElement.style.position = 'absolute';
        draggedElement.style.left = `${boundedX}px`;
        draggedElement.style.top = `${boundedY}px`;

        // Update drag ghost position if it exists
        if (dragGhost) {
            dragGhost.style.left = `${boundedX - 5}px`;
            dragGhost.style.top = `${boundedY - 5}px`;
        }

        // Detect potential collisions and provide visual feedback
        if (containerRef.current) {
            detectAndResolveOverlaps(containerRef.current, draggedElement);
        }
    }, [isDragging, draggedElement, dragOffset, snapPoints, findNearestSnapPoint, createParticleEffect, dragGhost, detectAndResolveOverlaps]);    // Helper function to find the closest drop zone
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

    // Enhanced drag end with fancy cleanup and auto-arrangement
    const handleDragEnd = useCallback(() => {
        if (!draggedElement || !containerRef.current) return;

        // Clean reset of visual feedback with smooth transitions
        draggedElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        draggedElement.style.zIndex = '';
        draggedElement.style.cursor = '';
        draggedElement.style.transform = '';
        draggedElement.style.boxShadow = '';
        draggedElement.style.border = '';
        draggedElement.style.filter = '';
        draggedElement.removeAttribute('data-dragging');
        draggedElement.classList.remove('fancy-dragging');

        // Remove drag ghost immediately
        if (dragGhost && dragGhost.parentElement) {
            dragGhost.parentElement.removeChild(dragGhost);
            setDragGhost(null);
        }

        // Remove global drag state
        document.body.classList.remove('dragging-active');

        // Create success particle effect at final position
        const rect = draggedElement.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const finalX = rect.left - containerRect.left + rect.width / 2;
        const finalY = rect.top - containerRect.top + rect.height / 2;
        createParticleEffect(finalX, finalY, 'success');

        // Smart auto-arrangement after drag
        setTimeout(() => {
            if (containerRef.current) {
                smartAutoArrange(containerRef.current, draggedElement);
            }
        }, 100);

        // Accessibility: Announce drag end
        draggedElement.setAttribute('aria-grabbed', 'false');
        draggedElement.removeAttribute('aria-describedby');

        // Reset enhanced states
        setSnapPoints([]);
        setNearestSnapPoint(null);

        // Clean up transition after animation
        setTimeout(() => {
            if (draggedElement) {
                draggedElement.style.transition = '';
            }
        }, 300);

        // Reset state
        setIsDragging(false);
        setDraggedElement(null);

        // Update the HTML content
        if (containerRef.current && onUpdateHtml) {
            onUpdateHtml(containerRef.current.innerHTML);
        }

        console.log('✨ Fancy drag completed with auto-arrangement');
    }, [draggedElement, onUpdateHtml, dragGhost, createParticleEffect, smartAutoArrange]);

    // Handle external drag operations (for adding new components to empty wireframes)
    const handleDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';

        console.log('🎯 Drag over wireframe - ready to accept drop');
    }, []);

    const handleDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();

        try {
            const draggedData = event.dataTransfer.getData('text/html') ||
                event.dataTransfer.getData('text/plain');

            if (draggedData && containerRef.current) {
                console.log('🎯 Dropped data onto wireframe:', draggedData.substring(0, 100));

                // Create ripple effect at drop position
                const containerRect = containerRef.current.getBoundingClientRect();
                const dropX = event.clientX - containerRect.left;
                const dropY = event.clientY - containerRect.top;
                createRippleEffect(dropX, dropY);

                // Check if wireframe is empty by looking at the current HTML content
                const currentContent = containerRef.current.innerHTML;
                const hasContent = htmlContent && htmlContent.trim().length > 0;

                // Mark the new content as user-added by adding data attribute
                const markedData = draggedData.replace(/(<[^>]+)>/g, '$1 data-user-added="true">');

                if (!hasContent) {
                    // For empty wireframes, set the content directly
                    console.log('🎯 Adding content to empty wireframe');
                    onUpdateHtml(markedData);
                } else {
                    // For existing content, append to the current content
                    onUpdateHtml(currentContent + markedData);
                }

                // Trigger smart auto-arrangement after a brief delay to allow DOM update
                setTimeout(() => {
                    if (containerRef.current) {
                        smartAutoArrange(containerRef.current);
                        createParticleEffect(dropX, dropY, 'success');
                    }
                }, 200);
            }
        } catch (error) {
            console.error('Error handling drop:', error);
        }
    }, [htmlContent, onUpdateHtml, createRippleEffect, smartAutoArrange, createParticleEffect]);    // Keyboard movement for accessibility
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
    };    // Handle element deletion
    const handleDeleteElement = useCallback((element: HTMLElement) => {
        if (!element || !containerRef.current) return;

        // Remove any existing delete buttons first
        const existingDeleteBtns = containerRef.current.querySelectorAll('.delete-btn');
        existingDeleteBtns.forEach(btn => btn.remove());

        // Remove the element
        element.remove();

        // Update the HTML
        onUpdateHtml(containerRef.current.innerHTML);

        console.log('🗑️ Element deleted:', element.tagName, element.className);
    }, [onUpdateHtml]);

    // Add delete button to element - only for user-added controls
    const addDeleteButton = useCallback((element: HTMLElement) => {
        // Remove any existing delete button
        const existingBtn = element.querySelector('.delete-btn');
        if (existingBtn) return;

        // Only add delete buttons to user-added elements or absolutely positioned elements
        // Generated/original elements should not be deletable
        const isUserAdded = element.hasAttribute('data-user-added') ||
            element.style.position === 'absolute' ||
            element.hasAttribute('data-draggable');

        if (!isUserAdded) {
            console.log('🚫 Skipping delete button for generated element:', element.tagName, element.className);
            return;
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.title = 'Delete this element';
        deleteBtn.setAttribute('aria-label', 'Delete element');

        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Close any open link menus first
            setShowLinkMenu(false);
            setSelectedElement(null);

            // Then delete the element
            handleDeleteElement(element);
        });

        // Prevent any other mouse events on the delete button
        deleteBtn.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
        });

        deleteBtn.addEventListener('mouseup', (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
        });

        element.appendChild(deleteBtn);
        element.style.position = element.style.position || 'relative';

        console.log('✅ Added delete button to user-added element:', element.tagName, element.className);
    }, [handleDeleteElement]);

    // Remove delete button from element
    const removeDeleteButton = useCallback((element: HTMLElement) => {
        const deleteBtn = element.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.remove();
        }
    }, []);

    // Combined mouse leave handler for container and elements
    const handleCombinedMouseLeave = useCallback((e: React.MouseEvent) => {
        // First handle the drag end logic (from the original container handler)
        handleMouseUp(e);

        // Then handle element-specific logic
        const target = e.target as HTMLElement;

        // Remove delete button from draggable elements (unless dragging)
        if (isDraggableElement(target) && !isDragging) {
            removeDeleteButton(target);
        }
    }, [handleMouseUp, isDraggableElement, isDragging, removeDeleteButton]);

    // Handle click on linkable elements
    const handleElementClick = useCallback((event: MouseEvent) => {
        const target = event.target as HTMLElement;
        console.log('Element clicked:', target, 'Text:', target.textContent);

        // Check if the clicked element is a delete button - if so, don't interfere
        if (target.classList.contains('delete-btn') || target.closest('.delete-btn')) {
            console.log('🗑️ Delete button clicked, ignoring for link handling');
            return;
        }

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

    // Set up click listeners and mouse event handling
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

        // Handle mouse enter for delete buttons
        const handleMouseEnter = (event: Event) => {
            const target = event.target as HTMLElement;

            // Add delete button to draggable elements
            if (isDraggableElement(target) && !target.classList.contains('delete-btn')) {
                addDeleteButton(target);
            }
        };

        // Handle mouse leave for delete buttons
        const handleMouseLeave = (event: Event) => {
            const target = event.target as HTMLElement;

            // Remove delete button from draggable elements (unless dragging)
            if (isDraggableElement(target) && !isDragging) {
                removeDeleteButton(target);
            }
        };

        // Add both regular and capture listeners for better coverage
        container.addEventListener('click', handleElementClick);
        container.addEventListener('click', handleClickCapture, true);
        container.addEventListener('mouseenter', handleMouseEnter, true);
        container.addEventListener('mouseleave', handleMouseLeave, true);

        // Also try adding to document for debugging
        const documentClickHandler = (event: Event) => {
            console.log('📄 Document click:', event.target);
        };
        document.addEventListener('click', documentClickHandler);

        return () => {
            container.removeEventListener('click', handleElementClick);
            container.removeEventListener('click', handleClickCapture, true);
            container.removeEventListener('mouseenter', handleMouseEnter, true);
            container.removeEventListener('mouseleave', handleMouseLeave, true);
            document.removeEventListener('click', documentClickHandler);
        };
    }, [handleElementClick, isDraggableElement, addDeleteButton, removeDeleteButton, isDragging]);

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

    // DISABLED: Global mouse event listeners were causing position conflicts
    // All drag functionality is now handled by local container mouse handlers

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

        // Fix wireframe images with placeholder system
        cleaned = fixWireframeImages(cleaned);

        return cleaned.trim();
    }, [htmlContent]);

    return (
        <div
            className="linkable-wireframe"
            ref={containerRef}
            onMouseMove={handleMouseMoveTracking}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleCombinedMouseLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onMouseDown={(e) => {
                const target = e.target as HTMLElement;

                // Don't interfere with delete button clicks
                if (target.classList.contains('delete-btn') || target.closest('.delete-btn')) {
                    return;
                }

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
            onMouseEnter={(e) => {
                const target = e.target as HTMLElement;

                // Only add delete button to draggable elements, not delete buttons themselves
                if (isDraggableElement(target) &&
                    !target.classList.contains('delete-btn') &&
                    !target.closest('.delete-btn')) {
                    addDeleteButton(target);
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

                    // Delete key to delete element
                    if (e.key === 'Delete' || e.key === 'Backspace') {
                        e.preventDefault();
                        // Close any open link menus first
                        setShowLinkMenu(false);
                        setSelectedElement(null);
                        handleDeleteElement(target);
                    }
                }

                // Escape to cancel any drag operation
                if (e.key === 'Escape' && isDragging) {
                    handleDragEnd();
                }
            }}
            role="application"
            aria-label="Wireframe editor - drag and drop elements to rearrange them"
        >
            {/* Enhanced accessibility instructions */}
            <div id="drag-instructions" className="sr-only">
                Use mouse to drag elements around the wireframe.
                Elements will snap to grid points and other elements for precise alignment.
                Watch for particle effects and magnetic snap points.
                Press Escape to cancel dragging.
            </div>

            {/* Fancy visual effects */}
            {isDragging && (
                <div className="drag-overlay">
                    <div className="drag-indicator">
                        ✨ Dragging - Look for snap points and magnetic areas
                    </div>
                </div>
            )}

            {/* Snap point indicators */}
            {isDragging && nearestSnapPoint && (
                <div
                    className="snap-indicator"
                    style={{
                        left: `${nearestSnapPoint.x}px`,
                        top: `${nearestSnapPoint.y}px`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <div className={`snap-point snap-${nearestSnapPoint.type}`}></div>
                </div>
            )}

            {/* Particle effects */}
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className={`particle particle-${particle.type}`}
                    style={{
                        left: `${particle.x}px`,
                        top: `${particle.y}px`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    {particle.type === 'success' && '✨'}
                    {particle.type === 'drag' && '💫'}
                    {particle.type === 'snap' && '🎯'}
                </div>
            ))}

            {/* Ripple effect */}
            {rippleEffect && (
                <div
                    className="ripple-effect"
                    style={{
                        left: `${rippleEffect.x}px`,
                        top: `${rippleEffect.y}px`,
                        transform: 'translate(-50%, -50%)'
                    }}
                ></div>
            )}

            {/* Auto-arrangement indicator */}
            {isRearranging && (
                <div className="rearranging-indicator">
                    <div className="rearranging-content">
                        <div className="spinner"></div>
                        <span>Smart rearranging elements...</span>
                    </div>
                </div>
            )}

            {(cleanHtmlContent && cleanHtmlContent.length > 0) ? (
                <div
                    dangerouslySetInnerHTML={{ __html: cleanHtmlContent }}
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
                        left: `${linkMenuPosition.x}px`,
                        top: `${linkMenuPosition.y}px`,
                        transform: 'translateX(-50%)'
                    }}
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
