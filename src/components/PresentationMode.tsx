import React, { useState, useEffect, useCallback } from 'react';
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
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [isOpen, currentPageIndex, pages.length]);

    // Reset to first page when presentation opens
    useEffect(() => {
        if (isOpen) {
            setCurrentPageIndex(0);
        }
    }, [isOpen]);

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
        setIsFullscreen(prev => !prev);
    }, []);

    if (!isOpen || pages.length === 0) return null;

    const currentPage = pages[currentPageIndex];

    return (
        <div className={`presentation-mode ${isFullscreen ? 'fullscreen' : ''}`}>
            <div className="presentation-overlay" onClick={onClose} />

            <div className="presentation-container">
                {/* Header */}
                <div className="presentation-header">
                    <div className="presentation-info">
                        <h2 className="presentation-title">{wireframeName}</h2>
                        {wireframeDescription && (
                            <p className="presentation-description">{wireframeDescription}</p>
                        )}
                    </div>

                    <div className="presentation-controls">
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
                {pages.length > 1 && (
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
                    <div className="page-header">
                        <h3 className="page-title">{currentPage.name}</h3>
                        {currentPage.description && (
                            <p className="page-description">{currentPage.description}</p>
                        )}
                    </div>

                    <div className="wireframe-display">
                        <iframe
                            srcDoc={currentPage.content}
                            className="wireframe-iframe"
                            title={`${currentPage.name} Preview`}
                            sandbox="allow-same-origin allow-scripts"
                        />
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
