import React, { useState } from 'react';
import { getFluentIcon } from '../utils/fluentIconSvgs';
import './WireframeToolbar.css';

// Cache bust: Force browser refresh - v2.0

interface WireframeToolbarProps {
    onFigmaIntegration?: () => void;
    onSave?: () => void;
    onOpenLibrary?: () => void;
    onViewHtmlCode?: () => void;
    onPresentationMode?: () => void;
    onShareUrl?: () => void;
    onImportHtml?: () => void;
}

const WireframeToolbar: React.FC<WireframeToolbarProps> = ({
    onFigmaIntegration,
    onSave,
    onOpenLibrary,
    onViewHtmlCode,
    onPresentationMode,
    onShareUrl,
    onImportHtml
}) => {
    // Helper component for Fluent icons
    const FluentIcon: React.FC<{ name: string; className?: string }> = ({ name, className = "" }) => {
        console.log('🔧 FluentIcon rendering:', name, getFluentIcon(name) ? '✅ Found' : '❌ Missing');
        return (
            <span
                className={`fluent-icon ${className}`}
                dangerouslySetInnerHTML={{ __html: getFluentIcon(name) }}
            />
        );
    };
    return (
        <div className="wireframe-toolbar">
            <div className="toolbar-left">
                <h3 className="toolbar-title">Wireframe Preview</h3>
            </div>

            <div className="toolbar-right">
                <button
                    className="toolbar-btn"
                    onClick={() => {
                        console.log('🔧 DEBUG: Fluent Component Library button clicked in WireframeToolbar');
                        onOpenLibrary?.();
                    }}
                    title="Fluent Component Library"
                >
                    <FluentIcon name="library" />
                    Fluent Library
                </button>

                <button
                    className="toolbar-btn"
                    onClick={onFigmaIntegration}
                    title="Figma Integration"
                >
                    <FluentIcon name="design_ideas" />
                    Figma
                </button>

                <button
                    className="toolbar-btn"
                    onClick={onPresentationMode}
                    title="Presentation Mode"
                >
                    <FluentIcon name="presentation" />
                    Present
                </button>

                <button
                    className="toolbar-btn"
                    onClick={() => {
                        // Show dropdown for HTML Code and Import options
                        const choice = window.confirm("Choose action:\nOK = View HTML Code\nCancel = Import HTML");
                        if (choice) {
                            onViewHtmlCode?.();
                        } else {
                            onImportHtml?.();
                        }
                    }}
                    title="HTML Code / Import"
                >
                    <FluentIcon name="code" />
                    HTML Code
                </button>

                <button
                    className="toolbar-btn"
                    onClick={onShareUrl}
                    title="Share URL"
                >
                    <FluentIcon name="share" />
                    Share URL
                </button>

                <button
                    className="toolbar-btn"
                    onClick={onSave}
                    title="Save Wireframe"
                >
                    <FluentIcon name="save" />
                    Save
                </button>
            </div>
        </div>
    );
};

export default WireframeToolbar;
