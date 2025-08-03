import React, { useState, useCallback } from 'react';
import {
    FiSave,
    FiX,
    FiTag,
    FiEdit3,
    FiDownload,
    FiCheck,
    FiImage,
    FiCode,
    FiFileText
} from 'react-icons/fi';
import './SaveWireframeModal.css';

interface SavedWireframe {
    id: string;
    name: string;
    description: string;
    tags: string[];
    html: string;
    css: string;
    createdAt: string;
    updatedAt: string;
    thumbnail?: string;
    metadata: {
        componentCount: number;
        layoutType: string;
        designTheme: string;
        colorScheme: string;
    };
}

interface SaveOptions {
    format: 'html' | 'react' | 'figma';
    includeCSS: boolean;
    minifyCode: boolean;
    generateThumbnail: boolean;
}

interface SaveWireframeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (wireframe: Omit<SavedWireframe, 'id' | 'createdAt' | 'updatedAt'>, options: SaveOptions) => void;
    currentHtml: string;
    currentCss: string;
    designTheme: string;
    colorScheme: string;
    initialName?: string;
    isUpdating?: boolean;
    existingWireframe?: SavedWireframe;
}

const SaveWireframeModal: React.FC<SaveWireframeModalProps> = ({
    isOpen,
    onClose,
    onSave,
    currentHtml,
    currentCss,
    designTheme,
    colorScheme,
    initialName = '',
    isUpdating = false,
    existingWireframe
}) => {
    const [wireframeName, setWireframeName] = useState(initialName || existingWireframe?.name || '');
    const [description, setDescription] = useState(existingWireframe?.description || '');
    const [tags, setTags] = useState<string[]>(existingWireframe?.tags || []);
    const [newTag, setNewTag] = useState('');
    const [saveOptions, setSaveOptions] = useState<SaveOptions>({
        format: 'html',
        includeCSS: true,
        minifyCode: false,
        generateThumbnail: true
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const addTag = useCallback(() => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags(prev => [...prev, newTag.trim()]);
            setNewTag('');
        }
    }, [newTag, tags]);

    const removeTag = useCallback((tagToRemove: string) => {
        setTags(prev => prev.filter(tag => tag !== tagToRemove));
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.target === e.currentTarget) {
            addTag();
        }
    }, [addTag]);

    const countComponents = useCallback((html: string): number => {
        // Simple component counting based on common HTML elements
        const componentSelectors = [
            'button', 'input', 'select', 'textarea',
            '.card', '.component', '[data-component]',
            'nav', 'header', 'footer', 'section', 'article'
        ];

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        let count = 0;
        componentSelectors.forEach(selector => {
            count += tempDiv.querySelectorAll(selector).length;
        });

        return count;
    }, []);

    const generateThumbnail = useCallback(async (): Promise<string> => {
        // In a real implementation, this would render the HTML/CSS to a canvas
        // For now, we'll create a simple placeholder
        return new Promise((resolve) => {
            setTimeout(() => {
                // This would be replaced with actual thumbnail generation
                resolve('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmNmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPldpcmVmcmFtZTwvdGV4dD48L3N2Zz4=');
            }, 500);
        });
    }, []);

    const handleSave = useCallback(async () => {
        if (!wireframeName.trim()) return;

        setIsSaving(true);

        try {
            const thumbnail = saveOptions.generateThumbnail
                ? await generateThumbnail()
                : undefined;

            const wireframeData: Omit<SavedWireframe, 'id' | 'createdAt' | 'updatedAt'> = {
                name: wireframeName.trim(),
                description: description.trim(),
                tags,
                html: currentHtml,
                css: currentCss,
                thumbnail,
                metadata: {
                    componentCount: countComponents(currentHtml),
                    layoutType: 'responsive', // This could be detected from the HTML
                    designTheme,
                    colorScheme
                }
            };

            await onSave(wireframeData, saveOptions);
            setSaveSuccess(true);

            // Auto-close after success
            setTimeout(() => {
                setSaveSuccess(false);
                onClose();
            }, 1500);

        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setIsSaving(false);
        }
    }, [wireframeName, description, tags, currentHtml, currentCss, saveOptions, designTheme, colorScheme, countComponents, generateThumbnail, onSave, onClose]);

    if (!isOpen) return null;

    if (saveSuccess) {
        return (
            <div className="modal-overlay">
                <div className="save-modal success-modal">
                    <div className="success-content">
                        <FiCheck className="success-icon" />
                        <h3>Wireframe Saved Successfully!</h3>
                        <p>"{wireframeName}" has been saved to your library.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="save-modal">
                <div className="modal-header">
                    <h3>
                        <FiSave className="modal-icon" />
                        {isUpdating ? 'Update Wireframe' : 'Save Wireframe'}
                    </h3>
                    <button
                        className="close-btn"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <FiX />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Basic Information */}
                    <div className="form-section">
                        <label htmlFor="wireframe-name" className="form-label">
                            <FiEdit3 className="label-icon" />
                            Wireframe Name
                        </label>
                        <input
                            id="wireframe-name"
                            type="text"
                            value={wireframeName}
                            onChange={(e) => setWireframeName(e.target.value)}
                            placeholder="Enter a name for your wireframe"
                            className="form-input"
                            autoFocus
                        />
                    </div>

                    <div className="form-section">
                        <label htmlFor="wireframe-description" className="form-label">
                            <FiFileText className="label-icon" />
                            Description (Optional)
                        </label>
                        <textarea
                            id="wireframe-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your wireframe design and purpose"
                            className="form-textarea"
                            rows={3}
                        />
                    </div>

                    {/* Tags */}
                    <div className="form-section">
                        <label className="form-label">
                            <FiTag className="label-icon" />
                            Tags
                        </label>
                        <div className="tags-input-wrapper">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Add tags (press Enter)"
                                className="tag-input"
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="add-tag-btn"
                                disabled={!newTag.trim()}
                            >
                                Add
                            </button>
                        </div>
                        {tags.length > 0 && (
                            <div className="tags-list">
                                {tags.map((tag, index) => (
                                    <span key={index} className="tag">
                                        {tag}
                                        <button
                                            onClick={() => removeTag(tag)}
                                            className="remove-tag-btn"
                                            aria-label={`Remove ${tag} tag`}
                                        >
                                            <FiX />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Save Options */}
                    <div className="form-section">
                        <h4 className="section-title">Save Options</h4>

                        <div className="option-group">
                            <label className="option-label">
                                <FiCode className="label-icon" />
                                Export Format
                            </label>
                            <div className="radio-group">
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="format"
                                        value="html"
                                        checked={saveOptions.format === 'html'}
                                        onChange={(e) => setSaveOptions(prev => ({ ...prev, format: e.target.value as 'html' }))}
                                    />
                                    <span>HTML + CSS</span>
                                </label>
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="format"
                                        value="react"
                                        checked={saveOptions.format === 'react'}
                                        onChange={(e) => setSaveOptions(prev => ({ ...prev, format: e.target.value as 'react' }))}
                                    />
                                    <span>React Components</span>
                                </label>
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="format"
                                        value="figma"
                                        checked={saveOptions.format === 'figma'}
                                        onChange={(e) => setSaveOptions(prev => ({ ...prev, format: e.target.value as 'figma' }))}
                                    />
                                    <span>Figma Export</span>
                                </label>
                            </div>
                        </div>

                        <div className="checkbox-group">
                            <label className="checkbox-option">
                                <input
                                    type="checkbox"
                                    checked={saveOptions.includeCSS}
                                    onChange={(e) => setSaveOptions(prev => ({ ...prev, includeCSS: e.target.checked }))}
                                />
                                <span>Include CSS styles</span>
                            </label>
                            <label className="checkbox-option">
                                <input
                                    type="checkbox"
                                    checked={saveOptions.minifyCode}
                                    onChange={(e) => setSaveOptions(prev => ({ ...prev, minifyCode: e.target.checked }))}
                                />
                                <span>Minify code for production</span>
                            </label>
                            <label className="checkbox-option">
                                <input
                                    type="checkbox"
                                    checked={saveOptions.generateThumbnail}
                                    onChange={(e) => setSaveOptions(prev => ({ ...prev, generateThumbnail: e.target.checked }))}
                                />
                                <span className="thumbnail-option">
                                    <FiImage className="option-icon" />
                                    Generate preview thumbnail
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Wireframe Preview Info */}
                    <div className="preview-info">
                        <h4 className="section-title">Wireframe Info</h4>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Components:</span>
                                <span className="info-value">{countComponents(currentHtml) || 'None'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Theme:</span>
                                <span className="info-value">{designTheme}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Color Scheme:</span>
                                <span className="info-value">{colorScheme}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Code Size:</span>
                                <span className="info-value">{(currentHtml.length + currentCss.length / 1024).toFixed(1)}KB</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        onClick={onClose}
                        className="cancel-btn"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="save-btn"
                        disabled={!wireframeName.trim() || isSaving}
                    >
                        {isSaving ? (
                            <>
                                <div className="loading-spinner" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <FiDownload className="btn-icon" />
                                {isUpdating ? 'Update' : 'Save'} Wireframe
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaveWireframeModal;
export type { SavedWireframe, SaveOptions };
