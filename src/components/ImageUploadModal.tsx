import React from 'react';
import { FiX, FiImage } from 'react-icons/fi';
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
        <div className="image-upload-modal-overlay" onClick={onClose}>
            <div className="image-upload-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Upload Image to Wireframe</h2>
                    <button className="close-btn" onClick={onClose} title="Close modal">
                        <FiX />
                    </button>
                </div>

                <div className="modal-content">
                    <div className="upload-tab">
                        <p className="tab-description">
                            Upload an image of a UI design, wireframe, or website screenshot to generate a wireframe based on its layout.
                        </p>
                        <ImageUploadZone
                            onImageUpload={onImageUpload}
                            onAnalyzeImage={onAnalyzeImage}
                            isAnalyzing={isAnalyzing}
                            className="modal-upload-zone"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageUploadModal;
