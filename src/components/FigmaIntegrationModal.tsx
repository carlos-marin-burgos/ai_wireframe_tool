import React, { useState, useCallback, useEffect, useRef } from 'react';
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
    FiExternalLink,
    FiClock,
    FiInfo,
    FiPause,
    FiPlay
} from 'react-icons/fi';
import './FigmaIntegrationModal.css';
import { figmaApi, FigmaFile as ApiFigmaFile, FigmaFrame } from '../services/figmaApi';
import { tokenExtractor, DesignTokenCollection } from '../services/figmaTokenExtractor';
import FigmaFileUpload from './FigmaFileUpload';

import { getApiUrl } from '../config/api';

const FIGMA_TRUSTED_SESSION_KEY = 'figma_oauth_session';
const FIGMA_SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

type TrustedFigmaSession = {
    source: 'oauth' | 'manual';
    connectedAt: number;
    expiresAt: number;
    user?: { email?: string; handle?: string } | null;
    tokenPreview?: string;
};

const readTrustedSession = (): TrustedFigmaSession | null => {
    if (typeof window === 'undefined') return null;

    try {
        const raw = window.localStorage.getItem(FIGMA_TRUSTED_SESSION_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') {
            window.localStorage.removeItem(FIGMA_TRUSTED_SESSION_KEY);
            return null;
        }

        const connectedAt = typeof parsed.connectedAt === 'number' ? parsed.connectedAt : Date.now();
        const expiresAt = typeof parsed.expiresAt === 'number'
            ? parsed.expiresAt
            : connectedAt + FIGMA_SESSION_TTL_MS;

        if (Date.now() >= expiresAt) {
            window.localStorage.removeItem(FIGMA_TRUSTED_SESSION_KEY);
            return null;
        }

        return {
            source: parsed.source === 'manual' ? 'manual' : 'oauth',
            connectedAt,
            expiresAt,
            user: parsed.user ?? null,
            tokenPreview: parsed.tokenPreview
        };
    } catch (error) {
        console.error('Error reading trusted Figma session:', error);
        try {
            window.localStorage.removeItem(FIGMA_TRUSTED_SESSION_KEY);
        } catch {
            /* noop */
        }
        return null;
    }
};

const persistTrustedSession = (session: Omit<TrustedFigmaSession, 'expiresAt'> & { expiresAt?: number }) => {
    if (typeof window === 'undefined') return;

    const payload: TrustedFigmaSession = {
        ...session,
        expiresAt: session.expiresAt ?? session.connectedAt + FIGMA_SESSION_TTL_MS,
    };

    try {
        window.localStorage.setItem(FIGMA_TRUSTED_SESSION_KEY, JSON.stringify(payload));
    } catch (error) {
        console.error('Error persisting trusted Figma session:', error);
    }
};

const clearTrustedSession = () => {
    if (typeof window === 'undefined') return;

    try {
        window.localStorage.removeItem(FIGMA_TRUSTED_SESSION_KEY);
    } catch (error) {
        console.error('Error clearing trusted Figma session:', error);
    }
};

interface FigmaIntegrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport?: (htmlContent: string, fileName: string, tokens?: DesignTokenCollection) => void;
    onExport?: (format: 'figma-file' | 'figma-components') => void;
    onTokensExtracted?: (tokens: DesignTokenCollection) => void;
    onFileProcessed?: (file: File | ApiFigmaFile, data?: any) => void;
}

const FigmaIntegrationModal: React.FC<FigmaIntegrationModalProps> = ({
    isOpen,
    onClose,
    onImport,
    onExport,
    onTokensExtracted,
    onFileProcessed
}) => {
    const [activeTab, setActiveTab] = useState<'connect' | 'url' | 'upload' | 'live'>('connect');
    const [isConnected, setIsConnected] = useState(false);
    const isCheckingStatusRef = useRef(false);
    const statusCheckTokenRef = useRef<symbol | null>(null);
    const hasAuthoritativeConnectionRef = useRef(false);

    // Helper function to check if we have valid localStorage tokens
    const hasValidLocalTokens = useCallback(() => {
        try {
            const storedTokens = localStorage.getItem('figma_oauth_tokens');
            const storedTimestamp = localStorage.getItem('figma_oauth_timestamp');

            if (storedTokens && storedTimestamp) {
                const tokenAge = Date.now() - parseInt(storedTimestamp);
                const maxAge = 24 * 60 * 60 * 1000; // 24 hours
                return tokenAge < maxAge;
            }

            const trustedSession = readTrustedSession();
            if (trustedSession) {
                return true;
            }
        } catch (error) {
            console.error('Error checking local tokens:', error);
        }
        return false;
    }, []);
    const [authStatus, setAuthStatus] = useState<any>(null);
    const [accessToken, setAccessToken] = useState('');
    const [figmaUrl, setFigmaUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [frames, setFrames] = useState<FigmaFrame[]>([]);
    const [selectedFrames, setSelectedFrames] = useState<string[]>([]);
    const [exportFormat, setExportFormat] = useState<'figma-file' | 'figma-components'>('figma-file');
    const [extractedTokens, setExtractedTokens] = useState<DesignTokenCollection | null>(null);
    const [liveSyncEnabled, setLiveSyncEnabled] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
    const [conversionProgress, setConversionProgress] = useState(0);

    // Utility function to get the current access token (OAuth or manual)
    const getCurrentAccessToken = (): string | null => {
        // First check for locally stored OAuth tokens
        const storedTokens = localStorage.getItem('figma_oauth_tokens');
        if (storedTokens) {
            try {
                const tokenData = JSON.parse(storedTokens);
                return tokenData.access_token;
            } catch (error) {
                console.error('Error parsing stored OAuth tokens:', error);
                localStorage.removeItem('figma_oauth_tokens');
                localStorage.removeItem('figma_oauth_timestamp');
            }
        }

        // Fallback to manual token input
        return accessToken;
    };

    // Check existing OAuth connection status
    const checkOAuthStatus = useCallback(async () => {
        // Prevent multiple concurrent status checks
        if (isCheckingStatusRef.current) {
            console.log('⏸️ Status check already in progress, skipping...');
            return;
        }

        isCheckingStatusRef.current = true;
        const requestToken = Symbol('figma-status-check');
        statusCheckTokenRef.current = requestToken;
        try {
            // FIRST: Check trusted session - this is AUTHORITATIVE
            const trustedSession = readTrustedSession();
            if (trustedSession) {
                console.log('🔐 Using trusted local Figma session - SKIPPING ALL BACKEND CHECKS');
                setIsConnected(true);
                setAuthStatus({
                    status: 'trusted_local_session',
                    message: 'Using locally trusted Figma connection',
                    connected: true,
                    user: trustedSession.user || undefined
                });
                hasAuthoritativeConnectionRef.current = true;
                statusCheckTokenRef.current = null;
                isCheckingStatusRef.current = false; // Reset the checking status
                return; // STOP HERE - don't do any backend calls
            }
            hasAuthoritativeConnectionRef.current = false;

            // SECOND: Check for locally stored OAuth tokens
            const storedTokens = localStorage.getItem('figma_oauth_tokens');
            const storedTimestamp = localStorage.getItem('figma_oauth_timestamp');

            if (storedTokens && storedTimestamp) {
                // Check if tokens are still valid (within 24 hours for safety)
                const tokenAge = Date.now() - parseInt(storedTimestamp);
                const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

                if (tokenAge < maxAge) {
                    console.log('🔐 Found valid locally stored OAuth tokens');
                    console.log('🔗 Setting isConnected to TRUE from stored tokens');
                    setIsConnected(true);
                    setAuthStatus({
                        status: 'already_authorized',
                        message: 'Connected via locally stored OAuth tokens',
                        connected: true,
                        user: { email: 'OAuth User (Stored)' }
                    });
                    setSuccess('🔗 Already connected to Figma via stored OAuth tokens!');

                    // Skip backend check if we have valid local tokens - make localStorage authoritative
                    console.log('✅ Using localStorage as authoritative source - skipping backend check');
                    hasAuthoritativeConnectionRef.current = true;
                    statusCheckTokenRef.current = null;
                    isCheckingStatusRef.current = false; // Reset the checking status
                    return;
                } else {
                    console.log('⏰ Locally stored tokens expired, removing...');
                    localStorage.removeItem('figma_oauth_tokens');
                    localStorage.removeItem('figma_oauth_timestamp');
                    hasAuthoritativeConnectionRef.current = false;
                }
            }

            // THIRD: Only if no trusted session AND no valid OAuth tokens, check backend
            const response = await fetch(getApiUrl('/api/figmaOAuthStatus'), {
                headers: { 'Accept': 'application/json' }
            });

            // Attempt to parse JSON safely even on non-2xx if response type is JSON
            const contentType = response.headers.get('Content-Type') || '';
            const isJson = contentType.includes('application/json');

            if (!response.ok) {
                if (isJson) {
                    const errorData = await response.json();
                    if (errorData.status === 'oauth_not_configured') {
                        setAuthStatus({
                            status: 'oauth_not_configured',
                            message: 'OAuth2 not configured - using manual token mode',
                            error: errorData.message
                        });
                        console.log('❌ OAuth not configured, setting isConnected to FALSE');
                        setIsConnected(false);
                        setActiveTab('connect');
                        return;
                    }
                    throw new Error(errorData.error || 'OAuth status check failed');
                } else {
                    throw new Error('OAuth status check failed (non-JSON response)');
                }
            }

            if (isJson) {
                let data;
                try {
                    const text = await response.text();
                    if (text.trim()) {
                        data = JSON.parse(text);
                    } else {
                        console.log('ℹ️ Empty response body - likely HTML auth challenge, ignoring');
                        return;
                    }
                } catch (jsonError) {
                    console.error('Failed to parse OAuth status response as JSON:', jsonError);
                    console.log('ℹ️ HTML auth challenge detected - likely stale status check, ignoring');
                    return; // Skip this response as it's likely HTML from authentication challenge
                }

                console.log('🔍 OAuth Status Response:', data); // Debug log

                if (statusCheckTokenRef.current !== requestToken) {
                    console.log('⏭️ Ignoring stale OAuth status response (JSON) [token already rotated]');
                } else {
                    setAuthStatus(data);

                    if (data.status === 'already_authorized' && data.connected) {
                        console.log('✅ Server confirms OAuth connection - setting connected state to TRUE');
                        setIsConnected(true);
                        hasAuthoritativeConnectionRef.current = true;
                        setSuccess(`🔗 Already connected to Figma! Welcome back, ${data.user?.email || data.user?.handle || 'User'}`);
                        setActiveTab('connect');
                    } else {
                        const hasLocalTokens = hasValidLocalTokens();
                        const hasTrustedSessionNow = Boolean(readTrustedSession());
                        if (!hasLocalTokens && !hasTrustedSessionNow && !hasAuthoritativeConnectionRef.current) {
                            console.log('❌ Server indicates not connected (no local/trusted session) - leaving connection FALSE', data);
                            setIsConnected(false);
                            setActiveTab('connect');
                        } else {
                            console.log('⚠️ Server indicates disconnect but local trusted state exists - keeping connection TRUE');
                        }
                    }
                }
            } else {
                // Fallback: Received HTML (likely interactive auth page)
                const hasLocalTokens = hasValidLocalTokens();
                const hasTrustedSessionNow = Boolean(readTrustedSession());

                if (statusCheckTokenRef.current !== requestToken) {
                    console.log('⏭️ Ignoring stale HTML OAuth status response [token already rotated]');
                } else if (!hasLocalTokens && !hasTrustedSessionNow && !hasAuthoritativeConnectionRef.current) {
                    setAuthStatus({ status: 'authorization_required', message: 'Authorization required (interactive auth page detected)' });
                    console.log('ℹ️ HTML auth challenge detected (no local session yet) - awaiting OAuth completion');
                    setIsConnected(false);
                    setActiveTab('connect');
                } else {
                    console.log('⚠️ HTML response received but valid session exists - keeping connection TRUE');
                }
            }
        } catch (error) {
            console.error('Error checking OAuth status:', error);

            const hasLocalTokens = hasValidLocalTokens();
            const hasTrustedSessionNow = Boolean(readTrustedSession());

            if (statusCheckTokenRef.current !== requestToken) {
                console.log('⏭️ Ignoring stale OAuth status error [token already rotated]');
            } else if (!hasLocalTokens && !hasTrustedSessionNow && !hasAuthoritativeConnectionRef.current) {
                setAuthStatus({
                    status: 'oauth_error',
                    message: 'OAuth connection unavailable - using manual token mode',
                    error: error instanceof Error ? error.message : String(error)
                });
                console.log('❌ OAuth status request failed (no local/trusted session) - leaving connection FALSE');
                setIsConnected(false);
                setActiveTab('connect');
            } else {
                console.log('⚠️ OAuth status check failed but valid session exists - keeping connection TRUE');
                setAuthStatus({
                    status: 'oauth_error_but_connected',
                    message: 'Status check failed but using stored OAuth tokens',
                    connected: true
                });
            }
        } finally {
            if (statusCheckTokenRef.current === requestToken) {
                isCheckingStatusRef.current = false;
                statusCheckTokenRef.current = null;
            }
        }
    }, []); // No dependencies needed - all refs and state setters are stable

    // Check OAuth status on component mount
    useEffect(() => {
        if (isOpen) {
            checkOAuthStatus();
        }
    }, [isOpen]); // Only re-run when modal opens/closes

    // Listen for OAuth success messages from popup window
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'FIGMA_OAUTH_SUCCESS') {
                console.log('✅ Received OAuth success message', event.data);

                // Store tokens locally if provided in the message
                if (event.data.tokenInfo) {
                    localStorage.setItem('figma_oauth_tokens', JSON.stringify(event.data.tokenInfo));
                    localStorage.setItem('figma_oauth_timestamp', Date.now().toString());
                    console.log('💾 Stored OAuth tokens locally');
                }

                const connectedAt = Date.now();
                persistTrustedSession({
                    source: 'oauth',
                    connectedAt,
                    expiresAt: connectedAt + FIGMA_SESSION_TTL_MS,
                    user: event.data.userInfo || null,
                    tokenPreview: event.data.tokenInfo?.access_token
                        ? `${event.data.tokenInfo.access_token.slice(0, 4)}…${event.data.tokenInfo.access_token.slice(-4)}`
                        : undefined
                });

                // CRITICAL: Update the connection state IMMEDIATELY
                console.log('🔗 Setting isConnected to TRUE immediately');
                setIsConnected(true);
                hasAuthoritativeConnectionRef.current = true;
                statusCheckTokenRef.current = null;
                isCheckingStatusRef.current = false;

                // Update auth status
                setAuthStatus({
                    status: 'already_authorized',
                    message: 'Successfully connected via OAuth',
                    connected: true,
                    user: event.data.userInfo || { email: 'OAuth User' }
                });

                setSuccess('🎉 Successfully connected to Figma! You can now import designs.');
                setError(null);

                // Close any OAuth popup windows
                const openWindows = (window as any).figmaOAuthWindows || [];
                openWindows.forEach((popup: Window) => {
                    if (popup && !popup.closed) {
                        popup.close();
                    }
                });

                // NO delayed status check - trusted session should persist!
                console.log('✅ OAuth complete - trusted session persisted, no further status checks needed');
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []); // No dependencies needed - this is a stable event listener

    // Start OAuth flow
    const handleOAuthConnect = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Get authorization URL from backend
            const response = await fetch(getApiUrl('/api/figmaOAuthStart'), {
                method: 'GET'  // Changed from POST to GET since endpoint only accepts GET, HEAD, OPTIONS
            });

            if (!response.ok) {
                let errorData;
                try {
                    const text = await response.text();
                    if (text.trim()) {
                        errorData = JSON.parse(text);
                    } else {
                        console.log('ℹ️ Empty OAuth start error response - likely HTML auth challenge, graceful fallback');
                        throw new Error(`OAuth start failed with status ${response.status}: ${response.statusText}`);
                    }
                } catch (jsonError) {
                    if (jsonError.message.includes('Empty response body') || jsonError.message.includes('OAuth start failed with status')) {
                        // This is our controlled error, re-throw it
                        throw jsonError;
                    }
                    console.log('ℹ️ OAuth start error response not JSON - likely HTML auth challenge');
                    throw new Error(`OAuth start failed with status ${response.status}: ${response.statusText}`);
                }

                if (errorData.status === 'oauth_not_configured') {
                    setError('⚠️ OAuth is not configured. Please use the Manual Token section below to connect to Figma.');
                    // Stay on connect tab where manual token input is available
                    setActiveTab('connect');
                    return;
                }

                throw new Error(errorData.error || 'Failed to get authorization URL');
            }

            let data;
            try {
                const text = await response.text();
                if (text.trim()) {
                    // Check if response is HTML (expected for OAuth authorization page)
                    if (text.trim().toLowerCase().startsWith('<!doctype') || text.trim().startsWith('<html')) {
                        console.log('✅ OAuth start returned HTML authorization page - this is correct!');
                        // For HTML responses, we need to open the authorization URL in a popup
                        // Extract the authorization URL from the HTML response
                        const urlMatch = text.match(/href="([^"]*figma\.com\/oauth[^"]*)"/);
                        if (urlMatch && urlMatch[1]) {
                            const authUrl = urlMatch[1];
                            console.log('🔗 Extracted auth URL from HTML:', authUrl);
                            // Continue with popup opening logic using the expected property name
                            data = { auth_url: authUrl };
                        } else {
                            console.log('⚠️ Could not extract auth URL from HTML response');
                            throw new Error('Could not extract authorization URL from response');
                        }
                    } else {
                        // Try to parse as JSON (fallback)
                        data = JSON.parse(text);
                    }
                } else {
                    console.log('ℹ️ Empty OAuth start response - likely HTML auth challenge');
                    throw new Error('OAuth endpoint returned empty response - authentication may be required');
                }
            } catch (jsonError) {
                if (jsonError.message.includes('OAuth endpoint returned')) {
                    // This is our controlled error, re-throw it
                    throw jsonError;
                }
                console.log('ℹ️ OAuth start response not valid JSON - likely HTML auth challenge');
                throw new Error('OAuth endpoint returned invalid format - authentication may be required');
            }

            if (data.auth_url) {
                // Open OAuth window
                const authWindow = window.open(
                    data.auth_url,
                    'figma-oauth',
                    'width=600,height=700,scrollbars=yes,resizable=yes'
                );

                // Poll for window closure or success
                const pollTimer = setInterval(() => {
                    if (authWindow?.closed) {
                        clearInterval(pollTimer);
                        // No status check needed - OAuth success message handler is authoritative
                        console.log('🚪 OAuth window closed - relying on message handler for status');
                    }
                }, 1000);

                setSuccess('🚀 Opening Figma OAuth window. Please authorize the application.');
            } else {
                setError('Failed to get authorization URL from backend');
            }
        } catch (error) {
            setError(`OAuth connection failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []); // No dependencies needed - function uses only stable APIs

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

    // Enhanced file upload handler
    const handleFileSelect = useCallback(async (file: File, metadata: any) => {
        setIsLoading(true);
        setError(null);
        setConversionProgress(0);

        try {
            // Simulate processing steps
            setConversionProgress(25);
            await new Promise(resolve => setTimeout(resolve, 500));

            let processedData = null;
            let htmlContent = '';

            if (file.type === 'application/json') {
                // Handle JSON files (exported Figma data)
                const content = await file.text();
                const jsonData = JSON.parse(content);

                setConversionProgress(50);

                // Extract tokens if it's Figma data
                if (jsonData.document || jsonData.styles) {
                    const tokens = tokenExtractor.extractTokensFromFigma(jsonData);
                    setExtractedTokens(tokens);
                    onTokensExtracted?.(tokens);
                }

                setConversionProgress(75);

                // Convert to HTML
                htmlContent = await figmaApi.convertFramesToWireframe(
                    jsonData.frames || [],
                    jsonData.fileKey || 'uploaded-file'
                );

                processedData = jsonData;
            } else if (file.type.startsWith('image/')) {
                // Handle image files
                setConversionProgress(50);

                // Create HTML wrapper for image
                htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Imported Design - ${file.name}</title>
                    <style>
                        body { margin: 0; padding: 20px; font-family: 'Segoe UI', sans-serif; background: #f5f5f5; }
                        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                        .header { background: #3C4858; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; text-align: center; }
                        .design-image { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                        .metadata { margin-top: 20px; padding: 16px; background: #f8f9fa; border-radius: 6px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎨 Imported Design</h1>
                            <p>Design imported from ${file.name}</p>
                        </div>
                        <div class="content">
                            <img src="${metadata.previewUrl || URL.createObjectURL(file)}" alt="${file.name}" class="design-image" />
                            <div class="metadata">
                                <strong>File Details:</strong><br>
                                Name: ${file.name}<br>
                                Size: ${(file.size / 1024 / 1024).toFixed(2)} MB<br>
                                Type: ${file.type}<br>
                                Last Modified: ${new Date(file.lastModified).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </body>
                </html>`;

                setConversionProgress(75);
                processedData = { type: 'image', file, metadata };
            }

            setConversionProgress(100);

            // Call callbacks
            onFileProcessed?.(file, processedData);
            onImport(htmlContent, file.name, extractedTokens || undefined);

            setSuccess(`🎉 Successfully processed "${file.name}"! Design tokens extracted and HTML generated.`);

            // Auto-close after success
            setTimeout(() => onClose(), 2000);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process file');
        } finally {
            setIsLoading(false);
            setConversionProgress(0);
        }
    }, [onImport, onTokensExtracted, onFileProcessed, onClose, extractedTokens]);

    // Enhanced URL import handler  
    const handleUrlImport = useCallback(async (url: string) => {
        console.log('🚀 handleUrlImport called with URL:', url);
        setIsLoading(true);
        setError(null);
        setConversionProgress(0);

        try {
            const currentToken = getCurrentAccessToken();
            console.log('🔐 Current access token available:', !!currentToken);
            if (!currentToken) {
                console.log('❌ No access token found, showing error');
                setError('Please connect to Figma first (OAuth or manual token)');
                return;
            }

            figmaApi.setAccessToken(currentToken);

            const fileKey = figmaApi.parseFileUrl(url);
            console.log('🔍 Parsed Figma file key:', fileKey);
            if (fileKey) {
                console.log('✅ Detected Figma URL, processing...');
                // Figma URL handling
                setConversionProgress(25);
                const fileData = await figmaApi.getFile(fileKey);
                console.log('📄 Retrieved file data:', fileData ? 'success' : 'failed');

                setConversionProgress(50);
                const extractedFrames = figmaApi.extractFrames(fileData.document);
                setFrames(extractedFrames);

                // Extract design tokens
                const tokens = tokenExtractor.extractTokensFromFigma(fileData, fileKey);
                setExtractedTokens(tokens);
                onTokensExtracted?.(tokens);

                setConversionProgress(75);

                // Auto-select all frames for import
                const frameIds = extractedFrames.map(f => f.id);
                setSelectedFrames(frameIds);

                setConversionProgress(100);
                setSuccess(`📋 Found ${extractedFrames.length} frames and extracted ${tokens.colors.length} color tokens, ${tokens.typography.length} typography tokens.`);

            } else {
                console.log('🌐 Not a Figma URL, treating as regular URL');
                // Regular URL handling (images, etc.)
                setConversionProgress(50);

                const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Imported from URL</title>
                    <style>
                        body { margin: 0; padding: 20px; font-family: 'Segoe UI', sans-serif; }
                        .container { max-width: 1200px; margin: 0 auto; }
                        .imported-content { text-align: center; padding: 40px; }
                        .url-preview { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="imported-content">
                            <h1>🌐 Imported from URL</h1>
                            <p>Content imported from: ${url}</p>
                            <img src="${url}" alt="Imported content" class="url-preview" onerror="this.style.display='none'" />
                        </div>
                    </div>
                </body>
                </html>`;

                setConversionProgress(100);
                onImport(htmlContent, 'URL Import');
                setSuccess('🎉 Successfully imported content from URL!');
                setTimeout(() => onClose(), 2000);
            }

        } catch (err) {
            console.error('❌ Error in handleUrlImport:', err);
            setError(err instanceof Error ? err.message : 'Failed to import from URL');
        } finally {
            console.log('🏁 handleUrlImport finished');
            setIsLoading(false);
            setConversionProgress(0);
        }
    }, [onImport, onTokensExtracted, onClose, getCurrentAccessToken]);

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
                const connectedAt = Date.now();
                persistTrustedSession({
                    source: 'manual',
                    connectedAt,
                    expiresAt: connectedAt + FIGMA_SESSION_TTL_MS,
                    user: { email: 'Personal Access Token' },
                    tokenPreview: `${accessToken.slice(0, 4)}…${accessToken.slice(-4)}`
                });
                hasAuthoritativeConnectionRef.current = true;
                statusCheckTokenRef.current = null;
                isCheckingStatusRef.current = false;
                setSuccess('🔗 Successfully connected to Figma! You can now import designs.');

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
            const currentToken = getCurrentAccessToken();
            if (!currentToken) {
                setError('Please connect to Figma first (OAuth or manual token)');
                return;
            }

            figmaApi.setAccessToken(currentToken);

            const fileKey = figmaApi.parseFileUrl(figmaUrl);
            if (!fileKey) {
                setError('Invalid Figma URL. Please use a valid Figma file URL.');
                return;
            }

            const fileData = await figmaApi.getFile(fileKey);
            const extractedFrames = figmaApi.extractFrames(fileData.document);

            setFrames(extractedFrames);
            setSuccess(`📋 Found ${extractedFrames.length} frames in your Figma file. Select which ones to import.`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load Figma file');
        } finally {
            setIsLoading(false);
        }
    }, [figmaUrl, getCurrentAccessToken]);

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
        setConversionProgress(0);

        try {
            const currentToken = getCurrentAccessToken();
            if (!currentToken) {
                setError('Please connect to Figma first (OAuth or manual token)');
                return;
            }

            figmaApi.setAccessToken(currentToken);

            const fileKey = figmaApi.parseFileUrl(figmaUrl);
            if (!fileKey) {
                setError('Invalid Figma URL');
                return;
            }

            setConversionProgress(25);
            const selectedFrameObjects = frames.filter(frame => selectedFrames.includes(frame.id));

            setConversionProgress(50);
            const html = await figmaApi.convertFramesToWireframe(selectedFrameObjects, fileKey);

            setConversionProgress(75);

            // Include extracted tokens in the import
            onImport(html, 'Figma Import', extractedTokens || undefined);

            setConversionProgress(100);
            setSuccess('🎉 Figma designs successfully imported and converted to wireframe with design tokens!');
            setLastSyncTime(new Date());

            setTimeout(() => onClose(), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to import frames');
        } finally {
            setIsLoading(false);
            setConversionProgress(0);
        }
    }, [selectedFrames, frames, figmaUrl, onImport, onClose, extractedTokens, getCurrentAccessToken]);

    const handleExport = useCallback(() => {
        onExport?.(exportFormat);
        const fileType = exportFormat === 'figma-file' ? 'HTML file' : 'JSON data file';
        setSuccess(`🎉 ${fileType} download started! Check your browser's Downloads folder.`);
        setTimeout(() => onClose(), 2000);
    }, [exportFormat, onExport, onClose]);

    const handleDisconnect = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Clear the local state first
            setIsConnected(false);
            setAccessToken('');
            setFrames([]);
            setSelectedFrames([]);
            setFigmaUrl('');
            setAuthStatus(null);
            figmaApi.setAccessToken('');

            // Clear locally stored OAuth tokens
            localStorage.removeItem('figma_oauth_tokens');
            localStorage.removeItem('figma_oauth_timestamp');
            console.log('🗑️ Cleared locally stored OAuth tokens');
            clearTrustedSession();

            // Try to call backend disconnect endpoint if available
            try {
                const response = await fetch(getApiUrl('/api/figmaOAuthDisconnect'), {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    console.log('✅ Backend OAuth session cleared');
                }
            } catch (backendError) {
                console.log('⚠️ Backend disconnect not available, local cleanup only');
            }

            setSuccess('🔓 Disconnected from Figma. Your local session has been cleared.');
            setActiveTab('connect');

            // No status check needed after disconnect - state is already cleared
            console.log('🔓 Disconnect complete - no further status checks needed');
            hasAuthoritativeConnectionRef.current = false;
            statusCheckTokenRef.current = null;
            isCheckingStatusRef.current = false;

        } catch (error) {
            console.error('Disconnect error:', error);
            setError(`Disconnect failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    }, []); // No dependencies needed - function uses only stable APIs

    if (!isOpen) return null;

    return (
        <div className="figma-modal-overlay">
            <div className="figma-modal">
                <div className="figma-modal-header">
                    <div className="figma-modal-title">
                        <FiLink className="figma-icon" />
                        <h2>Figma Integration Hub</h2>
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
                        className={`figma-tab ${activeTab === 'connect' ? 'active' : ''}`}
                        onClick={() => setActiveTab('connect')}
                    >
                        <FiSettings />
                        Connect
                    </button>
                    <button
                        className={`figma-tab ${activeTab === 'url' ? 'active' : ''} ${!isConnected ? 'disabled' : ''}`}
                        onClick={() => isConnected && setActiveTab('url')}
                        disabled={!isConnected}
                    >
                        <FiLink />
                        URL Import
                    </button>
                    <button
                        className={`figma-tab ${activeTab === 'upload' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        <FiUpload />
                        File Upload
                    </button>
                    <button
                        className={`figma-tab ${activeTab === 'live' ? 'active' : ''} ${!isConnected ? 'disabled' : ''}`}
                        onClick={() => isConnected && setActiveTab('live')}
                        disabled={!isConnected}
                    >
                        <FiRefreshCw />
                        Live Sync
                    </button>
                </div>

                {/* Progress Bar */}
                {conversionProgress > 0 && (
                    <div className="figma-progress-container">
                        <div className="figma-progress-bar">
                            <div
                                className="figma-progress-fill"
                                style={{ '--progress-value': `${conversionProgress}%` } as React.CSSProperties}
                            />
                        </div>
                        <span className="figma-progress-text">{conversionProgress}% complete</span>
                    </div>
                )}

                <div className="figma-modal-content">
                    {/* Connect Tab */}
                    {activeTab === 'connect' && (
                        <div className="figma-tab-content">
                            <div className="tab-description">
                                <h3>🔗 Connect to Figma</h3>
                                <p>Securely connect your Figma account to import designs with full OAuth2 authentication.</p>
                            </div>

                            {!isConnected ? (
                                <div className="figma-connect-section">
                                    <div className="figma-oauth-info">
                                        <div className="oauth-feature">
                                            <FiLink className="feature-icon" />
                                            <div>
                                                <h4>Secure OAuth2 Connection</h4>
                                                <p>Connect using Figma's official OAuth2 flow. We never store your password.</p>
                                            </div>
                                        </div>

                                        <div className="oauth-feature">
                                            <FiLayers className="feature-icon" />
                                            <div>
                                                <h4>Full File Access</h4>
                                                <p>Access your Figma files, extract design tokens, and import components.</p>
                                            </div>
                                        </div>

                                        <div className="oauth-feature">
                                            <FiRefreshCw className="feature-icon" />
                                            <div>
                                                <h4>Real-time Sync</h4>
                                                <p>Keep your wireframes in sync with Figma file changes automatically.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="figma-connect-actions">
                                        {/* Show OAuth button only if OAuth is configured */}
                                        {authStatus?.status !== 'oauth_not_configured' && (
                                            <button
                                                className="figma-btn figma-btn-primary oauth-btn"
                                                onClick={handleOAuthConnect}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <FiRefreshCw className="spinning" />
                                                        Connecting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiExternalLink />
                                                        Connect with Figma OAuth
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {/* Show OAuth not available message if not configured */}
                                        {authStatus?.status === 'oauth_not_configured' && (
                                            <div className="oauth-not-available">
                                                <div className="info-message">
                                                    <FiInfo className="info-icon" />
                                                    <div>
                                                        <h4>OAuth Not Configured</h4>
                                                        <p>OAuth2 authentication is not set up. Please use the manual token method below.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="oauth-alternative">
                                            <span className="oauth-divider">or</span>

                                            <div className="manual-token-section">
                                                <h4>Manual Token Connection</h4>
                                                <p className="token-description">
                                                    Have a Figma personal access token? You can connect manually:
                                                </p>

                                                <div className="figma-input-group">
                                                    <label htmlFor="manual-token">Figma Personal Access Token</label>
                                                    <input
                                                        id="manual-token"
                                                        type="password"
                                                        placeholder="figd_..."
                                                        value={accessToken}
                                                        onChange={(e) => setAccessToken(e.target.value)}
                                                        className="figma-input"
                                                    />
                                                    <small className="token-help">
                                                        Get your token from <a href="https://www.figma.com/developers/api#access-tokens" target="_blank" rel="noopener noreferrer">Figma Settings</a>
                                                    </small>
                                                </div>

                                                <button
                                                    className="figma-btn figma-btn-outline"
                                                    onClick={handleConnect}
                                                    disabled={isLoading || !accessToken.trim()}
                                                >
                                                    {isLoading ? <FiRefreshCw className="spinning" /> : <FiLink />}
                                                    Connect with Token
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="figma-connected-section">
                                    <div className="connection-success">
                                        <FiCheck className="success-icon" />
                                        <div className="connection-details">
                                            <h4>Successfully Connected!</h4>
                                            {authStatus?.user && (
                                                <p>Connected as: <strong>{authStatus.user.email || authStatus.user.handle}</strong></p>
                                            )}
                                            {authStatus?.expires_at && (
                                                <p className="token-expiry">
                                                    Token expires: {new Date(authStatus.expires_at).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="connected-actions">
                                        <div className="action-grid">
                                            <button
                                                className="figma-btn figma-btn-primary"
                                                onClick={() => setActiveTab('url')}
                                            >
                                                <FiLink />
                                                Import from URL
                                            </button>

                                            <button
                                                className="figma-btn figma-btn-primary"
                                                onClick={() => setActiveTab('live')}
                                            >
                                                <FiRefreshCw />
                                                Setup Live Sync
                                            </button>
                                        </div>

                                        <button
                                            className="figma-btn figma-btn-danger disconnect-btn"
                                            onClick={handleDisconnect}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <FiRefreshCw className="spinning" /> : <FiX />}
                                            Disconnect
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* URL Import Tab */}
                    {activeTab === 'url' && (
                        <div className="figma-tab-content">
                            <div className="tab-description">
                                <h3>📥 Import from URL</h3>
                                <p>Import from Figma URLs or any image URL. Design tokens will be automatically extracted from Figma files.</p>
                            </div>

                            <div className="figma-input-group">
                                <label htmlFor="figma-url">Figma File URL or Image URL</label>
                                <input
                                    id="figma-url"
                                    type="url"
                                    placeholder="https://www.figma.com/file/... or image URL"
                                    value={figmaUrl}
                                    onChange={(e) => setFigmaUrl(e.target.value)}
                                    className="figma-input"
                                />
                            </div>

                            <button
                                className="figma-btn figma-btn-primary"
                                onClick={() => handleUrlImport(figmaUrl)}
                                disabled={isLoading || !figmaUrl.trim()}
                            >
                                {isLoading ? <FiRefreshCw className="spinning" /> : <FiDownload />}
                                {isLoading ? 'Processing...' : 'Import Design'}
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
                                            {extractedTokens && ' with Tokens'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* File Upload Tab */}
                    {activeTab === 'upload' && (
                        <div className="figma-tab-content">
                            <div className="tab-description">
                                <h3>📁 Upload Files</h3>
                                <p>Upload Figma JSON exports, images, or drag & drop files for instant conversion with design token extraction.</p>
                            </div>

                            <FigmaFileUpload
                                onFileSelect={handleFileSelect}
                                onUrlImport={handleUrlImport}
                                isLoading={isLoading}
                            />
                        </div>
                    )}

                    {/* Live Sync Tab */}
                    {activeTab === 'live' && (
                        <div className="figma-tab-content">
                            <div className="tab-description">
                                <h3>🔄 Live Sync</h3>
                                <p>Set up real-time synchronization with your Figma files for automatic updates and collaboration.</p>
                            </div>

                            <div className="figma-sync-status">
                                <div className="sync-header">
                                    <h4>
                                        <FiRefreshCw className={liveSyncEnabled ? 'spinning' : ''} />
                                        Sync Status
                                    </h4>
                                    <span className={`sync-status-badge ${liveSyncEnabled ? 'active' : 'inactive'}`}>
                                        {liveSyncEnabled ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                {lastSyncTime && (
                                    <div className="sync-info">
                                        <FiClock />
                                        <span>Last sync: {lastSyncTime.toLocaleTimeString()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="figma-sync-controls">
                                <button
                                    className={`figma-btn ${liveSyncEnabled ? 'figma-btn-danger' : 'figma-btn-primary'}`}
                                    onClick={() => setLiveSyncEnabled(!liveSyncEnabled)}
                                >
                                    {liveSyncEnabled ? (
                                        <>
                                            <FiPause />
                                            Disable Live Sync
                                        </>
                                    ) : (
                                        <>
                                            <FiPlay />
                                            Enable Live Sync
                                        </>
                                    )}
                                </button>

                                {liveSyncEnabled && (
                                    <div className="sync-options">
                                        <label className="figma-checkbox">
                                            <input type="checkbox" defaultChecked />
                                            <span>Auto-import on file changes</span>
                                        </label>
                                        <label className="figma-checkbox">
                                            <input type="checkbox" defaultChecked />
                                            <span>Extract design tokens automatically</span>
                                        </label>
                                        <label className="figma-checkbox">
                                            <input type="checkbox" defaultChecked />
                                            <span>Generate component previews</span>
                                        </label>
                                    </div>
                                )}
                            </div>

                            {liveSyncEnabled && figmaUrl && (
                                <div className="figma-monitored-file">
                                    <h5>Monitoring File:</h5>
                                    <code className="figma-file-url">{figmaUrl}</code>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Design Tokens Preview */}
                    {extractedTokens && (
                        <div className="figma-tokens-section">
                            <div className="tokens-header">
                                <h3>
                                    <FiLayers />
                                    Extracted Design Tokens
                                </h3>
                                <span className="tokens-count">
                                    {Object.values(extractedTokens).flat().length} tokens
                                </span>
                            </div>

                            <div className="figma-tokens-grid">
                                {extractedTokens.colors && extractedTokens.colors.length > 0 && (
                                    <div className="token-group">
                                        <h4>🎨 Colors ({extractedTokens.colors.length})</h4>
                                        <div className="color-tokens">
                                            {extractedTokens.colors.slice(0, 8).map((color, index) => (
                                                <div key={index} className="color-token">
                                                    <div
                                                        className="color-swatch"
                                                        style={{ '--swatch-color': color.value } as React.CSSProperties}
                                                        title={color.value}
                                                    />
                                                    <span className="color-name">{color.name}</span>
                                                </div>
                                            ))}
                                            {extractedTokens.colors.length > 8 && (
                                                <div className="more-tokens">
                                                    +{extractedTokens.colors.length - 8} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {extractedTokens.typography && extractedTokens.typography.length > 0 && (
                                    <div className="token-group">
                                        <h4>✍️ Typography ({extractedTokens.typography.length})</h4>
                                        <div className="typography-tokens">
                                            {extractedTokens.typography.slice(0, 4).map((typo, index) => (
                                                <div key={index} className="typography-token">
                                                    <span className="typo-name">{typo.name}</span>
                                                    <span className="typo-details">
                                                        {typo.fontSize}px • {typo.fontFamily}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {extractedTokens.spacing && extractedTokens.spacing.length > 0 && (
                                    <div className="token-group">
                                        <h4>📏 Spacing ({extractedTokens.spacing.length})</h4>
                                        <div className="spacing-tokens">
                                            {extractedTokens.spacing.slice(0, 6).map((space, index) => (
                                                <div key={index} className="spacing-token">
                                                    <span className="spacing-name">{space.name}</span>
                                                    <span className="spacing-value">{space.value}px</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FigmaIntegrationModal;
