import React, { useRef, useState, useEffect, useCallback } from 'react';
import './RearrangeableWireframe.css';
import dragula, { Drake } from 'dragula';
import 'dragula/dist/dragula.css';
import { processWireframeForProduction } from '../utils/wireframeProcessor';

interface RearrangeableWireframeProps {
    htmlContent: string;
    onUpdateContent?: (newContent: string) => void;
    componentLibraryItems?: any[];
    gridSize?: number;
    enableResizing?: boolean;
    enableSnapping?: boolean;
}

interface DraggableItem {
    id: string;
    element: HTMLElement;
    row: number;
    col: number;
    width: number;
    height: number;
    content: string;
    type: string;
    css?: string; // Add CSS support
}

interface DropZone {
    row: number;
    col: number;
    element: HTMLElement;
}

const RearrangeableWireframe: React.FC<RearrangeableWireframeProps> = ({
    htmlContent,
    onUpdateContent,
    componentLibraryItems = [],
    gridSize = 12,
    enableResizing = true,
    enableSnapping = true
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const drakeRef = useRef<Drake | null>(null);
    const rowDrakeRef = useRef<Drake | null>(null);
    const [draggableItems, setDraggableItems] = useState<DraggableItem[]>([]);
    const [dropZones, setDropZones] = useState<DropZone[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedItem, setDraggedItem] = useState<DraggableItem | null>(null);
    const [hoveredZone, setHoveredZone] = useState<DropZone | null>(null);

    // Column width calculation (similar to CodePen)
    const COL_WIDTH = 62; // Base column width in pixels
    const GUTTER_WIDTH = 30;
    const MIN_HEIGHT = 100;

    // Initialize grid system (columns drag + rows drag)
    useEffect(() => {
        if (!containerRef.current) return;

        const items = parseHtmlToItems(htmlContent);
        setDraggableItems(items);
        createDropZones();

        // Initialize Dragula
        if (drakeRef.current) {
            drakeRef.current.destroy();
            drakeRef.current = null;
        }
        if (rowDrakeRef.current) {
            rowDrakeRef.current.destroy();
            rowDrakeRef.current = null;
        }

        // Wait for DOM to render generated HTML
        const initTimer = setTimeout(() => {
            const container = containerRef.current!;
            const rowContainers = Array.from(container.querySelectorAll('.drop-zone-row')) as HTMLElement[];
            if (rowContainers.length === 0) return;

            drakeRef.current = dragula(rowContainers, {
                direction: 'horizontal',
                copy: false,
                revertOnSpill: true,
                moves: (el, source, handle) => {
                    return (handle as HTMLElement).closest('.draggable-block') !== null;
                },
                accepts: (el, target, source, sibling) => {
                    // Only allow dropping inside row containers; prevent nesting into blocks
                    return (target as HTMLElement).classList.contains('drop-zone-row');
                }
            });

            drakeRef.current.on('drop', () => {
                // Read back DOM, rebuild items and regenerate HTML to persist
                const updated = readItemsFromDom(container);
                setDraggableItems(updated);
                const newHtml = generateHtmlFromItems(updated);
                onUpdateContent?.(newHtml);
            });

            // Initialize row-level Dragula (reorder rows vertically)
            const rowsRoot = container.querySelector('.container.rearrangeable-wireframe') as HTMLElement | null;
            if (rowsRoot) {
                rowDrakeRef.current = dragula([rowsRoot], {
                    direction: 'vertical',
                    revertOnSpill: true,
                    moves: (el, source, handle) => {
                        // Allow dragging only when starting from row handle
                        return (handle as HTMLElement).closest('.row-drag-handle') !== null;
                    },
                    accepts: (el, target) => {
                        return (target as HTMLElement).classList.contains('rearrangeable-wireframe');
                    }
                });

                rowDrakeRef.current.on('drop', () => {
                    const updated = readItemsFromDom(container);
                    setDraggableItems(updated);
                    const newHtml = generateHtmlFromItems(updated);
                    onUpdateContent?.(newHtml);
                });
            }
        }, 0);

        return () => {
            clearTimeout(initTimer);
            if (drakeRef.current) {
                drakeRef.current.destroy();
                drakeRef.current = null;
            }
            if (rowDrakeRef.current) {
                rowDrakeRef.current.destroy();
                rowDrakeRef.current = null;
            }
        };
    }, [htmlContent]);

    const parseHtmlToItems = (html: string): DraggableItem[] => {
        const tempDiv = document.createElement('div');
        // Process images and other wireframe fixes before parsing
        const processedHtml = processWireframeForProduction(html);
        tempDiv.innerHTML = processedHtml;

        const items: DraggableItem[] = [];
        let itemId = 0;

        // Find Bootstrap columns and convert them to draggable items
        const columns = tempDiv.querySelectorAll('[class*="col-"]');

        columns.forEach((col) => {
            const element = col as HTMLElement;
            const classList = Array.from(element.classList);

            // Extract column size from class (e.g., col-sm-3 -> width: 3)
            let width = 3; // default
            const colClass = classList.find(cls => cls.startsWith('col-'));
            if (colClass) {
                const match = colClass.match(/col-(?:sm-|md-|lg-|xl-)?(\d+)/);
                if (match) {
                    width = parseInt(match[1]);
                }
            }

            items.push({
                id: `item-${itemId++}`,
                element: element,
                row: 0, // Will be calculated based on DOM position
                col: 0,
                width: width,
                height: 1,
                content: element.innerHTML,
                type: getElementType(element),
                css: ''
            });
        });

        // If no Bootstrap columns found, create items from major elements
        if (items.length === 0) {
            const majorElements = tempDiv.querySelectorAll('div, section, article, header, footer, nav');
            majorElements.forEach((el) => {
                const element = el as HTMLElement;
                if (element.children.length > 0 || element.textContent?.trim()) {
                    items.push({
                        id: `item-${itemId++}`,
                        element: element,
                        row: 0,
                        col: 0,
                        width: 4,
                        height: 1,
                        content: element.innerHTML,
                        type: getElementType(element),
                        css: ''
                    });
                }
            });
        }

        return items;
    };

    const getElementType = (element: HTMLElement): string => {
        if (element.querySelector('button')) return 'button-group';
        if (element.querySelector('form')) return 'form';
        if (element.querySelector('img')) return 'image';
        if (element.querySelector('h1, h2, h3, h4, h5, h6')) return 'heading';
        if (element.querySelector('p')) return 'text';
        if (element.classList.contains('card')) return 'card';
        if (element.classList.contains('nav')) return 'navigation';
        return 'container';
    };

    const createDropZones = () => {
        const zones: DropZone[] = [];

        // Create a grid of drop zones (rows and columns)
        for (let row = 0; row < 10; row++) { // 10 rows initially
            for (let col = 0; col < gridSize; col++) {
                zones.push({
                    row,
                    col,
                    element: document.createElement('div') // Placeholder, will be created in render
                });
            }
        }

        setDropZones(zones);
    };

    const findDropZone = (element: HTMLElement): DropZone | null => {
        // Find the closest drop zone based on element position
        const rect = element.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();

        if (!containerRect) return null;

        const relativeX = rect.left - containerRect.left;
        const relativeY = rect.top - containerRect.top;

        const col = Math.floor(relativeX / (COL_WIDTH + GUTTER_WIDTH));
        const row = Math.floor(relativeY / MIN_HEIGHT);

        return dropZones.find(zone => zone.row === row && zone.col === col) || null;
    };

    const generateHtmlFromItems = (items: DraggableItem[]): string => {
        // Group items by row
        const rowGroups: { [row: number]: DraggableItem[] } = {};

        items.forEach(item => {
            if (!rowGroups[item.row]) {
                rowGroups[item.row] = [];
            }
            rowGroups[item.row].push(item);
        });

        // Collect all CSS from components
        const allCSS = items
            .filter(item => item.css && item.css.trim())
            .map(item => item.css)
            .join('\n\n');

        // Generate Bootstrap grid HTML
        let html = '';

        // Add CSS if any components have it
        if (allCSS) {
            html += `<style>\n${allCSS}\n</style>\n\n`;
        }

        html += '<div class="container rearrangeable-wireframe">\n';

        Object.keys(rowGroups)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .forEach(rowKey => {
                const row = parseInt(rowKey);
                const rowItems = rowGroups[row].sort((a, b) => a.col - b.col);

                html += '  <div class="row drop-zone-row">\n';
                // Row drag handle
                html += '    <div class="row-drag-handle" title="Drag row">⋮⋮</div>\n';

                rowItems.forEach(item => {
                    const colClass = `col-sm-${item.width}`;
                    html += `    <div class="draggable-block ${colClass}" draggable="true" data-item-id="${item.id}" data-type="${item.type}">\n`;
                    html += `      ${item.content}\n`;
                    html += '    </div>\n';
                });

                html += '  </div>\n';
            });

        html += '</div>';
        return html;
    };

    const readItemsFromDom = (root: HTMLElement): DraggableItem[] => {
        const result: DraggableItem[] = [];
        let id = 0;
        const rows = Array.from(root.querySelectorAll('.drop-zone-row')) as HTMLElement[];
        rows.forEach((rowEl, rowIndex) => {
            const blocks = Array.from(rowEl.querySelectorAll('.draggable-block')) as HTMLElement[];
            blocks.forEach((blockEl, colIndex) => {
                const colClass = Array.from(blockEl.classList).find(c => /^col-(?:sm-|md-|lg-|xl-)?\d+$/.test(c)) || 'col-sm-4';
                const match = colClass.match(/(\d+)/);
                const width = match ? parseInt(match[1], 10) : 4;
                result.push({
                    id: blockEl.getAttribute('data-item-id') || `item-${id++}`,
                    element: blockEl,
                    row: rowIndex,
                    col: colIndex,
                    width,
                    height: 1,
                    content: blockEl.innerHTML,
                    type: blockEl.getAttribute('data-type') || 'container'
                });
            });
        });
        return result;
    };

    const addComponentFromLibrary = (component: any) => {
        const newItem: DraggableItem = {
            id: `library-item-${Date.now()}`,
            element: document.createElement('div'),
            row: draggableItems.length > 0 ? Math.max(...draggableItems.map(i => i.row)) + 1 : 0,
            col: 0,
            width: component.defaultWidth || 4,
            height: 1,
            content: component.htmlCode || component.html || component.content || `<p>${component.name}</p>`,
            type: component.type || 'library-component',
            css: component.css || ''
        };

        const updatedItems = [...draggableItems, newItem];
        setDraggableItems(updatedItems);

        const newHtml = generateHtmlFromItems(updatedItems);
        onUpdateContent?.(newHtml);
    };

    return (
        <div className="rearrangeable-wireframe-container" ref={containerRef}>
            {/* Instruction Panel */}
            <div className="rearrangeable-instructions">
                <div className="instruction-content">
                    <h4>🎯 Rearrangeable Wireframe</h4>
                    <p>
                        <strong>Drag</strong> components to rearrange them •
                        <strong>Drop</strong> on grid zones •
                        {enableResizing && <span><strong>Resize</strong> by dragging edges • </span>}
                        <strong>Add</strong> components from library
                    </p>
                </div>
            </div>

            {/* Component Library Quick Access */}
            {componentLibraryItems.length > 0 && (
                <div className="component-library-bar">
                    <h5>Quick Add Components:</h5>
                    <div className="library-items">
                        {componentLibraryItems.slice(0, 6).map((component, index) => (
                            <button
                                key={index}
                                className="library-item-btn"
                                onClick={() => addComponentFromLibrary(component)}
                                title={`Add ${component.name}`}
                            >
                                {component.icon || '📦'} {component.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Grid Overlay */}
            <div className="grid-overlay">
                {enableSnapping && (
                    <div className="grid-lines">
                        {Array.from({ length: gridSize + 1 }, (_, i) => (
                            <div
                                key={`grid-line-${i}`}
                                className="grid-line"
                                data-grid-position={i}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Main Wireframe Content */}
            <div className="wireframe-content-area">
                <div
                    className={`wireframe-grid ${isDragging ? 'dragging-active' : ''}`}
                    dangerouslySetInnerHTML={{
                        __html: draggableItems.length > 0
                            ? generateHtmlFromItems(draggableItems)
                            : htmlContent
                    }}
                />
            </div>

            {/* Drop Zone Indicators */}
            {isDragging && (
                <div className="drop-zone-indicators">
                    {dropZones.slice(0, 20).map((zone, index) => ( // Show first 20 zones
                        <div
                            key={`drop-zone-${index}`}
                            className={`drop-zone ${hoveredZone === zone ? 'hovered' : ''}`}
                            data-row={zone.row}
                            data-col={zone.col}
                            data-zone-width={100 / gridSize}
                            data-zone-height={MIN_HEIGHT}
                        />
                    ))}
                </div>
            )}

            {/* Resize Handles (if resizing is enabled) */}
            {enableResizing && draggableItems.map(item => (
                <div
                    key={`resize-${item.id}`}
                    className="resize-handle"
                    data-item-id={item.id}
                    onMouseDown={(e) => {
                        // Handle resize logic
                        e.preventDefault();
                        // Implementation for resizing functionality
                    }}
                />
            ))}
        </div>
    );
};

export default RearrangeableWireframe;
