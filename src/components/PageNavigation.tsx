import React from 'react';
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
}

const PageNavigation: React.FC<PageNavigationProps> = ({
    pages,
    currentPageId,
    onPageSwitch
}) => {
    console.log('🔥 PageNavigation render with:', {
        pages: pages.map(p => ({ id: p.id, name: p.name })),
        currentPageId
    });

    // Generate ordinal numbers for breadcrumb labels
    const getOrdinalLabel = (index: number): string => {
        const ordinals = ['First page', 'Second page', 'Third page', 'Fourth page', 'Fifth page', 'Sixth page', 'Seventh page', 'Eighth page', 'Ninth page', 'Tenth page'];
        return ordinals[index] || `Page ${index + 1}`;
    };

    if (!pages || pages.length === 0) {
        return null; // Don't show navigation when no pages
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
            </div>
        </div>
    );
};

export default PageNavigation;