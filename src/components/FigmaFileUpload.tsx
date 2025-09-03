import React, { useState, useCallback, useRef } from 'react';
import {
    FiUpload,
    FiFile,
    FiX,
    FiCheck,
    FiAlertTriangle,
    FiDownload,
    FiImage,
    FiCode
} from 'react-icons/fi';
import './FigmaFileUpload.css';

interface FigmaFileUploadProps {
    onFileSelect: (file: File, metadata: FileMetadata) => void;
    onUrlImport: (url: string) => void;
    isLoading?: boolean;
    maxSize?: number; // in MB
    acceptedFormats?: string[];
}

interface FileMetadata {
    name: string;
    size: number;
    type: string;
    lastModified: Date;
    previewUrl?: string;
}

interface UploadMethod {
    id: 'file' | 'url' | 'figma-link';
    name: string;
    description: string;
    icon: React.ReactNode;
    supportedFormats: string[];
}

const FigmaFileUpload: React.FC<FigmaFileUploadProps> = ({
    onFileSelect,
    onUrlImport,
    isLoading = false,
    maxSize = 50, // 50MB default
    acceptedFormats = ['.fig', '.json', '.svg', '.png', '.jpg', '.jpeg']
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadMethod, setUploadMethod] = useState<'file' | 'url' | 'figma-link'>('figma-link');
    const [figmaUrl, setFigmaUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadMethods: UploadMethod[] = [
        {
            id: 'figma-link',
            name: 'Figma URL',
            description: 'Import directly from a Figma file URL',
            icon: <FiCode />,
            supportedFormats: ['Figma file URLs']
        },
        {
            id: 'file',
            name: 'File Upload',
            description: 'Upload exported files from Figma or other design tools',
            icon: <FiUpload />,
            supportedFormats: acceptedFormats
        },
        {
            id: 'url',
            name: 'Image URL',
            description: 'Import from an image URL or cloud storage',
            icon: <FiImage />,
            supportedFormats: ['PNG', 'JPG', 'SVG URLs']
        }
    ];

    const validateFile = useCallback((file: File): string | null => {
        // Check file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSize) {
            return `File size (${fileSizeMB.toFixed(2)}MB) exceeds maximum limit of ${maxSize}MB`;
        }

        // Check file type
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!acceptedFormats.includes(extension)) {
            return `File type ${extension} is not supported. Accepted formats: ${acceptedFormats.join(', ')}`;
        }

        return null;
    }, [maxSize, acceptedFormats]);

    const validateFigmaUrl = useCallback((url: string): string | null => {
        if (!url.trim()) {
            return 'Please enter a Figma URL';
        }

        const figmaUrlPattern = /^https:\/\/(www\.)?figma\.com\/(file|proto|design)\/[a-zA-Z0-9]+/;
        if (!figmaUrlPattern.test(url)) {
            return 'Please enter a valid Figma file URL (starting with https://figma.com/file/)';
        }

        return null;
    }, []);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        setError(null);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 1) {
            setError('Please upload only one file at a time');
            return;
        }

        const file = files[0];
        if (file) {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                return;
            }

            setSelectedFile(file);
            handleFileUpload(file);
        }
    }, [validateFile]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = e.target.files?.[0];
        if (file) {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                return;
            }

            setSelectedFile(file);
            handleFileUpload(file);
        }
    }, [validateFile]);

    const handleFileUpload = useCallback(async (file: File) => {
        setUploadProgress(0);
        setError(null);

        try {
            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            // Create file metadata
            const metadata: FileMetadata = {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: new Date(file.lastModified)
            };

            // Generate preview for images
            if (file.type.startsWith('image/')) {
                metadata.previewUrl = URL.createObjectURL(file);
            }

            // Complete upload
            setTimeout(() => {
                setUploadProgress(100);
                setSuccess(`File "${file.name}" uploaded successfully!`);
                onFileSelect(file, metadata);

                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(null), 3000);
            }, 1000);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload file');
            setUploadProgress(0);
        }
    }, [onFileSelect]);

    const handleUrlImport = useCallback(() => {
        setError(null);

        if (uploadMethod === 'figma-link') {
            const validationError = validateFigmaUrl(figmaUrl);
            if (validationError) {
                setError(validationError);
                return;
            }
        }

        setSuccess('Importing from URL...');
        onUrlImport(figmaUrl);

        // Clear form
        setFigmaUrl('');
        setTimeout(() => setSuccess(null), 3000);
    }, [uploadMethod, figmaUrl, validateFigmaUrl, onUrlImport]);

    const clearFile = useCallback(() => {
        setSelectedFile(null);
        setUploadProgress(0);
        setError(null);
        setSuccess(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    return (
        <div className="figma-file-upload">
            <div className="upload-header">
                <h3>Import Your Designs</h3>
                <p>Choose how you'd like to import your design files into Designetica</p>
            </div>

            {/* Upload Method Selection */}
            <div className="upload-methods">
                {uploadMethods.map((method) => (
                    <button
                        key={method.id}
                        className={`upload-method ${uploadMethod === method.id ? 'active' : ''}`}
                        onClick={() => setUploadMethod(method.id)}
                        disabled={isLoading}
                    >
                        <div className="method-icon">{method.icon}</div>
                        <div className="method-content">
                            <h4>{method.name}</h4>
                            <p>{method.description}</p>
                            <div className="method-formats">
                                {method.supportedFormats.slice(0, 3).map((format, index) => (
                                    <span key={index} className="format-tag">{format}</span>
                                ))}
                                {method.supportedFormats.length > 3 && (
                                    <span className="format-tag">+{method.supportedFormats.length - 3} more</span>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Status Messages */}
            {error && (
                <div className="upload-message error">
                    <FiAlertTriangle />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="upload-message success">
                    <FiCheck />
                    <span>{success}</span>
                </div>
            )}

            {/* Upload Interface */}
            <div className="upload-interface">
                {uploadMethod === 'file' && (
                    <div className="file-upload-section">
                        <div
                            className={`upload-zone ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={acceptedFormats.join(',')}
                                onChange={handleFileChange}
                                className="file-input-hidden"
                                disabled={isLoading}
                                title="Select file to upload"
                                aria-label="Select file to upload"
                            />

                            {!selectedFile ? (
                                <>
                                    <FiUpload size={32} className="upload-icon" />
                                    <h4>Drop your file here or click to browse</h4>
                                    <p>Supports: {acceptedFormats.join(', ')}</p>
                                    <p className="size-limit">Maximum file size: {maxSize}MB</p>
                                </>
                            ) : (
                                <div className="selected-file">
                                    <div className="file-info">
                                        <FiFile size={24} />
                                        <div className="file-details">
                                            <h4>{selectedFile.name}</h4>
                                            <p>{(selectedFile.size / (1024 * 1024)).toFixed(2)}MB</p>
                                        </div>
                                    </div>
                                    <button
                                        className="remove-file"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            clearFile();
                                        }}
                                        disabled={isLoading}
                                        title="Remove selected file"
                                        aria-label="Remove selected file"
                                    >
                                        <FiX />
                                    </button>
                                </div>
                            )}

                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="upload-progress">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            data-progress={uploadProgress}
                                        />
                                    </div>
                                    <span>{uploadProgress}%</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {(uploadMethod === 'url' || uploadMethod === 'figma-link') && (
                    <div className="url-import-section">
                        <div className="url-input-group">
                            <label htmlFor="import-url">
                                {uploadMethod === 'figma-link' ? 'Figma File URL' : 'Image URL'}
                            </label>
                            <input
                                id="import-url"
                                type="url"
                                placeholder={
                                    uploadMethod === 'figma-link'
                                        ? 'https://www.figma.com/file/...'
                                        : 'https://example.com/design.png'
                                }
                                value={figmaUrl}
                                onChange={(e) => setFigmaUrl(e.target.value)}
                                disabled={isLoading}
                                className="url-input"
                            />
                        </div>

                        <button
                            className="import-url-btn"
                            onClick={handleUrlImport}
                            disabled={isLoading || !figmaUrl.trim()}
                        >
                            {isLoading ? (
                                <>
                                    <div className="spinner" />
                                    Importing...
                                </>
                            ) : (
                                <>
                                    <FiDownload />
                                    Import from URL
                                </>
                            )}
                        </button>

                        {uploadMethod === 'figma-link' && (
                            <div className="figma-help">
                                <h5>How to get your Figma URL:</h5>
                                <ol>
                                    <li>Open your Figma file</li>
                                    <li>Click "Share" in the top-right corner</li>
                                    <li>Set permissions to "Anyone with the link can view"</li>
                                    <li>Copy the file URL and paste it above</li>
                                </ol>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Import Options */}
            <div className="import-options">
                <h4>Import Settings</h4>
                <div className="options-grid">
                    <label className="option-item">
                        <input type="checkbox" defaultChecked />
                        <span>Extract design tokens</span>
                    </label>
                    <label className="option-item">
                        <input type="checkbox" defaultChecked />
                        <span>Generate responsive layout</span>
                    </label>
                    <label className="option-item">
                        <input type="checkbox" />
                        <span>Preserve interactions</span>
                    </label>
                    <label className="option-item">
                        <input type="checkbox" defaultChecked />
                        <span>Create component library</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default FigmaFileUpload;
