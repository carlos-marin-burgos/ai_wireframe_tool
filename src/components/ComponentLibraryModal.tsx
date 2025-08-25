import React, { useState, useMemo, useEffect } from 'react';
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
    library?: 'FluentUI' | 'Atlas';
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
    const [loadedFluentComponents, setLoadedFluentComponents] = useState<Component[]>([]);
    const [isLoadingFluentComponents, setIsLoadingFluentComponents] = useState(false);

    // State for filtering - must be declared before any early returns
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedLibrary, setSelectedLibrary] = useState<'FluentUI' | 'Atlas'>('FluentUI');

    // Load Fluent UI components from JSON file
    useEffect(() => {
        const loadFluentComponents = async () => {
            if (loadedFluentComponents.length > 0) return; // Already loaded

            setIsLoadingFluentComponents(true);
            try {
                const response = await fetch('/fluent-library.json');
                if (!response.ok) {
                    throw new Error('Failed to load Fluent UI components');
                }

                const data = await response.json();

                // Convert the JSON format to our Component interface
                const fluentComponents: Component[] = data.components.map((comp: any) => ({
                    id: comp.id,
                    name: comp.name,
                    description: comp.description,
                    category: comp.category,
                    htmlCode: comp.htmlCode,
                    library: 'FluentUI' as const
                }));

                setLoadedFluentComponents(fluentComponents);
                console.log(`🎉 Loaded ${fluentComponents.length} Fluent UI components from library`);
            } catch (error) {
                console.error('Error loading Fluent UI components:', error);
                // Keep using hardcoded components as fallback
            } finally {
                setIsLoadingFluentComponents(false);
            }
        };

        if (isOpen) {
            loadFluentComponents();
        }
    }, [isOpen, loadedFluentComponents.length]);

    // Remove the detected components loading - not needed
    // The enhanced wireframe generation uses component knowledge behind the scenes    // Hardcoded Atlas components (moved here to be before early return)
    const atlasComponents: Component[] = [
        // Individual Atlas Hero Components from Figma
        {
            id: 'atlas-hero-1',
            name: 'Atlas Hero 1',
            description: 'Atlas Design Library Hero Component #1',
            category: 'Hero',
            library: 'Atlas',
            htmlCode: `<div style="background: white; padding: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 100%;">
                <div style="width: 100%; height: 300px; background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%); display: flex; align-items: center; justify-content: center; color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <div style="text-align: center; padding: 40px;">
                        <div style="font-size: 32px; margin-bottom: 16px;">🚀</div>
                        <h1 style="font-size: 28px; font-weight: 600; margin: 0 0 12px 0;">Atlas Hero Component 1</h1>
                        <p style="font-size: 16px; opacity: 0.9; margin: 0;">Microsoft Design System</p>
                    </div>
                </div>
            </div>`
        },
        {
            id: 'atlas-hero-2',
            name: 'Atlas Hero 2',
            description: 'Atlas Design Library Hero Component #2',
            category: 'Hero',
            library: 'Atlas',
            htmlCode: `<div style="background: white; padding: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 100%;">
                <div style="width: 100%; height: 300px; background: linear-gradient(135deg, #005a9e 0%, #0078d4 100%); display: flex; align-items: center; justify-content: center; color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <div style="text-align: center; padding: 40px;">
                        <div style="font-size: 32px; margin-bottom: 16px;">💼</div>
                        <h1 style="font-size: 28px; font-weight: 600; margin: 0 0 12px 0;">Atlas Hero Component 2</h1>
                        <p style="font-size: 16px; opacity: 0.9; margin: 0;">Enterprise Solutions</p>
                    </div>
                </div>
            </div>`
        },
        {
            id: 'atlas-hero-3',
            name: 'Atlas Hero 3',
            description: 'Atlas Design Library Hero Component #3',
            category: 'Hero',
            library: 'Atlas',
            htmlCode: `<div style="background: white; padding: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 100%;">
                <div style="width: 100%; height: 300px; background: linear-gradient(135deg, #8764b8 0%, #0078d4 100%); display: flex; align-items: center; justify-content: center; color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <div style="text-align: center; padding: 40px;">
                        <div style="font-size: 32px; margin-bottom: 16px;">🎯</div>
                        <h1 style="font-size: 28px; font-weight: 600; margin: 0 0 12px 0;">Atlas Hero Component 3</h1>
                        <p style="font-size: 16px; opacity: 0.9; margin: 0;">Innovation & Technology</p>
                    </div>
                </div>
            </div>`
        },
        {
            id: 'atlas-hero-4',
            name: 'Atlas Hero 4',
            description: 'Atlas Design Library Hero Component #4',
            category: 'Hero',
            library: 'Atlas',
            htmlCode: `<div style="background: white; padding: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 100%;">
                <div style="width: 100%; height: 300px; background: linear-gradient(135deg, #00188f 0%, #0078d4 100%); display: flex; align-items: center; justify-content: center; color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <div style="text-align: center; padding: 40px;">
                        <div style="font-size: 32px; margin-bottom: 16px;">⭐</div>
                        <h1 style="font-size: 28px; font-weight: 600; margin: 0 0 12px 0;">Atlas Hero Component 4</h1>
                        <p style="font-size: 16px; opacity: 0.9; margin: 0;">Excellence & Quality</p>
                    </div>
                </div>
            </div>`
        },

        // Atlas Top Navigation Component
        {
            id: 'atlas-top-navigation',
            name: 'Atlas Navigation',
            description: 'Clean Atlas navigation component',
            category: 'Navigation',
            library: 'Atlas',
            htmlCode: `<header class="atlas-navigation" style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 24px;
              background: #ffffff !important;
              background-color: #ffffff !important;
              border-bottom: 1px solid #e1e5e9;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              position: sticky;
              top: 0;
              z-index: 1000;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            ">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="position: relative; width: 20px; height: 20px;">
                    <div style="position: absolute; top: 0; left: 0; width: 9px; height: 9px; background: #F26522;"></div>
                    <div style="position: absolute; top: 0; right: 0; width: 9px; height: 9px; background: #8DC63F;"></div>
                    <div style="position: absolute; bottom: 0; left: 0; width: 9px; height: 9px; background: #00AEEF;"></div>
                    <div style="position: absolute; bottom: 0; right: 0; width: 9px; height: 9px; background: #FFC20E;"></div>
                  </div>
                  <span style="font-size: 18px; font-weight: 600; color: #323130; margin-left: 8px;">Learn</span>
                </div>
                <nav style="display: flex; gap: 24px; margin-left: 32px;">
                  <a href="#" style="color: #323130; text-decoration: none; font-weight: 500;">Browse</a>
                  <a href="#" style="color: #323130; text-decoration: none; font-weight: 500;">Reference</a>
                  <a href="#" style="color: #0078d4; text-decoration: none; font-weight: 500; border-bottom: 2px solid #0078d4;">Learn</a>
                  <a href="#" style="color: #323130; text-decoration: none; font-weight: 500;">Q&A</a>
                </nav>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <button style="padding: 6px; border: none; background: none; border-radius: 4px;">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="#605e5c">
                    <path d="M8.5 3C5.46243 3 3 5.46243 3 8.5C3 11.5376 5.46243 14 8.5 14C9.83879 14 11.0659 13.5217 12.0196 12.7266L16.6464 17.3536L17.3536 16.6464L12.7266 12.0196C13.5217 11.0659 14 9.83879 14 8.5C14 5.46243 11.5376 3 8.5 3ZM4 8.5C4 6.01472 6.01472 4 8.5 4C10.9853 4 13 6.01472 13 8.5C13 10.9853 10.9853 13 8.5 13C6.01472 13 4 10.9853 4 8.5Z"/>
                  </svg>
                </button>
                <div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #0078d4, #106ebe); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 12px;">U</div>
              </div>
            </header>`
        },

        // Atlas Footer Component
        {
            id: 'atlas-footer-001',
            name: 'Footer Section',
            description: 'Microsoft Learn footer with links and branding',
            category: 'Layout',
            library: 'Atlas',
            htmlCode: `<footer style="background-color: #f8f9fa; border-top: 1px solid #e1dfdd; padding: 48px 0 24px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
              <div style="max-width: 1200px; margin: 0 auto; padding: 0 24px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 32px;">
                  <div>
                    <h3 style="font-size: 18px; font-weight: 600; color: #323130; margin-bottom: 16px;">Microsoft Learn</h3>
                    <p style="font-size: 14px; color: #605e5c; line-height: 1.4;">Develop skills that drive success in any career.</p>
                  </div>
                  <div>
                    <h4 style="font-size: 14px; font-weight: 600; color: #323130; margin-bottom: 12px;">Products</h4>
                    <ul style="list-style: none; margin: 0; padding: 0;">
                      <li style="margin-bottom: 8px;"><a href="#" style="color: #0078d4; text-decoration: none; font-size: 14px;">Azure</a></li>
                      <li style="margin-bottom: 8px;"><a href="#" style="color: #0078d4; text-decoration: none; font-size: 14px;">Microsoft 365</a></li>
                      <li style="margin-bottom: 8px;"><a href="#" style="color: #0078d4; text-decoration: none; font-size: 14px;">Power Platform</a></li>
                      <li style="margin-bottom: 8px;"><a href="#" style="color: #0078d4; text-decoration: none; font-size: 14px;">Visual Studio</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 style="font-size: 14px; font-weight: 600; color: #323130; margin-bottom: 12px;">Resources</h4>
                    <ul style="list-style: none; margin: 0; padding: 0;">
                      <li style="margin-bottom: 8px;"><a href="#" style="color: #0078d4; text-decoration: none; font-size: 14px;">Documentation</a></li>
                      <li style="margin-bottom: 8px;"><a href="#" style="color: #0078d4; text-decoration: none; font-size: 14px;">Training</a></li>
                      <li style="margin-bottom: 8px;"><a href="#" style="color: #0078d4; text-decoration: none; font-size: 14px;">Certifications</a></li>
                      <li style="margin-bottom: 8px;"><a href="#" style="color: #0078d4; text-decoration: none; font-size: 14px;">Q&A</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 style="font-size: 14px; font-weight: 600; color: #323130; margin-bottom: 12px;">Community</h4>
                    <ul style="list-style: none; margin: 0; padding: 0;">
                      <li style="margin-bottom: 8px;"><a href="#" style="color: #0078d4; text-decoration: none; font-size: 14px;">Events</a></li>
                      <li style="margin-bottom: 8px;"><a href="#" style="color: #0078d4; text-decoration: none; font-size: 14px;">Blog</a></li>
                      <li style="margin-bottom: 8px;"><a href="#" style="color: #0078d4; text-decoration: none; font-size: 14px;">Forum</a></li>
                      <li style="margin-bottom: 8px;"><a href="#" style="color: #0078d4; text-decoration: none; font-size: 14px;">Support</a></li>
                    </ul>
                  </div>
                </div>
                <div style="border-top: 1px solid #e1dfdd; padding-top: 24px; text-align: center;">
                  <p style="font-size: 14px; color: #605e5c; margin: 0;">© 2024 Microsoft Corporation. All rights reserved.</p>
                </div>
              </div>
            </footer>`
        },

        // Atlas Breadcrumb Component
        {
            id: 'atlas-breadcrumb-001',
            name: 'Breadcrumb Navigation',
            description: 'Learning path breadcrumb navigation',
            category: 'Navigation',
            library: 'Atlas',
            htmlCode: `<nav style="padding: 16px 0; border-bottom: 1px solid #e1dfdd; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" aria-label="Breadcrumb">
              <ol style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px; list-style: none; margin: 0; padding: 0; font-size: 14px;">
                <li style="display: flex; align-items: center;">
                  <a href="#" style="color: #0078d4; text-decoration: none;">Home</a>
                </li>
                <li style="color: #605e5c; font-size: 12px;">></li>
                <li style="display: flex; align-items: center;">
                  <a href="#" style="color: #0078d4; text-decoration: none;">Learning Paths</a>
                </li>
                <li style="color: #605e5c; font-size: 12px;">></li>
                <li style="display: flex; align-items: center;">
                  <a href="#" style="color: #0078d4; text-decoration: none;">Azure</a>
                </li>
                <li style="color: #605e5c; font-size: 12px;">></li>
                <li style="display: flex; align-items: center;" aria-current="page">
                  <span style="color: #323130; font-weight: 600;">Azure Fundamentals</span>
                </li>
              </ol>
            </nav>`
        },

        // Fluent Checkbox Component
        {
            id: 'fluent-checkbox-001',
            name: 'Checkbox',
            description: 'Checkbox input with Microsoft Learn styling',
            category: 'Forms',
            library: 'Atlas',
            htmlCode: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px;">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; color: #323130;">
                <input type="checkbox" style="position: absolute; opacity: 0; width: 0; height: 0;" id="checkbox-1">
                <span style="width: 16px; height: 16px; border: 1px solid #8a8886; border-radius: 2px; background-color: #ffffff; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; position: relative;">
                  <span style="display: none; color: #ffffff; font-size: 12px; font-weight: bold;">✓</span>
                </span>
                <span>I agree to the terms and conditions</span>
              </label>
              <style>
                input:checked + span {
                  background-color: #0078d4 !important;
                  border-color: #0078d4 !important;
                }
                input:checked + span > span {
                  display: block !important;
                }
              </style>
            </div>`
        },

        // Fluent Radio Component
        {
            id: 'fluent-radio-001',
            name: 'Radio Group',
            description: 'Radio button group for experience level selection',
            category: 'Forms',
            library: 'Atlas',
            htmlCode: `<fieldset style="border: none; margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
              <legend style="font-size: 14px; font-weight: 600; color: #323130; margin-bottom: 16px;">Choose your experience level</legend>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; color: #323130;">
                  <input type="radio" name="experience" value="beginner" checked style="position: absolute; opacity: 0; width: 0; height: 0;">
                  <span style="width: 16px; height: 16px; border: 1px solid #8a8886; border-radius: 50%; background-color: #ffffff; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; position: relative;">
                    <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #0078d4; display: block;"></span>
                  </span>
                  <span>Beginner</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; color: #323130;">
                  <input type="radio" name="experience" value="intermediate" style="position: absolute; opacity: 0; width: 0; height: 0;">
                  <span style="width: 16px; height: 16px; border: 1px solid #8a8886; border-radius: 50%; background-color: #ffffff; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; position: relative;">
                    <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #0078d4; display: none;"></span>
                  </span>
                  <span>Intermediate</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; color: #323130;">
                  <input type="radio" name="experience" value="advanced" style="position: absolute; opacity: 0; width: 0; height: 0;">
                  <span style="width: 16px; height: 16px; border: 1px solid #8a8886; border-radius: 50%; background-color: #ffffff; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; position: relative;">
                    <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #0078d4; display: none;"></span>
                  </span>
                  <span>Advanced</span>
                </label>
              </div>
            </fieldset>`
        },

        // Atlas Notification Component
        {
            id: 'atlas-notification-001',
            name: 'Notification Banner',
            description: 'Success notification banner for learning progress',
            category: 'Feedback',
            library: 'Atlas',
            htmlCode: `<div style="display: flex; align-items: center; padding: 16px 20px; border-radius: 4px; margin-bottom: 16px; border-left: 4px solid #107c10; background-color: #dff6dd; color: #323130; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
              <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
                <div style="display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background-color: #107c10; color: #ffffff; font-size: 12px; font-weight: bold; flex-shrink: 0;">✓</div>
                <div style="flex: 1;">
                  <strong style="font-weight: 600; margin-right: 8px;">Success!</strong>
                  <span style="font-size: 14px;">Your learning path has been saved successfully.</span>
                </div>
                <button style="background: none; border: none; font-size: 20px; cursor: pointer; color: #605e5c; padding: 4px; border-radius: 2px; transition: background-color 0.2s ease;" aria-label="Close notification">×</button>
              </div>
            </div>`
        },

        // Atlas Progress Component
        {
            id: 'atlas-progress-001',
            name: 'Progress Indicator',
            description: 'Course progress indicator with percentage and details',
            category: 'Feedback',
            library: 'Atlas',
            htmlCode: `<div style="margin-bottom: 24px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 14px; font-weight: 600; color: #323130;">Course Progress</span>
                <span style="font-size: 14px; font-weight: 600; color: #0078d4;">65%</span>
              </div>
              <div style="width: 100%; height: 8px; background-color: #f3f2f1; border-radius: 4px; overflow: hidden; margin-bottom: 8px;">
                <div style="width: 65%; height: 100%; background-color: #0078d4; border-radius: 4px; transition: width 0.3s ease;"></div>
              </div>
              <div>
                <span style="font-size: 12px; color: #605e5c;">13 of 20 modules completed</span>
              </div>
            </div>`
        },

        // Atlas Sidebar Component
        {
            id: 'atlas-sidebar-001',
            name: 'Learning Sidebar',
            description: 'Course content sidebar with module progress',
            category: 'Navigation',
            library: 'Atlas',
            htmlCode: `<aside style="width: 300px; background-color: #faf9f8; border-right: 1px solid #e1dfdd; padding: 24px 0; height: 400px; overflow-y: auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 24px 16px; border-bottom: 1px solid #e1dfdd; margin-bottom: 16px;">
                <h3 style="font-size: 18px; font-weight: 600; color: #323130; margin: 0;">Course Content</h3>
                <button style="background: none; border: none; font-size: 18px; cursor: pointer; color: #605e5c;" aria-label="Toggle sidebar">☰</button>
              </div>
              <nav>
                <ul style="list-style: none; margin: 0; padding: 0;">
                  <li style="margin-bottom: 4px;">
                    <div style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; cursor: pointer; background-color: #f3f2f1;">
                      <span style="color: #107c10; font-weight: bold;">✓</span>
                      <span style="flex: 1; font-size: 14px; color: #323130;">Introduction to Azure</span>
                      <span style="font-size: 12px; color: #605e5c;">15 min</span>
                    </div>
                  </li>
                  <li style="margin-bottom: 4px;">
                    <div style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; cursor: pointer; background-color: #e6f3ff; border-left: 3px solid #0078d4;">
                      <span style="color: #0078d4; font-weight: bold;">▶</span>
                      <span style="flex: 1; font-size: 14px; color: #323130; font-weight: 600;">Azure Services Overview</span>
                      <span style="font-size: 12px; color: #605e5c;">30 min</span>
                    </div>
                  </li>
                  <li style="margin-bottom: 4px;">
                    <div style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; cursor: pointer; transition: background-color 0.2s ease;">
                      <span style="color: #8a8886;">○</span>
                      <span style="flex: 1; font-size: 14px; color: #323130;">Azure Storage</span>
                      <span style="font-size: 12px; color: #605e5c;">25 min</span>
                    </div>
                  </li>
                  <li style="margin-bottom: 4px;">
                    <div style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; cursor: pointer; transition: background-color 0.2s ease;">
                      <span style="color: #8a8886;">○</span>
                      <span style="flex: 1; font-size: 14px; color: #323130;">Azure Networking</span>
                      <span style="font-size: 12px; color: #605e5c;">40 min</span>
                    </div>
                  </li>
                </ul>
              </nav>
            </aside>`
        },

        // Microsoft Learn Site Headers
        {
            id: 'ms-learn-header-basic',
            name: 'Microsoft Learn Site Header',
            description: 'Official Microsoft Learn site header with logo and brand',
            category: 'Navigation',
            library: 'FluentUI',
            htmlCode: `<div style="display: flex; align-items: center; padding: 12px 24px; background: white; border-bottom: 1px solid #e1e5e9; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
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
        <a href="#" style="color: #000000; text-decoration: none; padding: 8px 12px; border-radius: 4px; transition: background 0.2s; font-size: 14px;">Documentation</a>
        <a href="#" style="color: #000000; text-decoration: none; padding: 8px 12px; border-radius: 4px; transition: background 0.2s; font-size: 14px;">Training</a>
        <a href="#" style="color: #000000; text-decoration: none; padding: 8px 12px; border-radius: 4px; transition: background 0.2s; font-size: 14px;">Certifications</a>
    </nav>
</div>`
        },
        {
            id: 'ms-learn-header-centered',
            name: 'Microsoft Learn Header (Centered Logo)',
            description: 'Microsoft Learn header with centered logo layout',
            category: 'Navigation',
            library: 'FluentUI',
            htmlCode: `<div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; background: white; border-bottom: 1px solid #e1e5e9; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
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
            library: 'FluentUI',
            htmlCode: `<div style="background: white; border-bottom: 1px solid #e1e5e9; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
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
            <button style="background: none; border: none; color: #000000; cursor: pointer; padding: 8px; border-radius: 4px; font-size: 14px;">🔍 Search</button>
            <a href="#" style="color: #0078d4; text-decoration: none; font-size: 14px; padding: 6px 12px; border: 1px solid #0078d4; border-radius: 4px;">Sign in</a>
        </div>
    </div>

    <!-- Secondary navigation -->
    <div style="padding: 0 24px; border-top: 1px solid #f3f2f1;">
        <nav style="display: flex; gap: 32px; padding: 12px 0;">
            <a href="#" style="color: #000000; text-decoration: none; font-size: 14px; padding: 8px 0; border-bottom: 2px solid transparent; transition: border-color 0.2s;">Browse</a>
            <a href="#" style="color: #000000; text-decoration: none; font-size: 14px; padding: 8px 0; border-bottom: 2px solid transparent; transition: border-color 0.2s;">Learning Paths</a>
            <a href="#" style="color: #000000; text-decoration: none; font-size: 14px; padding: 8px 0; border-bottom: 2px solid transparent; transition: border-color 0.2s;">Modules</a>
            <a href="#" style="color: #000000; text-decoration: none; font-size: 14px; padding: 8px 0; border-bottom: 2px solid #0078d4;">Certifications</a>
            <a href="#" style="color: #000000; text-decoration: none; font-size: 14px; padding: 8px 0; border-bottom: 2px solid transparent; transition: border-color 0.2s;">Q&A</a>
        </nav>
    </div>
</div>`
        },
        {
            id: 'button-primary',
            name: 'Primary Button',
            description: 'Main call-to-action button',
            category: 'Buttons',
            library: 'FluentUI',
            htmlCode: '<button style="background: #0078d4; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-weight: 600;">Click Me</button>'
        },
        {
            id: 'button-secondary',
            name: 'Secondary Button',
            description: 'Secondary action button',
            category: 'Buttons',
            library: 'FluentUI',
            htmlCode: '<button style="background: #f3f2f1; color: #323130; border: 1px solid #e1dfdd; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-weight: 600;">Secondary</button>'
        },
        {
            id: 'card-basic',
            name: 'Basic Card',
            description: 'Simple card layout',
            category: 'Cards',
            library: 'FluentUI',
            htmlCode: '<div style="background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e1e5e9;"><h3 style="margin: 0 0 12px 0; color: #323130;">Card Title</h3><p style="margin: 0; color: #605e5c;">Card content goes here with some descriptive text.</p></div>'
        },
        {
            id: 'form-contact',
            name: 'Contact Form',
            description: 'Microsoft Learn contact form with validation',
            category: 'Forms',
            library: 'FluentUI',
            htmlCode: generateFormHTML(FormTemplates.find(t => t.id === 'contact')!)
        },
        {
            id: 'form-feedback',
            name: 'Feedback Form',
            description: 'Microsoft Learn feedback form with radio buttons',
            category: 'Forms',
            library: 'FluentUI',
            htmlCode: generateFormHTML(FormTemplates.find(t => t.id === 'feedback') || FormTemplates[0])
        },
        {
            id: 'form-registration',
            name: 'Registration Form',
            description: 'Microsoft Learn registration form with validation',
            category: 'Forms',
            library: 'FluentUI',
            htmlCode: generateFormHTML(FormTemplates.find(t => t.id === 'registration')!)
        },
        {
            id: 'form-survey',
            name: 'Survey Form',
            description: 'Microsoft Learn survey form with various inputs',
            category: 'Forms',
            library: 'FluentUI',
            htmlCode: generateFormHTML(FormTemplates.find(t => t.id === 'survey') || FormTemplates[0])
        },
        {
            id: 'form-input-text',
            name: 'Text Input Field',
            description: 'Microsoft Learn text input with proper styling',
            category: 'Forms',
            library: 'FluentUI',
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
            library: 'FluentUI',
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
            library: 'FluentUI',
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
            library: 'FluentUI',
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
            library: 'FluentUI',
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
            library: 'FluentUI',
            htmlCode: '<div style="margin-bottom: 16px;"><label style="display: block; margin-bottom: 4px; font-weight: 600; color: #323130;">Label:</label><input type="text" style="width: 100%; max-width: 300px; padding: 8px 12px; border: 1px solid #e1dfdd; border-radius: 4px; font-size: 14px;" placeholder="Enter text..."></div>'
        },
        {
            id: 'fluent-select',
            name: 'FluentUI Select',
            description: 'Microsoft FluentUI Select component with dropdown arrow and options',
            category: 'Forms',
            library: 'FluentUI',
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
            library: 'FluentUI',
            htmlCode: `
              <header class="docs-header" style="background: #f8f9fa; padding: 12px 0; border-bottom: 1px solid #e1e4e8;">
                <div class="docs-header-container" style="max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between;">
                  <div class="docs-header-brand" style="display: flex; align-items: center; gap: 12px;">
                    <img src="/windowsLogo.png" alt="Microsoft Logo" width="24" height="24">
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

        // FluentUI ProgressBar Component
        {
            id: 'fluentui-progressbar',
            name: 'FluentUI ProgressBar',
            description: 'Progress indicator showing completion status',
            category: 'Data Display',
            library: 'FluentUI',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; padding: 20px; background: white;">
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
            library: 'FluentUI',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; padding: 20px; background: white; position: relative;">
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
            library: 'FluentUI',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; padding: 20px; background: white;">
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
            library: 'FluentUI',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; background: white; border-right: 1px solid #edebe9; width: 280px; height: 400px; padding: 16px 0;">
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
            library: 'FluentUI',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; padding: 20px; background: white;">
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
            library: 'FluentUI',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #323130;">Image Examples</h3>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px;">
        <!-- Regular Image -->
        <div>
            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #323130;">Regular Image</h4>
            <img src="https://placehold.co/200x150/0078d4/ffffff?text=Image" 
                 alt="Example image" 
                 style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px; border: 1px solid #edebe9;" />
        </div>
        
        <!-- Circular Image -->
        <div>
            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #323130;">Circular Image</h4>
            <img src="https://placehold.co/150x150/ca5010/ffffff?text=Avatar" 
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
                <img src="https://placehold.co/200x120/038387/ffffff?text=Graph" 
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
            library: 'FluentUI',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; padding: 20px; background: white; position: relative;">
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
            library: 'FluentUI',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; padding: 20px; background: white;">
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
            library: 'FluentUI',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; padding: 20px; background: white;">
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
            library: 'FluentUI',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; padding: 20px; background: white;">
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
            library: 'FluentUI',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; padding: 20px; background: white;">
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
            library: 'FluentUI',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; padding: 20px; background: white;">
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
            library: 'FluentUI',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #323130;">Card Preview Examples</h3>
    
    <!-- Image Preview Card -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 24px; max-width: 320px; overflow: hidden;">
        <!-- Card Preview Section -->
        <div style="position: relative; height: 180px; background: linear-gradient(135deg, #0078d4, #106ebe); overflow: hidden;">
            <img src="https://placehold.co/320x180/0078d4/ffffff?text=Preview+Image" 
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
            <div style="position: absolute; inset: 0; background: url('https://placehold.co/320x180/000000/ffffff?text=Video+Thumbnail') center/cover;"></div>
            
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
            library: 'FluentUI',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; padding: 20px; background: white;">
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
            library: 'FluentUI',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; padding: 20px; background: white;">
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
        },

        // Atlas Learning Path Card Component - Updated from new Figma design
        {
            id: 'atlas-learning-path-card',
            name: 'Atlas Learning Path Card',
            description: 'Atlas Learning Path Card from Figma (Node ID: 2-393)',
            category: 'Cards',
            library: 'Atlas',
            htmlCode: `<div style="background: white; padding: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); width: 100%;" data-figma-node="2-393" data-figma-file="PuWj05uKXhfbqrhmJLtCij">
                <div style="width: 100%; height: 200px; background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%); display: flex; align-items: center; justify-content: center; color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <div style="text-align: center;">
                        <div style="font-size: 24px; margin-bottom: 8px;">📚</div>
                        <div style="font-size: 16px; font-weight: 600;">Atlas Learning Path</div>
                        <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">Microsoft Learn Component</div>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 8px; padding: 8px;">
                    <p style="font-size: 12px; color: #605e5c; margin: 0; opacity: 0.8;">Atlas Learning Path Card (Updated)</p>
                </div>
            </div>`
        },

        // Atlas Module Card Component - Uses same Figma design as Learning Path
        {
            id: 'atlas-module-card',
            name: 'Atlas Module Card',
            description: 'Atlas Module Card from Figma (Node ID: 14315:162386) - Individual learning module component',
            category: 'Cards',
            library: 'Atlas',
            htmlCode: `<div style="background: white; padding: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); width: 100%;" data-figma-node="14315:162386" data-figma-file="uVA2amRR71yJZ0GS6RI6zL" data-type="module">
                <div style="width: 100%; height: 160px; background: linear-gradient(135deg, #005a9e 0%, #0078d4 100%); display: flex; align-items: center; justify-content: center; color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <div style="text-align: center;">
                        <div style="font-size: 24px; margin-bottom: 8px;">📖</div>
                        <div style="font-size: 14px; font-weight: 600;">Learning Module</div>
                        <div style="font-size: 11px; opacity: 0.9; margin-top: 4px;">Interactive Content</div>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 8px; padding: 8px;">
                    <p style="font-size: 12px; color: #605e5c; margin: 0; opacity: 0.8;">Atlas Module Card</p>
                </div>
            </div>`
        },

        // Atlas Design System Components
        {
            id: 'atlas-button-primary',
            name: 'Atlas Primary Button',
            description: 'Primary action button following Atlas design principles',
            category: 'Buttons',
            library: 'Atlas',
            htmlCode: `<button style="
                background: #0072CE; 
                color: white; 
                border: none; 
                padding: 12px 24px; 
                border-radius: 2px; 
                font-size: 14px; 
                font-weight: 600; 
                font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
                cursor: pointer;
                transition: all 0.2s ease;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            " onmouseover="this.style.background='#005A9E'" onmouseout="this.style.background='#0072CE'">
                PRIMARY ACTION
            </button>`
        },
        {
            id: 'atlas-button-secondary',
            name: 'Atlas Secondary Button',
            description: 'Secondary action button with Atlas styling',
            category: 'Buttons',
            library: 'Atlas',
            htmlCode: `<button style="
                background: transparent; 
                color: #0072CE; 
                border: 2px solid #0072CE; 
                padding: 10px 22px; 
                border-radius: 2px; 
                font-size: 14px; 
                font-weight: 600; 
                font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
                cursor: pointer;
                transition: all 0.2s ease;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            " onmouseover="this.style.background='#0072CE'; this.style.color='white'" onmouseout="this.style.background='transparent'; this.style.color='#0072CE'">
                SECONDARY
            </button>`
        },
        {
            id: 'atlas-card-info',
            name: 'Atlas Information Card',
            description: 'Clean information card with Atlas styling',
            category: 'Cards',
            library: 'Atlas',
            htmlCode: `<div style="
                background: white; 
                border: 1px solid #E0E0E0; 
                border-radius: 4px; 
                padding: 24px; 
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
                max-width: 350px;
            ">
                <div style="display: flex; align-items: center; margin-bottom: 16px;">
                    <div style="width: 6px; height: 48px; background: #0072CE; margin-right: 16px; border-radius: 3px;"></div>
                    <div>
                        <h3 style="margin: 0; color: #333; font-size: 18px; font-weight: 600;">Information Card</h3>
                        <p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">Atlas Design System</p>
                    </div>
                </div>
                <p style="margin: 0; color: #555; line-height: 1.5; font-size: 14px;">
                    This card follows Atlas design principles with clean typography, proper spacing, and Microsoft brand colors.
                </p>
            </div>`
        },
        {
            id: 'atlas-header-navigation',
            name: 'Atlas Navigation Header',
            description: 'Clean navigation header with Atlas design principles',
            category: 'Navigation',
            library: 'Atlas',
            htmlCode: `<header style="
                background: white; 
                border-bottom: 2px solid #0072CE; 
                padding: 16px 24px; 
                font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            ">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center;">
                        <div style="width: 40px; height: 40px; background: #0072CE; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; margin-right: 16px;">
                            A
                        </div>
                        <h1 style="margin: 0; color: #333; font-size: 24px; font-weight: 300;">Atlas Application</h1>
                    </div>
                    <nav style="display: flex; gap: 32px;">
                        <a href="#" style="color: #0072CE; text-decoration: none; font-weight: 500; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">HOME</a>
                        <a href="#" style="color: #666; text-decoration: none; font-weight: 500; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">PRODUCTS</a>
                        <a href="#" style="color: #666; text-decoration: none; font-weight: 500; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">SERVICES</a>
                        <a href="#" style="color: #666; text-decoration: none; font-weight: 500; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">CONTACT</a>
                    </nav>
                </div>
            </header>`
        },
        {
            id: 'atlas-form-input',
            name: 'Atlas Input Field',
            description: 'Form input field with Atlas styling',
            category: 'Forms',
            library: 'Atlas',
            htmlCode: `<div style="margin-bottom: 16px; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
                <label style="
                    display: block; 
                    margin-bottom: 8px; 
                    color: #333; 
                    font-size: 14px; 
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                ">EMAIL ADDRESS</label>
                <input 
                    type="email" 
                    placeholder="Enter your email address"
                    style="
                        width: 100%; 
                        padding: 12px 16px; 
                        border: 2px solid #E0E0E0; 
                        border-radius: 2px; 
                        font-size: 14px; 
                        font-family: inherit;
                        transition: border-color 0.2s ease;
                        box-sizing: border-box;
                    " 
                    onfocus="this.style.borderColor='#0072CE'" 
                    onblur="this.style.borderColor='#E0E0E0'"
                />
            </div>`
        },
        {
            id: 'atlas-hero-section',
            name: 'Atlas Hero Section',
            description: 'Bold hero section with Atlas design language',
            category: 'Hero',
            library: 'Atlas',
            htmlCode: `<section style="
                background: linear-gradient(135deg, #0072CE 0%, #005A9E 100%); 
                color: white; 
                padding: 80px 24px; 
                text-align: center;
                font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
            ">
                <div style="max-width: 800px; margin: 0 auto;">
                    <h1 style="
                        margin: 0 0 24px 0; 
                        font-size: 48px; 
                        font-weight: 300; 
                        line-height: 1.2;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    ">
                        ATLAS DESIGN
                    </h1>
                    <p style="
                        margin: 0 0 32px 0; 
                        font-size: 18px; 
                        line-height: 1.6; 
                        opacity: 0.9;
                    ">
                        Clean, professional, and modern design system for enterprise applications
                    </p>
                    <button style="
                        background: white; 
                        color: #0072CE; 
                        border: none; 
                        padding: 16px 32px; 
                        border-radius: 2px; 
                        font-size: 14px; 
                        font-weight: 600; 
                        font-family: inherit;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        GET STARTED
                    </button>
                </div>
            </section>`
        },
        // Microsoft Learn Accordion Components
        {
            id: 'ms-learn-accordion-basic',
            name: 'Microsoft Learn Accordion',
            description: 'Basic accordion using Microsoft Learn design with details element',
            category: 'Accordion',
            library: 'Atlas',
            htmlCode: `<details class="accordion" style="border: 1px solid #E1DFDD; border-radius: 4px; margin-bottom: 8px; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <summary style="
        padding: 16px 20px; 
        cursor: pointer; 
        list-style: none; 
        background: #F8F8F8; 
        border-bottom: 1px solid #E1DFDD; 
        font-weight: 600; 
        color: #323130;
        user-select: none;
        position: relative;
    " onmouseover="this.style.background='#F3F2F1'" onmouseout="this.style.background='#F8F8F8'">
        Accordion Header
        <span style="
            position: absolute; 
            right: 20px; 
            top: 50%; 
            transform: translateY(-50%); 
            transition: transform 0.2s ease;
        ">▼</span>
    </summary>
    <div style="padding: 20px; background: white; color: #323130; line-height: 1.5;">
        <p style="margin: 0;">This is the accordion content. It can contain any HTML elements like text, images, links, or other components.</p>
    </div>
</details>`
        },
        {
            id: 'ms-learn-accordion-grouped',
            name: 'Microsoft Learn Accordion Group',
            description: 'Grouped accordion items with only one open at a time',
            category: 'Accordion',
            library: 'Atlas',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <details class="accordion" name="faq-group" style="border: 1px solid #E1DFDD; border-radius: 4px 4px 0 0; margin-bottom: 0;">
        <summary style="
            padding: 16px 20px; 
            cursor: pointer; 
            list-style: none; 
            background: #F8F8F8; 
            border-bottom: 1px solid #E1DFDD; 
            font-weight: 600; 
            color: #323130;
            user-select: none;
            position: relative;
        " onmouseover="this.style.background='#F3F2F1'" onmouseout="this.style.background='#F8F8F8'">
            What is Microsoft Learn?
            <span style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); transition: transform 0.2s ease;">▼</span>
        </summary>
        <div style="padding: 20px; background: white; color: #323130; line-height: 1.5;">
            <p style="margin: 0;">Microsoft Learn is a free online training platform that provides interactive learning paths and modules for Microsoft products and services.</p>
        </div>
    </details>
    
    <details class="accordion" name="faq-group" style="border: 1px solid #E1DFDD; border-top: none; margin-bottom: 0;">
        <summary style="
            padding: 16px 20px; 
            cursor: pointer; 
            list-style: none; 
            background: #F8F8F8; 
            border-bottom: 1px solid #E1DFDD; 
            font-weight: 600; 
            color: #323130;
            user-select: none;
            position: relative;
        " onmouseover="this.style.background='#F3F2F1'" onmouseout="this.style.background='#F8F8F8'">
            How do I get started?
            <span style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); transition: transform 0.2s ease;">▼</span>
        </summary>
        <div style="padding: 20px; background: white; color: #323130; line-height: 1.5;">
            <p style="margin: 0;">Simply browse the available learning paths, choose one that matches your interests, and start learning at your own pace.</p>
        </div>
    </details>
    
    <details class="accordion" name="faq-group" style="border: 1px solid #E1DFDD; border-top: none; border-radius: 0 0 4px 4px;">
        <summary style="
            padding: 16px 20px; 
            cursor: pointer; 
            list-style: none; 
            background: #F8F8F8; 
            font-weight: 600; 
            color: #323130;
            user-select: none;
            position: relative;
        " onmouseover="this.style.background='#F3F2F1'" onmouseout="this.style.background='#F8F8F8'">
            Is Microsoft Learn free?
            <span style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); transition: transform 0.2s ease;">▼</span>
        </summary>
        <div style="padding: 20px; background: white; color: #323130; line-height: 1.5;">
            <p style="margin: 0;">Yes, Microsoft Learn is completely free to use. You can access all learning materials, hands-on labs, and earn achievements at no cost.</p>
        </div>
    </details>
</div>`
        },
        {
            id: 'ms-learn-accordion-large',
            name: 'Microsoft Learn Large Accordion',
            description: 'Large size accordion variant with enhanced padding',
            category: 'Accordion',
            library: 'Atlas',
            htmlCode: `<details class="accordion accordion-lg" style="border: 1px solid #E1DFDD; border-radius: 6px; margin-bottom: 12px; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <summary style="
        padding: 24px 28px; 
        cursor: pointer; 
        list-style: none; 
        background: #F8F8F8; 
        border-bottom: 1px solid #E1DFDD; 
        font-weight: 600; 
        color: #323130;
        user-select: none;
        position: relative;
        font-size: 18px;
    " onmouseover="this.style.background='#F3F2F1'" onmouseout="this.style.background='#F8F8F8'">
        Large Accordion Header
        <span style="
            position: absolute; 
            right: 28px; 
            top: 50%; 
            transform: translateY(-50%); 
            transition: transform 0.2s ease;
            font-size: 16px;
        ">▼</span>
    </summary>
    <div style="padding: 28px; background: white; color: #323130; line-height: 1.6; font-size: 16px;">
        <p style="margin: 0 0 16px 0;">This is a large accordion with enhanced spacing and typography. Perfect for important content that needs more emphasis.</p>
        <p style="margin: 0;">The larger size provides better readability and a more prominent visual presence on the page.</p>
    </div>
</details>`
        },
        // Microsoft Learn Badge Components
        {
            id: 'ms-learn-badge-basic',
            name: 'Microsoft Learn Badge',
            description: 'Basic badge component with Microsoft Learn styling',
            category: 'Badge',
            library: 'Atlas',
            htmlCode: `<span class="badge" style="
    display: inline-block;
    padding: 4px 8px;
    background: #F3F2F1;
    color: #323130;
    border: 1px solid #C8C6C4;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.5px;
">Badge</span>`
        },
        {
            id: 'ms-learn-badge-sizes',
            name: 'Microsoft Learn Badge Sizes',
            description: 'Different badge sizes: small, default, large, and extra large',
            category: 'Badge',
            library: 'Atlas',
            htmlCode: `<div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <span class="badge badge-sm" style="
        display: inline-block;
        padding: 2px 6px;
        background: #F3F2F1;
        color: #323130;
        border: 1px solid #C8C6C4;
        border-radius: 2px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    ">Small</span>
    
    <span class="badge" style="
        display: inline-block;
        padding: 4px 8px;
        background: #F3F2F1;
        color: #323130;
        border: 1px solid #C8C6C4;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    ">Default</span>
    
    <span class="badge badge-lg" style="
        display: inline-block;
        padding: 6px 12px;
        background: #F3F2F1;
        color: #323130;
        border: 1px solid #C8C6C4;
        border-radius: 2px;
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    ">Large</span>
    
    <span class="badge badge-xl" style="
        display: inline-block;
        padding: 8px 16px;
        background: #F3F2F1;
        color: #323130;
        border: 1px solid #C8C6C4;
        border-radius: 2px;
        font-size: 16px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    ">Extra Large</span>
</div>`
        },
        {
            id: 'ms-learn-badge-semantic',
            name: 'Microsoft Learn Semantic Badges',
            description: 'Semantic color variants: primary, info, danger, warning, success',
            category: 'Badge',
            library: 'Atlas',
            htmlCode: `<div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <span class="badge badge-primary" style="
        display: inline-block;
        padding: 4px 8px;
        background: #0078D4;
        color: white;
        border: 1px solid #0078D4;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    ">Primary</span>
    
    <span class="badge badge-info" style="
        display: inline-block;
        padding: 4px 8px;
        background: #00BCF2;
        color: white;
        border: 1px solid #00BCF2;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    ">Info</span>
    
    <span class="badge badge-danger" style="
        display: inline-block;
        padding: 4px 8px;
        background: #D83B01;
        color: white;
        border: 1px solid #D83B01;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    ">Danger</span>
    
    <span class="badge badge-warning" style="
        display: inline-block;
        padding: 4px 8px;
        background: #FFB900;
        color: #323130;
        border: 1px solid #FFB900;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    ">Warning</span>
    
    <span class="badge badge-success" style="
        display: inline-block;
        padding: 4px 8px;
        background: #107C10;
        color: white;
        border: 1px solid #107C10;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    ">Success</span>
</div>`
        },
        {
            id: 'ms-learn-badge-with-icon',
            name: 'Microsoft Learn Badge with Icon',
            description: 'Badge with icon and text following Microsoft Learn patterns',
            category: 'Badge',
            library: 'Atlas',
            htmlCode: `<div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <span class="badge badge-primary" style="
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background: #0078D4;
        color: white;
        border: 1px solid #0078D4;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    ">
        <span class="icon" aria-hidden="true" style="width: 12px; height: 12px; display: flex; align-items: center; justify-content: center;">
            <svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <path d="M10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3ZM8.5 13.5L5 10L6.41 8.59L8.5 10.67L13.59 5.58L15 7L8.5 13.5Z"/>
            </svg>
        </span>
        <span>Verified</span>
    </span>
    
    <span class="badge badge-warning" style="
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background: #FFB900;
        color: #323130;
        border: 1px solid #FFB900;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    ">
        <span class="icon" aria-hidden="true" style="width: 12px; height: 12px; display: flex; align-items: center; justify-content: center;">
            <svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <path d="M10 2L2 18H18L10 2ZM10 6L14 14H6L10 6ZM9 11H11V9H9V11ZM9 13H11V15H9V13Z"/>
            </svg>
        </span>
        <span>Beta</span>
    </span>
    
    <span class="badge badge-success" style="
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background: #107C10;
        color: white;
        border: 1px solid #107C10;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    ">
        <span class="icon" aria-hidden="true" style="width: 12px; height: 12px; display: flex; align-items: center; justify-content: center;">
            <svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"/>
            </svg>
        </span>
        <span>New</span>
    </span>
</div>`
        },
        // Microsoft Learn Banner Components
        {
            id: 'ms-learn-banner-basic',
            name: 'Microsoft Learn Banner',
            description: 'Basic banner component for site-wide notifications',
            category: 'Banner',
            library: 'Atlas',
            htmlCode: `<div class="banner" style="
    background: #F3F2F1;
    border-bottom: 1px solid #E1DFDD;
    padding: 12px 24px;
    text-align: center;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
">
    <div class="banner-content" style="max-width: 1200px; margin: 0 auto;">
        <p style="
            margin: 0;
            color: #323130;
            font-size: 14px;
            line-height: 1.4;
        ">
            A banner about something happening in the world 
            <a href="#" style="color: #0078D4; text-decoration: none; font-weight: 600;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">Learn more</a>
        </p>
    </div>
</div>`
        },
        {
            id: 'ms-learn-banner-loading',
            name: 'Microsoft Learn Loading Banner',
            description: 'Loading banner to indicate pending operations',
            category: 'Banner',
            library: 'Atlas',
            htmlCode: `<div class="banner is-loading" style="
    background: #0078D4;
    color: white;
    border-bottom: 1px solid #106EBE;
    padding: 12px 24px;
    text-align: center;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    position: relative;
    overflow: hidden;
">
    <div class="banner-content" style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 12px;">
        <div style="
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-left-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        "></div>
        <p style="
            margin: 0;
            font-size: 14px;
            line-height: 1.4;
            font-weight: 500;
        ">Loading content...</p>
    </div>
    
    <style>
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</div>`
        },
        {
            id: 'ms-learn-banner-dismissible',
            name: 'Microsoft Learn Dismissible Banner',
            description: 'Banner with dismiss button using Microsoft Learn patterns',
            category: 'Banner',
            library: 'Atlas',
            htmlCode: `<div class="banner banner-dismissable" id="example-banner-id" style="
    background: #FFF4CE;
    border-bottom: 1px solid #DEECF9;
    padding: 12px 24px;
    text-align: center;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    position: relative;
">
    <div class="banner-content" style="max-width: 1200px; margin: 0 auto; padding-right: 40px;">
        <p style="
            margin: 0;
            color: #323130;
            font-size: 14px;
            line-height: 1.4;
        ">
            Important update: New Microsoft Learn features are now available. 
            <a href="#" style="color: #0078D4; text-decoration: none; font-weight: 600;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">Explore now</a>
        </p>
    </div>
    <button type="button" class="banner-dismiss" onclick="this.parentElement.style.display='none'" style="
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: #605E5C;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
    " onmouseover="this.style.background='rgba(0, 0, 0, 0.1)'" onmouseout="this.style.background='none'">
        <span style="position: absolute; left: -9999px;">Dismiss banner</span>
        <span class="icon" aria-hidden="true" style="width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 12px; height: 12px;">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
            </svg>
        </span>
    </button>
</div>`,
        },
        // Microsoft Learn Gradient Card Components
        {
            id: 'ms-learn-gradient-card',
            name: 'Microsoft Learn Gradient Card',
            description: 'Card with gradient border for emphasis and visual appeal',
            category: 'Card',
            library: 'Atlas',
            htmlCode: `<div class="gradient-card" style="
    position: relative;
    background: white;
    border-radius: 8px;
    padding: 24px;
    margin: 16px 0;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 2px solid transparent;
    background-clip: padding-box;
    overflow: hidden;
">
    <div style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #0078D4 0%, #00BCF2 50%, #40E0D0 100%);
        border-radius: 8px;
        z-index: -1;
        margin: -2px;
    "></div>
    <div class="gradient-card-content" style="
        position: relative;
        background: white;
        border-radius: 6px;
        padding: 20px;
        z-index: 1;
    ">
        <h3 style="margin: 0 0 12px 0; color: #323130; font-size: 18px; font-weight: 600;">Featured Content</h3>
        <p style="margin: 0 0 16px 0; color: #605E5C; line-height: 1.5;">This gradient card draws extra attention to important content with its colorful border treatment.</p>
        <a href="#" style="color: #0078D4; text-decoration: none; font-weight: 600;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">Learn more →</a>
    </div>
</div>`
        },
        {
            id: 'ms-learn-gradient-card-minimal',
            name: 'Microsoft Learn Minimal Gradient Card',
            description: 'Subtle gradient card with Microsoft Learn styling',
            category: 'Card',
            library: 'Atlas',
            htmlCode: `<div class="gradient-card" style="
    background: linear-gradient(135deg, #F8F8F8 0%, #FFFFFF 100%);
    border: 1px solid #E1DFDD;
    border-radius: 6px;
    padding: 20px;
    margin: 12px 0;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    transition: all 0.2s ease;
" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
    <div class="gradient-card-content">
        <h4 style="margin: 0 0 8px 0; color: #323130; font-size: 16px; font-weight: 600;">Subtle Gradient Card</h4>
        <p style="margin: 0; color: #605E5C; line-height: 1.4; font-size: 14px;">A more subtle approach to gradient cards with gentle background transitions.</p>
    </div>
</div>`
        },
        // Microsoft Learn Gradient Components
        {
            id: 'ms-learn-gradient-text',
            name: 'Microsoft Learn Gradient Text',
            description: 'Text with gradient color effects for emphasis',
            category: 'Typography',
            library: 'Atlas',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; padding: 20px;">
    <h2 style="
        font-size: 28px; 
        font-weight: 700; 
        margin: 0 0 16px 0; 
        color: #323130;
    ">
        A muted gradient from 
        <span class="gradient-text-purple-blue" style="
            background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
        ">purple to blue</span>
    </h2>
    
    <h2 style="
        font-size: 28px; 
        font-weight: 700; 
        margin: 0 0 16px 0; 
        color: #323130;
    ">
        A vivid gradient from 
        <span class="gradient-text-vivid" style="
            background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #45B7D1 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
        ">multiple colors</span>
    </h2>
    
    <p style="margin: 0; color: #605E5C; line-height: 1.5;">
        Use gradient text to highlight specific words or phrases within your content for better visual hierarchy.
    </p>
</div>`
        },
        {
            id: 'ms-learn-gradient-borders',
            name: 'Microsoft Learn Gradient Borders',
            description: 'Elements with gradient border effects for blending',
            category: 'Layout',
            library: 'Atlas',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <div style="display: flex; margin-bottom: 16px;">
        <div class="gradient-border-right" style="
            background: linear-gradient(to right, #0078D4, transparent);
            padding: 20px;
            flex: 1;
            color: white;
            background-color: #0078D4;
        ">
            A right gradient is applied with a background color.
        </div>
        <div style="
            background: #F8F8F8;
            padding: 20px;
            flex: 1;
            color: #323130;
        ">
            A background color is applied.
        </div>
    </div>
    
    <div style="margin-bottom: 16px;">
        <div class="gradient-border-bottom" style="
            background: linear-gradient(to bottom, #F3F2F1, transparent);
            padding: 20px;
            border-bottom: 1px solid transparent;
            background-color: #F3F2F1;
            color: #323130;
        ">
            A bottom gradient is applied.
        </div>
        <div style="
            background: #FFFFFF;
            padding: 20px;
            color: #323130;
        ">
            A background color is applied
        </div>
    </div>
</div>`
        },
        // Microsoft Learn Icon Components
        {
            id: 'ms-learn-icon-basic',
            name: 'Microsoft Learn Icon',
            description: 'Basic icon component with proper spacing and sizing',
            category: 'Icon',
            library: 'Atlas',
            htmlCode: `<div style="display: flex; gap: 16px; align-items: center; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <button style="
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: #0078D4;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s ease;
    " onmouseover="this.style.backgroundColor='#106EBE'" onmouseout="this.style.backgroundColor='#0078D4'">
        <span>Submit</span>
        <span class="icon" style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1em;
            height: 1em;
        ">
            <svg viewBox="0 0 16 16" fill="currentColor" style="width: 100%; height: 100%;">
                <path d="M8.5 3.5a.5.5 0 0 0-1 0V9H1.5a.5.5 0 0 0 0 1H7.5v5.5a.5.5 0 0 0 1 0V10h5.5a.5.5 0 0 0 0-1H8.5V3.5z"/>
            </svg>
        </span>
    </button>
    
    <button style="
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: #F3F2F1;
        color: #323130;
        border: 1px solid #C8C6C4;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s ease;
    " onmouseover="this.style.backgroundColor='#EDEBE9'" onmouseout="this.style.backgroundColor='#F3F2F1'">
        <span class="icon" style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1em;
            height: 1em;
        ">
            <svg viewBox="0 0 16 16" fill="currentColor" style="width: 100%; height: 100%;">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
            </svg>
        </span>
        <span>Delete</span>
    </button>
</div>`
        },
        {
            id: 'ms-learn-icon-sizes',
            name: 'Microsoft Learn Icon Sizes',
            description: 'Icons with different sizes that scale with text',
            category: 'Icon',
            library: 'Atlas',
            htmlCode: `<div style="display: flex; flex-direction: column; gap: 16px; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <button style="
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: #0078D4;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
    ">
        <span>Small Button</span>
        <span class="icon" style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1em;
            height: 1em;
        ">
            <svg viewBox="0 0 16 16" fill="currentColor" style="width: 100%; height: 100%;">
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
            </svg>
        </span>
    </button>
    
    <button style="
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: #0078D4;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
    ">
        <span>Default Button</span>
        <span class="icon" style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1em;
            height: 1em;
        ">
            <svg viewBox="0 0 16 16" fill="currentColor" style="width: 100%; height: 100%;">
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
            </svg>
        </span>
    </button>
    
    <button style="
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 16px 24px;
        background: #0078D4;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
    ">
        <span>Large Button</span>
        <span class="icon" style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1em;
            height: 1em;
        ">
            <svg viewBox="0 0 16 16" fill="currentColor" style="width: 100%; height: 100%;">
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
            </svg>
        </span>
    </button>
</div>`
        },
        {
            id: 'ms-learn-icon-svg',
            name: 'Microsoft Learn SVG Icons',
            description: 'SVG icons with Microsoft Learn styling and compatibility',
            category: 'Icon',
            library: 'Atlas',
            htmlCode: `<div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <button style="
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: #107C10;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
    ">
        <span>Success</span>
        <svg class="icon" style="width: 1em; height: 1em;" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.91a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
        </svg>
    </button>
    
    <button style="
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: #D83B01;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
    ">
        <span>Error</span>
        <svg class="icon" style="width: 1em; height: 1em;" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
        </svg>
    </button>
    
    <button style="
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: #00BCF2;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
    ">
        <span>Info</span>
        <svg class="icon" style="width: 1em; height: 1em;" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/>
        </svg>
    </button>
</div>`
        },
        // Microsoft Learn Image Components
        {
            id: 'ms-learn-image-basic',
            name: 'Microsoft Learn Image',
            description: 'Basic responsive image component with Microsoft Learn styling',
            category: 'Media',
            library: 'Atlas',
            htmlCode: `<div style="max-width: 400px; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <div class="image" style="
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #E1DFDD;
    ">
        <img src="https://via.placeholder.com/400x200/0078D4/FFFFFF?text=Microsoft+Learn" alt="Microsoft Learn placeholder" style="
            width: 100%;
            height: auto;
            display: block;
        " />
    </div>
    <div style="margin-top: 12px;">
        <h4 style="margin: 0 0 8px 0; color: #323130; font-size: 16px; font-weight: 600;">Learning Resource</h4>
        <p style="margin: 0; color: #605E5C; font-size: 14px; line-height: 1.4;">This image component provides proper responsive behavior and accessibility features.</p>
    </div>
</div>`
        },
        {
            id: 'ms-learn-image-sizes',
            name: 'Microsoft Learn Image Sizes',
            description: 'Various image sizes following Microsoft Learn specifications',
            category: 'Media',
            library: 'Atlas',
            htmlCode: `<div style="display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <div class="image image-32x32" style="
        width: 32px;
        height: 32px;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #E1DFDD;
        flex-shrink: 0;
    ">
        <img src="https://via.placeholder.com/32x32/0078D4/FFFFFF?text=32" alt="32x32 image" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
    
    <div class="image image-48x48" style="
        width: 48px;
        height: 48px;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid #E1DFDD;
        flex-shrink: 0;
    ">
        <img src="https://via.placeholder.com/48x48/107C10/FFFFFF?text=48" alt="48x48 image" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
    
    <div class="image image-64x64" style="
        width: 64px;
        height: 64px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #E1DFDD;
        flex-shrink: 0;
    ">
        <img src="https://via.placeholder.com/64x64/D83B01/FFFFFF?text=64" alt="64x64 image" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
    
    <div class="image image-96x96" style="
        width: 96px;
        height: 96px;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #E1DFDD;
        flex-shrink: 0;
    ">
        <img src="https://via.placeholder.com/96x96/FFB900/000000?text=96" alt="96x96 image" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
    
    <div class="image image-128x128" style="
        width: 128px;
        height: 128px;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid #E1DFDD;
        flex-shrink: 0;
    ">
        <img src="https://via.placeholder.com/128x128/00BCF2/FFFFFF?text=128" alt="128x128 image" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
</div>`
        },
        {
            id: 'ms-learn-image-responsive',
            name: 'Microsoft Learn Responsive Image',
            description: 'Responsive image with different sizes for different screen sizes',
            category: 'Media',
            library: 'Atlas',
            htmlCode: `<div style="max-width: 600px; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <div class="image" style="
        width: 100%;
        aspect-ratio: 16/9;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border: 1px solid #E1DFDD;
        position: relative;
    ">
        <img src="https://via.placeholder.com/600x338/0078D4/FFFFFF?text=Responsive+Image" alt="Responsive image example" style="
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        " />
        <div style="
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
            color: white;
            padding: 24px 20px 16px;
        ">
            <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600;">Responsive Design</h3>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">This image adapts to different screen sizes while maintaining its aspect ratio.</p>
        </div>
    </div>
    
    <style>
        @media (max-width: 768px) {
            .image {
                aspect-ratio: 4/3 !important;
            }
        }
        
        @media (max-width: 480px) {
            .image {
                aspect-ratio: 1/1 !important;
            }
        }
    </style>
</div>`
        },

        // NEW ATLAS COMPONENTS - Layout Components
        {
            id: 'ms-learn-layout-single',
            name: 'Microsoft Learn Single Layout',
            description: 'Single-column layout with centered content container',
            category: 'Layout',
            library: 'Atlas',
            htmlCode: `<div class="layout layout-single" style="
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 24px;
    background: #ffffff;
    min-height: 400px;
">
    <div class="layout-content" style="
        text-align: center;
        padding: 40px 0;
        border: 2px dashed #e1e5e9;
        border-radius: 8px;
        background: #fafafa;
    ">
        <h2 style="margin: 0 0 16px 0; color: #323130; font-size: 24px; font-weight: 600;">Single Column Layout</h2>
        <p style="margin: 0; color: #605e5c; font-size: 16px; line-height: 1.5;">
            This layout provides a centered single column that works well for articles, documentation, and focused content.
        </p>
    </div>
</div>`
        },
        {
            id: 'ms-learn-layout-holy-grail',
            name: 'Microsoft Learn Holy Grail Layout',
            description: 'Classic holy grail layout with header, footer, main content, and two sidebars',
            category: 'Layout',
            library: 'Atlas',
            htmlCode: `<div class="layout layout-holy-grail" style="
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    display: grid;
    grid-template-areas: 
        'header header header'
        'left main right'
        'footer footer footer';
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    min-height: 500px;
    gap: 16px;
    padding: 16px;
    background: #f8f9fa;
">
    <div class="layout-header" style="
        grid-area: header;
        background: #0078d4;
        color: white;
        padding: 16px 20px;
        border-radius: 4px;
        font-weight: 600;
        text-align: center;
    ">Header</div>
    
    <div class="layout-sidebar-left" style="
        grid-area: left;
        background: #ffffff;
        border: 1px solid #e1e5e9;
        border-radius: 4px;
        padding: 16px;
        color: #323130;
    ">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">Left Sidebar</h4>
        <p style="margin: 0; font-size: 13px; color: #605e5c;">Navigation or secondary content</p>
    </div>
    
    <div class="layout-main" style="
        grid-area: main;
        background: #ffffff;
        border: 1px solid #e1e5e9;
        border-radius: 4px;
        padding: 24px;
        color: #323130;
    ">
        <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Main Content Area</h3>
        <p style="margin: 0; color: #605e5c; line-height: 1.5;">
            This is the primary content area of the holy grail layout. It expands to fill available space while maintaining fixed-width sidebars.
        </p>
    </div>
    
    <div class="layout-sidebar-right" style="
        grid-area: right;
        background: #ffffff;
        border: 1px solid #e1e5e9;
        border-radius: 4px;
        padding: 16px;
        color: #323130;
    ">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">Right Sidebar</h4>
        <p style="margin: 0; font-size: 13px; color: #605e5c;">Widgets or related content</p>
    </div>
    
    <div class="layout-footer" style="
        grid-area: footer;
        background: #323130;
        color: white;
        padding: 16px 20px;
        border-radius: 4px;
        text-align: center;
        font-size: 14px;
    ">Footer</div>
    
    <style>
        @media (max-width: 768px) {
            .layout-holy-grail {
                grid-template-areas: 
                    'header'
                    'main'
                    'left'
                    'right'
                    'footer' !important;
                grid-template-columns: 1fr !important;
            }
        }
    </style>
</div>`
        },
        {
            id: 'ms-learn-layout-sidecar',
            name: 'Microsoft Learn Sidecar Layout',
            description: 'Two-column layout with main content and sidebar',
            category: 'Layout',
            library: 'Atlas',
            htmlCode: `<div class="layout layout-sidecar-right" style="
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 32px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 24px;
    background: #ffffff;
    min-height: 400px;
">
    <div class="layout-main" style="
        background: #ffffff;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        padding: 32px;
        color: #323130;
    ">
        <h2 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 600;">Main Content</h2>
        <p style="margin: 0 0 16px 0; color: #605e5c; line-height: 1.6; font-size: 16px;">
            This sidecar layout provides a main content area alongside a complementary sidebar. Perfect for articles with related information, documentation with navigation, or any content that benefits from additional context.
        </p>
        <p style="margin: 0; color: #605e5c; line-height: 1.6; font-size: 16px;">
            The layout automatically adapts to smaller screens by stacking the sidebar below the main content.
        </p>
    </div>
    
    <div class="layout-sidebar" style="
        background: #f8f9fa;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        padding: 24px;
        color: #323130;
    ">
        <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Related Content</h3>
        <div style="margin-bottom: 20px;">
            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #323130;">Quick Links</h4>
            <ul style="margin: 0; padding-left: 16px; color: #605e5c; font-size: 14px;">
                <li style="margin-bottom: 4px;"><a href="#" style="color: #0078d4; text-decoration: none;">Getting Started</a></li>
                <li style="margin-bottom: 4px;"><a href="#" style="color: #0078d4; text-decoration: none;">Best Practices</a></li>
                <li><a href="#" style="color: #0078d4; text-decoration: none;">Advanced Topics</a></li>
            </ul>
        </div>
        <div>
            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #323130;">Resources</h4>
            <p style="margin: 0; color: #605e5c; font-size: 13px; line-height: 1.4;">
                Additional resources and documentation links can be placed here for easy access.
            </p>
        </div>
    </div>
    
    <style>
        @media (max-width: 768px) {
            .layout-sidecar-right {
                grid-template-columns: 1fr !important;
            }
        }
    </style>
</div>`
        },

        // Link Button Components
        {
            id: 'ms-learn-link-button-basic',
            name: 'Microsoft Learn Link Button',
            description: 'Button-styled links with Microsoft Learn design patterns',
            category: 'Forms',
            library: 'Atlas',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
    <a href="#" class="link-button" style="
        display: inline-block;
        padding: 12px 24px;
        background: #0078d4;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        transition: background-color 0.2s ease;
        border: none;
        cursor: pointer;
    " onmouseover="this.style.backgroundColor='#106ebe'" onmouseout="this.style.backgroundColor='#0078d4'">
        Primary Link Button
    </a>
    
    <a href="#" class="link-button link-button-secondary" style="
        display: inline-block;
        padding: 10px 22px;
        background: transparent;
        color: #0078d4;
        text-decoration: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        transition: all 0.2s ease;
        border: 2px solid #0078d4;
        cursor: pointer;
    " onmouseover="this.style.backgroundColor='#0078d4'; this.style.color='white'" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#0078d4'">
        Secondary Link
    </a>
    
    <a href="#" class="link-button link-button-ghost" style="
        display: inline-block;
        padding: 12px 24px;
        background: transparent;
        color: #0078d4;
        text-decoration: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        transition: all 0.2s ease;
        border: none;
        cursor: pointer;
    " onmouseover="this.style.backgroundColor='rgba(0, 120, 212, 0.1)'" onmouseout="this.style.backgroundColor='transparent'">
        Ghost Link Button
    </a>
</div>`
        },

        // Markdown Components
        {
            id: 'ms-learn-markdown-content',
            name: 'Microsoft Learn Markdown Content',
            description: 'Styled markdown content with Microsoft Learn typography',
            category: 'Content',
            library: 'Atlas',
            htmlCode: `<div class="markdown" style="
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    max-width: 800px;
    padding: 32px;
    background: #ffffff;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    color: #323130;
    line-height: 1.6;
">
    <h1 style="
        font-size: 32px;
        font-weight: 600;
        color: #323130;
        margin: 0 0 24px 0;
        line-height: 1.2;
        border-bottom: 1px solid #e1e5e9;
        padding-bottom: 16px;
    ">Getting Started with Microsoft Learn</h1>
    
    <h2 style="
        font-size: 24px;
        font-weight: 600;
        color: #323130;
        margin: 32px 0 16px 0;
        line-height: 1.3;
    ">Introduction</h2>
    
    <p style="margin: 0 0 16px 0; color: #323130; font-size: 16px;">
        Microsoft Learn provides interactive learning experiences that help you build skills with Microsoft products. This comprehensive platform offers:
    </p>
    
    <ul style="margin: 0 0 16px 0; padding-left: 24px; color: #323130;">
        <li style="margin-bottom: 8px;">Hands-on learning modules</li>
        <li style="margin-bottom: 8px;">Interactive coding exercises</li>
        <li style="margin-bottom: 8px;">Industry-recognized certifications</li>
        <li>Progress tracking and achievements</li>
    </ul>
    
    <h3 style="
        font-size: 20px;
        font-weight: 600;
        color: #323130;
        margin: 24px 0 12px 0;
        line-height: 1.3;
    ">Key Features</h3>
    
    <ol style="margin: 0 0 16px 0; padding-left: 24px; color: #323130;">
        <li style="margin-bottom: 8px;"><strong>Self-paced learning</strong> - Learn at your own speed</li>
        <li style="margin-bottom: 8px;"><strong>Practical exercises</strong> - Apply what you learn immediately</li>
        <li><strong>Community support</strong> - Connect with other learners</li>
    </ol>
    
    <blockquote style="
        margin: 24px 0;
        padding: 16px 20px;
        background: #f8f9fa;
        border-left: 4px solid #0078d4;
        color: #605e5c;
        font-style: italic;
    ">
        "Microsoft Learn has transformed how we approach technical training in our organization."
    </blockquote>
    
    <p style="margin: 0; color: #323130; font-size: 16px;">
        Ready to get started? Explore our <a href="#" style="color: #0078d4; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">learning paths</a> and begin your journey today. You can also check out our <code style="
            background: #f3f2f1;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 14px;
            color: #d13438;
        ">inline code examples</code> throughout the documentation.
    </p>
</div>`
        },

        // Media Components
        {
            id: 'ms-learn-media-basic',
            name: 'Microsoft Learn Media',
            description: 'Media component with left-aligned image and flexible content',
            category: 'Media',
            library: 'Atlas',
            htmlCode: `<div class="media" style="
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    display: flex;
    gap: 16px;
    padding: 20px;
    background: #ffffff;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    max-width: 600px;
">
    <div class="media-left" style="flex-shrink: 0;">
        <img src="https://via.placeholder.com/80x80/0078d4/ffffff?text=MS" alt="Microsoft Learn" style="
            width: 80px;
            height: 80px;
            border-radius: 8px;
            object-fit: cover;
            border: 1px solid #e1e5e9;
        " />
    </div>
    
    <div class="media-content" style="flex: 1; min-width: 0;">
        <h3 style="
            margin: 0 0 8px 0;
            font-size: 18px;
            font-weight: 600;
            color: #323130;
            line-height: 1.3;
        ">Microsoft Azure Fundamentals</h3>
        
        <p style="
            margin: 0 0 12px 0;
            color: #605e5c;
            font-size: 14px;
            line-height: 1.5;
        ">
            Learn cloud computing concepts, core Azure services, security, privacy, compliance, and trust. This learning path prepares you for the AZ-900 certification exam.
        </p>
        
        <div style="display: flex; gap: 12px; align-items: center; font-size: 13px; color: #605e5c;">
            <span>⏱️ 4-6 hours</span>
            <span>•</span>
            <span>📊 Beginner</span>
            <span>•</span>
            <span style="
                background: #e1f5fe;
                color: #0078d4;
                padding: 2px 8px;
                border-radius: 12px;
                font-weight: 600;
                font-size: 11px;
            ">FREE</span>
        </div>
    </div>
</div>`
        },

        // Message Components
        {
            id: 'ms-learn-message-basic',
            name: 'Microsoft Learn Message',
            description: 'Chat-style message with persona integration and sizing options',
            category: 'Communication',
            library: 'Atlas',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 600px;">
    <div class="message" style="
        display: flex;
        gap: 12px;
        padding: 16px;
        background: #ffffff;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        margin-bottom: 12px;
    ">
        <div class="message-avatar" style="flex-shrink: 0;">
            <div style="
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #0078d4, #106ebe);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 16px;
            ">AI</div>
        </div>
        
        <div class="message-content" style="flex: 1; min-width: 0;">
            <div class="message-header" style="
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
            ">
                <span style="
                    font-weight: 600;
                    color: #323130;
                    font-size: 14px;
                ">Learning Assistant</span>
                <span style="
                    font-size: 12px;
                    color: #605e5c;
                ">2 minutes ago</span>
            </div>
            
            <div class="message-body" style="
                color: #323130;
                font-size: 14px;
                line-height: 1.5;
                margin-bottom: 12px;
            ">
                Welcome to Microsoft Learn! I'm here to help you find the right learning path for your goals. What technology would you like to explore today?
            </div>
            
            <div class="message-actions" style="
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            ">
                <button style="
                    padding: 6px 12px;
                    background: #f3f2f1;
                    color: #323130;
                    border: 1px solid #c8c6c4;
                    border-radius: 16px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                " onmouseover="this.style.backgroundColor='#edebe9'" onmouseout="this.style.backgroundColor='#f3f2f1'">
                    Azure
                </button>
                <button style="
                    padding: 6px 12px;
                    background: #f3f2f1;
                    color: #323130;
                    border: 1px solid #c8c6c4;
                    border-radius: 16px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                " onmouseover="this.style.backgroundColor='#edebe9'" onmouseout="this.style.backgroundColor='#f3f2f1'">
                    Microsoft 365
                </button>
                <button style="
                    padding: 6px 12px;
                    background: #f3f2f1;
                    color: #323130;
                    border: 1px solid #c8c6c4;
                    border-radius: 16px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                " onmouseover="this.style.backgroundColor='#edebe9'" onmouseout="this.style.backgroundColor='#f3f2f1'">
                    Power Platform
                </button>
            </div>
        </div>
    </div>
    
    <!-- User Message -->
    <div class="message message-sender" style="
        display: flex;
        gap: 12px;
        padding: 16px;
        background: #f8f9fa;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        flex-direction: row-reverse;
    ">
        <div class="message-avatar" style="flex-shrink: 0;">
            <div style="
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #323130;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 16px;
            ">U</div>
        </div>
        
        <div class="message-content" style="flex: 1; min-width: 0; text-align: right;">
            <div class="message-header" style="
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
                justify-content: flex-end;
            ">
                <span style="
                    font-size: 12px;
                    color: #605e5c;
                ">Just now</span>
                <span style="
                    font-weight: 600;
                    color: #323130;
                    font-size: 14px;
                ">You</span>
            </div>
            
            <div class="message-body" style="
                color: #323130;
                font-size: 14px;
                line-height: 1.5;
            ">
                I'm interested in learning Azure. Can you recommend a good starting point?
            </div>
        </div>
    </div>
</div>`
        },

        // Notification Components
        {
            id: 'ms-learn-notification-basic',
            name: 'Microsoft Learn Notification',
            description: 'Colored notification blocks with semantic variants',
            category: 'Communication',
            library: 'Atlas',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; display: flex; flex-direction: column; gap: 12px; max-width: 500px;">
    <!-- Success Notification -->
    <div class="notification notification-success" style="
        padding: 16px 20px;
        background: #f3f9fd;
        border: 1px solid #c7e0f4;
        border-left: 4px solid #107c10;
        border-radius: 4px;
        color: #323130;
        position: relative;
    ">
        <div style="display: flex; align-items: flex-start; gap: 12px;">
            <div style="
                width: 20px;
                height: 20px;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #107c10;
                font-size: 16px;
                margin-top: 2px;
            ">✓</div>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 4px; font-size: 14px;">Learning path completed!</div>
                <div style="font-size: 14px; color: #605e5c; line-height: 1.4;">
                    Congratulations! You've successfully completed the Azure Fundamentals learning path.
                </div>
            </div>
            <button onclick="this.parentElement.parentElement.style.display='none'" style="
                background: none;
                border: none;
                color: #605e5c;
                cursor: pointer;
                font-size: 16px;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            ">×</button>
        </div>
    </div>
    
    <!-- Info Notification -->
    <div class="notification notification-info" style="
        padding: 16px 20px;
        background: #f3f9fd;
        border: 1px solid #c7e0f4;
        border-left: 4px solid #0078d4;
        border-radius: 4px;
        color: #323130;
        position: relative;
    ">
        <div style="display: flex; align-items: flex-start; gap: 12px;">
            <div style="
                width: 20px;
                height: 20px;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #0078d4;
                font-size: 16px;
                margin-top: 2px;
            ">ℹ</div>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 4px; font-size: 14px;">New content available</div>
                <div style="font-size: 14px; color: #605e5c; line-height: 1.4;">
                    Check out the latest modules in the AI and Machine Learning learning path.
                </div>
            </div>
            <button onclick="this.parentElement.parentElement.style.display='none'" style="
                background: none;
                border: none;
                color: #605e5c;
                cursor: pointer;
                font-size: 16px;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            ">×</button>
        </div>
    </div>
    
    <!-- Warning Notification -->
    <div class="notification notification-warning" style="
        padding: 16px 20px;
        background: #fff9f5;
        border: 1px solid #fdcfb4;
        border-left: 4px solid #ffb900;
        border-radius: 4px;
        color: #323130;
        position: relative;
    ">
        <div style="display: flex; align-items: flex-start; gap: 12px;">
            <div style="
                width: 20px;
                height: 20px;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ff8c00;
                font-size: 16px;
                margin-top: 2px;
            ">⚠</div>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 4px; font-size: 14px;">Certification deadline approaching</div>
                <div style="font-size: 14px; color: #605e5c; line-height: 1.4;">
                    Your Azure certification expires in 30 days. Schedule your renewal exam soon.
                </div>
            </div>
            <button onclick="this.parentElement.parentElement.style.display='none'" style="
                background: none;
                border: none;
                color: #605e5c;
                cursor: pointer;
                font-size: 16px;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            ">×</button>
        </div>
    </div>
    
    <!-- Danger Notification -->
    <div class="notification notification-danger" style="
        padding: 16px 20px;
        background: #fdf6f6;
        border: 1px solid #f1bbbb;
        border-left: 4px solid #d13438;
        border-radius: 4px;
        color: #323130;
        position: relative;
    ">
        <div style="display: flex; align-items: flex-start; gap: 12px;">
            <div style="
                width: 20px;
                height: 20px;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #d13438;
                font-size: 16px;
                margin-top: 2px;
            ">⚠</div>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 4px; font-size: 14px;">Action required</div>
                <div style="font-size: 14px; color: #605e5c; line-height: 1.4;">
                    Your account verification is incomplete. Please verify your email address to continue.
                </div>
            </div>
            <button onclick="this.parentElement.parentElement.style.display='none'" style="
                background: none;
                border: none;
                color: #605e5c;
                cursor: pointer;
                font-size: 16px;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            ">×</button>
        </div>
    </div>
</div>`
        },

        // Pagination Components
        {
            id: 'ms-learn-pagination-basic',
            name: 'Microsoft Learn Pagination',
            description: 'Page navigation with previous/next buttons and numbered pages',
            category: 'Navigation',
            library: 'Atlas',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <nav class="pagination" role="navigation" aria-label="Page navigation" style="
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 20px 0;
    ">
        <button class="pagination-prev" disabled style="
            padding: 8px 12px;
            background: #f3f2f1;
            color: #a19f9d;
            border: 1px solid #c8c6c4;
            border-radius: 4px;
            font-size: 14px;
            cursor: not-allowed;
            font-family: inherit;
        ">← Previous</button>
        
        <div class="pagination-pages" style="display: flex; gap: 4px; margin: 0 8px;">
            <button class="pagination-page current" style="
                width: 36px;
                height: 36px;
                background: #0078d4;
                color: white;
                border: 1px solid #0078d4;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                font-family: inherit;
            ">1</button>
            
            <button class="pagination-page" style="
                width: 36px;
                height: 36px;
                background: #ffffff;
                color: #323130;
                border: 1px solid #c8c6c4;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
                font-family: inherit;
                transition: background-color 0.2s ease;
            " onmouseover="this.style.backgroundColor='#f3f2f1'" onmouseout="this.style.backgroundColor='#ffffff'">2</button>
            
            <button class="pagination-page" style="
                width: 36px;
                height: 36px;
                background: #ffffff;
                color: #323130;
                border: 1px solid #c8c6c4;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
                font-family: inherit;
                transition: background-color 0.2s ease;
            " onmouseover="this.style.backgroundColor='#f3f2f1'" onmouseout="this.style.backgroundColor='#ffffff'">3</button>
            
            <span class="pagination-ellipsis" style="
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #605e5c;
                font-size: 14px;
            ">…</span>
            
            <button class="pagination-page" style="
                width: 36px;
                height: 36px;
                background: #ffffff;
                color: #323130;
                border: 1px solid #c8c6c4;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
                font-family: inherit;
                transition: background-color 0.2s ease;
            " onmouseover="this.style.backgroundColor='#f3f2f1'" onmouseout="this.style.backgroundColor='#ffffff'">10</button>
        </div>
        
        <button class="pagination-next" style="
            padding: 8px 12px;
            background: #ffffff;
            color: #323130;
            border: 1px solid #c8c6c4;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            font-family: inherit;
            transition: background-color 0.2s ease;
        " onmouseover="this.style.backgroundColor='#f3f2f1'" onmouseout="this.style.backgroundColor='#ffffff'">Next →</button>
    </nav>
    
    <div class="pagination-info" style="
        text-align: center;
        color: #605e5c;
        font-size: 14px;
        margin-top: 8px;
    ">
        Showing page 1 of 10 (95 total items)
    </div>
</div>`
        },

        // Persona Components
        {
            id: 'ms-learn-persona-basic',
            name: 'Microsoft Learn Persona',
            description: 'User representation with avatar and details in multiple sizes',
            category: 'User',
            library: 'Atlas',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; display: flex; flex-direction: column; gap: 24px;">
    <!-- Large Persona -->
    <div class="persona persona-lg" style="
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        background: #ffffff;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
    ">
        <div class="persona-avatar" style="
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: linear-gradient(135deg, #0078d4, #106ebe);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 28px;
            font-weight: 600;
            flex-shrink: 0;
            position: relative;
        ">
            SM
            <div style="
                position: absolute;
                bottom: 2px;
                right: 2px;
                width: 16px;
                height: 16px;
                background: #107c10;
                border: 2px solid #ffffff;
                border-radius: 50%;
            "></div>
        </div>
        
        <div class="persona-details" style="flex: 1;">
            <h3 style="
                margin: 0 0 4px 0;
                font-size: 20px;
                font-weight: 600;
                color: #323130;
            ">Sarah Miller</h3>
            <p style="
                margin: 0 0 8px 0;
                font-size: 16px;
                color: #605e5c;
            ">Cloud Solutions Architect</p>
            <div style="
                display: flex;
                gap: 12px;
                align-items: center;
                font-size: 14px;
                color: #605e5c;
            ">
                <span>📍 Seattle, WA</span>
                <span>•</span>
                <span>📧 sarah.miller@company.com</span>
            </div>
        </div>
        
        <div class="persona-actions" style="display: flex; gap: 8px;">
            <button style="
                padding: 8px 16px;
                background: #0078d4;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                font-family: inherit;
            ">Message</button>
            <button style="
                padding: 8px 16px;
                background: #f3f2f1;
                color: #323130;
                border: 1px solid #c8c6c4;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
                font-family: inherit;
            ">View Profile</button>
        </div>
    </div>
    
    <!-- Default Persona -->
    <div class="persona" style="
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: #f8f9fa;
        border: 1px solid #e1e5e9;
        border-radius: 6px;
    ">
        <div class="persona-avatar" style="
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ca5010, #a4400e);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
            font-weight: 600;
            flex-shrink: 0;
        ">JD</div>
        
        <div class="persona-details" style="flex: 1;">
            <h4 style="
                margin: 0 0 2px 0;
                font-size: 16px;
                font-weight: 600;
                color: #323130;
            ">John Doe</h4>
            <p style="
                margin: 0;
                font-size: 14px;
                color: #605e5c;
            ">Software Developer • Online 5 min ago</p>
        </div>
    </div>
    
    <!-- Small Persona -->
    <div class="persona persona-sm" style="
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        background: #ffffff;
        border-radius: 4px;
    ">
        <div class="persona-avatar" style="
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(135deg, #038387, #026c70);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            font-weight: 600;
            flex-shrink: 0;
        ">AB</div>
        
        <div class="persona-details">
            <span style="
                font-size: 14px;
                font-weight: 600;
                color: #323130;
            ">Alice Brown</span>
        </div>
    </div>
</div>`
        },

        // Popover Components
        {
            id: 'ms-learn-popover-basic',
            name: 'Microsoft Learn Popover',
            description: 'Popup content overlays with dynamic positioning and caret',
            category: 'User',
            library: 'Atlas',
            htmlCode: `<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; padding: 40px; position: relative;">
    <h3 style="margin: 0 0 20px 0; color: #323130;">Popover Examples</h3>
    
    <!-- Basic Popover -->
    <details class="popover margin-xs" style="
        position: relative;
        display: inline-block;
        margin-right: 24px;
        margin-bottom: 16px;
    ">
        <summary class="link-button" style="
            background: none;
            border: none;
            color: #0078d4;
            cursor: pointer;
            padding: 8px 12px;
            font-size: 14px;
            text-decoration: underline;
            font-family: inherit;
        ">Click for details</summary>
        
        <div class="popover-content" style="
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 8px;
            background: white;
            border: 1px solid #c8c6c4;
            border-radius: 6px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14), 0 0px 4px rgba(0, 0, 0, 0.12);
            padding: 16px;
            min-width: 200px;
            max-width: 300px;
            z-index: 1000;
        ">
            <p style="margin: 0 0 12px 0; color: #323130; font-size: 14px; line-height: 1.4;">
                It can be a paragraph of text.
            </p>
            <p style="margin: 0 0 8px 0; color: #323130; font-size: 14px; font-weight: 600;">Or a list:</p>
            <ul style="margin: 0 0 12px 0; padding-left: 16px;">
                <li><a href="#" style="color: #0078d4; text-decoration: none;">List item</a></li>
                <li><a href="#" style="color: #0078d4; text-decoration: none;">List item</a></li>
                <li><a href="#" style="color: #0078d4; text-decoration: none;">List item</a></li>
            </ul>
            <p style="margin: 0; color: #323130; font-size: 14px; line-height: 1.4;">
                Or basically anything else you can think of.
            </p>
        </div>
    </details>
    
    <!-- Popover with Caret -->
    <details class="popover popover-caret margin-xs" style="
        position: relative;
        display: inline-block;
        margin-right: 24px;
        margin-bottom: 16px;
    ">
        <summary class="button" style="
            background: #0078d4;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            font-family: inherit;
        ">Popover with Caret</summary>
        
        <div class="popover-content" style="
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 8px;
            background: white;
            border: 1px solid #c8c6c4;
            border-radius: 6px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14), 0 0px 4px rgba(0, 0, 0, 0.12);
            padding: 16px;
            min-width: 250px;
            max-width: 350px;
            z-index: 1000;
        ">
            <!-- Caret -->
            <div style="
                position: absolute;
                top: -6px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-bottom: 6px solid white;
                z-index: 1001;
            "></div>
            <div style="
                position: absolute;
                top: -7px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 7px solid transparent;
                border-right: 7px solid transparent;
                border-bottom: 7px solid #c8c6c4;
                z-index: 1000;
            "></div>
            
            <p style="margin: 0; color: #323130; font-size: 14px; line-height: 1.5;">
                Popover content will be centered by default, but will adjust positioning dynamically to prevent overflow.
            </p>
        </div>
    </details>
    
    <!-- Styled Button Popover -->
    <details class="popover margin-xs" style="
        position: relative;
        display: inline-block;
        margin-bottom: 16px;
    ">
        <summary class="button border" style="
            background: white;
            color: #323130;
            border: 1px solid #c8c6c4;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            font-family: inherit;
            display: flex;
            align-items: center;
            gap: 8px;
        ">
            <span class="icon color-primary" style="
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #0078d4;
            ">
                <svg class="fill-current-color" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" style="width: 100%; height: 100%;" fill="currentColor">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
            </span>
            <span>Options</span>
        </summary>
        
        <div class="popover-content" style="
            position: absolute;
            top: 100%;
            left: 0;
            margin-top: 8px;
            background: white;
            border: 1px solid #c8c6c4;
            border-radius: 6px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14), 0 0px 4px rgba(0, 0, 0, 0.12);
            padding: 8px 0;
            min-width: 160px;
            z-index: 1000;
        ">
            <div style="
                padding: 8px 16px;
                color: #323130;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s ease;
            " onmouseover="this.style.backgroundColor='#f3f2f1'" onmouseout="this.style.backgroundColor='transparent'">
                Edit item
            </div>
            <div style="
                padding: 8px 16px;
                color: #323130;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s ease;
            " onmouseover="this.style.backgroundColor='#f3f2f1'" onmouseout="this.style.backgroundColor='transparent'">
                Share item
            </div>
            <div style="height: 1px; background: #e1e5e9; margin: 4px 0;"></div>
            <div style="
                padding: 8px 16px;
                color: #d13438;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s ease;
            " onmouseover="this.style.backgroundColor='#fdf6f6'" onmouseout="this.style.backgroundColor='transparent'">
                Delete item
            </div>
        </div>
    </details>
</div>`
        },

        // Table - Data table layouts
        {
            id: 'atlas-table',
            name: 'Table',
            description: 'Data table layouts with Microsoft Learn styling',
            category: 'Data Display',
            library: 'Atlas',
            htmlCode: `<div style="margin: 16px 0; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <table style="
        width: 100%;
        border-collapse: collapse;
        background: white;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    ">
        <thead>
            <tr style="background: #f8f9fa; border-bottom: 2px solid #e1e5e9;">
                <th style="
                    padding: 12px 16px;
                    text-align: left;
                    font-weight: 600;
                    color: #323130;
                    font-size: 14px;
                    border-right: 1px solid #e1e5e9;
                ">Name</th>
                <th style="
                    padding: 12px 16px;
                    text-align: left;
                    font-weight: 600;
                    color: #323130;
                    font-size: 14px;
                    border-right: 1px solid #e1e5e9;
                ">Status</th>
                <th style="
                    padding: 12px 16px;
                    text-align: left;
                    font-weight: 600;
                    color: #323130;
                    font-size: 14px;
                    border-right: 1px solid #e1e5e9;
                ">Category</th>
                <th style="
                    padding: 12px 16px;
                    text-align: left;
                    font-weight: 600;
                    color: #323130;
                    font-size: 14px;
                ">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr style="border-bottom: 1px solid #e1e5e9; transition: background-color 0.2s ease;" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='white'">
                <td style="padding: 12px 16px; color: #323130; font-size: 14px; border-right: 1px solid #e1e5e9;">
                    <strong>Azure Fundamentals</strong>
                </td>
                <td style="padding: 12px 16px; border-right: 1px solid #e1e5e9;">
                    <span style="
                        background: #dff6dd;
                        color: #107c10;
                        padding: 4px 8px;
                        border-radius: 12px;
                        font-size: 12px;
                        font-weight: 500;
                    ">Active</span>
                </td>
                <td style="padding: 12px 16px; color: #605e5c; font-size: 14px; border-right: 1px solid #e1e5e9;">Fundamentals</td>
                <td style="padding: 12px 16px;">
                    <button style="
                        background: #0078d4;
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 4px;
                        font-size: 12px;
                        cursor: pointer;
                        margin-right: 8px;
                    ">Edit</button>
                    <button style="
                        background: white;
                        color: #605e5c;
                        border: 1px solid #c8c6c4;
                        padding: 6px 12px;
                        border-radius: 4px;
                        font-size: 12px;
                        cursor: pointer;
                    ">View</button>
                </td>
            </tr>
            <tr style="border-bottom: 1px solid #e1e5e9; transition: background-color 0.2s ease;" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='white'">
                <td style="padding: 12px 16px; color: #323130; font-size: 14px; border-right: 1px solid #e1e5e9;">
                    <strong>Data Analytics</strong>
                </td>
                <td style="padding: 12px 16px; border-right: 1px solid #e1e5e9;">
                    <span style="
                        background: #fff4ce;
                        color: #8a6914;
                        padding: 4px 8px;
                        border-radius: 12px;
                        font-size: 12px;
                        font-weight: 500;
                    ">Pending</span>
                </td>
                <td style="padding: 12px 16px; color: #605e5c; font-size: 14px; border-right: 1px solid #e1e5e9;">Associate</td>
                <td style="padding: 12px 16px;">
                    <button style="
                        background: #0078d4;
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 4px;
                        font-size: 12px;
                        cursor: pointer;
                        margin-right: 8px;
                    ">Edit</button>
                    <button style="
                        background: white;
                        color: #605e5c;
                        border: 1px solid #c8c6c4;
                        padding: 6px 12px;
                        border-radius: 4px;
                        font-size: 12px;
                        cursor: pointer;
                    ">View</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>`
        },

        // Tag - Content tags and labels
        {
            id: 'atlas-tag',
            name: 'Tag',
            description: 'Content tags and labels with Microsoft Learn styling',
            category: 'Data Display',
            library: 'Atlas',
            htmlCode: `<div style="margin: 16px 0; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <!-- Tag Examples -->
    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
        <!-- Primary Tags -->
        <span style="
            background: #0078d4;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        ">
            Azure
        </span>
        
        <span style="
            background: #107c10;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        ">
            ✓ Certified
        </span>
        
        <!-- Secondary Tags -->
        <span style="
            background: #f3f2f1;
            color: #323130;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            border: 1px solid #c8c6c4;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        ">
            Fundamentals
        </span>
        
        <span style="
            background: #fff4ce;
            color: #8a6914;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        ">
            ⏰ In Progress
        </span>
        
        <!-- Error/Warning Tags -->
        <span style="
            background: #fde7e9;
            color: #d13438;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        ">
            ⚠ Expired
        </span>
    </div>
    
    <!-- Removable Tags -->
    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        <span style="
            background: #f3f2f1;
            color: #323130;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            border: 1px solid #c8c6c4;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        ">
            Machine Learning
            <button style="
                background: none;
                border: none;
                color: #605e5c;
                font-size: 14px;
                cursor: pointer;
                padding: 0;
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s ease;
            " onmouseover="this.style.backgroundColor='#e1dfdd'" onmouseout="this.style.backgroundColor='transparent'">×</button>
        </span>
        
        <span style="
            background: #f3f2f1;
            color: #323130;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            border: 1px solid #c8c6c4;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        ">
            Data Science
            <button style="
                background: none;
                border: none;
                color: #605e5c;
                font-size: 14px;
                cursor: pointer;
                padding: 0;
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s ease;
            " onmouseover="this.style.backgroundColor='#e1dfdd'" onmouseout="this.style.backgroundColor='transparent'">×</button>
        </span>
    </div>
</div>`
        },

        // Textarea - Multi-line text inputs
        {
            id: 'atlas-textarea',
            name: 'Textarea',
            description: 'Multi-line text inputs with Microsoft Learn styling',
            category: 'Forms',
            library: 'Atlas',
            htmlCode: `<div style="margin: 16px 0; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <!-- Basic Textarea -->
    <div style="margin-bottom: 16px;">
        <label style="
            display: block;
            margin-bottom: 4px;
            font-weight: 600;
            color: #323130;
            font-size: 14px;
        ">Description</label>
        <textarea 
            placeholder="Enter your description here..."
            style="
                width: 100%;
                min-height: 80px;
                padding: 8px 12px;
                border: 1px solid #c8c6c4;
                border-radius: 4px;
                font-family: inherit;
                font-size: 14px;
                color: #323130;
                background: white;
                resize: vertical;
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
                box-sizing: border-box;
            "
            onfocus="this.style.borderColor='#0078d4'; this.style.boxShadow='0 0 0 1px #0078d4'"
            onblur="this.style.borderColor='#c8c6c4'; this.style.boxShadow='none'"
        ></textarea>
    </div>
    
    <!-- Textarea with Helper Text -->
    <div style="margin-bottom: 16px;">
        <label style="
            display: block;
            margin-bottom: 4px;
            font-weight: 600;
            color: #323130;
            font-size: 14px;
        ">Comments</label>
        <textarea 
            placeholder="Share your thoughts..."
            style="
                width: 100%;
                min-height: 100px;
                padding: 8px 12px;
                border: 1px solid #c8c6c4;
                border-radius: 4px;
                font-family: inherit;
                font-size: 14px;
                color: #323130;
                background: white;
                resize: vertical;
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
                box-sizing: border-box;
            "
            onfocus="this.style.borderColor='#0078d4'; this.style.boxShadow='0 0 0 1px #0078d4'"
            onblur="this.style.borderColor='#c8c6c4'; this.style.boxShadow='none'"
        ></textarea>
        <div style="
            margin-top: 4px;
            font-size: 12px;
            color: #605e5c;
            display: flex;
            justify-content: space-between;
        ">
            <span>Be specific and constructive in your feedback</span>
            <span>0/500</span>
        </div>
    </div>
    
    <!-- Required Textarea -->
    <div style="margin-bottom: 16px;">
        <label style="
            display: block;
            margin-bottom: 4px;
            font-weight: 600;
            color: #323130;
            font-size: 14px;
        ">
            Feedback 
            <span style="color: #d13438;">*</span>
        </label>
        <textarea 
            placeholder="This field is required..."
            required
            style="
                width: 100%;
                min-height: 80px;
                padding: 8px 12px;
                border: 1px solid #c8c6c4;
                border-radius: 4px;
                font-family: inherit;
                font-size: 14px;
                color: #323130;
                background: white;
                resize: vertical;
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
                box-sizing: border-box;
            "
            onfocus="this.style.borderColor='#0078d4'; this.style.boxShadow='0 0 0 1px #0078d4'"
            onblur="this.style.borderColor='#c8c6c4'; this.style.boxShadow='none'"
        ></textarea>
    </div>
    
    <!-- Disabled Textarea -->
    <div>
        <label style="
            display: block;
            margin-bottom: 4px;
            font-weight: 600;
            color: #a19f9d;
            font-size: 14px;
        ">Read-only Content</label>
        <textarea 
            disabled
            style="
                width: 100%;
                min-height: 60px;
                padding: 8px 12px;
                border: 1px solid #e1dfdd;
                border-radius: 4px;
                font-family: inherit;
                font-size: 14px;
                color: #a19f9d;
                background: #f3f2f1;
                resize: vertical;
                box-sizing: border-box;
                cursor: not-allowed;
            "
        >This content cannot be edited.</textarea>
    </div>
</div>`
        },

        // Timeline - Timeline displays
        {
            id: 'atlas-timeline',
            name: 'Timeline',
            description: 'Timeline displays with Microsoft Learn styling',
            category: 'Data Display',
            library: 'Atlas',
            htmlCode: `<div style="margin: 16px 0; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <div style="position: relative; padding-left: 32px;">
        <!-- Timeline line -->
        <div style="
            position: absolute;
            left: 12px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #e1e5e9;
        "></div>
        
        <!-- Timeline Item 1 -->
        <div style="position: relative; margin-bottom: 24px;">
            <div style="
                position: absolute;
                left: -26px;
                top: 2px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #0078d4;
                border: 2px solid white;
                box-shadow: 0 0 0 2px #0078d4;
            "></div>
            <div style="
                background: white;
                padding: 16px;
                border-radius: 8px;
                border: 1px solid #e1e5e9;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            ">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <h4 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">
                        Azure Fundamentals Completed
                    </h4>
                    <span style="
                        background: #dff6dd;
                        color: #107c10;
                        padding: 4px 8px;
                        border-radius: 12px;
                        font-size: 12px;
                        font-weight: 500;
                        white-space: nowrap;
                    ">Completed</span>
                </div>
                <p style="margin: 0 0 8px 0; color: #605e5c; font-size: 14px; line-height: 1.5;">
                    Successfully completed the Azure Fundamentals certification exam (AZ-900) with a score of 85%.
                </p>
                <div style="color: #8a8886; font-size: 12px;">
                    March 15, 2024 • 2:30 PM
                </div>
            </div>
        </div>
        
        <!-- Timeline Item 2 -->
        <div style="position: relative; margin-bottom: 24px;">
            <div style="
                position: absolute;
                left: -26px;
                top: 2px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #fff4ce;
                border: 2px solid white;
                box-shadow: 0 0 0 2px #f7630c;
            "></div>
            <div style="
                background: white;
                padding: 16px;
                border-radius: 8px;
                border: 1px solid #e1e5e9;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            ">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <h4 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">
                        Data Analytics Path Started
                    </h4>
                    <span style="
                        background: #fff4ce;
                        color: #8a6914;
                        padding: 4px 8px;
                        border-radius: 12px;
                        font-size: 12px;
                        font-weight: 500;
                        white-space: nowrap;
                    ">In Progress</span>
                </div>
                <p style="margin: 0 0 8px 0; color: #605e5c; font-size: 14px; line-height: 1.5;">
                    Enrolled in the Azure Data Analytics learning path. Currently working on module 3 of 8.
                </p>
                <div style="color: #8a8886; font-size: 12px;">
                    March 18, 2024 • 9:15 AM
                </div>
            </div>
        </div>
        
        <!-- Timeline Item 3 -->
        <div style="position: relative; margin-bottom: 24px;">
            <div style="
                position: absolute;
                left: -26px;
                top: 2px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #f3f2f1;
                border: 2px solid white;
                box-shadow: 0 0 0 2px #c8c6c4;
            "></div>
            <div style="
                background: white;
                padding: 16px;
                border-radius: 8px;
                border: 1px solid #e1e5e9;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            ">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <h4 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">
                        AI Engineer Associate Scheduled
                    </h4>
                    <span style="
                        background: #f3f2f1;
                        color: #605e5c;
                        padding: 4px 8px;
                        border-radius: 12px;
                        font-size: 12px;
                        font-weight: 500;
                        white-space: nowrap;
                    ">Upcoming</span>
                </div>
                <p style="margin: 0 0 8px 0; color: #605e5c; font-size: 14px; line-height: 1.5;">
                    Scheduled to take the AI Engineer Associate certification exam (AI-102) next month.
                </p>
                <div style="color: #8a8886; font-size: 12px;">
                    Scheduled for April 20, 2024 • 10:00 AM
                </div>
            </div>
        </div>
    </div>
</div>`
        },

        // Toggle - Toggle switches
        {
            id: 'atlas-toggle',
            name: 'Toggle',
            description: 'Toggle switches with Microsoft Learn styling',
            category: 'Forms',
            library: 'Atlas',
            htmlCode: `<div style="margin: 16px 0; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;">
    <!-- Basic Toggle -->
    <div style="margin-bottom: 24px;">
        <label style="
            display: flex;
            align-items: center;
            cursor: pointer;
            gap: 12px;
        ">
            <div style="position: relative;">
                <input 
                    type="checkbox" 
                    style="
                        appearance: none;
                        width: 44px;
                        height: 24px;
                        background: #c8c6c4;
                        border-radius: 12px;
                        transition: background-color 0.2s ease;
                        cursor: pointer;
                        outline: none;
                    "
                    onchange="
                        this.style.background = this.checked ? '#0078d4' : '#c8c6c4';
                        this.nextElementSibling.style.transform = this.checked ? 'translateX(20px)' : 'translateX(0)';
                        this.nextElementSibling.style.background = this.checked ? 'white' : 'white';
                    "
                />
                <div style="
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    transition: transform 0.2s ease;
                    pointer-events: none;
                "></div>
            </div>
            <span style="color: #323130; font-size: 14px; font-weight: 500;">
                Enable notifications
            </span>
        </label>
    </div>
    
    <!-- Toggle with Description -->
    <div style="margin-bottom: 24px;">
        <label style="
            display: flex;
            align-items: flex-start;
            cursor: pointer;
            gap: 12px;
        ">
            <div style="position: relative; margin-top: 2px;">
                <input 
                    type="checkbox" 
                    checked
                    style="
                        appearance: none;
                        width: 44px;
                        height: 24px;
                        background: #0078d4;
                        border-radius: 12px;
                        transition: background-color 0.2s ease;
                        cursor: pointer;
                        outline: none;
                    "
                    onchange="
                        this.style.background = this.checked ? '#0078d4' : '#c8c6c4';
                        this.nextElementSibling.style.transform = this.checked ? 'translateX(20px)' : 'translateX(0)';
                    "
                />
                <div style="
                    position: absolute;
                    top: 2px;
                    left: 22px;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    transition: transform 0.2s ease;
                    pointer-events: none;
                "></div>
            </div>
            <div>
                <div style="color: #323130; font-size: 14px; font-weight: 500; margin-bottom: 4px;">
                    Auto-save progress
                </div>
                <div style="color: #605e5c; font-size: 12px; line-height: 1.4;">
                    Automatically save your learning progress as you complete modules
                </div>
            </div>
        </label>
    </div>
    
    <!-- Disabled Toggle -->
    <div style="margin-bottom: 24px;">
        <label style="
            display: flex;
            align-items: center;
            cursor: not-allowed;
            gap: 12px;
            opacity: 0.6;
        ">
            <div style="position: relative;">
                <input 
                    type="checkbox" 
                    disabled
                    style="
                        appearance: none;
                        width: 44px;
                        height: 24px;
                        background: #f3f2f1;
                        border-radius: 12px;
                        cursor: not-allowed;
                        outline: none;
                    "
                />
                <div style="
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 20px;
                    height: 20px;
                    background: #c8c6c4;
                    border-radius: 50%;
                    pointer-events: none;
                "></div>
            </div>
            <span style="color: #a19f9d; font-size: 14px; font-weight: 500;">
                Premium features (Requires subscription)
            </span>
        </label>
    </div>
    
    <!-- Toggle Group -->
    <div style="
        background: #f8f9fa;
        padding: 16px;
        border-radius: 8px;
        border: 1px solid #e1e5e9;
    ">
        <h4 style="margin: 0 0 16px 0; color: #323130; font-size: 16px; font-weight: 600;">
            Learning Preferences
        </h4>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <label style="
                display: flex;
                align-items: center;
                cursor: pointer;
                gap: 12px;
            ">
                <div style="position: relative;">
                    <input 
                        type="checkbox" 
                        checked
                        style="
                            appearance: none;
                            width: 44px;
                            height: 24px;
                            background: #0078d4;
                            border-radius: 12px;
                            transition: background-color 0.2s ease;
                            cursor: pointer;
                            outline: none;
                        "
                        onchange="
                            this.style.background = this.checked ? '#0078d4' : '#c8c6c4';
                            this.nextElementSibling.style.transform = this.checked ? 'translateX(20px)' : 'translateX(0)';
                        "
                    />
                    <div style="
                        position: absolute;
                        top: 2px;
                        left: 22px;
                        width: 20px;
                        height: 20px;
                        background: white;
                        border-radius: 50%;
                        transition: transform 0.2s ease;
                        pointer-events: none;
                    "></div>
                </div>
                <span style="color: #323130; font-size: 14px; font-weight: 500;">
                    Email reminders
                </span>
            </label>
            
            <label style="
                display: flex;
                align-items: center;
                cursor: pointer;
                gap: 12px;
            ">
                <div style="position: relative;">
                    <input 
                        type="checkbox" 
                        style="
                            appearance: none;
                            width: 44px;
                            height: 24px;
                            background: #c8c6c4;
                            border-radius: 12px;
                            transition: background-color 0.2s ease;
                            cursor: pointer;
                            outline: none;
                        "
                        onchange="
                            this.style.background = this.checked ? '#0078d4' : '#c8c6c4';
                            this.nextElementSibling.style.transform = this.checked ? 'translateX(20px)' : 'translateX(0)';
                        "
                    />
                    <div style="
                        position: absolute;
                        top: 2px;
                        left: 2px;
                        width: 20px;
                        height: 20px;
                        background: white;
                        border-radius: 50%;
                        transition: transform 0.2s ease;
                        pointer-events: none;
                    "></div>
                </div>
                <span style="color: #323130; font-size: 14px; font-weight: 500;">
                    Dark mode
                </span>
            </label>
        </div>
    </div>
</div>`
        }
    ];

    // Combine Atlas components with loaded Fluent UI components
    const components: Component[] = useMemo(() => {
        return [...atlasComponents, ...loadedFluentComponents];
    }, [loadedFluentComponents]);    // Get unique categories for the selected library - must be before early return
    const categories = useMemo(() => {
        const libraryComponents = components.filter(c => (c.library || 'FluentUI') === selectedLibrary);
        const allCategories = Array.from(new Set(libraryComponents.map(c => c.category)));
        return ['All', ...allCategories.sort()];
    }, [components, selectedLibrary]);

    // Filter components based on selected category and library - must be before early return
    const filteredComponents = useMemo(() => {
        console.log('🔍 Filtering components:', {
            totalComponents: components.length,
            selectedLibrary,
            selectedCategory,
            componentsWithLibrary: components.map(c => ({ name: c.name, library: c.library || 'FluentUI', category: c.category }))
        });

        const libraryComponents = components.filter(c => (c.library || 'FluentUI') === selectedLibrary);
        console.log('📚 Library components found:', libraryComponents.length, libraryComponents.map(c => c.name));

        const filtered = selectedCategory === 'All'
            ? libraryComponents
            : libraryComponents.filter(c => c.category === selectedCategory);

        console.log('✅ Final filtered components:', filtered.length, filtered.map(c => c.name));
        return filtered;
    }, [components, selectedCategory, selectedLibrary]);

    const handleComponentClick = (component: Component) => {
        console.log('🚀 Component clicked:', component.name);
        onAddComponent(component);
        onClose();
    };

    if (!isOpen) return null;

    console.log('🎯 ComponentLibraryModal is OPEN and rendering!');
    console.log('📋 Total components loaded:', components.length);
    console.log('🏷️ Components by name:', components.map(c => c.name));
    console.log('📚 Selected library:', selectedLibrary);
    console.log('🗂️ Selected category:', selectedCategory);

    // Debug: Check if AI button should show
    console.log('🔍 ComponentLibraryModal debug:', {
        onGenerateWithAI: !!onGenerateWithAI,
        currentDescription,
        shouldShowAIButton: !!(onGenerateWithAI && currentDescription)
    });

    return (
        <div className="component-library-modal-overlay">
            <div className="component-library-modal">
                <div className="component-library-header">
                    <div className="component-library-title">
                        <div className="fluentui-logo">
                            {selectedLibrary === 'FluentUI' ? 'F' : 'A'}
                        </div>
                        <div>
                            <h2>{selectedLibrary} Component Library</h2>
                            <p className="library-instructions">Click components to add them to your wireframe</p>
                        </div>
                    </div>
                    <div className="header-right-section">
                        <div className="library-selector">
                            <button
                                onClick={() => {
                                    setSelectedLibrary('FluentUI');
                                    setSelectedCategory('All');
                                }}
                                className={`library-tab ${selectedLibrary === 'FluentUI' ? 'active' : ''}`}
                            >
                                Fluent UI
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedLibrary('Atlas');
                                    setSelectedCategory('All');
                                }}
                                className={`library-tab ${selectedLibrary === 'Atlas' ? 'active' : ''}`}
                            >
                                Atlas
                            </button>
                        </div>
                        <button
                            onClick={onClose}
                            className="component-library-close"
                        >
                            ×
                        </button>
                    </div>
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
                                        ({category === 'All'
                                            ? components.filter(c => (c.library || 'FluentUI') === selectedLibrary).length
                                            : components.filter(c => (c.library || 'FluentUI') === selectedLibrary && c.category === category).length})
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
