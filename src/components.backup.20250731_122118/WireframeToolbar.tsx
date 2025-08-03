import React from 'react';
import { FiSave, FiPlus, FiCode } from 'react-icons/fi';
import { FiFigma } from 'react-icons/fi';
import './WireframeToolbar.css';

interface WireframeToolbarProps {
    onFigmaIntegration?: () => void;
    onSave?: () => void;
    onOpenLibrary?: () => void;
    onAddPages?: () => void;
    onViewHtmlCode?: () => void;
}

const WireframeToolbar: React.FC<WireframeToolbarProps> = ({
    onFigmaIntegration,
    onSave,
    onOpenLibrary,
    onAddPages,
    onViewHtmlCode
}) => {
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

                <button
                    className="toolbar-btn"
                    onClick={onFigmaIntegration}
                    title="Figma Integration"
                >
                    <FiFigma />
                    Figma
                </button>

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
