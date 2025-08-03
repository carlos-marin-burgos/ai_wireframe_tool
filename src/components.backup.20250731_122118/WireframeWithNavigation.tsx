import React, { useState, useCallback, useEffect } from 'react';
import { FiArrowLeft, FiHome, FiList, FiChevronRight } from 'react-icons/fi';
import InteractiveWireframeRenderer from './InteractiveWireframeRenderer';
import { useWireframePageManager } from './WireframePageManager';
import type { ElementInfo } from './WireframePageManager';
import './WireframeWithNavigation.css';

interface WireframeWithNavigationProps {
    htmlContent: string;
    onGenerateNewPage: (prompt: string, parentPageId: string, clickedElement: string) => Promise<string>;
}

const WireframeWithNavigation: React.FC<WireframeWithNavigationProps> = ({
    htmlContent,
    onGenerateNewPage
}) => {
    const [showPageList, setShowPageList] = useState(false);
    const [showInstructions, setShowInstructions] = useState(() => {
        const stored = localStorage.getItem('hideInstructions');
        return stored ? false : true;
    });

    // Persist instructions visibility state
    useEffect(() => {
        if (!showInstructions) {
            localStorage.setItem('hideInstructions', 'true');
        }
    }, [showInstructions]);

    const {
        currentPage,
        pages,
        links,
        isGenerating,
        handleElementClick,
        navigateToPage,
        navigateBack,
        getBreadcrumbs
    } = useWireframePageManager({
        initialHtml: htmlContent,
        onGenerateNewPage
    });

    const handleElementClickWrapper = useCallback(async (elementInfo: ElementInfo) => {
        try {
            await handleElementClick(elementInfo);
        } catch (error) {
            console.error('Failed to handle element click:', error);
        }
    }, [handleElementClick]);

    const getLinkedElements = useCallback(() => {
        return links
            .filter(link => link.fromPageId === currentPage?.id)
            .map(link => link.elementSelector);
    }, [links, currentPage?.id]);

    const breadcrumbs = getBreadcrumbs();

    if (!currentPage) {
        return (
            <div className="wireframe-loading">
                <div className="loading-spinner"></div>
                <span>Loading wireframe...</span>
            </div>
        );
    }

    return (
        <div className="wireframe-with-navigation">
            {/* Navigation Header */}
            <div className="wireframe-navigation">
                <div className="wireframe-breadcrumbs">
                    {breadcrumbs.map((page, index) => (
                        <React.Fragment key={page.id}>
                            {index > 0 && (
                                <FiChevronRight className="breadcrumb-separator" />
                            )}
                            <button
                                className={`breadcrumb-item ${page.id === currentPage.id ? 'current' : ''
                                    }`}
                                onClick={() => navigateToPage(page.id)}
                                disabled={page.id === currentPage.id || isGenerating}
                            >
                                {index === 0 ? (
                                    <><FiHome className="breadcrumb-icon" /> {page.title}</>
                                ) : (
                                    page.title
                                )}
                            </button>
                        </React.Fragment>
                    ))}
                </div>

                <div className="wireframe-navigation-controls">
                    {isGenerating && (
                        <div className="generating-indicator">
                            <div className="generating-spinner"></div>
                            <span>Generating new page...</span>
                        </div>
                    )}

                    <div className="page-indicator">
                        Page {pages.findIndex(p => p.id === currentPage.id) + 1} of {pages.length}
                    </div>

                    <button
                        className="nav-button"
                        onClick={navigateBack}
                        disabled={!currentPage.parentPageId || isGenerating}
                        title="Go back to previous page"
                    >
                        <FiArrowLeft />
                        Back
                    </button>

                    <div className="page-list-container">
                        <button
                            className="nav-button"
                            onClick={() => setShowPageList(!showPageList)}
                            disabled={isGenerating}
                            title="View all pages"
                        >
                            <FiList />
                            Pages ({pages.length})
                        </button>

                        {showPageList && (
                            <div className="wireframe-page-list">
                                {pages.map((page) => (
                                    <div
                                        key={page.id}
                                        className={`page-list-item ${page.id === currentPage.id ? 'current' : ''
                                            }`}
                                        onClick={() => {
                                            navigateToPage(page.id);
                                            setShowPageList(false);
                                        }}
                                    >
                                        <div className="page-list-title">{page.title}</div>
                                        <div className="page-list-meta">
                                            {page.parentPageId && (
                                                <span className="page-list-parent">
                                                    From: {pages.find(p => p.id === page.parentPageId)?.title}
                                                </span>
                                            )}
                                            <span className="page-list-date">
                                                {page.createdAt.toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Interactive Wireframe Content */}
            <div className="wireframe-content">
                <InteractiveWireframeRenderer
                    htmlContent={currentPage.htmlContent}
                    onElementClick={handleElementClickWrapper}
                    linkedElements={getLinkedElements()}
                    isGenerating={isGenerating}
                />
            </div>

            {/* Instructions Overlay */}
            {pages.length === 1 && !isGenerating && showInstructions && (
                <div className="instructions-overlay">
                    <button className="close-button" onClick={() => setShowInstructions(false)} aria-label="Close instructions">×</button>
                    <div className="instructions-content">
                        <h3>💡 Interactive Wireframe</h3>
                        <p>Click on buttons and links to automatically generate new pages!</p>
                        <ul>
                            <li>✨ Submit buttons create confirmation pages</li>
                            <li>🔗 Navigation links generate relevant content</li>
                            <li>📝 Form elements lead to appropriate next steps</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WireframeWithNavigation;
