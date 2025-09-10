import React, { useState } from 'react';
import { FiPlus, FiPackage, FiSave, FiStar, FiImage, FiCode, FiLayers, FiGithub } from 'react-icons/fi';
import { SiFigma } from 'react-icons/si';
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
    onOpenDevPlaybooks?: () => void;
    onOpenFigmaComponents?: () => void;
    onImageUpload?: () => void;
    onAddToFavorites?: () => void;
    onSave?: () => void;
}

interface Tooltip {
    x: number;
    y: number;
    text: string;
}

const PageNavigation: React.FC<PageNavigationProps> = ({
    pages,
    currentPageId,
    onPageSwitch,
    onAddPage,
    onOpenDevPlaybooks,
    onOpenFigmaComponents,
    onImageUpload,
    onAddToFavorites,
    onSave
}) => {
    const [tooltip, setTooltip] = useState<Tooltip | null>(null);

    const showTooltip = (e: React.MouseEvent, text: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            x: rect.left + rect.width / 2,
            y: rect.top - 8,
            text
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
            <div className="page-navigation">
                <div className="page-navigation-content">
                    <div className="page-tabs">
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
                            onClick={onOpenDevPlaybooks}
                            onMouseEnter={(e) => showTooltip(e, "Dev Playbooks")}
                            onMouseLeave={hideTooltip}
                            aria-label="Dev Playbooks"
                        >
                            <FiGithub />
                        </button>

                        <button
                            className="toolbar-btn"
                            onClick={onOpenFigmaComponents}
                            onMouseEnter={(e) => showTooltip(e, "Figma Components")}
                            onMouseLeave={hideTooltip}
                            aria-label="Figma Components"
                        >
                            <SiFigma />
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
    }

    return (
        <div className="page-navigation">
            <div className="page-navigation-content">
                <div className="page-tabs">
                    {pages.map((page) => (
                        <button
                            key={page.id}
                            className={`page-tab ${currentPageId === page.id ? 'active' : ''}`}
                            onClick={() => onPageSwitch(page.id)}
                            title={`${page.name} - ${page.description}`}
                        >
                            <span className="page-tab-name">{page.name}</span>
                        </button>
                    ))}
                </div>

                {/* Toolbar on the right */}
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
                        onClick={onOpenDevPlaybooks}
                        onMouseEnter={(e) => showTooltip(e, "Dev Playbooks")}
                        onMouseLeave={hideTooltip}
                        aria-label="Dev Playbooks"
                    >
                        <FiGithub />
                    </button>

                    <button
                        className="toolbar-btn"
                        onClick={onOpenFigmaComponents}
                        onMouseEnter={(e) => showTooltip(e, "Figma Components")}
                        onMouseLeave={hideTooltip}
                        aria-label="Figma Components"
                    >
                        <SiFigma />
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
