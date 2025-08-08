import React from 'react';
import { getFluentIcon } from '../utils/fluentIconSvgs';
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

    // Helper component for Fluent icons
    const FluentIcon: React.FC<{ name: string; className?: string }> = ({ name, className = "" }) => (
        <span
            className={`fluent-icon ${className}`}
            dangerouslySetInnerHTML={{ __html: getFluentIcon(name) }}
        />
    );

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

                {/* Add Pages Button - Secondary position with plus icon */}
                {onAddPages && (
                    <>
                        {pages.length > 0 && <span className="breadcrumb-separator">•</span>}
                        <button
                            className="add-pages-btn"
                            onClick={onAddPages}
                            title="Add More Pages"
                        >
                            <FluentIcon name="add" />
                            Add
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PageNavigation;