import React, { useState, useRef, useEffect } from 'react';
import { FiUpload, FiFigma, FiCode, FiShare2, FiMonitor, FiSave, FiGrid, FiDownload } from 'react-icons/fi';
import './CompactToolbar.css';

interface CompactToolbarProps {
    onFigmaIntegration?: () => void;
    onOpenLibrary?: () => void;
    onViewHtmlCode?: () => void;
    onShareUrl?: () => void;
    onPresentationMode?: () => void;
    onSave?: () => void;
    onDownloadWireframe?: () => void;
}

const CompactToolbar: React.FC<CompactToolbarProps> = ({
    onFigmaIntegration,
    onOpenLibrary,
    onViewHtmlCode,
    onShareUrl,
    onPresentationMode,
    onSave,
    onDownloadWireframe
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
                >
                    <FiFigma />
                </button>
                <button
                    className="compact-btn"
                    onClick={() => {
                        console.log('🔧 DEBUG: Component Library button clicked');
                        onOpenLibrary?.();
                    }}
                    onMouseEnter={(e) => showTooltip(e, "Component Library")}
                    onMouseLeave={hideTooltip}
                >
                    <FiGrid />
                </button>
                <button
                    className="compact-btn"
                    onClick={onViewHtmlCode}
                    onMouseEnter={(e) => showTooltip(e, "View & Import HTML")}
                    onMouseLeave={hideTooltip}
                >
                    <FiCode />
                </button>
                <button
                    className="compact-btn"
                    onClick={onShareUrl}
                    onMouseEnter={(e) => showTooltip(e, "Share URL")}
                    onMouseLeave={hideTooltip}
                >
                    <FiShare2 />
                </button>
                <button
                    className="compact-btn"
                    onClick={onPresentationMode}
                    onMouseEnter={(e) => showTooltip(e, "Presentation Mode")}
                    onMouseLeave={hideTooltip}
                >
                    <FiMonitor />
                </button>
                <button
                    className="compact-btn"
                    onClick={onDownloadWireframe}
                    onMouseEnter={(e) => showTooltip(e, "Download Wireframe")}
                    onMouseLeave={hideTooltip}
                >
                    <FiDownload />
                </button>
                <button
                    className="compact-btn"
                    onClick={onSave}
                    onMouseEnter={(e) => showTooltip(e, "Save")}
                    onMouseLeave={hideTooltip}
                >
                    <FiSave />
                </button>
            </div>

            {tooltip && (
                <div
                    className="custom-tooltip"
                    style={{
                        position: 'fixed',
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: 'translateX(-50%)',
                        zIndex: 10002,
                        background: '#323130',
                        color: 'white',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }}
                >
                    {tooltip.text}
                    <div
                        style={{
                            position: 'absolute',
                            top: '-4px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            border: '4px solid transparent',
                            borderBottomColor: '#323130'
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default CompactToolbar;
