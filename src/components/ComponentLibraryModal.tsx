import React, { useState, useMemo } from 'react';
import './ComponentLibraryModal.css';
import { generateHeroHTML } from './HeroGenerator';
import { generateFormHTML, FormTemplates } from './FormGenerator';
import { useFluentComponents, mergeFluentWithExisting } from '../utils/fluentComponentLoader';

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
            name: 'Fluent Hero - Azure',
            description: 'Microsoft Azure themed hero section',
            category: 'Fluent',
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
            name: 'Fluent Hero - AI',
            description: 'AI and machine learning themed hero section',
            category: 'Fluent',
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
        },

        // FluentUI ComboBox Component
        {
            id: 'fluentui-combobox',
            name: 'FluentUI ComboBox',
            description: 'Dropdown with search and selection capabilities',
            category: 'Forms',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #323130;">ComboBox Examples</h3>
    
    <!-- Basic ComboBox -->
    <div style="margin-bottom: 24px; max-width: 300px;">
        <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 600; color: #323130;">Select Country</label>
        <div style="position: relative;">
            <input type="text" 
                   placeholder="Type to search or select..."
                   style="width: 100%; padding: 8px 32px 8px 12px; border: 1px solid #d1d1d1; border-radius: 4px; font-size: 14px; color: #323130; background: white;"
                   onfocus="this.nextElementSibling.style.display='block'"
                   onblur="setTimeout(() => this.nextElementSibling.style.display='none', 200)">
            <div style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); color: #605e5c; pointer-events: none;">▼</div>
            
            <!-- Dropdown Options -->
            <div style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #d1d1d1; border-radius: 4px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); z-index: 1000; max-height: 200px; overflow-y: auto;">
                <div style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'"
                     onclick="this.parentElement.previousElementSibling.previousElementSibling.value='United States'; this.parentElement.style.display='none';">
                    United States
                </div>
                <div style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'"
                     onclick="this.parentElement.previousElementSibling.previousElementSibling.value='Canada'; this.parentElement.style.display='none';">
                    Canada
                </div>
                <div style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'"
                     onclick="this.parentElement.previousElementSibling.previousElementSibling.value='United Kingdom'; this.parentElement.style.display='none';">
                    United Kingdom
                </div>
                <div style="padding: 8px 12px; cursor: pointer;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'"
                     onclick="this.parentElement.previousElementSibling.previousElementSibling.value='Germany'; this.parentElement.style.display='none';">
                    Germany
                </div>
            </div>
        </div>
    </div>
    
    <!-- Multi-select ComboBox -->
    <div style="max-width: 300px;">
        <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 600; color: #323130;">Select Skills (Multi-select)</label>
        <div style="border: 1px solid #d1d1d1; border-radius: 4px; padding: 4px; min-height: 36px; display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
            <!-- Selected Tags -->
            <span style="background: #e1f5fe; color: #0078d4; padding: 2px 8px; border-radius: 12px; font-size: 12px; display: flex; align-items: center; gap: 4px;">
                JavaScript <span style="cursor: pointer; font-weight: bold;">×</span>
            </span>
            <span style="background: #e1f5fe; color: #0078d4; padding: 2px 8px; border-radius: 12px; font-size: 12px; display: flex; align-items: center; gap: 4px;">
                React <span style="cursor: pointer; font-weight: bold;">×</span>
            </span>
            <input type="text" 
                   placeholder="Add more skills..."
                   style="border: none; outline: none; flex: 1; min-width: 120px; font-size: 14px; padding: 4px;">
        </div>
    </div>
</div>`
        },

        // FluentUI Checkbox Component
        {
            id: 'fluentui-checkbox',
            name: 'FluentUI Checkbox',
            description: 'Checkbox input with various states and styles',
            category: 'Forms',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #323130;">Checkbox Examples</h3>
    
    <!-- Basic Checkboxes -->
    <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #323130;">Basic Checkboxes</h4>
        
        <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
            <input type="checkbox" checked style="margin-right: 8px; transform: scale(1.2);">
            <span style="font-size: 14px; color: #323130;">Checked option</span>
        </label>
        
        <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
            <input type="checkbox" style="margin-right: 8px; transform: scale(1.2);">
            <span style="font-size: 14px; color: #323130;">Unchecked option</span>
        </label>
        
        <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
            <input type="checkbox" indeterminate style="margin-right: 8px; transform: scale(1.2);">
            <span style="font-size: 14px; color: #323130;">Indeterminate option</span>
        </label>
        
        <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: not-allowed; opacity: 0.6;">
            <input type="checkbox" disabled style="margin-right: 8px; transform: scale(1.2);">
            <span style="font-size: 14px; color: #323130;">Disabled option</span>
        </label>
    </div>
    
    <!-- Checkbox Group -->
    <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #323130;">Notification Preferences</h4>
        <div style="background: #faf9f8; padding: 16px; border-radius: 6px; border: 1px solid #edebe9;">
            <label style="display: flex; align-items: center; margin-bottom: 12px; cursor: pointer;">
                <input type="checkbox" checked style="margin-right: 8px; transform: scale(1.2);">
                <div>
                    <div style="font-size: 14px; font-weight: 600; color: #323130;">Email notifications</div>
                    <div style="font-size: 12px; color: #605e5c;">Receive updates via email</div>
                </div>
            </label>
            
            <label style="display: flex; align-items: center; margin-bottom: 12px; cursor: pointer;">
                <input type="checkbox" style="margin-right: 8px; transform: scale(1.2);">
                <div>
                    <div style="font-size: 14px; font-weight: 600; color: #323130;">Push notifications</div>
                    <div style="font-size: 12px; color: #605e5c;">Receive push notifications on your device</div>
                </div>
            </label>
            
            <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" checked style="margin-right: 8px; transform: scale(1.2);">
                <div>
                    <div style="font-size: 14px; font-weight: 600; color: #323130;">SMS notifications</div>
                    <div style="font-size: 12px; color: #605e5c;">Receive important updates via SMS</div>
                </div>
            </label>
        </div>
    </div>
    
    <!-- Styled Checkboxes -->
    <div>
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #323130;">Terms & Conditions</h4>
        <label style="display: flex; align-items: flex-start; cursor: pointer; padding: 12px; border: 1px solid #d1d1d1; border-radius: 4px; background: white;">
            <input type="checkbox" required style="margin-right: 12px; margin-top: 2px; transform: scale(1.2);">
            <div style="font-size: 14px; color: #323130; line-height: 1.4;">
                I agree to the <a href="#" style="color: #0078d4; text-decoration: none;">Terms of Service</a> and <a href="#" style="color: #0078d4; text-decoration: none;">Privacy Policy</a>
            </div>
        </label>
    </div>
</div>`
        },

        // FluentUI Card Footer Component
        {
            id: 'fluentui-card-footer',
            name: 'FluentUI Card Footer',
            description: 'Card footer with actions and information',
            category: 'Cards',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #323130;">Card Footer Examples</h3>
    
    <!-- Card with Action Footer -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 24px; max-width: 320px;">
        <!-- Card Content -->
        <div style="padding: 16px;">
            <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #323130;">Project Update</h4>
            <p style="margin: 0; font-size: 14px; color: #605e5c; line-height: 1.4;">The new feature has been successfully deployed to production and is ready for user testing.</p>
        </div>
        
        <!-- Card Footer -->
        <div style="padding: 12px 16px; border-top: 1px solid #f3f2f1; background: #faf9f8; border-radius: 0 0 8px 8px; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 12px; color: #605e5c;">2 hours ago</div>
            <div style="display: flex; gap: 8px;">
                <button style="background: none; border: 1px solid #d1d1d1; color: #323130; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer;">Dismiss</button>
                <button style="background: #0078d4; border: none; color: white; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer;">View Details</button>
            </div>
        </div>
    </div>
    
    <!-- Card with Info Footer -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 24px; max-width: 320px;">
        <div style="padding: 16px;">
            <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #323130;">User Profile</h4>
            <p style="margin: 0; font-size: 14px; color: #605e5c;">Software Engineer with 5+ years of experience in React and TypeScript development.</p>
        </div>
        
        <div style="padding: 12px 16px; border-top: 1px solid #f3f2f1; background: #faf9f8; border-radius: 0 0 8px 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 12px; color: #605e5c;">Status:</span>
                    <span style="background: #f3f9fd; color: #0078d4; padding: 2px 6px; border-radius: 10px; font-size: 11px; font-weight: 600;">Online</span>
                </div>
                <div style="font-size: 12px; color: #605e5c;">Last seen: 5 min ago</div>
            </div>
        </div>
    </div>
    
    <!-- Card with Social Footer -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 320px;">
        <div style="padding: 16px;">
            <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #323130;">Team Achievement</h4>
            <p style="margin: 0; font-size: 14px; color: #605e5c;">Our development team successfully completed the quarterly sprint with 98% of planned features delivered.</p>
        </div>
        
        <div style="padding: 12px 16px; border-top: 1px solid #f3f2f1; background: #faf9f8; border-radius: 0 0 8px 8px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 12px;">
                <button style="background: none; border: none; color: #605e5c; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 13px;" 
                        onmouseover="this.style.color='#0078d4'" 
                        onmouseout="this.style.color='#605e5c'">
                    👍 12
                </button>
                <button style="background: none; border: none; color: #605e5c; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 13px;"
                        onmouseover="this.style.color='#0078d4'" 
                        onmouseout="this.style.color='#605e5c'">
                    💬 3
                </button>
                <button style="background: none; border: none; color: #605e5c; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 13px;"
                        onmouseover="this.style.color='#0078d4'" 
                        onmouseout="this.style.color='#605e5c'">
                    🔗 Share
                </button>
            </div>
            <div style="font-size: 12px; color: #605e5c;">Dec 15</div>
        </div>
    </div>
</div>`
        },

        // FluentUI Card Header Component
        {
            id: 'fluentui-card-header',
            name: 'FluentUI Card Header',
            description: 'Card header with title, avatar, and actions',
            category: 'Cards',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #323130;">Card Header Examples</h3>
    
    <!-- Card with Simple Header -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 24px; max-width: 380px;">
        <!-- Card Header -->
        <div style="padding: 16px; border-bottom: 1px solid #f3f2f1; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h4 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #323130;">Weekly Report</h4>
                <p style="margin: 0; font-size: 12px; color: #605e5c;">Generated on December 15, 2024</p>
            </div>
            <button style="background: none; border: none; color: #605e5c; cursor: pointer; font-size: 16px; padding: 4px;">⋯</button>
        </div>
        
        <!-- Card Content -->
        <div style="padding: 16px;">
            <p style="margin: 0; font-size: 14px; color: #605e5c; line-height: 1.4;">This week's performance metrics show a 15% improvement in user engagement and a 10% increase in conversion rates.</p>
        </div>
    </div>
    
    <!-- Card with Avatar Header -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 24px; max-width: 380px;">
        <!-- Card Header with Avatar -->
        <div style="padding: 16px; border-bottom: 1px solid #f3f2f1; display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #0078d4, #106ebe); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: 600;">
                JD
            </div>
            <div style="flex: 1;">
                <h4 style="margin: 0 0 2px 0; font-size: 14px; font-weight: 600; color: #323130;">John Doe</h4>
                <p style="margin: 0; font-size: 12px; color: #605e5c;">Senior Developer • 2 hours ago</p>
            </div>
            <div style="display: flex; gap: 8px;">
                <button style="background: none; border: 1px solid #d1d1d1; color: #323130; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">Follow</button>
                <button style="background: none; border: none; color: #605e5c; cursor: pointer; font-size: 16px; padding: 4px;">⋯</button>
            </div>
        </div>
        
        <!-- Card Content -->
        <div style="padding: 16px;">
            <p style="margin: 0; font-size: 14px; color: #605e5c; line-height: 1.4;">Just completed the new authentication system. The implementation includes two-factor authentication and social login options.</p>
        </div>
    </div>
    
    <!-- Card with Icon Header -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 24px; max-width: 380px;">
        <!-- Card Header with Icon -->
        <div style="padding: 16px; border-bottom: 1px solid #f3f2f1; display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 8px; background: #e1f5fe; display: flex; align-items: center; justify-content: center; color: #0078d4; font-size: 18px;">
                📊
            </div>
            <div style="flex: 1;">
                <h4 style="margin: 0 0 2px 0; font-size: 16px; font-weight: 600; color: #323130;">Analytics Dashboard</h4>
                <p style="margin: 0; font-size: 12px; color: #605e5c;">Real-time performance metrics</p>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="background: #f3f9fd; color: #0078d4; padding: 2px 6px; border-radius: 10px; font-size: 11px; font-weight: 600;">Live</span>
                <button style="background: none; border: none; color: #605e5c; cursor: pointer; font-size: 16px; padding: 4px;">⋯</button>
            </div>
        </div>
        
        <!-- Card Content -->
        <div style="padding: 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: 600; color: #0078d4; margin-bottom: 4px;">1,234</div>
                    <div style="font-size: 12px; color: #605e5c;">Active Users</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: 600; color: #038387; margin-bottom: 4px;">89.5%</div>
                    <div style="font-size: 12px; color: #605e5c;">Satisfaction</div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Card with Status Header -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 380px;">
        <!-- Card Header with Status -->
        <div style="padding: 16px; border-bottom: 1px solid #f3f2f1;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <h4 style="margin: 0; font-size: 16px; font-weight: 600; color: #323130;">System Status</h4>
                <span style="background: #f3f9fd; color: #0078d4; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">Operational</span>
            </div>
            <p style="margin: 0; font-size: 12px; color: #605e5c;">All systems are running normally</p>
        </div>
        
        <!-- Card Content -->
        <div style="padding: 16px;">
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 14px; color: #323130;">API Services</span>
                    <span style="background: #f3f9fd; color: #0078d4; padding: 2px 6px; border-radius: 10px; font-size: 11px; font-weight: 600;">99.9%</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 14px; color: #323130;">Database</span>
                    <span style="background: #f3f9fd; color: #0078d4; padding: 2px 6px; border-radius: 10px; font-size: 11px; font-weight: 600;">100%</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 14px; color: #323130;">CDN</span>
                    <span style="background: #fff9f5; color: #ff8c00; padding: 2px 6px; border-radius: 10px; font-size: 11px; font-weight: 600;">98.2%</span>
                </div>
            </div>
        </div>
    </div>
</div>`
        },

        // FluentUI Card Preview Component
        {
            id: 'fluentui-card-preview',
            name: 'FluentUI Card Preview',
            description: 'Card preview with media and content preview',
            category: 'Cards',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #323130;">Card Preview Examples</h3>
    
    <!-- Image Preview Card -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 24px; max-width: 320px; overflow: hidden;">
        <!-- Card Preview Section -->
        <div style="position: relative; height: 180px; background: linear-gradient(135deg, #0078d4, #106ebe); overflow: hidden;">
            <img src="https://via.placeholder.com/320x180/0078d4/ffffff?text=Preview+Image" 
                 alt="Preview" 
                 style="width: 100%; height: 100%; object-fit: cover;" />
            
            <!-- Preview Overlay -->
            <div style="position: absolute; top: 8px; right: 8px; background: rgba(0, 0, 0, 0.6); color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">
                NEW
            </div>
            
            <!-- Preview Actions -->
            <div style="position: absolute; bottom: 8px; left: 8px; display: flex; gap: 8px;">
                <button style="background: rgba(255, 255, 255, 0.9); border: none; color: #323130; padding: 6px 8px; border-radius: 16px; font-size: 12px; cursor: pointer; backdrop-filter: blur(4px);">
                    👁️ Preview
                </button>
                <button style="background: rgba(255, 255, 255, 0.9); border: none; color: #323130; padding: 6px 8px; border-radius: 16px; font-size: 12px; cursor: pointer; backdrop-filter: blur(4px);">
                    ❤️ Like
                </button>
            </div>
        </div>
        
        <!-- Card Content -->
        <div style="padding: 16px;">
            <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #323130;">New Product Launch</h4>
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #605e5c; line-height: 1.4;">Introducing our latest innovation that will transform the way you work and collaborate.</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12px; color: #605e5c;">Dec 15, 2024</span>
                <button style="background: #0078d4; border: none; color: white; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer;">Learn More</button>
            </div>
        </div>
    </div>
    
    <!-- Video Preview Card -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 24px; max-width: 320px; overflow: hidden;">
        <!-- Video Preview Section -->
        <div style="position: relative; height: 180px; background: #000; display: flex; align-items: center; justify-content: center; overflow: hidden;">
            <div style="position: absolute; inset: 0; background: url('https://via.placeholder.com/320x180/000000/ffffff?text=Video+Thumbnail') center/cover;"></div>
            
            <!-- Play Button -->
            <button style="position: relative; z-index: 2; width: 60px; height: 60px; border-radius: 50%; background: rgba(255, 255, 255, 0.9); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 20px; backdrop-filter: blur(4px);">
                ▶️
            </button>
            
            <!-- Duration -->
            <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(0, 0, 0, 0.8); color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">
                3:45
            </div>
        </div>
        
        <!-- Card Content -->
        <div style="padding: 16px;">
            <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #323130;">Tutorial: Getting Started</h4>
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #605e5c; line-height: 1.4;">Learn the basics of our platform in this comprehensive tutorial video.</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 12px; color: #605e5c;">1.2K views</span>
                    <span style="font-size: 12px; color: #605e5c;">•</span>
                    <span style="font-size: 12px; color: #605e5c;">5 days ago</span>
                </div>
                <button style="background: none; border: 1px solid #d1d1d1; color: #323130; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer;">Save</button>
            </div>
        </div>
    </div>
    
    <!-- Document Preview Card -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 320px; overflow: hidden;">
        <!-- Document Preview Section -->
        <div style="position: relative; height: 180px; background: #f8f9fa; border-bottom: 1px solid #edebe9; display: flex; flex-direction: column; padding: 16px;">
            <!-- Document Header -->
            <div style="display: flex; justify-content: between; align-items: flex-start; margin-bottom: 12px;">
                <div style="flex: 1;">
                    <div style="font-size: 18px; font-weight: 600; color: #323130; margin-bottom: 4px;">Q4 Report</div>
                    <div style="font-size: 12px; color: #605e5c;">Microsoft Word Document</div>
                </div>
                <div style="width: 32px; height: 32px; background: #0078d4; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 600;">
                    W
                </div>
            </div>
            
            <!-- Document Preview Content -->
            <div style="flex: 1; overflow: hidden;">
                <div style="font-size: 12px; color: #323130; line-height: 1.3; margin-bottom: 8px;">
                    <strong>Executive Summary</strong>
                </div>
                <div style="font-size: 11px; color: #605e5c; line-height: 1.2;">
                    This quarter showed significant growth across all key metrics. Revenue increased by 23% compared to the previous quarter, with customer satisfaction reaching an all-time high...
                </div>
            </div>
            
            <!-- Document Stats -->
            <div style="display: flex; justify-content: between; font-size: 10px; color: #605e5c; margin-top: 8px;">
                <span>12 pages</span>
                <span>Last modified: 2 hours ago</span>
            </div>
        </div>
        
        <!-- Card Content -->
        <div style="padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div>
                    <div style="font-size: 14px; font-weight: 600; color: #323130;">Quarterly Business Report</div>
                    <div style="font-size: 12px; color: #605e5c;">by Sarah Johnson</div>
                </div>
                <button style="background: none; border: none; color: #605e5c; cursor: pointer; font-size: 16px; padding: 4px;">⋯</button>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; gap: 8px;">
                    <button style="background: #0078d4; border: none; color: white; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer;">Open</button>
                    <button style="background: none; border: 1px solid #d1d1d1; color: #323130; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer;">Download</button>
                </div>
                <span style="background: #f3f9fd; color: #0078d4; padding: 2px 6px; border-radius: 10px; font-size: 11px; font-weight: 600;">Shared</span>
            </div>
        </div>
    </div>
</div>`
        },

        // FluentUI Compound Button Component
        {
            id: 'fluentui-compound-button',
            name: 'FluentUI Compound Button',
            description: 'Buttons with primary and secondary text content',
            category: 'Buttons',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #323130;">Compound Button Examples</h3>
    
    <!-- Primary Compound Buttons -->
    <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #323130;">Primary Compound Buttons</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
            
            <!-- Create New Project -->
            <button style="background: #0078d4; border: none; color: white; padding: 12px 16px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 12px; min-width: 200px; text-align: left; transition: background 0.2s;"
                    onmouseover="this.style.background='#106ebe'" 
                    onmouseout="this.style.background='#0078d4'">
                <div style="font-size: 24px;">📁</div>
                <div>
                    <div style="font-size: 14px; font-weight: 600; margin-bottom: 2px;">Create New Project</div>
                    <div style="font-size: 12px; opacity: 0.9;">Start a new project from scratch</div>
                </div>
            </button>
            
            <!-- Import Data -->
            <button style="background: #0078d4; border: none; color: white; padding: 12px 16px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 12px; min-width: 200px; text-align: left; transition: background 0.2s;"
                    onmouseover="this.style.background='#106ebe'" 
                    onmouseout="this.style.background='#0078d4'">
                <div style="font-size: 24px;">📥</div>
                <div>
                    <div style="font-size: 14px; font-weight: 600; margin-bottom: 2px;">Import Data</div>
                    <div style="font-size: 12px; opacity: 0.9;">Upload files or connect data sources</div>
                </div>
            </button>
        </div>
    </div>
    
    <!-- Secondary Compound Buttons -->
    <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #323130;">Secondary Compound Buttons</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
            
            <!-- View Templates -->
            <button style="background: transparent; border: 1px solid #d1d1d1; color: #323130; padding: 12px 16px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 12px; min-width: 200px; text-align: left; transition: all 0.2s;"
                    onmouseover="this.style.background='#f3f2f1'; this.style.borderColor='#c7c6c4'" 
                    onmouseout="this.style.background='transparent'; this.style.borderColor='#d1d1d1'">
                <div style="font-size: 24px;">📋</div>
                <div>
                    <div style="font-size: 14px; font-weight: 600; margin-bottom: 2px;">View Templates</div>
                    <div style="font-size: 12px; color: #605e5c;">Browse pre-built templates</div>
                </div>
            </button>
            
            <!-- Settings -->
            <button style="background: transparent; border: 1px solid #d1d1d1; color: #323130; padding: 12px 16px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 12px; min-width: 200px; text-align: left; transition: all 0.2s;"
                    onmouseover="this.style.background='#f3f2f1'; this.style.borderColor='#c7c6c4'" 
                    onmouseout="this.style.background='transparent'; this.style.borderColor='#d1d1d1'">
                <div style="font-size: 24px;">⚙️</div>
                <div>
                    <div style="font-size: 14px; font-weight: 600; margin-bottom: 2px;">Settings</div>
                    <div style="font-size: 12px; color: #605e5c;">Configure your preferences</div>
                </div>
            </button>
        </div>
    </div>
    
    <!-- Large Compound Buttons -->
    <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #323130;">Large Compound Buttons</h4>
        <div style="display: flex; flex-direction: column; gap: 12px; max-width: 400px;">
            
            <!-- Upgrade Plan -->
            <button style="background: linear-gradient(135deg, #0078d4, #106ebe); border: none; color: white; padding: 16px 20px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 16px; text-align: left; transition: transform 0.2s; position: relative; overflow: hidden;"
                    onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(0, 120, 212, 0.3)'" 
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                <div style="font-size: 32px;">⭐</div>
                <div style="flex: 1;">
                    <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Upgrade to Premium</div>
                    <div style="font-size: 13px; opacity: 0.9; line-height: 1.3;">Unlock advanced features and remove limitations</div>
                </div>
                <div style="font-size: 18px; opacity: 0.8;">→</div>
            </button>
            
            <!-- Team Collaboration -->
            <button style="background: white; border: 2px solid #edebe9; color: #323130; padding: 16px 20px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 16px; text-align: left; transition: all 0.2s;"
                    onmouseover="this.style.borderColor='#0078d4'; this.style.boxShadow='0 2px 8px rgba(0, 120, 212, 0.1)'" 
                    onmouseout="this.style.borderColor='#edebe9'; this.style.boxShadow='none'">
                <div style="font-size: 32px;">👥</div>
                <div style="flex: 1;">
                    <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px; color: #323130;">Invite Team Members</div>
                    <div style="font-size: 13px; color: #605e5c; line-height: 1.3;">Collaborate with your team in real-time</div>
                </div>
                <div style="font-size: 18px; color: #605e5c;">→</div>
            </button>
        </div>
    </div>
    
    <!-- Action Cards Style -->
    <div>
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #323130;">Action Cards</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
            
            <!-- Analytics -->
            <button style="background: white; border: 1px solid #edebe9; color: #323130; padding: 16px; border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);"
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.15)'" 
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0, 0, 0, 0.1)'">
                <div style="font-size: 28px; margin-bottom: 8px;">📊</div>
                <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Analytics</div>
                <div style="font-size: 12px; color: #605e5c;">View performance metrics</div>
            </button>
            
            <!-- Reports -->
            <button style="background: white; border: 1px solid #edebe9; color: #323130; padding: 16px; border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);"
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.15)'" 
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0, 0, 0, 0.1)'">
                <div style="font-size: 28px; margin-bottom: 8px;">📄</div>
                <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Reports</div>
                <div style="font-size: 12px; color: #605e5c;">Generate detailed reports</div>
            </button>
            
            <!-- Export -->
            <button style="background: white; border: 1px solid #edebe9; color: #323130; padding: 16px; border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);"
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.15)'" 
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0, 0, 0, 0.1)'">
                <div style="font-size: 28px; margin-bottom: 8px;">📤</div>
                <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Export</div>
                <div style="font-size: 12px; color: #605e5c;">Download your data</div>
            </button>
        </div>
    </div>
</div>`
        },

        // FluentUI Menu Button Component
        {
            id: 'fluentui-menu-button',
            name: 'FluentUI Menu Button',
            description: 'Button with dropdown menu options',
            category: 'Buttons',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #323130;">Menu Button Examples</h3>
    
    <!-- Primary Menu Button -->
    <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #323130;">Primary Menu Button</h4>
        <div style="position: relative; display: inline-block;">
            <button onclick="toggleMenu('menu1')" 
                    style="background: #0078d4; border: none; color: white; padding: 8px 12px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600;">
                New Item
                <span style="font-size: 12px;">▼</span>
            </button>
            
            <div id="menu1" style="display: none; position: absolute; top: 100%; left: 0; background: white; border: 1px solid #d1d1d1; border-radius: 4px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); z-index: 1000; min-width: 160px; margin-top: 4px;">
                <div onclick="selectOption('Document')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    📄 Document
                </div>
                <div onclick="selectOption('Spreadsheet')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    📊 Spreadsheet
                </div>
                <div onclick="selectOption('Presentation')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    📈 Presentation
                </div>
                <div onclick="selectOption('Folder')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    📁 Folder
                </div>
            </div>
        </div>
    </div>
    
    <!-- Secondary Menu Button -->
    <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #323130;">Secondary Menu Button</h4>
        <div style="position: relative; display: inline-block;">
            <button onclick="toggleMenu('menu2')" 
                    style="background: transparent; border: 1px solid #d1d1d1; color: #323130; padding: 8px 12px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px;">
                Actions
                <span style="font-size: 12px;">▼</span>
            </button>
            
            <div id="menu2" style="display: none; position: absolute; top: 100%; left: 0; background: white; border: 1px solid #d1d1d1; border-radius: 4px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); z-index: 1000; min-width: 140px; margin-top: 4px;">
                <div onclick="selectOption('Edit')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    ✏️ Edit
                </div>
                <div onclick="selectOption('Copy')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    📋 Copy
                </div>
                <div onclick="selectOption('Share')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    🔗 Share
                </div>
                <div onclick="selectOption('Delete')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #d13438;" 
                     onmouseover="this.style.background='#fdf6f6'" 
                     onmouseout="this.style.background='white'">
                    🗑️ Delete
                </div>
            </div>
        </div>
    </div>
    
    <!-- Icon Menu Button -->
    <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #323130;">Icon Menu Button</h4>
        <div style="position: relative; display: inline-block;">
            <button onclick="toggleMenu('menu3')" 
                    style="background: #f3f2f1; border: 1px solid #d1d1d1; color: #323130; padding: 8px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; font-size: 16px;">
                ⋯
            </button>
            
            <div id="menu3" style="display: none; position: absolute; top: 100%; right: 0; background: white; border: 1px solid #d1d1d1; border-radius: 4px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); z-index: 1000; min-width: 160px; margin-top: 4px;">
                <div onclick="selectOption('View Details')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    👁️ View Details
                </div>
                <div onclick="selectOption('Download')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    💾 Download
                </div>
                <div onclick="selectOption('Properties')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    ⚙️ Properties
                </div>
                <div onclick="selectOption('Move to Trash')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #d13438;" 
                     onmouseover="this.style.background='#fdf6f6'" 
                     onmouseout="this.style.background='white'">
                    🗑️ Move to Trash
                </div>
            </div>
        </div>
    </div>
    
    <!-- Split Menu Button -->
    <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #323130;">Split Menu Button</h4>
        <div style="display: flex;">
            <!-- Main Action -->
            <button onclick="selectOption('Save')" 
                    style="background: #0078d4; border: none; color: white; padding: 8px 16px; border-radius: 4px 0 0 4px; cursor: pointer; font-size: 14px; font-weight: 600;">
                Save
            </button>
            
            <!-- Dropdown Part -->
            <div style="position: relative; display: inline-block;">
                <button onclick="toggleMenu('menu4')" 
                        style="background: #106ebe; border: none; color: white; padding: 8px; border-radius: 0 4px 4px 0; cursor: pointer; font-size: 12px; border-left: 1px solid rgba(255, 255, 255, 0.2);">
                    ▼
                </button>
                
                <div id="menu4" style="display: none; position: absolute; top: 100%; right: 0; background: white; border: 1px solid #d1d1d1; border-radius: 4px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); z-index: 1000; min-width: 140px; margin-top: 4px;">
                    <div onclick="selectOption('Save As')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130; border-bottom: 1px solid #f3f2f1;" 
                         onmouseover="this.style.background='#f3f2f1'" 
                         onmouseout="this.style.background='white'">
                        💾 Save As...
                    </div>
                    <div onclick="selectOption('Save Copy')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130; border-bottom: 1px solid #f3f2f1;" 
                         onmouseover="this.style.background='#f3f2f1'" 
                         onmouseout="this.style.background='white'">
                        📋 Save Copy
                    </div>
                    <div onclick="selectOption('Export')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130;" 
                         onmouseover="this.style.background='#f3f2f1'" 
                         onmouseout="this.style.background='white'">
                        📤 Export
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Context Menu Button -->
    <div>
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #323130;">Context Menu Button</h4>
        <div style="position: relative; display: inline-block;">
            <button onclick="toggleMenu('menu5')" 
                    style="background: white; border: 1px solid #d1d1d1; color: #323130; padding: 8px 12px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px;">
                📁 Project Folder
                <span style="font-size: 12px;">▼</span>
            </button>
            
            <div id="menu5" style="display: none; position: absolute; top: 100%; left: 0; background: white; border: 1px solid #d1d1d1; border-radius: 4px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); z-index: 1000; min-width: 180px; margin-top: 4px;">
                <!-- Group 1 -->
                <div onclick="selectOption('Open')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    📂 Open
                </div>
                <div onclick="selectOption('Open in New Window')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130; border-bottom: 1px solid #e1e1e1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    🪟 Open in New Window
                </div>
                
                <!-- Group 2 -->
                <div onclick="selectOption('Rename')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    ✏️ Rename
                </div>
                <div onclick="selectOption('Move')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    📦 Move
                </div>
                <div onclick="selectOption('Copy')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130; border-bottom: 1px solid #e1e1e1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    📋 Copy
                </div>
                
                <!-- Group 3 -->
                <div onclick="selectOption('Properties')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #323130; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    ⚙️ Properties
                </div>
                <div onclick="selectOption('Delete')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #d13438;" 
                     onmouseover="this.style.background='#fdf6f6'" 
                     onmouseout="this.style.background='white'">
                    🗑️ Delete
                </div>
            </div>
        </div>
    </div>
    
    <script>
        function toggleMenu(menuId) {
            // Close all other menus
            const allMenus = document.querySelectorAll('[id^="menu"]');
            allMenus.forEach(menu => {
                if (menu.id !== menuId) {
                    menu.style.display = 'none';
                }
            });
            
            // Toggle the target menu
            const menu = document.getElementById(menuId);
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
        
        function selectOption(option) {
            alert('Selected: ' + option);
            // Close all menus
            const allMenus = document.querySelectorAll('[id^="menu"]');
            allMenus.forEach(menu => menu.style.display = 'none');
        }
        
        // Close menus when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('button') && !event.target.closest('[id^="menu"]')) {
                const allMenus = document.querySelectorAll('[id^="menu"]');
                allMenus.forEach(menu => menu.style.display = 'none');
            }
        });
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
                        <div className="fluentui-logo">
                            F
                        </div>
                        <div>
                            <h2>FluentUI Component Library</h2>
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
