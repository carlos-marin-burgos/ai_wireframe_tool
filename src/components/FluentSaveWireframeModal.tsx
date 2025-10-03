import React, { useState, useCallback, useEffect } from 'react';
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
import './FluentSaveWireframeModal.css';

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

interface FluentSaveWireframeModalProps {
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

const FluentSaveWireframeModal: React.FC<FluentSaveWireframeModalProps> = ({
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

    // Update wireframe name when initialName prop changes
    useEffect(() => {
        if (initialName && !isUpdating) {
            setWireframeName(initialName);
        }
    }, [initialName, isUpdating]);

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
        return new Promise((resolve) => {
            setTimeout(() => {
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
                    layoutType: 'responsive',
                    designTheme,
                    colorScheme
                }
            };

            await onSave(wireframeData, saveOptions);
            setSaveSuccess(true);

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
            <div className="fluent-modal-backdrop">
                <div className="fluent-dialog fluent-success-dialog">
                    <div className="fluent-dialog-content">
                        <div className="fluent-success-icon">
                            <FiCheck />
                        </div>
                        <h2 className="fluent-dialog-title">Wireframe Saved Successfully!</h2>
                        <p className="fluent-dialog-description">
                            "{wireframeName}" has been saved to your library.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fluent-modal-backdrop">
            <div className="fluent-dialog fluent-save-dialog" role="dialog" aria-labelledby="save-dialog-title">
                {/* Dialog Header */}
                <div className="fluent-dialog-header">
                    <h2 id="save-dialog-title" className="fluent-dialog-title">
                        <FiSave className="fluent-icon" />
                        {isUpdating ? 'Update Wireframe' : 'Save Wireframe'}
                    </h2>
                    <button
                        className="fluent-button fluent-button-ghost fluent-close-button"
                        onClick={onClose}
                        aria-label="Close dialog"
                    >
                        <FiX />
                    </button>
                </div>

                {/* Dialog Body */}
                <div className="fluent-dialog-body">
                    {/* Storage Info Banner */}
                    <div className="storage-info-banner">
                        <FiSave />
                        <div>
                            <strong>💾 Save Wireframe to Browser</strong>
                            <p>
                                This saves your <strong>editable wireframe</strong> (HTML + CSS) to browser storage.
                                Access it anytime from <strong>"Load Previous Work"</strong> on the landing page.
                            </p>
                            <p className="export-hint">
                                💡 <strong>To export:</strong> Use the <strong>Download button (💾)</strong> in the top toolbar to save as HTML, React, or Figma files to your computer.
                            </p>
                        </div>
                    </div>

                    {/* Basic Information Section */}
                    <div className="fluent-field-group">
                        <div className="fluent-field">
                            <label className="fluent-label" htmlFor="wireframe-name">
                                <FiEdit3 className="fluent-icon" />
                                Wireframe Name
                            </label>
                            <input
                                id="wireframe-name"
                                type="text"
                                value={wireframeName}
                                onChange={(e) => setWireframeName(e.target.value)}
                                placeholder="Enter a name for your wireframe"
                                className="fluent-input"
                                autoFocus
                                required
                            />
                        </div>

                        <div className="fluent-field">
                            <label className="fluent-label" htmlFor="wireframe-description">
                                <FiFileText className="fluent-icon" />
                                Description (Optional)
                            </label>
                            <textarea
                                id="wireframe-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your wireframe design and purpose"
                                className="fluent-textarea"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Tags Section */}
                    <div className="fluent-field-group">
                        <div className="fluent-field">
                            <label className="fluent-label">
                                <FiTag className="fluent-icon" />
                                Tags
                            </label>
                            <div className="fluent-tag-field">
                                <div className="fluent-input-group">
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Add tags (press Enter)"
                                        className="fluent-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="fluent-button fluent-button-primary"
                                        disabled={!newTag.trim()}
                                    >
                                        Add
                                    </button>
                                </div>
                                {tags.length > 0 && (
                                    <div className="fluent-tag-list">
                                        {tags.map((tag, index) => (
                                            <div key={index} className="fluent-tag">
                                                <span className="fluent-tag-text">{tag}</span>
                                                <button
                                                    onClick={() => removeTag(tag)}
                                                    className="fluent-tag-remove"
                                                    aria-label={`Remove ${tag} tag`}
                                                >
                                                    <FiX />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Wireframe Preview Info */}
                    {/* Wireframe Preview Info */}
                    <div className="fluent-field-group">
                        <h3 className="fluent-section-title">Wireframe Info</h3>
                        <div className="fluent-info-grid">
                            <div className="fluent-info-card">
                                <span className="fluent-info-label">Components</span>
                                <span className="fluent-info-value">{countComponents(currentHtml) || 'None'}</span>
                            </div>
                            <div className="fluent-info-card">
                                <span className="fluent-info-label">Theme</span>
                                <span className="fluent-info-value">{designTheme}</span>
                            </div>
                            <div className="fluent-info-card">
                                <span className="fluent-info-label">Color Scheme</span>
                                <span className="fluent-info-value">{colorScheme}</span>
                            </div>
                            <div className="fluent-info-card">
                                <span className="fluent-info-label">Code Size</span>
                                <span className="fluent-info-value">{((currentHtml.length + currentCss.length) / 1024).toFixed(1)}KB</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dialog Footer */}
                <div className="fluent-dialog-footer">
                    <button
                        onClick={onClose}
                        className="fluent-button fluent-button-secondary"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="fluent-button fluent-button-primary"
                        disabled={!wireframeName.trim() || isSaving}
                    >
                        {isSaving ? (
                            <>
                                <div className="fluent-spinner" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <FiDownload className="fluent-icon" />
                                {isUpdating ? 'Update' : 'Save'} Wireframe
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FluentSaveWireframeModal;
export type { SavedWireframe, SaveOptions };
