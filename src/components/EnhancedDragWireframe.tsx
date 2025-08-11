import React, { useRef, useCallback, useEffect, useState } from 'react';
import './EnhancedDragWireframe.css';

interface EnhancedDragWireframeProps {
    htmlContent: string;
    onUpdateHtml?: (newHtml: string) => void;
    enableSnapGuides?: boolean;
    enableGridSnap?: boolean;
    gridSize?: number;
}

const EnhancedDragWireframe: React.FC<EnhancedDragWireframeProps> = ({
    htmlContent,
    onUpdateHtml,
    enableSnapGuides = true,
    enableGridSnap = false,
    gridSize = 8
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [snapGuides, setSnapGuides] = useState<{
        vertical: number[];
        horizontal: number[];
    }>({ vertical: [], horizontal: [] });
    const [nearestSnap, setNearestSnap] = useState<{
        x?: number;
        y?: number;
        distance: number;
    }>({ distance: Infinity });

    // Create ghost element for drag preview
    const [ghostElement, setGhostElement] = useState<HTMLElement | null>(null);

    // Snap detection threshold
    const SNAP_THRESHOLD = 12;

    // Check if element is draggable
    const isDraggableElement = useCallback((element: HTMLElement): boolean => {
        const hasAtlasClass = Array.from(element.classList).some(cls =>
            cls.startsWith('atlas-') || cls.includes('button') || cls.includes('card')
        );

        const isPositioned = element.style.position === 'absolute' ||
            element.style.position === 'relative';

        const isContainer = element.tagName.toLowerCase() === 'div' &&
            (element.children.length > 0 || element.textContent?.trim()) &&
            !element.closest('input, textarea, select');

        const hasDraggableAttr = element.hasAttribute('data-draggable') ||
            element.getAttribute('draggable') === 'true';

        const isDraggable = Boolean(hasAtlasClass || isPositioned || isContainer || hasDraggableAttr);

        // Add accessibility attributes for draggable elements
        if (isDraggable) {
            element.setAttribute('role', 'button');
            element.setAttribute('aria-grabbed', 'false');
            element.setAttribute('tabindex', '0');
            element.setAttribute('aria-label', `Draggable ${element.tagName.toLowerCase()} element. Click and drag to reposition.`);
        }

        return isDraggable;
    }, []);

    // Calculate snap guides from existing elements
    const calculateSnapGuides = useCallback(() => {
        if (!containerRef.current || !enableSnapGuides) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const elements = containerRef.current.querySelectorAll('*:not(.snap-guide):not(.ghost-element)');

        const vertical: number[] = [];
        const horizontal: number[] = [];

        elements.forEach(el => {
            if (el === draggedElement) return;

            const rect = el.getBoundingClientRect();
            const relativeLeft = rect.left - containerRect.left;
            const relativeTop = rect.top - containerRect.top;

            // Add element edges and center
            vertical.push(relativeLeft); // Left edge
            vertical.push(relativeLeft + rect.width); // Right edge
            vertical.push(relativeLeft + rect.width / 2); // Center

            horizontal.push(relativeTop); // Top edge
            horizontal.push(relativeTop + rect.height); // Bottom edge
            horizontal.push(relativeTop + rect.height / 2); // Center
        });

        // Add container edges
        vertical.push(0, containerRect.width);
        horizontal.push(0, containerRect.height);

        setSnapGuides({
            vertical: [...new Set(vertical)].sort((a, b) => a - b),
            horizontal: [...new Set(horizontal)].sort((a, b) => a - b)
        });
    }, [draggedElement, enableSnapGuides]);

    // Find nearest snap points
    const findNearestSnap = useCallback((x: number, y: number) => {
        const nearestX = snapGuides.vertical.reduce((closest, guide) => {
            const distance = Math.abs(guide - x);
            return distance < Math.abs(closest - x) ? guide : closest;
        }, snapGuides.vertical[0]);

        const nearestY = snapGuides.horizontal.reduce((closest, guide) => {
            const distance = Math.abs(guide - y);
            return distance < Math.abs(closest - y) ? guide : closest;
        }, snapGuides.horizontal[0]);

        const xDistance = Math.abs(nearestX - x);
        const yDistance = Math.abs(nearestY - y);

        return {
            x: xDistance <= SNAP_THRESHOLD ? nearestX : undefined,
            y: yDistance <= SNAP_THRESHOLD ? nearestY : undefined,
            distance: Math.min(xDistance, yDistance)
        };
    }, [snapGuides]);

    // Apply grid snap
    const applyGridSnap = useCallback((value: number): number => {
        if (!enableGridSnap) return value;
        return Math.round(value / gridSize) * gridSize;
    }, [enableGridSnap, gridSize]);

    // Handle mouse down - start drag tracking
    const handleMouseDown = useCallback((e: React.MouseEvent, element: HTMLElement) => {
        if (!isDraggableElement(element)) return;

        e.preventDefault();
        e.stopPropagation();

        const rect = element.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();

        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });

        // Create ghost element
        const ghost = element.cloneNode(true) as HTMLElement;
        ghost.classList.add('ghost-element');
        ghost.style.cssText = `
            position: absolute;
            pointer-events: none;
            opacity: 0.6;
            z-index: 1000;
            transform: scale(1.05);
            filter: drop-shadow(0 4px 12px rgba(0, 120, 212, 0.3));
            transition: none;
        `;
        containerRef.current!.appendChild(ghost);
        setGhostElement(ghost);

        // Style original element while dragging
        element.style.opacity = '0.3';
        element.style.pointerEvents = 'none';
        element.setAttribute('data-original-dragging', 'true');

        setDraggedElement(element);
        setIsDragging(true);
        calculateSnapGuides();

        // Add global mouse events
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [isDraggableElement, calculateSnapGuides]);

    // Handle mouse move
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !draggedElement || !containerRef.current || !ghostElement) return;

        e.preventDefault();

        const containerRect = containerRef.current.getBoundingClientRect();
        let newX = e.clientX - containerRect.left - dragOffset.x;
        let newY = e.clientY - containerRect.top - dragOffset.y;

        // Apply grid snap
        newX = applyGridSnap(newX);
        newY = applyGridSnap(newY);

        // Find snap points
        const snap = findNearestSnap(newX, newY);
        setNearestSnap(snap);

        // Apply snap
        const finalX = snap.x !== undefined ? snap.x : newX;
        const finalY = snap.y !== undefined ? snap.y : newY;

        // Boundary constraints
        const elementRect = draggedElement.getBoundingClientRect();
        const maxX = containerRect.width - elementRect.width;
        const maxY = containerRect.height - elementRect.height;

        const boundedX = Math.max(0, Math.min(maxX, finalX));
        const boundedY = Math.max(0, Math.min(maxY, finalY));

        // Update ghost position
        ghostElement.style.left = `${boundedX}px`;
        ghostElement.style.top = `${boundedY}px`;

        // Add snap feedback
        if (snap.x !== undefined || snap.y !== undefined) {
            ghostElement.style.transform = 'scale(1.05) translateZ(0)';
            ghostElement.style.filter = 'drop-shadow(0 4px 12px rgba(0, 200, 83, 0.4))';
        } else {
            ghostElement.style.transform = 'scale(1.05) translateZ(0)';
            ghostElement.style.filter = 'drop-shadow(0 4px 12px rgba(0, 120, 212, 0.3))';
        }
    }, [isDragging, draggedElement, dragOffset, applyGridSnap, findNearestSnap, ghostElement]);

    // Handle mouse up - end drag
    const handleMouseUp = useCallback((e?: MouseEvent) => {
        if (!isDragging || !draggedElement || !ghostElement) return;

        // Get final position from ghost
        const finalX = parseFloat(ghostElement.style.left);
        const finalY = parseFloat(ghostElement.style.top);

        // Apply final position to original element
        draggedElement.style.position = 'absolute';
        draggedElement.style.left = `${finalX}px`;
        draggedElement.style.top = `${finalY}px`;

        // Restore original element appearance
        draggedElement.style.opacity = '';
        draggedElement.style.pointerEvents = '';
        draggedElement.removeAttribute('data-original-dragging');

        // Remove ghost element
        ghostElement.remove();
        setGhostElement(null);

        // Clean up state
        setIsDragging(false);
        setDraggedElement(null);
        setSnapGuides({ vertical: [], horizontal: [] });
        setNearestSnap({ distance: Infinity });

        // Update HTML content
        if (containerRef.current && onUpdateHtml) {
            onUpdateHtml(containerRef.current.innerHTML);
        }

        // Remove global mouse events
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }, [isDragging, draggedElement, onUpdateHtml, ghostElement, handleMouseMove]);

    // Handle drag over for external elements
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }, []);

    // Handle drop for external elements
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();

        const htmlData = e.dataTransfer.getData('text/html');
        if (!htmlData || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - containerRect.left;
        const y = e.clientY - containerRect.top;

        // Create temporary element to insert the new component
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlData;
        const newElement = tempDiv.firstElementChild as HTMLElement;

        if (newElement) {
            // Position the new element
            newElement.style.position = 'absolute';
            newElement.style.left = `${applyGridSnap(x)}px`;
            newElement.style.top = `${applyGridSnap(y)}px`;
            newElement.setAttribute('data-draggable', 'true');

            // Add to container
            containerRef.current.appendChild(newElement);

            // Update HTML content
            if (onUpdateHtml) {
                onUpdateHtml(containerRef.current.innerHTML);
            }
        }
    }, [applyGridSnap, onUpdateHtml]);

    // Render snap guides
    const renderSnapGuides = () => {
        if (!enableSnapGuides || !isDragging || nearestSnap.distance > SNAP_THRESHOLD) return null;

        return (
            <>
                {nearestSnap.x !== undefined && (
                    <div
                        className="snap-guide vertical"
                        style={{ left: nearestSnap.x }}
                    />
                )}
                {nearestSnap.y !== undefined && (
                    <div
                        className="snap-guide horizontal"
                        style={{ top: nearestSnap.y }}
                    />
                )}
            </>
        );
    };

    // Render grid overlay
    const renderGrid = () => {
        if (!enableGridSnap || !isDragging) return null;

        return <div className="grid-overlay" style={{ backgroundSize: `${gridSize}px ${gridSize}px` }} />;
    };

    return (
        <div
            ref={containerRef}
            className={`enhanced-drag-wireframe ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onMouseDown={(e) => {
                const target = e.target as HTMLElement;
                if (isDraggableElement(target)) {
                    handleMouseDown(e, target);
                }
            }}
        >
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            {renderGrid()}
            {renderSnapGuides()}
        </div>
    );
};

export default EnhancedDragWireframe;
