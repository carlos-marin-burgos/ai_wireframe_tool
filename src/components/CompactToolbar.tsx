import React, { useState } from 'react';
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
    const [showExportMenu, setShowExportMenu] = useState(false);

    return (
        <div className="compact-toolbar">
            <div className="compact-toolbar-buttons">
                <button
                    className="compact-btn"
                    onClick={onImportHtml}
                    title="Import HTML"
                    aria-label="Import HTML"
                >
                    <FiUpload />
                </button>

                <button
                    className="compact-btn"
                    onClick={onAddPages}
                    title="Add More Pages"
                    aria-label="Add More Pages"
                >
                    <FiPlus />
                </button>

                <button
                    className="compact-btn"
                    onClick={() => {
                        console.log('🔧 DEBUG: Fluent Component Library button clicked in CompactToolbar');
                        onOpenLibrary?.();
                    }}
                    title="Open Component Library"
                    aria-label="Open Component Library"
                >
                    <TbBoxModel2 />
                </button>

                <div className="compact-export-dropdown">
                    <button
                        className="compact-btn"
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        title="Export Options"
                        aria-label="Export Options"
                    >
                        <FiDownload />
                    </button>

                    {showExportMenu && (
                        <div className="compact-export-menu">
                            <button
                                className="compact-export-option"
                                onClick={() => {
                                    onExportPowerPoint?.();
                                    setShowExportMenu(false);
                                }}
                                title="Export as HTML Presentation"
                                aria-label="Export as HTML Presentation"
                            >
                                <FiMonitor />
                                <span className="compact-export-label">HTML Presentation</span>
                            </button>
                            <button
                                className="compact-export-option"
                                onClick={() => {
                                    onFigmaIntegration?.();
                                    setShowExportMenu(false);
                                }}
                                title="Export to Figma"
                                aria-label="Export to Figma"
                            >
                                <FiFigma />
                                <span className="compact-export-label">Figma</span>
                            </button>
                            <button
                                className="compact-export-option"
                                onClick={() => {
                                    onPresentationMode?.();
                                    setShowExportMenu(false);
                                }}
                                title="Presentation Mode"
                                aria-label="Presentation Mode"
                            >
                                <FiMonitor />
                                <span className="compact-export-label">Present</span>
                            </button>
                        </div>
                    )}
                </div>

                <button
                    className="compact-btn"
                    onClick={onViewHtmlCode}
                    title="View HTML Code"
                    aria-label="View HTML Code"
                >
                    <FiCode />
                </button>

                <button
                    className="compact-btn"
                    onClick={onShareUrl}
                    title="Share URL"
                    aria-label="Share URL"
                >
                    <FiShare2 />
                </button>

                <button
                    className="compact-btn"
                    onClick={onPresentationMode}
                    title="Presentation Mode"
                    aria-label="Presentation Mode"
                >
                    <FiMonitor />
                </button>

                <button
                    className="compact-btn compact-btn-primary"
                    onClick={onSave}
                    title="Save Wireframe"
                    aria-label="Save Wireframe"
                >
                    <FiSave />
                </button>
            </div>
        </div>
    );
};

export default CompactToolbar;
