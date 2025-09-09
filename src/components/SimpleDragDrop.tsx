import React, { useEffect, useRef } from 'react';
import dragula from 'dragula';
import 'dragula/dist/dragula.css';
import './SimpleDragDrop.css';

interface SimpleDragDropProps {
    htmlContent?: string;
    onUpdateContent?: (newHtml: string) => void;
}

const SimpleDragDrop: React.FC<SimpleDragDropProps> = ({
    htmlContent = '',
    onUpdateContent
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize dragula with all rows as containers
        const rows = containerRef.current.querySelectorAll('.row');
        const containers: Element[] = Array.from(rows);

        const drake = dragula(containers, {
            invalid: function (el: Element) {
                return (el as HTMLElement).classList.contains('ui-resizable-handle');
            }
        });

        // Update content when drag ends
        drake.on('drop', () => {
            setTimeout(() => {
                if (containerRef.current && onUpdateContent) {
                    onUpdateContent(containerRef.current.innerHTML);
                }
            }, 50);
        });

        return () => {
            drake.destroy();
        };
    }, [onUpdateContent]);

    // Set initial content
    useEffect(() => {
        if (containerRef.current && htmlContent) {
            containerRef.current.innerHTML = htmlContent;
        }
    }, [htmlContent]);

    // Default content if none provided
    const defaultContent = htmlContent || `
    <div class="row">
      <div class="block col-sm-3">Header</div>
      <div class="block col-sm-6">Navigation</div>
      <div class="block col-sm-3">Logo</div>
    </div>
    <div class="row">
      <div class="block col-sm-8">Main Content</div>
      <div class="block col-sm-4">Sidebar</div>
    </div>
    <div class="row">
      <div class="block col-sm-12">Footer</div>
    </div>
    <div class="row"></div>
  `;

    return (
        <div className="simple-drag-drop">
            <div className="container" ref={containerRef}>
                {!htmlContent && (
                    <div dangerouslySetInnerHTML={{ __html: defaultContent }} />
                )}
            </div>
        </div>
    );
};

export default SimpleDragDrop;
