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
    onGenerateWithAI?: (description: string) => void;
    currentDescription?: string;
}

const ComponentLibraryModal: React.FC<ComponentLibraryModalProps> = ({
    isOpen,
    onClose,
    onAddComponent,
    onGenerateWithAI,
    currentDescription
}) => {
    if (!isOpen) return null;

    // Debug: Check if AI button should show
    console.log('🔍 ComponentLibraryModal debug:', {
        onGenerateWithAI: !!onGenerateWithAI,
        currentDescription,
        shouldShowAIButton: !!(onGenerateWithAI && currentDescription)
    }); const components: Component[] = [
        // Microsoft Learn Site Headers
        {
            id: 'ms-learn-header-basic',
            name: 'Microsoft Learn Site Header',
            description: 'Official Microsoft Learn site header with logo and brand',
            category: 'Navigation',
            htmlCode: `<div style="display: flex; align-items: center; padding: 12px 24px; background: white; border-bottom: 1px solid #e1e5e9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
    <!-- Microsoft logo -->
    <a href="https://www.microsoft.com" aria-label="Microsoft" style="display: flex; align-items: center; margin-right: 16px; text-decoration: none;">
        <svg aria-hidden="true" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px;">
            <path d="M11.5216 0.5H0V11.9067H11.5216V0.5Z" fill="#f25022" />
            <path d="M24.2418 0.5H12.7202V11.9067H24.2418V0.5Z" fill="#7fba00" />
            <path d="M11.5216 13.0933H0V24.5H11.5216V13.0933Z" fill="#00a4ef" />
            <path d="M24.2418 13.0933H12.7202V24.5H24.2418V13.0933Z" fill="#ffb900" />
        </svg>
    </a>

    <!-- Divider -->
    <div style="width: 1px; height: 24px; background: #e1e5e9; margin-right: 16px;"></div>

    <!-- Brand -->
    <a href="#" style="color: #323130; text-decoration: none; font-weight: 600; font-size: 16px; margin-right: auto;">
        <span>Microsoft Learn</span>
    </a>

    <!-- Navigation -->
    <nav aria-label="site header navigation" style="display: flex; align-items: center; gap: 8px;">
        <a href="#" style="color: #323130; text-decoration: none; padding: 8px 12px; border-radius: 4px; transition: background 0.2s; font-size: 14px;">Documentation</a>
        <a href="#" style="color: #323130; text-decoration: none; padding: 8px 12px; border-radius: 4px; transition: background 0.2s; font-size: 14px;">Training</a>
        <a href="#" style="color: #323130; text-decoration: none; padding: 8px 12px; border-radius: 4px; transition: background 0.2s; font-size: 14px;">Certifications</a>
    </nav>
</div>`
        },
        {
            id: 'ms-learn-header-centered',
            name: 'Microsoft Learn Header (Centered Logo)',
            description: 'Microsoft Learn header with centered logo layout',
            category: 'Navigation',
            htmlCode: `<div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; background: white; border-bottom: 1px solid #e1e5e9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
    <!-- Brand -->
    <a href="#" style="color: #323130; text-decoration: none; font-weight: 600; font-size: 16px;">
        <span>Microsoft Learn</span>
    </a>

    <!-- Centered Microsoft logo -->
    <a href="https://www.microsoft.com" aria-label="Microsoft" style="display: flex; align-items: center; text-decoration: none;">
        <svg aria-hidden="true" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px;">
            <path d="M11.5216 0.5H0V11.9067H11.5216V0.5Z" fill="#f25022" />
            <path d="M24.2418 0.5H12.7202V11.9067H24.2418V0.5Z" fill="#7fba00" />
            <path d="M11.5216 13.0933H0V24.5H11.5216V13.0933Z" fill="#00a4ef" />
            <path d="M24.2418 13.0933H12.7202V24.5H24.2418V13.0933Z" fill="#ffb900" />
        </svg>
    </a>

    <a href="#" style="color: #0078d4; text-decoration: none; font-size: 14px; padding: 6px 12px; border: 1px solid #0078d4; border-radius: 4px; transition: all 0.2s;">
        <span>Sign in</span>
    </a>
</div>`
        },
        {
            id: 'ms-learn-header-with-nav',
            name: 'Microsoft Learn Header with Extended Nav',
            description: 'Full Microsoft Learn header with comprehensive navigation',
            category: 'Navigation',
            htmlCode: `<div style="background: white; border-bottom: 1px solid #e1e5e9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
    <!-- Main header -->
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 24px;">
        <!-- Left section -->
        <div style="display: flex; align-items: center;">
            <!-- Microsoft logo -->
            <a href="https://www.microsoft.com" aria-label="Microsoft" style="display: flex; align-items: center; margin-right: 16px; text-decoration: none;">
                <svg aria-hidden="true" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px;">
                    <path d="M11.5216 0.5H0V11.9067H11.5216V0.5Z" fill="#f25022" />
                    <path d="M24.2418 0.5H12.7202V11.9067H24.2418V0.5Z" fill="#7fba00" />
                    <path d="M11.5216 13.0933H0V24.5H11.5216V13.0933Z" fill="#00a4ef" />
                    <path d="M24.2418 13.0933H12.7202V24.5H24.2418V13.0933Z" fill="#ffb900" />
                </svg>
            </a>

            <!-- Divider -->
            <div style="width: 1px; height: 24px; background: #e1e5e9; margin-right: 16px;"></div>

            <!-- Brand -->
            <a href="#" style="color: #323130; text-decoration: none; font-weight: 600; font-size: 16px;">
                <span>Microsoft Learn</span>
            </a>
        </div>

        <!-- Right section -->
        <div style="display: flex; align-items: center; gap: 16px;">
            <button style="background: none; border: none; color: #323130; cursor: pointer; padding: 8px; border-radius: 4px; font-size: 14px;">🔍 Search</button>
            <a href="#" style="color: #0078d4; text-decoration: none; font-size: 14px; padding: 6px 12px; border: 1px solid #0078d4; border-radius: 4px;">Sign in</a>
        </div>
    </div>

    <!-- Secondary navigation -->
    <div style="padding: 0 24px; border-top: 1px solid #f3f2f1;">
        <nav style="display: flex; gap: 32px; padding: 12px 0;">
            <a href="#" style="color: #323130; text-decoration: none; font-size: 14px; padding: 8px 0; border-bottom: 2px solid transparent; transition: border-color 0.2s;">Browse</a>
            <a href="#" style="color: #323130; text-decoration: none; font-size: 14px; padding: 8px 0; border-bottom: 2px solid transparent; transition: border-color 0.2s;">Learning Paths</a>
            <a href="#" style="color: #323130; text-decoration: none; font-size: 14px; padding: 8px 0; border-bottom: 2px solid transparent; transition: border-color 0.2s;">Modules</a>
            <a href="#" style="color: #323130; text-decoration: none; font-size: 14px; padding: 8px 0; border-bottom: 2px solid #0078d4;">Certifications</a>
            <a href="#" style="color: #323130; text-decoration: none; font-size: 14px; padding: 8px 0; border-bottom: 2px solid transparent; transition: border-color 0.2s;">Q&A</a>
        </nav>
    </div>
</div>`
        },
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
            name: 'Microsoft Learn Header',
            description: 'Microsoft Learn site header with navigation',
            category: 'Navigation',
            htmlCode: `
              <header class="docs-header" style="background: #f8f9fa; padding: 12px 0; border-bottom: 1px solid #e1e4e8;">
                <div class="docs-header-container" style="max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between;">
                  <div class="docs-header-brand" style="display: flex; align-items: center; gap: 12px;">
                    <svg width="24" height="24" fill="#0078d4" viewBox="0 0 24 24">
                      <path d="M11.25 4.533a9.707 9.707 0 00-6.984 2.708L3.482 6.457C5.283 4.457 8.145 3.25 11.25 3.25s5.967 1.207 7.768 3.207l-.784.784A9.707 9.707 0 0011.25 4.533zM18.017 8.017L17.233 8.8a8.25 8.25 0 00-11.966 0l-.784-.784a9.75 9.75 0 0113.534 0zM15.516 10.516L14.732 11.3a5.25 5.25 0 00-7.464 0l-.784-.784a6.75 6.75 0 019.032 0zM13.016 13.016L12.232 13.8a2.25 2.25 0 00-3.464 0l-.784-.784a3.75 3.75 0 015.032 0z"/>
                    </svg>
                    <span style="font-size: 16px; font-weight: 600; color: #24292f;">Microsoft Learn</span>
                  </div>
                  <nav class="docs-header-nav" style="display: flex; align-items: center; gap: 24px;">
                    <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Documentation</a>
                    <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Learning Paths</a>
                    <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Certifications</a>
                    <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Q&A</a>
                    <button style="background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer;">Sign in</button>
                  </nav>
                </div>
              </header>
            `
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

                    {/* AI Generation Option */}
                    {onGenerateWithAI && currentDescription && (
                        <div className="ai-generation-section">
                            <h3>Or Generate with AI</h3>
                            <p>
                                Skip the component selection and let AI generate a complete wireframe for: "<em>{currentDescription}</em>"
                            </p>
                            <button
                                onClick={() => {
                                    onGenerateWithAI(currentDescription);
                                    onClose();
                                }}
                                className="ai-generation-button"
                            >
                                🤖 Generate with AI
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComponentLibraryModal;
