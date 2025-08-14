import React, { useState, useRef, useEffect } from 'react';
import { FiUpload, FiFigma, FiCode, FiShare2, FiMonitor, FiSave, FiGrid, FiDownload } from 'react-icons/fi';
import './CompactToolbar.css';

interface CompactToolbarProps {
    onFigmaIntegration?: () => void;
    onViewHtmlCode?: () => void;
    onShareUrl?: () => void;
    onPresentationMode?: () => void;
    onDownloadWireframe?: () => void;
    onSave?: () => void;
}

const CompactToolbar: React.FC<CompactToolbarProps> = ({
    onFigmaIntegration,
    onViewHtmlCode,
    onShareUrl,
    onPresentationMode,
    onDownloadWireframe,
    onSave
}) => {
    const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

    const showTooltip = (e: React.MouseEvent<HTMLButtonElement>, text: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            text,
            x: rect.left + rect.width / 2,
            y: rect.bottom + 8
        });
    };

    const hideTooltip = () => {
        setTooltip(null);
    };

    return (
        <>
            <div className="compact-toolbar">
                <button
                    className="compact-btn"
                    onClick={onFigmaIntegration}
                    onMouseEnter={(e) => showTooltip(e, "Figma Integration")}
                    onMouseLeave={hideTooltip}
                    aria-label="Figma Integration"
                >
                    <FiFigma />
                </button>
                <button
                    className="compact-btn"
                    onClick={onViewHtmlCode}
                    onMouseEnter={(e) => showTooltip(e, "View & Import HTML")}
                    onMouseLeave={hideTooltip}
                    aria-label="View & Import HTML"
                >
                    <FiCode />
                </button>
                <button
                    className="compact-btn"
                    onClick={onShareUrl}
                    onMouseEnter={(e) => showTooltip(e, "Share URL")}
                    onMouseLeave={hideTooltip}
                    aria-label="Share URL"
                >
                    <FiShare2 />
                </button>
                <button
                    className="compact-btn"
                    onClick={onPresentationMode}
                    onMouseEnter={(e) => showTooltip(e, "Presentation Mode")}
                    onMouseLeave={hideTooltip}
                    aria-label="Presentation Mode"
                >
                    <FiMonitor />
                </button>
                <button
                    className="compact-btn"
                    onClick={onDownloadWireframe}
                    onMouseEnter={(e) => showTooltip(e, "Download Wireframe")}
                    onMouseLeave={hideTooltip}
                    aria-label="Download Wireframe"
                >
                    <FiDownload />
                </button>
            </div>

            {tooltip && (
                <div className="black-tooltip-container">
                    <div
                        className="black-tooltip"
                        ref={(el) => {
                            if (el) {
                                el.style.left = `${tooltip.x}px`;
                                el.style.top = `${tooltip.y}px`;
                            }
                        }}
                    >
                        {tooltip.text}
                    </div>
                </div>
            )}
        </>
    );
};

export default CompactToolbar;
