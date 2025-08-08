import React, { useState } from 'react';
import { getFluentIcon } from '../utils/fluentIconSvgs';
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

    // Helper component for Fluent icons
    const FluentIcon: React.FC<{ name: string; className?: string }> = ({ name, className = "" }) => (
        <span 
            className={`fluent-icon ${className}`}
            dangerouslySetInnerHTML={{ __html: getFluentIcon(name) }}
        />
    );
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
                    <FluentIcon name="add" />
                    Add Pages
                </button>

                <button
                    className="toolbar-btn"
                    onClick={() => {
                        console.log('🔧 DEBUG: Fluent Component Library button clicked in WireframeToolbar');
                        onOpenLibrary?.();
                    }}
                    title="Fluent Component Library"
                >
                    <FluentIcon name="grid" />
                    Fluent Library
                </button>

                <div className="export-dropdown">
                    <button
                        className="toolbar-btn"
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        title="Export Options"
                    >
                        <FluentIcon name="download" />
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
                                <FluentIcon name="preview" />
                                HTML Presentation
                            </button>
                            <button
                                className="export-option"
                                onClick={() => {
                                    onFigmaIntegration?.();
                                    setShowExportMenu(false);
                                }}
                            >
                                <FluentIcon name="design_ideas" />
                                Figma
                            </button>
                            <button
                                className="export-option"
                                onClick={() => {
                                    onPresentationMode?.();
                                    setShowExportMenu(false);
                                }}
                            >
                                <FluentIcon name="presentation" />
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
