import React, { useState } from 'react';
import { FiX, FiDownload, FiFileText, FiCode } from 'react-icons/fi';
import './DownloadModal.css';

interface DownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDownload: (format: 'html' | 'json') => void;
    wireframeTitle?: string;
}

const DownloadModal: React.FC<DownloadModalProps> = ({
    isOpen,
    onClose,
    onDownload,
    wireframeTitle = 'Wireframe'
}) => {
    const [selectedFormat, setSelectedFormat] = useState<'html' | 'json'>('html');

    const handleDownload = () => {
        onDownload(selectedFormat);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="download-modal-overlay">
            <div className="download-modal">
                <div className="download-modal-header">
                    <div className="download-modal-title">
                        <FiDownload className="download-icon" />
                        <h2>Download Wireframe</h2>
                    </div>
                    <button className="download-modal-close" onClick={onClose} aria-label="Close download modal">
                        <FiX />
                    </button>
                </div>

                <div className="download-modal-content">
                    <div className="download-description">
                        <p>Choose how you'd like to download your wireframe: <strong>"{wireframeTitle}"</strong></p>
                    </div>

                    <div className="download-format-selection">
                        <label className="download-format-option">
                            <input
                                type="radio"
                                name="downloadFormat"
                                value="html"
                                checked={selectedFormat === 'html'}
                                onChange={(e) => setSelectedFormat(e.target.value as 'html' | 'json')}
                            />
                            <div className="format-card">
                                <FiFileText className="format-icon" />
                                <div className="format-details">
                                    <h3>📄 Complete HTML File</h3>
                                    <p>Self-contained webpage ready for sharing or hosting</p>
                                    <ul>
                                        <li>✅ Open in any web browser</li>
                                        <li>✅ Share with clients or stakeholders</li>
                                        <li>✅ Perfect for presentations</li>
                                        <li>✅ Host on websites or servers</li>
                                    </ul>
                                </div>
                            </div>
                        </label>

                        <label className="download-format-option">
                            <input
                                type="radio"
                                name="downloadFormat"
                                value="json"
                                checked={selectedFormat === 'json'}
                                onChange={(e) => setSelectedFormat(e.target.value as 'html' | 'json')}
                            />
                            <div className="format-card">
                                <FiCode className="format-icon" />
                                <div className="format-details">
                                    <h3>💾 JSON Data File</h3>
                                    <p>Raw wireframe data for developers or backup purposes</p>
                                    <ul>
                                        <li>📄 Complete HTML structure</li>
                                        <li>🎨 Design metadata and settings</li>
                                        <li>⏰ Export timestamp</li>
                                        <li>📝 Project description and details</li>
                                    </ul>
                                </div>
                            </div>
                        </label>
                    </div>

                    <div className="download-actions">
                        <button className="download-btn download-btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="download-btn download-btn-primary" onClick={handleDownload}>
                            <FiDownload />
                            Download {selectedFormat === 'html' ? 'HTML' : 'JSON'} File
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DownloadModal;
