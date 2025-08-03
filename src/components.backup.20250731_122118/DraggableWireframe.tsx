import React, { useRef, useState, useEffect } from 'react';
import './DraggableWireframe.css';

interface DraggableWireframeProps {
    htmlContent: string;
    onUpdateHtml?: (newHtml: string) => void;
}

interface DraggedElement {
    element: HTMLElement;
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
    isDragging: boolean;
    dragStartTime: number;
}

const DRAG_THRESHOLD = 5; // pixels to move before starting drag
const CLICK_TIMEOUT = 200; // ms to distinguish click from drag

const DraggableWireframe: React.FC<DraggableWireframeProps> = ({
    htmlContent,
    onUpdateHtml
}) => {
    const wireframeRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedElement, setDraggedElement] = useState<DraggedElement | null>(null);

    useEffect(() => {
        if (!wireframeRef.current) return;

        const wireframe = wireframeRef.current;

        // Add event listeners for making components draggable
        const handleMouseDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Only make certain elements draggable (buttons, containers, etc.)
            // Also check for form-control class and other common classes
            if (target.tagName === 'BUTTON' ||
                target.classList.contains('card') ||
                target.classList.contains('container') ||
                target.classList.contains('form-control') ||
                target.tagName === 'INPUT' ||
                target.tagName === 'H1' ||
                target.tagName === 'H2' ||
                target.tagName === 'H3' ||
                target.tagName === 'H4' ||
                target.tagName === 'H5' ||
                target.tagName === 'H6' ||
                target.tagName === 'P' ||
                target.tagName === 'DIV') {

                // Don't prevent default yet - let's see if this is a click or drag
                e.stopPropagation();

                // Get wireframe container bounds for proper positioning
                const wireframeRect = wireframe.getBoundingClientRect();
                const targetRect = target.getBoundingClientRect();

                // Calculate relative position within wireframe
                const relativeX = targetRect.left - wireframeRect.left;
                const relativeY = targetRect.top - wireframeRect.top;

                // Store drag state but don't start dragging yet
                setDraggedElement({
                    element: target,
                    startX: e.clientX,
                    startY: e.clientY,
                    startLeft: relativeX,
                    startTop: relativeY,
                    isDragging: false,
                    dragStartTime: Date.now()
                });

                // Add selection visual feedback immediately
                target.classList.add('selected-element');
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!draggedElement) return;

            const deltaX = e.clientX - draggedElement.startX;
            const deltaY = e.clientY - draggedElement.startY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Check if we should start dragging (moved beyond threshold)
            if (!draggedElement.isDragging && distance > DRAG_THRESHOLD) {
                e.preventDefault();

                // Now start the actual drag operation
                const target = draggedElement.element;
                const targetRect = target.getBoundingClientRect();

                // Store original size to prevent scaling issues
                const originalWidth = targetRect.width;
                const originalHeight = targetRect.height;

                // Make element absolutely positioned for precise control
                target.style.position = 'absolute';
                target.style.left = `${draggedElement.startLeft}px`;
                target.style.top = `${draggedElement.startTop}px`;
                target.style.width = `${originalWidth}px`;
                target.style.height = `${originalHeight}px`;
                target.style.zIndex = '1000';
                target.style.margin = '0';
                target.style.transform = 'none';

                // Update state to indicate dragging has started
                setDraggedElement({
                    ...draggedElement,
                    isDragging: true
                });
                setIsDragging(true);

                // Switch from selection to dragging visual feedback
                target.classList.remove('selected-element');
                target.classList.add('dragging-element');
            }

            // If we're actively dragging, update position
            if (draggedElement.isDragging && isDragging) {
                e.preventDefault();

                // Get wireframe bounds for constraining movement
                const wireframeRect = wireframe.getBoundingClientRect();
                const elementWidth = parseFloat(draggedElement.element.style.width) || 0;
                const elementHeight = parseFloat(draggedElement.element.style.height) || 0;

                // Calculate new position with bounds checking
                let newLeft = draggedElement.startLeft + deltaX;
                let newTop = draggedElement.startTop + deltaY;

                // Allow movement throughout the entire page, not just wireframe bounds
                const minLeft = -wireframeRect.left; // Allow moving to left edge of viewport
                const minTop = -wireframeRect.top; // Allow moving to top edge of viewport
                const maxLeft = window.innerWidth - wireframeRect.left - elementWidth;
                const maxTop = window.innerHeight - wireframeRect.top - elementHeight;

                newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
                newTop = Math.max(minTop, Math.min(maxTop, newTop));

                draggedElement.element.style.left = `${newLeft}px`;
                draggedElement.element.style.top = `${newTop}px`;
            }
        };

        const handleMouseUp = () => {
            if (draggedElement) {
                const timeElapsed = Date.now() - draggedElement.dragStartTime;
                const target = draggedElement.element;

                // If we were dragging, clean up drag state
                if (draggedElement.isDragging && isDragging) {
                    // Remove visual feedback and reset z-index
                    target.classList.remove('dragging-element');
                    target.style.zIndex = ''; // Reset z-index

                    // Remove the transform override to allow CSS transitions again
                    setTimeout(() => {
                        if (target.style.transform === 'none') {
                            target.style.transform = '';
                        }
                    }, 50);

                    // Optionally update the HTML content with new positions
                    if (onUpdateHtml && wireframe) {
                        onUpdateHtml(wireframe.innerHTML);
                    }
                } else {
                    // This was a click, not a drag - handle as selection or interaction
                    target.classList.remove('selected-element');

                    // If it was a quick click, treat it as a normal click
                    if (timeElapsed < CLICK_TIMEOUT) {
                        // Allow the click to proceed normally for buttons, inputs, etc.
                        console.log('Element clicked:', target.tagName, target.textContent?.slice(0, 50));

                        // You could add click-specific logic here, like:
                        // - Opening a properties panel
                        // - Highlighting the element
                        // - Showing context menu
                        target.classList.add('clicked-element');
                        setTimeout(() => {
                            target.classList.remove('clicked-element');
                        }, 1000);
                    }
                }
            }

            setIsDragging(false);
            setDraggedElement(null);
        }; wireframe.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // Add keyboard support for accessibility
        const handleKeyDown = (e: KeyboardEvent) => {
            if (draggedElement && !draggedElement.isDragging) {
                const target = draggedElement.element;
                const step = e.shiftKey ? 10 : 1; // Bigger steps with Shift

                switch (e.key) {
                    case 'Escape':
                        target.classList.remove('selected-element');
                        setDraggedElement(null);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        const currentTop = parseFloat(target.style.top) || 0;
                        target.style.top = `${Math.max(0, currentTop - step)}px`;
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        const currentTopDown = parseFloat(target.style.top) || 0;
                        target.style.top = `${currentTopDown + step}px`;
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        const currentLeft = parseFloat(target.style.left) || 0;
                        target.style.left = `${Math.max(0, currentLeft - step)}px`;
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        const currentLeftRight = parseFloat(target.style.left) || 0;
                        target.style.left = `${currentLeftRight + step}px`;
                        break;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            wireframe.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isDragging, draggedElement, onUpdateHtml]);

    return (
        <div
            ref={wireframeRef}
            className={`draggable-wireframe ${isDragging ? 'dragging' : 'not-dragging'}`}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};

export default DraggableWireframe;
