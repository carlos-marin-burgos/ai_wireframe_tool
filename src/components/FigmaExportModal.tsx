import React, { useState } from 'react';
import { FiX, FiUpload, FiFigma, FiLayers } from 'react-icons/fi';
import './FigmaExportModal.css';

interface FigmaExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (format: 'image' | 'pdf') => void;
    wireframeTitle?: string;
}

const FigmaExportModal: React.FC<FigmaExportModalProps> = ({
    isOpen,
    onClose,
    onExport,
    wireframeTitle = 'Wireframe'
}) => {
    const [selectedFormat, setSelectedFormat] = useState<'image' | 'pdf'>('image');

    const handleExport = () => {
        onExport(selectedFormat);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="figma-export-modal-overlay">
            <div className="figma-export-modal">
                <div className="figma-export-modal-header">
                    <div className="figma-export-modal-title">
                        <FiFigma className="figma-export-icon" />
                        <h2>Export to Figma</h2>
                    </div>
                    <button className="figma-export-modal-close" onClick={onClose} aria-label="Close Figma export modal">
                        <FiX />
                    </button>
                </div>

                <div className="figma-export-modal-content">
                    <div className="figma-export-description">
                        <p>Choose how you'd like to export <strong>"{wireframeTitle}"</strong> for import into Figma:</p>
                    </div>

                    <div className="figma-export-format-selection">
                        <label className="figma-export-format-option">
                            <input
                                type="radio"
                                name="figmaExportFormat"
                                value="image"
                                checked={selectedFormat === 'image'}
                                onChange={(e) => setSelectedFormat(e.target.value as 'image' | 'pdf')}
                            />
                            <div className="figma-format-card">
                                <FiFigma className="figma-format-icon figma-file-icon" />
                                <div className="figma-format-details">
                                    <h3>�️ PNG Image</h3>
                                    <p>Export as high-quality PNG image for direct Figma import</p>
                                    <ul>
                                        <li>✅ Direct import into Figma supported</li>
                                        <li>✅ High-resolution screenshot of wireframe</li>
                                        <li>✅ Preserves visual layout and styling</li>
                                        <li>✅ Perfect for quick design reference</li>
                                    </ul>
                                    <div className="figma-format-note">
                                        <strong>How to use:</strong> In Figma, go to File → Import and select the PNG image to add it to your design
                                    </div>
                                </div>
                            </div>
                        </label>

                        <label className="figma-export-format-option">
                            <input
                                type="radio"
                                name="figmaExportFormat"
                                value="pdf"
                                checked={selectedFormat === 'pdf'}
                                onChange={(e) => setSelectedFormat(e.target.value as 'image' | 'pdf')}
                            />
                            <div className="figma-format-card">
                                <FiLayers className="figma-format-icon figma-components-icon" />
                                <div className="figma-format-details">
                                    <h3>📄 PDF Document</h3>
                                    <p>Export as PDF for multi-page wireframe documentation</p>
                                    <ul>
                                        <li>� Direct import into Figma supported</li>
                                        <li>🔍 Vector-based scalable format</li>
                                        <li>📝 Great for comprehensive documentation</li>
                                        <li>🔧 Perfect for design handoff and review</li>
                                    </ul>
                                    <div className="figma-format-note">
                                        <strong>How to use:</strong> In Figma, go to File → Import and select the PDF to import pages as frames
                                    </div>
                                </div>
                            </div>
                        </label>
                    </div>

                    <div className="figma-export-actions">
                        <button className="figma-export-btn figma-export-btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="figma-export-btn figma-export-btn-primary" onClick={handleExport}>
                            <FiUpload />
                            Export {selectedFormat === 'image' ? 'PNG Image' : 'PDF Document'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FigmaExportModal;