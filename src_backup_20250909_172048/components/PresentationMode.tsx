import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiMaximize, FiMinimize } from 'react-icons/fi';
import './PresentationMode.css';

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
                        <iframe
                            srcDoc={currentPage.content}
                            className="wireframe-iframe"
                            title={`${currentPage.name} Preview`}
                            sandbox="allow-same-origin allow-scripts"
                        />
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
                                    <iframe
                                        srcDoc={page.content}
                                        className="thumbnail-iframe"
                                        title={`${page.name} Thumbnail`}
                                        sandbox="allow-same-origin"
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
