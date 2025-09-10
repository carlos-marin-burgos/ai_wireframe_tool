import React from 'react';
import { FiX, FiImage, FiUpload } from 'react-icons/fi';
import ImageUploadZone from './ImageUploadZone';
import './ImageUploadModal.css';

interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImageUpload: (file: File) => void;
    onAnalyzeImage: (imageUrl: string, fileName: string) => void;
    isAnalyzing?: boolean;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
    isOpen,
    onClose,
    onImageUpload,
    onAnalyzeImage,
    isAnalyzing = false
}) => {
    if (!isOpen) return null;

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

                {/* Fluent Dialog Body */}
                <div className="fluent-dialog-body">
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
                </div>

                {/* Fluent Dialog Footer */}
                <div className="fluent-dialog-footer">
                    <button className="fluent-button fluent-button-secondary" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageUploadModal;
