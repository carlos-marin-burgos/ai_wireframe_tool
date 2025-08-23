/**
 * Figma Component Browser UI
 * React component for browsing and importing Figma design components
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FigmaComponentBrowserProps, FigmaComponent, FigmaComponentsResponse } from '../types/figma';
import { getApiUrl } from '../config/api';
import './FigmaComponentBrowser.css';

const FigmaComponentBrowser: React.FC<FigmaComponentBrowserProps> = ({
    onImportComponents,
    onAddToWireframe,
    onClose,
    mode = 'add-to-wireframe'
}) => {
    const [components, setComponents] = useState<FigmaComponent[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLibrary, setSelectedLibrary] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [popularComponents, setPopularComponents] = useState<FigmaComponent[]>([]);
    const [statistics, setStatistics] = useState<FigmaComponentsResponse['statistics'] | null>(null);

    // Load component data
    useEffect(() => {
        loadComponentData();
    }, []);

    const loadComponentData = async () => {
        try {
            setLoading(true);

            // Load all components
            const response = await fetch(getApiUrl('/api/figma/components'));
            const data: FigmaComponentsResponse = await response.json();

            setComponents(data.components || []);
            setCategories(['All', ...(data.categories || []).filter(cat => cat !== 'All')]);
            setPopularComponents(data.popular || []);
            setStatistics(data.statistics || null);

        } catch (error) {
            console.error('Failed to load component data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Search and filter components
    const filteredComponents = useCallback(() => {
        let filtered = components;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(component =>
                component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                component.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                component.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(component => component.category === selectedCategory);
        }

        // Filter by library
        if (selectedLibrary !== 'All') {
            filtered = filtered.filter(component => component.library === selectedLibrary);
        }

        return filtered;
    }, [components, searchQuery, selectedCategory, selectedLibrary]);

    const handleComponentSelect = (componentId) => {
        const newSelected = new Set(selectedComponents);
        if (newSelected.has(componentId)) {
            newSelected.delete(componentId);
        } else {
            newSelected.add(componentId);
        }
        setSelectedComponents(newSelected);
    };

    const handleImportSelected = async () => {
        if (selectedComponents.size > 0) {
            try {
                setLoading(true);

                // Handle adding to wireframe (default behavior)
                const selectedComponentData = Array.from(selectedComponents).map(id => {
                    const component = components.find(c => c.id === id);
                    return {
                        id: component?.id,
                        name: component?.name,
                        htmlCode: component?.htmlCode,
                        type: component?.type || 'component',
                        category: component?.category,
                        library: component?.library,
                        defaultWidth: 4, // Default Bootstrap column width
                        content: component?.htmlCode || `<div class="figma-component">${component?.name}</div>`
                    };
                });

                // Call the wireframe addition callback
                if (onAddToWireframe) {
                    onAddToWireframe(selectedComponentData);

                    // Reset selection and close
                    setSelectedComponents(new Set());
                    onClose();
                    return;
                }
            } catch (error) {
                console.error('Operation error:', error);
                alert(`Operation failed: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }
    };

    const ComponentCard: React.FC<{ component: FigmaComponent }> = ({ component }) => (
        <div
            className={`component-card ${selectedComponents.has(component.id) ? 'selected' : ''}`}
            onClick={() => handleComponentSelect(component.id)}
        >
            <div className="component-preview">
                {component.preview ? (
                    <>
                        <img
                            src={component.preview}
                            alt={component.name}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.classList.add('hidden');
                                target.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                        <div className="preview-placeholder hidden">
                            <span>{component.name.charAt(0)}</span>
                        </div>
                    </>
                ) : (
                    <div className="preview-placeholder">
                        <span>{component.name.charAt(0)}</span>
                    </div>
                )}
                <div className="component-library-badge">{component.library}</div>
            </div>
            <div className="component-info">
                <h4 className="component-name">{component.name}</h4>
                <p className="component-description">{component.description}</p>
                <div className="component-meta">
                    <span className="component-category">{component.category}</span>
                    <span className="component-usage">Used {component.usageCount} times</span>
                </div>
                {component.variants && component.variants.length > 0 && (
                    <div className="component-variants">
                        <span className="variants-label">{component.variants.length} variants</span>
                    </div>
                )}
            </div>
        </div>
    );

    const ComponentListItem: React.FC<{ component: FigmaComponent }> = ({ component }) => (
        <div
            className={`component-list-item ${selectedComponents.has(component.id) ? 'selected' : ''}`}
            onClick={() => handleComponentSelect(component.id)}
        >
            <div className="list-item-preview">
                {component.preview ? (
                    <>
                        <img
                            src={component.preview}
                            alt={component.name}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.classList.add('hidden');
                                target.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                        <div className="preview-placeholder hidden">
                            <span>{component.name.charAt(0)}</span>
                        </div>
                    </>
                ) : (
                    <div className="preview-placeholder">
                        <span>{component.name.charAt(0)}</span>
                    </div>
                )}
            </div>
            <div className="list-item-content">
                <div className="list-item-header">
                    <h4 className="component-name">{component.name}</h4>
                    <span className="component-library">{component.library}</span>
                </div>
                <p className="component-description">{component.description}</p>
                <div className="list-item-footer">
                    <span className="component-category">{component.category}</span>
                    <span className="component-variants">
                        {component.variants?.length || 0} variants
                    </span>
                    <span className="component-usage">{component.usageCount} uses</span>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="figma-browser-loading">
                <div className="figma-brand">
                    <div className="figma-logo">F</div>
                    <span className="figma-brand-text">Figma</span>
                </div>

                <div className="loading-container">
                    <div className="loading-spinner">
                        <div className="inner-dot"></div>
                    </div>

                    <div className="loading-text">
                        <h2>Loading Components</h2>
                        <p>Fetching your Figma component library...</p>
                    </div>

                    <div className="loading-progress">
                        <div className="loading-progress-bar"></div>
                    </div>

                    <div className="loading-dots">
                        <div className="loading-dot"></div>
                        <div className="loading-dot"></div>
                        <div className="loading-dot"></div>
                    </div>
                </div>
            </div>
        );
    } return (
        <div className="figma-component-browser">
            <div className="browser-header">
                <div className="header-title">
                    <h2>Add Components to Wireframe</h2>
                    <button className="close-button" onClick={onClose}>✕</button>
                </div>

                {statistics && (
                    <div className="browser-stats">
                        <span>{statistics.totalComponents} components</span>
                        <span>{statistics.categories.length} categories</span>
                        <span>{statistics.totalUsage} total uses</span>
                    </div>
                )}
            </div>

            <div className="browser-controls">
                <div className="search-section">
                    <input
                        type="text"
                        placeholder="Search components..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-section">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="filter-select"
                        aria-label="Filter by category"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    <select
                        value={selectedLibrary}
                        onChange={(e) => setSelectedLibrary(e.target.value)}
                        className="filter-select"
                        aria-label="Filter by library"
                    >
                        <option value="All">All Libraries</option>
                        {statistics?.libraries?.map(library => (
                            <option key={library.name} value={library.name}>
                                {library.name} ({library.count})
                            </option>
                        ))}
                    </select>

                    <div className="view-controls">
                        <button
                            className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            ⋅⋅⋅
                        </button>
                        <button
                            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            ≡
                        </button>
                    </div>
                </div>
            </div>

            {/* Popular Components Section - Hidden for now */}
            {/* 
            {popularComponents.length > 0 && !searchQuery && selectedCategory === 'All' && (
                <div className="popular-section">
                    <h3>Popular Components</h3>
                    <div className="popular-components">
                        {popularComponents.slice(0, 5).map(component => (
                            <div
                                key={component.id}
                                className="popular-component"
                                onClick={() => handleComponentSelect(component.id)}
                            >
                                <img
                                    src={component.preview}
                                    alt={component.name}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.classList.add('hidden');
                                        target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                                <div className="preview-placeholder hidden">
                                    <span>{component.name.charAt(0)}</span>
                                </div>
                                <span>{component.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            */}

            <div className="browser-content">
                <div className={`components-${viewMode}`}>
                    {filteredComponents().map(component => (
                        viewMode === 'grid' ? (
                            <ComponentCard key={component.id} component={component} />
                        ) : (
                            <ComponentListItem key={component.id} component={component} />
                        )
                    ))}
                </div>

                {filteredComponents().length === 0 && (
                    <div className="no-results">
                        <p>No components found matching your criteria.</p>
                        <button onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('All');
                            setSelectedLibrary('All');
                        }}>
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            <div className="browser-footer">
                <div className="selection-info">
                    {selectedComponents.size > 0 ? (
                        <span>{selectedComponents.size} component(s) selected</span>
                    ) : (
                        <span>Select components to add to wireframe</span>
                    )}
                </div>

                <div className="action-buttons">
                    <button
                        className="import-button"
                        onClick={handleImportSelected}
                        disabled={selectedComponents.size === 0}
                    >
                        Add to Wireframe ({selectedComponents.size})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FigmaComponentBrowser;
