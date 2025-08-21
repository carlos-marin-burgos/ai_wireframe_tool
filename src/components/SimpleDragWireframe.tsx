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
        if (!containerRef.current) return;

        // Clean up previous dragula instance
        if (dragulaRef.current) {
            dragulaRef.current.destroy();
        }

        // Parse and display the HTML content
        containerRef.current.innerHTML = htmlContent;

        // Ensure all elements are visible but don't force opacity: 1 on everything
        const allElements = Array.from(containerRef.current.querySelectorAll('*')) as HTMLElement[];
        allElements.forEach(el => {
            // Only fix elements with opacity < 0.9 (leave properly styled elements alone)
            const computedOpacity = window.getComputedStyle(el).opacity;
            if (parseFloat(computedOpacity) < 0.9) {
                el.style.opacity = '1';
            }
        });

        // Initialize dragula on the container itself
        dragulaRef.current = dragula([containerRef.current], {
            moves: function (el, source, handle, sibling) {
                return true; // Allow all elements to be moved
            },
            accepts: function (el, target, source, sibling) {
                // Only allow dropping directly into the main container
                return target === containerRef.current;
            }
        });

        // Update content when items are moved
        dragulaRef.current.on('drop', () => {
            if (containerRef.current && onUpdateContent) {
                const newContent = containerRef.current.innerHTML;
                onUpdateContent(newContent);
                console.log('Drag completed, content updated!');
            }
        });

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
