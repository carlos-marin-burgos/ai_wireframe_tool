import React, { useState } from 'react';
import { FiX, FiSearch } from 'react-icons/fi';
import './AtlasComponentLibrary.css';

interface ComponentLibraryItem {
    id: string;
    name: string;
    category: 'layout' | 'input' | 'navigation' | 'content' | 'feedback' | 'media' | 'data';
    description: string;
    preview: React.ReactNode;
    defaultProps: Record<string, any>;
    icon: string;
    atlasClass?: string;
}

interface AtlasComponentLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onAddComponent?: (component: ComponentLibraryItem) => void;
}

// Complete Atlas Design System Components from Microsoft Learn
const ATLAS_COMPONENTS: ComponentLibraryItem[] = [
    // Microsoft Learn Navigation Components
    {
        id: 'ms-learn-layout',
        name: 'Microsoft Learn Complete Layout',
        category: 'layout',
        description: 'Complete Microsoft Learn page layout with top nav, hero, content sections, and footer',
        preview: <div className="ms-learn-component-preview">
            <div className="ms-learn-layout-preview">📄 Complete MS Learn Layout</div>
        </div>,
        defaultProps: { className: 'ms-learn-layout' },
        atlasClass: 'ms-learn-layout',
        icon: '📄'
    },
    {
        id: 'ms-learn-topnav',
        name: 'Microsoft Learn Top Navigation',
        category: 'navigation',
        description: 'Official Microsoft Learn top navigation with search, menus, and branding',
        preview: <div className="ms-learn-component-preview">
            <div className="ms-learn-nav-preview">🧭 Microsoft Learn Navigation</div>
        </div>,
        defaultProps: { className: 'ms-learn-topnav' },
        atlasClass: 'ms-learn-topnav',
        icon: '🧭'
    },
    {
        id: 'ms-learn-hero',
        name: 'Microsoft Learn Hero',
        category: 'content',
        description: 'Microsoft Learn hero section with gradient background and statistics',
        preview: <div className="ms-learn-component-preview">
            <div className="ms-learn-hero-preview">🎯 Hero Section</div>
        </div>,
        defaultProps: { className: 'ms-learn-hero' },
        atlasClass: 'ms-learn-hero',
        icon: '🎯'
    },
    {
        id: 'ms-learn-footer',
        name: 'Microsoft Learn Footer',
        category: 'navigation',
        description: 'Official Microsoft Learn footer with links, resources, and legal information',
        preview: <div className="ms-learn-component-preview">
            <div className="ms-learn-footer-preview">📄 Microsoft Learn Footer</div>
        </div>,
        defaultProps: { className: 'ms-learn-footer' },
        atlasClass: 'ms-learn-footer',
        icon: '📄'
    },

    // Atlas Buttons - All Official Variants
    {
        id: 'atlas-button-primary',
        name: 'Primary Button',
        category: 'input',
        description: 'Primary action button (outlined) - Use for most important actions',
        preview: <div className="atlas-button-preview button button-primary">Primary Action</div>,
        defaultProps: { text: 'Primary Action', className: 'button button-primary' },
        atlasClass: 'button button-primary',
        icon: '🔵'
    },
    {
        id: 'atlas-button-primary-filled',
        name: 'Primary Filled',
        category: 'input',
        description: 'Primary filled button - High emphasis action',
        preview: <div className="atlas-button-preview button button-primary button-filled">Primary Filled</div>,
        defaultProps: { text: 'Primary Filled', className: 'button button-primary button-filled' },
        atlasClass: 'button button-primary button-filled',
        icon: '🟦'
    },
    {
        id: 'atlas-button-primary-clear',
        name: 'Primary Clear',
        category: 'input',
        description: 'Primary clear button - Minimal style for light backgrounds',
        preview: <div className="atlas-button-preview button button-primary button-clear">Primary Clear</div>,
        defaultProps: { text: 'Primary Clear', className: 'button button-primary button-clear' },
        atlasClass: 'button button-primary button-clear',
        icon: '🔷'
    },
    {
        id: 'atlas-button-secondary',
        name: 'Secondary Button',
        category: 'input',
        description: 'Secondary button (default) - Standard actions',
        preview: <div className="atlas-button-preview button">Secondary Action</div>,
        defaultProps: { text: 'Secondary Action', className: 'button' },
        atlasClass: 'button',
        icon: '⚪'
    },
    {
        id: 'atlas-button-secondary-clear',
        name: 'Secondary Clear',
        category: 'input',
        description: 'Secondary clear button - Minimal secondary action',
        preview: <div className="atlas-button-preview button button-clear">Secondary Clear</div>,
        defaultProps: { text: 'Secondary Clear', className: 'button button-clear' },
        atlasClass: 'button button-clear',
        icon: '⚫'
    },
    {
        id: 'atlas-button-secondary-filled',
        name: 'Secondary Filled',
        category: 'input',
        description: 'Secondary filled button - Emphasized secondary action',
        preview: <div className="atlas-button-preview button button-filled">Secondary Filled</div>,
        defaultProps: { text: 'Secondary Filled', className: 'button button-filled' },
        atlasClass: 'button button-filled',
        icon: '⬛'
    },
    {
        id: 'atlas-button-danger',
        name: 'Danger Button',
        category: 'input',
        description: 'Danger button - For destructive actions like delete',
        preview: <div className="atlas-button-preview button button-danger">Delete</div>,
        defaultProps: { text: 'Delete', className: 'button button-danger' },
        atlasClass: 'button button-danger',
        icon: '🔴'
    },
    {
        id: 'atlas-button-success',
        name: 'Success Button',
        category: 'input',
        description: 'Success button - For positive actions like save',
        preview: <div className="atlas-button-preview button button-success button-filled">Save</div>,
        defaultProps: { text: 'Save', className: 'button button-success button-filled' },
        atlasClass: 'button button-success button-filled',
        icon: '🟢'
    },
    {
        id: 'atlas-button-warning',
        name: 'Warning Button',
        category: 'input',
        description: 'Warning button - For cautionary actions',
        preview: <div className="atlas-button-preview button button-warning">Warning</div>,
        defaultProps: { text: 'Warning', className: 'button button-warning' },
        atlasClass: 'button button-warning',
        icon: '🟡'
    },
    {
        id: 'atlas-button-loading',
        name: 'Loading Button',
        category: 'input',
        description: 'Loading state button - Shows processing state',
        preview: <div className="atlas-button-preview button is-loading">Loading...</div>,
        defaultProps: { text: 'Loading...', className: 'button is-loading' },
        atlasClass: 'button is-loading',
        icon: '⏳'
    },
    {
        id: 'atlas-button-small',
        name: 'Small Button',
        category: 'input',
        description: 'Small size button - For compact layouts',
        preview: <div className="atlas-button-preview button button-sm">Small Button</div>,
        defaultProps: { text: 'Small Button', className: 'button button-sm' },
        atlasClass: 'button button-sm',
        icon: '🔸'
    },
    {
        id: 'atlas-button-large',
        name: 'Large Button',
        category: 'input',
        description: 'Large size button - For emphasis',
        preview: <div className="atlas-button-preview button button-lg">Large Button</div>,
        defaultProps: { text: 'Large Button', className: 'button button-lg' },
        atlasClass: 'button button-lg',
        icon: '🔶'
    },
    {
        id: 'atlas-button-block',
        name: 'Block Button',
        category: 'input',
        description: 'Full-width block button - Takes full container width',
        preview: <div className="atlas-button-preview button button-block">Full Width Button</div>,
        defaultProps: { text: 'Full Width Button', className: 'button button-block' },
        atlasClass: 'button button-block',
        icon: '📏'
    },

    // Atlas Form Components - Complete Set
    {
        id: 'atlas-input',
        name: 'Text Input',
        category: 'input',
        description: 'Standard text input field with Atlas styling',
        preview: <div className="atlas-input-preview input">Enter text...</div>,
        defaultProps: { placeholder: 'Enter text...', type: 'text', className: 'input' },
        atlasClass: 'input',
        icon: '📝'
    },
    {
        id: 'atlas-textarea',
        name: 'Textarea',
        category: 'input',
        description: 'Multi-line text input with Atlas styling',
        preview: <div className="atlas-textarea-preview textarea">Enter description...</div>,
        defaultProps: { placeholder: 'Enter description...', rows: 4, className: 'textarea' },
        atlasClass: 'textarea',
        icon: '📄'
    },
    {
        id: 'atlas-select',
        name: 'Select Dropdown',
        category: 'input',
        description: 'Dropdown select with Atlas styling',
        preview: <div className="atlas-select-preview select">Select Option ▼</div>,
        defaultProps: { options: ['Option 1', 'Option 2', 'Option 3'], className: 'select' },
        atlasClass: 'select',
        icon: '📋'
    },
    {
        id: 'atlas-checkbox',
        name: 'Checkbox',
        category: 'input',
        description: 'Checkbox input with Atlas styling',
        preview: <div className="atlas-checkbox-preview checkbox">☑️ Checkbox Option</div>,
        defaultProps: { text: 'Checkbox Option', className: 'checkbox' },
        atlasClass: 'checkbox',
        icon: '☑️'
    },
    {
        id: 'atlas-radio',
        name: 'Radio Button',
        category: 'input',
        description: 'Radio button input with Atlas styling',
        preview: <div className="atlas-radio-preview radio">⚪ Radio Option</div>,
        defaultProps: { text: 'Radio Option', className: 'radio' },
        atlasClass: 'radio',
        icon: '⚪'
    },
    {
        id: 'atlas-toggle',
        name: 'Toggle Switch',
        category: 'input',
        description: 'Toggle switch component with Atlas styling',
        preview: <div className="atlas-toggle-preview toggle">🔘 Toggle Switch</div>,
        defaultProps: { text: 'Toggle Switch', className: 'toggle' },
        atlasClass: 'toggle',
        icon: '🔘'
    },
    {
        id: 'atlas-label',
        name: 'Form Label',
        category: 'input',
        description: 'Form field label with Atlas styling',
        preview: <div className="atlas-label-preview label">Form Label</div>,
        defaultProps: { text: 'Form Label', className: 'label' },
        atlasClass: 'label',
        icon: '🏷️'
    },

    // Atlas Navigation Components
    {
        id: 'atlas-breadcrumb',
        name: 'Breadcrumb',
        category: 'navigation',
        description: 'Breadcrumb navigation component',
        preview: <div className="atlas-breadcrumb-preview">Home › Category › Page</div>,
        defaultProps: { items: ['Home', 'Category', 'Current Page'], className: 'breadcrumb' },
        atlasClass: 'breadcrumb',
        icon: '🍞'
    },
    {
        id: 'atlas-site-header',
        name: 'Site Header',
        category: 'navigation',
        description: 'Main site header with Microsoft Learn styling',
        preview: <div className="atlas-nav-preview site-header">
            <div className="site-header-brand">Microsoft Learn</div>
            <div className="site-header-nav">Home | About | Contact</div>
        </div>,
        defaultProps: { brand: 'Microsoft Learn', items: ['Home', 'About', 'Contact'], className: 'site-header' },
        atlasClass: 'site-header',
        icon: '🧭'
    },
    {
        id: 'atlas-pagination',
        name: 'Pagination',
        category: 'navigation',
        description: 'Page navigation component',
        preview: <div className="atlas-pagination-preview">← 1 2 3 →</div>,
        defaultProps: { currentPage: 2, totalPages: 5, className: 'pagination' },
        atlasClass: 'pagination',
        icon: '📃'
    },

    // Atlas Content Components
    {
        id: 'atlas-card',
        name: 'Card',
        category: 'content',
        description: 'Content card with shadow and Microsoft Learn styling',
        preview: <div className="atlas-card-preview card">
            <div className="card-content">
                <div className="card-title">Card Title</div>
                <div className="card-content-description">Card content goes here...</div>
            </div>
        </div>,
        defaultProps: { title: 'Card Title', content: 'Card content', className: 'card' },
        atlasClass: 'card',
        icon: '🗃️'
    },
    {
        id: 'atlas-gradient-card',
        name: 'Gradient Card',
        category: 'content',
        description: 'Card with gradient background styling',
        preview: <div className="atlas-gradient-card-preview">
            <div className="gradient-card-title">Gradient Card</div>
            <div className="gradient-card-content">Special content card</div>
        </div>,
        defaultProps: { title: 'Gradient Card', className: 'gradient-card' },
        atlasClass: 'gradient-card',
        icon: '🌈'
    },
    {
        id: 'atlas-hero',
        name: 'Hero Section',
        category: 'content',
        description: 'Hero section layout with Microsoft Learn styling',
        preview: <div className="atlas-hero-preview hero">
            <div className="hero-title">Hero Title</div>
            <div className="hero-subtitle">Hero description text</div>
        </div>,
        defaultProps: { title: 'Hero Title', subtitle: 'Hero description', className: 'hero' },
        atlasClass: 'hero',
        icon: '🎯'
    },
    {
        id: 'atlas-banner',
        name: 'Banner',
        category: 'content',
        description: 'Information banner component',
        preview: <div className="atlas-banner-preview banner">📢 Important announcement</div>,
        defaultProps: { message: 'Important announcement', className: 'banner' },
        atlasClass: 'banner',
        icon: '📢'
    },
    {
        id: 'atlas-accordion',
        name: 'Accordion',
        category: 'content',
        description: 'Collapsible content accordion',
        preview: <div className="atlas-accordion-preview accordion">▼ Accordion Section</div>,
        defaultProps: { title: 'Accordion Section', className: 'accordion' },
        atlasClass: 'accordion',
        icon: '📁'
    },

    // Atlas Feedback Components
    {
        id: 'atlas-message',
        name: 'Message',
        category: 'feedback',
        description: 'Status message component',
        preview: <div className="atlas-message-preview message">ℹ️ Information message</div>,
        defaultProps: { message: 'Information message', type: 'info', className: 'message' },
        atlasClass: 'message',
        icon: 'ℹ️'
    },
    {
        id: 'atlas-notification',
        name: 'Notification',
        category: 'feedback',
        description: 'Notification alert component',
        preview: <div className="atlas-notification-preview notification">🔔 Notification alert</div>,
        defaultProps: { message: 'Notification alert', className: 'notification' },
        atlasClass: 'notification',
        icon: '🔔'
    },
    {
        id: 'atlas-progress-bar',
        name: 'Progress Bar',
        category: 'feedback',
        description: 'Progress indicator component',
        preview: <div className="atlas-progress-preview progress-bar">Progress: 60%</div>,
        defaultProps: { value: 60, max: 100, className: 'progress-bar' },
        atlasClass: 'progress-bar',
        icon: '📊'
    },
    {
        id: 'atlas-badge',
        name: 'Badge',
        category: 'feedback',
        description: 'Small status or count badge',
        preview: <div className="atlas-badge-preview badge">New</div>,
        defaultProps: { text: 'New', variant: 'primary', className: 'badge' },
        atlasClass: 'badge',
        icon: '🏷️'
    },
    {
        id: 'atlas-tag',
        name: 'Tag',
        category: 'feedback',
        description: 'Content tag or label',
        preview: <div className="atlas-tag-preview tag">JavaScript</div>,
        defaultProps: { text: 'JavaScript', className: 'tag' },
        atlasClass: 'tag',
        icon: '🔖'
    },

    // Atlas Layout Components
    {
        id: 'atlas-container',
        name: 'Container',
        category: 'layout',
        description: 'Content container with max width and centering',
        preview: <div className="atlas-layout-preview atlas-container-preview">Content Container</div>,
        defaultProps: { maxWidth: '1200px', className: 'container' },
        atlasClass: 'container',
        icon: '📦'
    },
    {
        id: 'atlas-flex-layout',
        name: 'Flex Layout',
        category: 'layout',
        description: 'Flexbox layout container',
        preview: <div className="atlas-layout-preview atlas-flex-preview">Flex Layout</div>,
        defaultProps: { direction: 'row', gap: '16px', className: 'display-flex gap-sm' },
        atlasClass: 'display-flex',
        icon: '📐'
    },
    {
        id: 'atlas-grid-layout',
        name: 'Grid Layout',
        category: 'layout',
        description: 'CSS Grid layout container',
        preview: <div className="atlas-layout-preview atlas-grid-preview">Grid Layout</div>,
        defaultProps: { columns: 3, gap: '24px', className: 'display-grid gap-md' },
        atlasClass: 'display-grid',
        icon: '🔲'
    },

    // Atlas Data Components
    {
        id: 'atlas-table',
        name: 'Table',
        category: 'data',
        description: 'Data table with Atlas styling',
        preview: <div className="atlas-table-preview table">
            <div>Header 1 | Header 2</div>
            <div>Data 1 | Data 2</div>
        </div>,
        defaultProps: { headers: ['Header 1', 'Header 2'], className: 'table' },
        atlasClass: 'table',
        icon: '📋'
    },
    {
        id: 'atlas-steps',
        name: 'Steps',
        category: 'data',
        description: 'Step-by-step process indicator',
        preview: <div className="atlas-steps-preview steps">1 → 2 → 3</div>,
        defaultProps: { currentStep: 2, totalSteps: 3, className: 'steps' },
        atlasClass: 'steps',
        icon: '🔢'
    },
    {
        id: 'atlas-timeline',
        name: 'Timeline',
        category: 'data',
        description: 'Timeline or chronological display',
        preview: <div className="atlas-timeline-preview timeline">Timeline Item</div>,
        defaultProps: { items: ['Event 1', 'Event 2'], className: 'timeline' },
        atlasClass: 'timeline',
        icon: '📅'
    },

    // Atlas Media Components
    {
        id: 'atlas-image',
        name: 'Image',
        category: 'media',
        description: 'Responsive image with caption support',
        preview: <div className="atlas-image-preview">
            <div className="image-placeholder">🖼️</div>
            <div className="image-caption">Image caption</div>
        </div>,
        defaultProps: { alt: 'Image', caption: 'Image caption', className: 'image' },
        atlasClass: 'image',
        icon: '🖼️'
    },
    {
        id: 'atlas-media',
        name: 'Media Object',
        category: 'media',
        description: 'Media object pattern with image and content',
        preview: <div className="atlas-media-preview media">
            <div>📷 Media Content</div>
        </div>,
        defaultProps: { src: '', content: 'Media content', className: 'media' },
        atlasClass: 'media',
        icon: '📷'
    }
];

const CATEGORIES = [
    { key: 'all', label: 'All Components', icon: '📦' },
    { key: 'input', label: 'Input & Forms', icon: '📝' },
    { key: 'layout', label: 'Layout', icon: '📐' },
    { key: 'navigation', label: 'Navigation', icon: '🧭' },
    { key: 'content', label: 'Content', icon: '📄' },
    { key: 'feedback', label: 'Feedback', icon: '💬' },
    { key: 'data', label: 'Data Display', icon: '📊' },
    { key: 'media', label: 'Media', icon: '🖼️' }
];

const AtlasComponentLibrary: React.FC<AtlasComponentLibraryProps> = ({
    isOpen,
    onClose,
    onAddComponent
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredComponents = ATLAS_COMPONENTS.filter(component => {
        const matchesSearch =
            component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (component.atlasClass && component.atlasClass.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleComponentClick = (component: ComponentLibraryItem) => {
        console.log('🔧 AtlasComponentLibrary: Component clicked:', component.name);
        console.log('🔧 AtlasComponentLibrary: onAddComponent function:', typeof onAddComponent);
        if (onAddComponent) {
            console.log('🔧 AtlasComponentLibrary: Calling onAddComponent...');
            onAddComponent(component);
        } else {
            console.error('🔧 AtlasComponentLibrary: onAddComponent is not defined!');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="component-library-overlay">
            <div className="component-library-modal">
                {/* Header */}
                <div className="component-library-header">
                    <div className="header-left">
                        <h2>Atlas Design System Components</h2>
                        <p>Official Microsoft Learn components - Click to add to your wireframe</p>
                    </div>
                    <div className="header-right">
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
                            placeholder="Search Atlas components..."
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
                                {selectedCategory === 'all' ? 'All Atlas Components' :
                                    CATEGORIES.find(c => c.key === selectedCategory)?.label}
                            </h3>
                            <span className="components-count">
                                {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="components-container list">
                            {filteredComponents.length === 0 ? (
                                <div className="no-components">
                                    <p>No Atlas components found</p>
                                    <small>Try adjusting your search or category filter</small>
                                </div>
                            ) : (
                                filteredComponents.map(component => (
                                    <div
                                        key={component.id}
                                        className="component-item"
                                        onClick={() => handleComponentClick(component)}
                                        title={`Click to add ${component.name} to wireframe`}
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
                                                {component.atlasClass && (
                                                    <span className="atlas-class">.{component.atlasClass}</span>
                                                )}
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
                        <small>💡 Official Microsoft Atlas Design System components with proper class names</small>
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

export default AtlasComponentLibrary;
