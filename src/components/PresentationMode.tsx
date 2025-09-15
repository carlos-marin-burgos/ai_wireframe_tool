import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiMaximize, FiMinimize } from 'react-icons/fi';
import './PresentationMode.css';
import { sanitizeGeneratedHtml, sanitizeGeneratedHtmlWithInlining } from '../utils/sanitizeGeneratedHtml';

interface PresentationModeProps {
    isOpen: boolean;
    onClose: () => void;
    wireframeName: string;
    wireframeDescription?: string;
    pages: Array<{
        id: string;
        name: string;
        description?: string;
        content: string;
    }>;
}

// Component for async iframe rendering with CSS inlining
const PresentationIframe: React.FC<{ content: string; styleMode: 'raw' | 'neutral' }> = ({ content, styleMode }) => {
    const [srcDoc, setSrcDoc] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            setIsLoading(true);
            try {
                // Use inlining version for better CSS fidelity
                const sanitized = await sanitizeGeneratedHtmlWithInlining(content, true);
                // Minimal reset always applied (non-intrusive)
                const minimalReset = `body{margin:0;padding:16px;box-sizing:border-box;}*{box-sizing:border-box;}img{max-width:100%;height:auto;}`;

                // Neutral overlay (scoped) only when styleMode === 'neutral'
                const neutralScoped = `
                .presentation-base{--primary:#8E9AAF;--secondary:#68769C;--accent:#3C4858;--background:#E9ECEF;--text-primary:#3C4858;--text-secondary:#68769C;--border-color:#CBC2C2;--highlight:#8E9AAF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;line-height:1.6;color:var(--text-primary);} 
                .presentation-base h1,.presentation-base h2,.presentation-base h3,.presentation-base h4,.presentation-base h5,.presentation-base h6{margin-top:0;margin-bottom:.75rem;color:var(--text-primary);} 
                .presentation-base .container,.presentation-base .section,.presentation-base .card{border:1px solid var(--border-color);border-radius:6px;padding:16px;margin-bottom:16px;background:#fff;} 
                .presentation-base button{background:var(--primary);color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-family:inherit;} 
                .presentation-base button:hover{background:var(--secondary);} 
                .presentation-base input,.presentation-base textarea,.presentation-base select{border:1px solid var(--border-color);border-radius:4px;padding:8px 12px;font-family:inherit;font-size:14px;color:var(--text-primary);} 
                .presentation-base input:focus,.presentation-base textarea:focus,.presentation-base select:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 2px rgba(142,154,175,.2);} 
                .presentation-base a{color:var(--primary);text-decoration:none;} 
                .presentation-base a:hover{color:var(--secondary);text-decoration:underline;} 
                .presentation-base .nav,.presentation-base .navigation{background:var(--background);border:1px solid var(--border-color);padding:12px;border-radius:6px;margin-bottom:16px;} 
                .presentation-base .hero,.presentation-base .header{background:linear-gradient(135deg,var(--primary),var(--secondary));color:#fff;padding:24px;border-radius:8px;margin-bottom:20px;} 
                .presentation-base .hero h1,.presentation-base .hero h2,.presentation-base .hero h3,.presentation-base .header h1,.presentation-base .header h2,.presentation-base .header h3{color:#fff;} 
                .presentation-base .sidebar{background:var(--background);border:1px solid var(--border-color);padding:16px;border-radius:6px;} 
                .presentation-base table{width:100%;border-collapse:collapse;margin-bottom:16px;} 
                .presentation-base th,.presentation-base td{border:1px solid var(--border-color);padding:8px 12px;text-align:left;} 
                .presentation-base th{background:var(--background);font-weight:600;color:var(--text-primary);} 
                @media (max-width:768px){.presentation-base{padding:12px;}.presentation-base .container,.presentation-base .section,.presentation-base .card{padding:12px;margin-bottom:12px;}}
                `;

                const wrapperStart = styleMode === 'neutral' ? '<div class="presentation-base">' : '<div class="presentation-raw">';
                const wrapperEnd = '</div>';

                const doc = `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>${sanitized.styles ? `<style>${sanitized.styles}</style>` : ''}<style>${minimalReset}${styleMode === 'neutral' ? neutralScoped : ''}</style></head><body>${wrapperStart}${sanitized.html}${wrapperEnd}</body></html>`;

                setSrcDoc(doc);
            } catch (error) {
                console.warn('Failed to inline CSS in presentation, using fallback:', error);
                // Fallback to regular sanitization if inlining fails
                const sanitized = sanitizeGeneratedHtml(content, true);
                const minimalReset = `body{margin:0;padding:16px;box-sizing:border-box;}*{box-sizing:border-box;}img{max-width:100%;height:auto;}`;
                const neutralScoped = `
                .presentation-base{--primary:#8E9AAF;--secondary:#68769C;--accent:#3C4858;--background:#E9ECEF;--text-primary:#3C4858;--text-secondary:#68769C;--border-color:#CBC2C2;--highlight:#8E9AAF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;line-height:1.6;color:var(--text-primary);} 
                .presentation-base h1,.presentation-base h2,.presentation-base h3,.presentation-base h4,.presentation-base h5,.presentation-base h6{margin-top:0;margin-bottom:.75rem;color:var(--text-primary);} 
                .presentation-base .container,.presentation-base .section,.presentation-base .card{border:1px solid var(--border-color);border-radius:6px;padding:16px;margin-bottom:16px;background:#fff;} 
                .presentation-base button{background:var(--primary);color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-family:inherit;} 
                .presentation-base button:hover{background:var(--secondary);} 
                .presentation-base input,.presentation-base textarea,.presentation-base select{border:1px solid var(--border-color);border-radius:4px;padding:8px 12px;font-family:inherit;font-size:14px;color:var(--text-primary);} 
                .presentation-base input:focus,.presentation-base textarea:focus,.presentation-base select:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 2px rgba(142,154,175,.2);} 
                .presentation-base a{color:var(--primary);text-decoration:none;} 
                .presentation-base a:hover{color:var(--secondary);text-decoration:underline;} 
                .presentation-base .nav,.presentation-base .navigation{background:var(--background);border:1px solid var(--border-color);padding:12px;border-radius:6px;margin-bottom:16px;} 
                .presentation-base .hero,.presentation-base .header{background:linear-gradient(135deg,var(--primary),var(--secondary));color:#fff;padding:24px;border-radius:8px;margin-bottom:20px;} 
                .presentation-base .hero h1,.presentation-base .hero h2,.presentation-base .hero h3,.presentation-base .header h1,.presentation-base .header h2,.presentation-base .header h3{color:#fff;} 
                .presentation-base .sidebar{background:var(--background);border:1px solid var(--border-color);padding:16px;border-radius:6px;} 
                .presentation-base table{width:100%;border-collapse:collapse;margin-bottom:16px;} 
                .presentation-base th,.presentation-base td{border:1px solid var(--border-color);padding:8px 12px;text-align:left;} 
                .presentation-base th{background:var(--background);font-weight:600;color:var(--text-primary);} 
                @media (max-width:768px){.presentation-base{padding:12px;}.presentation-base .container,.presentation-base .section,.presentation-base .card{padding:12px;margin-bottom:12px;}}
                `;
                const wrapperStart = styleMode === 'neutral' ? '<div class="presentation-base">' : '<div class="presentation-raw">';
                const wrapperEnd = '</div>';
                const doc = `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>${(sanitized.links || []).map(h => `<link rel="stylesheet" href="${h}"/>`).join('')}${sanitized.styles ? `<style>${sanitized.styles}</style>` : ''}<style>${minimalReset}${styleMode === 'neutral' ? neutralScoped : ''}</style></head><body>${wrapperStart}${sanitized.html}${wrapperEnd}</body></html>`;
                setSrcDoc(doc);
            } finally {
                setIsLoading(false);
            }
        };

        loadContent();
    }, [content, styleMode]);

    if (isLoading) {
        return (
            <div className="wireframe-iframe loading-placeholder">
                <div>Loading presentation...</div>
            </div>
        );
    }

    return (
        <iframe
            srcDoc={srcDoc}
            className="wireframe-iframe"
            title="Page Preview"
            sandbox="allow-same-origin"
        />
    );
};

// Component for thumbnail iframes with CSS inlining (same as AddPagesModal)
const ThumbnailIframe: React.FC<{ content: string; title: string }> = ({ content, title }) => {
    const [srcDoc, setSrcDoc] = useState<string>('');

    useEffect(() => {
        const loadContent = async () => {
            try {
                // Use same approach as AddPagesModal for consistency
                const sanitized = await sanitizeGeneratedHtmlWithInlining(content, true);

                // Use the same compact styling as AddPagesModal
                const doc = `<!DOCTYPE html><html><head><meta charset='utf-8'/><base target="_blank"/><style>
html,body{margin:0;padding:0;box-sizing:border-box;width:100%;height:100%;overflow:hidden;}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;line-height:1.1;font-size:8px;padding:2px;}
*{max-width:100% !important;animation:none !important;transition:none !important;}
img{max-width:100%;height:auto;display:block;}
button,a{pointer-events:none !important;}
/* Compact mini preview styling - force tighter spacing */
h1,h2,h3,h4,h5,h6{font-size:12px;margin:1px 0;line-height:1.1;font-weight:600;}
p{font-size:8px;margin:1px 0;line-height:1.1;}
div{margin:0 !important;padding:1px 2px !important;}
section,article,main{margin:0 !important;padding:1px !important;}
/* Force content to fill space */
.container,div[style*="max-width"]{max-width:100% !important;width:100% !important;margin:0 !important;}
div[style*="padding"]{padding:2px 4px !important;}
div[style*="margin"]{margin:1px 0 !important;}
/* Override any large dimensions */
div[style*="height"]{min-height:auto !important;}
/* Compact forms and inputs */
input,textarea,button{font-size:7px;padding:1px 2px;margin:0;}
/* Make headers more compact */
div[style*="background"][style*="padding"]{padding:2px 4px !important;margin:0 !important;}
${sanitized.styles || ''}
</style></head><body>${sanitized.html}</body></html>`;

                setSrcDoc(doc);
            } catch (error) {
                console.warn('Failed to inline CSS in thumbnail, using fallback:', error);
                // Fallback to regular sanitization with same styling
                const sanitized = sanitizeGeneratedHtml(content, true);
                const doc = `<!DOCTYPE html><html><head><meta charset='utf-8'/><style>
html,body{margin:0;padding:0;box-sizing:border-box;width:100%;height:100%;overflow:hidden;}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;line-height:1.1;font-size:8px;padding:2px;}
*{max-width:100% !important;animation:none !important;transition:none !important;}
img{max-width:100%;height:auto;display:block;}
button,a{pointer-events:none !important;}
h1,h2,h3,h4,h5,h6{font-size:12px;margin:1px 0;line-height:1.1;font-weight:600;}
p{font-size:8px;margin:1px 0;line-height:1.1;}
div{margin:0 !important;padding:1px 2px !important;}
${sanitized.styles || ''}
</style></head><body>${sanitized.html}</body></html>`;
                setSrcDoc(doc);
            }
        };

        loadContent();
    }, [content]);

    return (
        <iframe
            srcDoc={srcDoc}
            className="thumbnail-iframe"
            title={title}
            sandbox="allow-same-origin"
        />
    );
};

const PresentationMode: React.FC<PresentationModeProps> = ({
    isOpen,
    onClose,
    wireframeName,
    wireframeDescription,
    pages
}) => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showChrome, setShowChrome] = useState(true);
    const [styleMode, setStyleMode] = useState<'raw' | 'neutral'>('raw'); // 'raw' preserves AI styles; 'neutral' adds overlay
    const hideUiTimerRef = useRef<number | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const sessionKey = `presentation_last_index_${wireframeName}`;
    const dateLabel = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyPress = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowLeft':
                    goToPreviousPage();
                    break;
                case 'ArrowRight':
                    goToNextPage();
                    break;
                case 'Escape':
                    onClose();
                    break;
                case 'f':
                case 'F':
                    toggleFullscreen();
                    break;
                case ' ': // Spacebar advances
                    event.preventDefault();
                    goToNextPage();
                    break;
                case 'Home':
                    setCurrentPageIndex(0);
                    break;
                case 'End':
                    setCurrentPageIndex(pages.length - 1);
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [isOpen, currentPageIndex, pages.length]);

    // Reset to first page when presentation opens
    useEffect(() => {
        if (isOpen) {
            // Load last index if available
            const stored = sessionStorage.getItem(sessionKey);
            const idx = stored ? parseInt(stored, 10) : 0;
            const safeIndex = isNaN(idx) ? 0 : Math.min(Math.max(0, idx), Math.max(0, pages.length - 1));
            setCurrentPageIndex(safeIndex);
            // Timer removed
        }
    }, [isOpen]);

    // Persist current index while presenting
    useEffect(() => {
        if (isOpen) {
            sessionStorage.setItem(sessionKey, String(currentPageIndex));
        }
    }, [isOpen, currentPageIndex]);

    const goToNextPage = useCallback(() => {
        if (currentPageIndex < pages.length - 1) {
            setCurrentPageIndex(prev => prev + 1);
        }
    }, [currentPageIndex, pages.length]);

    const goToPreviousPage = useCallback(() => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(prev => prev - 1);
        }
    }, [currentPageIndex]);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement && rootRef.current) {
            rootRef.current.requestFullscreen?.().catch(() => {
                // Fallback to CSS-only fullscreen state
                setIsFullscreen(true);
            });
        } else {
            document.exitFullscreen?.().catch(() => {
                // Fallback to CSS-only
                setIsFullscreen(false);
            });
        }
    }, []);

    // Sync isFullscreen with Fullscreen API
    useEffect(() => {
        const handler = () => {
            const active = Boolean(document.fullscreenElement);
            setIsFullscreen(active);
            // Always show chrome when state changes; auto-hide will handle later
            setShowChrome(true);
        };
        document.addEventListener('fullscreenchange', handler);
        return () => document.removeEventListener('fullscreenchange', handler);
    }, []);

    // Auto-hide chrome in fullscreen after inactivity
    useEffect(() => {
        if (!isOpen) return;
        const target = rootRef.current;
        if (!target) return;

        const showThenScheduleHide = () => {
            setShowChrome(true);
            if (hideUiTimerRef.current) window.clearTimeout(hideUiTimerRef.current);
            if (isFullscreen) {
                hideUiTimerRef.current = window.setTimeout(() => {
                    setShowChrome(false);
                }, 2500);
            }
        };

        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'] as const;
        events.forEach(evt => target.addEventListener(evt, showThenScheduleHide as EventListener));
        // Prime the timer when entering fullscreen
        showThenScheduleHide();
        return () => {
            events.forEach(evt => target.removeEventListener(evt, showThenScheduleHide as EventListener));
            if (hideUiTimerRef.current) window.clearTimeout(hideUiTimerRef.current);
        };
    }, [isOpen, isFullscreen]);

    // Timer removed

    if (!isOpen || pages.length === 0) return null;

    const currentPage = pages[currentPageIndex];

    return (
        <div ref={rootRef} className={`presentation-mode ${isFullscreen ? 'fullscreen' : ''} ${isFullscreen && !showChrome ? 'chrome-hidden' : ''}`}>
            <div className="presentation-overlay" onClick={onClose} />

            <div className="presentation-container">
                {/* Toolbar at the top of the modal */}
                <div className={`presentation-toolbar ${isFullscreen && !showChrome ? 'hidden' : ''}`}>
                    <div className="toolbar-left">
                        <div className="toolbar-title">{wireframeName}</div>
                        <div className="toolbar-date">{dateLabel}</div>
                    </div>
                    <div className="toolbar-right">
                        <button
                            className="presentation-btn"
                            onClick={toggleFullscreen}
                            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
                        >
                            {isFullscreen ? <FiMinimize /> : <FiMaximize />}
                        </button>
                        <button
                            className="presentation-btn presentation-close"
                            onClick={onClose}
                            title="Close Presentation (Esc)"
                        >
                            <FiX />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                {pages.length > 1 && !isFullscreen && (
                    <div className="presentation-nav">
                        <button
                            className="nav-btn prev"
                            onClick={goToPreviousPage}
                            disabled={currentPageIndex === 0}
                            title="Previous Page (←)"
                        >
                            <FiChevronLeft />
                        </button>

                        <div className="page-indicator">
                            <span className="current-page">{currentPageIndex + 1}</span>
                            <span className="page-separator">/</span>
                            <span className="total-pages">{pages.length}</span>
                        </div>

                        <button
                            className="nav-btn next"
                            onClick={goToNextPage}
                            disabled={currentPageIndex === pages.length - 1}
                            title="Next Page (→)"
                        >
                            <FiChevronRight />
                        </button>
                    </div>
                )}

                {/* Page Content */}
                <div className="presentation-content">
                    {!isFullscreen && (
                        <div className="page-header">
                            <h3 className="page-title">{currentPage.name}</h3>
                            {currentPage.description && (
                                <p className="page-description">{currentPage.description}</p>
                            )}
                        </div>
                    )}

                    <div className="wireframe-display">
                        <PresentationIframe content={currentPage.content} styleMode={styleMode} />
                        {/* Click zones for quick navigation in fullscreen */}
                        {isFullscreen && (
                            <>
                                <button
                                    className="click-zone left"
                                    aria-label="Previous page"
                                    onClick={goToPreviousPage}
                                />
                                <button
                                    className="click-zone right"
                                    aria-label="Next page"
                                    onClick={goToNextPage}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Page Thumbnails (for multiple pages) */}
                {pages.length > 1 && (
                    <div className="page-thumbnails">
                        {pages.map((page, index) => (
                            <button
                                key={page.id}
                                className={`thumbnail ${index === currentPageIndex ? 'active' : ''}`}
                                onClick={() => setCurrentPageIndex(index)}
                                title={page.name}
                            >
                                <div className="thumbnail-preview">
                                    <ThumbnailIframe
                                        content={page.content}
                                        title={`${page.name} Thumbnail`}
                                    />
                                </div>
                                <span className="thumbnail-label">{page.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Keyboard Shortcuts Help */}
                <div className="presentation-help">
                    <small>
                        Use ← → arrows to navigate • Press F for fullscreen • Press Esc to exit
                    </small>
                </div>
            </div>
        </div>
    );
};

export default PresentationMode;
