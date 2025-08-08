import React from 'react';
import {
    FiSave,
    FiCode,
    FiDownload,
    FiShare2,
    FiMonitor,
    FiFigma
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
    onExportWireframe?: () => void;
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
    return (
        <div className="compact-toolbar">
            <div className="compact-toolbar-buttons">
                <button
                    className="compact-btn"
                    onClick={onImportHtml}
                    title="Import HTML"
                    aria-label="Import HTML"
                >
                    <FiDownload />
                </button>

                <button
                    className="compact-btn"
                    onClick={onFigmaIntegration}
                    title="Figma Integration"
                    aria-label="Figma Integration"
                >
                    <FiFigma />
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
