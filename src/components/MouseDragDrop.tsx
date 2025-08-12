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

const MouseDragDrop: React.FC<MouseDragDropProps> = ({
    htmlContent,
    onUpdateHtml,
    onNavigateToPage,
    availablePages
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragElement, setDragElement] = useState<HTMLElement | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [ghostElement, setGhostElement] = useState<HTMLElement | null>(null);

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

    // Check if element is draggable
    const isDraggableElement = useCallback((element: HTMLElement): boolean => {
        if (!containerRef.current?.contains(element)) return false;

        // Exclude UI elements
        if (element.closest('.toolbar') ||
            element.closest('.component-library-modal') ||
            element.closest('header') ||
            element.closest('.docs-header') ||
            element.classList.contains('delete-btn')) {
            return false;
        }

        // Allow user-added elements or wireframe controls
        const isUserAdded = element.hasAttribute('data-user-added');
        const isWireframeControl = element.classList.contains('form-group') ||
            element.classList.contains('form-submit') ||
            element.classList.contains('card') ||
            element.classList.contains('hero-section') ||
            element.classList.contains('nav-section') ||
            (element.tagName === 'BUTTON' && !element.closest('.toolbar'));

        return isUserAdded || isWireframeControl;
    }, []);

    // Create ghost element for dragging
    const createGhost = useCallback((element: HTMLElement) => {
        const ghost = element.cloneNode(true) as HTMLElement;
        ghost.style.position = 'fixed';
        ghost.style.pointerEvents = 'none';
        ghost.style.opacity = '0.8';
        ghost.style.zIndex = '9999';
        ghost.style.transform = 'rotate(3deg) scale(0.9)';
        ghost.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
        ghost.style.border = '2px solid rgba(0,123,255,0.8)';
        ghost.classList.add('drag-ghost');
        document.body.appendChild(ghost);
        return ghost;
    }, []);

    // Mouse down handler
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        const target = e.target as HTMLElement;

        // Find the draggable element (could be nested)
        let draggableElement = target;
        let attempts = 0;
        while (draggableElement && attempts < 5) {
            if (isDraggableElement(draggableElement)) {
                break;
            }
            draggableElement = draggableElement.parentElement as HTMLElement;
            attempts++;
        }

        if (!draggableElement || !isDraggableElement(draggableElement)) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        const rect = draggableElement.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        setDragElement(draggableElement);
        setDragOffset({ x: offsetX, y: offsetY });
        setIsDragging(true);

        // Make original element semi-transparent
        draggableElement.style.opacity = '0.3';
        draggableElement.classList.add('being-dragged');

        // Create ghost element
        const ghost = createGhost(draggableElement);
        ghost.style.left = `${e.clientX - offsetX}px`;
        ghost.style.top = `${e.clientY - offsetY}px`;
        setGhostElement(ghost);

        console.log('🎯 Started dragging:', draggableElement.textContent?.slice(0, 30));
    }, [isDraggableElement, createGhost]);

    // Mouse move handler
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !ghostElement) return;

        e.preventDefault();

        // Update ghost position
        ghostElement.style.left = `${e.clientX - dragOffset.x}px`;
        ghostElement.style.top = `${e.clientY - dragOffset.y}px`;
    }, [isDragging, ghostElement, dragOffset]);

    // Mouse up handler
    const handleMouseUp = useCallback((e: MouseEvent) => {
        if (!isDragging || !dragElement || !containerRef.current) {
            return;
        }

        e.preventDefault();

        // Check if we're dropping inside the container
        const containerRect = containerRef.current.getBoundingClientRect();
        const isInsideContainer = e.clientX >= containerRect.left &&
            e.clientX <= containerRect.right &&
            e.clientY >= containerRect.top &&
            e.clientY <= containerRect.bottom;

        if (isInsideContainer) {
            // Calculate new position relative to container
            const newX = e.clientX - containerRect.left - dragOffset.x;
            const newY = e.clientY - containerRect.top - dragOffset.y;

            // Ensure element stays within bounds
            const elementRect = dragElement.getBoundingClientRect();
            const maxX = containerRect.width - elementRect.width;
            const maxY = containerRect.height - elementRect.height;

            const boundedX = Math.max(10, Math.min(maxX - 10, newX));
            const boundedY = Math.max(10, Math.min(maxY - 10, newY));

            // Position the element
            dragElement.style.position = 'absolute';
            dragElement.style.left = `${boundedX}px`;
            dragElement.style.top = `${boundedY}px`;
            dragElement.style.zIndex = '10';
            dragElement.setAttribute('data-user-added', 'true');

            console.log(`📍 Dropped at: ${boundedX}, ${boundedY}`);

            // Update HTML content
            onUpdateHtml(containerRef.current.innerHTML);
        }

        // Clean up - aggressively restore original element appearance
        if (dragElement) {
            // Force remove all drag-related styling
            dragElement.style.opacity = '1';
            dragElement.style.removeProperty('transform');
            dragElement.style.removeProperty('border');
            dragElement.classList.remove('being-dragged');

            // Force reflow to ensure styles are applied
            dragElement.offsetHeight;
        }

        if (ghostElement) {
            document.body.removeChild(ghostElement);
            setGhostElement(null);
        }

        setIsDragging(false);
        setDragElement(null);
        setDragOffset({ x: 0, y: 0 });
    }, [isDragging, dragElement, dragOffset, onUpdateHtml, ghostElement]);

    // Setup global mouse events for dragging
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Utility function to force reset any stuck transparent elements
    const resetAllElementsOpacity = useCallback(() => {
        if (!containerRef.current) return;

        const allElements = containerRef.current.querySelectorAll('*');
        allElements.forEach(element => {
            const el = element as HTMLElement;
            if (el.classList.contains('being-dragged')) {
                el.classList.remove('being-dragged');
                el.style.opacity = '1';
                el.style.removeProperty('transform');
                el.style.removeProperty('border');
            }
        });
    }, []);

    // Setup draggable attributes for elements
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const setupDraggableElements = () => {
            const elements = container.querySelectorAll('*');
            elements.forEach(element => {
                const el = element as HTMLElement;
                if (isDraggableElement(el)) {
                    el.style.cursor = 'grab';
                    el.setAttribute('data-draggable', 'true');
                    // Ensure element is not transparent
                    el.style.opacity = '1';
                    el.classList.remove('being-dragged');
                }
            });
        };

        setupDraggableElements();
        resetAllElementsOpacity();

        // Re-setup when content changes
        const observer = new MutationObserver(setupDraggableElements);
        observer.observe(container, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [cleanHtmlContent, isDraggableElement, resetAllElementsOpacity]);

    return (
        <div
            ref={containerRef}
            className={`mouse-drag-drop ${isDragging ? 'dragging-active' : ''}`}
            onMouseDown={handleMouseDown}
            role="application"
            aria-label="Wireframe editor - click and drag elements to move them"
        >
            {(cleanHtmlContent && cleanHtmlContent.length > 0) ? (
                <div dangerouslySetInnerHTML={{ __html: cleanHtmlContent }} />
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

export default MouseDragDrop;
