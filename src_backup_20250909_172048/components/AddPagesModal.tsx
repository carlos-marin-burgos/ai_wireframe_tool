import React, { useState, useEffect } from 'react';
import { FiX, FiCopy, FiTrash2 } from 'react-icons/fi';
import './AddPagesModal.css';

interface Page {
    id: string;
    name: string;
    description: string;
    type: 'page' | 'modal' | 'component';
    htmlContent?: string; // AI-generated content for the page
}

interface AddPagesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddPages: (pages: Page[]) => void;
    existingPages?: Page[];
    onGeneratePageContent?: (description: string, pageType: string) => Promise<string>; // New prop for AI generation
}

const AddPagesModal: React.FC<AddPagesModalProps> = ({
    isOpen,
    onClose,
    onAddPages,
    existingPages = [],
    onGeneratePageContent
}) => {
    const [pages, setPages] = useState<Page[]>(existingPages);
    const [newPageName, setNewPageName] = useState('');
    const [newPageDescription, setNewPageDescription] = useState('');
    const [newPageType, setNewPageType] = useState<'page' | 'modal' | 'component'>('page');
    const [isGenerating, setIsGenerating] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [generationProgress, setGenerationProgress] = useState('');

    // Auto-save draft functionality
    const DRAFT_KEY = 'addPages_draft';

    // Load draft when modal opens
    useEffect(() => {
        if (isOpen) {
            const savedDraft = localStorage.getItem(DRAFT_KEY);
            if (savedDraft) {
                try {
                    const draft = JSON.parse(savedDraft);
                    setNewPageName(draft.name || '');
                    setNewPageDescription(draft.description || '');
                    setNewPageType(draft.type || 'page');
                } catch (error) {
                    console.warn('Failed to load draft:', error);
                }
            }
        }
    }, [isOpen]);

    // Auto-save draft as user types
    useEffect(() => {
        if (isOpen && (newPageName || newPageDescription)) {
            const draft = {
                name: newPageName,
                description: newPageDescription,
                type: newPageType,
                timestamp: Date.now()
            };
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        }
    }, [newPageName, newPageDescription, newPageType, isOpen]);

    // Clear draft when modal closes successfully
    const clearDraft = () => {
        localStorage.removeItem(DRAFT_KEY);
    };

    // Generate intelligent templates based on page type and description
    const generateSmartTemplate = (name: string, description: string, type: string): string => {
        const baseStyles = `
            max-width: 1200px; margin: 0 auto; padding: 40px 20px; 
            font-family: 'Segoe UI', sans-serif; line-height: 1.6;
            background: #ffffff; min-height: 100vh;
        `;

        const headerStyles = `
            color: #323130; margin: 0 0 24px 0; font-size: 28px; font-weight: 600;
        `;

        const buttonStyles = `
            background: #0078d4; color: white; border: none; padding: 12px 24px; 
            border-radius: 4px; cursor: pointer; font-weight: 600; margin: 8px;
            transition: background-color 0.2s ease;
        `;

        const secondaryButtonStyles = `
            background: #f3f2f1; color: #323130; border: 1px solid #e1dfdd; 
            padding: 12px 24px; border-radius: 4px; cursor: pointer; margin: 8px;
            transition: background-color 0.2s ease;
        `;

        const cardStyles = `
            background: white; border: 1px solid #e1dfdd; border-radius: 8px; 
            padding: 24px; margin: 16px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        // Microsoft Learn hero background (beige accent color)
        const heroStyles = `
            background: #E8E6DF; 
            padding: 60px 40px; border-radius: 12px; margin: 20px 0;
            text-align: center; border: 1px solid #e1dfdd;
        `;

        switch (type) {
            case 'modal':
                return `
                    <div style="${baseStyles}">
                        <div style="background: rgba(0,0,0,0.3); position: fixed; top: 80px; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; z-index: 1000;">
                            <div style="${cardStyles} max-width: 500px; position: relative; z-index: 1001;">
                                <button style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
                                <h2 style="${headerStyles} font-size: 24px;">${name}</h2>
                                <p style="color: #605e5c; margin: 0 0 24px 0;">${description}</p>
                                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                                    <button style="${secondaryButtonStyles}">Cancel</button>
                                    <button style="${buttonStyles}">Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

            case 'component':
                return `
                    <div style="${baseStyles}">
                        <div style="${cardStyles}">
                            <h3 style="${headerStyles} font-size: 20px; margin-bottom: 16px;">${name} Component</h3>
                            <p style="color: #605e5c; margin: 0 0 20px 0;">${description}</p>
                            <div style="border: 2px dashed #e1dfdd; padding: 20px; text-align: center; border-radius: 8px;">
                                <p style="color: #a19f9d; margin: 0;">Component content goes here</p>
                                <p style="color: #a19f9d; margin: 8px 0 0 0; font-size: 14px;">Customize this ${type} based on your needs</p>
                            </div>
                        </div>
                    </div>
                `;

            default: // page
                const isFormPage = description.toLowerCase().includes('form') || description.toLowerCase().includes('input');
                const isDashboard = description.toLowerCase().includes('dashboard') || description.toLowerCase().includes('analytics');
                const isListing = description.toLowerCase().includes('list') || description.toLowerCase().includes('table');

                if (isFormPage) {
                    return `
                        <div style="${baseStyles}">
                            <h1 style="${headerStyles}">${name}</h1>
                            <p style="color: #605e5c; margin: 0 0 32px 0;">${description}</p>
                            <form style="${cardStyles}">
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #323130;">Field Name</label>
                                    <input type="text" style="width: 100%; padding: 12px; border: 1px solid #e1dfdd; border-radius: 4px; font-size: 16px;" placeholder="Enter value...">
                                </div>
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #323130;">Description</label>
                                    <textarea style="width: 100%; padding: 12px; border: 1px solid #e1dfdd; border-radius: 4px; font-size: 16px; min-height: 100px;" placeholder="Enter description..."></textarea>
                                </div>
                                <button type="submit" style="${buttonStyles}">Submit</button>
                            </form>
                        </div>
                    `;
                } else if (isDashboard) {
                    return `
                        <div style="${baseStyles}">
                            <div style="${heroStyles}">
                                <h1 style="${headerStyles} margin-bottom: 16px;">${name}</h1>
                                <p style="color: #605e5c; margin: 0; font-size: 18px;">${description}</p>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px;">
                                <div style="${cardStyles}">
                                    <h3 style="margin: 0 0 12px 0; color: #323130; font-size: 16px;">Total Users</h3>
                                    <p style="font-size: 32px; font-weight: bold; margin: 0; color: #0078d4;">1,234</p>
                                    <p style="font-size: 14px; color: #107c10; margin: 8px 0 0 0;">↗ +12% vs last month</p>
                                </div>
                                <div style="${cardStyles}">
                                    <h3 style="margin: 0 0 12px 0; color: #323130; font-size: 16px;">Active Sessions</h3>
                                    <p style="font-size: 32px; font-weight: bold; margin: 0; color: #0078d4;">5,678</p>
                                    <p style="font-size: 14px; color: #107c10; margin: 8px 0 0 0;">↗ +8% vs last month</p>
                                </div>
                                <div style="${cardStyles}">
                                    <h3 style="margin: 0 0 12px 0; color: #323130; font-size: 16px;">Completion Rate</h3>
                                    <p style="font-size: 32px; font-weight: bold; margin: 0; color: #0078d4;">87%</p>
                                    <p style="font-size: 14px; color: #107c10; margin: 8px 0 0 0;">↗ +5% vs last month</p>
                                </div>
                            </div>
                            <div style="${cardStyles}">
                                <h3 style="margin: 0 0 16px 0; color: #323130;">Recent Activity</h3>
                                <p style="color: #605e5c; margin: 0 0 20px 0;">Monitor real-time dashboard metrics and analytics.</p>
                                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                                    <button style="${buttonStyles}">View Details</button>
                                    <button style="${secondaryButtonStyles}">Export Data</button>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (isListing) {
                    return `
                        <div style="${baseStyles}">
                            <h1 style="${headerStyles}">${name}</h1>
                            <p style="color: #605e5c; margin: 0 0 32px 0;">${description}</p>
                            <div style="${cardStyles}">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                                    <input type="search" style="padding: 12px; border: 1px solid #e1dfdd; border-radius: 4px; width: 300px;" placeholder="Search items...">
                                    <button style="${buttonStyles}">Add New</button>
                                </div>
                                <div style="overflow-x: auto;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <thead>
                                            <tr style="border-bottom: 2px solid #e1dfdd;">
                                                <th style="text-align: left; padding: 12px; font-weight: 600;">Item</th>
                                                <th style="text-align: left; padding: 12px; font-weight: 600;">Status</th>
                                                <th style="text-align: left; padding: 12px; font-weight: 600;">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style="border-bottom: 1px solid #e1dfdd;">
                                                <td style="padding: 12px;">Sample Item 1</td>
                                                <td style="padding: 12px;"><span style="background: #d4f4dd; color: #0f5132; padding: 4px 8px; border-radius: 12px; font-size: 14px;">Active</span></td>
                                                <td style="padding: 12px;"><button style="background: none; border: 1px solid #e1dfdd; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Edit</button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    return `
                        <div style="${baseStyles}">
                            <div style="${heroStyles}">
                                <h1 style="${headerStyles} margin-bottom: 16px;">${name}</h1>
                                <p style="color: #605e5c; margin: 0; font-size: 18px;">${description}</p>
                            </div>
                            <div style="${cardStyles}">
                                <h2 style="color: #323130; margin: 0 0 16px 0;">Welcome to ${name}</h2>
                                <p style="color: #605e5c; line-height: 1.6;">This page is ready for your content. You can customize it by asking me to generate specific content or modify the layout.</p>
                                <div style="margin: 24px 0;">
                                    <button style="${buttonStyles}">Get Started</button>
                                    <button style="${secondaryButtonStyles}">Learn More</button>
                                </div>
                            </div>
                        </div>
                    `;
                }
        }
    };

    // Update local pages state when existingPages changes (when modal opens with new data)
    useEffect(() => {
        setPages(existingPages);
    }, [existingPages]);

    const getDescriptionPlaceholder = (pageType: string) => {
        switch (pageType) {
            case 'page':
                return 'e.g., "A user dashboard with navigation menu, statistics cards, recent activity feed, and action buttons for key features like settings and profile management"';
            case 'modal':
                return 'e.g., "A confirmation dialog with title, message text, cancel and confirm buttons, and a warning icon for delete operations"';
            case 'component':
                return 'e.g., "A reusable navigation bar with logo, menu items, search box, user avatar dropdown, and responsive mobile hamburger menu"';
            default:
                return 'Describe the purpose, layout, and key elements of this page...';
        }
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!newPageName.trim()) {
            errors.name = 'Page name is required';
        }

        if (!newPageDescription.trim()) {
            errors.description = 'Page description is required for AI content generation';
        } else if (newPageDescription.trim().length < 10) {
            errors.description = 'Please provide a more detailed description (at least 10 characters)';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const addPage = async () => {
        if (!validateForm()) {
            return;
        }

        setIsGenerating(true);
        setGenerationProgress('Preparing content generation...');

        try {
            // Generate AI content for the page if callback is provided
            let generatedContent = '';
            if (onGeneratePageContent) {
                console.log('🤖 Starting AI content generation for:', newPageName.trim());
                setGenerationProgress(`Generating AI content for "${newPageName.trim()}"...`);

                const contentDescription = `Create a ${newPageType} called "${newPageName.trim()}". ${newPageDescription.trim()}`;
                console.log('🤖 Content description:', contentDescription);

                generatedContent = await onGeneratePageContent(contentDescription, newPageType);
                console.log('🤖 AI content generated:', {
                    pageType: newPageType,
                    pageName: newPageName.trim(),
                    contentLength: generatedContent?.length || 0,
                    hasContent: !!generatedContent
                });

                setGenerationProgress('Content generated successfully!');
            } else {
                console.warn('🤖 No AI generation callback provided');
                setGenerationProgress('Creating smart template...');

                // Create intelligent template based on description and type
                generatedContent = generateSmartTemplate(newPageName.trim(), newPageDescription.trim(), newPageType);
            }

            const newPage: Page = {
                id: `page-${Date.now()}`,
                name: newPageName.trim(),
                description: newPageDescription.trim(),
                type: newPageType,
                htmlContent: generatedContent // Store AI-generated content
            };

            setPages([...pages, newPage]);
            setNewPageName('');
            setNewPageDescription('');
            setNewPageType('page');
            setValidationErrors({});
            clearDraft(); // Clear saved draft after successful add

            // Track analytics
            console.log('📊 Page Generation Analytics:', {
                pageType: newPageType,
                pageName: newPageName.trim(),
                descriptionLength: newPageDescription.trim().length,
                aiGenerated: !!generatedContent,
                contentLength: generatedContent?.length || 0,
                generationTime: Date.now(),
                hasAICallback: !!onGeneratePageContent
            });

            // Close modal and trigger save after adding the page
            onAddPages([...pages, newPage]);
            onClose();
        } catch (error) {
            console.error('Failed to generate page content:', error);

            // Show user-friendly error message
            setValidationErrors({
                ai: 'AI content generation failed. Page will be created with basic template.'
            });

            // Still add the page without generated content but with a helpful placeholder
            const fallbackContent = `
                <div style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: 'Segoe UI', sans-serif; background: #ffffff; min-height: 100vh;">
                    <div style="background: linear-gradient(135deg, #fff4e6 0%, #fef3c7 100%); padding: 60px 40px; border-radius: 12px; margin: 20px 0; text-align: center; border: 1px solid #e1dfdd;">
                        <h1 style="color: #323130; margin: 0 0 16px 0; font-size: 28px; font-weight: 600;">📄 ${newPageName.trim()}</h1>
                        <p style="color: #605e5c; margin: 0 0 16px 0; font-size: 16px;">
                            ${newPageDescription.trim()}
                        </p>
                        <p style="color: #a19f9d; margin: 0 0 24px 0; font-size: 14px;">
                            AI content generation temporarily unavailable. Ask me to "generate content for ${newPageName.trim()}" to try again.
                        </p>
                        <button style="background: #0078d4; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-weight: 600; transition: background-color 0.2s ease;">
                            Generate Content
                        </button>
                    </div>
                </div>
            `;

            const newPage: Page = {
                id: `page-${Date.now()}`,
                name: newPageName.trim(),
                description: newPageDescription.trim(),
                type: newPageType,
                htmlContent: fallbackContent // Add helpful fallback content
            };

            setPages([...pages, newPage]);
            setNewPageName('');
            setNewPageDescription('');
            setNewPageType('page');

            // Don't clear validation errors immediately - let user see the AI error
            setTimeout(() => {
                setValidationErrors({});
                // Close modal and trigger save after showing error
                onAddPages([...pages, newPage]);
                onClose();
            }, 2000); // Show error for 2 seconds
        } finally {
            setIsGenerating(false);
            setGenerationProgress('');
        }
    };

    const deletePage = (id: string) => {
        setPages(pages.filter(page => page.id !== id));
    };

    const duplicatePage = (page: Page) => {
        const duplicatedPage: Page = {
            ...page,
            id: `page-${Date.now()}`,
            name: `${page.name} (Copy)`
        };
        setPages([...pages, duplicatedPage]);
    };

    const handleSave = async () => {
        // If there's form data, add the current page first
        if (newPageName.trim() && newPageDescription.trim() && !isGenerating) {
            await addPage();
        } else {
            // Otherwise just save the existing pages
            onAddPages(pages);
            onClose();
        }
    };

    // Calculate how many new pages will actually be added
    const existingPageIds = new Set(existingPages.map(p => p.id));
    const newPagesCount = pages.filter(p => !existingPageIds.has(p.id)).length;

    // Check if there's a valid form ready to be added
    const hasValidForm = newPageName.trim() && newPageDescription.trim() && newPageDescription.trim().length >= 10;

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newPageName.trim()) {
            addPage();
        }
    };

    const pageTypeLabels = {
        page: 'Page',
        modal: 'Modal',
        component: 'Component'
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Add Pages to Wireframe</h2>
                    <button className="modal-close" onClick={onClose} title="Close">
                        <FiX />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Add new page form */}
                    <div className="add-page-form">
                        <h3 className="form-title">Add New Page</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="pageName">Page Name *</label>
                                <input
                                    id="pageName"
                                    type="text"
                                    value={newPageName}
                                    onChange={(e) => {
                                        setNewPageName(e.target.value);
                                        // Clear validation error when user starts typing
                                        if (validationErrors.name) {
                                            setValidationErrors(prev => ({ ...prev, name: '' }));
                                        }
                                    }}
                                    onKeyPress={handleKeyPress}
                                    placeholder="e.g., Login Page, Dashboard, Profile"
                                    className={`form-input ${validationErrors.name ? 'error' : ''}`}
                                />
                                {validationErrors.name && (
                                    <span className="error-message">{validationErrors.name}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="pageType">Type</label>
                                <select
                                    id="pageType"
                                    value={newPageType}
                                    onChange={(e) => setNewPageType(e.target.value as 'page' | 'modal' | 'component')}
                                    className="form-select"
                                >
                                    <option value="page">Page</option>
                                    <option value="modal">Modal</option>
                                    <option value="component">Component</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="pageDescription">Description * (Used for AI Content Generation)</label>
                            <textarea
                                id="pageDescription"
                                value={newPageDescription}
                                onChange={(e) => {
                                    setNewPageDescription(e.target.value);
                                    // Clear validation error when user starts typing
                                    if (validationErrors.description) {
                                        setValidationErrors(prev => ({ ...prev, description: '' }));
                                    }
                                }}
                                placeholder={getDescriptionPlaceholder(newPageType)}
                                className={`form-textarea ${validationErrors.description ? 'error' : ''}`}
                                rows={4}
                            />
                            {validationErrors.description && (
                                <span className="error-message">{validationErrors.description}</span>
                            )}
                            {validationErrors.ai && (
                                <span className="warning-message">{validationErrors.ai}</span>
                            )}
                            <div className="description-help">
                                💡 Be specific about components, layout, and functionality for better AI-generated content
                            </div>
                        </div>
                    </div>

                    {/* Pages list */}
                    {pages.length > 0 && (
                        <div className="pages-list">
                            <h3 className="list-title">
                                {newPagesCount > 0 ? (
                                    <>
                                        All Pages ({pages.length})
                                        <span className="new-pages-indicator">
                                            • {newPagesCount} new
                                        </span>
                                    </>
                                ) : pages.length > 0 ? (
                                    `Existing Pages (${pages.length})`
                                ) : (
                                    'No pages yet - fill form above to add first page'
                                )}
                            </h3>                            <div className="pages-grid">
                                {pages.map((page) => {
                                    const isExistingPage = existingPageIds.has(page.id);
                                    return (
                                        <div key={page.id} className={`page-card ${isExistingPage ? 'existing-page' : 'new-page'}`}>
                                            <div className="page-header">
                                                <div className="page-info">
                                                    <h4 className="page-name">
                                                        {page.name}
                                                        {!isExistingPage && <span className="new-badge">NEW</span>}
                                                    </h4>
                                                    {!isExistingPage && (
                                                        <span
                                                            className={`page-type-badge page-type-${page.type}`}
                                                        >
                                                            {pageTypeLabels[page.type]}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="page-actions">
                                                    <button
                                                        className="action-btn"
                                                        onClick={() => duplicatePage(page)}
                                                        title="Duplicate"
                                                    >
                                                        <FiCopy />
                                                    </button>
                                                    <button
                                                        className="action-btn delete"
                                                        onClick={() => deletePage(page.id)}
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </div>

                                            {page.description && (
                                                <p className="page-description">{page.description}</p>
                                            )}

                                            {/* Wireframe Preview for existing pages */}
                                            {isExistingPage && page.htmlContent && (
                                                <div className="page-preview">
                                                    <div className="preview-label">Current Wireframe:</div>
                                                    <div className="preview-container">
                                                        <div
                                                            className="wireframe-mini-preview"
                                                            dangerouslySetInnerHTML={{ __html: page.htmlContent }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={!hasValidForm && newPagesCount === 0}
                    >
                        {isGenerating ? (
                            <>
                                <div className="spinner"></div>
                                {generationProgress || 'Generating...'}
                            </>
                        ) : hasValidForm ? (
                            `Add "${newPageName.trim()}" Page`
                        ) : newPagesCount > 0 ? (
                            `Add ${newPagesCount} New Page${newPagesCount !== 1 ? 's' : ''}`
                        ) : (
                            'Fill Form to Add Page'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPagesModal;
