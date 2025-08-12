import React, { useState, useEffect } from "react";
import "./App.css";
import "./wireframe-styles.css";
import "./styles/microsoftlearn-card.css";
import "./styles/suggestion-indicator.css";
import "./styles/suggestion-performance.css";
import "./styles/atlas-design-system.css";
import LandingPage from "./components/LandingPage";
import SplitLayout from "./components/SplitLayout";
import TopNavbar from "./components/TopNavbar";
import SaveDialog from "./components/SaveDialog";
import LoadDialog from "./components/LoadDialog";
import Toast from "./components/Toast";
import PasswordProtection from "./components/PasswordProtection";
import { API_CONFIG, getApiUrl } from "./config/api";
// All API calls are now handled by the wireframe generation hook
import { useWireframeGeneration } from './hooks/useWireframeGeneration';
import { PerformanceTracker } from "./utils/performance";
import { generateHeroHTML } from "./components/HeroGenerator";
import { processWireframeForProduction } from './utils/wireframeProcessor';
import { PerformanceMonitor, usePerformanceMonitor } from "./components/PerformanceMonitor";
import { getInstantSuggestions, shouldUseAI } from "./utils/fastSuggestions";
import { getCachedSuggestions, cacheSuggestions } from "./utils/suggestionCache";

interface SavedWireframe {
  id: string;
  name: string;
  description: string;
  html: string;
  createdAt: string;
}

interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

function AppContent({ onLogout }: { onLogout?: () => void }) {
  const [description, setDescription] = useState("");
  const [htmlWireframe, setHtmlWireframe] = useState("");
  const [savedWireframes, setSavedWireframes] = useState<SavedWireframe[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [isAiSourcedSuggestions] = useState(false);
  // Microsoft Learn is the only theme available now
  const designTheme = "microsoftlearn";
  const [colorScheme, setColorScheme] = useState("primary");
  const [forceUpdateKey, setForceUpdateKey] = useState<number>(Date.now());
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [fastMode, setFastMode] = useState(false);

  // Performance monitoring
  const performanceMonitor = usePerformanceMonitor();

  // Use our enhanced wireframe generation hook
  const {
    generateWireframe,
    isLoading: loading,
    loadingStage,
    error,
    fallback,
    processingTime,
    cancelGeneration
  } = useWireframeGeneration();

  useEffect(() => {
    localStorage.removeItem("snapframe_current");
    localStorage.removeItem("currentWireframe");
    localStorage.removeItem("lastUsedTheme");
    localStorage.setItem("lastUsedTheme", "microsoftlearn");
  }, []);

  useEffect(() => {
    loadSavedWireframes();
  }, []);

  useEffect(() => {
    if (htmlWireframe) {
      window.history.pushState(
        { view: "wireframe" },
        "",
        window.location.pathname
      );
    } else {
      window.history.replaceState(
        { view: "landing" },
        "",
        window.location.pathname
      );
    }
  }, [htmlWireframe]);

  const showToast = (message: string, type: ToastData['type'] = 'success') => {
    const newToast: ToastData = {
      id: Date.now(),
      message,
      type
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const loadSavedWireframes = () => {
    const saved = localStorage.getItem("snapframe_saved");
    if (saved) {
      setSavedWireframes(JSON.parse(saved));
    }
  };

  const saveWireframe = () => {
    if (!htmlWireframe || !saveTitle.trim()) return;

    const newWireframe: SavedWireframe = {
      id: Date.now().toString(),
      name: saveTitle.trim(),
      description: description,
      html: htmlWireframe,
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedWireframes, newWireframe];
    setSavedWireframes(updated);
    localStorage.setItem("snapframe_saved", JSON.stringify(updated));

    setShowSaveDialog(false);
    setSaveTitle("");

    // Show success notification
    // Wireframe saved successfully
    console.log('Wireframe Saved!', `"${saveTitle.trim()}" has been saved successfully.`);
  };

  const loadWireframe = (wireframe: SavedWireframe) => {
    handleWireframeGenerated(wireframe.html);
    setDescription(wireframe.description);
    setShowLoadDialog(false);

    // Show success notification
    // Wireframe loaded successfully
    console.log('Wireframe Loaded!', `"${wireframe.name}" has been loaded.`);
  };

  const deleteWireframe = (id: string) => {
    const wireframe = savedWireframes.find(w => w.id === id);
    const updated = savedWireframes.filter((w) => w.id !== id);
    setSavedWireframes(updated);
    localStorage.setItem("snapframe_saved", JSON.stringify(updated));

    // Show info notification
    if (wireframe) {
      // Wireframe deleted (notification removed)
    }
  };

  const handleWireframeGenerated = (html: string) => {
    console.log("⚡ handleWireframeGenerated called");
    setShowLandingPage(false);

    // Convert to string if possible, otherwise use empty string
    let safeHtml = "";

    try {
      if (html && typeof html === 'string') {
        safeHtml = html.trim();
      } else if (html) {
        // Try to convert non-string values
        safeHtml = String(html).trim();
      }

      // Clean up any markdown artifacts or unwanted prefixes
      safeHtml = safeHtml.replace(/^[0'"]+|[0'"]+$/g, '');
      safeHtml = safeHtml.replace(/^'''html\s*/gi, '');
      safeHtml = safeHtml.replace(/^```html\s*/gi, '');
      safeHtml = safeHtml.replace(/```\s*$/gi, '');
      safeHtml = safeHtml.trim();

    } catch (error) {
      console.error("⚡ Error processing HTML:", error);
    }

    // Only set non-empty HTML
    if (safeHtml && safeHtml.length > 0) {
      // Process the wireframe to fix images and Microsoft branding
      const processedHtml = processWireframeForProduction(safeHtml);
      setHtmlWireframe(processedHtml);
    } else {
      setHtmlWireframe(""); // Set empty string
    }

    setForceUpdateKey(Date.now()); // Always force update
  };

  const handleSubmit = async (e: React.FormEvent, overrideDescription?: string) => {
    const actualDescription = overrideDescription || description;
    console.log("🔍 handleSubmit called with description:", actualDescription, "override:", overrideDescription);
    e.preventDefault();

    // Create a new performance tracker
    const perfTracker = new PerformanceTracker('wireframe-generation');

    try {
      console.log('🚀 Form submitted with description:', actualDescription);
      // Use our enhanced wireframe generation hook with theme and color scheme
      const result = await generateWireframe(
        actualDescription,
        designTheme,
        colorScheme,
        true,  // skipCache: true to force fresh generation for debugging
        fastMode  // Pass fast mode preference
      );

      console.log('✅ Wireframe generation result:', {
        hasResult: !!result,
        hasHtml: !!(result && result.html),
        htmlLength: result?.html?.length || 0,
        htmlPreview: result?.html?.substring(0, 200) || 'No HTML',
        fallback: result?.fallback,
        fromCache: result?.fromCache
      });

      if (result && result.html) {
        if (typeof result.html === 'string' && result.html.length > 0) {
          handleWireframeGenerated(result.html); // Use the proper handler function

          // Close AI suggestions panel after successful generation
          setShowAiSuggestions(false);

          // Show success notification
          // Success notification removed
        } else {
          setHtmlWireframe(""); // Set empty string
          // Error notification removed
        }
      } else {
        setHtmlWireframe("");
        // Error notification removed
      }
    } catch (err) {
      console.error("🔍 Exception in handleSubmit:", err);
      // Show error notification
      if (err instanceof Error) {
        // Error notification removed
      } else {
        // Error notification removed
      }
    } finally {
      // Record performance metric
      perfTracker.stop();
    }
  };

  const handleStop = () => {
    // Use the cancel function from our hook
    cancelGeneration();
  };

  const handleAiSuggestionClick = async (suggestion: string) => {
    console.log("🚀 AI suggestion clicked:", suggestion);
    console.log("🚀 Current designTheme:", designTheme);
    console.log("🚀 Current colorScheme:", colorScheme);
    setShowAiSuggestions(false);
    setDescription(suggestion);

    const perfTracker = new PerformanceTracker('ai-suggestion-wireframe');

    try {
      // Use our enhanced wireframe generation hook with theme and color scheme
      const result = await generateWireframe(
        suggestion,
        designTheme,
        colorScheme
      );

      if (result && result.html) {
        if (typeof result.html === 'string' && result.html.length > 0) {
          handleWireframeGenerated(result.html);
          // // Success notification removed
        } else {
          // Error notification removed
        }
      } else {
        // Error notification removed
      }
    } catch (err) {
      console.error("🚀 Exception in handleAiSuggestionClick:", err);
      if (err instanceof Error) {
        // Error notification removed
      } else {
        // Error notification removed
      }
    } finally {
      perfTracker.stop();
    }
  };

  const handleAddComponent = (component: any) => {
    console.log("🔧 App.tsx: handleAddComponent called with:", component);
    console.log("🔧 App.tsx: Current htmlWireframe length:", htmlWireframe?.length || 0);

    // Create HTML for the component based on its type and properties
    const componentHtml = generateComponentHtml(component);
    console.log("🔧 App.tsx: Generated HTML:", componentHtml);

    if (htmlWireframe) {
      // Add component to existing wireframe
      const updatedHtml = insertComponentIntoWireframe(htmlWireframe, componentHtml);
      console.log("🔧 App.tsx: Updating existing wireframe, new length:", updatedHtml.length);
      setHtmlWireframe(updatedHtml);
      console.log("🔧 App.tsx: Added to existing wireframe");
    } else {
      // Create a new wireframe with just this component
      const newWireframe = createWireframeWithComponent(componentHtml);
      console.log("🔧 App.tsx: Creating new wireframe, length:", newWireframe.length);
      setHtmlWireframe(newWireframe);
      console.log("🔧 App.tsx: Created new wireframe with component");
    }

    // Force a re-render to ensure the wireframe updates
    setForceUpdateKey(Date.now());

    // Component added successfully (removed annoying toast notification)
  };

  // Handler for generating page content using AI
  const handleGeneratePageContent = async (description: string, pageType: string): Promise<string> => {
    try {
      // Use the same wireframe generation but specify it's for a page
      // Note: pageType could be used for different templates in the future
      console.log(`Generating ${pageType} content:`, description);

      const result = await generateWireframe(
        description,
        designTheme,
        colorScheme
      );

      return result.html || '';
    } catch (error) {
      console.error('Failed to generate page content:', error);
      throw error;
    }
  };

  const generateComponentHtml = (component: any) => {
    console.log("🔧 generateComponentHtml: Processing component:", component);

    // If the component has htmlCode property, use it directly (this is the real component HTML)
    if (component.htmlCode) {
      console.log("🔧 generateComponentHtml: Using component.htmlCode");
      // Enhance the HTML to make it draggable within the wireframe
      let html = component.htmlCode;

      // Wrap the component in a draggable container if it's not already a single element
      if (html.trim().startsWith('<') && html.trim().endsWith('>')) {
        // Check if it's already a single element or multiple elements
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const bodyChildren = doc.body.children;

        if (bodyChildren.length === 1) {
          // Single element - add draggable attributes to it
          const element = bodyChildren[0] as HTMLElement;
          element.setAttribute('data-draggable', 'true');
          element.setAttribute('data-user-added', 'true');
          element.classList.add('atlas-component');
          html = element.outerHTML;
        } else {
          // Multiple elements - wrap in a draggable container
          html = `<div class="atlas-component component-container" data-draggable="true" data-user-added="true" style="display: inline-block; margin: 8px;">${html}</div>`;
        }
      }

      return html;
    }

    // Fallback for legacy component IDs (keeping existing logic for backwards compatibility)
    const { id, name, defaultProps } = component;
    console.log("🔧 generateComponentHtml: Using fallback logic for ID:", id);

    switch (id) {
      // Microsoft Learn Layout Components
      case 'ms-learn-layout':
        return `<div class="ms-learn-layout" style="margin: 10px; padding: 20px; border: 2px solid #0078d4; border-radius: 8px; background: #f8f9fa;">
          <h3 style="color: #0078d4;">📄 Microsoft Learn Complete Layout</h3>
          <p>Complete Microsoft Learn page layout with top nav, hero, content sections, and footer</p>
        </div>`;

      case 'ms-learn-topnav':
        return `<nav class="ms-learn-topnav" style="margin: 10px; padding: 15px; background: #0078d4; color: white; border-radius: 4px;">
          <h4 style="margin: 0; color: white;">🧭 Microsoft Learn Navigation</h4>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #e1f5fe;">Official Microsoft Learn top navigation with search, menus, and branding</p>
        </nav>`;

      case 'microsoft-learn-topnav':
        return `<header class="microsoft-learn-header" style="
          width: 100%;
          background-color: #2B2B2B;
          color: white;
          padding: 12px 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        ">
          <div class="header-container" style="
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
          ">
            <div class="logo-section" style="display: flex; align-items: center;">
              <span class="ms-logo" style="
                font-size: 16px;
                font-weight: 600;
                color: #FFFFFF;
                margin-right: 32px;
              ">🪟 Microsoft Learn</span>
            </div>
            <nav class="main-nav" style="
              display: flex;
              align-items: center;
              gap: 24px;
            ">
              <a href="#" style="color: #CCCCCC; text-decoration: none; font-size: 14px;">Learning Paths</a>
              <a href="#" style="color: #CCCCCC; text-decoration: none; font-size: 14px;">Certifications</a>
              <a href="#" style="color: #CCCCCC; text-decoration: none; font-size: 14px;">Documentation</a>
              <a href="#" style="color: #CCCCCC; text-decoration: none; font-size: 14px;">Community</a>
            </nav>
            <div class="user-section" style="
              display: flex;
              align-items: center;
              gap: 16px;
            ">
              <button class="search-btn" style="
                background: none;
                border: none;
                color: #CCCCCC;
                font-size: 16px;
                cursor: pointer;
              ">🔍</button>
              <button class="profile-btn" style="
                background: #0078D4;
                border: none;
                color: white;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
              ">Sign in</button>
            </div>
          </div>
        </header>`;

      case 'ms-learn-hero':
        return `<section class="ms-learn-hero" style="margin: 10px; padding: 30px; background: linear-gradient(135deg, #0078d4, #005a9e); color: white; border-radius: 8px; text-align: center;">
          <h2 style="margin: 0 0 10px 0; color: white;">🚀 Microsoft Learn Hero Section</h2>
          <p style="margin: 0; font-size: 16px;">Engaging hero section with call-to-action and learning paths</p>
        </section>`;

      case 'ms-learn-footer':
        return `<footer class="ms-learn-footer" style="margin: 10px; padding: 20px; background: #323130; color: white; border-radius: 4px;">
          <h4 style="margin: 0 0 10px 0; color: white;">🦶 Microsoft Learn Footer</h4>
          <p style="margin: 0; font-size: 14px; color: #d1d1d1;">Footer with community links and feedback options</p>
        </footer>`;

      // Atlas Button Components
      case 'atlas-button-primary':
        return `<button class="button button-primary button-lg atlas-component" data-draggable="true" data-user-added="true" style="margin: 10px; padding: 12px 24px; background: #0078d4; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">${defaultProps?.text || 'Primary Button'}</button>`;

      case 'atlas-button-primary-filled':
        return `<button class="button button-primary-filled" style="margin: 10px; padding: 12px 24px; background: #0078d4; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">${defaultProps?.text || 'Primary Filled Button'}</button>`;

      case 'atlas-button-primary-clear':
        return `<button class="button button-primary-clear" style="margin: 10px; padding: 12px 24px; background: transparent; color: #0078d4; border: 2px solid #0078d4; border-radius: 4px; cursor: pointer; font-weight: 500;">${defaultProps?.text || 'Primary Clear Button'}</button>`;

      case 'atlas-button-secondary':
        return `<button class="button button-secondary button-lg" style="margin: 10px; padding: 12px 24px; background: #f3f2f1; color: #323130; border: 1px solid #e1dfdd; border-radius: 4px; cursor: pointer; font-weight: 500;">${defaultProps?.text || 'Secondary Button'}</button>`;

      case 'atlas-button-secondary-clear':
        return `<button class="button button-secondary-clear" style="margin: 10px; padding: 12px 24px; background: transparent; color: #323130; border: 2px solid #e1dfdd; border-radius: 4px; cursor: pointer; font-weight: 500;">${defaultProps?.text || 'Secondary Clear Button'}</button>`;

      case 'atlas-button-secondary-filled':
        return `<button class="button button-secondary-filled" style="margin: 10px; padding: 12px 24px; background: #605e5c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">${defaultProps?.text || 'Secondary Filled Button'}</button>`;

      case 'atlas-button-danger':
        return `<button class="button button-danger" style="margin: 10px; padding: 12px 24px; background: #d13438; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">${defaultProps?.text || 'Danger Button'}</button>`;

      case 'atlas-button-success':
        return `<button class="button button-success" style="margin: 10px; padding: 12px 24px; background: #107c10; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">${defaultProps?.text || 'Success Button'}</button>`;

      case 'atlas-button-warning':
        return `<button class="button button-warning" style="margin: 10px; padding: 12px 24px; background: #ffb900; color: #323130; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">${defaultProps?.text || 'Warning Button'}</button>`;

      case 'atlas-button-loading':
        return `<button class="button button-loading" style="margin: 10px; padding: 12px 24px; background: #0078d4; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;" disabled>⏳ Loading...</button>`;

      case 'atlas-button-small':
        return `<button class="button button-small" style="margin: 10px; padding: 8px 16px; background: #0078d4; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; font-size: 12px;">${defaultProps?.text || 'Small Button'}</button>`;

      case 'atlas-button-large':
        return `<button class="button button-large" style="margin: 10px; padding: 16px 32px; background: #0078d4; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; font-size: 18px;">${defaultProps?.text || 'Large Button'}</button>`;

      case 'atlas-button-block':
        return `<button class="button button-block" style="margin: 10px; padding: 12px 24px; background: #0078d4; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; width: 100%; display: block;">${defaultProps?.text || 'Block Button'}</button>`;

      case 'atlas-button-search':
        return `<button class="button button-primary button-lg button-search" style="margin: 10px; padding: 12px 24px; background: #0078d4; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; display: inline-flex; align-items: center; gap: 8px;">🔍 ${defaultProps?.text || 'Search'}</button>`;

      // Form Components
      case 'atlas-input':
        return `<div style="margin: 10px;">
          <label style="display: block; margin-bottom: 5px; color: #323130; font-weight: 600;">${defaultProps?.label || 'Input Label'}</label>
          <input type="text" class="form-control" placeholder="${defaultProps?.placeholder || 'Enter text here...'}" style="width: 100%; padding: 8px 12px; border: 1px solid #e1dfdd; border-radius: 4px; font-family: 'Segoe UI', sans-serif;">
        </div>`;

      case 'atlas-textarea':
        return `<div style="margin: 10px;">
          <label style="display: block; margin-bottom: 5px; color: #323130; font-weight: 600;">${defaultProps?.label || 'Textarea Label'}</label>
          <textarea class="form-control" placeholder="${defaultProps?.placeholder || 'Enter your text here...'}" rows="4" style="width: 100%; padding: 8px 12px; border: 1px solid #e1dfdd; border-radius: 4px; font-family: 'Segoe UI', sans-serif; resize: vertical;"></textarea>
        </div>`;

      case 'atlas-select':
        return `<div style="margin: 10px;">
          <label style="display: block; margin-bottom: 5px; color: #323130; font-weight: 600;">${defaultProps?.label || 'Select Label'}</label>
          <select class="form-control" style="width: 100%; padding: 8px 12px; border: 1px solid #e1dfdd; border-radius: 4px; font-family: 'Segoe UI', sans-serif;">
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>`;

      case 'atlas-checkbox':
        return `<div style="margin: 10px;">
          <label style="display: flex; align-items: center; color: #323130; font-weight: 500; cursor: pointer;">
            <input type="checkbox" style="margin-right: 8px; width: 16px; height: 16px;">
            ${defaultProps?.label || 'Checkbox Label'}
          </label>
        </div>`;

      case 'atlas-radio':
        return `<div style="margin: 10px;">
          <label style="display: flex; align-items: center; color: #323130; font-weight: 500; cursor: pointer;">
            <input type="radio" name="radio-group" style="margin-right: 8px; width: 16px; height: 16px;">
            ${defaultProps?.label || 'Radio Button Label'}
          </label>
        </div>`;

      case 'atlas-toggle':
        return `<div style="margin: 10px;">
          <label style="display: flex; align-items: center; color: #323130; font-weight: 500; cursor: pointer;">
            <div style="position: relative; width: 44px; height: 24px; background: #e1dfdd; border-radius: 12px; margin-right: 8px; transition: background 0.3s;">
              <div style="position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: transform 0.3s;"></div>
            </div>
            ${defaultProps?.label || 'Toggle Switch'}
          </label>
        </div>`;

      case 'atlas-label':
        return `<label style="margin: 10px; display: block; color: #323130; font-weight: 600; font-size: 14px;">${defaultProps?.text || 'Form Label'}</label>`;

      // Navigation Components
      case 'atlas-breadcrumb':
        return `<nav style="margin: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
          <div style="color: #605e5c; font-size: 14px;">
            🏠 <a href="#" style="color: #0078d4; text-decoration: none;">Home</a> &gt; 
            <a href="#" style="color: #0078d4; text-decoration: none;">Category</a> &gt; 
            <span style="color: #323130; font-weight: 600;">Current Page</span>
          </div>
        </nav>`;

      case 'atlas-site-header':
        return `<header style="margin: 10px; padding: 20px; background: #323130; color: white; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; color: white;">🌐 Atlas Site Header</h3>
            <nav style="display: flex; gap: 20px;">
              <a href="#" style="color: #ffffff; text-decoration: none;">Home</a>
              <a href="#" style="color: #ffffff; text-decoration: none;">About</a>
              <a href="#" style="color: #ffffff; text-decoration: none;">Contact</a>
            </nav>
          </div>
        </header>`;

      case 'atlas-pagination':
        return `<nav style="margin: 10px; padding: 15px; text-align: center;">
          <div style="display: inline-flex; gap: 5px;">
            <button style="padding: 8px 12px; border: 1px solid #e1dfdd; background: white; border-radius: 4px; cursor: pointer;">&laquo;</button>
            <button style="padding: 8px 12px; border: 1px solid #0078d4; background: #0078d4; color: white; border-radius: 4px;">1</button>
            <button style="padding: 8px 12px; border: 1px solid #e1dfdd; background: white; border-radius: 4px; cursor: pointer;">2</button>
            <button style="padding: 8px 12px; border: 1px solid #e1dfdd; background: white; border-radius: 4px; cursor: pointer;">3</button>
            <button style="padding: 8px 12px; border: 1px solid #e1dfdd; background: white; border-radius: 4px; cursor: pointer;">&raquo;</button>
          </div>
        </nav>`;

      // Content Components
      case 'atlas-gradient-card':
        return `<div class="gradient-card" style="margin: 10px; padding: 25px; background: linear-gradient(135deg, #0078d4, #005a9e); color: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,120,212,0.3);">
          <h4 style="margin: 0 0 10px 0; color: white;">✨ Gradient Card</h4>
          <p style="margin: 0; color: #e1f5fe;">A beautiful gradient card component with Microsoft Learn styling.</p>
        </div>`;

      case 'atlas-hero':
        return generateHeroHTML({
          title: "Build your next great idea",
          summary: "Transform your vision into reality with Microsoft Learn's comprehensive resources and tools.",
          eyebrow: "MICROSOFT LEARN",
          ctaText: "Get Started",
          showSecondaryButton: true,
          secondaryCtaText: "Learn More",
          backgroundColor: "#E8E6DF",
          heroImageUrl: "hero-learn.svg"
        });

      case 'atlas-banner':
        return `<div class="banner" style="margin: 10px; padding: 20px; background: #fff4ce; border: 1px solid #ffb900; border-radius: 4px; color: #323130;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">ℹ️</span>
            <div>
              <h4 style="margin: 0 0 5px 0; color: #323130;">Important Banner</h4>
              <p style="margin: 0; color: #605e5c;">This is an informational banner component.</p>
            </div>
          </div>
        </div>`;

      // Layout Components
      case 'atlas-container':
        return `<div class="container" style="margin: 10px; padding: 20px; border: 1px solid #e1dfdd; border-radius: 4px; background: #f9f9f9;">
          <h3 style="margin: 0 0 10px 0; color: #323130;">📦 Container</h3>
          <p style="margin: 0; color: #605e5c;">This is a container component. Add your content here.</p>
        </div>`;

      case 'atlas-card':
        return `<div class="card atlas-component" data-draggable="true" data-user-added="true" style="margin: 10px; padding: 20px; border: 1px solid #e1dfdd; border-radius: 8px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h4 style="margin: 0 0 10px 0; color: #323130;">💳 Card Title</h4>
          <p style="margin: 0; color: #605e5c;">Card content goes here. This is a Microsoft Learn styled card component.</p>
        </div>`;

      case 'atlas-heading':
        return `<h2 style="margin: 10px; color: #323130; font-size: 2rem; font-weight: 600;">📝 ${defaultProps?.text || 'Heading Component'}</h2>`;

      case 'atlas-text':
        return `<p style="margin: 10px; color: #605e5c; line-height: 1.5; font-family: 'Segoe UI', sans-serif;">${defaultProps?.text || 'This is a text component. You can use it to display paragraphs of content with Microsoft Learn styling.'}</p>`;

      // Default fallback
      default:
        return `<div style="margin: 10px; padding: 15px; border: 2px dashed #e1dfdd; border-radius: 4px; color: #605e5c; text-align: center; background: #f9f9f9;">
          <h4 style="margin: 0 0 5px 0; color: #323130;">🔧 ${name || 'Unknown Component'}</h4>
          <p style="margin: 0; font-size: 12px;">Component ID: ${id}</p>
        </div>`;
    }
  };

  const insertComponentIntoWireframe = (existingHtml: string, componentHtml: string) => {
    // Find a good insertion point in the existing wireframe - preferably at the top
    const containerMatch = existingHtml.match(/<div[^>]*class="[^"]*wireframe-container[^"]*"[^>]*>/);
    if (containerMatch) {
      // Insert right after the opening wireframe-container div tag
      const insertionPoint = containerMatch.index! + containerMatch[0].length;
      return existingHtml.slice(0, insertionPoint) + componentHtml + existingHtml.slice(insertionPoint);
    }

    // Alternative: look for main content area
    const mainMatch = existingHtml.match(/<main[^>]*>|<div[^>]*class="[^"]*main[^"]*"[^>]*>|<div[^>]*class="[^"]*content[^"]*"[^>]*>/);
    if (mainMatch) {
      const insertionPoint = mainMatch.index! + mainMatch[0].length;
      return existingHtml.slice(0, insertionPoint) + componentHtml + existingHtml.slice(insertionPoint);
    }

    // Look for body tag and insert right after it
    const bodyMatch = existingHtml.match(/<body[^>]*>/);
    if (bodyMatch) {
      const insertionPoint = bodyMatch.index! + bodyMatch[0].length;
      return existingHtml.slice(0, insertionPoint) + componentHtml + existingHtml.slice(insertionPoint);
    }

    // Final fallback: prepend to existing content
    return componentHtml + existingHtml;
  };

  const createWireframeWithComponent = (componentHtml: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Component Wireframe</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .wireframe-container { padding: 20px; min-height: 400px; }
        .button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; }
        .button-primary { background: #0078d4; color: white; }
        .button-secondary { background: #f3f2f1; color: #323130; border: 1px solid #e1dfdd; }
        .button-lg { padding: 12px 24px; }
        .button-search { display: inline-flex; align-items: center; gap: 8px; }
    </style>
</head>
<body>
    <div class="wireframe-container">
        <h1>Component Library Wireframe</h1>
        <p>Components added from the library:</p>
        ${componentHtml}
    </div>
</body>
</html>`;
  };

  const handleDesignChange = async (_newTheme?: string, newScheme?: string) => {
    // Only color scheme can be changed now (Microsoft Learn theme is fixed)
    if (newScheme) setColorScheme(newScheme);

    // Microsoft Learn theme is always used
    const themeToUse = "microsoftlearn";
    const schemeToUse = newScheme || colorScheme;

    if (!description.trim()) {
      return;
    }

    const perfTracker = new PerformanceTracker('design-change-wireframe');

    try {
      // Pass theme and color scheme to generateWireframe
      const result = await generateWireframe(
        description,
        themeToUse,
        schemeToUse
      );

      if (result && result.html) {
        if (typeof result.html === 'string' && result.html.length > 0) {
          handleWireframeGenerated(result.html);
        } else {
          console.error("Error: Received invalid wireframe data");
          showToast("Error: Received invalid wireframe data. Please try again.", 'error');
        }
      } else {
        console.error("Error: No wireframe generated");
        showToast("Error: No wireframe generated. Please try again.", 'error');
      }
    } catch (err) {
      console.error("🎨 Error in design change:", err);
    } finally {
      perfTracker.stop();
    }
  };

  const generateSmartSuggestions = async (input: string): Promise<string[]> => {
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_SUGGESTIONS), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: input.trim() }), // Changed from 'description' to 'userInput'
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`AI suggestions API returned ${response.status}, using fallback suggestions`);
        return API_CONFIG.FALLBACK_SUGGESTIONS;
      }

      const data = await response.json();
      return data.suggestions || API_CONFIG.FALLBACK_SUGGESTIONS;
    } catch (error) {
      // Log the error but don't let it break the user experience
      if (error instanceof Error) {
        console.warn('AI suggestions temporarily unavailable, using fallback suggestions:', error.message);
      } else {
        console.warn('AI suggestions temporarily unavailable, using fallback suggestions');
      }

      // Always return fallback suggestions when API fails
      return API_CONFIG.FALLBACK_SUGGESTIONS;
    }
  }; const handleGenerateAiSuggestions = async (input: string) => {
    // Immediate feedback with fast local suggestions
    const shouldShowSuggestions = input.trim().length >= 2;

    if (shouldShowSuggestions) {
      // 1. Show instant suggestions immediately (no loading state)
      const instantSuggestions = getInstantSuggestions(input);
      if (instantSuggestions.length > 0) {
        setAiSuggestions(instantSuggestions);
        setShowAiSuggestions(true);
        setSuggestionLoading(false);
      }

      // 2. Check cache for better suggestions
      const cached = getCachedSuggestions(input);
      if (cached && cached.suggestions.length > 0) {
        setAiSuggestions(cached.suggestions);
        setShowAiSuggestions(true);
        setSuggestionLoading(false);
        return; // Use cached suggestions, no need for AI call
      }

      // 3. Only use AI for complex inputs or when no instant suggestions available
      if (shouldUseAI(input) || instantSuggestions.length === 0) {
        if (instantSuggestions.length === 0) {
          setSuggestionLoading(true); // Only show loading if no instant suggestions
        }

        try {
          const aiSuggestions = await generateSmartSuggestions(input);
          if (aiSuggestions.length > 0) {
            setAiSuggestions(aiSuggestions);
            setShowAiSuggestions(true);
            // Cache the AI results for future use
            cacheSuggestions(input, aiSuggestions, 'ai');
          }
        } catch (error) {
          console.warn('AI suggestions failed, keeping instant suggestions');
          // Keep the instant suggestions that are already showing
        } finally {
          setSuggestionLoading(false);
        }
      }
    } else {
      setAiSuggestions([]);
      setShowAiSuggestions(false);
      setSuggestionLoading(false);
    }
  };

  const handleMultiStep = () => {
    // Stub for future multi-step functionality
    console.log("Multi-step feature clicked");
  };

  // Image upload handlers
  const handleImageUpload = (file: File) => {
    console.log('Image uploaded:', file.name, file.size);
    // The file is handled by the ImageUploadZone component for preview
    // Actual wireframe generation happens in handleAnalyzeImage
  };

  const handleBackToLanding = () => {
    setHtmlWireframe("");
    setShowLandingPage(true);
    setDescription("");
  };

  const handleAnalyzeImage = async (imageUrl: string, fileName: string) => {
    console.log('Analyzing image:', fileName, 'Size:', imageUrl.length, 'bytes');
    setIsAnalyzingImage(true);

    try {
      // Set description to indicate image analysis
      const imageDescription = `Generate a wireframe based on the uploaded image: ${fileName}. Analyze the layout, components, and structure shown in the image.`;
      setDescription(imageDescription);

      // Use the same wireframe generation logic but with image context
      // TODO: In the future, we could send the imageUrl to the backend for actual image analysis
      const result = await generateWireframe(
        imageDescription,
        designTheme,
        colorScheme
      );

      if (result && result.html) {
        handleWireframeGenerated(result.html);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // Figma integration handlers
  const handleFigmaImport = (html: string, fileName: string) => {
    console.log('Figma file imported:', fileName);
    setHtmlWireframe(html);
    setShowLandingPage(false);
    setForceUpdateKey(Date.now());
    showToast(`Figma design imported: ${fileName}`, 'success');
  };

  const handleFigmaExport = async (format: 'figma-file' | 'figma-components') => {
    console.log('Exporting wireframe:', format);

    if (!htmlWireframe || htmlWireframe.trim() === '') {
      showToast('No wireframe to export. Please create a wireframe first.', 'error');
      return;
    }

    try {
      // Import the export service
      const { wireframeExportService } = await import('./services/wireframeExport');

      let result;

      if (format === 'figma-file') {
        // Export as standalone HTML file
        result = await wireframeExportService.exportAsHTML(htmlWireframe, {
          format: 'html',
          filename: wireframeExportService.generateFilename('wireframe', 'html'),
          includeStyles: true,
          includeInteractivity: true
        });
      } else if (format === 'figma-components') {
        // Export as JSON data for component library
        result = await wireframeExportService.exportAsJSON(htmlWireframe, {
          description: description,
          theme: designTheme,
          colorScheme: colorScheme,
          exportedAt: new Date().toISOString()
        }, {
          format: 'figma-components',
          filename: wireframeExportService.generateFilename('wireframe-components', 'json')
        });
      }

      if (result?.success) {
        showToast(
          `✅ Wireframe exported successfully as ${result.filename}! 
          ${result.size ? `(${Math.round(result.size / 1024)} KB)` : ''}`,
          'success'
        );
      } else {
        showToast(`❌ Export failed: ${result?.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Export error:', error);
      showToast('❌ Export failed. Please try again.', 'error');
    }
  };

  // Demo wireframe handler
  const handleDemoWireframe = async (demoType: string) => {
    console.log('Demo wireframe requested:', demoType);

    // Predefined wireframe descriptions for quick demo
    const demoDescriptions = {
      'mslearn-course': 'Create a Microsoft Learn course page with header navigation, breadcrumb trail, main content area with step-by-step tutorial sections, sidebar with learning objectives, progress indicators, and a next steps section. Use Microsoft Learn color scheme with tan/gold accents.',
      'dashboard': 'Create a professional admin dashboard with a dark sidebar navigation containing menu items, main content area with a grid of statistics cards showing metrics, charts area, and a data table with actions. Use modern card-based layout.',
      'ecommerce': 'Create an e-commerce product listing page with a hero section showcasing featured products, product grid with cards showing images, titles, prices, and buy buttons, filters sidebar, and shopping cart component. Use clean modern design.'
    };

    const description = demoDescriptions[demoType as keyof typeof demoDescriptions];
    if (!description) return;

    try {
      setDescription(description);
      showToast(`Generating ${demoType} wireframe...`, 'info');

      const result = await generateWireframe(
        description,
        designTheme,
        colorScheme
      );

      if (result && result.html) {
        handleWireframeGenerated(result.html);
        showToast(`${demoType} wireframe generated!`, 'success');
      }
    } catch (error) {
      console.error('Error generating demo wireframe:', error);
      showToast('Failed to generate demo wireframe', 'error');
    }
  };

  // Demo image generate handler (for modal demo tab)
  const handleDemoGenerate = async (imagePath: string, description: string) => {
    console.log('Demo image generate requested:', imagePath, description);

    try {
      setDescription(description);
      showToast('Generating wireframe from demo image...', 'info');

      const result = await generateWireframe(
        description,
        designTheme,
        colorScheme
      );

      if (result && result.html) {
        handleWireframeGenerated(result.html);
        showToast('Demo wireframe generated!', 'success');
      }
    } catch (error) {
      console.error('Error generating demo wireframe:', error);
      showToast('Failed to generate demo wireframe', 'error');
    }
  }; return (
    <div className={`app-content with-navbar`}>
      {/* Always show Designetica TopNavbar */}
      <TopNavbar
        onLogoClick={handleBackToLanding}
        onLogout={onLogout}
      />

      {showLandingPage && !htmlWireframe ? (
        <LandingPage
          error={error}
          savedWireframesCount={savedWireframes.length}
          onLoadClick={() => setShowLoadDialog(true)}
          description={description}
          onDescriptionChange={(e) => {
            const value = e.target.value;
            setDescription(value);

            // Hide suggestions when content becomes too short
            if (value.length <= 2) {
              setShowAiSuggestions(false);
            }
          }}
          onSubmit={handleSubmit}
          loading={loading}
          handleStop={handleStop}
          showAiSuggestions={showAiSuggestions}
          aiSuggestions={aiSuggestions}
          suggestionLoading={suggestionLoading}
          onAiSuggestionClick={handleAiSuggestionClick}
          onGenerateAiSuggestions={handleGenerateAiSuggestions}
          onImageUpload={handleImageUpload}
          onAnalyzeImage={handleAnalyzeImage}
          isAnalyzingImage={isAnalyzingImage}
          onFigmaImport={handleFigmaImport}
          onFigmaExport={handleFigmaExport}
          onDemoGenerate={handleDemoGenerate}
        />
      ) : (
        <SplitLayout
          description={description}
          setDescription={setDescription}
          handleSubmit={handleSubmit}
          loading={loading}
          loadingStage={loadingStage}
          fallback={fallback}
          processingTime={processingTime}
          handleStop={handleStop}
          showAiSuggestions={showAiSuggestions}
          aiSuggestions={aiSuggestions}
          suggestionLoading={suggestionLoading}
          isAiSourced={isAiSourcedSuggestions}
          setShowAiSuggestions={setShowAiSuggestions}
          onGenerateAiSuggestions={handleGenerateAiSuggestions}
          error={error}
          savedWireframesCount={savedWireframes.length}
          onLoadClick={() => setShowLoadDialog(true)}
          htmlWireframe={htmlWireframe}
          setHtmlWireframe={setHtmlWireframe}
          onSave={() => setShowSaveDialog(true)}
          onMultiStep={handleMultiStep}
          designTheme={designTheme}
          colorScheme={colorScheme}
          setColorScheme={setColorScheme}
          onDesignChange={handleDesignChange}
          onAiSuggestionClick={handleAiSuggestionClick}
          forceUpdateKey={forceUpdateKey}
          onBackToLanding={handleBackToLanding}
          onAddComponent={handleAddComponent}
          onGeneratePageContent={handleGeneratePageContent}
          onFigmaExport={handleFigmaExport}
        />
      )}

      {showSaveDialog && (
        <SaveDialog
          saveTitle={saveTitle}
          setSaveTitle={setSaveTitle}
          onSave={saveWireframe}
          onCancel={() => setShowSaveDialog(false)}
        />
      )}

      {showLoadDialog && (
        <LoadDialog
          savedWireframes={savedWireframes}
          onLoad={loadWireframe}
          onDelete={deleteWireframe}
          onClose={() => setShowLoadDialog(false)}
        />
      )}

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

    </div>
  );
}

// Main App component with password protection
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('designetica_authenticated');
    localStorage.removeItem('designetica_auth_time');
    setIsAuthenticated(false);
  };

  // If not authenticated, show password protection
  if (!isAuthenticated) {
    return <PasswordProtection onAuthSuccess={handleAuthSuccess} />;
  }

  // If authenticated, show the main application
  return <AppContent onLogout={handleLogout} />;
}

export default App;
