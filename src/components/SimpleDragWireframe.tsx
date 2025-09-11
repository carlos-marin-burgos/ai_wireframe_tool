import React, { useEffect, useRef, useState } from 'react';
import dragula from 'dragula';
import 'dragula/dist/dragula.css';
import './SimpleDragWireframe.css';

interface OrderingMetadata {
    id: string;
    tagName: string;
    className?: string;
    textContent?: string;
    children: OrderingMetadata[];
}

interface SimpleDragWireframeProps {
    htmlContent: string;
    onUpdateContent?: (newContent: string) => void;
    onOrderingChange?: (metadata: OrderingMetadata[]) => void;
}

// HTML sanitization function to prevent broken HTML display
function sanitizeHTML(html: string): string {
    if (!html || typeof html !== 'string') {
        return '';
    }

    try {
        // Clean up common AI response artifacts and malformed HTML
        let cleanHtml = html.trim();

        // Remove markdown code blocks if they exist
        cleanHtml = cleanHtml.replace(/^```html\s*/gi, '');
        cleanHtml = cleanHtml.replace(/^```\s*/gi, '');
        cleanHtml = cleanHtml.replace(/```\s*$/gi, '');

        // Remove any leading/trailing quotes or artifacts
        cleanHtml = cleanHtml.replace(/^['"`]+|['"`]+$/g, '');

        // If it's a complete HTML document, extract styles and body content
        if (cleanHtml.includes('<html') && cleanHtml.includes('</html>')) {
            // Extract styles from head
            const styleMatches = cleanHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
            let styles = '';
            if (styleMatches) {
                styles = styleMatches.join('\n');
            }

            // Extract body content
            const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            if (bodyMatch) {
                // Combine styles with body content
                cleanHtml = styles + bodyMatch[1];
            }
        }

        // Validate that we have some HTML tags
        if (!cleanHtml.includes('<') || !cleanHtml.includes('>')) {
            return `<div style="padding: 20px; color: #666; font-family: 'Segoe UI', sans-serif;">
                <p><strong>⚠️ HTML Rendering Issue</strong></p>
                <p>The wireframe content appears to be malformed. Please try regenerating the wireframe.</p>
            </div>`;
        }

        return cleanHtml;
    } catch (error) {
        return `<div style="padding: 20px; color: #dc3545; font-family: 'Segoe UI', sans-serif;">
            <p><strong>❌ HTML Parsing Error</strong></p>
            <p>Failed to parse wireframe content. Please try regenerating the wireframe.</p>
        </div>`;
    }
}

const SimpleDragWireframe: React.FC<SimpleDragWireframeProps> = ({
    htmlContent,
    onUpdateContent,
    onOrderingChange
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const dragulaRef = useRef<any>(null);
    const [isDragEnabled, setIsDragEnabled] = useState(false);

    // Function to make elements editable
    const makeElementsEditable = (container: HTMLElement) => {
        if (!container) return;

        const editableSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'button', 'li', 'td', 'th', 'label'];

        editableSelectors.forEach(selector => {
            const elements = container.querySelectorAll(selector);
            elements.forEach(element => {
                if (element instanceof HTMLElement && element.textContent?.trim() &&
                    !element.classList.contains('dragula-container')) {

                    // Only make it editable if it doesn't contain other editable elements
                    const hasEditableChildren = element.querySelector('h1, h2, h3, h4, h5, h6, p, span, a, button, li, td, th, label');

                    if (!hasEditableChildren) {
                        element.setAttribute('data-editable', 'true');
                        element.addEventListener('click', handleElementClick);
                    }

                    // Mark container elements (divs, sections, articles, etc.) as draggable if they have content
                    // but don't make them editable if they contain other editable elements
                    if ((element.tagName === 'DIV' || element.tagName === 'SECTION' ||
                        element.tagName === 'ARTICLE' || element.tagName === 'ASIDE' ||
                        element.classList.contains('card') || element.classList.contains('block'))
                        && element.textContent?.trim().length > 10) {
                        element.setAttribute('data-draggable', 'true');
                        // Don't make containers editable, only their text content
                    } else if (!hasEditableChildren) {
                        // Only text elements without children get both editable and draggable
                        element.setAttribute('data-draggable', 'true');
                    }
                }
            });
        });
    };

    // Handle click on editable elements
    const handleElementClick = (event: Event) => {
        if (isDragEnabled) return; // Don't allow editing in drag mode

        event.stopPropagation();
        const element = event.target as HTMLElement;
        if (!element || element.contentEditable === 'true') return;

        element.contentEditable = 'true';
        element.focus();

        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);

        const handleBlur = () => {
            element.contentEditable = 'false';
            element.removeEventListener('blur', handleBlur);
            element.removeEventListener('keydown', handleKeyDown);

            if (containerRef.current && onUpdateContent) {
                onUpdateContent(containerRef.current.innerHTML);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                element.blur();
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                element.blur();
            }
        };

        element.addEventListener('blur', handleBlur);
        element.addEventListener('keydown', handleKeyDown);
    };

    const toggleDragMode = () => {
        setIsDragEnabled(!isDragEnabled);
    };

    // HTML content effect - runs when htmlContent changes
    useEffect(() => {
        if (!containerRef.current) return;

        // Sanitize and parse the HTML content safely
        const sanitizedHTML = sanitizeHTML(htmlContent);

        try {
            // Use innerHTML only after sanitization
            containerRef.current.innerHTML = sanitizedHTML;
        } catch (error) {
            containerRef.current.innerHTML = `<div style="padding: 20px; color: #dc3545; font-family: 'Segoe UI', sans-serif;">
                <p><strong>❌ Wireframe Rendering Error</strong></p>
                <p>Could not render the wireframe. Please try regenerating it.</p>
            </div>`;
        }
    }, [htmlContent]);

    // Separate effect for managing editable elements - runs when content or drag mode changes
    useEffect(() => {
        if (!containerRef.current) return;

        // Clean up existing event listeners
        const existingEditableElements = containerRef.current.querySelectorAll('[data-editable="true"]');
        existingEditableElements.forEach(element => {
            element.removeEventListener('click', handleElementClick);
            element.removeAttribute('data-editable');
            element.removeAttribute('data-draggable');
        });

        // Re-attach editable functionality
        makeElementsEditable(containerRef.current);

        return () => {
            if (containerRef.current) {
                const editableElements = containerRef.current.querySelectorAll('[data-editable="true"]');
                editableElements.forEach(element => {
                    element.removeEventListener('click', handleElementClick);
                });
            }
        };
    }, [htmlContent, isDragEnabled]); // Re-run when drag mode changes

    // Dragula effect - runs when drag mode changes
    useEffect(() => {
        if (!containerRef.current) return;

        if (dragulaRef.current) {
            dragulaRef.current.destroy();
        }

        // Initialize dragula with better container detection
        dragulaRef.current = dragula([containerRef.current], {
            moves: function (el, source, handle, sibling) {
                const element = el as HTMLElement;
                // Only allow dragging if drag mode is enabled and element is not currently being edited
                const isCurrentlyEditable = element.contentEditable === 'true';
                const hasText = element.textContent?.trim().length > 0;

                // Allow moving elements that have content and are not being edited
                return isDragEnabled && !isCurrentlyEditable && hasText;
            },
            accepts: function (el, target, source, sibling) {
                // Allow dropping into the main container or any child container
                return target === containerRef.current || containerRef.current?.contains(target);
            },
            copy: false,
            revertOnSpill: true,
            removeOnSpill: false
        });

        dragulaRef.current.on('drop', () => {
            if (containerRef.current && onUpdateContent) {
                try {
                    const newContent = containerRef.current.innerHTML;
                    onUpdateContent(newContent);

                    // Generate ordering metadata if callback provided
                    if (onOrderingChange) {
                        const metadata = generateOrderingMetadata(containerRef.current);
                        onOrderingChange(metadata);
                    }
                } catch (error) {
                    // Silent error handling for drag operations
                }
            }
        });

        return () => {
            if (dragulaRef.current) {
                dragulaRef.current.destroy();
            }
        };
    }, [isDragEnabled, onUpdateContent, onOrderingChange]);

    // Generate ordering metadata from DOM structure
    const generateOrderingMetadata = (element: Element): OrderingMetadata[] => {
        const metadata: OrderingMetadata[] = [];

        Array.from(element.children).forEach((child, index) => {
            if (child instanceof HTMLElement) {
                const childMetadata: OrderingMetadata = {
                    id: child.id || `element-${index}`,
                    tagName: child.tagName.toLowerCase(),
                    className: child.className,
                    textContent: child.textContent?.substring(0, 50) || '',
                    children: generateOrderingMetadata(child)
                };
                metadata.push(childMetadata);
            }
        });

        return metadata;
    };

    return (
        <div className="simple-drag-wireframe">
            {/* Drag Mode Toggle */}
            <div className="drag-mode-controls">
                <button
                    className={`drag-toggle-btn ${isDragEnabled ? 'enabled' : 'disabled'}`}
                    onClick={toggleDragMode}
                    title={isDragEnabled ? "Click to disable drag mode" : "Click to enable drag mode"}
                >
                    {isDragEnabled ? (
                        <>🔒 <span>Drag Mode: ON</span></>
                    ) : (
                        <>🔓 <span>Drag Mode: OFF</span></>
                    )}
                </button>
                <small className="drag-mode-hint">
                    {isDragEnabled
                        ? "You can drag and drop elements. Click to lock."
                        : "Drag mode disabled. Click to enable dragging."
                    }
                </small>
            </div>

            <div
                ref={containerRef}
                className={`dragula-container ${isDragEnabled ? 'drag-enabled' : 'drag-disabled'}`}
            ></div>
        </div>
    );
};

export default SimpleDragWireframe;
