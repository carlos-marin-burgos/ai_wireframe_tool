import React, { useEffect, useRef } from 'react';
import dragula from 'dragula';
import 'dragula/dist/dragula.css';
import './SimpleDragWireframe.css';

interface SimpleDragWireframeProps {
    htmlContent: string;
    onUpdateContent?: (newContent: string) => void;
}

const SimpleDragWireframe: React.FC<SimpleDragWireframeProps> = ({
    htmlContent,
    onUpdateContent
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const dragulaRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current || !htmlContent) return;

        // Clean up previous dragula instance
        if (dragulaRef.current) {
            dragulaRef.current.destroy();
        }

        // Parse and display the HTML content
        containerRef.current.innerHTML = htmlContent;

        // Wait for DOM to settle, then initialize dragula
        setTimeout(() => {
            if (!containerRef.current) return;

            // Find all direct children that can be dragged
            const children = Array.from(containerRef.current.children);
            console.log('Draggable elements found:', children.length);

            if (children.length > 0) {
                // Initialize dragula with specific moves function
                dragulaRef.current = dragula([containerRef.current], {
                    moves: function (el, source, handle, sibling) {
                        // Allow dragging of direct children only
                        return el.parentNode === containerRef.current;
                    }
                });

                // Update content when items are moved
                dragulaRef.current.on('drop', (el: any, target: any, source: any, sibling: any) => {
                    if (containerRef.current && onUpdateContent) {
                        const newContent = containerRef.current.innerHTML;
                        onUpdateContent(newContent);
                        console.log('Drag completed, content updated!');
                    }
                });

                console.log('Dragula initialized successfully!');
            }
        }, 100);

        return () => {
            if (dragulaRef.current) {
                dragulaRef.current.destroy();
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
