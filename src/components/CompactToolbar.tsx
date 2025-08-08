import React, { useState } from 'react';
import {
    FiSave,
    FiPlus,
    FiCode,
    FiDownload,
    FiShare2,
    FiMonitor,
    FiFigma,
    FiUpload,
    FiFileText
} from 'react-icons/fi';
import { TbBoxModel2 } from 'react-icons/tb';
import './CompactToolbar.css';

interface CompactToolbarProps {
    onFigmaIntegration?: () => void;
    onExportModal?: () => void;
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
    onExportModal,
    onSave,
    onOpenLibrary,
    onAddPages,
    onViewHtmlCode,
    onExportPowerPoint,
    onPresentationMode,
    onShareUrl,
    onImportHtml
}) => {
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
                    onClick={onFigmaIntegration}
                    title="Import from Figma"
                    aria-label="Import from Figma"
                >
                    <FiFigma />
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

                <button
                    className="compact-btn"
                    onClick={onExportModal}
                    title="Export Wireframe"
                    aria-label="Export Wireframe"
                >
                    <FiFileText />
                </button>

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
                    onClick={onPresentationMode}
                    title="Presentation Mode"
                    aria-label="Presentation Mode"
                >
                    <FiMonitor />
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
