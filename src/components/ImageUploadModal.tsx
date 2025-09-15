import React, { useState, useCallback } from 'react';
import { FiX, FiImage, FiUpload, FiStar } from 'react-icons/fi';
import ImageUploadZone from './ImageUploadZone';
import DemoImageGallery from './DemoImageGallery';
import './ImageUploadModal.css';

interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImageUpload: (file: File) => void;
    onAnalyzeImage: (imageUrl: string, fileName: string) => void;
    isAnalyzing?: boolean;
    demoMode?: boolean; // Add demo mode prop
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
    isOpen,
    onClose,
    onImageUpload,
    onAnalyzeImage,
    isAnalyzing = false,
    demoMode = false
}) => {
    const [uploadMode, setUploadMode] = useState<'upload' | 'demo'>('upload');
    const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

    const handleDemoSelect = useCallback((demoImage: any) => {
        setSelectedDemo(demoImage.id);

        // Simulate the demo analysis with mock data
        setTimeout(() => {
            // Create a mock file object for the demo
            const mockFileName = `${demoImage.name.toLowerCase().replace(/\s+/g, '-')}.png`;
            onAnalyzeImage(demoImage.url, mockFileName);
        }, 500);
    }, [onAnalyzeImage]);

    if (!isOpen) return null;

    const currentMode = demoMode ? uploadMode : 'upload';

    return (
        <div className="fluent-modal-backdrop" onClick={onClose}>
            <div className="fluent-dialog fluent-upload-dialog" onClick={(e) => e.stopPropagation()}>
                {/* Fluent Dialog Header */}
                <div className="fluent-dialog-header">
                    <div className="fluent-dialog-title">
                        <FiUpload className="fluent-dialog-icon" />
                        <h2>Upload Image to Wireframe</h2>
                    </div>
                    <button className="fluent-close-btn" onClick={onClose} title="Close modal">
                        <FiX />
                    </button>
                </div>

                {/* Mode Switcher (only show in demo mode) */}
                {demoMode && (
                    <div className="upload-mode-switcher">
                        <button
                            className={`mode-btn ${currentMode === 'upload' ? 'active' : ''}`}
                            onClick={() => setUploadMode('upload')}
                        >
                            <FiUpload className="mode-icon" />
                            Upload Your Image
                        </button>
                        <button
                            className={`mode-btn ${currentMode === 'demo' ? 'active' : ''}`}
                            onClick={() => setUploadMode('demo')}
                        >
                            <FiStar className="mode-icon" />
                            Demo Gallery
                        </button>
                    </div>
                )}

                {/* Fluent Dialog Body */}
                <div className="fluent-dialog-body">
                    {currentMode === 'upload' ? (
                        <div className="fluent-upload-content">
                            <p className="fluent-dialog-description">
                                Upload an image of a UI design, wireframe, or website screenshot to generate a wireframe based on its layout.
                            </p>

                            <div className="fluent-upload-zone-container">
                                <ImageUploadZone
                                    onImageUpload={onImageUpload}
                                    onAnalyzeImage={onAnalyzeImage}
                                    isAnalyzing={isAnalyzing}
                                    className="fluent-upload-zone"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="demo-gallery-content">
                            <DemoImageGallery
                                onSelectDemo={handleDemoSelect}
                                selectedDemo={selectedDemo}
                            />
                        </div>
                    )}
                </div>

                {/* Fluent Dialog Footer */}
                <div className="fluent-dialog-footer">
                    {currentMode === 'demo' && selectedDemo ? (
                        <div className="demo-footer-actions">
                            <button
                                className="fluent-button fluent-button-primary"
                                onClick={() => {
                                    const demoImage = selectedDemo; // You might want to pass more details here
                                    onClose();
                                }}
                            >
                                Generate Wireframe from Demo
                            </button>
                            <button
                                className="fluent-button fluent-button-secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button className="fluent-button fluent-button-secondary" onClick={onClose}>
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUploadModal;
