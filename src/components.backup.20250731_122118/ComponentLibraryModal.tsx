import React from 'react';
import './ComponentLibraryModal.css';

interface Component {
    id: string;
    name: string;
    description: string;
    category: string;
    htmlCode: string;
    preview?: string;
}

interface ComponentLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddComponent: (component: Component) => void;
}

const ComponentLibraryModal: React.FC<ComponentLibraryModalProps> = ({
    isOpen,
    onClose,
    onAddComponent
}) => {
    if (!isOpen) return null;

    const components: Component[] = [
        {
            id: 'button-primary',
            name: 'Primary Button',
            description: 'Main call-to-action button',
            category: 'Buttons',
            htmlCode: '<button style="background: #0078d4; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-weight: 600;">Click Me</button>'
        },
        {
            id: 'button-secondary',
            name: 'Secondary Button',
            description: 'Secondary action button',
            category: 'Buttons',
            htmlCode: '<button style="background: #f3f2f1; color: #323130; border: 1px solid #e1dfdd; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-weight: 600;">Secondary</button>'
        },
        {
            id: 'card-basic',
            name: 'Basic Card',
            description: 'Simple card layout',
            category: 'Cards',
            htmlCode: '<div style="background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e1e5e9;"><h3 style="margin: 0 0 12px 0; color: #323130;">Card Title</h3><p style="margin: 0; color: #605e5c;">Card content goes here with some descriptive text.</p></div>'
        },
        {
            id: 'form-input',
            name: 'Text Input',
            description: 'Basic text input field',
            category: 'Forms',
            htmlCode: '<div style="margin-bottom: 16px;"><label style="display: block; margin-bottom: 4px; font-weight: 600; color: #323130;">Label:</label><input type="text" style="width: 100%; max-width: 300px; padding: 8px 12px; border: 1px solid #e1dfdd; border-radius: 4px; font-size: 14px;" placeholder="Enter text..."></div>'
        },
        {
            id: 'navigation-header',
            name: 'Header Navigation',
            description: 'Simple header with navigation',
            category: 'Navigation',
            htmlCode: '<header style="background: #0078d4; color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center;"><h1 style="margin: 0; font-size: 24px;">My App</h1><nav style="display: flex; gap: 24px;"><a href="#" style="color: white; text-decoration: none;">Home</a><a href="#" style="color: white; text-decoration: none;">About</a><a href="#" style="color: white; text-decoration: none;">Contact</a></nav></header>'
        },
        {
            id: 'hero-section',
            name: 'Hero Section',
            description: 'Landing page hero section',
            category: 'Sections',
            htmlCode: '<section style="background: linear-gradient(135deg, #0078d4, #106ebe); color: white; text-align: center; padding: 80px 24px;"><h1 style="margin: 0 0 16px 0; font-size: 48px; font-weight: 700;">Welcome to Our App</h1><p style="margin: 0 0 32px 0; font-size: 20px; opacity: 0.9;">Build amazing experiences with our platform</p><button style="background: white; color: #0078d4; border: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">Get Started</button></section>'
        }
    ];

    const handleComponentClick = (component: Component) => {
        console.log('🚀 Component clicked:', component.name);
        onAddComponent(component);
        onClose();
    };

    return (
        <div className="component-library-modal-overlay">
            <div className="component-library-modal">
                <div className="component-library-header">
                    <div className="component-library-title">
                        <img
                            src="/atlas-light.svg"
                            alt="Atlas"
                            className="atlas-logo"
                        />
                        <h2>Atlas Component Library</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="component-library-close"
                    >
                        ×
                    </button>
                </div>

                <div className="component-library-content">
                    <div className="component-library-grid">
                        {components.map(component => (
                            <div
                                key={component.id}
                                onClick={() => handleComponentClick(component)}
                                className="component-item"
                            >
                                <div className="component-preview">
                                    <div
                                        dangerouslySetInnerHTML={{ __html: component.htmlCode }}
                                    />
                                </div>
                                <div className="component-info">
                                    <h4>{component.name}</h4>
                                    <p>{component.description}</p>
                                    <span className="component-category">{component.category}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentLibraryModal;
