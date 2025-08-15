import React, { useRef, useEffect, useState } from 'react';
import { fixWireframeImages } from '../utils/imagePlaceholders';
import './InteractiveWireframe.css';

interface InteractiveWireframeProps {
    htmlContent: string;
    onUpdateContent?: (newContent: string) => void;
    rearrangeable?: boolean; // New prop to enable rearrangeable mode
}

const InteractiveWireframe: React.FC<InteractiveWireframeProps> = ({
    htmlContent,
    onUpdateContent,
    rearrangeable = false,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragState, setDragState] = useState({
        draggedElement: null as HTMLElement | null,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0
    });
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

        // Fix broken images with placeholders
        cleaned = fixWireframeImages(cleaned);

        return cleaned.trim();
    }, [htmlContent]);

    // Drag and drop functionality for rearrangeable mode
    const initializeDragDrop = () => {
        if (!rearrangeable || !containerRef.current) return;

        const items = containerRef.current.querySelectorAll('.col-md-4, .col-md-6, .col-md-12, .col-lg-4, .col-lg-6, .col-lg-12, .card, .btn, .alert, .nav, .navbar');

        items.forEach((item, index) => {
            const htmlItem = item as HTMLElement;
            htmlItem.classList.add('draggable-item');
            htmlItem.setAttribute('data-drag-index', index.toString());

            htmlItem.style.cursor = 'move';
            htmlItem.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';

            htmlItem.removeEventListener('mousedown', handleMouseDown);
            htmlItem.addEventListener('mousedown', handleMouseDown);
        });
    };

    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();

        const target = (e.target as HTMLElement).closest('.draggable-item') as HTMLElement;
        if (!target) return;

        const rect = target.getBoundingClientRect();

        setDragState({
            draggedElement: target,
            startX: e.clientX,
            startY: e.clientY,
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top
        });

        setIsDragging(true);
        target.classList.add('dragging');
        target.style.opacity = '0.7';
        target.style.transform = 'scale(1.05)';
        target.style.zIndex = '1000';

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !dragState.draggedElement) return;

        const { draggedElement, offsetX, offsetY } = dragState;

        draggedElement.style.position = 'fixed';
        draggedElement.style.left = `${e.clientX - offsetX}px`;
        draggedElement.style.top = `${e.clientY - offsetY}px`;
        draggedElement.style.pointerEvents = 'none';
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (!isDragging || !dragState.draggedElement) return;

        const { draggedElement } = dragState;

        // Reset styles
        draggedElement.style.position = '';
        draggedElement.style.left = '';
        draggedElement.style.top = '';
        draggedElement.style.zIndex = '';
        draggedElement.style.pointerEvents = '';
        draggedElement.style.opacity = '';
        draggedElement.style.transform = '';
        draggedElement.classList.remove('dragging');

        // Find drop target
        const dropTarget = findDropTarget(e.clientX, e.clientY);
        if (dropTarget && dropTarget !== draggedElement) {
            rearrangeElements(draggedElement, dropTarget);

            // Update content if callback provided
            if (onUpdateContent && containerRef.current) {
                const newContent = containerRef.current.innerHTML;
                onUpdateContent(newContent);
            }
        }

        // Clean up
        setIsDragging(false);
        setDragState({
            draggedElement: null,
            startX: 0,
            startY: 0,
            offsetX: 0,
            offsetY: 0
        });

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const findDropTarget = (x: number, y: number): HTMLElement | null => {
        const elements = document.elementsFromPoint(x, y);
        return elements.find(el =>
            (el as HTMLElement).classList.contains('draggable-item') &&
            !(el as HTMLElement).classList.contains('dragging')
        ) as HTMLElement || null;
    };

    const rearrangeElements = (draggedElement: HTMLElement, dropTarget: HTMLElement) => {
        const parent = draggedElement.parentNode;
        if (!parent) return;

        const draggedNext = draggedElement.nextSibling;
        const targetNext = dropTarget.nextSibling;

        if (draggedNext === dropTarget) {
            parent.insertBefore(dropTarget, draggedElement);
        } else if (targetNext === draggedElement) {
            parent.insertBefore(draggedElement, dropTarget);
        } else {
            const temp = document.createElement('div');
            parent.insertBefore(temp, draggedElement);
            parent.insertBefore(draggedElement, targetNext);
            parent.insertBefore(dropTarget, temp);
            parent.removeChild(temp);
        }
    };

    useEffect(() => {
        if (rearrangeable) {
            const timer = setTimeout(() => {
                initializeDragDrop();
            }, 100);

            return () => {
                clearTimeout(timer);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [cleanHtmlContent, rearrangeable]);

    return (
        <div className={`interactive-wireframe-container ${rearrangeable ? 'rearrangeable-mode' : ''}`}>
            <div className="wireframe-display">
                <div
                    ref={containerRef}
                    className="wireframe-content"
                    dangerouslySetInnerHTML={{ __html: cleanHtmlContent }}
                />
            </div>
        </div>
    );
};

export default InteractiveWireframe;
