import React, { useCallback, useState } from 'react';
import { FiImage, FiUpload, FiX, FiLoader } from 'react-icons/fi';
import './ImageUploadZone.css';

interface ImageUploadZoneProps {
    onImageUpload: (file: File) => void;
    onAnalyzeImage?: (imageUrl: string, fileName: string) => void;
    isAnalyzing?: boolean;
    className?: string;
}

const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
    onImageUpload,
    onAnalyzeImage,
    isAnalyzing = false,
    className = ''
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        const imageFile = files.find(file => file.type.startsWith('image/'));

        if (imageFile) {
            handleImageFile(imageFile);
        }
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleImageFile(file);
        }
    }, []);

    const handleImageFile = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            setPreview(imageUrl);
            setFileName(file.name);
            onImageUpload(file);

            // 🔥 AUTOMATICALLY trigger analysis when image is uploaded
            if (onAnalyzeImage) {
                onAnalyzeImage(imageUrl, file.name);
            }
        };
        reader.readAsDataURL(file);
    }, [onImageUpload, onAnalyzeImage]);

    const handleAnalyze = useCallback(() => {
        if (preview && fileName && onAnalyzeImage) {
            onAnalyzeImage(preview, fileName);
        }
    }, [preview, fileName, onAnalyzeImage]);

    const handleClear = useCallback(() => {
        setPreview(null);
        setFileName('');
    }, []);

    if (preview) {
        return (
            <div className={`image-preview-zone ${className}`}>
                <div className="preview-header">
                    <span className="preview-title">
                        <FiImage />
                        {fileName}
                    </span>
                    <button
                        className="clear-btn"
                        onClick={handleClear}
                        aria-label="Clear image"
                    >
                        <FiX />
                    </button>
                </div>

                <div className="preview-image-container">
                    <img
                        src={preview}
                        alt="Upload preview"
                        className="preview-image"
                    />
                </div>

                <div className="preview-actions">
                    <button
                        className="analyze-btn primary"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        aria-label="Analyze image and generate wireframe"
                    >
                        {isAnalyzing ? (
                            <>
                                <FiLoader className="spinning" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <FiUpload />
                                ↻ Re-analyze Image
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`image-upload-zone ${isDragOver ? 'drag-over' : ''} ${className}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="upload-content">
                <FiImage className="upload-icon" />
                <h3>Drop UI image here</h3>
                <p>Upload a screenshot, mockup, or sketch to generate a wireframe</p>

                <label className="upload-btn">
                    <FiUpload />
                    Choose Image
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden-input"
                    />
                </label>

                <div className="supported-formats">
                    <small>Supports PNG, JPG, WebP, SVG</small>
                </div>
            </div>
        </div>
    );
};

export default ImageUploadZone;
