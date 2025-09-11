import React, { useEffect, useRef, useState, useCallback } from 'react';
import dragula from 'dragula';
import 'dragula/dist/dragula.css';
import './EditableWireframe.css';

interface EditableWireframeProps {
    htmlContent: string;
    onUpdateContent?: (html: string) => void;
    onElementSelect?: (element: HTMLElement) => void;
}

// HTML sanitization function
function sanitizeHTML(html: string): string {
    if (!html || typeof html !== 'string') {
        console.warn('EditableWireframe: Received invalid HTML content', typeof html, html);
        return '';
    }

    try {
        let cleanHtml = html.trim();

        // Remove markdown code blocks if they exist
        cleanHtml = cleanHtml.replace(/^```html\s*/gi, '');
        cleanHtml = cleanHtml.replace(/^```\s*/gi, '');
        cleanHtml = cleanHtml.replace(/```\s*$/gi, '');
        cleanHtml = cleanHtml.replace(/^['"`]+|['"`]+$/g, '');

        // If it's a complete HTML document, extract styles and body content
        if (cleanHtml.includes('<html') && cleanHtml.includes('</html>')) {
            const styleMatch = cleanHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
            const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

            if (bodyMatch) {
                cleanHtml = bodyMatch[1];
                if (styleMatch) {
                    cleanHtml = styleMatch.join('\n') + '\n' + cleanHtml;
                }
            }
        }

        return cleanHtml;
    } catch (error) {
        console.error('Error sanitizing HTML:', error);
        return html;
    }
}

const EditableWireframe: React.FC<EditableWireframeProps> = ({
    htmlContent,
    onUpdateContent,
    onElementSelect
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const dragulaRef = useRef<any>(null);
    const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Make text elements editable - simplified and reliable like the working test page
    const makeTextElementsEditable = useCallback(() => {
        if (!containerRef.current) {
            console.log('❌ Container ref not available');
            return;
        }

        console.log('🔧 Making text elements editable...');

        // Text element selectors - same as working test page
        const textElementSelectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'span', 'div',
            'a', 'button',
            'label', 'td', 'th',
            'li', 'blockquote'
        ];

        let editableCount = 0;

        textElementSelectors.forEach(selector => {
            const elements = containerRef.current!.querySelectorAll(selector);
            console.log(`🔍 Found ${elements.length} elements for selector: ${selector}`);

            elements.forEach((element) => {
                const htmlElement = element as HTMLElement;

                // Skip if it's a container with child elements (same logic as test page)
                if (htmlElement.children.length > 0 && htmlElement.tagName !== 'BUTTON' && htmlElement.tagName !== 'A') {
                    console.log(`⏭️ Skipping ${htmlElement.tagName} - has children: ${htmlElement.children.length}`);
                    return;
                }

                // Only make editable if it has text content (same logic as test page)
                if (!htmlElement.textContent?.trim()) {
                    console.log(`⏭️ Skipping ${htmlElement.tagName} - no text content`);
                    return;
                }

                // Don't double-process elements
                if (htmlElement.getAttribute('data-editable') === 'true') {
                    console.log(`⏭️ Already processed ${htmlElement.tagName}`);
                    return;
                }

                console.log(`✅ Making ${htmlElement.tagName} editable: "${htmlElement.textContent.trim()}"`);

                // Mark as editable (same as test page)
                htmlElement.setAttribute('data-editable', 'true');
                htmlElement.style.cursor = 'text';
                htmlElement.style.outline = 'none';

                // Add click listener (EXACTLY like test page)
                htmlElement.addEventListener('click', function (e: Event) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`🖱️ Clicked on editable element: ${htmlElement.tagName} - "${htmlElement.textContent?.trim()}"`);
                    startEditing(htmlElement);
                });

                // Add hover effects (EXACTLY like test page)
                htmlElement.addEventListener('mouseenter', function () {
                    if (!isEditing) {
                        htmlElement.style.backgroundColor = 'rgba(0, 120, 212, 0.1)';
                        htmlElement.style.borderRadius = '2px';
                    }
                });

                htmlElement.addEventListener('mouseleave', function () {
                    if (!isEditing || selectedElement !== htmlElement) {
                        htmlElement.style.backgroundColor = '';
                        htmlElement.style.borderRadius = '';
                    }
                });

                editableCount++;
            });
        });

        console.log(`🎯 Total editable elements created: ${editableCount}`);
    }, []); // No dependencies to prevent issues

    // Start editing a text element - simplified like test page
    const startEditing = useCallback((element: HTMLElement) => {
        console.log(`🚀 Starting to edit element: ${element.tagName} - "${element.textContent}"`);

        if (isEditing && selectedElement && selectedElement !== element) {
            finishEditing(selectedElement);
        }

        setSelectedElement(element);
        setIsEditing(true);

        // Make contentEditable (EXACTLY like test page)
        element.contentEditable = 'true';
        element.focus();

        // Select all text (EXACTLY like test page)
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);

        // Style for editing mode (EXACTLY like test page)
        element.style.backgroundColor = 'rgba(0, 120, 212, 0.2)';
        element.style.border = '2px solid #0078d4';
        element.style.borderRadius = '4px';
        element.style.padding = '2px 4px';

        console.log(`✅ Element is now contentEditable: ${element.contentEditable}`);

        // Call select callback
        onElementSelect?.(element);

        // Handle key events (simplified)
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                finishEditing(element);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                finishEditing(element);
            }
        };

        // Handle blur (click outside)
        const handleBlur = () => {
            setTimeout(() => finishEditing(element), 100);
        };

        element.addEventListener('keydown', handleKeyDown);
        element.addEventListener('blur', handleBlur);

        // Store cleanup functions
        (element as any)._editCleanup = () => {
            element.removeEventListener('keydown', handleKeyDown);
            element.removeEventListener('blur', handleBlur);
        };
    }, []); // No dependencies

    // Finish editing - simplified like test page
    const finishEditing = useCallback((element: HTMLElement) => {
        if (!element) return;

        console.log(`💾 Finishing edit of element: ${element.tagName} - New content: "${element.textContent}"`);

        element.contentEditable = 'false';
        element.style.backgroundColor = '';
        element.style.border = '';
        element.style.borderRadius = '';
        element.style.padding = '';

        // Cleanup event listeners
        if ((element as any)._editCleanup) {
            (element as any)._editCleanup();
            delete (element as any)._editCleanup;
        }

        setIsEditing(false);
        setSelectedElement(null);

        // Update content
        if (onUpdateContent && containerRef.current) {
            onUpdateContent(containerRef.current.innerHTML);
        }
    }, []); // No dependencies

    useEffect(() => {
        if (!containerRef.current) return;

        // Clean up previous dragula instance
        if (dragulaRef.current) {
            dragulaRef.current.destroy();
        }

        const sanitizedHTML = sanitizeHTML(htmlContent);

        try {
            containerRef.current.innerHTML = sanitizedHTML;
        } catch (error) {
            console.error('Error setting HTML content:', error);
            containerRef.current.innerHTML = '<p>Error rendering wireframe content</p>';
        }

        // Make text elements editable immediately (like test page)
        makeTextElementsEditable();

        // Initialize dragula for drag and drop functionality
        try {
            dragulaRef.current = dragula([containerRef.current], {
                moves: (el, source, handle, sibling) => {
                    // Don't allow dragging when editing
                    if (isEditing) return false;

                    // Don't drag editable elements when they're being edited
                    if ((el as HTMLElement).contentEditable === 'true') return false;

                    return true;
                },
                accepts: (el, target, source, sibling) => {
                    return target === containerRef.current;
                }
            });

            dragulaRef.current.on('drop', () => {
                if (onUpdateContent && containerRef.current) {
                    setTimeout(() => {
                        onUpdateContent(containerRef.current!.innerHTML);
                        makeTextElementsEditable(); // Re-apply after drag
                    }, 50);
                }
            });
        } catch (error) {
            console.error('Error initializing dragula:', error);
        }

        return () => {
            if (dragulaRef.current) {
                dragulaRef.current.destroy();
                dragulaRef.current = null;
            }
        };
    }, [htmlContent, makeTextElementsEditable]); // Include makeTextElementsEditable

    // Handle clicks outside to finish editing
    useEffect(() => {
        const handleDocumentClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (containerRef.current && !containerRef.current.contains(target)) {
                // Get current editing state from DOM
                const editingElements = containerRef.current.querySelectorAll('[contenteditable="true"]');
                editingElements.forEach((element) => {
                    finishEditing(element as HTMLElement);
                });
            }
        };

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, []); // Remove dependencies

    return (
        <div className="editable-wireframe">
            <div className="wireframe-toolbar">
                <span className="toolbar-text">
                    {isEditing ? '✏️ Editing mode - Click outside or press Enter to save' : '🖱️ Click any text to edit'}
                </span>
            </div>
            <div
                ref={containerRef}
                className="editable-wireframe-container"
            />
        </div>
    );
};

export default EditableWireframe;
