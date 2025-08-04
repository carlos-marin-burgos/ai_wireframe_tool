import React from 'react';
import './ComponentLibraryModal.css';
import { generateHeroHTML } from './HeroGenerator';
import { generateFormHTML, FormTemplates } from './FormGenerator';

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
    if (!isOpen) return null; const components: Component[] = [
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
            id: 'form-contact',
            name: 'Contact Form',
            description: 'Microsoft Learn contact form with validation',
            category: 'Forms',
            htmlCode: generateFormHTML(FormTemplates.find(t => t.id === 'contact')!)
        },
        {
            id: 'form-feedback',
            name: 'Feedback Form',
            description: 'Microsoft Learn feedback form with radio buttons',
            category: 'Forms',
            htmlCode: generateFormHTML(FormTemplates.find(t => t.id === 'feedback') || FormTemplates[0])
        },
        {
            id: 'form-registration',
            name: 'Registration Form',
            description: 'Microsoft Learn registration form with validation',
            category: 'Forms',
            htmlCode: generateFormHTML(FormTemplates.find(t => t.id === 'registration')!)
        },
        {
            id: 'form-survey',
            name: 'Survey Form',
            description: 'Microsoft Learn survey form with various inputs',
            category: 'Forms',
            htmlCode: generateFormHTML(FormTemplates.find(t => t.id === 'survey') || FormTemplates[0])
        },
        {
            id: 'form-input-text',
            name: 'Text Input Field',
            description: 'Microsoft Learn text input with proper styling',
            category: 'Forms',
            htmlCode: generateFormHTML({
                id: 'sample-input-form',
                name: 'Sample Input Form',
                description: 'Example form with text input',
                fields: [{
                    id: 'sample-input',
                    name: 'input',
                    label: 'Input Label',
                    type: 'text',
                    required: true,
                    placeholder: 'Enter text here...',
                    description: 'This is a helpful description for the input field'
                }],
                submitText: 'Submit'
            })
        },
        {
            id: 'form-textarea',
            name: 'Textarea Field',
            description: 'Microsoft Learn textarea with validation',
            category: 'Forms',
            htmlCode: generateFormHTML({
                id: 'sample-textarea-form',
                name: 'Sample Textarea Form',
                description: 'Example form with textarea',
                fields: [{
                    id: 'sample-textarea',
                    name: 'textarea',
                    label: 'Textarea Label',
                    type: 'textarea',
                    required: true,
                    placeholder: 'Enter your message...',
                    rows: 4,
                    minLength: 10
                }],
                submitText: 'Submit'
            })
        },
        {
            id: 'form-select',
            name: 'Select Dropdown',
            description: 'Microsoft Learn select field with options',
            category: 'Forms',
            htmlCode: generateFormHTML({
                id: 'sample-select-form',
                name: 'Sample Select Form',
                description: 'Example form with select',
                fields: [{
                    id: 'sample-select',
                    name: 'select',
                    label: 'Select an Option',
                    type: 'select',
                    required: true,
                    options: ['Option 1', 'Option 2', 'Option 3'],
                    description: 'Choose one of the available options'
                }],
                submitText: 'Submit'
            })
        },
        {
            id: 'form-checkbox',
            name: 'Checkbox Field',
            description: 'Microsoft Learn checkbox with proper styling',
            category: 'Forms',
            htmlCode: generateFormHTML({
                id: 'sample-checkbox-form',
                name: 'Sample Checkbox Form',
                description: 'Example form with checkbox',
                fields: [{
                    id: 'sample-checkbox',
                    name: 'checkbox',
                    label: 'Checkbox Label',
                    type: 'checkbox',
                    required: true,
                    placeholder: 'I agree to the terms and conditions'
                }],
                submitText: 'Submit'
            })
        },
        {
            id: 'form-radio',
            name: 'Radio Button Group',
            description: 'Microsoft Learn radio buttons with validation',
            category: 'Forms',
            htmlCode: generateFormHTML({
                id: 'sample-radio-form',
                name: 'Sample Radio Form',
                description: 'Example form with radio buttons',
                fields: [{
                    id: 'sample-radio',
                    name: 'radio',
                    label: 'Choose an Option',
                    type: 'radio',
                    required: true,
                    options: ['Yes', 'No', 'Maybe']
                }],
                submitText: 'Submit'
            })
        },
        {
            id: 'form-input',
            name: 'Basic Text Input (Legacy)',
            description: 'Simple text input field',
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
            name: 'Microsoft Learn Accent Hero',
            description: 'Microsoft Learn hero section with accent background',
            category: 'Sections',
            htmlCode: generateHeroHTML({
                title: "Build your next great idea",
                summary: "Transform your vision into reality with Microsoft Learn's comprehensive resources and tools.",
                eyebrow: "MICROSOFT LEARN",
                ctaText: "Get Started",
                showSecondaryButton: true,
                secondaryCtaText: "Learn More",
                backgroundColor: "#E8E6DF",
                heroImageUrl: "https://learn.microsoft.com/media/learn/home/hero-learn.svg"
            })
        },
        {
            id: 'atlas-hero',
            name: 'Atlas Hero - Azure',
            description: 'Microsoft Azure themed hero section',
            category: 'Atlas',
            htmlCode: generateHeroHTML({
                title: "Build and deploy with Azure",
                summary: "Create scalable applications with Microsoft Azure cloud services and tools.",
                eyebrow: "MICROSOFT AZURE",
                ctaText: "Get Started",
                showSecondaryButton: true,
                secondaryCtaText: "Learn More",
                backgroundColor: "#E8E6DF",
                heroImageUrl: "https://learn.microsoft.com/media/learn/Product/Microsoft-Azure/azure.svg"
            })
        },
        {
            id: 'atlas-hero-ai',
            name: 'Atlas Hero - AI',
            description: 'AI and machine learning themed hero section',
            category: 'Atlas',
            htmlCode: generateHeroHTML({
                title: "Accelerate innovation with AI",
                summary: "Transform your business with artificial intelligence and machine learning solutions.",
                eyebrow: "AI & MACHINE LEARNING",
                ctaText: "Explore AI",
                showSecondaryButton: false,
                backgroundColor: "#E8E6DF",
                heroImageUrl: "https://learn.microsoft.com/media/learn/Product/Azure/azure-ai.svg"
            })
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
                        <div>
                            <h2>Atlas Component Library</h2>
                            <p className="library-instructions">Click components to add them to your wireframe</p>
                        </div>
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
