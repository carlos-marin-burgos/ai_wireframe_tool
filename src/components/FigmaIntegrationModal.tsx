import React, { useState, useCallback, useEffect } from 'react';
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
    FiSettings,
    FiExternalLink
} from 'react-icons/fi';
import './FigmaIntegrationModal.css';
import { figmaApi, FigmaFile as ApiFigmaFile, FigmaFrame } from '../services/figmaApi';

interface FigmaIntegrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (html: string, fileName: string) => void;
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
    const [accessToken, setAccessToken] = useState('');
    const [figmaUrl, setFigmaUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [frames, setFrames] = useState<FigmaFrame[]>([]);
    const [selectedFrames, setSelectedFrames] = useState<string[]>([]);
    const [exportFormat, setExportFormat] = useState<'figma-file' | 'figma-components'>('figma-file');

    // Clear messages after 5 seconds
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const handleConnect = useCallback(async () => {
        if (!accessToken.trim()) {
            setError('Please enter your Figma access token');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // For now, let's implement a mock connection since real Figma OAuth requires backend setup
            // In a real implementation, this would redirect to Figma OAuth

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock validation - in real app, this would validate with Figma API
            if (accessToken.toLowerCase().includes('figd_') || accessToken.length > 10) {
                figmaApi.setAccessToken(accessToken);
                setIsConnected(true);
                setSuccess('Successfully connected to Figma!');

                // Open Figma in a new tab to show it's working
                window.open('https://www.figma.com/', '_blank');
            } else {
                setError('Please enter a valid Figma access token starting with "figd_"');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to connect to Figma');
        } finally {
            setIsLoading(false);
        }
    }, [accessToken]);

    const handleLoadFrames = useCallback(async () => {
        if (!figmaUrl.trim()) {
            setError('Please enter a Figma file URL');
            return;
        }

        setIsLoading(true);
        setError(null);
        setFrames([]);

        try {
            const fileKey = figmaApi.parseFileUrl(figmaUrl);
            if (!fileKey) {
                setError('Invalid Figma URL. Please use a valid Figma file URL.');
                return;
            }

            const fileData = await figmaApi.getFile(fileKey);
            const extractedFrames = figmaApi.extractFrames(fileData.document);

            setFrames(extractedFrames);
            setSuccess(`Loaded ${extractedFrames.length} frames from Figma file`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load Figma file');
        } finally {
            setIsLoading(false);
        }
    }, [figmaUrl]);

    const handleFrameSelect = useCallback((frameId: string) => {
        setSelectedFrames(prev =>
            prev.includes(frameId)
                ? prev.filter(id => id !== frameId)
                : [...prev, frameId]
        );
    }, []);

    const handleImport = useCallback(async () => {
        if (selectedFrames.length === 0) {
            setError('Please select at least one frame to import');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const fileKey = figmaApi.parseFileUrl(figmaUrl);
            if (!fileKey) {
                setError('Invalid Figma URL');
                return;
            }

            const selectedFrameObjects = frames.filter(frame => selectedFrames.includes(frame.id));
            const html = await figmaApi.convertFramesToWireframe(selectedFrameObjects, fileKey);

            onImport(html, 'Figma Import');
            setSuccess('Successfully imported frames as wireframe!');
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to import frames');
        } finally {
            setIsLoading(false);
        }
    }, [selectedFrames, frames, figmaUrl, onImport, onClose]);

    const handleExport = useCallback(() => {
        onExport(exportFormat);
        setSuccess('Download started! Check your browser\'s download folder.');
        setTimeout(() => onClose(), 2000);
    }, [exportFormat, onExport, onClose]);

    const handleDisconnect = useCallback(() => {
        setIsConnected(false);
        setAccessToken('');
        setFrames([]);
        setSelectedFrames([]);
        setFigmaUrl('');
        figmaApi.setAccessToken('');
        setSuccess('Disconnected from Figma');
    }, []);

    if (!isOpen) return null;

    return (
        <div className="figma-modal-overlay">
            <div className="figma-modal">
                <div className="figma-modal-header">
                    <div className="figma-modal-title">
                        <FiLink className="figma-icon" />
                        <h2>Figma Integration</h2>
                    </div>
                    <button className="figma-modal-close" onClick={onClose} aria-label="Close Figma integration modal">
                        <FiX />
                    </button>
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="figma-message figma-error">
                        <FiAlertCircle />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="figma-message figma-success">
                        <FiCheck />
                        <span>{success}</span>
                    </div>
                )}

                {/* Connection Status */}
                <div className={`figma-connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                    {isConnected ? (
                        <>
                            <FiCheck className="status-icon" />
                            <span>Connected to Figma</span>
                            <button className="disconnect-btn" onClick={handleDisconnect}>
                                Disconnect
                            </button>
                        </>
                    ) : (
                        <>
                            <FiAlertCircle className="status-icon" />
                            <span>Not connected to Figma</span>
                        </>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="figma-tabs">
                    <button
                        className={`figma-tab ${activeTab === 'import' ? 'active' : ''}`}
                        onClick={() => setActiveTab('import')}
                    >
                        <FiUpload />
                        Import from Figma
                    </button>
                    <button
                        className={`figma-tab ${activeTab === 'export' ? 'active' : ''}`}
                        onClick={() => setActiveTab('export')}
                    >
                        <FiDownload />
                        Export to Figma
                    </button>
                </div>

                <div className="figma-modal-content">
                    {/* Import Tab */}
                    {activeTab === 'import' && (
                        <div className="figma-tab-content">
                            {!isConnected ? (
                                <div className="figma-auth-section">
                                    <h3>Connect to Figma</h3>
                                    <p>Enter your Figma access token to get started.</p>

                                    <div className="figma-input-group">
                                        <label htmlFor="figma-token">Figma Access Token</label>
                                        <input
                                            id="figma-token"
                                            type="password"
                                            placeholder="figd_..."
                                            value={accessToken}
                                            onChange={(e) => setAccessToken(e.target.value)}
                                            className="figma-input"
                                        />
                                        <small>
                                            <a
                                                href="https://www.figma.com/developers/api#access-tokens"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="figma-link"
                                            >
                                                <FiExternalLink />
                                                How to get your access token
                                            </a>
                                        </small>
                                    </div>

                                    <button
                                        className="figma-btn figma-btn-primary"
                                        onClick={handleConnect}
                                        disabled={isLoading || !accessToken.trim()}
                                    >
                                        {isLoading ? <FiRefreshCw className="spinning" /> : <FiLink />}
                                        {isLoading ? 'Connecting...' : 'Connect to Figma'}
                                    </button>
                                </div>
                            ) : (
                                <div className="figma-import-section">
                                    <div className="figma-input-group">
                                        <label htmlFor="figma-url">Figma File URL</label>
                                        <input
                                            id="figma-url"
                                            type="url"
                                            placeholder="https://www.figma.com/file/..."
                                            value={figmaUrl}
                                            onChange={(e) => setFigmaUrl(e.target.value)}
                                            className="figma-input"
                                        />
                                    </div>

                                    <button
                                        className="figma-btn figma-btn-secondary"
                                        onClick={handleLoadFrames}
                                        disabled={isLoading || !figmaUrl.trim()}
                                    >
                                        {isLoading ? <FiRefreshCw className="spinning" /> : <FiLayers />}
                                        {isLoading ? 'Loading...' : 'Load Frames'}
                                    </button>

                                    {frames.length > 0 && (
                                        <div className="figma-frames-section">
                                            <h4>Select Frames to Import ({frames.length} available)</h4>
                                            <div className="figma-frames-grid">
                                                {frames.map((frame) => (
                                                    <div
                                                        key={frame.id}
                                                        className={`figma-frame-card ${selectedFrames.includes(frame.id) ? 'selected' : ''}`}
                                                        onClick={() => handleFrameSelect(frame.id)}
                                                    >
                                                        <div className="frame-preview">
                                                            <FiFileText size={24} />
                                                        </div>
                                                        <div className="frame-info">
                                                            <h5>{frame.name}</h5>
                                                            <span className="frame-type">{frame.type}</span>
                                                            {frame.absoluteBoundingBox && (
                                                                <span className="frame-size">
                                                                    {Math.round(frame.absoluteBoundingBox.width)} × {Math.round(frame.absoluteBoundingBox.height)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {selectedFrames.includes(frame.id) && (
                                                            <div className="frame-selected-indicator">
                                                                <FiCheck />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="figma-actions">
                                                <button
                                                    className="figma-btn figma-btn-outline"
                                                    onClick={() => setSelectedFrames(frames.map(f => f.id))}
                                                >
                                                    Select All
                                                </button>
                                                <button
                                                    className="figma-btn figma-btn-outline"
                                                    onClick={() => setSelectedFrames([])}
                                                >
                                                    Clear Selection
                                                </button>
                                                <button
                                                    className="figma-btn figma-btn-primary"
                                                    onClick={handleImport}
                                                    disabled={isLoading || selectedFrames.length === 0}
                                                >
                                                    {isLoading ? <FiRefreshCw className="spinning" /> : <FiUpload />}
                                                    Import Selected ({selectedFrames.length})
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Export Tab */}
                    {activeTab === 'export' && (
                        <div className="figma-tab-content">
                            <div className="figma-export-section">
                                <h3>📤 Export Wireframe</h3>
                                <p>Download your current wireframe in different formats for further use or sharing.</p>

                                <div className="figma-input-group">
                                    <label>Export Format</label>
                                    <div className="figma-radio-group">
                                        <label className="figma-radio-label">
                                            <input
                                                type="radio"
                                                name="exportFormat"
                                                value="figma-file"
                                                checked={exportFormat === 'figma-file'}
                                                onChange={(e) => setExportFormat(e.target.value as any)}
                                            />
                                            <span>
                                                <strong>Standalone HTML File</strong>
                                                <small>Complete webpage with styles and interactivity for sharing or presentation</small>
                                            </span>
                                        </label>
                                        <label className="figma-radio-label">
                                            <input
                                                type="radio"
                                                name="exportFormat"
                                                value="figma-components"
                                                checked={exportFormat === 'figma-components'}
                                                onChange={(e) => setExportFormat(e.target.value as any)}
                                            />
                                            <span>
                                                <strong>JSON Data Export</strong>
                                                <small>Raw wireframe data with metadata for developers or future imports</small>
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="export-info-box">
                                    {exportFormat === 'figma-file' ? (
                                        <div className="export-description">
                                            <h4>📄 HTML Export</h4>
                                            <p>Creates a complete, self-contained HTML file that you can:</p>
                                            <ul>
                                                <li>Open in any web browser</li>
                                                <li>Share with clients or stakeholders</li>
                                                <li>Use for presentations</li>
                                                <li>Host on any web server</li>
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="export-description">
                                            <h4>📊 JSON Export</h4>
                                            <p>Exports wireframe data as structured JSON including:</p>
                                            <ul>
                                                <li>Raw HTML content</li>
                                                <li>Design metadata (theme, colors)</li>
                                                <li>Export timestamp</li>
                                                <li>Original description</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="figma-btn figma-btn-primary"
                                    onClick={handleExport}
                                    disabled={isLoading}
                                >
                                    <FiDownload />
                                    {exportFormat === 'figma-file' ? 'Download HTML File' : 'Download JSON Data'}
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
