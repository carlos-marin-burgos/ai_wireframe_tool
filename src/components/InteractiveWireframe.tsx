import React, { useState, useRef, useEffect } from 'react';
import { FiMove, FiX, FiEdit3 } from 'react-icons/fi';
import { fixWireframeImages } from '../utils/imagePlaceholders';
import './InteractiveWireframe.css';

interface WireframeComponent {
    id: string;
    type: string;
    content: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
}

interface InteractiveWireframeProps {
    htmlContent: string;
    onUpdateContent?: (newContent: string) => void;
}

const InteractiveWireframe: React.FC<InteractiveWireframeProps> = ({
    htmlContent,
    onUpdateContent,
}) => {
    const [components, setComponents] = useState<WireframeComponent[]>([]);
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const wireframeRef = useRef<HTMLDivElement>(null);

    // Parse HTML content into interactive components
    useEffect(() => {
        // Only parse if this is clearly a component library wireframe
        if (htmlContent.includes('Component Library Wireframe')) {
            parseHtmlToComponents(htmlContent);
        } else {
            // For regular wireframes, don't make them interactive
            setComponents([]);
        }
    }, [htmlContent]);

    const parseHtmlToComponents = (html: string) => {
        // Simple approach: only parse if we know it's from component library
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Only look for absolute positioned elements (our component additions)
        const absoluteElements = doc.querySelectorAll('div[style*="position: absolute"]');

        const parsedComponents: WireframeComponent[] = Array.from(absoluteElements).map((el, index) => {
            // Extract position from inline styles
            const style = el.getAttribute('style') || '';
            const leftMatch = style.match(/left:\s*(\d+)px/);
            const topMatch = style.match(/top:\s*(\d+)px/);

            const x = leftMatch ? parseInt(leftMatch[1]) : 50;
            const y = topMatch ? parseInt(topMatch[1]) : 50;

            return {
                id: `component-${index}`,
                type: 'library-component',
                content: el.innerHTML,
                x: x,
                y: y,
                width: 200,
                height: 40,
            };
        });

        setComponents(parsedComponents);
    };

    const handleMouseDown = (e: React.MouseEvent, componentId: string) => {
        e.preventDefault();
        const component = components.find(c => c.id === componentId);
        if (!component) return;

        const rect = e.currentTarget.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });

        setSelectedComponent(componentId);
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !selectedComponent || !wireframeRef.current) return;

        const wireframeRect = wireframeRef.current.getBoundingClientRect();
        const newX = e.clientX - wireframeRect.left - dragOffset.x;
        const newY = e.clientY - wireframeRect.top - dragOffset.y;

        setComponents(prev => prev.map(component =>
            component.id === selectedComponent
                ? { ...component, x: Math.max(0, newX), y: Math.max(0, newY) }
                : component
        ));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (onUpdateContent) {
            generateUpdatedHtml();
        }
    };

    const handleDeleteComponent = (componentId: string) => {
        setComponents(prev => prev.filter(c => c.id !== componentId));
        setSelectedComponent(null);
        if (onUpdateContent) {
            generateUpdatedHtml();
        }
    };

    const generateUpdatedHtml = () => {
        // Generate new HTML with updated positions
        const containerStyle = `
      position: relative;
      min-height: 600px;
      background: #f9f9f9;
      border: 1px solid #e1dfdd;
      border-radius: 4px;
      padding: 20px;
    `;

        const componentsHtml = components.map(component => `
      <div style="position: absolute; left: ${component.x}px; top: ${component.y}px;">
        ${component.content}
      </div>
    `).join('');

        const newHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Interactive Wireframe</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; }
              .wireframe-container { ${containerStyle} }
              .button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; }
              .button-primary { background: #0078d4; color: white; }
              .button-secondary { background: #f3f2f1; color: #323130; border: 1px solid #e1dfdd; }
              .button-lg { padding: 12px 24px; }
              .button-search { display: inline-flex; align-items: center; gap: 8px; }
          </style>
      </head>
      <body>
          <div class="wireframe-container">
              ${componentsHtml}
          </div>
      </body>
      </html>
    `;

        if (onUpdateContent) {
            onUpdateContent(newHtml);
        }
    };

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

    if (components.length === 0) {
        return (
            <div className="interactive-wireframe-container">
                <div className="wireframe-content">
                    <div dangerouslySetInnerHTML={{ __html: cleanHtmlContent }} />
                </div>
            </div>
        );
    }

    return (
        <div
            className="interactive-wireframe-container"
            ref={wireframeRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="wireframe-canvas">
                {components.map(component => (
                    <div
                        key={component.id}
                        className={`draggable-component ${selectedComponent === component.id ? 'selected' : ''} ${isDragging && selectedComponent === component.id ? 'grabbing' : 'grab'}`}
                        style={{
                            '--component-x': `${component.x}px`,
                            '--component-y': `${component.y}px`,
                            '--z-index': selectedComponent === component.id ? '1000' : '1',
                        } as React.CSSProperties}
                        onMouseDown={(e) => handleMouseDown(e, component.id)}
                    >
                        {/* Component Controls */}
                        {selectedComponent === component.id && (
                            <div className="component-controls">
                                <button
                                    className="control-btn move-btn"
                                    title="Move Component"
                                >
                                    <FiMove />
                                </button>
                                <button
                                    className="control-btn delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteComponent(component.id);
                                    }}
                                    title="Delete Component"
                                >
                                    <FiX />
                                </button>
                                <button
                                    className="control-btn edit-btn"
                                    title="Edit Component"
                                >
                                    <FiEdit3 />
                                </button>
                            </div>
                        )}

                        {/* Component Content */}
                        <div
                            className={`component-content component-${component.type}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedComponent(component.id);
                            }}
                        >
                            <div dangerouslySetInnerHTML={{ __html: component.content }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Instructions */}
            {components.length > 0 && (
                <div className="wireframe-instructions">
                    <p>💡 Click components to select them, then drag to reposition. Use controls to delete or edit.</p>
                </div>
            )}
        </div>
    );
};

export default InteractiveWireframe;
