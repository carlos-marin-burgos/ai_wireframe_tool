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
    onAddPage?: () => void; // optional inline add handler
}

const PageNavigation: React.FC<PageNavigationProps> = ({
    pages,
    currentPageId,
    onPageSwitch,
    onAddPage
}) => {
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
        return null; // Don't show navigation when no pages
    }

    return (
        <div className="page-navigation breadcrumb-style">
            <div className="breadcrumb-bar">
                {onAddPage && (
                    <div className="breadcrumb-actions left">
                        <button
                            className="add-pages-button secondary add-page-left"
                            onClick={onAddPage}
                            title="Add a new page"
                            aria-label="Add Page"
                        >
                            <FiPlus style={{ marginRight: 4 }} /> Add Page
                        </button>
                    </div>
                )}
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
        </div>
    );
};

export default PageNavigation;