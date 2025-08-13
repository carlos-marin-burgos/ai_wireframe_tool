import React, { useState } from 'react';
import { FiPlus, FiGrid, FiSave, FiEdit3, FiEye } from 'react-icons/fi';
import '../styles/PageNavigation.css';
import EditModeConfirmModal from './EditModeConfirmModal';

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
    editMode?: boolean;
    onEditModeChange?: (editMode: boolean) => void;
    hasUnsavedChanges?: boolean;
}

const PageNavigation: React.FC<PageNavigationProps> = ({
    pages,
    currentPageId,
    onPageSwitch,
    onAddPage,
    onOpenLibrary,
    onSave,
    editMode = false,
    onEditModeChange,
    hasUnsavedChanges = false
}) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    console.log('🔥 PageNavigation render with:', {
        pages: pages.map(p => ({ id: p.id, name: p.name })),
        currentPageId
    });

    // Generate ordinal numbers for breadcrumb labels
    const getOrdinalLabel = (index: number): string => {
        const ordinals = ['First Page', 'Second Page', 'Third Page', 'Fourth Page', 'Fifth Page', 'Sixth Page', 'Seventh Page', 'Eighth Page', 'Ninth Page', 'Tenth Page'];
        return ordinals[index] || `Page ${index + 1}`;
    };

    // Handle edit mode toggle with confirmation
    const handleEditModeToggle = () => {
        if (editMode && hasUnsavedChanges) {
            // Show confirmation modal when exiting edit mode with unsaved changes
            setShowConfirmModal(true);
        } else {
            // Toggle edit mode directly if no unsaved changes or entering edit mode
            onEditModeChange?.(!editMode);
        }
    };

    // Handle modal actions
    const handleSaveAndExit = () => {
        setShowConfirmModal(false);
        onSave?.(); // Save the changes
        onEditModeChange?.(false); // Exit edit mode
    };

    const handleDiscardAndExit = () => {
        setShowConfirmModal(false);
        onEditModeChange?.(false); // Exit edit mode without saving
    };

    const handleContinueEditing = () => {
        setShowConfirmModal(false);
        // Stay in edit mode
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
                            title="Add new page"
                            aria-label="Add Page"
                        >
                            <FiPlus />
                        </button>

                        <button
                            className="toolbar-btn"
                            onClick={onOpenLibrary}
                            title="Component Library"
                            aria-label="Component Library"
                        >
                            <FiGrid />
                        </button>

                        <button
                            className="toolbar-btn"
                            onClick={onSave}
                            title="Save wireframe"
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
                        title="Add new page"
                        aria-label="Add Page"
                    >
                        <FiPlus />
                    </button>

                    <button
                        className="toolbar-btn"
                        onClick={onOpenLibrary}
                        title="Component Library"
                        aria-label="Component Library"
                    >
                        <FiGrid />
                    </button>

                    <button
                        className={`toolbar-btn edit-toggle ${editMode ? 'active' : ''}`}
                        onClick={handleEditModeToggle}
                        title={editMode ? "Exit edit mode" : "Enter edit mode"}
                        aria-label={editMode ? "Exit edit mode" : "Enter edit mode"}
                    >
                        {editMode ? <FiEye /> : <FiEdit3 />}
                    </button>

                    <button
                        className="toolbar-btn"
                        onClick={onSave}
                        title="Save wireframe"
                        aria-label="Save"
                    >
                        <FiSave />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PageNavigation;