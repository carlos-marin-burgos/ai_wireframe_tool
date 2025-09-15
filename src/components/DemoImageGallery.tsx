import React, { useState, useCallback } from 'react';
import { FiStar, FiTarget, FiEye, FiCheck } from 'react-icons/fi';
import './DemoImageGallery.css';

interface DemoImage {
    id: string;
    name: string;
    url: string;
    description: string;
    category: 'landing-page' | 'dashboard' | 'mobile-app' | 'form' | 'ecommerce';
    accuracy: number;
    components: number;
    complexity: 'simple' | 'medium' | 'complex';
    features: string[];
    mockResults: {
        detectedComponents: string[];
        colorsPalette: string[];
        layoutType: string;
        confidenceScore: number;
        processingTime: string;
    };
}

const DEMO_IMAGES: DemoImage[] = [
    {
        id: 'hero-landing',
        name: 'Hero Landing Page',
        url: '/demo-images/hero-landing.png',
        description: 'Clean landing page with hero section, navigation, and call-to-action buttons',
        category: 'landing-page',
        accuracy: 97,
        components: 8,
        complexity: 'simple',
        features: ['High Contrast', 'Clear Typography', 'Minimal Layout'],
        mockResults: {
            detectedComponents: ['Navigation Bar', 'Hero Section', 'CTA Button', 'Feature Cards', 'Footer'],
            colorsPalette: ['#0078D4', '#FFFFFF', '#323130', '#107C10'],
            layoutType: 'Single Column with Grid',
            confidenceScore: 0.97,
            processingTime: '2.3s'
        }
    },
    {
        id: 'admin-dashboard',
        name: 'Admin Dashboard',
        url: '/demo-images/admin-dashboard.png',
        description: 'Complex dashboard with charts, tables, sidebar navigation, and data visualization',
        category: 'dashboard',
        accuracy: 94,
        components: 15,
        complexity: 'complex',
        features: ['Data Tables', 'Charts', 'Sidebar Nav', 'Multi-column'],
        mockResults: {
            detectedComponents: ['Sidebar Nav', 'Header Bar', 'Data Cards', 'Chart Container', 'Data Table', 'Action Buttons'],
            colorsPalette: ['#0078D4', '#F3F2F1', '#323130', '#D83B01', '#107C10'],
            layoutType: 'Multi-column with Sidebar',
            confidenceScore: 0.94,
            processingTime: '4.1s'
        }
    },
    {
        id: 'mobile-shopping',
        name: 'Mobile Shopping App',
        url: '/demo-images/mobile-shopping.png',
        description: 'Mobile e-commerce interface with product grid, search, and bottom navigation',
        category: 'mobile-app',
        accuracy: 96,
        components: 12,
        complexity: 'medium',
        features: ['Mobile Optimized', 'Touch Targets', 'Bottom Nav', 'Product Grid'],
        mockResults: {
            detectedComponents: ['Search Bar', 'Product Grid', 'Product Cards', 'Bottom Navigation', 'Filter Buttons'],
            colorsPalette: ['#0078D4', '#FFFFFF', '#323130', '#E74C3C'],
            layoutType: 'Mobile Grid Layout',
            confidenceScore: 0.96,
            processingTime: '3.2s'
        }
    },
    {
        id: 'contact-form',
        name: 'Contact Form',
        url: '/demo-images/contact-form.png',
        description: 'Simple contact form with validation, inputs, and submit button',
        category: 'form',
        accuracy: 99,
        components: 6,
        complexity: 'simple',
        features: ['Form Validation', 'Input Fields', 'Clear Labels', 'Submit Button'],
        mockResults: {
            detectedComponents: ['Form Container', 'Text Inputs', 'Textarea', 'Submit Button', 'Validation Messages'],
            colorsPalette: ['#0078D4', '#FFFFFF', '#323130', '#D83B01'],
            layoutType: 'Centered Form Layout',
            confidenceScore: 0.99,
            processingTime: '1.8s'
        }
    },
    {
        id: 'ecommerce-product',
        name: 'Product Detail Page',
        url: '/demo-images/ecommerce-product.png',
        description: 'E-commerce product page with image gallery, specifications, and purchase options',
        category: 'ecommerce',
        accuracy: 95,
        components: 11,
        complexity: 'medium',
        features: ['Image Gallery', 'Product Info', 'Price Display', 'Add to Cart'],
        mockResults: {
            detectedComponents: ['Product Images', 'Product Title', 'Price Display', 'Add to Cart Button', 'Product Details', 'Reviews Section'],
            colorsPalette: ['#0078D4', '#FFFFFF', '#323130', '#107C10', '#FF8C00'],
            layoutType: 'Two-column Product Layout',
            confidenceScore: 0.95,
            processingTime: '3.7s'
        }
    }
];

interface DemoImageGalleryProps {
    onSelectDemo: (demoImage: DemoImage) => void;
    selectedDemo?: string | null;
}

const DemoImageGallery: React.FC<DemoImageGalleryProps> = ({ onSelectDemo, selectedDemo }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [hoveredImage, setHoveredImage] = useState<string | null>(null);

    const categories = [
        { id: 'all', label: 'All Examples', icon: '🎯' },
        { id: 'landing-page', label: 'Landing Pages', icon: '🏠' },
        { id: 'dashboard', label: 'Dashboards', icon: '📊' },
        { id: 'mobile-app', label: 'Mobile Apps', icon: '📱' },
        { id: 'form', label: 'Forms', icon: '📝' },
        { id: 'ecommerce', label: 'E-commerce', icon: '🛒' }
    ];

    const filteredImages = selectedCategory === 'all'
        ? DEMO_IMAGES
        : DEMO_IMAGES.filter(img => img.category === selectedCategory);

    const getAccuracyColor = (accuracy: number) => {
        if (accuracy >= 95) return '#107C10'; // Green
        if (accuracy >= 90) return '#FF8C00'; // Orange
        return '#D83B01'; // Red
    };

    const getComplexityBadge = (complexity: string) => {
        const badges = {
            simple: { label: 'Simple', color: '#107C10' },
            medium: { label: 'Medium', color: '#FF8C00' },
            complex: { label: 'Complex', color: '#D83B01' }
        };
        return badges[complexity as keyof typeof badges] || badges.simple;
    };

    const handleSelectDemo = useCallback((demoImage: DemoImage) => {
        onSelectDemo(demoImage);
    }, [onSelectDemo]);

    return (
        <div className="demo-gallery">
            <div className="demo-gallery-header">
                <div className="demo-title">
                    <FiStar className="demo-icon" />
                    <h3>Demo Gallery - Curated Examples</h3>
                </div>
                <p className="demo-description">
                    Select a pre-analyzed example to see our accuracy capabilities in action
                </p>
            </div>

            {/* Category Filter */}
            <div className="category-filters">
                {categories.map(category => (
                    <button
                        key={category.id}
                        className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category.id)}
                    >
                        <span className="category-emoji">{category.icon}</span>
                        {category.label}
                    </button>
                ))}
            </div>

            {/* Demo Images Grid */}
            <div className="demo-images-grid">
                {filteredImages.map(demoImage => {
                    const complexityBadge = getComplexityBadge(demoImage.complexity);
                    const isSelected = selectedDemo === demoImage.id;
                    const isHovered = hoveredImage === demoImage.id;

                    return (
                        <div
                            key={demoImage.id}
                            className={`demo-image-card ${isSelected ? 'selected' : ''}`}
                            onMouseEnter={() => setHoveredImage(demoImage.id)}
                            onMouseLeave={() => setHoveredImage(null)}
                            onClick={() => handleSelectDemo(demoImage)}
                        >
                            {/* Image Preview */}
                            <div className="demo-image-preview">
                                <div className={`demo-image-placeholder ${demoImage.category}`}>
                                    {demoImage.category === 'landing-page' && (
                                        <div className="landing-page-mockup">
                                            <div className="mockup-nav"></div>
                                            <div className="mockup-content"></div>
                                            <div className="mockup-footer"></div>
                                        </div>
                                    )}
                                    {demoImage.category === 'dashboard' && (
                                        <div className="dashboard-mockup">
                                            <div className="mockup-sidebar"></div>
                                            <div className="mockup-main">
                                                <div className="mockup-charts"></div>
                                                <div className="mockup-stats"></div>
                                            </div>
                                        </div>
                                    )}
                                    {demoImage.category === 'mobile-app' && (
                                        <div className="mobile-app-mockup">
                                            <div className="mockup-status"></div>
                                            <div className="mockup-header"></div>
                                            <div className="mockup-body">
                                                <div className="mockup-item"></div>
                                                <div className="mockup-item"></div>
                                                <div className="mockup-item"></div>
                                                <div className="mockup-item"></div>
                                            </div>
                                            <div className="mockup-tabs"></div>
                                        </div>
                                    )}
                                    {demoImage.category === 'form' && (
                                        <div className="form-mockup">
                                            <div className="mockup-title"></div>
                                            <div className="mockup-field"></div>
                                            <div className="mockup-field"></div>
                                            <div className="mockup-textarea"></div>
                                            <div className="mockup-button"></div>
                                        </div>
                                    )}
                                    {demoImage.category === 'ecommerce' && (
                                        <div className="ecommerce-mockup">
                                            <div className="mockup-image"></div>
                                            <div className="mockup-info">
                                                <div className="mockup-name"></div>
                                                <div className="mockup-price"></div>
                                                <div className="mockup-actions">
                                                    <div className="mockup-cart"></div>
                                                    <div className="mockup-buy"></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {isSelected && (
                                    <div className="selected-overlay">
                                        <FiCheck className="check-icon" />
                                    </div>
                                )}
                            </div>

                            {/* Image Info */}
                            <div className="demo-image-info">
                                <div className="demo-image-header">
                                    <h4 className="demo-image-title">{demoImage.name}</h4>
                                    <div className="demo-badges">
                                        <span
                                            className="accuracy-badge"
                                            style={{ '--accuracy-color': getAccuracyColor(demoImage.accuracy) } as React.CSSProperties}
                                        >
                                            <FiTarget className="badge-icon" />
                                            {demoImage.accuracy}%
                                        </span>
                                        <span
                                            className="complexity-badge"
                                            style={{ '--complexity-color': complexityBadge.color } as React.CSSProperties}
                                        >
                                            {complexityBadge.label}
                                        </span>
                                    </div>
                                </div>

                                <p className="demo-image-description">{demoImage.description}</p>

                                {/* Stats Row */}
                                <div className="demo-stats">
                                    <div className="stat">
                                        <span className="stat-value">{demoImage.components}</span>
                                        <span className="stat-label">Components</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-value">{demoImage.mockResults.processingTime}</span>
                                        <span className="stat-label">Process Time</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-value">{demoImage.mockResults.layoutType}</span>
                                        <span className="stat-label">Layout</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="demo-features">
                                    {demoImage.features.map(feature => (
                                        <span key={feature} className="feature-tag">{feature}</span>
                                    ))}
                                </div>

                                {/* Hover Details */}
                                {isHovered && (
                                    <div className="hover-details">
                                        <div className="detail-section">
                                            <strong>Detected Components:</strong>
                                            <div className="component-list">
                                                {demoImage.mockResults.detectedComponents.map(comp => (
                                                    <span key={comp} className="component-chip">{comp}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="detail-section">
                                            <strong>Color Palette:</strong>
                                            <div className="color-palette">
                                                {demoImage.mockResults.colorsPalette.map(color => (
                                                    <div
                                                        key={color}
                                                        className="color-swatch"
                                                        data-color={color}
                                                        title={color}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredImages.length === 0 && (
                <div className="no-results">
                    <p>No demo images found for the selected category.</p>
                </div>
            )}
        </div>
    );
};

export default DemoImageGallery;