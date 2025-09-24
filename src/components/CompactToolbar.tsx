import React, { useState, useEffect } from 'react';
import {
    FiSave,
    FiPlus,
    FiCode,
    FiDownload,
    FiShare2,
    FiMonitor,
    FiFigma,
    FiUpload
} from 'react-icons/fi';
import { TbBoxModel2 } from 'react-icons/tb';
import './CompactToolbar.css';

interface CompactToolbarProps {
    onFigmaIntegration?: () => void;
    onSave?: () => void;
    onOpenLibrary?: () => void;
    onAddPages?: () => void;
    onViewHtmlCode?: () => void;
    onExportPowerPoint?: () => void;
    onPresentationMode?: () => void;
    onShareUrl?: () => void;
    onImportHtml?: () => void;
}

const CompactToolbar: React.FC<CompactToolbarProps> = ({
    onFigmaIntegration,
    onSave,
    onOpenLibrary,
    onAddPages,
    onViewHtmlCode,
    onExportPowerPoint,
    onPresentationMode,
    onShareUrl,
    onImportHtml
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

    useEffect(() => {
        const handleMouseDown = () => {
            hideTooltip();
        };

        document.addEventListener('mousedown', handleMouseDown);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

    return (
        <>
            <div className="compact-toolbar">
                <div className="toolbar-section">
                    <button
                        className="compact-btn"
                        onClick={onSave}
                        onMouseEnter={(e) => showTooltip(e, "Save Wireframe")}
                        onMouseLeave={hideTooltip}
                        aria-label="Save Wireframe"
                        title="Save Wireframe"
                    >
                        <FiSave />
                    </button>

                    <button
                        className="compact-btn"
                        onClick={onAddPages}
                        onMouseEnter={(e) => showTooltip(e, "Add Pages")}
                        onMouseLeave={hideTooltip}
                        aria-label="Add Pages"
                        title="Add Pages"
                    >
                        <FiPlus />
                    </button>

                    <button
                        className="compact-btn"
                        onClick={onOpenLibrary}
                        onMouseEnter={(e) => showTooltip(e, "Component Library")}
                        onMouseLeave={hideTooltip}
                        aria-label="Component Library"
                        title="Component Library"
                    >
                        <TbBoxModel2 />
                    </button>
                </div>

                <div className="toolbar-section">
                    <button
                        className="compact-btn"
                        onClick={onViewHtmlCode}
                        onMouseEnter={(e) => showTooltip(e, "View HTML Code")}
                        onMouseLeave={hideTooltip}
                        aria-label="View HTML Code"
                        title="View HTML Code"
                    >
                        <FiCode />
                    </button>

                    <button
                        className="compact-btn"
                        onClick={onFigmaIntegration}
                        onMouseEnter={(e) => showTooltip(e, "Figma Integration")}
                        onMouseLeave={hideTooltip}
                        aria-label="Figma Integration"
                        title="Figma Integration"
                    >
                        <FiFigma />
                    </button>

                    <button
                        className="compact-btn"
                        onClick={onImportHtml}
                        onMouseEnter={(e) => showTooltip(e, "Import HTML")}
                        onMouseLeave={hideTooltip}
                        aria-label="Import HTML"
                        title="Import HTML"
                    >
                        <FiUpload />
                    </button>
                </div>

                <div className="toolbar-section">
                    <button
                        className="compact-btn"
                        onClick={onExportPowerPoint}
                        onMouseEnter={(e) => showTooltip(e, "Export to PowerPoint")}
                        onMouseLeave={hideTooltip}
                        aria-label="Export to PowerPoint"
                        title="Export to PowerPoint"
                    >
                        <FiDownload />
                    </button>

                    <button
                        className="compact-btn"
                        onClick={onShareUrl}
                        onMouseEnter={(e) => showTooltip(e, "Share URL")}
                        onMouseLeave={hideTooltip}
                        aria-label="Share URL"
                        title="Share URL"
                    >
                        <FiShare2 />
                    </button>

                    <button
                        className="compact-btn"
                        onClick={onPresentationMode}
                        onMouseEnter={(e) => showTooltip(e, "Presentation Mode")}
                        onMouseLeave={hideTooltip}
                        aria-label="Presentation Mode"
                        title="Presentation Mode"
                    >
                        <FiMonitor />
                    </button>
                </div>
            </div>

            {tooltip && (
                <div
                    className="compact-toolbar-tooltip"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: 'translateX(-50%)',
                        position: 'fixed',
                        zIndex: 1000,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {tooltip.text}
                </div>
            )}
        </>
    );
};

export default CompactToolbar;
