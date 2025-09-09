import React, { useState } from 'react';
import './FigmaUrlImporter.css';

interface FigmaComponent {
    id: string;
    name: string;
    description: string;
    category: string;
    html: string;
    css: string;
    figmaUrl: string;
    designTokens: any;
    content?: string; // Generated HTML + CSS content
}

interface FigmaUrlImporterProps {
    onComponentImported: (component: FigmaComponent) => void;
    onClose: () => void;
}

const FigmaUrlImporter: React.FC<FigmaUrlImporterProps> = ({
    onComponentImported,
    onClose
}) => {
    const [figmaUrl, setFigmaUrl] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [error, setError] = useState('');
    const [importedComponent, setImportedComponent] = useState<FigmaComponent | null>(null);

    const handleImport = async () => {
        if (!figmaUrl.trim()) {
            setError('Please enter a Figma URL');
            return;
        }

        if (!figmaUrl.includes('figma.com')) {
            setError('Please enter a valid Figma URL');
            return;
        }

        setIsImporting(true);
        setError('');

        try {
            console.log('🎯 Importing from Figma URL:', figmaUrl);

            const response = await fetch('http://localhost:7072/api/figmaNodeImporter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    figmaUrl: figmaUrl.trim()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to import component');
            }

            const result = await response.json();
            console.log('✅ Component imported successfully:', result);

            const component = result.component;
            setImportedComponent(component);

        } catch (err: any) {
            console.error('❌ Import failed:', err.message);
            setError(err.message || 'Failed to import component');
        } finally {
            setIsImporting(false);
        }
    };

    const handleAddToWireframe = () => {
        if (importedComponent) {
            // Create component with content that includes the CSS
            const componentWithStyles = {
                ...importedComponent,
                content: `
          <style>
            ${importedComponent.css}
          </style>
          ${importedComponent.html}
        `
            };

            onComponentImported(componentWithStyles);
            onClose();
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFigmaUrl(e.target.value);
        setError('');
        setImportedComponent(null);
    };

    return (
        <div className="figma-url-importer-overlay">
            <div className="figma-url-importer-modal">
                <div className="modal-header">
                    <h3>🎨 Import from Figma URL</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="url-input-section">
                        <label htmlFor="figma-url">Figma Component URL:</label>
                        <input
                            id="figma-url"
                            type="url"
                            value={figmaUrl}
                            onChange={handleUrlChange}
                            placeholder="https://www.figma.com/design/FILE_ID/TITLE?node-id=NODE_ID..."
                            className="figma-url-input"
                            disabled={isImporting}
                        />
                        <p className="url-help">
                            💡 Right-click on a component in Figma → "Copy link" → Paste here
                        </p>
                    </div>

                    {error && (
                        <div className="error-message">
                            ❌ {error}
                        </div>
                    )}

                    <div className="action-buttons">
                        <button
                            onClick={handleImport}
                            disabled={isImporting || !figmaUrl.trim()}
                            className="import-btn"
                        >
                            {isImporting ? '🔄 Importing...' : '📥 Import Component'}
                        </button>
                    </div>

                    {importedComponent && (
                        <div className="imported-component-preview">
                            <div className="preview-header">
                                <h4>✅ Component Imported Successfully!</h4>
                                <div className="component-info">
                                    <span className="component-name">{importedComponent.name}</span>
                                    <span className="component-category">{importedComponent.category}</span>
                                </div>
                            </div>

                            <div className="preview-content">
                                <div className="preview-html">
                                    <h5>🎨 Preview:</h5>
                                    <div
                                        className="component-preview"
                                        dangerouslySetInnerHTML={{
                                            __html: `
                        <style>${importedComponent.css}</style>
                        ${importedComponent.html}
                      `
                                        }}
                                    />
                                </div>

                                <div className="design-tokens">
                                    <h5>🔧 Design Properties:</h5>
                                    <div className="tokens-grid">
                                        {importedComponent.designTokens?.fills?.length > 0 && (
                                            <div className="token-item">
                                                <span className="token-label">Background:</span>
                                                <span
                                                    className="color-swatch"
                                                    data-color={importedComponent.designTokens.fills[0].color}
                                                ></span>
                                                <span className="token-value">{importedComponent.designTokens.fills[0].color}</span>
                                            </div>
                                        )}

                                        {importedComponent.designTokens?.cornerRadius > 0 && (
                                            <div className="token-item">
                                                <span className="token-label">Border Radius:</span>
                                                <span className="token-value">{importedComponent.designTokens.cornerRadius}px</span>
                                            </div>
                                        )}

                                        {importedComponent.designTokens?.typography?.fontSize && (
                                            <div className="token-item">
                                                <span className="token-label">Font Size:</span>
                                                <span className="token-value">{importedComponent.designTokens.typography.fontSize}px</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="preview-actions">
                                <button
                                    onClick={handleAddToWireframe}
                                    className="add-to-wireframe-btn"
                                >
                                    ➕ Add to Wireframe
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FigmaUrlImporter;
