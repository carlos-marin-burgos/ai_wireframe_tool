/**
 * Enhanced Component Library with organized sources
 * - Fluent UI: GitHub microsoft/fluentui (Fluent Dev Playbook)
 * - Atlas: GitHub microsoft/atlas-design (Atlas Dev Playbook)  
 * - Figma: Fluent & Atlas design files
 */

import React, { useState, useMemo, useEffect } from 'react';
import './EnhancedComponentLibrary.css';

interface Component {
    id: string;
    name: string;
    description: string;
    category: string;
    htmlCode: string;
    preview?: string;
    source: 'fluent-github' | 'atlas-github' | 'figma-fluent' | 'figma-atlas';
    sourceUrl?: string;
    playbook: 'Fluent Dev Playbook' | 'Atlas Dev Playbook' | 'Figma Design System';
}

interface EnhancedComponentLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onAddComponent: (component: Component) => void;
    onGenerateWithAI?: (description: string) => void;
    currentDescription?: string;
}

const EnhancedComponentLibrary: React.FC<EnhancedComponentLibraryProps> = ({
    isOpen,
    onClose,
    onAddComponent,
    onGenerateWithAI,
    currentDescription
}) => {
    // State management
    const [selectedPlaybook, setSelectedPlaybook] = useState<'Fluent Dev Playbook' | 'Atlas Dev Playbook' | 'Figma Design System'>('Fluent Dev Playbook');
    const [selectedSource, setSelectedSource] = useState<'all' | 'fluent-github' | 'atlas-github' | 'figma-fluent' | 'figma-atlas'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loadedComponents, setLoadedComponents] = useState<Component[]>([]);
    const [loading, setLoading] = useState(false);

    // Load components based on selected playbook
    useEffect(() => {
        if (isOpen) {
            loadComponentsForPlaybook();
        }
    }, [isOpen, selectedPlaybook]);

    const loadComponentsForPlaybook = async () => {
        setLoading(true);
        try {
            let components: Component[] = [];

            switch (selectedPlaybook) {
                case 'Fluent Dev Playbook':
                    components = await loadFluentComponents();
                    break;
                case 'Atlas Dev Playbook':
                    components = await loadAtlasComponents();
                    break;
                case 'Figma Design System':
                    components = await loadFigmaComponents();
                    break;
            }

            setLoadedComponents(components);
        } catch (error) {
            console.error('Error loading components:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load Fluent UI components from GitHub/library
    const loadFluentComponents = async (): Promise<Component[]> => {
        try {
            const response = await fetch('/fluent-library.json');
            if (!response.ok) throw new Error('Failed to load Fluent UI components');

            const data = await response.json();
            return data.components.map((comp: any) => ({
                id: comp.id,
                name: comp.name,
                description: comp.description,
                category: comp.category,
                htmlCode: comp.htmlCode,
                source: 'fluent-github' as const,
                sourceUrl: comp.githubPath ? `https://github.com/microsoft/fluentui/tree/master/packages/${comp.githubPath}` : undefined,
                playbook: 'Fluent Dev Playbook' as const
            }));
        } catch (error) {
            console.error('Error loading Fluent components:', error);
            return [];
        }
    };

    // Load Atlas components from GitHub
    const loadAtlasComponents = async (): Promise<Component[]> => {
        // Atlas components based on microsoft/atlas-design repository structure
        return [
            {
                id: 'atlas-navigation-header',
                name: 'Navigation Header',
                description: 'Atlas navigation header component from Atlas Dev Playbook',
                category: 'Navigation',
                source: 'atlas-github',
                sourceUrl: 'https://github.com/microsoft/atlas-design/tree/main/src/components/navigation',
                playbook: 'Atlas Dev Playbook',
                htmlCode: `
                <header style="background: #f8f9fa; padding: 16px 24px; border-bottom: 1px solid #e1e5e9; font-family: 'Segoe UI', sans-serif;">
                    <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="font-size: 20px; font-weight: 600; color: #323130;">Atlas</div>
                            <nav style="display: flex; gap: 24px;">
                                <a href="#" style="color: #323130; text-decoration: none; font-weight: 500;">Overview</a>
                                <a href="#" style="color: #323130; text-decoration: none; font-weight: 500;">Components</a>
                                <a href="#" style="color: #323130; text-decoration: none; font-weight: 500;">Patterns</a>
                                <a href="#" style="color: #323130; text-decoration: none; font-weight: 500;">Resources</a>
                            </nav>
                        </div>
                        <button style="background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600;">Get Started</button>
                    </div>
                </header>`
            },
            {
                id: 'atlas-hero-section',
                name: 'Hero Section',
                description: 'Atlas hero section component from Atlas Dev Playbook',
                category: 'Hero',
                source: 'atlas-github',
                sourceUrl: 'https://github.com/microsoft/atlas-design/tree/main/src/components/hero',
                playbook: 'Atlas Dev Playbook',
                htmlCode: `
                <section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 24px; text-align: center; font-family: 'Segoe UI', sans-serif;">
                    <div style="max-width: 800px; margin: 0 auto;">
                        <h1 style="font-size: 48px; font-weight: 700; margin: 0 0 24px 0; line-height: 1.2;">Build amazing experiences with Atlas</h1>
                        <p style="font-size: 20px; margin: 0 0 32px 0; opacity: 0.9; line-height: 1.5;">A comprehensive design system for creating consistent, accessible, and beautiful user interfaces.</p>
                        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                            <button style="background: white; color: #323130; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 16px;">Get Started</button>
                            <button style="background: transparent; color: white; border: 2px solid white; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 16px;">Learn More</button>
                        </div>
                    </div>
                </section>`
            },
            {
                id: 'atlas-card-grid',
                name: 'Card Grid',
                description: 'Atlas card grid layout from Atlas Dev Playbook',
                category: 'Layout',
                source: 'atlas-github',
                sourceUrl: 'https://github.com/microsoft/atlas-design/tree/main/src/components/cards',
                playbook: 'Atlas Dev Playbook',
                htmlCode: `
                <div style="padding: 48px 24px; font-family: 'Segoe UI', sans-serif;">
                    <div style="max-width: 1200px; margin: 0 auto;">
                        <h2 style="text-align: center; font-size: 32px; font-weight: 600; color: #323130; margin: 0 0 48px 0;">Featured Components</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
                            <div style="background: white; border: 1px solid #e1e5e9; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s;">
                                <div style="width: 48px; height: 48px; background: #0078d4; border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">📊</div>
                                <h3 style="font-size: 20px; font-weight: 600; color: #323130; margin: 0 0 12px 0;">Analytics</h3>
                                <p style="color: #605e5c; line-height: 1.5; margin: 0 0 16px 0;">Track and analyze your data with powerful visualization tools.</p>
                                <a href="#" style="color: #0078d4; text-decoration: none; font-weight: 600;">Learn more →</a>
                            </div>
                            <div style="background: white; border: 1px solid #e1e5e9; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s;">
                                <div style="width: 48px; height: 48px; background: #107c10; border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">🎨</div>
                                <h3 style="font-size: 20px; font-weight: 600; color: #323130; margin: 0 0 12px 0;">Design Tools</h3>
                                <p style="color: #605e5c; line-height: 1.5; margin: 0 0 16px 0;">Create beautiful interfaces with our comprehensive design system.</p>
                                <a href="#" style="color: #0078d4; text-decoration: none; font-weight: 600;">Learn more →</a>
                            </div>
                            <div style="background: white; border: 1px solid #e1e5e9; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s;">
                                <div style="width: 48px; height: 48px; background: #ff8c00; border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">⚡</div>
                                <h3 style="font-size: 20px; font-weight: 600; color: #323130; margin: 0 0 12px 0;">Performance</h3>
                                <p style="color: #605e5c; line-height: 1.5; margin: 0 0 16px 0;">Optimize your applications for speed and efficiency.</p>
                                <a href="#" style="color: #0078d4; text-decoration: none; font-weight: 600;">Learn more →</a>
                            </div>
                        </div>
                    </div>
                </div>`
            }
        ];
    };

    // Load Figma components (both Fluent and Atlas)
    const loadFigmaComponents = async (): Promise<Component[]> => {
        return [
            {
                id: 'figma-fluent-button-set',
                name: 'Fluent Button Set',
                description: 'Complete button component set from Fluent 2 Figma library',
                category: 'Buttons',
                source: 'figma-fluent',
                sourceUrl: 'https://www.figma.com/design/GvIcCw0tWaJVDSWD4f1OIW/Fluent-2-web?node-id=326816-44116',
                playbook: 'Figma Design System',
                htmlCode: `
                <div style="padding: 24px; background: #f8f9fa; border-radius: 8px; font-family: 'Segoe UI', sans-serif;">
                    <h3 style="margin: 0 0 16px 0; color: #323130;">Fluent Button Components</h3>
                    <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
                        <button style="background: #0078d4; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: 600;">Primary</button>
                        <button style="background: transparent; color: #0078d4; border: 1px solid #0078d4; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: 600;">Secondary</button>
                        <button style="background: transparent; color: #323130; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: 600;">Subtle</button>
                        <button style="background: #f3f2f1; color: #a19f9d; border: none; padding: 10px 20px; border-radius: 4px; cursor: not-allowed; font-weight: 600;" disabled>Disabled</button>
                    </div>
                    <p style="margin: 16px 0 0 0; font-size: 12px; color: #605e5c;">From Fluent 2 Figma Design System</p>
                </div>`
            },
            {
                id: 'figma-atlas-navigation',
                name: 'Atlas Navigation',
                description: 'Navigation component from Atlas Figma library',
                category: 'Navigation',
                source: 'figma-atlas',
                sourceUrl: 'https://www.figma.com/design/PuWj05uKXhfbqrhmJLtCij/Atlas-library-for-designetica?node-id=1-4688',
                playbook: 'Figma Design System',
                htmlCode: `
                <div style="background: white; border: 1px solid #e1e5e9; border-radius: 8px; overflow: hidden; font-family: 'Segoe UI', sans-serif;">
                    <div style="background: #0078d4; color: white; padding: 16px 24px;">
                        <h3 style="margin: 0; font-size: 18px;">Atlas Navigation</h3>
                    </div>
                    <nav style="padding: 16px 0;">
                        <a href="#" style="display: block; padding: 12px 24px; color: #323130; text-decoration: none; border-left: 3px solid #0078d4; background: #f3f9ff;">Dashboard</a>
                        <a href="#" style="display: block; padding: 12px 24px; color: #605e5c; text-decoration: none; border-left: 3px solid transparent;">Analytics</a>
                        <a href="#" style="display: block; padding: 12px 24px; color: #605e5c; text-decoration: none; border-left: 3px solid transparent;">Projects</a>
                        <a href="#" style="display: block; padding: 12px 24px; color: #605e5c; text-decoration: none; border-left: 3px solid transparent;">Settings</a>
                    </nav>
                    <p style="margin: 0; padding: 16px 24px; font-size: 12px; color: #605e5c; border-top: 1px solid #f3f2f1;">From Atlas Figma Library</p>
                </div>`
            }
        ];
    };

    // Filter components based on selection
    const filteredComponents = useMemo(() => {
        let filtered = loadedComponents;

        // Filter by source
        if (selectedSource !== 'all') {
            filtered = filtered.filter(comp => comp.source === selectedSource);
        }

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(comp => comp.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(comp =>
                comp.name.toLowerCase().includes(query) ||
                comp.description.toLowerCase().includes(query) ||
                comp.category.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [loadedComponents, selectedSource, selectedCategory, searchQuery]);

    // Get unique categories
    const categories = useMemo(() => {
        const cats = new Set(['All']);
        loadedComponents.forEach(comp => cats.add(comp.category));
        return Array.from(cats);
    }, [loadedComponents]);

    // Get source counts
    const sourceCounts = useMemo(() => {
        const counts = {
            'fluent-github': 0,
            'atlas-github': 0,
            'figma-fluent': 0,
            'figma-atlas': 0
        };
        loadedComponents.forEach(comp => {
            counts[comp.source]++;
        });
        return counts;
    }, [loadedComponents]);

    if (!isOpen) return null;

    return (
        <div className="enhanced-component-library-overlay">
            <div className="enhanced-component-library-modal">
                {/* Header */}
                <div className="library-header">
                    <div className="header-content">
                        <h2>Component Library</h2>
                        <p>Browse components from Fluent Dev Playbook, Atlas Dev Playbook, and Figma Design Systems</p>
                    </div>
                    <button onClick={onClose} className="close-button">×</button>
                </div>

                {/* Playbook Selector */}
                <div className="playbook-selector">
                    <div className="playbook-tabs">
                        {(['Fluent Dev Playbook', 'Atlas Dev Playbook', 'Figma Design System'] as const).map(playbook => (
                            <button
                                key={playbook}
                                className={`playbook-tab ${selectedPlaybook === playbook ? 'active' : ''}`}
                                onClick={() => setSelectedPlaybook(playbook)}
                            >
                                {playbook}
                                {playbook === 'Fluent Dev Playbook' && (
                                    <span className="source-badge github">GitHub</span>
                                )}
                                {playbook === 'Atlas Dev Playbook' && (
                                    <span className="source-badge github">GitHub</span>
                                )}
                                {playbook === 'Figma Design System' && (
                                    <span className="source-badge figma">Figma</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    <div className="filter-group">
                        <label htmlFor="source-select">Source:</label>
                        <select
                            id="source-select"
                            value={selectedSource}
                            onChange={(e) => setSelectedSource(e.target.value as any)}
                            aria-label="Select component source"
                        >
                            <option value="all">All Sources</option>
                            {selectedPlaybook === 'Fluent Dev Playbook' && (
                                <option value="fluent-github">Fluent GitHub ({sourceCounts['fluent-github']})</option>
                            )}
                            {selectedPlaybook === 'Atlas Dev Playbook' && (
                                <option value="atlas-github">Atlas GitHub ({sourceCounts['atlas-github']})</option>
                            )}
                            {selectedPlaybook === 'Figma Design System' && (
                                <>
                                    <option value="figma-fluent">Figma Fluent ({sourceCounts['figma-fluent']})</option>
                                    <option value="figma-atlas">Figma Atlas ({sourceCounts['figma-atlas']})</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="category-select">Category:</label>
                        <select
                            id="category-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            aria-label="Select component category"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group search-group">
                        <label>Search:</label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search components..."
                            className="search-input"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading {selectedPlaybook} components...</p>
                    </div>
                )}

                {/* Components Grid */}
                {!loading && (
                    <div className="components-grid">
                        {filteredComponents.map(component => (
                            <div key={component.id} className="component-card">
                                <div className="component-preview">
                                    <div
                                        dangerouslySetInnerHTML={{ __html: component.htmlCode }}
                                        className="component-preview-scaled"
                                    />
                                </div>
                                <div className="component-info">
                                    <div className="component-header">
                                        <h3>{component.name}</h3>
                                        <div className="source-indicators">
                                            <span className={`source-tag ${component.source}`}>
                                                {component.source.includes('github') ? 'GitHub' : 'Figma'}
                                            </span>
                                            <span className="playbook-tag">{component.playbook}</span>
                                        </div>
                                    </div>
                                    <p className="component-description">{component.description}</p>
                                    <div className="component-meta">
                                        <span className="category-tag">{component.category}</span>
                                        {component.sourceUrl && (
                                            <a
                                                href={component.sourceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="source-link"
                                            >
                                                View Source
                                            </a>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => onAddComponent(component)}
                                        className="add-component-btn"
                                    >
                                        Add to Wireframe
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredComponents.length === 0 && (
                    <div className="empty-state">
                        <p>No components found matching your criteria.</p>
                        <button onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('All');
                            setSelectedSource('all');
                        }}>
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Footer */}
                <div className="library-footer">
                    <div className="stats">
                        Showing {filteredComponents.length} of {loadedComponents.length} components from {selectedPlaybook}
                    </div>
                    {onGenerateWithAI && (
                        <button
                            onClick={() => onGenerateWithAI('Generate a custom component')}
                            className="ai-generate-btn"
                        >
                            ➕ Add to Wireframe
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EnhancedComponentLibrary;
