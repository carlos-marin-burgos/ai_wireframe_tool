import React, { useState } from 'react';
import { FiX, FiSearch, FiGrid, FiList } from 'react-icons/fi';
import './ComponentLibrary.css';
// Removed problematic import - function not available in frontend
// import { generateSiteHeaderHTML } from './SiteHeaderGenerator';

interface ComponentLibraryItem {
    id: string;
    name: string;
    category: 'layout' | 'input' | 'navigation' | 'content' | 'feedback' | 'media';
    description: string;
    preview: React.ReactNode;
    defaultProps: Record<string, any>;
    icon: string;
}

interface ComponentLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onAddComponent?: (component: ComponentLibraryItem) => void;
}

// Atlas Design System Components
const SAMPLE_COMPONENTS: ComponentLibraryItem[] = [
    // Atlas Buttons
    {
        id: 'atlas-button-primary',
        name: 'Primary Button',
        category: 'input',
        description: 'Atlas design primary action button',
        preview: <div className="atlas-button-preview button button-primary button-lg">Primary Action</div>,
        defaultProps: { text: 'Primary Action', size: 'button-lg', variant: 'button-primary' },
        icon: '🔵'
    },
    {
        id: 'atlas-button-secondary',
        name: 'Secondary Button',
        category: 'input',
        description: 'Atlas design secondary action button',
        preview: <div className="atlas-button-preview button button-secondary button-lg">Secondary Action</div>,
        defaultProps: { text: 'Secondary Action', size: 'button-lg', variant: 'button-secondary' },
        icon: '⚪'
    },
    {
        id: 'atlas-button-search',
        name: 'Search Button',
        category: 'input',
        description: 'Atlas design search button with icon',
        preview: <div className="atlas-button-preview button button-primary button-lg button-search">🔍 Search</div>,
        defaultProps: { text: 'Search', size: 'button-lg', variant: 'button-primary', hasIcon: true },
        icon: '�'
    },

    // Atlas Layout Components
    {
        id: 'atlas-grid',
        name: 'Atlas Grid',
        category: 'layout',
        description: 'Microsoft Learn responsive grid layout',
        preview: <div className="atlas-layout-preview atlas-grid-preview">Grid Layout</div>,
        defaultProps: { columns: 3, gap: '24px', className: 'atlas-grid' },
        icon: '🔲'
    },
    {
        id: 'atlas-container',
        name: 'Atlas Container',
        category: 'layout',
        description: 'Microsoft Learn content container',
        preview: <div className="atlas-layout-preview atlas-container-preview">Content Container</div>,
        defaultProps: { maxWidth: '1200px', padding: '24px', className: 'atlas-container' },
        icon: '📦'
    },
    {
        id: 'atlas-stack',
        name: 'Atlas Stack',
        category: 'layout',
        description: 'Microsoft Learn vertical stack layout',
        preview: <div className="atlas-layout-preview atlas-stack-preview">Stack Layout</div>,
        defaultProps: { gap: '16px', direction: 'vertical', className: 'atlas-stack' },
        icon: '🪟'
    },

    // Atlas Form Components
    {
        id: 'atlas-text-input',
        name: 'Atlas Text Input',
        category: 'input',
        description: 'Microsoft Learn styled text input',
        preview: <div className="atlas-input-preview">Text Input</div>,
        defaultProps: { placeholder: 'Enter text...', type: 'text', className: 'atlas-input' },
        icon: '📝'
    },
    {
        id: 'atlas-select',
        name: 'Atlas Select',
        category: 'input',
        description: 'Microsoft Learn styled dropdown select',
        preview: <div className="atlas-select-preview">Select Option ▼</div>,
        defaultProps: { options: ['Option 1', 'Option 2', 'Option 3'], className: 'atlas-select' },
        icon: '�'
    },

    // Atlas Content Components
    {
        id: 'atlas-card',
        name: 'Atlas Card',
        category: 'content',
        description: 'Microsoft Learn content card with shadow',
        preview: <div className="atlas-card-preview">
            <div className="card-header">Card Title</div>
            <div className="card-content">Card content goes here...</div>
        </div>,
        defaultProps: { title: 'Card Title', hasImage: false, className: 'atlas-card' },
        icon: '🗃️'
    },
    {
        id: 'atlas-hero',
        name: 'Microsoft Learn Accent Hero',
        category: 'content',
        description: 'Microsoft Learn hero section with accent background and gradient border',
        preview: <div className="atlas-hero-preview">
            <div className="hero-eyebrow">MICROSOFT LEARN</div>
            <div className="hero-title">Build your next great idea</div>
            <div className="hero-subtitle">Transform your vision into reality</div>
            <div className="hero-buttons">
                <span className="hero-btn-primary">Get Started</span>
                <span className="hero-btn-secondary">Learn More</span>
            </div>
        </div>,
        defaultProps: {
            title: 'Build your next great idea',
            summary: 'Transform your vision into reality with Microsoft Learn',
            eyebrow: 'MICROSOFT LEARN',
            backgroundColor: '#E9ECEF'
        },
        icon: '🎯'
    },

    // Atlas Navigation Components
    {
        id: 'atlas-navbar',
        name: 'Atlas Navigation',
        category: 'navigation',
        description: 'Microsoft Learn navigation bar',
        preview: <div className="atlas-nav-preview">
            <div className="nav-logo">Microsoft Learn</div>
            <div className="nav-items">Home | About | Contact</div>
        </div>,
        defaultProps: { brand: 'Microsoft Learn', items: ['Home', 'About', 'Contact'] },
        icon: '🧭'
    },
    {
        id: 'atlas-breadcrumb',
        name: 'Atlas Breadcrumb',
        category: 'navigation',
        description: 'Microsoft Learn breadcrumb navigation',
        preview: <div className="atlas-breadcrumb-preview">Home {' > '} Category {' > '} Page</div>,
        defaultProps: { items: ['Home', 'Category', 'Current Page'] },
        icon: '🍞'
    },

    // Atlas Media Components
    {
        id: 'atlas-image',
        name: 'Atlas Image',
        category: 'media',
        description: 'Microsoft Learn styled image with caption',
        preview: <div className="atlas-image-preview">
            <div className="image-placeholder">🖼️</div>
            <div className="image-caption">Image caption</div>
        </div>,
        defaultProps: { alt: 'Image', width: 200, height: 150, hasCaption: true },
        icon: '🖼️'
    },

    // Microsoft Learn Site Header Component
    {
        id: 'microsoft-learn-topnav',
        name: 'Microsoft Learn Site Header',
        category: 'navigation',
        description: 'Official Microsoft Learn site header with navigation, search, and branding',
        preview: <div
            className="ms-site-header-preview"
            style={{
                padding: '10px',
                background: '#f0f0f0',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#666'
            }}
        >
            Microsoft Learn Header Preview
        </div>,
        defaultProps: {
            brand: 'Designetica',
            items: ['Home', 'About', 'Contact'],
            showSearch: true,
            showProfile: true
        },
        icon: '🏠'
    }
];

const CATEGORIES = [
    { key: 'all', label: 'All Components', icon: '📦' },
    { key: 'layout', label: 'Layout', icon: '📐' },
    { key: 'input', label: 'Input', icon: '📝' },
    { key: 'navigation', label: 'Navigation', icon: '🧭' },
    { key: 'content', label: 'Content', icon: '📄' },
    { key: 'feedback', label: 'Feedback', icon: '💬' },
    { key: 'media', label: 'Media', icon: '🖼️' }
];

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
    isOpen,
    onClose,
    onAddComponent
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredComponents = SAMPLE_COMPONENTS.filter(component => {
        const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            component.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleComponentClick = (component: ComponentLibraryItem) => {
        if (onAddComponent) {
            onAddComponent(component);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="component-library-overlay">
            <div className="component-library-modal">
                {/* Header */}
                <div className="component-library-header">
                    <div className="header-left">
                        <h2>Component Library</h2>
                        <p>Click to add components to your wireframe</p>
                    </div>
                    <div className="header-right">
                        <button
                            className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Grid View"
                        >
                            <FiGrid />
                        </button>
                        <button
                            className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            title="List View"
                        >
                            <FiList />
                        </button>
                        <button className="close-btn" onClick={onClose} title="Close Component Library">
                            <FiX />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="component-library-search">
                    <div className="search-input-container">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search components..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                <div className="component-library-content">
                    {/* Categories Sidebar */}
                    <div className="categories-sidebar">
                        <h3>Categories</h3>
                        <div className="categories-list">
                            {CATEGORIES.map(category => (
                                <button
                                    key={category.key}
                                    className={`category-btn ${selectedCategory === category.key ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category.key)}
                                >
                                    <span className="category-icon">{category.icon}</span>
                                    <span className="category-label">{category.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Components Grid/List */}
                    <div className="components-main">
                        <div className="components-header">
                            <h3>
                                {selectedCategory === 'all' ? 'All Components' :
                                    CATEGORIES.find(c => c.key === selectedCategory)?.label}
                            </h3>
                            <span className="components-count">
                                {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className={`components-container ${viewMode}`}>
                            {filteredComponents.length === 0 ? (
                                <div className="no-components">
                                    <p>No components found</p>
                                    <small>Try adjusting your search or category filter</small>
                                </div>
                            ) : (
                                filteredComponents.map(component => (
                                    <div
                                        key={component.id}
                                        className="component-item"
                                        onClick={() => handleComponentClick(component)}
                                        title="Click to add to wireframe"
                                    >
                                        <div className="component-preview">
                                            {component.preview}
                                        </div>
                                        <div className="component-info">
                                            <div className="component-name">
                                                <span className="component-icon">{component.icon}</span>
                                                {component.name}
                                            </div>
                                            <div className="component-description">
                                                {component.description}
                                            </div>
                                            <div className="component-category">
                                                {component.category}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="component-library-footer">
                    <div className="footer-info">
                        <small>💡 Double-click any component to add it to your wireframe</small>
                    </div>
                    <div className="footer-actions">
                        <button className="btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentLibrary;
