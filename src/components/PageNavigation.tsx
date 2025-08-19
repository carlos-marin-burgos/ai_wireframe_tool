import React, { useState } from 'react';
import { FiPlus, FiGrid, FiSave, FiStar, FiImage } from 'react-icons/fi';
import '../styles/PageNavigation.css';

interface Page {
    id: string;
    name: string;
    description: string;
    type: 'page' | 'modal' | 'component';
}

interface PageNavigationProps {
    pages: Page[];
    currentPageId: string | null;
    onPageSwitch: (pageId: string) => void;
    onAddPage?: () => void;
    onOpenLibrary?: () => void;
    onSave?: () => void;
    onAddToFavorites?: () => void;
    onImageUpload?: () => void;
}

const PageNavigation: React.FC<PageNavigationProps> = ({
    pages,
    currentPageId,
    onPageSwitch,
    onAddPage,
    onOpenLibrary,
    onSave,
    onAddToFavorites,
    onImageUpload
}) => {
    const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

    const showTooltip = (e: React.MouseEvent<HTMLButtonElement>, text: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            text,
            x: rect.left + rect.width / 2,
            y: rect.bottom + 8
        });
    };

    const hideTooltip = () => {
        setTooltip(null);
    };

    console.log('🔥 PageNavigation render with:', {
        pages: pages.map(p => ({ id: p.id, name: p.name })),
        currentPageId
    });

    // Generate ordinal numbers for breadcrumb labels
    const getOrdinalLabel = (index: number): string => {
        const ordinals = ['First Page', 'Second Page', 'Third Page', 'Fourth Page', 'Fifth Page', 'Sixth Page', 'Seventh Page', 'Eighth Page', 'Ninth Page', 'Tenth Page'];
        return ordinals[index] || `Page ${index + 1}`;
    };

    if (!pages || pages.length === 0) {
        return (
            <div className="page-navigation breadcrumb-style">
                <div className="breadcrumb-bar">
                    <div className="breadcrumb-left">
                        <span className="no-pages-message">No pages yet</span>
                    </div>

                    {/* Show minimal toolbar even when no pages */}
                    <div className="page-toolbar">
                        <button
                            className="toolbar-btn"
                            onClick={onAddPage}
                            onMouseEnter={(e) => showTooltip(e, "Add new page")}
                            onMouseLeave={hideTooltip}
                            aria-label="Add Page"
                        >
                            <FiPlus />
                        </button>

                        <button
                            className="toolbar-btn"
                            onClick={onOpenLibrary}
                            onMouseEnter={(e) => showTooltip(e, "Component Library")}
                            onMouseLeave={hideTooltip}
                            aria-label="Component Library"
                        >
                            <FiGrid />
                        </button>

                        <button
                            className="toolbar-btn"
                            onClick={onAddToFavorites}
                            onMouseEnter={(e) => showTooltip(e, "Add to favorites")}
                            onMouseLeave={hideTooltip}
                            aria-label="Add to Favorites"
                        >
                            <FiStar />
                        </button>

                        <button
                            className="toolbar-btn"
                            onClick={onSave}
                            onMouseEnter={(e) => showTooltip(e, "Save wireframe")}
                            onMouseLeave={hideTooltip}
                            aria-label="Save"
                        >
                            <FiSave />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-navigation breadcrumb-style">
            <div className="breadcrumb-bar">
                <div className="breadcrumb-left">
                    <div className="breadcrumb-container">
                        {pages.map((page, index) => (
                            <React.Fragment key={page.id}>
                                <button
                                    className={`breadcrumb-item ${currentPageId === page.id ? 'active' : ''}`}
                                    onClick={() => onPageSwitch(page.id)}
                                    title={`${page.name} - ${page.description}`}
                                >
                                    {getOrdinalLabel(index)}
                                </button>
                                {(index < pages.length - 1) && (
                                    <span className="breadcrumb-separator">/</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* New Icon Toolbar */}
                <div className="page-toolbar">
                    <button
                        className="toolbar-btn"
                        onClick={onAddPage}
                        onMouseEnter={(e) => showTooltip(e, "Add new page")}
                        onMouseLeave={hideTooltip}
                        aria-label="Add Page"
                    >
                        <FiPlus />
                    </button>

                    <button
                        className="toolbar-btn"
                        onClick={onOpenLibrary}
                        onMouseEnter={(e) => showTooltip(e, "Component Library")}
                        onMouseLeave={hideTooltip}
                        aria-label="Component Library"
                    >
                        <FiGrid />
                    </button>

                    <button
                        className="toolbar-btn"
                        onClick={onImageUpload}
                        onMouseEnter={(e) => showTooltip(e, "Upload Image")}
                        onMouseLeave={hideTooltip}
                        aria-label="Upload Image"
                    >
                        <FiImage />
                    </button>

                    <button
                        className="toolbar-btn"
                        onClick={onAddToFavorites}
                        onMouseEnter={(e) => showTooltip(e, "Add to favorites")}
                        onMouseLeave={hideTooltip}
                        aria-label="Add to Favorites"
                    >
                        <FiStar />
                    </button>

                    <button
                        className="toolbar-btn"
                        onClick={onSave}
                        onMouseEnter={(e) => showTooltip(e, "Save wireframe")}
                        onMouseLeave={hideTooltip}
                        aria-label="Save"
                    >
                        <FiSave />
                    </button>
                </div>
            </div>

            {/* Black background tooltip */}
            {tooltip && (
                <div className="black-tooltip-container">
                    <div
                        className="black-tooltip"
                        ref={(el) => {
                            if (el) {
                                el.style.left = `${tooltip.x}px`;
                                el.style.top = `${tooltip.y}px`;
                            }
                        }}
                    >
                        {tooltip.text}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageNavigation;