import React, { useState } from 'react';
import { FiImage, FiPlay, FiZap } from 'react-icons/fi';
import './DemoImageSelector.css';

interface DemoImage {
    id: string;
    name: string;
    path: string;
    description: string;
    wireframeType: string;
}

interface DemoImageSelectorProps {
    onDemoGenerate: (imagePath: string, description: string) => void;
    isGenerating?: boolean;
}

const DemoImageSelector: React.FC<DemoImageSelectorProps> = ({
    onDemoGenerate,
    isGenerating = false
}) => {
    const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

    const demoImages: DemoImage[] = [
        {
            id: 'microsoft-learn',
            name: 'Microsoft Learn Course Page',
            path: '/Hero300.png',
            description: 'Microsoft Learn course page with navigation, hero section, and course cards using our actual template',
            wireframeType: 'microsoft-learn'
        },
        {
            id: 'microsoft-docs',
            name: 'Microsoft Documentation Page',
            path: '/azure.png',
            description: 'Microsoft documentation page with sidebar, breadcrumbs, and content sections',
            wireframeType: 'microsoft-docs'
        },
        {
            id: 'dashboard',
            name: 'Admin Dashboard',
            path: '/windowsLogo.png',
            description: 'Modern dashboard with charts, widgets, and data visualization',
            wireframeType: 'dashboard'
        },
        {
            id: 'ecommerce',
            name: 'E-commerce Product Page',
            path: '/module.png',
            description: 'Product page with images, details, and purchase options',
            wireframeType: 'ecommerce'
        }
    ];

    const handleDemoSelect = (demo: DemoImage) => {
        setSelectedDemo(demo.id);

        // Generate demo wireframe based on the selected image
        let enhancedDescription = '';

        if (demo.id === 'microsoft-learn') {
            // Use our actual Microsoft Learn template
            enhancedDescription = 'Microsoft Learn course page';
        } else if (demo.id === 'microsoft-docs') {
            // Use our actual Microsoft Docs template
            enhancedDescription = 'Microsoft documentation page';
        } else {
            // Generic descriptions for other demos
            enhancedDescription = demo.name;
        }

        onDemoGenerate(demo.path, enhancedDescription);
    };

    return (
        <div className="demo-image-selector">
            <div className="demo-header">
                <h3>
                    <FiZap className="demo-icon" />
                    Quick Demo Wireframes
                </h3>
                <p>Generate wireframes instantly from common UI patterns</p>
            </div>

            <div className="demo-grid">
                {demoImages.map((demo) => (
                    <div
                        key={demo.id}
                        className={`demo-card ${selectedDemo === demo.id ? 'selected' : ''} ${isGenerating && selectedDemo === demo.id ? 'generating' : ''}`}
                        onClick={() => !isGenerating && handleDemoSelect(demo)}
                    >
                        <div className="demo-image-container">
                            <img
                                src={demo.path}
                                alt={demo.name}
                                className="demo-image"
                                onError={(e) => {
                                    // Fallback to icon if image fails to load
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                            <FiImage className="demo-fallback-icon" />
                        </div>

                        <div className="demo-info">
                            <h4 className="demo-name">{demo.name}</h4>
                            <p className="demo-description">{demo.description}</p>
                        </div>

                        <div className="demo-action">
                            {isGenerating && selectedDemo === demo.id ? (
                                <span className="generating-text">
                                    <div className="spinner"></div>
                                    Generating...
                                </span>
                            ) : (
                                <button className="demo-btn">
                                    <FiPlay />
                                    Generate
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="demo-note">
                <p>💡 These are pre-configured wireframes for quick demonstrations. Each generates a different layout type with Microsoft's #e8e6df hero styling.</p>
            </div>
        </div>
    );
};

export default DemoImageSelector;
