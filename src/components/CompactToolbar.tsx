import React from 'react';
import {
    Save24Regular,
    Code24Regular,
    Desktop24Regular,
    Grid24Filled,
    ShareScreenStart24Regular
} from '@fluentui/react-icons';
import './CompactToolbar.css';

interface CompactToolbarProps {
    onFigmaIntegration?: () => void;
    onSave?: () => void;
    onOpenLibrary?: () => void;
    onAddPages?: () => void;
    onViewHtmlCode?: () => void;
    onPresentationMode?: () => void;
    onImportHtml?: () => void;
    onExportPowerPoint?: () => void | Promise<void>;
    onShareUrl?: () => void | Promise<void>;
}

const CompactToolbar: React.FC<CompactToolbarProps> = ({
    onFigmaIntegration,
    onSave,
    onOpenLibrary,
    onViewHtmlCode,
    onPresentationMode,
    onImportHtml,
    onExportPowerPoint,
    onShareUrl,
}) => {
    return (
        <div className="compact-toolbar">
            <div className="compact-toolbar-buttons">
                {onImportHtml && (
                    <button
                        className="compact-btn"
                        onClick={onImportHtml}
                        title="Import HTML"
                        aria-label="Import HTML"
                    >
                        <Code24Regular />
                    </button>
                )}
                <button
                    className="compact-btn"
                    onClick={() => {
                        console.log('🔧 DEBUG: Fluent Component Library button clicked in CompactToolbar');
                        onOpenLibrary?.();
                    }}
                    title="Open Component Library"
                    aria-label="Open Component Library"
                >
                    <Grid24Filled />
                </button>

                <button
                    className="compact-btn"
                    onClick={onFigmaIntegration}
                    title="Export to Figma"
                    aria-label="Export to Figma"
                >
                    <ShareScreenStart24Regular />
                </button>

                <button
                    className="compact-btn"
                    onClick={onViewHtmlCode}
                    title="View HTML Code"
                    aria-label="View HTML Code"
                >
                    <Code24Regular />
                </button>

                <button
                    className="compact-btn"
                    onClick={onPresentationMode}
                    title="Presentation Mode"
                    aria-label="Presentation Mode"
                >
                    <Desktop24Regular />
                </button>

                <button
                    className="compact-btn"
                    onClick={onSave}
                    title="Save Wireframe"
                    aria-label="Save Wireframe"
                >
                    <Save24Regular />
                </button>

                {onExportPowerPoint && (
                    <button
                        className="compact-btn"
                        onClick={onExportPowerPoint}
                        title="Export to PowerPoint"
                        aria-label="Export to PowerPoint"
                    >
                        <ShareScreenStart24Regular />
                    </button>
                )}

                {onShareUrl && (
                    <button
                        className="compact-btn"
                        onClick={onShareUrl}
                        title="Share URL"
                        aria-label="Share URL"
                    >
                        <ShareScreenStart24Regular />
                    </button>
                )}
            </div>
        </div>
    );
};

export default CompactToolbar;
