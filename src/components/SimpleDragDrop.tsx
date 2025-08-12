import React, { useCallback, useEffect, useRef, useState } from 'react';
import { fixWireframeImages } from '../utils/imagePlaceholders';
import './SimpleDragDrop.css';

interface SimpleDragDropProps {
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

const SimpleDragDrop: React.FC<SimpleDragDropProps> = ({
    htmlContent,
    onUpdateHtml,
    onNavigateToPage,
    availablePages
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(null);
    const [dropZoneActive, setDropZoneActive] = useState(false);

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

    // Check if an element is draggable
    const isDraggableElement = useCallback((element: HTMLElement): boolean => {
        // Only allow dragging of user-added elements or wireframe controls within the container
        if (!containerRef.current?.contains(element)) {
            return false;
        }

        // Exclude toolbar, header, and UI elements
        if (element.closest('.toolbar') ||
            element.closest('.component-library-modal') ||
            element.closest('header') ||
            element.closest('.docs-header') ||
            element.closest('.fallback-notice') ||
            element.closest('.action-buttons') ||
            element.classList.contains('delete-btn')) {
            return false;
        }

        // Check if it's a user-added Atlas component
        const isUserAdded = element.hasAttribute('data-user-added');

        // Check if it's a wireframe control that should be draggable
        const isWireframeControl = element.classList.contains('form-group') ||
            element.classList.contains('form-submit') ||
            element.classList.contains('card') ||
            element.classList.contains('hero-section') ||
            element.classList.contains('nav-section') ||
            (element.tagName === 'BUTTON' &&
                (element.classList.contains('form-submit') ||
                    (element as HTMLButtonElement).type === 'submit' ||
                    Boolean(element.closest('.form-container'))));

        return isUserAdded || isWireframeControl;
    }, []);

    // Handle drag start
    const handleDragStart = useCallback((e: DragEvent) => {
        const target = e.target as HTMLElement;

        if (!isDraggableElement(target)) {
            e.preventDefault();
            return;
        }

        console.log('Drag started for:', target);
        setDraggedElement(target);

        // Set drag data
        e.dataTransfer!.setData('text/html', target.outerHTML);
        e.dataTransfer!.setData('text/plain', target.id || 'dragged-element');
        e.dataTransfer!.effectAllowed = 'move';

        // Add visual feedback
        target.style.opacity = '0.5';
        target.classList.add('dragging');

        // Set drag image
        const rect = target.getBoundingClientRect();
        e.dataTransfer!.setDragImage(target, rect.width / 2, rect.height / 2);
    }, [isDraggableElement]);

    // Handle drag end
    const handleDragEnd = useCallback((e: DragEvent) => {
        const target = e.target as HTMLElement;
        console.log('Drag ended for:', target);

        // Reset visual feedback
        target.style.opacity = '';
        target.classList.remove('dragging');
        setDraggedElement(null);
        setDropZoneActive(false);
    }, []);

    // Handle drag over
    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.dataTransfer!.dropEffect = 'move';
        setDropZoneActive(true);
    }, []);

    // Handle drag leave
    const handleDragLeave = useCallback((e: DragEvent) => {
        // Only hide drop zone if leaving the container completely
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            setDropZoneActive(false);
        }
    }, []);

    // Handle drop
    const handleDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        setDropZoneActive(false);

        const dropTarget = e.target as HTMLElement;
        const dragData = e.dataTransfer!.getData('text/html');

        if (!dragData || !containerRef.current) {
            return;
        }

        console.log('Drop occurred at:', e.clientX, e.clientY);

        // Calculate drop position relative to container
        const containerRect = containerRef.current.getBoundingClientRect();
        const dropX = e.clientX - containerRect.left;
        const dropY = e.clientY - containerRect.top;

        // If we have a dragged element, move it to the new position
        if (draggedElement) {
            // Position the element absolutely at the drop location
            draggedElement.style.position = 'absolute';
            draggedElement.style.left = `${Math.max(0, dropX - 50)}px`; // Center on cursor
            draggedElement.style.top = `${Math.max(0, dropY - 25)}px`;
            draggedElement.style.zIndex = '10';

            // Ensure it's marked as user-added
            draggedElement.setAttribute('data-user-added', 'true');

            // Update the HTML content
            onUpdateHtml(containerRef.current.innerHTML);
        } else {
            // This is a new element being dropped from outside
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = dragData;
            const newElement = tempDiv.firstElementChild as HTMLElement;

            if (newElement) {
                // Position the new element at drop location
                newElement.style.position = 'absolute';
                newElement.style.left = `${Math.max(0, dropX - 50)}px`;
                newElement.style.top = `${Math.max(0, dropY - 25)}px`;
                newElement.style.zIndex = '10';
                newElement.setAttribute('data-user-added', 'true');

                // Add to container
                containerRef.current.appendChild(newElement);

                // Update the HTML content
                onUpdateHtml(containerRef.current.innerHTML);
            }
        }
    }, [draggedElement, onUpdateHtml]);

    // Setup drag and drop event listeners
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Add event listeners to all potentially draggable elements
        const setupDragEvents = () => {
            const elements = container.querySelectorAll('*');
            elements.forEach(element => {
                const el = element as HTMLElement;
                if (isDraggableElement(el)) {
                    el.draggable = true;
                    el.addEventListener('dragstart', handleDragStart);
                    el.addEventListener('dragend', handleDragEnd);
                }
            });
        };

        // Container-level drop zone events
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('dragleave', handleDragLeave);
        container.addEventListener('drop', handleDrop);

        // Setup initial drag events
        setupDragEvents();

        // Re-setup drag events when content changes
        const observer = new MutationObserver(setupDragEvents);
        observer.observe(container, { childList: true, subtree: true });

        return () => {
            container.removeEventListener('dragover', handleDragOver);
            container.removeEventListener('dragleave', handleDragLeave);
            container.removeEventListener('drop', handleDrop);
            observer.disconnect();
        };
    }, [isDraggableElement, handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop]);

    return (
        <div
            ref={containerRef}
            className={`simple-drag-drop ${dropZoneActive ? 'drop-zone-active' : ''}`}
            role="application"
            aria-label="Wireframe editor - drag and drop elements to rearrange them"
        >
            {/* Drop zone indicator */}
            {dropZoneActive && (
                <div className="drop-indicator">
                    Drop here to position element
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
        </div>
    );
};

export default SimpleDragDrop;
