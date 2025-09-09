import React, { useState, useCallback } from 'react';
import { FiDownload, FiX, FiFile, FiDatabase } from 'react-icons/fi';
import './ExportModal.css';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (format: 'html' | 'json') => void;
    hasWireframe: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({
    isOpen,
    onClose,
    onExport,
    hasWireframe
}) => {
    const [exportFormat, setExportFormat] = useState<'html' | 'json'>('html');
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = useCallback(async () => {
        if (!hasWireframe) {
            return;
        }

        setIsExporting(true);
        try {
            await onExport(exportFormat);
            setTimeout(() => {
                onClose();
                setIsExporting(false);
            }, 1500);
        } catch (error) {
            console.error('Export error:', error);
            setIsExporting(false);
        }
    }, [exportFormat, onExport, onClose, hasWireframe]);

    if (!isOpen) return null;

    return (
        <div className="export-modal-overlay" onClick={onClose}>
            <div className="export-modal" onClick={(e) => e.stopPropagation()}>
                <div className="export-modal-header">
                    <div className="export-modal-title">
                        <FiDownload className="export-icon" />
                        <h2>Export Wireframe</h2>
                    </div>
                    <button
                        className="export-modal-close"
                        onClick={onClose}
                        aria-label="Close export modal"
                    >
                        <FiX />
                    </button>
                </div>

                <div className="export-modal-content">
                    {!hasWireframe ? (
                        <div className="export-error-state">
                            <div className="export-error-icon">📄</div>
                            <h3>No Wireframe to Export</h3>
                            <p>Please create a wireframe first before attempting to export.</p>
                            <button className="export-btn export-btn-secondary" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="export-intro">
                                <p>Choose your preferred export format to download your wireframe.</p>
                            </div>

                            <div className="export-format-section">
                                <h3>Export Format</h3>
                                <div className="export-format-options">
                                    <label className={`export-format-option ${exportFormat === 'html' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="exportFormat"
                                            value="html"
                                            checked={exportFormat === 'html'}
                                            onChange={(e) => setExportFormat(e.target.value as 'html')}
                                        />
                                        <div className="export-format-content">
                                            <div className="export-format-header">
                                                <FiFile className="export-format-icon" />
                                                <strong>Standalone HTML File</strong>
                                            </div>
                                            <p>Complete webpage with embedded styles and interactivity</p>
                                        </div>
                                    </label>

                                    <label className={`export-format-option ${exportFormat === 'json' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="exportFormat"
                                            value="json"
                                            checked={exportFormat === 'json'}
                                            onChange={(e) => setExportFormat(e.target.value as 'json')}
                                        />
                                        <div className="export-format-content">
                                            <div className="export-format-header">
                                                <FiDatabase className="export-format-icon" />
                                                <strong>JSON Data Export</strong>
                                            </div>
                                            <p>Structured data with metadata for developers</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="export-preview-section">
                                {exportFormat === 'html' ? (
                                    <div className="export-preview">
                                        <h4>📄 HTML Export Details</h4>
                                        <p>Your wireframe will be exported as a complete, self-contained HTML file that includes:</p>
                                        <ul>
                                            <li>All wireframe content and layout</li>
                                            <li>Embedded CSS styling</li>
                                            <li>Interactive elements and hover effects</li>
                                            <li>Professional branding and header</li>
                                            <li>Ready to share or host anywhere</li>
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="export-preview">
                                        <h4>📊 JSON Export Details</h4>
                                        <p>Your wireframe will be exported as structured JSON data containing:</p>
                                        <ul>
                                            <li>Raw HTML content</li>
                                            <li>Design theme and color scheme</li>
                                            <li>Export timestamp and metadata</li>
                                            <li>Original description and settings</li>
                                            <li>Perfect for developer handoff</li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="export-actions">
                                <button
                                    className="export-btn export-btn-secondary"
                                    onClick={onClose}
                                    disabled={isExporting}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="export-btn export-btn-primary"
                                    onClick={handleExport}
                                    disabled={isExporting}
                                >
                                    <FiDownload />
                                    {isExporting ? 'Exporting...' : `Download ${exportFormat.toUpperCase()} File`}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
