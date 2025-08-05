import React, { useState } from 'react';
import { FiX, FiImage, FiZap } from 'react-icons/fi';
import ImageUploadZone from './ImageUploadZone';
import DemoImageSelector from './DemoImageSelector';
import './ImageUploadModal.css';

interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImageUpload: (file: File) => void;
    onAnalyzeImage: (imageUrl: string, fileName: string) => void;
    onDemoGenerate: (imagePath: string, description: string) => void;
    isAnalyzing?: boolean;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
    isOpen,
    onClose,
    onImageUpload,
    onAnalyzeImage,
    onDemoGenerate,
    isAnalyzing = false
}) => {
    const [activeTab, setActiveTab] = useState<'upload' | 'demo'>('upload');

    if (!isOpen) return null;

    return (
        <div className="image-upload-modal-overlay" onClick={onClose}>
            <div className="image-upload-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Image to Wireframe</h2>
                    <button className="close-btn" onClick={onClose} title="Close modal">
                        <FiX />
                    </button>
                </div>

                <div className="modal-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        <FiImage />
                        Upload Image
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'demo' ? 'active' : ''}`}
                        onClick={() => setActiveTab('demo')}
                    >
                        <FiZap />
                        Try Demo Examples
                    </button>
                </div>

                <div className="modal-content">
                    {activeTab === 'upload' ? (
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
                    ) : (
                        <div className="demo-tab">
                            <p className="tab-description">
                                Try these instant examples to see how images are converted to wireframes.
                            </p>
                            <DemoImageSelector
                                onDemoGenerate={onDemoGenerate}
                                isGenerating={isAnalyzing}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUploadModal;
