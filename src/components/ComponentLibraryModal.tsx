import React, { useState, useMemo } from 'react';
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
            id: 'fluent-select',
            name: 'FluentUI Select',
            description: 'Microsoft FluentUI Select component with dropdown arrow and options',
            category: 'Forms',
            htmlCode: `<div style="max-width: 300px; font-family: 'Segoe UI', Tahoma, Arial, sans-serif;">
    <label style="
        display: block; 
        margin-bottom: 4px; 
        font-size: 14px; 
        font-weight: 600; 
        color: #323130;
    ">Select an option</label>
    
    <div style="position: relative;">
        <select style="
            width: 100%;
            height: 32px;
            padding: 4px 24px 4px 8px;
            border: 1px solid #8a8886;
            border-radius: 2px;
            background: white;
            font-size: 14px;
            font-family: inherit;
            color: #323130;
            cursor: pointer;
            outline: none;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
        " class="fluent-select-input"
        onmouseover="this.style.borderColor='#323130'"
        onmouseout="this.style.borderColor='#8a8886'"
        onfocus="this.style.borderColor='#0078d4'; this.style.boxShadow='0 0 0 1px #0078d4'"
        onblur="this.style.borderColor='#8a8886'; this.style.boxShadow='none'">
            <option value="">Choose an option</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
            <option value="option4">Option 4</option>
        </select>
        
        <!-- Custom dropdown arrow -->
        <div style="
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            color: #605e5c;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
        ">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"/>
            </svg>
        </div>
    </div>
    
    <style>
        .fluent-select-input:hover {
            border-color: #323130 !important;
        }
        
        .fluent-select-input:focus {
            border-color: #0078d4 !important;
            box-shadow: 0 0 0 1px #0078d4 !important;
        }
        
        .fluent-select-input:disabled {
            background-color: #f3f2f1;
            color: #a19f9d;
            border-color: #c8c6c4;
            cursor: not-allowed;
        }
        
        /* Custom scrollbar for options */
        .fluent-select-input option {
            padding: 8px;
            font-size: 14px;
            color: #323130;
            background: white;
        }
        
        .fluent-select-input option:hover {
            background: #f3f2f1;
        }
        
        .fluent-select-input option:checked {
            background: #0078d4;
            color: white;
        }
    </style>
</div>`
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
        },

        // FluentUI ProgressBar Component
        {
            id: 'fluentui-progressbar',
            name: 'FluentUI ProgressBar',
            description: 'Progress indicator showing completion status',
            category: 'Data Display',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #323130;">Progress Bar Example</h3>
    
    <!-- Determinate Progress Bar -->
    <div style="margin-bottom: 24px;">
        <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #323130;">File Upload Progress (75%)</label>
        <div style="width: 100%; height: 4px; background-color: #f3f2f1; border-radius: 2px; overflow: hidden;">
            <div style="width: 75%; height: 100%; background-color: #0078d4; border-radius: 2px; transition: width 0.3s ease;"></div>
        </div>
    </div>
    
    <!-- Indeterminate Progress Bar -->
    <div style="margin-bottom: 24px;">
        <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #323130;">Loading...</label>
        <div style="width: 100%; height: 4px; background-color: #f3f2f1; border-radius: 2px; overflow: hidden;">
            <div style="width: 30%; height: 100%; background-color: #0078d4; border-radius: 2px; animation: progress-indeterminate 2s infinite linear;"></div>
        </div>
    </div>
    
    <style>
        @keyframes progress-indeterminate {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(333%); }
        }
    </style>
</div>`
        },

        // FluentUI Popover Component
        {
            id: 'fluentui-popover',
            name: 'FluentUI Popover',
            description: 'Contextual overlay for additional information',
            category: 'Overlays',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white; position: relative;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #323130;">Popover Example</h3>
    
    <!-- Trigger Button -->
    <button style="background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 14px; cursor: pointer; font-family: inherit;" 
            onmouseover="document.getElementById('popover-content').style.display='block'" 
            onmouseout="document.getElementById('popover-content').style.display='none'">
        Hover for info
    </button>
    
    <!-- Popover Content -->
    <div id="popover-content" style="display: none; position: absolute; top: 60px; left: 20px; background: white; border: 1px solid #d1d1d1; border-radius: 8px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14), 0 0px 4px rgba(0, 0, 0, 0.12); padding: 16px; max-width: 280px; z-index: 1000;">
        <div style="font-size: 14px; font-weight: 600; color: #323130; margin-bottom: 8px;">Additional Information</div>
        <div style="font-size: 14px; color: #605e5c; line-height: 1.4;">This popover provides contextual information that appears when you hover over the trigger element.</div>
        
        <!-- Arrow -->
        <div style="position: absolute; top: -8px; left: 16px; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 8px solid white;"></div>
        <div style="position: absolute; top: -9px; left: 16px; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 8px solid #d1d1d1;"></div>
    </div>
</div>`
        },

        // FluentUI Persona Component
        {
            id: 'fluentui-persona',
            name: 'FluentUI Persona',
            description: 'User profile representation with avatar and details',
            category: 'Data Display',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #323130;">Persona Examples</h3>
    
    <!-- Large Persona -->
    <div style="display: flex; align-items: center; margin-bottom: 24px; padding: 12px; border-radius: 8px; background: #faf9f8;">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #0078d4, #106ebe); display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: 600; margin-right: 16px;">
            JD
        </div>
        <div>
            <div style="font-size: 20px; font-weight: 600; color: #323130; margin-bottom: 4px;">John Doe</div>
            <div style="font-size: 14px; color: #605e5c; margin-bottom: 2px;">Senior Software Engineer</div>
            <div style="font-size: 14px; color: #605e5c;">Microsoft Corporation</div>
        </div>
    </div>
    
    <!-- Medium Persona -->
    <div style="display: flex; align-items: center; margin-bottom: 24px; padding: 8px; border-radius: 6px; background: #f3f2f1;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #ca5010, #a4400e); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: 600; margin-right: 12px;">
            AS
        </div>
        <div>
            <div style="font-size: 16px; font-weight: 600; color: #323130; margin-bottom: 2px;">Alice Smith</div>
            <div style="font-size: 13px; color: #605e5c;">Product Manager</div>
        </div>
    </div>
    
    <!-- Small Persona -->
    <div style="display: flex; align-items: center; padding: 6px; border-radius: 4px; background: #edebe9;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #038387, #026c70); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 600; margin-right: 8px;">
            BJ
        </div>
        <div>
            <div style="font-size: 14px; font-weight: 600; color: #323130;">Bob Johnson</div>
        </div>
    </div>
</div>`
        },

        // FluentUI Nav Component
        {
            id: 'fluentui-nav',
            name: 'FluentUI Nav',
            description: 'Navigation component with hierarchical structure',
            category: 'Navigation',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; background: white; border-right: 1px solid #edebe9; width: 280px; height: 400px; padding: 16px 0;">
    <div style="padding: 0 16px 16px 16px; border-bottom: 1px solid #edebe9; margin-bottom: 8px;">
        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #323130;">Navigation</h3>
    </div>
    
    <nav style="padding: 0 8px;">
        <!-- Home -->
        <a href="#" style="display: flex; align-items: center; padding: 8px 12px; border-radius: 4px; text-decoration: none; color: #323130; background: #f3f2f1; margin-bottom: 2px;">
            <span style="margin-right: 8px;">🏠</span>
            <span style="font-size: 14px; font-weight: 600;">Home</span>
        </a>
        
        <!-- Documents -->
        <a href="#" style="display: flex; align-items: center; padding: 8px 12px; border-radius: 4px; text-decoration: none; color: #323130; margin-bottom: 2px; transition: background 0.2s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
            <span style="margin-right: 8px;">📁</span>
            <span style="font-size: 14px;">Documents</span>
        </a>
        
        <!-- Recent Files (Expandable) -->
        <div style="margin-bottom: 2px;">
            <a href="#" style="display: flex; align-items: center; padding: 8px 12px; border-radius: 4px; text-decoration: none; color: #323130; transition: background 0.2s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
                <span style="margin-right: 8px;">▶</span>
                <span style="font-size: 14px;">Recent Files</span>
            </a>
            <div style="margin-left: 32px; margin-top: 4px;">
                <a href="#" style="display: block; padding: 6px 8px; border-radius: 4px; text-decoration: none; color: #605e5c; font-size: 13px; transition: background 0.2s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
                    Report.docx
                </a>
                <a href="#" style="display: block; padding: 6px 8px; border-radius: 4px; text-decoration: none; color: #605e5c; font-size: 13px; transition: background 0.2s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
                    Presentation.pptx
                </a>
            </div>
        </div>
        
        <!-- Settings -->
        <a href="#" style="display: flex; align-items: center; padding: 8px 12px; border-radius: 4px; text-decoration: none; color: #323130; margin-bottom: 2px; transition: background 0.2s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
            <span style="margin-right: 8px;">⚙️</span>
            <span style="font-size: 14px;">Settings</span>
        </a>
        
        <!-- Help -->
        <a href="#" style="display: flex; align-items: center; padding: 8px 12px; border-radius: 4px; text-decoration: none; color: #323130; transition: background 0.2s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
            <span style="margin-right: 8px;">❓</span>
            <span style="font-size: 14px;">Help</span>
        </a>
    </nav>
</div>`
        },

        // FluentUI MessageBar Component
        {
            id: 'fluentui-messagebar',
            name: 'FluentUI MessageBar',
            description: 'Notification messages for different states',
            category: 'Feedback',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #323130;">MessageBar Examples</h3>
    
    <!-- Success Message -->
    <div style="display: flex; align-items: center; padding: 12px 16px; background: #f3f9fd; border: 1px solid #c7e0f4; border-left: 4px solid #0078d4; border-radius: 4px; margin-bottom: 12px;">
        <span style="margin-right: 12px; color: #0078d4; font-size: 16px;">✓</span>
        <div>
            <div style="font-size: 14px; font-weight: 600; color: #323130; margin-bottom: 2px;">Success</div>
            <div style="font-size: 14px; color: #605e5c;">Your changes have been saved successfully.</div>
        </div>
        <button style="margin-left: auto; background: none; border: none; color: #605e5c; cursor: pointer; font-size: 16px; padding: 4px;" onclick="this.parentElement.style.display='none'">×</button>
    </div>
    
    <!-- Warning Message -->
    <div style="display: flex; align-items: center; padding: 12px 16px; background: #fff9f5; border: 1px solid #fdcfb4; border-left: 4px solid #ff8c00; border-radius: 4px; margin-bottom: 12px;">
        <span style="margin-right: 12px; color: #ff8c00; font-size: 16px;">⚠</span>
        <div>
            <div style="font-size: 14px; font-weight: 600; color: #323130; margin-bottom: 2px;">Warning</div>
            <div style="font-size: 14px; color: #605e5c;">Some features may not work as expected in this browser.</div>
        </div>
        <button style="margin-left: auto; background: none; border: none; color: #605e5c; cursor: pointer; font-size: 16px; padding: 4px;" onclick="this.parentElement.style.display='none'">×</button>
    </div>
    
    <!-- Error Message -->
    <div style="display: flex; align-items: center; padding: 12px 16px; background: #fdf6f6; border: 1px solid #f1bbbb; border-left: 4px solid #d13438; border-radius: 4px; margin-bottom: 12px;">
        <span style="margin-right: 12px; color: #d13438; font-size: 16px;">✕</span>
        <div>
            <div style="font-size: 14px; font-weight: 600; color: #323130; margin-bottom: 2px;">Error</div>
            <div style="font-size: 14px; color: #605e5c;">Failed to connect to the server. Please try again.</div>
        </div>
        <button style="margin-left: auto; background: none; border: none; color: #605e5c; cursor: pointer; font-size: 16px; padding: 4px;" onclick="this.parentElement.style.display='none'">×</button>
    </div>
    
    <!-- Info Message -->
    <div style="display: flex; align-items: center; padding: 12px 16px; background: #f6f6f6; border: 1px solid #d1d1d1; border-left: 4px solid #605e5c; border-radius: 4px;">
        <span style="margin-right: 12px; color: #605e5c; font-size: 16px;">ℹ</span>
        <div>
            <div style="font-size: 14px; font-weight: 600; color: #323130; margin-bottom: 2px;">Information</div>
            <div style="font-size: 14px; color: #605e5c;">New features are available. Check out what's new in the latest update.</div>
        </div>
        <button style="margin-left: auto; background: none; border: none; color: #605e5c; cursor: pointer; font-size: 16px; padding: 4px;" onclick="this.parentElement.style.display='none'">×</button>
    </div>
</div>`
        },

        // FluentUI Image Component
        {
            id: 'fluentui-image',
            name: 'FluentUI Image',
            description: 'Responsive image component with different shapes',
            category: 'Media',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #323130;">Image Examples</h3>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px;">
        <!-- Regular Image -->
        <div>
            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #323130;">Regular Image</h4>
            <img src="https://via.placeholder.com/200x150/0078d4/ffffff?text=Image" 
                 alt="Example image" 
                 style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px; border: 1px solid #edebe9;" />
        </div>
        
        <!-- Circular Image -->
        <div>
            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #323130;">Circular Image</h4>
            <img src="https://via.placeholder.com/150x150/ca5010/ffffff?text=Avatar" 
                 alt="Avatar image" 
                 style="width: 150px; height: 150px; object-fit: cover; border-radius: 50%; border: 1px solid #edebe9;" />
        </div>
        
        <!-- Image with Placeholder -->
        <div>
            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #323130;">Image Placeholder</h4>
            <div style="width: 100%; height: 150px; background: #f3f2f1; border: 2px dashed #d1d1d1; border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #605e5c;">
                <div style="font-size: 32px; margin-bottom: 8px;">🖼️</div>
                <div style="font-size: 14px; text-align: center;">No image available</div>
            </div>
        </div>
        
        <!-- Image with Caption -->
        <div>
            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #323130;">Image with Caption</h4>
            <figure style="margin: 0;">
                <img src="https://via.placeholder.com/200x120/038387/ffffff?text=Graph" 
                     alt="Chart visualization" 
                     style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; border: 1px solid #edebe9;" />
                <figcaption style="margin-top: 8px; font-size: 13px; color: #605e5c; text-align: center;">Data visualization chart</figcaption>
            </figure>
        </div>
    </div>
</div>`
        },

        // FluentUI Dialog Component
        {
            id: 'fluentui-dialog',
            name: 'FluentUI Dialog',
            description: 'Modal dialog for important user interactions',
            category: 'Overlays',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white; position: relative;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #323130;">Dialog Example</h3>
    
    <!-- Trigger Button -->
    <button onclick="document.getElementById('dialog-overlay').style.display='flex'" 
            style="background: #0078d4; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-size: 14px; cursor: pointer; font-family: inherit;">
        Open Dialog
    </button>
    
    <!-- Dialog Overlay -->
    <div id="dialog-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); z-index: 1000; align-items: center; justify-content: center;">
        <!-- Dialog Container -->
        <div style="background: white; border-radius: 8px; box-shadow: 0 25.6px 57.6px rgba(0, 0, 0, 0.22), 0 4.8px 14.4px rgba(0, 0, 0, 0.18); max-width: 480px; width: 90%; max-height: 90vh; overflow: hidden;">
            <!-- Dialog Header -->
            <div style="padding: 24px 24px 16px 24px; border-bottom: 1px solid #edebe9;">
                <div style="display: flex; align-items: center; justify-content: between;">
                    <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #323130; flex: 1;">Confirm Action</h2>
                    <button onclick="document.getElementById('dialog-overlay').style.display='none'" 
                            style="background: none; border: none; color: #605e5c; cursor: pointer; font-size: 16px; padding: 4px; margin-left: 16px;">
                        ✕
                    </button>
                </div>
            </div>
            
            <!-- Dialog Content -->
            <div style="padding: 24px;">
                <p style="margin: 0 0 16px 0; font-size: 14px; color: #323130; line-height: 1.5;">
                    Are you sure you want to proceed with this action? This operation cannot be undone and will permanently affect your data.
                </p>
                
                <div style="display: flex; align-items: center; margin-bottom: 24px; padding: 12px; background: #fff9f5; border: 1px solid #fdcfb4; border-radius: 4px;">
                    <span style="margin-right: 8px; color: #ff8c00;">⚠</span>
                    <span style="font-size: 13px; color: #605e5c;">This action will delete 15 items permanently.</span>
                </div>
            </div>
            
            <!-- Dialog Footer -->
            <div style="padding: 16px 24px 24px 24px; display: flex; justify-content: flex-end; gap: 12px;">
                <button onclick="document.getElementById('dialog-overlay').style.display='none'" 
                        style="background: transparent; color: #323130; border: 1px solid #d1d1d1; padding: 8px 16px; border-radius: 4px; font-size: 14px; cursor: pointer; font-family: inherit;">
                    Cancel
                </button>
                <button onclick="document.getElementById('dialog-overlay').style.display='none'" 
                        style="background: #d13438; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 14px; cursor: pointer; font-family: inherit;">
                    Delete
                </button>
            </div>
        </div>
    </div>
</div>`
        },

        // FluentUI DataGrid Component
        {
            id: 'fluentui-datagrid',
            name: 'FluentUI DataGrid',
            description: 'Data table with sorting and selection capabilities',
            category: 'Data Display',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #323130;">Data Grid Example</h3>
    
    <!-- Data Grid Container -->
    <div style="border: 1px solid #d1d1d1; border-radius: 4px; overflow: hidden; background: white;">
        <!-- Header -->
        <div style="background: #f8f8f8; border-bottom: 1px solid #d1d1d1; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
                <input type="checkbox" style="margin-right: 12px; cursor: pointer;" onchange="toggleAllRows(this)">
                <span style="font-size: 14px; font-weight: 600; color: #323130;">Select all</span>
            </div>
            <div style="font-size: 13px; color: #605e5c;">5 items</div>
        </div>
        
        <!-- Table -->
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #faf9f8; border-bottom: 1px solid #edebe9;">
                    <th style="text-align: left; padding: 12px 16px; font-size: 14px; font-weight: 600; color: #323130; width: 40px;">
                        <input type="checkbox" style="cursor: pointer;">
                    </th>
                    <th style="text-align: left; padding: 12px 16px; font-size: 14px; font-weight: 600; color: #323130; cursor: pointer;" onclick="sortTable(0)">
                        Name <span style="color: #605e5c;">↕</span>
                    </th>
                    <th style="text-align: left; padding: 12px 16px; font-size: 14px; font-weight: 600; color: #323130; cursor: pointer;" onclick="sortTable(1)">
                        Email <span style="color: #605e5c;">↕</span>
                    </th>
                    <th style="text-align: left; padding: 12px 16px; font-size: 14px; font-weight: 600; color: #323130; cursor: pointer;" onclick="sortTable(2)">
                        Role <span style="color: #605e5c;">↕</span>
                    </th>
                    <th style="text-align: left; padding: 12px 16px; font-size: 14px; font-weight: 600; color: #323130; cursor: pointer;" onclick="sortTable(3)">
                        Status <span style="color: #605e5c;">↕</span>
                    </th>
                    <th style="text-align: center; padding: 12px 16px; font-size: 14px; font-weight: 600; color: #323130; width: 80px;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom: 1px solid #f3f2f1;" onmouseover="this.style.background='#faf9f8'" onmouseout="this.style.background='white'">
                    <td style="padding: 12px 16px;"><input type="checkbox" style="cursor: pointer;"></td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #323130;">John Doe</td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #605e5c;">john.doe@company.com</td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #605e5c;">Administrator</td>
                    <td style="padding: 12px 16px;"><span style="background: #f3f9fd; color: #0078d4; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">Active</span></td>
                    <td style="padding: 12px 16px; text-align: center;"><button style="background: none; border: none; color: #605e5c; cursor: pointer; font-size: 16px;">⋯</button></td>
                </tr>
                <tr style="border-bottom: 1px solid #f3f2f1;" onmouseover="this.style.background='#faf9f8'" onmouseout="this.style.background='white'">
                    <td style="padding: 12px 16px;"><input type="checkbox" style="cursor: pointer;"></td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #323130;">Alice Smith</td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #605e5c;">alice.smith@company.com</td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #605e5c;">Editor</td>
                    <td style="padding: 12px 16px;"><span style="background: #f3f9fd; color: #0078d4; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">Active</span></td>
                    <td style="padding: 12px 16px; text-align: center;"><button style="background: none; border: none; color: #605e5c; cursor: pointer; font-size: 16px;">⋯</button></td>
                </tr>
                <tr style="border-bottom: 1px solid #f3f2f1;" onmouseover="this.style.background='#faf9f8'" onmouseout="this.style.background='white'">
                    <td style="padding: 12px 16px;"><input type="checkbox" style="cursor: pointer;"></td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #323130;">Bob Johnson</td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #605e5c;">bob.johnson@company.com</td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #605e5c;">Viewer</td>
                    <td style="padding: 12px 16px;"><span style="background: #fff9f5; color: #ff8c00; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">Pending</span></td>
                    <td style="padding: 12px 16px; text-align: center;"><button style="background: none; border: none; color: #605e5c; cursor: pointer; font-size: 16px;">⋯</button></td>
                </tr>
            </tbody>
        </table>
        
        <!-- Footer -->
        <div style="background: #faf9f8; border-top: 1px solid #edebe9; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
            <div style="font-size: 13px; color: #605e5c;">Showing 1-3 of 3 items</div>
            <div style="display: flex; gap: 8px;">
                <button style="background: #f3f2f1; border: 1px solid #d1d1d1; color: #605e5c; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer;" disabled>Previous</button>
                <button style="background: #f3f2f1; border: 1px solid #d1d1d1; color: #605e5c; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer;" disabled>Next</button>
            </div>
        </div>
    </div>
    
    <script>
        function toggleAllRows(checkbox) {
            const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = checkbox.checked);
        }
        
        function sortTable(columnIndex) {
            // Simple sort indication - in real implementation would sort data
            alert('Sorting by column ' + (columnIndex + 1));
        }
    </script>
</div>`
        }
    ];

    const handleComponentClick = (component: Component) => {
        console.log('🚀 Component clicked:', component.name);
        onAddComponent(component);
        onClose();
    };

    // State for category filtering
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Get unique categories
    const categories = useMemo(() => {
        const allCategories = Array.from(new Set(components.map(c => c.category)));
        return ['All', ...allCategories.sort()];
    }, []);

    // Filter components based on selected category
    const filteredComponents = useMemo(() => {
        return selectedCategory === 'All'
            ? components
            : components.filter(c => c.category === selectedCategory);
    }, [selectedCategory]);

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
                    {/* Left Sidebar for Categories */}
                    <div className="component-library-sidebar">
                        <h3>Categories</h3>
                        <div className="category-filters">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                                >
                                    {category}
                                    <span className="category-count">
                                        ({category === 'All' ? components.length : components.filter(c => c.category === category).length})
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="component-library-main">
                        <div className="component-library-grid">
                            {filteredComponents.map(component => (
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
        </div>
    );
};

export default ComponentLibraryModal;
