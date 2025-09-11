/*
 * Enhanced SimpleDragWireframe Component
 * 
 * Features:
 * 1. Cross-container moves - Elements can be moved between .row, .col, .section, etc.
 * 2. Drag mode toggle - Button to enable/disable dragging to prevent accidental moves
 * 3. Ordering metadata - Semantic structure tracking for better diffing
 * 
 * Usage:
 * <SimpleDragWireframe 
 *   htmlContent={wireframeHtml}
 *   onUpdateContent={(newHtml) => setWireframeHtml(newHtml)}
 *   onOrderingChange={(metadata) => console.log('Structure changed:', metadata)}
 * />
 */

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

// Generate ordering metadata from DOM structure
function generateOrderingMetadata(element: Element, index: number = 0): OrderingMetadata {
    const id = element.id || `element-${element.tagName.toLowerCase()}-${index}`;

    return {
        id,
        tagName: element.tagName.toLowerCase(),
        className: element.className || undefined,
        textContent: element.textContent?.trim().substring(0, 50) || undefined,
        children: Array.from(element.children).map((child, childIndex) =>
            generateOrderingMetadata(child, childIndex)
        )
    };
}

// Find all containers that can accept drops (rows, cols, sections, etc.)
function findDragContainers(rootElement: HTMLElement): HTMLElement[] {
    const containers = [rootElement]; // Always include the root
    const selectors = [
        '.row', '.col', '.column',
        '.container', '.section', '.grid',
        '[data-droppable="true"]',
        '.card-body', '.panel-body'
    ];

    selectors.forEach(selector => {
        const elements = rootElement.querySelectorAll(selector);
        elements.forEach(el => {
            if (el instanceof HTMLElement) {
                containers.push(el);
            }
        });
    });

    return [...new Set(containers)]; // Remove duplicates
}
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
    const [dragContainers, setDragContainers] = useState<HTMLElement[]>([]);

    // Function to update ordering metadata
    const updateOrderingMetadata = () => {
        if (!containerRef.current || !onOrderingChange) return;

        const metadata = Array.from(containerRef.current.children).map((child, index) =>
            generateOrderingMetadata(child, index)
        );
        onOrderingChange(metadata);
    };

    // Function to toggle drag mode
    const toggleDragMode = () => {
        setIsDragEnabled(!isDragEnabled);
    };

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
            containerRef.current.innerHTML = `<div style="padding: 20px; color: #dc3545; font-family: 'Segoe UI', sans-serif;">
                <p><strong>❌ Wireframe Rendering Error</strong></p>
                <p>Could not render the wireframe. Please try regenerating it.</p>
            </div>`;
            return;
        }

        // Find all containers that can accept drops
        const containers = findDragContainers(containerRef.current);
        setDragContainers(containers);

        // Initialize dragula with cross-container support
        dragulaRef.current = dragula(containers, {
            moves: function (el, source, handle, sibling) {
                // Only allow moves if drag mode is enabled
                if (!isDragEnabled) return false;

                // Allow all elements to be moved
                return true;
            },
            accepts: function (el, target, source, sibling) {
                // Allow cross-container moves (ensure target is HTMLElement)
                return target instanceof HTMLElement && containers.includes(target);
            },
            invalid: function (el, handle) {
                // Don't allow dragging of form inputs, buttons, links
                if (!(el instanceof HTMLElement)) return true;

                return el.tagName === 'INPUT' ||
                    el.tagName === 'BUTTON' ||
                    el.tagName === 'A' ||
                    el.contentEditable === 'true';
            }
        });

        // Update content and metadata when items are moved
        dragulaRef.current.on('drop', () => {
            if (containerRef.current && onUpdateContent) {
                try {
                    const newContent = containerRef.current.innerHTML;
                    onUpdateContent(newContent);
                    updateOrderingMetadata();
                } catch (error) {
                    // Silent error handling
                }
            }
        });

        // Initial metadata generation
        updateOrderingMetadata();

        return () => {
            if (dragulaRef.current) {
                dragulaRef.current.destroy();
            }
        };
    }, [htmlContent, onUpdateContent, onOrderingChange, isDragEnabled]);

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
                        <>
                            🔒 <span>Drag Mode: ON</span>
                        </>
                    ) : (
                        <>
                            🔓 <span>Drag Mode: OFF</span>
                        </>
                    )}
                </button>
                <small className="drag-mode-hint">
                    {isDragEnabled
                        ? "You can drag and drop elements. Click to lock."
                        : "Drag mode disabled. Click to enable dragging."
                    }
                </small>
            </div>

            {/* Main wireframe container */}
            <div
                ref={containerRef}
                className={`dragula-container ${isDragEnabled ? 'drag-enabled' : 'drag-disabled'}`}
            ></div>

            {/* Info about containers */}
            {dragContainers.length > 1 && (
                <div className="drag-info">
                    <small>
                        ℹ️ Cross-container dragging enabled: {dragContainers.length} drop zones detected
                    </small>
                </div>
            )}
        </div>
    );
};

export default SimpleDragWireframe;
