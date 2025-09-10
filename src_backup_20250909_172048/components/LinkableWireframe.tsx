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

        return Boolean(hasAtlasClass || isPositioned || isContainer || hasDraggableAttr);
    }, []);

    // Handle drag start
    const handleDragStart = useCallback((event: React.MouseEvent, element: HTMLElement) => {
        event.preventDefault();
        event.stopPropagation();

        const rect = element.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();

        if (containerRect) {
            setDragOffset({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            });

            setDraggedElement(element);
            setIsDragging(true);
            setSelectedElement(element);

            // Add visual feedback
            element.style.zIndex = '1000';
            element.style.opacity = '0.8';
            element.style.cursor = 'grabbing';
            element.setAttribute('data-dragging', 'true');

            console.log('🎯 Started dragging element:', element.tagName, element.className);
        }
    }, []);

    // Handle drag move
    const handleDragMove = useCallback((event: React.MouseEvent) => {
        if (!isDragging || !draggedElement || !containerRef.current) return;

        event.preventDefault();

        const containerRect = containerRef.current.getBoundingClientRect();
        const newX = event.clientX - containerRect.left - dragOffset.x;
        const newY = event.clientY - containerRect.top - dragOffset.y;

        // Update element position
        draggedElement.style.position = 'absolute';
        draggedElement.style.left = `${Math.max(0, newX)}px`;
        draggedElement.style.top = `${Math.max(0, newY)}px`;

        console.log('🎯 Dragging to:', newX, newY);
    }, [isDragging, draggedElement, dragOffset]);

    // Handle drag end
    const handleDragEnd = useCallback(() => {
        if (!draggedElement) return;

        // Reset visual feedback
        draggedElement.style.zIndex = '';
        draggedElement.style.opacity = '';
        draggedElement.style.cursor = '';

        setIsDragging(false);
        setDraggedElement(null);

        // Update the HTML content
        if (containerRef.current && onUpdateHtml) {
            onUpdateHtml(containerRef.current.innerHTML);
        }

        console.log('🎯 Finished dragging element');
    }, [draggedElement, onUpdateHtml]);

    // Handle click on linkable elements
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
                const newX = e.clientX - containerRect.left - dragOffset.x;
                const newY = e.clientY - containerRect.top - dragOffset.y;

                draggedElement.style.position = 'absolute';
                draggedElement.style.left = `${Math.max(0, newX)}px`;
                draggedElement.style.top = `${Math.max(0, newY)}px`;
            }
        };

        const handleGlobalMouseUp = () => {
            if (isDragging && draggedElement) {
                draggedElement.style.zIndex = '';
                draggedElement.style.opacity = '';
                draggedElement.style.cursor = '';
                draggedElement.removeAttribute('data-dragging');

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
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
        >
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

                        // Check if it's draggable for left-click drag
                        if (e.button === 0 && isDraggableElement(target)) {
                            // Show drag hint on first use
                            if (!showDragHint) {
                                setShowDragHint(true);
                                setTimeout(() => setShowDragHint(false), 3000);
                            }

                            handleDragStart(e, target);
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

            {/* Drag hint notification */}
            {showDragHint && (
                <div className="drag-hint">
                    🎯 Drag components to move them around! Right-click buttons to add page links.
                </div>
            )}
        </div>
    );
};

export default LinkableWireframe;
