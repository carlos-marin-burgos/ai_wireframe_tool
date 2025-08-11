import React, { useState } from 'react';
import {
    FiGrid,
    FiMove,
    FiRotateCw,
    FiCopy,
    FiTrash2,
    FiLayers,
    FiAlignCenter,
    FiAlignLeft,
    FiAlignRight,
    FiZoomIn,
    FiZoomOut,
    FiMaximize2,
    FiSettings
} from 'react-icons/fi';
import './DragToolbar.css';

interface DragToolbarProps {
    selectedElement?: HTMLElement | null;
    onAction: (action: string, data?: any) => void;
    enableGrid: boolean;
    gridSize: number;
    zoom: number;
    onToggleGrid: () => void;
    onGridSizeChange: (size: number) => void;
    onZoomChange: (zoom: number) => void;
}

const DragToolbar: React.FC<DragToolbarProps> = ({
    selectedElement,
    onAction,
    enableGrid,
    gridSize,
    zoom,
    onToggleGrid,
    onGridSizeChange,
    onZoomChange
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showGridControls, setShowGridControls] = useState(false);
    const [showAlignControls, setShowAlignControls] = useState(false);

    const handleAction = (action: string, data?: any) => {
        onAction(action, data);
    };

    const formatZoom = (value: number) => `${Math.round(value * 100)}%`;

    return (
        <div className={`drag-toolbar ${isExpanded ? 'expanded' : ''} ${selectedElement ? 'has-selection' : ''}`}>
            {/* Main toolbar toggle */}
            <button
                className="toolbar-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse toolbar' : 'Expand toolbar'}
            >
                <FiSettings />
                <span>Drag Tools</span>
            </button>

            {/* Expanded toolbar content */}
            {isExpanded && (
                <div className="toolbar-content">
                    {/* Grid Controls Section */}
                    <div className="toolbar-section">
                        <div className="section-header">
                            <FiGrid />
                            <span>Grid</span>
                            <button
                                className={`toggle-btn ${enableGrid ? 'active' : ''}`}
                                onClick={onToggleGrid}
                                title={enableGrid ? 'Disable grid' : 'Enable grid'}
                            >
                                {enableGrid ? 'ON' : 'OFF'}
                            </button>
                        </div>

                        {enableGrid && (
                            <div className="grid-controls">
                                <label>Grid Size:</label>
                                <input
                                    type="range"
                                    min="4"
                                    max="32"
                                    step="4"
                                    value={gridSize}
                                    onChange={(e) => onGridSizeChange(Number(e.target.value))}
                                    className="grid-slider"
                                />
                                <span className="grid-value">{gridSize}px</span>
                            </div>
                        )}
                    </div>

                    {/* Zoom Controls Section */}
                    <div className="toolbar-section">
                        <div className="section-header">
                            <FiZoomIn />
                            <span>Zoom</span>
                            <span className="zoom-value">{formatZoom(zoom)}</span>
                        </div>

                        <div className="zoom-controls">
                            <button
                                className="zoom-btn"
                                onClick={() => onZoomChange(Math.max(0.25, zoom - 0.25))}
                                disabled={zoom <= 0.25}
                                title="Zoom out"
                            >
                                <FiZoomOut />
                            </button>

                            <input
                                type="range"
                                min="0.25"
                                max="3"
                                step="0.25"
                                value={zoom}
                                onChange={(e) => onZoomChange(Number(e.target.value))}
                                className="zoom-slider"
                            />

                            <button
                                className="zoom-btn"
                                onClick={() => onZoomChange(Math.min(3, zoom + 0.25))}
                                disabled={zoom >= 3}
                                title="Zoom in"
                            >
                                <FiZoomIn />
                            </button>

                            <button
                                className="zoom-btn reset"
                                onClick={() => onZoomChange(1)}
                                title="Reset zoom"
                            >
                                <FiMaximize2 />
                            </button>
                        </div>
                    </div>

                    {/* Element Controls Section (only show when element is selected) */}
                    {selectedElement && (
                        <div className="toolbar-section element-controls">
                            <div className="section-header">
                                <FiMove />
                                <span>Element</span>
                            </div>

                            <div className="element-actions">
                                {/* Alignment controls */}
                                <div className="button-group">
                                    <button
                                        className="action-btn"
                                        onClick={() => handleAction('align', 'left')}
                                        title="Align left"
                                    >
                                        <FiAlignLeft />
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => handleAction('align', 'center')}
                                        title="Align center"
                                    >
                                        <FiAlignCenter />
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => handleAction('align', 'right')}
                                        title="Align right"
                                    >
                                        <FiAlignRight />
                                    </button>
                                </div>

                                {/* Layer controls */}
                                <div className="button-group">
                                    <button
                                        className="action-btn"
                                        onClick={() => handleAction('layer', 'front')}
                                        title="Bring to front"
                                    >
                                        <FiLayers />
                                        ↑
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => handleAction('layer', 'back')}
                                        title="Send to back"
                                    >
                                        <FiLayers />
                                        ↓
                                    </button>
                                </div>

                                {/* Element actions */}
                                <div className="button-group">
                                    <button
                                        className="action-btn"
                                        onClick={() => handleAction('duplicate')}
                                        title="Duplicate element"
                                    >
                                        <FiCopy />
                                    </button>
                                    <button
                                        className="action-btn delete"
                                        onClick={() => handleAction('delete')}
                                        title="Delete element"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>

                            {/* Position controls */}
                            <div className="position-controls">
                                <label>Position:</label>
                                <div className="position-inputs">
                                    <div className="input-group">
                                        <label>X:</label>
                                        <input
                                            type="number"
                                            value={parseInt(selectedElement.style.left) || 0}
                                            onChange={(e) => handleAction('move', {
                                                x: Number(e.target.value),
                                                y: parseInt(selectedElement.style.top) || 0
                                            })}
                                            className="position-input"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Y:</label>
                                        <input
                                            type="number"
                                            value={parseInt(selectedElement.style.top) || 0}
                                            onChange={(e) => handleAction('move', {
                                                x: parseInt(selectedElement.style.left) || 0,
                                                y: Number(e.target.value)
                                            })}
                                            className="position-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Size controls */}
                            <div className="size-controls">
                                <label>Size:</label>
                                <div className="size-inputs">
                                    <div className="input-group">
                                        <label>W:</label>
                                        <input
                                            type="number"
                                            value={parseInt(selectedElement.style.width) || selectedElement.offsetWidth}
                                            onChange={(e) => handleAction('resize', {
                                                width: Number(e.target.value),
                                                height: parseInt(selectedElement.style.height) || selectedElement.offsetHeight
                                            })}
                                            className="size-input"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>H:</label>
                                        <input
                                            type="number"
                                            value={parseInt(selectedElement.style.height) || selectedElement.offsetHeight}
                                            onChange={(e) => handleAction('resize', {
                                                width: parseInt(selectedElement.style.width) || selectedElement.offsetWidth,
                                                height: Number(e.target.value)
                                            })}
                                            className="size-input"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Tips */}
                    <div className="toolbar-section tips">
                        <div className="section-header">
                            <span>💡 Tips</span>
                        </div>
                        <div className="tips-content">
                            <div className="tip">Hold <kbd>Shift</kbd> while dragging to maintain aspect ratio</div>
                            <div className="tip">Hold <kbd>Ctrl</kbd> to temporarily disable snapping</div>
                            <div className="tip">Use arrow keys for precise positioning</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DragToolbar;
