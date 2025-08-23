/**
 * Figma Component Browser UI
 * React component for browsing and importing Figma design components
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FigmaComponentBrowserProps, FigmaComponent, FigmaComponentsResponse } from '../types/figma';
import { getApiUrl } from '../config/api';
import FigmaUrlImporter from './FigmaUrlImporter';
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
    const [showUrlImporter, setShowUrlImporter] = useState(false);

    // Cache key for localStorage
    const CACHE_KEY = 'figma_components_cache';
    const CACHE_EXPIRY_HOURS = 2; // Cache expires after 2 hours

    // Load component data with caching
    useEffect(() => {
        loadComponentData();
    }, []);

    const loadComponentData = async () => {
        try {
            setLoading(true);

            // Check if we have cached data
            const cachedData = getCachedComponents();
            if (cachedData) {
                console.log('🚀 Loading components from cache');
                setComponents(cachedData.components || []);
                setCategories(['All', ...(cachedData.categories || []).filter(cat => cat !== 'All')]);
                setPopularComponents(cachedData.popular || []);
                setStatistics(cachedData.statistics || null);
                setLoading(false);
                return;
            }

            console.log('🔄 Fetching fresh components from API');
            // Load all components from API
            const response = await fetch(getApiUrl('/api/figma/components'));
            const data: FigmaComponentsResponse = await response.json();

            // Cache the data
            setCachedComponents(data);

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

    // Cache helper functions
    const getCachedComponents = (): FigmaComponentsResponse | null => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;

            const parsedCache = JSON.parse(cached);
            const cacheTime = new Date(parsedCache.timestamp);
            const now = new Date();
            const diffHours = (now.getTime() - cacheTime.getTime()) / (1000 * 60 * 60);

            if (diffHours > CACHE_EXPIRY_HOURS) {
                localStorage.removeItem(CACHE_KEY);
                return null;
            }

            return parsedCache.data;
        } catch (error) {
            console.error('Cache read error:', error);
            localStorage.removeItem(CACHE_KEY);
            return null;
        }
    };

    const setCachedComponents = (data: FigmaComponentsResponse) => {
        try {
            const cacheObject = {
                data,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
        } catch (error) {
            console.error('Cache write error:', error);
        }
    };

    const clearCache = () => {
        try {
            localStorage.removeItem(CACHE_KEY);
            console.log('🗑️ Cache cleared successfully');
            // Reload components from API
            loadComponentData();
        } catch (error) {
            console.error('Error clearing cache:', error);
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

    // Generate HTML for components based on their type and category
    const generateComponentHTML = (component: FigmaComponent): string => {
        console.log('🔧 Generating HTML for component:', component.name, component);

        const cleanName = component.name.toLowerCase();
        const category = component.category.toLowerCase();

        // Button components
        if (cleanName.includes('button') || category === 'actions') {
            const buttonType = cleanName.includes('outlined') ? 'outlined' :
                cleanName.includes('filled') ? 'filled' :
                    cleanName.includes('split') ? 'split' : 'primary';

            const htmlResult = `<button class="btn btn-${buttonType} figma-component" type="button">
                ${component.name}
            </button>`;

            console.log('🔧 Generated button HTML:', htmlResult);
            return htmlResult;
        }

        // Card components
        if (cleanName.includes('card') || category === 'cards') {
            return `<div class="card figma-component">
                <div class="card-header">
                    <h5 class="card-title">${component.name}</h5>
                </div>
                <div class="card-body">
                    <p class="card-text">This is a ${component.name} from ${component.library}.</p>
                    <a href="#" class="btn btn-primary">Learn More</a>
                </div>
            </div>`;
        }

        // Navigation components
        if (cleanName.includes('nav') || cleanName.includes('breadcrumb') || category === 'navigation') {
            if (cleanName.includes('breadcrumb')) {
                return `<nav aria-label="breadcrumb" class="figma-component">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="#">Home</a></li>
                        <li class="breadcrumb-item"><a href="#">Learn</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Current Page</li>
                    </ol>
                </nav>`;
            }
            return `<nav class="navbar navbar-expand-lg navbar-light bg-light figma-component">
                <div class="container">
                    <a class="navbar-brand" href="#">${component.name}</a>
                    <button class="navbar-toggler" type="button">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>`;
        }

        // Form components
        if (cleanName.includes('input') || cleanName.includes('form') || category === 'forms') {
            return `<div class="form-group figma-component">
                <label for="${component.id}Input">${component.name}</label>
                <input type="text" class="form-control" id="${component.id}Input" placeholder="Enter text">
                <small class="form-text text-muted">This is a ${component.name} component.</small>
            </div>`;
        }

        // Data display components
        if (cleanName.includes('table') || cleanName.includes('list') || category === 'data display') {
            return `<div class="table-responsive figma-component">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Column 1</th>
                            <th>Column 2</th>
                            <th>Column 3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Data 1</td>
                            <td>Data 2</td>
                            <td>Data 3</td>
                        </tr>
                    </tbody>
                </table>
            </div>`;
        }

        // Layout components
        if (cleanName.includes('hero') || cleanName.includes('banner') || category === 'layout') {
            return `<div class="hero-section figma-component bg-primary text-white p-5">
                <div class="container">
                    <h1 class="display-4">${component.name}</h1>
                    <p class="lead">This is a ${component.name} component from ${component.library}.</p>
                    <button class="btn btn-light btn-lg">Get Started</button>
                </div>
            </div>`;
        }

        // Feedback components
        if (cleanName.includes('alert') || cleanName.includes('notification') || category === 'feedback') {
            return `<div class="alert alert-info figma-component" role="alert">
                <h5 class="alert-heading">${component.name}</h5>
                <p>This is a ${component.name} component for displaying important information.</p>
            </div>`;
        }

        // Default component
        return `<div class="figma-component p-3 border rounded">
            <h6 class="mb-2">${component.name}</h6>
            <p class="text-muted mb-0">A ${component.category} component from ${component.library}</p>
        </div>`;
    };

    const handleImportSelected = async () => {
        if (selectedComponents.size > 0) {
            try {
                setLoading(true);

                // Handle adding to wireframe (default behavior)
                const selectedComponentData = Array.from(selectedComponents).map(id => {
                    const component = components.find(c => c.id === id);
                    const generatedHTML = generateComponentHTML(component!);

                    console.log('🔧 Selected component data for', component?.name, ':', {
                        component,
                        generatedHTML,
                        hasPreview: !!component?.preview
                    });

                    return {
                        id: component?.id,
                        name: component?.name,
                        htmlCode: generatedHTML,
                        type: component?.type || 'component',
                        category: component?.category,
                        library: component?.library,
                        defaultWidth: 4, // Default Bootstrap column width
                        content: generatedHTML
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
                <div className="loading-modal-content">
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
                        <button
                            className="clear-cache-button"
                            onClick={clearCache}
                            title="Clear cached components and reload from Figma"
                        >
                            🔄 Refresh
                        </button>
                        <button
                            className="url-import-button"
                            onClick={() => setShowUrlImporter(true)}
                            title="Import specific component from Figma URL"
                        >
                            🔗 Import URL
                        </button>
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

            {showUrlImporter && (
                <FigmaUrlImporter
                    onComponentImported={(component) => {
                        // Convert the imported component to the format expected by onAddToWireframe
                        const componentData = [{
                            id: component.id,
                            name: component.name,
                            description: component.description,
                            category: component.category,
                            content: component.content,
                            figmaUrl: component.figmaUrl
                        }];
                        onAddToWireframe(componentData);
                    }}
                    onClose={() => setShowUrlImporter(false)}
                />
            )}
        </div>
    );
};

export default FigmaComponentBrowser;
