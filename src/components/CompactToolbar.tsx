import React from 'react';
import { FiUpload, FiFigma, FiCode, FiShare2, FiMonitor, FiSave } from 'react-icons/fi';
import { Fluent24Regular } from '@fluentui/react-icons';
import './CompactToolbar.css';

interface CompactToolbarProps {
    onImportHtml?: () => void;
    onFigmaIntegration?: () => void;
    onOpenLibrary?: () => void;
    onViewHtmlCode?: () => void;
    onShareUrl?: () => void;
    onPresentationMode?: () => void;
    onSave?: () => void;
}

const CompactToolbar: React.FC<CompactToolbarProps> = ({
    onImportHtml,
    onFigmaIntegration,
    onOpenLibrary,
    onViewHtmlCode,
    onShareUrl,
    onPresentationMode,
    onSave
}) => {
    return (
        <div className="compact-toolbar">
            <button className="compact-btn" onClick={onImportHtml} title="Import HTML">
                <FiUpload />
            </button>
            <button className="compact-btn" onClick={onFigmaIntegration} title="Figma Integration">
                <FiFigma />
            </button>
            <button className="compact-btn" onClick={() => {
                console.log('🔧 DEBUG: Component Library button clicked');
                onOpenLibrary?.();
            }} title="Component Library">
                <Fluent24Regular />
            </button>
            <button className="compact-btn" onClick={onViewHtmlCode} title="View HTML">
                <FiCode />
            </button>
            <button className="compact-btn" onClick={onShareUrl} title="Share URL">
                <FiShare2 />
            </button>
            <button className="compact-btn" onClick={onPresentationMode} title="Presentation Mode">
                <FiMonitor />
            </button>
            <button className="compact-btn" onClick={onSave} title="Save">
                <FiSave />
            </button>
        </div>
    );
};

export default CompactToolbar;
