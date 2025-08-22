con/**
 * Figma Integration Component
 * Main integration point for Figma component importing
 */

import React, { useState } from 'react';
import FigmaComponentBrowser from './FigmaComponentBrowser';
import { FigmaIntegrationProps, FigmaComponentImportResult } from '../types/figma';
import './FigmaIntegration.css';

const FigmaIntegration: React.FC<FigmaIntegrationProps> = ({
    onComponentsImported,
    onClose,
    designSystem = 'auto',
    mode = 'component-browser'
}) => {
    console.log('🎨 FigmaIntegration component rendered!');
    const [isImporting, setIsImporting] = useState(false);
    const [importStatus, setImportStatus] = useState<{
        type: 'success' | 'error';
        message: string;
        results?: FigmaComponentImportResult[];
    } | null>(null);

    const handleImportComponents = async (componentIds) => {
        setIsImporting(true);
        setImportStatus(null);

        try {
            const response = await fetch('/api/figma/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    componentIds,
                    wireframeOptions: {
                        designSystem,
                        includeVariants: true,
                        generateCSS: true,
                        responsive: true
                    }
                })
            });

            const result = await response.json();

            if (response.ok) {
                setImportStatus({
                    type: 'success',
                    message: `Successfully imported ${result.summary.successful} of ${result.summary.total} components`,
                    results: result.results
                });

                // Pass the imported components to parent
                if (onComponentsImported) {
                    onComponentsImported(result.results.filter(r => r.success));
                }
            } else {
                throw new Error(result.error || 'Import failed');
            }
        } catch (error) {
            setImportStatus({
                type: 'error',
                message: `Import failed: ${error.message}`
            });
        } finally {
            setIsImporting(false);
        }
    };

    const handleCloseBrowser = () => {
        setImportStatus(null);
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="figma-integration">
            {mode === 'component-browser' ? (
                // Component Browser Mode (for Pages toolbar)
                <FigmaComponentBrowser
                    onImportComponents={handleImportComponents}
                    onClose={handleCloseBrowser}
                />
            ) : (
                // Design Import Mode (for Top toolbar - same as landing page)
                <div className="figma-design-import">
                    <div className="modal-header">
                        <h2>Import from Figma</h2>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                    <div className="modal-content">
                        <div className="import-tabs">
                            <button className="tab-btn active">Import Design</button>
                            <button className="tab-btn">Connect Account</button>
                        </div>
                        <div className="import-section">
                            <h3>Import Figma Design</h3>
                            <p>Import your Figma designs as wireframes. Paste a Figma share link or upload a Figma file.</p>
                            <div className="import-input-group">
                                <input 
                                    type="text" 
                                    placeholder="Paste Figma share link here..."
                                    className="figma-url-input"
                                />
                                <button className="import-btn" disabled={isImporting}>
                                    {isImporting ? 'Importing...' : 'Import Design'}
                                </button>
                            </div>
                            <div className="file-upload-section">
                                <label className="file-upload-label">
                                    <input type="file" accept=".fig,.figma" className="hidden-file-input" />
                                    <div className="upload-zone">
                                        <div className="upload-icon">📁</div>
                                        <div>Upload Figma File</div>
                                        <div className="upload-hint">Drag & drop or click to browse</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FigmaIntegration;
