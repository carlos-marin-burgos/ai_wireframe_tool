import React from 'react';
import { FiPlus } from 'react-icons/fi';
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
    onAddPages?: () => void;
}

const PageNavigation: React.FC<PageNavigationProps> = ({
    pages,
    currentPageId,
    onPageSwitch,
    onAddPages
}) => {
    console.log('🔥 PageNavigation render with:', {
        pages: pages.map(p => ({ id: p.id, name: p.name })),
        currentPageId
    });

    // Generate ordinal numbers for breadcrumb labels
    const getOrdinalLabel = (index: number): string => {
        const ordinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'];
        return ordinals[index] || `Page ${index + 1}`;
    };

    if (!pages || pages.length === 0) {
        // Show just the Add Pages button when no pages exist
        if (onAddPages) {
            return (
                <div className="page-navigation breadcrumb-style">
                    <div className="breadcrumb-container">
                        <button
                            className="add-pages-btn secondary"
                            onClick={onAddPages}
                            title="Add More Pages"
                            aria-label="Add More Pages"
                        >
                            <FiPlus />
                            Add Pages
                        </button>
                    </div>
                </div>
            );
        }
        return null; // Don't show navigation when no pages and no onAddPages
    }

    return (
        <div className="page-navigation breadcrumb-style">
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

                {/* Add Pages Button - positioned on the right */}
                {onAddPages && (
                    <button
                        className="add-pages-btn secondary"
                        onClick={onAddPages}
                        title="Add More Pages"
                        aria-label="Add More Pages"
                    >
                        <FiPlus />
                        Add Pages
                    </button>
                )}
            </div>
        </div>
    );
};

export default PageNavigation;