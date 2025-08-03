import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiCopy, FiTrash2 } from 'react-icons/fi';
import './AddPagesModal.css';

interface Page {
    id: string;
    name: string;
    description: string;
    type: 'page' | 'modal' | 'component';
}

interface AddPagesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddPages: (pages: Page[]) => void;
    existingPages?: Page[];
}

const AddPagesModal: React.FC<AddPagesModalProps> = ({
    isOpen,
    onClose,
    onAddPages,
    existingPages = []
}) => {
    const [pages, setPages] = useState<Page[]>(existingPages);
    const [newPageName, setNewPageName] = useState('');
    const [newPageDescription, setNewPageDescription] = useState('');
    const [newPageType, setNewPageType] = useState<'page' | 'modal' | 'component'>('page');

    // Update local pages state when existingPages changes (when modal opens with new data)
    useEffect(() => {
        setPages(existingPages);
    }, [existingPages]);

    const addPage = () => {
        if (newPageName.trim()) {
            const newPage: Page = {
                id: `page-${Date.now()}`,
                name: newPageName.trim(),
                description: newPageDescription.trim(),
                type: newPageType
            };
            setPages([...pages, newPage]);
            setNewPageName('');
            setNewPageDescription('');
            setNewPageType('page');
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

    const handleSave = () => {
        onAddPages(pages);
        onClose();
    };

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
                                <label htmlFor="pageName">Page Name</label>
                                <input
                                    id="pageName"
                                    type="text"
                                    value={newPageName}
                                    onChange={(e) => setNewPageName(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="e.g., Login Page, Dashboard, Profile"
                                    className="form-input"
                                />
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
                            <label htmlFor="pageDescription">Description (Optional)</label>
                            <textarea
                                id="pageDescription"
                                value={newPageDescription}
                                onChange={(e) => setNewPageDescription(e.target.value)}
                                placeholder="Describe the purpose and key elements of this page..."
                                className="form-textarea"
                                rows={3}
                            />
                        </div>

                        <button
                            className="add-page-btn"
                            onClick={addPage}
                            disabled={!newPageName.trim()}
                        >
                            <FiPlus />
                            Add Page
                        </button>
                    </div>

                    {/* Pages list */}
                    {pages.length > 0 && (
                        <div className="pages-list">
                            <h3 className="list-title">Pages ({pages.length})</h3>

                            <div className="pages-grid">
                                {pages.map((page) => (
                                    <div key={page.id} className="page-card">
                                        <div className="page-header">
                                            <div className="page-info">
                                                <h4 className="page-name">{page.name}</h4>
                                                <span
                                                    className={`page-type-badge page-type-${page.type}`}
                                                >
                                                    {pageTypeLabels[page.type]}
                                                </span>
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
                                    </div>
                                ))}
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
                        disabled={pages.length === 0}
                    >
                        Add {pages.length} Page{pages.length !== 1 ? 's' : ''} to Wireframe
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPagesModal;
