import React from 'react';
import { FiX, FiImage } from 'react-icons/fi';
import ImageUploadZone from './ImageUploadZone';
import './FluentImageUploadModal.css';

interface FluentImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImageUpload: (file: File) => void;
    onAnalyzeImage: (imageUrl: string, fileName: string) => void;
    onCancel?: () => void;
    isAnalyzing?: boolean;
}

const FluentImageUploadModal: React.FC<FluentImageUploadModalProps> = ({
    isOpen,
    onClose,
    onImageUpload,
    onAnalyzeImage,
    onCancel,
    isAnalyzing = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fluent-modal-backdrop" onClick={onClose}>
            <div className="fluent-dialog fluent-upload-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="upload-dialog-title">
                {/* Dialog Header */}
                <div className="fluent-dialog-header">
                    <h2 id="upload-dialog-title" className="fluent-dialog-title">
                        <FiImage className="fluent-icon" />
                        Upload Image to Wireframe
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
                    <div className="fluent-upload-content">
                        <p className="fluent-dialog-description">
                            Upload an image of a UI design, wireframe, or website screenshot to generate a wireframe based on its layout.
                        </p>

                        {/* Processing Time Information */}
                        <div className="fluent-timing-info">
                            <div className="timing-info-content">
                                ⏱️ <strong>Processing time:</strong> Typically 3-4 minutes for image analysis and wireframe generation
                            </div>
                        </div>

                        <div className="fluent-upload-zone-container">
                            <ImageUploadZone
                                onImageUpload={onImageUpload}
                                onAnalyzeImage={onAnalyzeImage}
                                isAnalyzing={isAnalyzing}
                                className="fluent-upload-zone"
                            />
                        </div>

                        {isAnalyzing && (
                            <div className="fluent-analyzing-status">
                                <div className="fluent-spinner" />
                                <div className="analyzing-text">
                                    <span>Analyzing image and generating wireframe...</span>
                                    <small className="analyzing-subtext">
                                        This may take 3-4 minutes. You can cancel if needed.
                                    </small>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dialog Footer */}
                <div className="fluent-dialog-footer">
                    {isAnalyzing ? (
                        <button
                            onClick={onCancel || onClose}
                            className="fluent-button fluent-button-danger"
                        >
                            Cancel Processing
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="fluent-button fluent-button-secondary"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FluentImageUploadModal;
