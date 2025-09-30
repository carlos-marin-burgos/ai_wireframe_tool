import React, { useState } from 'react';
import { FiPlus, FiPackage, FiSave, FiStar, FiImage, FiCode, FiLayers, FiGithub, FiZap, FiEdit } from 'react-icons/fi';
import { HiLightBulb } from 'react-icons/hi';
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
    onOpenLibrary?: () => void;
    onOpenDevPlaybooks?: () => void;
    onOpenFigmaComponents?: () => void;
    onSave?: () => void;
    onAddToFavorites?: () => void;
    onImageUpload?: () => void;
    onOpenAnalyzeDesignModal?: () => void;
    onOpenQuickTipsModal?: () => void;
    isEditMode?: boolean;
    onToggleEditMode?: () => void;
    // New props for formatting toolbar
    showFormattingToolbar?: boolean;
    onFormatBold?: () => void;
    onFormatItalic?: () => void;
    onFormatUnderline?: () => void;
    onRemoveFormat?: () => void;
}

const PageNavigation: React.FC<PageNavigationProps> = ({
    pages,
    currentPageId,
    onPageSwitch,
    onAddPage,
    onOpenLibrary,
    onOpenDevPlaybooks,
    onOpenFigmaComponents,
    onSave,
    onAddToFavorites,
    onImageUpload,
    onOpenAnalyzeDesignModal,
    onOpenQuickTipsModal,
    isEditMode = false,
    onToggleEditMode,
    // New formatting toolbar props
    showFormattingToolbar = false,
    onFormatBold,
    onFormatItalic,
    onFormatUnderline,
    onRemoveFormat
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
                            className="icon-btn"
                            title="Dev Playbooks"
                            onClick={() => {
                                console.log('📚 Dev Playbooks button clicked!');
                                onOpenDevPlaybooks && onOpenDevPlaybooks();
                            }}
                        >
                            <FiCode />
                        </button>

                        {/* Temporarily hidden
                        <button
                            className="icon-btn"
                            title="Figma Components"
                            onClick={() => {
                                console.log('🎨 Figma Components button clicked!');
                                onOpenFigmaComponents && onOpenFigmaComponents();
                            }}
                        >
                            <FiLayers />
                        </button>
                        */}

                        <button
                            className="icon-btn"
                            title="Component Library (Legacy)"
                            onClick={() => {
                                console.log('🎨 Component Library button clicked!');
                                onOpenLibrary && onOpenLibrary();
                            }}
                        >
                            <FiPackage />
                        </button>

                        {/* Edit Mode Toggle Button */}
                        {onToggleEditMode && (
                            <button
                                className={`toolbar-btn ${isEditMode ? 'edit-mode-active' : ''}`}
                                onClick={onToggleEditMode}
                                onMouseEnter={(e) => showTooltip(e, isEditMode ? "Disable Edit Mode" : "Enable Edit Mode")}
                                onMouseLeave={hideTooltip}
                                aria-label={isEditMode ? "Disable wireframe editing" : "Enable wireframe editing"}
                            >
                                <FiEdit />
                            </button>
                        )}

                        {/* Formatting Toolbar - Only show when editing text */}
                        {showFormattingToolbar && (
                            <div className="formatting-toolbar-group">
                                <div className="toolbar-divider"></div>
                                <button
                                    className="toolbar-btn format-btn format-bold"
                                    onClick={onFormatBold}
                                    onMouseEnter={(e) => showTooltip(e, "Bold (Ctrl+B)")}
                                    onMouseLeave={hideTooltip}
                                    aria-label="Bold"
                                    title="Bold"
                                >
                                    <strong>B</strong>
                                </button>
                                <button
                                    className="toolbar-btn format-btn format-italic"
                                    onClick={onFormatItalic}
                                    onMouseEnter={(e) => showTooltip(e, "Italic (Ctrl+I)")}
                                    onMouseLeave={hideTooltip}
                                    aria-label="Italic"
                                    title="Italic"
                                >
                                    <em>I</em>
                                </button>
                                <button
                                    className="toolbar-btn format-btn format-underline"
                                    onClick={onFormatUnderline}
                                    onMouseEnter={(e) => showTooltip(e, "Underline (Ctrl+U)")}
                                    onMouseLeave={hideTooltip}
                                    aria-label="Underline"
                                    title="Underline"
                                >
                                    <u>U</u>
                                </button>
                                <button
                                    className="toolbar-btn format-btn format-clear"
                                    onClick={onRemoveFormat}
                                    onMouseEnter={(e) => showTooltip(e, "Remove Formatting")}
                                    onMouseLeave={hideTooltip}
                                    aria-label="Remove Formatting"
                                    title="Remove Formatting"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {/* AI Design Assistant buttons */}
                        <div className="ai-assistant-group">
                            <button
                                className="toolbar-btn ai-btn"
                                onClick={onOpenAnalyzeDesignModal}
                                onMouseEnter={(e) => showTooltip(e, "Analyze Design")}
                                onMouseLeave={hideTooltip}
                                aria-label="Analyze Design"
                                title="AI Design Analysis"
                            >
                                <FiZap />
                            </button>

                            <button
                                className="toolbar-btn ai-btn"
                                onClick={onOpenQuickTipsModal}
                                onMouseEnter={(e) => showTooltip(e, "Quick Tips")}
                                onMouseLeave={hideTooltip}
                                aria-label="Quick Tips"
                                title="AI Design Tips"
                            >
                                <HiLightBulb />
                            </button>
                        </div>

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
                        onClick={onOpenDevPlaybooks}
                        onMouseEnter={(e) => showTooltip(e, "Dev Playbooks")}
                        onMouseLeave={hideTooltip}
                        aria-label="Dev Playbooks"
                    >
                        <FiGithub />
                    </button>

                    {/* Temporarily hidden
                    <button
                        className="toolbar-btn"
                        onClick={onOpenFigmaComponents}
                        onMouseEnter={(e) => showTooltip(e, "Figma Components")}
                        onMouseLeave={hideTooltip}
                        aria-label="Figma Components"
                    >
                        <SiFigma />
                    </button>
                    */}

                    {/* Edit Mode Toggle Button */}
                    {onToggleEditMode && (
                        <button
                            className={`toolbar-btn ${isEditMode ? 'edit-mode-active' : ''}`}
                            onClick={onToggleEditMode}
                            onMouseEnter={(e) => showTooltip(e, isEditMode ? "Disable Edit Mode" : "Enable Edit Mode")}
                            onMouseLeave={hideTooltip}
                            aria-label={isEditMode ? "Disable wireframe editing" : "Enable wireframe editing"}
                        >
                            <FiEdit />
                        </button>
                    )}

                    {/* Formatting Toolbar - Only show when editing text */}
                    {showFormattingToolbar && (
                        <div className="formatting-toolbar-group">
                            <div className="toolbar-divider"></div>
                            <button
                                className="toolbar-btn format-btn format-bold"
                                onClick={onFormatBold}
                                onMouseEnter={(e) => showTooltip(e, "Bold (Ctrl+B)")}
                                onMouseLeave={hideTooltip}
                                aria-label="Bold"
                                title="Bold"
                            >
                                <strong>B</strong>
                            </button>
                            <button
                                className="toolbar-btn format-btn format-italic"
                                onClick={onFormatItalic}
                                onMouseEnter={(e) => showTooltip(e, "Italic (Ctrl+I)")}
                                onMouseLeave={hideTooltip}
                                aria-label="Italic"
                                title="Italic"
                            >
                                <em>I</em>
                            </button>
                            <button
                                className="toolbar-btn format-btn format-underline"
                                onClick={onFormatUnderline}
                                onMouseEnter={(e) => showTooltip(e, "Underline (Ctrl+U)")}
                                onMouseLeave={hideTooltip}
                                aria-label="Underline"
                                title="Underline"
                            >
                                <u>U</u>
                            </button>
                            <button
                                className="toolbar-btn format-btn format-clear"
                                onClick={onRemoveFormat}
                                onMouseEnter={(e) => showTooltip(e, "Remove Formatting")}
                                onMouseLeave={hideTooltip}
                                aria-label="Remove Formatting"
                                title="Remove Formatting"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* AI Design Assistant buttons */}
                    <div className="ai-assistant-group">
                        <button
                            className="toolbar-btn ai-btn"
                            onClick={onOpenAnalyzeDesignModal}
                            onMouseEnter={(e) => showTooltip(e, "Analyze Design")}
                            onMouseLeave={hideTooltip}
                            aria-label="Analyze Design"
                            title="AI Design Analysis"
                        >
                            <FiZap />
                        </button>

                        <button
                            className="toolbar-btn ai-btn"
                            onClick={onOpenQuickTipsModal}
                            onMouseEnter={(e) => showTooltip(e, "Quick Tips")}
                            onMouseLeave={hideTooltip}
                            aria-label="Quick Tips"
                            title="AI Design Tips"
                        >
                            <HiLightBulb />
                        </button>
                    </div>

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