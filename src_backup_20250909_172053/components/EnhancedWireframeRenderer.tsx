import React, { useState, useCallback, useEffect } from 'react';
import InteractiveWireframe from './InteractiveWireframe';
import RearrangeableWireframe from './RearrangeableWireframe';
import ComponentLibrary from './ComponentLibrary';
import { FiMove, FiGrid, FiSettings, FiPlus } from 'react-icons/fi';
import './EnhancedWireframeRenderer.css';

interface EnhancedWireframeRendererProps {
    htmlContent: string;
    onUpdateContent?: (newContent: string) => void;
    componentLibraryItems?: any[];
    enableRearrangeable?: boolean;
    showComponentLibrary?: boolean;
}

type ViewMode = 'preview' | 'rearrange' | 'split';

const EnhancedWireframeRenderer: React.FC<EnhancedWireframeRendererProps> = ({
    htmlContent,
    onUpdateContent,
    componentLibraryItems = [],
    enableRearrangeable = true,
    showComponentLibrary = true
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('preview');
    const [showLibrary, setShowLibrary] = useState(false);
    const [gridSize, setGridSize] = useState(12);
    const [enableSnapping, setEnableSnapping] = useState(true);
    const [enableResizing, setEnableResizing] = useState(true);

    const handleContentUpdate = useCallback((newContent: string) => {
        onUpdateContent?.(newContent);
    }, [onUpdateContent]);

    const handleAddComponent = useCallback((component: any) => {
        const componentHtml = component.html || component.content || `<div>${component.name}</div>`;
        const wrappedHtml = /col-(?:sm|md|lg|xl)-\d+/.test(componentHtml)
            ? componentHtml
            : `<div class="col-sm-${component.defaultWidth || 4}">${componentHtml}</div>`;

        // Ensure we target a top-level row, not a nested block
        const current = htmlContent || '<div class="container"><div class="row"></div></div>';

        // Append to the last top-level row; if none, create one.
        const hasRow = /<div class="row">[\s\S]*?<\/div>/m.test(current);
        let updatedContent = current;
        if (hasRow) {
            // Replace only the last top-level row by capturing all and injecting at the end of the last one
            updatedContent = current.replace(/(<div class=\"row\">[\s\S]*?<\/div>)(?![\s\S]*<div class=\"row\">)/m, (match) => {
                return match.replace(/<\/div>\s*$/, `${wrappedHtml}\n</div>`);
            });
        } else {
            updatedContent = `
                <div class="container">
                    <div class="row">
                        ${wrappedHtml}
                    </div>
                </div>
            `;
        }

        handleContentUpdate(updatedContent);
        setShowLibrary(false);
    }, [htmlContent, handleContentUpdate]);

    // Sync external toggle with internal view mode
    useEffect(() => {
        if (enableRearrangeable) {
            setViewMode('rearrange');
        } else {
            setViewMode('preview');
        }
    }, [enableRearrangeable]);

    const ViewModeToggle = () => (
        <div className="view-mode-toggle">
            <button
                className={`mode-btn ${viewMode === 'preview' ? 'active' : ''}`}
                onClick={() => setViewMode('preview')}
                title="Preview Mode"
            >
                <FiSettings /> Preview
            </button>
            {enableRearrangeable && (
                <button
                    className={`mode-btn ${viewMode === 'rearrange' ? 'active' : ''}`}
                    onClick={() => setViewMode('rearrange')}
                    title="Rearrangeable Mode"
                >
                    <FiMove /> Rearrange
                </button>
            )}
            <button
                className={`mode-btn ${viewMode === 'split' ? 'active' : ''}`}
                onClick={() => setViewMode('split')}
                title="Split View"
            >
                <FiGrid /> Split View
            </button>
        </div>
    );

    const ControlPanel = () => (
        <div className="control-panel">
            <div className="control-group">
                <label>Grid Size:</label>
                <select
                    value={gridSize}
                    onChange={(e) => setGridSize(Number(e.target.value))}
                    className="control-select"
                    title="Select grid size"
                    aria-label="Grid size selector"
                >
                    <option value={8}>8 Columns</option>
                    <option value={12}>12 Columns</option>
                    <option value={16}>16 Columns</option>
                </select>
            </div>

            <div className="control-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={enableSnapping}
                        onChange={(e) => setEnableSnapping(e.target.checked)}
                    />
                    Snap to Grid
                </label>
            </div>

            <div className="control-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={enableResizing}
                        onChange={(e) => setEnableResizing(e.target.checked)}
                    />
                    Enable Resizing
                </label>
            </div>

            {showComponentLibrary && (
                <button
                    className="add-component-btn"
                    onClick={() => setShowLibrary(!showLibrary)}
                    title="Add Components"
                >
                    <FiPlus /> Add Components
                </button>
            )}
        </div>
    );

    const renderWireframe = () => {
        switch (viewMode) {
            case 'rearrange':
                return (
                    <RearrangeableWireframe
                        htmlContent={htmlContent}
                        onUpdateContent={handleContentUpdate}
                        componentLibraryItems={componentLibraryItems}
                        gridSize={gridSize}
                        enableResizing={enableResizing}
                        enableSnapping={enableSnapping}
                    />
                );

            case 'split':
                return (
                    <div className="split-view">
                        <div className="split-pane split-preview">
                            <h4>Preview</h4>
                            <InteractiveWireframe
                                htmlContent={htmlContent}
                                onUpdateContent={handleContentUpdate}
                            />
                        </div>
                        <div className="split-pane split-rearrange">
                            <h4>Rearrange</h4>
                            <RearrangeableWireframe
                                htmlContent={htmlContent}
                                onUpdateContent={handleContentUpdate}
                                componentLibraryItems={componentLibraryItems}
                                gridSize={gridSize}
                                enableResizing={enableResizing}
                                enableSnapping={enableSnapping}
                            />
                        </div>
                    </div>
                );

            default:
                return (
                    <InteractiveWireframe
                        htmlContent={htmlContent}
                        onUpdateContent={handleContentUpdate}
                    />
                );
        }
    };

    return (
        <div className="enhanced-wireframe-renderer">
            {/* Header Controls */}
            <div className="renderer-header">
                <ViewModeToggle />
                {viewMode === 'rearrange' && <ControlPanel />}
            </div>

            {/* Main Content Area */}
            <div className="renderer-content">
                {renderWireframe()}
            </div>

            {/* Component Library Modal */}
            {showLibrary && showComponentLibrary && (
                <div className="component-library-overlay">
                    <div className="library-modal">
                        <div className="library-header">
                            <h3>Add Components</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowLibrary(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="library-content">
                            <ComponentLibrary
                                isOpen={true}
                                onClose={() => setShowLibrary(false)}
                                onAddComponent={handleAddComponent}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Status Bar */}
            <div className="renderer-status">
                <span className="status-item">
                    Mode: <strong>{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</strong>
                </span>
                {viewMode === 'rearrange' && (
                    <>
                        <span className="status-item">
                            Grid: <strong>{gridSize} columns</strong>
                        </span>
                        <span className="status-item">
                            Snap: <strong>{enableSnapping ? 'On' : 'Off'}</strong>
                        </span>
                        <span className="status-item">
                            Resize: <strong>{enableResizing ? 'On' : 'Off'}</strong>
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export default EnhancedWireframeRenderer;
