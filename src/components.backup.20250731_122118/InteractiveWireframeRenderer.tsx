import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { ElementInfo } from './WireframePageManager';
import './InteractiveWireframeRenderer.css';

interface InteractiveWireframeRendererProps {
    htmlContent: string;
    onElementClick?: (elementInfo: ElementInfo) => void;
    linkedElements?: string[]; // Array of selectors that are already linked
    isGenerating?: boolean;
}

const InteractiveWireframeRenderer: React.FC<InteractiveWireframeRendererProps> = ({
    htmlContent,
    onElementClick,
    linkedElements = [],
    isGenerating = false
}) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [height, setHeight] = useState<number>(400);
    const [renderKey, setRenderKey] = useState<number>(Date.now());
    const [error, setError] = useState<string | null>(null);
    const [hoveredElement, setHoveredElement] = useState<string | null>(null);

    // Reset the render key when content changes to force iframe refresh
    useEffect(() => {
        if (htmlContent && typeof htmlContent === 'string') {
            setError(null);
            setRenderKey(Date.now());
        } else {
            setError("Invalid HTML content received");
        }
    }, [htmlContent]);

    const makeElementsClickable = useCallback(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        try {
            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!doc) return;

            // Find clickable elements (buttons, links, form inputs)
            const clickableSelectors = [
                'button',
                'input[type="button"]',
                'input[type="submit"]',
                'a[href]',
                '.btn',
                '.button',
                '[role="button"]',
                'input[type="reset"]'
            ];

            clickableSelectors.forEach(selector => {
                const elements = doc.querySelectorAll(selector);
                elements.forEach((element, index) => {
                    const htmlElement = element as HTMLElement;
                    const elementSelector = `${selector}:nth-of-type(${index + 1})`;

                    // Mark linked elements
                    if (linkedElements.includes(elementSelector)) {
                        htmlElement.classList.add('wireframe-linked-element');
                    }

                    // Add click handler
                    htmlElement.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (isGenerating) return;

                        const elementInfo: ElementInfo = {
                            selector: elementSelector,
                            text: htmlElement.textContent?.trim() || htmlElement.getAttribute('value') || 'Untitled',
                            tagName: htmlElement.tagName,
                            type: htmlElement.getAttribute('type') || undefined
                        };

                        onElementClick?.(elementInfo);
                    });

                    // Add hover effects
                    htmlElement.addEventListener('mouseenter', () => {
                        if (!isGenerating) {
                            htmlElement.classList.add('wireframe-hover-element');
                            setHoveredElement(elementSelector);
                        }
                    });

                    htmlElement.addEventListener('mouseleave', () => {
                        htmlElement.classList.remove('wireframe-hover-element');
                        setHoveredElement(null);
                    });

                    // Make it visually obvious it's clickable
                    htmlElement.style.cursor = 'pointer';
                    htmlElement.style.position = 'relative';
                });
            });

            // Auto-resize iframe based on content
            const resizeObserver = new ResizeObserver(() => {
                const body = doc.body;
                if (body) {
                    const newHeight = Math.max(400, body.scrollHeight + 40);
                    setHeight(newHeight);
                }
            });

            if (doc.body) {
                resizeObserver.observe(doc.body);
            }

            return () => {
                resizeObserver.disconnect();
            };

        } catch (error) {
            console.error('Failed to make elements clickable:', error);
        }
    }, [onElementClick, linkedElements, isGenerating]);

    const injectInteractiveStyles = useCallback(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        try {
            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!doc) return;

            // Inject custom styles for interactive elements
            const style = doc.createElement('style');
            style.textContent = `
        .wireframe-hover-element {
          outline: 2px dashed #0078d4 !important;
          outline-offset: 2px !important;
          background-color: rgba(0, 120, 212, 0.05) !important;
          transition: all 0.2s ease !important;
        }
        
        .wireframe-linked-element {
          position: relative !important;
        }
        
        .wireframe-linked-element::after {
          content: '🔗' !important;
          position: absolute !important;
          top: -8px !important;
          right: -8px !important;
          background-color: #0078d4 !important;
          color: white !important;
          border-radius: 50% !important;
          width: 16px !important;
          height: 16px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 8px !important;
          z-index: 1000 !important;
          opacity: 0.9 !important;
        }
        
        button, input[type="button"], input[type="submit"], a, .btn, .button, [role="button"] {
          transition: all 0.2s ease !important;
        }
        
        button:hover, input[type="button"]:hover, input[type="submit"]:hover, 
        a:hover, .btn:hover, .button:hover, [role="button"]:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        }
        
        .wireframe-generating {
          pointer-events: none !important;
          opacity: 0.7 !important;
          filter: grayscale(20%) !important;
        }
      `;

            doc.head.appendChild(style);
        } catch (error) {
            console.error('Failed to inject interactive styles:', error);
        }
    }, []);

    const processHtmlForRendering = useCallback((html: string): string => {
        if (!html || typeof html !== 'string') {
            return '<div style="padding: 20px; text-align: center; color: #666;">No content to display</div>';
        }

        // Enhance HTML with interactive features
        let processedHtml = html;

        // Add meta tags and Microsoft Learn styling for proper rendering
        const metaTags = `
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        /* Base styles */
        body {
          margin: 0;
          padding: 20px;
          font-family: "Segoe UI Variable Text", "Segoe UI", -apple-system, system-ui, sans-serif;
          line-height: 1.5;
          color: #212121;
          background-color: #ffffff;
        }
        
        * {
          box-sizing: border-box;
        }
        
        /* Microsoft Learn wireframe content styles */
        .wireframe-content {
          font-family: "Segoe UI Variable Text", "Segoe UI", -apple-system, system-ui, sans-serif;
          line-height: 1.5;
          color: #212121;
          display: grid;
          grid-template-rows: auto 1fr;
          min-height: 100%;
          padding: 24px;
          background-color: white;
        }
        
        /* Atlas Layout Classes */
        .atlas-grid {
          display: grid !important;
          gap: 16px !important;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
        }
        
        .atlas-container {
          width: 100% !important;
          max-width: 1200px !important;
          margin: 0 auto !important;
          padding: 0 16px !important;
        }
        
        .atlas-stack {
          display: flex !important;
          flex-direction: column !important;
          gap: 16px !important;
        }
        
        /* Microsoft Learn Specific Styling */
        .microsoftlearn-theme {
          font-family: "Segoe UI Variable Text", "Segoe UI", -apple-system, system-ui, sans-serif !important;
          background-color: #ffffff !important;
          color: #212121 !important;
        }
        
        /* Microsoft Learn Cards */
        .microsoftlearn-theme .ms-learn-card {
          font-family: "Segoe UI Variable Text", "Segoe UI", -apple-system, system-ui, sans-serif !important;
          border: 1px solid #eaeaea !important;
          border-radius: 6px !important;
          box-shadow: 0 1.6px 3.6px 0 rgba(0,0,0,0.132), 0 0.3px 0.9px 0 rgba(0,0,0,0.108) !important;
          background-color: #ffffff !important;
          display: flex !important;
          flex-direction: column !important;
          overflow: hidden !important;
          transition: all 0.15s ease-in-out !important;
          max-width: 350px !important;
          margin: 24px !important;
        }
        
        .microsoftlearn-theme .ms-learn-card:hover {
          box-shadow: 0 6.4px 14.4px 0 rgba(0,0,0,0.132), 0 1.2px 3.6px 0 rgba(0,0,0,0.108) !important;
          transform: translateY(-1px) !important;
        }
        
        .microsoftlearn-theme .ms-learn-card-header {
          padding: 16px 16px 0 !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
        
        .microsoftlearn-theme .ms-learn-card-content {
          padding: 16px !important;
          flex-grow: 1 !important;
        }
        
        .microsoftlearn-theme .ms-learn-card-title {
          font-size: 16px !important;
          font-weight: 600 !important;
          margin: 0 0 8px 0 !important;
          color: #323130 !important;
        }
        
        .microsoftlearn-theme .ms-learn-card-description {
          font-size: 14px !important;
          color: #605e5c !important;
          margin: 0 !important;
        }
        
        .microsoftlearn-theme .ms-learn-card-footer {
          padding: 16px !important;
          border-top: 1px solid #eaeaea !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
        }
        
        .microsoftlearn-theme .ms-learn-button {
          background-color: #0078d4 !important;
          color: white !important;
          border: none !important;
          border-radius: 4px !important;
          padding: 8px 16px !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: background-color 0.15s ease-in-out !important;
        }
        
        .microsoftlearn-theme .ms-learn-button:hover {
          background-color: #106ebe !important;
        }
        
        button, input[type="button"], input[type="submit"], .btn, .button {
          cursor: pointer !important;
          user-select: none !important;
        }
        
        a {
          cursor: pointer !important;
        }
        
        .wireframe-interactive-hint {
          position: fixed;
          bottom: 16px;
          right: 16px;
          background-color: rgba(0, 120, 212, 0.9);
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 10000;
          pointer-events: none;
        }
      </style>
    `;

        // Insert meta tags if HTML has a head tag
        if (processedHtml.includes('<head>')) {
            processedHtml = processedHtml.replace('<head>', `<head>${metaTags}`);
        } else if (processedHtml.includes('<html>')) {
            processedHtml = processedHtml.replace('<html>', `<html><head>${metaTags}</head>`);
        } else {
            processedHtml = `<html><head>${metaTags}</head><body>${processedHtml}</body></html>`;
        }

        // Add interactive hint
        const hintHtml = `<div class="wireframe-interactive-hint">💡 Click buttons and links to generate new pages</div>`;
        if (processedHtml.includes('</body>')) {
            processedHtml = processedHtml.replace('</body>', `${hintHtml}</body>`);
        } else {
            processedHtml += hintHtml;
        }

        return processedHtml;
    }, []);

    const handleIframeLoad = useCallback(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        try {
            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!doc) return;

            // Wait a bit for content to settle, then make elements clickable
            setTimeout(() => {
                injectInteractiveStyles();
                makeElementsClickable();
            }, 100);

        } catch (error) {
            console.error('Failed to setup interactive iframe:', error);
            setError('Failed to load interactive wireframe');
        }
    }, [injectInteractiveStyles, makeElementsClickable]);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe || !htmlContent) return;

        try {
            const processedHtml = processHtmlForRendering(htmlContent);
            const doc = iframe.contentDocument || iframe.contentWindow?.document;

            if (doc) {
                doc.open();
                doc.write(processedHtml);
                doc.close();

                // Setup interactive features after content loads
                setTimeout(() => {
                    handleIframeLoad();
                }, 50);
            }
        } catch (error) {
            console.error('Failed to render HTML content:', error);
            setError('Failed to render wireframe content');
        }
    }, [htmlContent, renderKey, processHtmlForRendering, handleIframeLoad]);

    if (error) {
        return (
            <div className="interactive-wireframe-error">
                <p>⚠️ {error}</p>
                <p>Please try generating a new wireframe.</p>
            </div>
        );
    }

    return (
        <div className={`interactive-wireframe-renderer ${isGenerating ? 'generating' : ''}`}>
            {isGenerating && (
                <div className="generating-overlay">
                    <div className="generating-spinner"></div>
                    <span>Generating new page...</span>
                </div>
            )}

            <iframe
                key={renderKey}
                ref={iframeRef}
                title="Interactive Wireframe Preview"
                sandbox="allow-same-origin allow-scripts"
                className="interactive-wireframe-preview"
                height={height}
            />

            {hoveredElement && (
                <div className="hover-tooltip">
                    Click to generate a new page
                </div>
            )}
        </div>
    );
};

export default InteractiveWireframeRenderer;
