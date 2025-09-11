import React, { useEffect, useRef } from 'react';
import dragula from 'dragula';
import 'dragula/dist/dragula.css';
import './SimpleDragWireframe.css';

interface SimpleDragWireframeProps {
    htmlContent: string;
    onUpdateContent?: (newContent: string) => void;
}

// HTML sanitization function to prevent broken HTML display
function sanitizeHTML(html: string): string {
    if (!html || typeof html !== 'string') {
        console.warn('SimpleDragWireframe: Received invalid HTML content', typeof html, html);
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
            console.warn('SimpleDragWireframe: HTML content appears to be plain text or malformed');
            return `<div style="padding: 20px; color: #666; font-family: 'Segoe UI', sans-serif;">
                <p><strong>⚠️ HTML Rendering Issue</strong></p>
                <p>The wireframe content appears to be malformed. Please try regenerating the wireframe.</p>
            </div>`;
        }

        return cleanHtml;
    } catch (error) {
        console.error('SimpleDragWireframe: Error sanitizing HTML:', error);
        return `<div style="padding: 20px; color: #dc3545; font-family: 'Segoe UI', sans-serif;">
            <p><strong>❌ HTML Parsing Error</strong></p>
            <p>Failed to parse wireframe content. Please try regenerating the wireframe.</p>
        </div>`;
    }
}

const SimpleDragWireframe: React.FC<SimpleDragWireframeProps> = ({
    htmlContent,
    onUpdateContent
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const dragulaRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clean up previous dragula instance
        if (dragulaRef.current) {
            dragulaRef.current.destroy();
        }

        // Sanitize and parse the HTML content safely
        const sanitizedHTML = sanitizeHTML(htmlContent);

        try {
            // Use innerHTML only after sanitization
            containerRef.current.innerHTML = sanitizedHTML;
        } catch (error) {
            console.error('SimpleDragWireframe: Error setting innerHTML:', error);
            containerRef.current.innerHTML = `<div style="padding: 20px; color: #dc3545; font-family: 'Segoe UI', sans-serif;">
                <p><strong>❌ Wireframe Rendering Error</strong></p>
                <p>Could not render the wireframe. Please try regenerating it.</p>
            </div>`;
            return;
        }

        // Initialize dragula on the container itself
        dragulaRef.current = dragula([containerRef.current], {
            moves: function (el, source, handle, sibling) {
                // Don't allow dragging elements that are being edited
                if ((el as HTMLElement).contentEditable === 'true') {
                    return false;
                }
                return true; // Allow all other elements to be moved
            },
            accepts: function (el, target, source, sibling) {
                // Only allow dropping directly into the main container
                return target === containerRef.current;
            }
        });

        // Update content when items are moved
        dragulaRef.current.on('drop', () => {
            if (containerRef.current && onUpdateContent) {
                try {
                    const newContent = containerRef.current.innerHTML;
                    onUpdateContent(newContent);
                    console.log('Drag completed, content updated!');
                } catch (error) {
                    console.error('SimpleDragWireframe: Error updating content after drag:', error);
                }
            }
        });

        // INLINE EDITING FUNCTIONALITY - Using event delegation to survive DOM updates
        const makeElementsEditable = () => {
            const selectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'button', 'div', 'span'];
            let count = 0;

            selectors.forEach(selector => {
                const elements = containerRef.current?.querySelectorAll(selector);
                elements?.forEach(element => {
                    // Skip if it has child elements (except button)
                    if (element.children.length > 0 && element.tagName !== 'BUTTON') {
                        return;
                    }

                    // Skip if no text content
                    if (!element.textContent?.trim()) {
                        return;
                    }

                    // Already processed
                    if (element.getAttribute('data-editable') === 'true') {
                        return;
                    }

                    console.log(`Making ${element.tagName} editable:`, element.textContent.trim());

                    element.setAttribute('data-editable', 'true');
                    count++;
                });
            });

            console.log(`Total editable elements: ${count}`);
        };

        // Use event delegation on the container instead of individual element listeners
        const handleContainerClick = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target && target.getAttribute('data-editable') === 'true') {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 CLICK DETECTED on', target.tagName, '- calling startEditing');
                startEditing(target);
            }
        };

        // Attach single event listener to container
        containerRef.current.addEventListener('click', handleContainerClick);

        const startEditing = (element: HTMLElement) => {
            console.log('🚀 Starting to edit:', element.tagName, element.textContent);

            // Set contentEditable
            element.contentEditable = 'true';
            console.log('✅ Set contentEditable to true');

            // Focus the element
            element.focus();
            console.log('✅ Focused element');

            // Select all text
            const range = document.createRange();
            range.selectNodeContents(element);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);

            // Handle key events
            function handleKeyDown(e: KeyboardEvent) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    finishEditing(element);
                }
            }

            function handleBlur() {
                setTimeout(() => finishEditing(element), 100);
            }

            element.addEventListener('keydown', handleKeyDown);
            element.addEventListener('blur', handleBlur);

            // Store cleanup
            (element as any)._cleanup = () => {
                element.removeEventListener('keydown', handleKeyDown);
                element.removeEventListener('blur', handleBlur);
            };
        };

        const finishEditing = (element: HTMLElement) => {
            element.contentEditable = 'false';

            if ((element as any)._cleanup) {
                (element as any)._cleanup();
                delete (element as any)._cleanup;
            }

            console.log('Finished editing:', element.textContent);

            // Update content after editing - but with debouncing to prevent multiple updates
            if (containerRef.current && onUpdateContent) {
                try {
                    const newContent = containerRef.current.innerHTML;
                    onUpdateContent(newContent);
                    console.log('Edit completed, content updated!');
                } catch (error) {
                    console.error('SimpleDragWireframe: Error updating content after edit:', error);
                }
            }
        };

        // CRITICAL: Wait for DOM to be ready then make elements editable
        setTimeout(() => {
            makeElementsEditable();
        }, 100);

        // Initialize dragula on the container itself
        dragulaRef.current = dragula([containerRef.current], {
            moves: function (el, source, handle, sibling) {
                // Don't allow dragging elements that are being edited
                if ((el as HTMLElement).contentEditable === 'true') {
                    return false;
                }
                return true; // Allow all other elements to be moved
            },
            accepts: function (el, target, source, sibling) {
                // Only allow dropping directly into the main container
                return target === containerRef.current;
            }
        });

        // Update content when items are moved
        dragulaRef.current.on('drop', () => {
            if (containerRef.current && onUpdateContent) {
                try {
                    const newContent = containerRef.current.innerHTML;
                    onUpdateContent(newContent);
                    console.log('Drag completed, content updated!');
                } catch (error) {
                    console.error('SimpleDragWireframe: Error updating content after drag:', error);
                }
            }
        });

        // CRITICAL: Wait for DOM to be ready then make elements editable
        setTimeout(() => {
            makeElementsEditable();
        }, 100);

        return () => {
            if (dragulaRef.current) {
                dragulaRef.current.destroy();
            }
            // Clean up event delegation
            if (containerRef.current) {
                containerRef.current.removeEventListener('click', handleContainerClick);
            }
        };
    }, [htmlContent, onUpdateContent]);

    return (
        <div className="simple-drag-wireframe">
            <div ref={containerRef} className="dragula-container"></div>
        </div>
    );
};

export default SimpleDragWireframe;
