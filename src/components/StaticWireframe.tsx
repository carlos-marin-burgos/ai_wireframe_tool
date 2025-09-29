import React, { useState, useEffect, useRef, useCallback } from 'react';
import './StaticWireframe.css';
import { processWireframeForProduction } from '../utils/wireframeProcessor';

interface StaticWireframeProps {
    html: string;
    className?: string;
    isEditMode?: boolean;
    onUpdateContent?: (newContent: string) => void;
    onShowFormattingToolbar?: (show: boolean, position?: { top: number, left: number }) => void;
    onFormatCommand?: (command: string, value?: string) => void;
    onSetCurrentEditingElement?: (element: HTMLElement | null) => void;
    // Component placement mode props
    isPlacementMode?: boolean;
    pendingComponent?: any;
    onComponentPlacement?: (x: number, y: number, targetElement: HTMLElement) => void;
    onCancelPlacementMode?: () => void;
}

/**
 * StaticWireframe - Pure HTML wireframe display component
 * 
 * This component focuses solely on rendering AI-generated wireframes
 * without any drag-and-drop functionality that could interfere with layouts.
 * 
 * Key features:
 * - Clean HTML rendering without CSS interference
 * - Preserves AI-generated layouts (sidebars, flex structures)
 * - Responsive design support
 * - Simple and focused on display only
 */
const StaticWireframe: React.FC<StaticWireframeProps> = ({
    html,
    className = '',
    isEditMode = false,
    onUpdateContent,
    onShowFormattingToolbar,
    onFormatCommand,
    onSetCurrentEditingElement,
    // Component placement mode props
    isPlacementMode = false,
    pendingComponent,
    onComponentPlacement,
    onCancelPlacementMode
}) => {
    const [sanitizedContent, setSanitizedContent] = useState<string>('');
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Placement mode state
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [hoveredDropZone, setHoveredDropZone] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (html) {
            // Process the HTML to fix images and other issues, then prepare for display
            const processedHtml = processWireframeForProduction(html);
            const cleanedHtml = sanitizeAndPrepareHTML(processedHtml);
            setSanitizedContent(cleanedHtml);
        }
    }, [html]);

    // Handle edit mode - add contenteditable to text elements
    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const editableElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, a, li');

        editableElements.forEach((element) => {
            const htmlElement = element as HTMLElement;
            if (isEditMode) {
                // Enable editing
                htmlElement.contentEditable = 'true';
                htmlElement.style.outline = '1px dashed #007acc';
                htmlElement.style.cursor = 'text';
            } else {
                // Disable editing
                htmlElement.contentEditable = 'false';
                htmlElement.style.outline = 'none';
                htmlElement.style.cursor = 'default';
            }
        });
    }, [isEditMode, sanitizedContent]);

    // Handle clicks for editing
    const handleClick = useCallback((e: React.MouseEvent) => {
        if (!isEditMode) return;

        const target = e.target as HTMLElement;

        // Check if clicked element is editable
        if (target.contentEditable === 'true') {
            e.stopPropagation();

            // Set current editing element
            if (onSetCurrentEditingElement) {
                onSetCurrentEditingElement(target);
            }

            // Show formatting toolbar
            if (onShowFormattingToolbar) {
                const rect = target.getBoundingClientRect();
                onShowFormattingToolbar(true, {
                    top: rect.top - 10,
                    left: rect.left
                });
            }

            // Focus the element
            target.focus();
        } else {
            // Clicked on non-editable element - hide formatting toolbar
            if (onShowFormattingToolbar) {
                onShowFormattingToolbar(false);
            }

            // Clear current editing element
            if (onSetCurrentEditingElement) {
                onSetCurrentEditingElement(null);
            }
        }
    }, [isEditMode, onSetCurrentEditingElement, onShowFormattingToolbar]);

    // Handle content changes without interfering with typing flow
    const handleInput = useCallback((e: React.FormEvent) => {
        if (!isEditMode || !containerRef.current) return;

        // Don't update parent state during typing - this prevents re-renders
        // Content will be saved when user stops editing (blur event)
        console.log('Text input detected, allowing natural typing flow');
    }, [isEditMode]);

    // Handle when user finishes editing (blur or enter key)
    const handleEditComplete = useCallback((e: React.FocusEvent | React.KeyboardEvent) => {
        if (!isEditMode || !containerRef.current) return;

        if (e.type === 'keydown') {
            const keyEvent = e as React.KeyboardEvent;
            if (keyEvent.key !== 'Enter') return;
            keyEvent.preventDefault();
            (e.target as HTMLElement).blur();
            return; // Don't process further on Enter, let blur handle it
        }

        // Clear editing state
        const target = e.target as HTMLElement;
        if (target && target.contentEditable === 'true') {
            target.contentEditable = 'false';
            target.style.outline = '';
            target.style.backgroundColor = '';
        }

        // Clear current editing element
        if (onSetCurrentEditingElement) {
            onSetCurrentEditingElement(null);
        }

        // Hide formatting toolbar
        if (onShowFormattingToolbar) {
            onShowFormattingToolbar(false);
        }

        // Update parent state only when editing is complete
        if (onUpdateContent) {
            const updatedContent = containerRef.current.innerHTML;
            onUpdateContent(updatedContent);
        }

        console.log('Text editing completed, content saved, toolbar hidden');
    }, [isEditMode, onUpdateContent, onSetCurrentEditingElement, onShowFormattingToolbar]);    // Handle component placement
    const handlePlacementClick = useCallback((e: React.MouseEvent) => {
        if (!isPlacementMode || !onComponentPlacement) return;

        e.preventDefault();
        e.stopPropagation();

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        // Include scroll offset for accurate absolute positioning within content
        const scrollTop = containerRef.current?.scrollTop || 0;
        const scrollLeft = containerRef.current?.scrollLeft || 0;

        const x = (e.clientX - rect.left) + scrollLeft;
        const y = (e.clientY - rect.top) + scrollTop;
        const targetElement = e.target as HTMLElement;

        console.log('🎯 Component placement clicked at:', { x, y, scrollTop, scrollLeft }, 'Target element:', targetElement.tagName, targetElement.className);
        onComponentPlacement(x, y, targetElement);
    }, [isPlacementMode, onComponentPlacement]);

    // Handle mouse movement for placement mode cursor
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isPlacementMode) return;

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        // For cursor positioning, use viewport coordinates (without scroll offset)
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });

        // Highlight potential drop zones
        const target = e.target as HTMLElement;
        if (target && (target.className?.includes('col-') || target.tagName === 'DIV')) {
            setHoveredDropZone(target);
        } else {
            setHoveredDropZone(null);
        }
    }, [isPlacementMode]);



    // Handle escape key to cancel placement mode or hide formatting toolbar
    useEffect(() => {
        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isPlacementMode && onCancelPlacementMode) {
                    onCancelPlacementMode();
                } else if (isEditMode && onShowFormattingToolbar) {
                    // Hide formatting toolbar and clear editing state
                    onShowFormattingToolbar(false);
                    if (onSetCurrentEditingElement) {
                        onSetCurrentEditingElement(null);
                    }

                    // Remove contentEditable from any currently editing elements
                    const editingElements = containerRef.current?.querySelectorAll('[contenteditable="true"]');
                    editingElements?.forEach(el => {
                        if (el instanceof HTMLElement) {
                            el.contentEditable = 'false';
                            el.style.outline = '';
                            el.style.backgroundColor = '';
                        }
                    });
                }
            }
        };

        if (isPlacementMode || isEditMode) {
            document.addEventListener('keydown', handleEscapeKey);
            return () => document.removeEventListener('keydown', handleEscapeKey);
        }
    }, [isPlacementMode, onCancelPlacementMode, isEditMode, onShowFormattingToolbar, onSetCurrentEditingElement]);

    /**
     * Sanitize and prepare HTML for safe display
     * This function extracts the body content and styles while preserving layout structure
     */
    const sanitizeAndPrepareHTML = (rawHtml: string): string => {
        try {
            // Create a temporary DOM parser
            const parser = new DOMParser();
            const doc = parser.parseFromString(rawHtml, 'text/html');

            // Extract styles from the head
            const styleElements = doc.querySelectorAll('style, link[rel="stylesheet"]');
            let extractedStyles = '';

            styleElements.forEach(styleEl => {
                if (styleEl.tagName === 'STYLE') {
                    extractedStyles += styleEl.innerHTML + '\n';
                }
                // Note: We skip external stylesheets for security
            });

            // Extract the body content
            const bodyContent = doc.body?.innerHTML || rawHtml;

            // Combine styles and content
            const finalHtml = `
        <style>
          /* Reset and base styles for clean wireframe display */
          .static-wireframe-content * {
            box-sizing: border-box;
          }
          
          /* Preserve AI-generated styles */
          ${extractedStyles}
          
          /* Override any conflicting styles */
          .static-wireframe-content .main-container {
            display: flex !important;
            flex-direction: row !important;
            min-height: 100vh !important;
            width: 100% !important;
          }
          
          .static-wireframe-content .sidebar-left {
            order: 1 !important;
          }
          
          .static-wireframe-content .content-area {
            order: 2 !important;
            flex: 1 !important;
          }
          
          .static-wireframe-content .sidebar-right {
            order: 3 !important;
          }
        </style>
        <div class="static-wireframe-content">
          ${bodyContent}
        </div>
      `;

            return finalHtml;
        } catch (error) {
            console.error('Error sanitizing HTML:', error);
            return `<div class="wireframe-error">Error rendering wireframe: ${error}</div>`;
        }
    };

    if (!html) {
        return (
            <div className={`static-wireframe ${className}`}>
                <div className="wireframe-placeholder">
                    <h3>No wireframe content</h3>
                    <p>Generate a wireframe to see it displayed here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`static-wireframe ${className} ${isPlacementMode ? 'placement-mode' : ''}`}>
            {/* Placement mode overlay and instructions */}
            {isPlacementMode && (
                <>
                    <div className="placement-overlay">
                        <div className="placement-instructions">
                            <h4>🎯 Component Placement Mode</h4>
                            <p>Click anywhere on the wireframe to place: <strong>{pendingComponent?.name}</strong></p>
                            <p><kbd>ESC</kbd> to cancel</p>
                        </div>
                    </div>
                    {/* Placement cursor */}
                    <div
                        className="placement-cursor"
                        ref={(el) => {
                            if (el) {
                                el.style.left = `${mousePosition.x - 10}px`;
                                el.style.top = `${mousePosition.y - 10}px`;
                            }
                        }}
                    >
                        📦
                    </div>
                </>
            )}

            <div
                ref={containerRef}
                className={`wireframe-content ${isEditMode ? 'edit-mode' : ''} ${isPlacementMode ? 'placement-mode' : ''}`}
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                onClick={isPlacementMode ? handlePlacementClick : handleClick}
                onMouseMove={isPlacementMode ? handleMouseMove : undefined}
                onInput={handleInput}
                onBlur={handleEditComplete}
                onKeyDown={handleEditComplete}
            />
        </div>
    );
};

export default StaticWireframe;