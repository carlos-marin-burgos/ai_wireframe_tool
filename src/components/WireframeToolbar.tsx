import React, { useState } from 'react';
import { FiSave, FiPlus, FiCode, FiDownload, FiShare2, FiMonitor, FiFigma } from 'react-icons/fi';
import './WireframeToolbar.css';

interface WireframeToolbarProps {
    onFigmaIntegration?: () => void;
    onSave?: () => void;
    onOpenLibrary?: () => void;
    onAddPages?: () => void;
    onViewHtmlCode?: () => void;
    onExportPowerPoint?: () => void;
    onPresentationMode?: () => void;
    onShareUrl?: () => void;
}

const WireframeToolbar: React.FC<WireframeToolbarProps> = ({
    onFigmaIntegration,
    onSave,
    onOpenLibrary,
    onAddPages,
    onViewHtmlCode,
    onExportPowerPoint,
    onPresentationMode,
    onShareUrl
}) => {
    const [showExportMenu, setShowExportMenu] = useState(false);
    return (
        <div className="wireframe-toolbar">
            <div className="toolbar-left">
                <h3 className="toolbar-title">Wireframe Preview</h3>
            </div>

            <div className="toolbar-right">
                <button
                    className="toolbar-btn"
                    onClick={onAddPages}
                    title="Add More Pages"
                >
                    <FiPlus />
                    Add Pages
                </button>

                <button
                    className="toolbar-btn"
                    onClick={onOpenLibrary}
                    title="Atlas Component Library"
                >
                    <img
                        src="/atlas-light.svg"
                        alt="Atlas"
                        className="atlas-logo"
                    />
                    Atlas Library
                </button>

                <div className="export-dropdown">
                    <button
                        className="toolbar-btn"
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        title="Export Options"
                    >
                        <FiDownload />
                        Export
                    </button>

                    {showExportMenu && (
                        <div className="export-menu">
                            <button
                                className="export-option"
                                onClick={() => {
                                    onExportPowerPoint?.();
                                    setShowExportMenu(false);
                                }}
                                title="Download as HTML presentation (can be converted to PowerPoint)"
                            >
                                <FiMonitor />
                                HTML Presentation
                            </button>
                            <button
                                className="export-option"
                                onClick={() => {
                                    onFigmaIntegration?.();
                                    setShowExportMenu(false);
                                }}
                            >
                                <FiFigma />
                                Figma
                            </button>
                            <button
                                className="export-option"
                                onClick={() => {
                                    onPresentationMode?.();
                                    setShowExportMenu(false);
                                }}
                            >
                                <FiMonitor />
                                Present
                            </button>
                            <button
                                className="export-option"
                                onClick={() => {
                                    onShareUrl?.();
                                    setShowExportMenu(false);
                                }}
                            >
                                <FiShare2 />
                                Share URL
                            </button>
                        </div>
                    )}
                </div>

                <button
                    className="toolbar-btn"
                    onClick={onViewHtmlCode}
                    title="View HTML Code"
                >
                    <FiCode />
                    HTML Code
                </button>

                <button
                    className="toolbar-btn"
                    onClick={onSave}
                    title="Save Wireframe"
                >
                    <FiSave />
                    Save
                </button>
            </div>
        </div>
    );
};

export default WireframeToolbar;
