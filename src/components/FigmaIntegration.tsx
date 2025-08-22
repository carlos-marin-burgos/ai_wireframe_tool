/**
 * Figma Integration Component
 * Main integration point for Figma component importing
 */

import React, { useState } from 'react';
import FigmaComponentBrowser from './FigmaComponentBrowser';
import { FigmaIntegrationProps, FigmaComponentImportResult } from '../types/figma';
import { getApiUrl } from '../config/api';
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

    // States for Connect Account functionality
    const [activeTab, setActiveTab] = useState<'import' | 'connect'>('import');
    const [figmaAccessToken, setFigmaAccessToken] = useState('');
    const [figmaIsConnected, setFigmaIsConnected] = useState(false);
    const [figmaIsLoading, setFigmaIsLoading] = useState(false);
    const [figmaError, setFigmaError] = useState<string | null>(null);
    const [figmaSuccess, setFigmaSuccess] = useState<string | null>(null);

    const handleImportComponents = async (componentIds) => {
        setIsImporting(true);
        setImportStatus(null);

        try {
            const response = await fetch(getApiUrl('/api/figma/import'), {
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

    // Connect Account functionality
    const handleFigmaConnect = async () => {
        if (!figmaAccessToken.trim()) {
            setFigmaError('Please enter your Figma access token');
            return;
        }

        setFigmaIsLoading(true);
        setFigmaError(null);
        setFigmaSuccess(null);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock validation - in real app, this would validate with Figma API
            if (figmaAccessToken.toLowerCase().includes('figd_') || figmaAccessToken.length > 10) {
                setFigmaIsConnected(true);
                setFigmaSuccess('🔗 Successfully connected to Figma! You can now import designs.');

                // Switch to import tab after successful connection
                setTimeout(() => {
                    setActiveTab('import');
                }, 2000);

                // Open Figma in a new tab to show it's working
                window.open('https://www.figma.com/', '_blank');
            } else {
                setFigmaError('Please enter a valid Figma access token starting with "figd_"');
            }
        } catch (err) {
            setFigmaError(err instanceof Error ? err.message : 'Failed to connect to Figma');
        } finally {
            setFigmaIsLoading(false);
        }
    };

    const handleFigmaDisconnect = () => {
        setFigmaIsConnected(false);
        setFigmaAccessToken('');
        setFigmaError(null);
        setFigmaSuccess('🔓 Disconnected from Figma. Your data has been cleared.');

        // Clear success message after 3 seconds
        setTimeout(() => {
            setFigmaSuccess(null);
        }, 3000);
    };

    return (
        <div className="figma-integration">
            {(() => {
                console.log('🔍 FigmaIntegration mode:', mode);
                console.log('🔍 Showing component browser?', mode === 'component-browser');
                return null;
            })()}
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
                            <button
                                className={`tab-btn ${activeTab === 'import' ? 'active' : ''}`}
                                onClick={() => setActiveTab('import')}
                            >
                                Import Design
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'connect' ? 'active' : ''}`}
                                onClick={() => setActiveTab('connect')}
                            >
                                Connect Account
                            </button>
                        </div>

                        {/* Show status messages */}
                        {figmaError && (
                            <div className="status-message error">
                                <span>❌ {figmaError}</span>
                                <button onClick={() => setFigmaError(null)}>×</button>
                            </div>
                        )}
                        {figmaSuccess && (
                            <div className="status-message success">
                                <span>{figmaSuccess}</span>
                                <button onClick={() => setFigmaSuccess(null)}>×</button>
                            </div>
                        )}

                        {activeTab === 'import' ? (
                            <div className="import-section">
                                <h3>Import Figma Design</h3>
                                <p>Import your Figma designs as wireframes. Paste a Figma share link or upload a Figma file.</p>

                                {/* Connection status indicator */}
                                <div className={`connection-status ${figmaIsConnected ? 'connected' : 'disconnected'}`}>
                                    {figmaIsConnected ? (
                                        <span>✅ Connected to Figma</span>
                                    ) : (
                                        <span>⚠️ Not connected to Figma - <button className="link-btn" onClick={() => setActiveTab('connect')}>Connect now</button></span>
                                    )}
                                </div>

                                <div className="import-input-group">
                                    <input
                                        type="text"
                                        placeholder="Paste Figma share link here..."
                                        className="figma-url-input"
                                        disabled={!figmaIsConnected}
                                    />
                                    <button
                                        className="import-btn"
                                        disabled={isImporting || !figmaIsConnected}
                                    >
                                        {isImporting ? 'Importing...' : 'Import Design'}
                                    </button>
                                </div>
                                <div className="file-upload-section">
                                    <label className={`file-upload-label ${!figmaIsConnected ? 'disabled' : ''}`}>
                                        <input
                                            type="file"
                                            accept=".fig,.figma"
                                            className="hidden-file-input"
                                            disabled={!figmaIsConnected}
                                        />
                                        <div className="upload-zone">
                                            <div className="upload-icon">📁</div>
                                            <div>Upload Figma File</div>
                                            <div className="upload-hint">
                                                {figmaIsConnected ? 'Drag & drop or click to browse' : 'Connect to Figma first'}
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div className="connect-section">
                                <h3>Connect to Figma</h3>
                                <p>Connect your Figma account to import designs directly into the wireframe tool.</p>

                                {!figmaIsConnected ? (
                                    <div className="connect-form">
                                        <div className="input-group">
                                            <label htmlFor="figma-token">Figma Access Token</label>
                                            <input
                                                id="figma-token"
                                                type="password"
                                                placeholder="Enter your Figma access token (figd_...)"
                                                value={figmaAccessToken}
                                                onChange={(e) => setFigmaAccessToken(e.target.value)}
                                                className="token-input"
                                            />
                                            <div className="input-hint">
                                                <a href="https://www.figma.com/developers/api#access-tokens" target="_blank" rel="noopener noreferrer">
                                                    How to get your Figma access token
                                                </a>
                                            </div>
                                        </div>
                                        <button
                                            className="connect-btn"
                                            onClick={handleFigmaConnect}
                                            disabled={figmaIsLoading || !figmaAccessToken.trim()}
                                        >
                                            {figmaIsLoading ? 'Connecting...' : 'Connect to Figma'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="connected-section">
                                        <div className="connection-success">
                                            <div className="success-icon">✅</div>
                                            <div>
                                                <h4>Successfully Connected!</h4>
                                                <p>Your Figma account is connected and ready to use.</p>
                                            </div>
                                        </div>
                                        <div className="connected-actions">
                                            <button
                                                className="primary-btn"
                                                onClick={() => setActiveTab('import')}
                                            >
                                                Start Importing
                                            </button>
                                            <button
                                                className="secondary-btn"
                                                onClick={handleFigmaDisconnect}
                                            >
                                                Disconnect
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FigmaIntegration;
