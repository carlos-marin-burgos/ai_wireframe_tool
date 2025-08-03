import React, { useState, useCallback } from 'react';
import {
    FiX,
    FiUpload,
    FiDownload,
    FiLink,
    FiRefreshCw,
    FiCheck,
    FiAlertCircle,
    FiFileText,
    FiLayers,
    FiSettings
} from 'react-icons/fi';
import './FigmaIntegrationModal.css';

interface FigmaFile {
    id: string;
    name: string;
    thumbnail: string;
    lastModified: string;
    teamName: string;
}

interface FigmaIntegrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (fileId: string, format: 'wireframe' | 'components') => void;
    onExport: (format: 'figma-file' | 'figma-components') => void;
}

const FigmaIntegrationModal: React.FC<FigmaIntegrationModalProps> = ({
    isOpen,
    onClose,
    onImport,
    onExport
}) => {
    const [activeTab, setActiveTab] = useState<'import' | 'export' | 'sync'>('import');
    const [isConnected, setIsConnected] = useState(false);
    const [figmaFiles] = useState<FigmaFile[]>([
        {
            id: 'file1',
            name: 'Design System v2.0',
            thumbnail: '/api/placeholder/200/150',
            lastModified: '2 hours ago',
            teamName: 'Product Team'
        },
        {
            id: 'file2',
            name: 'Mobile App Wireframes',
            thumbnail: '/api/placeholder/200/150',
            lastModified: '1 day ago',
            teamName: 'Mobile Team'
        },
        {
            id: 'file3',
            name: 'Web Dashboard Components',
            thumbnail: '/api/placeholder/200/150',
            lastModified: '3 days ago',
            teamName: 'Web Team'
        }
    ]);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [exportFormat, setExportFormat] = useState<'figma-file' | 'figma-components'>('figma-file');

    const handleConnect = useCallback(async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsConnected(true);
            setIsLoading(false);
        }, 1500);
    }, []);

    const handleFileSelect = useCallback((fileId: string) => {
        setSelectedFiles(prev =>
            prev.includes(fileId)
                ? prev.filter(id => id !== fileId)
                : [...prev, fileId]
        );
    }, []);

    const handleImport = useCallback(() => {
        if (selectedFiles.length > 0) {
            selectedFiles.forEach(fileId => {
                onImport(fileId, 'wireframe');
            });
            onClose();
        }
    }, [selectedFiles, onImport, onClose]);

    const handleExport = useCallback(() => {
        onExport(exportFormat);
        onClose();
    }, [exportFormat, onExport, onClose]);

    if (!isOpen) return null;

    return (
        <div className="figma-modal-overlay">
            <div className="figma-modal">
                <div className="figma-modal-header">
                    <div className="figma-modal-title">
                        <FiLink className="figma-icon" />
                        <h2>Figma Integration Bridge</h2>
                    </div>
                    <button className="figma-modal-close" onClick={onClose} aria-label="Close Figma integration modal">
                        <FiX />
                    </button>
                </div>

                {/* Connection Status */}
                <div className={`figma-connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                    {isConnected ? (
                        <>
                            <FiCheck className="status-icon" />
                            <span>Connected to Figma</span>
                        </>
                    ) : (
                        <>
                            <FiAlertCircle className="status-icon" />
                            <span>Not connected to Figma</span>
                            <button className="connect-btn" onClick={handleConnect} disabled={isLoading} aria-label="Connect to Figma">
                                {isLoading ? <FiRefreshCw className="spinning" /> : 'Connect'}
                            </button>
                        </>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="figma-tabs">
                    <button
                        className={`figma-tab ${activeTab === 'import' ? 'active' : ''}`}
                        onClick={() => setActiveTab('import')}
                        aria-label="Import from Figma tab"
                    >
                        <FiUpload />
                        Import from Figma
                    </button>
                    <button
                        className={`figma-tab ${activeTab === 'export' ? 'active' : ''}`}
                        onClick={() => setActiveTab('export')}
                        aria-label="Export to Figma tab"
                    >
                        <FiDownload />
                        Export to Figma
                    </button>
                    <button
                        className={`figma-tab ${activeTab === 'sync' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sync')}
                        aria-label="Sync and settings tab"
                    >
                        <FiRefreshCw />
                        Sync & Settings
                    </button>
                </div>

                <div className="figma-modal-content">
                    {/* Import Tab */}
                    {activeTab === 'import' && (
                        <div className="figma-import-section">
                            <div className="section-header">
                                <h3>Import Figma Designs</h3>
                                <p>Select Figma files to convert into wireframes</p>
                            </div>

                            {isConnected ? (
                                <>
                                    <div className="figma-files-grid">
                                        {figmaFiles.map((file) => (
                                            <div
                                                key={file.id}
                                                className={`figma-file-card ${selectedFiles.includes(file.id) ? 'selected' : ''}`}
                                                onClick={() => handleFileSelect(file.id)}
                                            >
                                                <div className="file-thumbnail">
                                                    <div className="thumbnail-placeholder">
                                                        <FiFileText />
                                                    </div>
                                                </div>
                                                <div className="file-info">
                                                    <h4>{file.name}</h4>
                                                    <p className="file-team">{file.teamName}</p>
                                                    <p className="file-modified">{file.lastModified}</p>
                                                </div>
                                                {selectedFiles.includes(file.id) && (
                                                    <div className="file-selected-indicator">
                                                        <FiCheck />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="import-options">
                                        <div className="option-group">
                                            <label htmlFor="import-type">Import as:</label>
                                            <select id="import-type" defaultValue="wireframe" aria-label="Select import type">
                                                <option value="wireframe">Wireframe Structure</option>
                                                <option value="components">Component Library</option>
                                                <option value="styles">Design Tokens Only</option>
                                            </select>
                                        </div>
                                        <div className="option-group">
                                            <label>
                                                <input type="checkbox" defaultChecked />
                                                Preserve layer names
                                            </label>
                                        </div>
                                        <div className="option-group">
                                            <label>
                                                <input type="checkbox" defaultChecked />
                                                Import design tokens (colors, typography)
                                            </label>
                                        </div>
                                    </div>

                                    <div className="modal-actions">
                                        <button
                                            className="btn-secondary"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn-primary"
                                            onClick={handleImport}
                                            disabled={selectedFiles.length === 0}
                                        >
                                            Import {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="figma-connect-prompt">
                                    <FiLink className="connect-icon" />
                                    <h3>Connect to Figma</h3>
                                    <p>Connect your Figma account to import designs and sync with your wireframes.</p>
                                    <button className="btn-primary" onClick={handleConnect}>
                                        Connect to Figma
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Export Tab */}
                    {activeTab === 'export' && (
                        <div className="figma-export-section">
                            <div className="section-header">
                                <h3>Export to Figma</h3>
                                <p>Export your wireframes to Figma for further design development</p>
                            </div>

                            <div className="export-preview">
                                <div className="current-wireframe-preview">
                                    <div className="preview-placeholder">
                                        <FiLayers />
                                        <span>Current Wireframe</span>
                                    </div>
                                </div>
                            </div>

                            <div className="export-options">
                                <div className="option-group">
                                    <label>Export format:</label>
                                    <div className="radio-group">
                                        <label>
                                            <input
                                                type="radio"
                                                name="exportFormat"
                                                value="figma-file"
                                                checked={exportFormat === 'figma-file'}
                                                onChange={(e) => setExportFormat(e.target.value as any)}
                                            />
                                            New Figma File
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="exportFormat"
                                                value="figma-components"
                                                checked={exportFormat === 'figma-components'}
                                                onChange={(e) => setExportFormat(e.target.value as any)}
                                            />
                                            Figma Components
                                        </label>
                                    </div>
                                </div>

                                <div className="option-group">
                                    <label>
                                        <input type="checkbox" defaultChecked />
                                        Include annotations
                                    </label>
                                </div>
                                <div className="option-group">
                                    <label>
                                        <input type="checkbox" defaultChecked />
                                        Export responsive breakpoints
                                    </label>
                                </div>
                                <div className="option-group">
                                    <label>
                                        <input type="checkbox" />
                                        Create component variants
                                    </label>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button className="btn-secondary" onClick={onClose}>
                                    Cancel
                                </button>
                                <button className="btn-primary" onClick={handleExport}>
                                    Export to Figma
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Sync Tab */}
                    {activeTab === 'sync' && (
                        <div className="figma-sync-section">
                            <div className="section-header">
                                <h3>Sync & Settings</h3>
                                <p>Manage your Figma integration settings and sync preferences</p>
                            </div>

                            <div className="sync-settings">
                                <div className="setting-group">
                                    <div className="setting-header">
                                        <FiRefreshCw />
                                        <h4>Auto-sync</h4>
                                    </div>
                                    <label>
                                        <input type="checkbox" />
                                        Automatically sync changes between platforms
                                    </label>
                                    <label>
                                        <input type="checkbox" defaultChecked />
                                        Sync design tokens (colors, typography, spacing)
                                    </label>
                                    <label>
                                        <input type="checkbox" />
                                        Sync component updates
                                    </label>
                                </div>

                                <div className="setting-group">
                                    <div className="setting-header">
                                        <FiSettings />
                                        <h4>Export Settings</h4>
                                    </div>
                                    <div className="option-group">
                                        <label htmlFor="export-format">Default export format:</label>
                                        <select id="export-format" defaultValue="figma-file" aria-label="Select default export format">
                                            <option value="figma-file">Figma File</option>
                                            <option value="figma-components">Components</option>
                                        </select>
                                    </div>
                                    <div className="option-group">
                                        <label htmlFor="frame-naming">Frame naming convention:</label>
                                        <select id="frame-naming" defaultValue="descriptive" aria-label="Select frame naming convention">
                                            <option value="descriptive">Descriptive (Homepage - Header)</option>
                                            <option value="simple">Simple (Frame 1, Frame 2)</option>
                                            <option value="custom">Custom Pattern</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button className="btn-secondary" onClick={onClose}>
                                    Cancel
                                </button>
                                <button className="btn-primary">
                                    Save Settings
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FigmaIntegrationModal;
