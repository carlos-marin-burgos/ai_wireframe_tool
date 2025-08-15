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

        // Ensure all elements are visible (remove any transparency)
        const allElements = Array.from(containerRef.current.querySelectorAll('*')) as HTMLElement[];
        allElements.forEach(el => {
            el.style.opacity = '1';
        });

        // Initialize dragula on the container itself
        dragulaRef.current = dragula([containerRef.current], {
            moves: function (el, source, handle, sibling) {
                return true; // Allow all elements to be moved
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
