import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import "./wireframe-styles.css";
import "./styles/microsoftlearn-card.css";
import "./styles/suggestion-indicator.css";
import "./styles/suggestion-performance.css";
import "./styles/atlas-design-system.css";
import LandingPage from "./components/LandingPage";
import SplitLayout from "./components/SplitLayout";
import TopNavbarApp from "./components/TopNavbarApp";
import TopNavbarLanding from "./components/TopNavbarLanding";
import SaveDialog from "./components/SaveDialog";
import LoadDialog from "./components/LoadDialog";
import Toast from "./components/Toast";
import AzureAuth from "./components/AzureAuth";
import FigmaIntegration from "./components/FigmaIntegration";
import FigmaIntegrationModal from "./components/FigmaIntegrationModal";
import WireframeGenerator from "./pages/WireframeGenerator";
import { API_CONFIG, getApiUrl } from "./config/api";
// All API calls are now handled by the wireframe generation hook
import { useWireframeGeneration } from './hooks/useWireframeGeneration';
import { PerformanceTracker } from "./utils/performance";
import { generateHeroHTML } from "./components/HeroGenerator";
import { processWireframeForProduction } from './utils/wireframeProcessor';
import { sanitizeGeneratedHtml } from './utils/sanitizeGeneratedHtml';
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
  const designTheme = "microsoft";
  const [colorScheme, setColorScheme] = useState("primary");
  const [forceUpdateKey, setForceUpdateKey] = useState<number>(Date.now());
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [fastMode, setFastMode] = useState(false);
  const [showFigmaIntegration, setShowFigmaIntegration] = useState(false);
  const [showTopToolbarFigmaImport, setShowTopToolbarFigmaImport] = useState(false);

  // Editing mode state
  const [editingMode, setEditingMode] = useState<'drag' | 'edit'>('drag');

  // Toolbar function refs
  const figmaIntegrationRef = useRef<(() => void) | null>(null);
  const componentLibraryRef = useRef<(() => void) | null>(null);
  const devPlaybooksRef = useRef<(() => void) | null>(null);
  const figmaComponentsRef = useRef<(() => void) | null>(null);
  const viewHtmlCodeRef = useRef<(() => void) | null>(null);
  const downloadWireframeRef = useRef<(() => void) | null>(null);
  const presentationModeRef = useRef<(() => void) | null>(null);
  const enhancedSaveRef = useRef<(() => void) | null>(null);

  // Toolbar handler functions for header
  const handleToolbarFigma = () => {
    console.log('🎨 TOP TOOLBAR FIGMA BUTTON CLICKED - Opening Figma import (like landing page)...');
    setShowTopToolbarFigmaImport(true);
  };

  // Set up the component library ref for Pages toolbar 
  useEffect(() => {
    figmaIntegrationRef.current = () => {
      console.log('🎨 PAGES TOOLBAR COMPONENT LIBRARY BUTTON CLICKED - Opening Component Library...');
      if (componentLibraryRef.current) {
        componentLibraryRef.current();
      } else {
        console.warn('Component Library function not available');
      }
    };
  }, []);

  // Set up the dev playbooks ref for toolbar
  useEffect(() => {
    devPlaybooksRef.current = () => {
      console.log('📚 DEV PLAYBOOKS BUTTON CLICKED - Opening Dev Playbooks...');
      // Dev playbooks functionality would be handled by SplitLayout
    };
  }, []);

  // Set up the figma components ref for toolbar
  useEffect(() => {
    figmaComponentsRef.current = () => {
      console.log('🎨 FIGMA COMPONENTS BUTTON CLICKED - Opening Figma Components...');
      // Figma components functionality would be handled by SplitLayout
    };
  }, []);

  const handleToolbarHtmlCode = () => {
    if (viewHtmlCodeRef.current) {
      viewHtmlCodeRef.current();
    } else {
      console.log('HTML code viewer function not available');
    }
  };

  const handleToolbarDownload = () => {
    if (downloadWireframeRef.current) {
      downloadWireframeRef.current();
    } else {
      console.log('Download wireframe function not available');
    }
  };

  const handleToolbarPresentation = () => {
    if (presentationModeRef.current) {
      presentationModeRef.current();
    } else {
      console.log('Presentation mode function not available');
    }
  };

  const handleEnhancedSave = () => {
    if (enhancedSaveRef.current) {
      enhancedSaveRef.current();
    } else {
      console.log('Enhanced save function not available');
    }
  };

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

  // React component generation state
  const [reactComponent, setReactComponent] = useState("");
  const [isGeneratingComponent, setIsGeneratingComponent] = useState(false);
  const [componentGenerationError, setComponentGenerationError] = useState("");

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
      id: Date.now() + Math.random(), // Make it unique
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
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

  // Function to open wireframe from recent/favorites
  const openWireframe = (html: string, description: string) => {
    setDescription(description);
    handleWireframeGenerated(html, description);
    console.log('Wireframe opened from recent/favorites');
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

  // Track last description used so we can persist proper naming & recents
  const lastDescriptionRef = useRef<string>("");

  const handleWireframeGenerated = (html: string, currentDescription?: string) => {
    // Persist the description explicitly (fallback to previous if not provided)
    if (currentDescription && currentDescription.trim().length) {
      lastDescriptionRef.current = currentDescription.trim();
    }
    const effectiveDescription = currentDescription?.trim() || lastDescriptionRef.current;
    console.log("⚡ handleWireframeGenerated called", { effectiveDescription, htmlLength: html?.length });
    setShowLandingPage(false);

    // Convert to string if possible, otherwise use empty string
    let safeHtml = "";

    try {
      // Use object mode to preserve styles; then re-inject them at top if they aren't already in body
      const sanitized = sanitizeGeneratedHtml(html, true);
      if (sanitized.styles && !/^\s*<style/i.test(sanitized.html)) {
        safeHtml = `<style>${sanitized.styles}</style>\n${sanitized.html}`;
      } else {
        safeHtml = sanitized.html;
      }
    } catch (error) {
      console.error("⚡ Error processing HTML:", error);
    }

    // Only set non-empty HTML
    if (safeHtml && safeHtml.length > 0) {
      // Process the wireframe to fix images and Microsoft branding
      const processedHtml = processWireframeForProduction(safeHtml);
      setHtmlWireframe(processedHtml);

      // Add to recents
      try {
        const addToRecents = (window as any).addToRecents;
        if (addToRecents && effectiveDescription) {
          const recentName = effectiveDescription.length > 50 ?
            effectiveDescription.substring(0, 47) + "..." :
            effectiveDescription;
          addToRecents(recentName, "Wireframe created", processedHtml);
        }
      } catch (error) {
        console.log("Could not add to recents:", error);
      }
    } else {
      setHtmlWireframe(""); // Set empty string
    }

    setForceUpdateKey(Date.now()); // Always force update
  };

  const handleSubmit = async (e: React.FormEvent, overrideDescription?: string, websiteAnalysis?: any) => {
    const actualDescription = overrideDescription || description;
    console.log("🚀 handleSubmit called with description:", actualDescription);
    console.log("🔍 Website analysis data received:", !!websiteAnalysis, websiteAnalysis?.url);
    e.preventDefault();

    if (!actualDescription || actualDescription.trim().length === 0) {
      showToast('Please enter a description for the wireframe', 'warning');
      return;
    }

    // Create a new performance tracker
    const perfTracker = new PerformanceTracker('wireframe-generation');

    try {
      console.log('🚀 Generating wireframe with description:', actualDescription);

      // Use the generateWireframe hook which properly manages loading state
      const result = await generateWireframe(
        actualDescription,
        designTheme,
        colorScheme,
        false, // skipCache
        false, // fastMode
        websiteAnalysis
      );

      if (result && result.html) {
        if (typeof result.html === 'string' && result.html.length > 0) {
          handleWireframeGenerated(result.html, actualDescription);
          setReactComponent("");  // Clear React component
          setShowLandingPage(false);

          // Close AI suggestions panel after successful generation
          setShowAiSuggestions(false);
        } else {
          console.error("Error: Received invalid wireframe data");
          showToast("Error: Received invalid wireframe data. Please try again.", 'error');
        }
      } else {
        console.error("Error: No wireframe generated");
        showToast("Error: No wireframe generated. Please try again.", 'error');
      }
    } catch (err) {
      console.error("🚀 Exception in handleSubmit:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showToast(`Failed to generate wireframe: ${errorMessage}`, 'error');
    } finally {
      perfTracker.stop();
    }
  };


  const handleStop = () => {
    console.log('🛑 App.tsx handleStop called!');
    console.log('🛑 cancelGeneration function:', typeof cancelGeneration);
    console.log('🛑 Current loading state:', loading);

    // Use the cancel function from our hook
    try {
      cancelGeneration();
      console.log('🛑 cancelGeneration called successfully from App.tsx');
    } catch (error) {
      console.error('🛑 Error calling cancelGeneration:', error);
    }
  };

  const handleAiSuggestionClick = async (suggestion: string) => {
    console.log("🚀 AI suggestion clicked:", suggestion);
    console.log("🚀 Current designTheme:", designTheme);
    console.log("🚀 Current colorScheme:", colorScheme);
    setShowAiSuggestions(false);
    setDescription(suggestion);

    const perfTracker = new PerformanceTracker('ai-suggestion-wireframe');

    try {
      // Use the generateWireframe hook which properly manages loading state
      const result = await generateWireframe(
        suggestion,
        designTheme,
        colorScheme
      );

      if (result && result.html) {
        if (typeof result.html === 'string' && result.html.length > 0) {
          handleWireframeGenerated(result.html, suggestion);
          setReactComponent("");
          setShowLandingPage(false);
        } else {
          console.error("Error: Received invalid wireframe data");
          showToast("Error: Received invalid wireframe data. Please try again.", 'error');
        }
      } else {
        console.error("Error: No wireframe generated");
        showToast("Error: No wireframe generated. Please try again.", 'error');
      }
    } catch (err) {
      console.error("🚀 Exception in handleAiSuggestionClick:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showToast(`Failed to generate wireframe from suggestion: ${errorMessage}`, 'error');
    } finally {
      perfTracker.stop();
    }
  };

  const handleAddComponent = (component: any) => {
    console.log("🔧 App.tsx: handleAddComponent called with:", component);
    console.log("🔧 App.tsx: Current htmlWireframe length:", htmlWireframe?.length || 0);

    // Check if component has placement information from visual placement mode
    const hasPlacementInfo = component.placementInfo &&
      component.placementInfo.x !== undefined &&
      component.placementInfo.y !== undefined;

    if (hasPlacementInfo) {
      console.log("🎯 App.tsx: Placing component with coordinates:", component.placementInfo);
    }

    // Create HTML for the component based on its type and properties
    const componentHtml = generateComponentHtml(component);
    console.log("🔧 App.tsx: Generated HTML:", componentHtml);

    if (htmlWireframe) {
      // Add component to existing wireframe
      let updatedHtml;
      if (hasPlacementInfo) {
        // Use placement coordinates to insert at specific position
        updatedHtml = insertComponentAtPosition(htmlWireframe, componentHtml, component.placementInfo);
      } else {
        // Use default insertion logic
        updatedHtml = insertComponentIntoWireframe(htmlWireframe, componentHtml);
      }
      console.log("🔧 App.tsx: Updating existing wireframe, new length:", updatedHtml.length);
      setHtmlWireframe(updatedHtml);
      console.log("🔧 App.tsx: ✅ Component added successfully!");
    } else {
      // Create a new wireframe with just this component
      const newWireframe = createWireframeWithComponent(componentHtml);
      console.log("🔧 App.tsx: Creating new wireframe, length:", newWireframe.length);
      setHtmlWireframe(newWireframe);
      console.log("🔧 App.tsx: ✅ Created new wireframe with component!");
    }

    // Force a re-render to ensure the wireframe updates
    setForceUpdateKey(Date.now());

    // Show success notification
    const message = hasPlacementInfo ?
      "Component placed at selected position!" :
      "Component added successfully!";
    showToast(message, 'success');
  };

  // Function to remove all placed components
  const removeAllPlacedComponents = () => {
    if (htmlWireframe) {
      // Remove all placed components by filtering out elements with atlas-placed-component class
      const updatedHtml = htmlWireframe.replace(
        /<div class="atlas-placed-component"[^>]*>[\s\S]*?<\/div>/g,
        ''
      );
      setHtmlWireframe(updatedHtml);
      setForceUpdateKey(Date.now());
      showToast("All placed components removed!", 'success');
    }
  };

  // Handler for generating page content using AI
  const handleGeneratePageContent = async (description: string, pageType: string): Promise<string> => {
    try {
      console.log(`Generating ${pageType} content:`, description);
      const result = await generateWireframe(description, designTheme, colorScheme);
      const sanitized = sanitizeGeneratedHtml(result.html, true);
      // Prepend styles only if not already present inside html (avoid duplication)
      let combined = sanitized.html;
      if (sanitized.styles && !/^\s*<style/i.test(combined)) {
        combined = `<style>${sanitized.styles}</style>\n${combined}`;
      }
      return combined;
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
      // Use the HTML directly without any modifications
      let html = component.htmlCode;

      // Wrap the component if it's not already a single element
      if (html.trim().startsWith('<') && html.trim().endsWith('>')) {
        // Check if it's already a single element or multiple elements
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const bodyChildren = doc.body.children;

        if (bodyChildren.length === 1) {
          // Single element - add basic styling
          const element = bodyChildren[0] as HTMLElement;
          element.setAttribute('data-user-added', 'true');
          element.classList.add('atlas-component');
          html = element.outerHTML;
        } else {
          // Multiple elements - wrap in a container
          html = `<div class="atlas-component component-container" data-user-added="true" style="display: inline-block; margin: 8px;">${html}</div>`;
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
        return `<div class="ms-learn-layout" style="margin: 10px; padding: 20px; border: 2px solid #8E9AAF; border-radius: 8px; background: #f8f9fa;">
          <h3 style="color: #8E9AAF;">📄 Microsoft Learn Complete Layout</h3>
          <p>Complete Microsoft Learn page layout with top nav, hero, content sections, and footer</p>
        </div>`;

      case 'ms-learn-topnav':
        return `<nav class="ms-learn-topnav" style="margin: 10px; padding: 15px; background: #8E9AAF; color: white; border-radius: 4px;">
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
                background: #8E9AAF;
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
        return `<section class="ms-learn-hero" style="margin: 10px; padding: 30px; background: linear-gradient(135deg, #8E9AAF, #68769C); color: white; border-radius: 8px; text-align: center;">
          <h2 style="margin: 0 0 10px 0; color: white;">🚀 Microsoft Learn Hero Section</h2>
          <p style="margin: 0; font-size: 16px;">Engaging hero section with call-to-action and learning paths</p>
        </section>`;

      case 'ms-learn-footer':
        return `<footer class="ms-learn-footer" style="margin: 10px; padding: 20px; background: #3C4858; color: white; border-radius: 4px;">
          <h4 style="margin: 0 0 10px 0; color: white;">🦶 Microsoft Learn Footer</h4>
          <p style="margin: 0; font-size: 14px; color: #d1d1d1;">Footer with community links and feedback options</p>
        </footer>`;

      // Atlas Button Components
      case 'atlas-button-primary':
        return `<button class="button button-primary button-lg atlas-component" data-user-added="true" style="margin: 10px; padding: 12px 24px; background: #CBC2C2; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">${defaultProps?.text || 'Primary Button'}</button>`;

      case 'atlas-button-primary-filled':
        return `<button class="button button-primary-filled" style="margin: 10px; padding: 12px 24px; background: #8E9AAF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">${defaultProps?.text || 'Primary Filled Button'}</button>`;

      case 'atlas-button-primary-clear':
        return `<button class="button button-primary-clear" style="margin: 10px; padding: 12px 24px; background: transparent; color: #8E9AAF; border: 2px solid #8E9AAF; border-radius: 4px; cursor: pointer; font-weight: 500;">${defaultProps?.text || 'Primary Clear Button'}</button>`;

      case 'atlas-button-secondary':
        return `<button class="button button-secondary button-lg" style="margin: 10px; padding: 12px 24px; background: #f3f2f1; color: #3C4858; border: 1px solid #e1dfdd; border-radius: 4px; cursor: pointer; font-weight: 500;">${defaultProps?.text || 'Secondary Button'}</button>`;

      case 'atlas-button-secondary-clear':
        return `<button class="button button-secondary-clear" style="margin: 10px; padding: 12px 24px; background: transparent; color: #3C4858; border: 2px solid #e1dfdd; border-radius: 4px; cursor: pointer; font-weight: 500;">${defaultProps?.text || 'Secondary Clear Button'}</button>`;

      case 'atlas-button-secondary-filled':
        return `<button class="button button-secondary-filled" style="margin: 10px; padding: 12px 24px; background: #68769C; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">${defaultProps?.text || 'Secondary Filled Button'}</button>`;

      case 'atlas-button-danger':
        return `<button class="button button-danger" style="margin: 10px; padding: 12px 24px; background: #d13438; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">${defaultProps?.text || 'Danger Button'}</button>`;

      case 'atlas-button-success':
        return `<button class="button button-success" style="margin: 10px; padding: 12px 24px; background: #107c10; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">${defaultProps?.text || 'Success Button'}</button>`;

      case 'atlas-button-warning':
        return `<button class="button button-warning" style="margin: 10px; padding: 12px 24px; background: #ffb900; color: #3C4858; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">${defaultProps?.text || 'Warning Button'}</button>`;

      case 'atlas-button-loading':
        return `<button class="button button-loading" style="margin: 10px; padding: 12px 24px; background: #8E9AAF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;" disabled>⏳ Loading...</button>`;

      case 'atlas-button-small':
        return `<button class="button button-small" style="margin: 10px; padding: 8px 16px; background: #8E9AAF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; font-size: 12px;">${defaultProps?.text || 'Small Button'}</button>`;

      case 'atlas-button-large':
        return `<button class="button button-large" style="margin: 10px; padding: 16px 32px; background: #8E9AAF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; font-size: 18px;">${defaultProps?.text || 'Large Button'}</button>`;

      case 'atlas-button-block':
        return `<button class="button button-block" style="margin: 10px; padding: 12px 24px; background: #8E9AAF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; width: 100%; display: block;">${defaultProps?.text || 'Block Button'}</button>`;

      case 'atlas-button-search':
        return `<button class="button button-primary button-lg button-search" style="margin: 10px; padding: 12px 24px; background: #8E9AAF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; display: inline-flex; align-items: center; gap: 8px;">🔍 ${defaultProps?.text || 'Search'}</button>`;

      // Form Components
      case 'atlas-input':
        return `<div style="margin: 10px;">
          <label style="display: block; margin-bottom: 5px; color: #3C4858; font-weight: 600;">${defaultProps?.label || 'Input Label'}</label>
          <input type="text" class="form-control" placeholder="${defaultProps?.placeholder || 'Enter text here...'}" style="width: 100%; padding: 8px 12px; border: 1px solid #e1dfdd; border-radius: 4px; font-family: 'Segoe UI', sans-serif;">
        </div>`;

      case 'atlas-textarea':
        return `<div style="margin: 10px;">
          <label style="display: block; margin-bottom: 5px; color: #3C4858; font-weight: 600;">${defaultProps?.label || 'Textarea Label'}</label>
          <textarea class="form-control" placeholder="${defaultProps?.placeholder || 'Enter your text here...'}" rows="4" style="width: 100%; padding: 8px 12px; border: 1px solid #e1dfdd; border-radius: 4px; font-family: 'Segoe UI', sans-serif; resize: vertical;"></textarea>
        </div>`;

      case 'atlas-select':
        return `<div style="margin: 10px;">
          <label style="display: block; margin-bottom: 5px; color: #3C4858; font-weight: 600;">${defaultProps?.label || 'Select Label'}</label>
          <select class="form-control" style="width: 100%; padding: 8px 12px; border: 1px solid #e1dfdd; border-radius: 4px; font-family: 'Segoe UI', sans-serif;">
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>`;

      case 'atlas-checkbox':
        return `<div style="margin: 10px;">
          <label style="display: flex; align-items: center; color: #3C4858; font-weight: 500; cursor: pointer;">
            <input type="checkbox" style="margin-right: 8px; width: 16px; height: 16px;">
            ${defaultProps?.label || 'Checkbox Label'}
          </label>
        </div>`;

      case 'atlas-radio':
        return `<div style="margin: 10px;">
          <label style="display: flex; align-items: center; color: #3C4858; font-weight: 500; cursor: pointer;">
            <input type="radio" name="radio-group" style="margin-right: 8px; width: 16px; height: 16px;">
            ${defaultProps?.label || 'Radio Button Label'}
          </label>
        </div>`;

      case 'atlas-toggle':
        return `<div style="margin: 10px;">
          <label style="display: flex; align-items: center; color: #3C4858; font-weight: 500; cursor: pointer;">
            <div style="position: relative; width: 44px; height: 24px; background: #e1dfdd; border-radius: 12px; margin-right: 8px; transition: background 0.3s;">
              <div style="position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: transform 0.3s;"></div>
            </div>
            ${defaultProps?.label || 'Toggle Switch'}
          </label>
        </div>`;

      case 'atlas-label':
        return `<label style="margin: 10px; display: block; color: #3C4858; font-weight: 600; font-size: 14px;">${defaultProps?.text || 'Form Label'}</label>`;

      // Navigation Components
      case 'atlas-breadcrumb':
        return `<nav style="margin: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
          <div style="color: #68769C; font-size: 14px;">
            🏠 <a href="#" style="color: #8E9AAF; text-decoration: none;">Home</a> &gt; 
            <a href="#" style="color: #8E9AAF; text-decoration: none;">Category</a> &gt; 
            <span style="color: #3C4858; font-weight: 600;">Current Page</span>
          </div>
        </nav>`;

      case 'atlas-site-header':
        return `<header style="margin: 10px; padding: 20px; background: #3C4858; color: white; border-radius: 4px;">
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
            <button style="padding: 8px 12px; border: 1px solid #8E9AAF; background: #8E9AAF; color: white; border-radius: 4px;">1</button>
            <button style="padding: 8px 12px; border: 1px solid #e1dfdd; background: white; border-radius: 4px; cursor: pointer;">2</button>
            <button style="padding: 8px 12px; border: 1px solid #e1dfdd; background: white; border-radius: 4px; cursor: pointer;">3</button>
            <button style="padding: 8px 12px; border: 1px solid #e1dfdd; background: white; border-radius: 4px; cursor: pointer;">&raquo;</button>
          </div>
        </nav>`;

      // Content Components
      case 'atlas-gradient-card':
        return `<div class="gradient-card" style="margin: 10px; padding: 25px; background: linear-gradient(135deg, #8E9AAF, #68769C); color: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,120,212,0.3);">
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
          backgroundColor: "#E9ECEF",
          heroImageUrl: "hero-learn.svg"
        });

      case 'atlas-banner':
        return `<div class="banner" style="margin: 10px; padding: 20px; background: #fff4ce; border: 1px solid #ffb900; border-radius: 4px; color: #3C4858;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">ℹ️</span>
            <div>
              <h4 style="margin: 0 0 5px 0; color: #3C4858;">Important Banner</h4>
              <p style="margin: 0; color: #68769C;">This is an informational banner component.</p>
            </div>
          </div>
        </div>`;

      // Layout Components
      case 'atlas-container':
        return `<div class="container" style="margin: 10px; padding: 20px; border: 1px solid #e1dfdd; border-radius: 4px; background: #f9f9f9;">
          <h3 style="margin: 0 0 10px 0; color: #3C4858;">📦 Container</h3>
          <p style="margin: 0; color: #68769C;">This is a container component. Add your content here.</p>
        </div>`;

      case 'atlas-card':
        return `<div class="card atlas-component" data-user-added="true" style="margin: 10px; padding: 20px; border: 1px solid #e1dfdd; border-radius: 8px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h4 style="margin: 0 0 10px 0; color: #3C4858;">💳 Card Title</h4>
          <p style="margin: 0; color: #68769C;">Card content goes here. This is a Microsoft Learn styled card component.</p>
        </div>`;

      case 'atlas-heading':
        return `<h2 style="margin: 10px; color: #3C4858; font-size: 2rem; font-weight: 600;">📝 ${defaultProps?.text || 'Heading Component'}</h2>`;

      case 'atlas-text':
        return `<p style="margin: 10px; color: #68769C; line-height: 1.5; font-family: 'Segoe UI', sans-serif;">${defaultProps?.text || 'This is a text component. You can use it to display paragraphs of content with Microsoft Learn styling.'}</p>`;

      // Default fallback
      default:
        return `<div style="margin: 10px; padding: 15px; border: 2px dashed #e1dfdd; border-radius: 4px; color: #68769C; text-align: center; background: #f9f9f9;">
          <h4 style="margin: 0 0 5px 0; color: #3C4858;">🔧 ${name || 'Unknown Component'}</h4>
          <p style="margin: 0; font-size: 12px;">Component ID: ${id}</p>
        </div>`;
    }
  };

  const insertComponentIntoWireframe = (existingHtml: string, componentHtml: string) => {
    console.log("🔧 insertComponentIntoWireframe: Adding component to Fluent UI layout");

    // Check if we have an existing wireframe with Fluent UI layout structure
    const hasFluentGrid = existingHtml.includes('fluent-container') || existingHtml.includes('fluent-row') || existingHtml.includes('fluent-col');

    if (hasFluentGrid) {
      // Find the first available Fluent UI column or create a new one
      const colRegex = /<div class="col-[^"]*"[^>]*>/g;
      const columns = existingHtml.match(colRegex);

      if (columns && columns.length > 0) {
        // Find an empty column or the last column to append to
        const firstColMatch = existingHtml.match(/<div class="col-[^"]*"[^>]*>[\s]*<\/div>/);

        if (firstColMatch) {
          // Found an empty column, insert the component there
          return existingHtml.replace(
            firstColMatch[0],
            firstColMatch[0].replace('</div>', `
              <div class="atlas-component-wrapper" data-user-added="true">
                ${componentHtml}
              </div>
            </div>`)
          );
        } else {
          // Find the last closing div of a column and insert before it
          const lastColEndMatch = existingHtml.match(/(<div class="col-[^"]*"[^>]*>)([\s\S]*?)(<\/div>)(?![\s\S]*<div class="col-)/);

          if (lastColEndMatch) {
            const beforeClosing = lastColEndMatch[0];
            const newContent = beforeClosing.replace(
              lastColEndMatch[3],
              `
              <div class="atlas-component-wrapper mb-3" data-user-added="true">
                ${componentHtml}
              </div>
            ${lastColEndMatch[3]}`
            );
            return existingHtml.replace(beforeClosing, newContent);
          }
        }
      }

      // If no suitable column found, add a new row with the component
      const lastRowMatch = existingHtml.match(/(<div class="row[^"]*"[^>]*>[\s\S]*?<\/div>)(?![\s\S]*<div class="row)/);

      if (lastRowMatch) {
        const insertAfterRow = lastRowMatch[0];
        const newRow = `
          <div class="row mb-4">
            <div class="col-md-6">
              <div class="atlas-component-wrapper" data-user-added="true">
                ${componentHtml}
              </div>
            </div>
            <div class="col-md-6">
              <div class="p-4 border border-dashed rounded text-center text-muted">
                <p class="mb-0">Drop zone for additional components</p>
              </div>
            </div>
          </div>`;

        return existingHtml.replace(insertAfterRow, insertAfterRow + newRow);
      }
    }

    // If no Fluent UI structure found, wrap the component and append
    const componentWrapper = `
      <div class="atlas-component-wrapper mt-4" data-user-added="true" style="
        background: rgba(255, 255, 255, 0.95);
        border: 2px solid #8E9AAF;
        border-radius: 8px;
        padding: 15px;
        margin: 15px 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: atlasSlideIn 0.6s ease-out;
      ">
        ${componentHtml}
      </div>
      
      <style>
        @keyframes atlasSlideIn {
          0% { transform: translateY(-20px) scale(0.95); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .atlas-component-wrapper:hover {
          transform: scale(1.02);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
      </style>`;

    // Insert before closing body tag
    const bodyCloseMatch = existingHtml.match(/<\/body>/);
    if (bodyCloseMatch) {
      return existingHtml.replace('</body>', componentWrapper + '\n</body>');
    }

    // Fallback: append to end
    return existingHtml + componentWrapper;
  };

  const insertComponentAtPosition = (existingHtml: string, componentHtml: string, placementInfo: any) => {
    console.log("🎯 insertComponentAtPosition: Placing component at:", placementInfo);

    const { x, y, targetElement } = placementInfo;

    // Create a positioned wrapper for the component
    const positionedWrapper = `
      <div class="atlas-placed-component" data-user-added="true" data-placed="true" 
           ondblclick="this.remove()" 
           title="Double-click to remove this component"
           style="
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        z-index: 1000;
        border: 1px solid rgba(0, 120, 212, 0.3);
        border-radius: 4px;
        padding: 8px;
        animation: atlasPlaceIn 0.3s ease-out;
        cursor: pointer;
      ">
        ${componentHtml}
        <button class="remove-component-btn" onclick="this.parentElement.remove()" 
                title="Remove component" 
                style="
          position: absolute;
          top: -8px;
          right: -8px;
          width: 18px;
          height: 18px;
          border: none;
          background: #dc3545;
          color: white;
          border-radius: 50%;
          font-size: 12px;
          line-height: 1;
          cursor: pointer;
          display: none;
          align-items: center;
          justify-content: center;
        ">×</button>
      </div>
      
      <style>
        @keyframes atlasPlaceIn {
          0% { opacity: 0; transform: translateY(-4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .atlas-placed-component:hover {
          border-color: rgba(0, 120, 212, 0.5);
        }
        .atlas-placed-component:hover .remove-component-btn {
          display: flex !important;
        }
        .remove-component-btn:hover {
          background: #c82333 !important;
          transform: scale(1.1);
        }
      </style>`;

    // Find the wireframe content area to ensure positioning context
    let updatedHtml = existingHtml;

    // Make sure we have a positioning context
    if (!existingHtml.includes('position: relative')) {
      // Add relative positioning to the main content area
      const bodyMatch = existingHtml.match(/<body[^>]*>/);
      if (bodyMatch) {
        const bodyTag = bodyMatch[0];
        const newBodyTag = bodyTag.includes('style=')
          ? bodyTag.replace(/style="([^"]*)"/, 'style="$1; position: relative;"')
          : bodyTag.replace('>', ' style="position: relative;">');
        updatedHtml = updatedHtml.replace(bodyTag, newBodyTag);
      }
    }

    // Insert the positioned component before the closing body tag
    const bodyCloseMatch = updatedHtml.match(/<\/body>/);
    if (bodyCloseMatch) {
      updatedHtml = updatedHtml.replace('</body>', positionedWrapper + '\n</body>');
    } else {
      // Fallback: append to end
      updatedHtml += positionedWrapper;
    }

    console.log("🎯 Component placed at position:", { x, y });
    return updatedHtml;
  };

  const createWireframeWithComponent = (componentHtml: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Component Wireframe</title>
    <link href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/11.0.0/css/fabric.min.css" rel="stylesheet">
    <style>
      body { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; }
      .fluent-container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 16px; }
      .fluent-row { display: flex; flex-wrap: wrap; margin: 0 -8px; }
      .fluent-col { flex: 1; padding: 0 8px; min-width: 0; }
    </style>
    <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          background-color: #f8f9fa;
          padding: 20px;
        }
        .wireframe-container { 
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 30px;
          min-height: 400px; 
        }
        .button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; }
        .button-primary { background: #8E9AAF; color: white; }
        .button-secondary { background: #f3f2f1; color: #3C4858; border: 1px solid #e1dfdd; }
        .button-lg { padding: 12px 24px; }
        .button-search { display: inline-flex; align-items: center; gap: 8px; }
        
        /* Component entry animation */
        @keyframes atlasSlideIn {
          0% { transform: translateY(-20px) scale(0.95); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .atlas-component-wrapper {
          animation: atlasSlideIn 0.6s ease-out;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid #8E9AAF;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .atlas-component-wrapper:hover {
          transform: scale(1.02);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
        .atlas-component-wrapper .atlas-component {
          margin: 0 !important;
        }
    </style>
</head>
<body>
    <div style="width: 100%; padding: 0 16px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div class="wireframe-container">
            <div class="row mb-4">
                <div class="col-12">
                    <h1 class="h3 text-primary mb-1">Component Library Wireframe</h1>
                    <p style="color: #68769C; font-size: 14px;">Components are added to the Fluent UI layout and can be rearranged using drag & drop.</p>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <div class="atlas-component-wrapper" data-user-added="true">
                        ${componentHtml}
                    </div>
                </div>
                <div class="col-md-8 mb-3">
                    <div class="p-4 border border-dashed rounded text-center text-muted">
                        <h5>Drop Zone</h5>
                        <p class="mb-0">Add more components from the library or drag existing ones to rearrange.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  };

  const injectCSSIntoWireframe = (html: string, css: string) => {
    console.log('🎨 Injecting CSS into wireframe');

    // Look for existing <style> tag in the head
    const styleRegex = /(<head>[\s\S]*?)(<\/head>)/i;
    const styleMatch = html.match(styleRegex);

    if (styleMatch) {
      // Check if there's already a <style> tag
      const existingStyleRegex = /(<style>[\s\S]*?<\/style>)/i;
      const existingStyleMatch = styleMatch[1].match(existingStyleRegex);

      if (existingStyleMatch) {
        // Append to existing style tag
        const updatedStyle = existingStyleMatch[1].replace('</style>', `\n${css}\n</style>`);
        return html.replace(existingStyleMatch[1], updatedStyle);
      } else {
        // Add new style tag before closing head
        const newHead = styleMatch[1] + `\n<style>\n${css}\n</style>\n`;
        return html.replace(styleMatch[1], newHead);
      }
    } else {
      // If no head found, try to add after <head> tag
      const headOpenRegex = /<head[^>]*>/i;
      const headOpenMatch = html.match(headOpenRegex);

      if (headOpenMatch) {
        return html.replace(headOpenMatch[0], `${headOpenMatch[0]}\n<style>\n${css}\n</style>`);
      }
    }

    // Fallback: add style tag at the beginning of the document
    return `<style>\n${css}\n</style>\n${html}`;
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
          handleWireframeGenerated(result.html, description);
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
        body: JSON.stringify({ description: input.trim() }), // Backend expects 'description' parameter
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
  };

  const handleGenerateAiSuggestions = useCallback(async (input: string) => {
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
  }, []);

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
    setReactComponent(""); // Clear React component when going back
    setShowLandingPage(true);
    setDescription("");
  };

  const handleAnalyzeImage = async (imageUrl: string, fileName: string) => {
    console.log('🔍 Starting direct image-to-wireframe conversion:', fileName, 'Size:', imageUrl.length, 'bytes');
    setIsAnalyzingImage(true);

    try {
      // Use the direct image-to-wireframe conversion endpoint that preserves exact colors and text
      const directResponse = await fetch('/api/direct-image-to-wireframe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageUrl, // Base64 image data
          designTheme: designTheme,
          colorScheme: colorScheme,
        }),
      });

      if (!directResponse.ok) {
        throw new Error(`Direct conversion failed: ${directResponse.status}`);
      }

      const directResult = await directResponse.json();

      if (!directResult.success) {
        throw new Error(directResult.error || 'Direct conversion failed');
      }

      console.log('✅ Direct image-to-wireframe conversion completed successfully');

      // Set description to indicate this is from image analysis
      const imageDescription = `Pixel-perfect wireframe generated from uploaded image: ${fileName}. Preserves exact colors, text, and layout from the original design.`;
      setDescription(imageDescription);

      // Use the generated HTML directly - no need for additional processing
      if (directResult.html) {
        handleWireframeGenerated(directResult.html, imageDescription);
      }
    } catch (error) {
      console.error('❌ Direct conversion failed, trying fallback:', error);

      // Fallback to enhanced analysis if direct conversion fails
      try {
        const analysisResponse = await fetch('/api/analyzeUIImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: imageUrl,
            prompt: 'Extract EXACT text content and EXACT hex colors from this image. Be pixel-perfect in color matching.',
          }),
        });

        if (analysisResponse.ok) {
          const analysisResult = await analysisResponse.json();

          if (analysisResult.success) {
            const fallbackDescription = `Recreate this UI design from image: ${fileName}. Use exact colors and text from analysis.`;
            setDescription(fallbackDescription);

            const result = await generateWireframe(
              fallbackDescription,
              designTheme,
              colorScheme,
              analysisResult // Pass the analysis result for better context
            );

            if (result && result.html) {
              handleWireframeGenerated(result.html, fallbackDescription);
              return;
            }
          }
        }
      } catch (fallbackError) {
        console.error('❌ Fallback analysis also failed:', fallbackError);
      }

      // Final fallback to basic text-based generation
      const basicDescription = `Generate a wireframe based on the uploaded image: ${fileName}. Analyze the layout, components, and structure shown in the image.`;
      setDescription(basicDescription);

      const result = await generateWireframe(
        basicDescription,
        designTheme,
        colorScheme
      );

      if (result && result.html) {
        handleWireframeGenerated(result.html, basicDescription);
      }
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // Figma integration handlers
  const handleFigmaComponentsImported = (components: any[]) => {
    console.log('Figma components imported:', components);

    if (components.length === 0) {
      showToast('No components were imported', 'warning');
      return;
    }

    // Create HTML from imported components
    let combinedHtml = '';
    components.forEach((component, index) => {
      if (component.wireframeHtml) {
        combinedHtml += `
          <div class="figma-imported-component" data-component-name="${component.componentName}" style="margin: 20px 0; padding: 20px; border: 2px solid #8E9AAF; border-radius: 8px; background: rgba(255,255,255,0.95);">
            <h4 style="margin: 0 0 15px 0; color: #8E9AAF; font-size: 16px;">📦 ${component.componentName}</h4>
            ${component.wireframeHtml}
          </div>
        `;
      }
    });

    if (combinedHtml) {
      if (htmlWireframe) {
        // Add to existing wireframe
        const updatedHtml = insertComponentIntoWireframe(htmlWireframe, combinedHtml);
        setHtmlWireframe(updatedHtml);
        showToast(`Added ${components.length} Figma component(s) to wireframe`, 'success');
      } else {
        // Create new wireframe with imported components
        const newWireframe = createWireframeWithComponent(combinedHtml);
        setHtmlWireframe(newWireframe);
        setShowLandingPage(false);
        showToast(`Created wireframe with ${components.length} Figma component(s)`, 'success');
      }
      setForceUpdateKey(Date.now());
    } else {
      showToast('Failed to process imported components', 'error');
    }

    setShowFigmaIntegration(false);
  };

  // Handler for adding components directly to wireframe
  const handleAddToWireframe = (componentData: any[]) => {
    console.log('🔧 Adding components to wireframe:', componentData);

    if (componentData.length === 0) {
      showToast('No components selected to add to wireframe', 'warning');
      return;
    }

    // Process each component separately to ensure individual placement
    let updatedHtml = htmlWireframe;
    let componentsAdded = 0;
    let allComponentCSS = ''; // Collect all CSS from components

    componentData.forEach((component) => {
      console.log('🔧 Processing component:', component.name, 'content:', component.content);

      if (component.content) {
        // Collect CSS from component
        if (component.css && component.css.trim()) {
          allComponentCSS += `\n/* CSS for ${component.name} */\n${component.css}\n`;
          console.log('🎨 Collected CSS for component:', component.name);
        }

        // Create individual component HTML
        const componentHtml = `
          <div class="figma-imported-component" data-component-id="${component.id}" style="margin: 10px 0;">
            ${component.content}
          </div>
        `;

        console.log('🔧 Individual component HTML:', componentHtml);

        if (updatedHtml && updatedHtml.trim() !== '') {
          // Add to existing wireframe individually
          updatedHtml = insertComponentIntoWireframe(updatedHtml, componentHtml);
        } else {
          // Create new wireframe with first component
          updatedHtml = createWireframeWithComponent(componentHtml);
          setShowLandingPage(false);
        }
        componentsAdded++;
      }
    });

    // Inject collected CSS into the wireframe
    if (allComponentCSS.trim()) {
      console.log('🎨 Injecting component CSS into wireframe');
      updatedHtml = injectCSSIntoWireframe(updatedHtml, allComponentCSS);
    }

    if (componentsAdded > 0) {
      setHtmlWireframe(updatedHtml);
      showToast(`Added ${componentsAdded} component(s) to wireframe`, 'success');
      setForceUpdateKey(Date.now());
    } else {
      showToast('Failed to process component data', 'error');
    }

    setShowFigmaIntegration(false);
  };

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
        handleWireframeGenerated(result.html, description);
      }
    } catch (error) {
      console.error('Error generating demo wireframe:', error);
      showToast('Failed to generate demo wireframe', 'error');
    }
  };

  return (
    <div className={`app-content`}>
      {/* Conditional TopNavbar based on landing page state */}
      {showLandingPage && !htmlWireframe && !reactComponent ? (
        <TopNavbarLanding
          onLogoClick={handleBackToLanding}
          onLogout={onLogout}
        />
      ) : (
        <TopNavbarApp
          onLogoClick={handleBackToLanding}
          onLogout={onLogout}
          onFigmaIntegration={handleToolbarFigma}
          onViewHtmlCode={handleToolbarHtmlCode}
          onPresentationMode={handleToolbarPresentation}
          onDownloadWireframe={handleToolbarDownload}
        />
      )}

      {showLandingPage && !htmlWireframe && !reactComponent ? (
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
          onOpenWireframe={openWireframe}
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
          htmlWireframe={reactComponent || htmlWireframe}
          setHtmlWireframe={setHtmlWireframe}
          reactComponent={reactComponent}
          setReactComponent={setReactComponent}
          onSave={() => setShowSaveDialog(true)}
          onEnhancedSave={enhancedSaveRef}
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
          onImageUpload={handleImageUpload}
          onAnalyzeImage={handleAnalyzeImage}
          isAnalyzingImage={isAnalyzingImage}
          onFigmaExport={handleFigmaExport}
          onFigmaIntegration={figmaIntegrationRef}
          onComponentLibrary={componentLibraryRef}
          onDevPlaybooks={devPlaybooksRef}
          onFigmaComponents={figmaComponentsRef}
          onViewHtmlCode={viewHtmlCodeRef}
          onDownloadWireframe={downloadWireframeRef}
          onPresentationMode={presentationModeRef}
          editingMode={editingMode}
          onEditingModeChange={setEditingMode}
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

      {/* Figma Integration Modal */}
      {/* This modal is used for both:
          - Top toolbar Figma button (design import)  
          - Pages toolbar Figma button (component browser) */}
      {(() => {
        console.log('🔍 App.tsx render: showFigmaIntegration =', showFigmaIntegration);
        return null;
      })()}
      {showFigmaIntegration && (
        <div className="figma-modal-overlay">
          <FigmaIntegration
            onComponentsImported={handleFigmaComponentsImported}
            onAddToWireframe={handleAddToWireframe}
            onClose={() => setShowFigmaIntegration(false)}
            designSystem="auto"
            mode="add-to-wireframe"
          />
        </div>
      )}

      {showTopToolbarFigmaImport && (
        <FigmaIntegrationModal
          isOpen={showTopToolbarFigmaImport}
          onClose={() => setShowTopToolbarFigmaImport(false)}
          onImport={(html, fileName, tokens) => {
            // Handle the import with design tokens
            handleFigmaImport(html, fileName);
            if (tokens) {
              console.log('Design tokens extracted:', tokens);
              // You can add token handling logic here if needed
            }
            setShowTopToolbarFigmaImport(false);
          }}
          onExport={(format) => {
            console.log('Figma export requested:', format);
            // Handle export functionality
            setShowTopToolbarFigmaImport(false);
          }}
          onTokensExtracted={(tokens) => {
            console.log('Design tokens extracted:', tokens);
            // Handle token extraction
          }}
          onFileProcessed={(file, data) => {
            console.log('File processed:', file.name, data);
            // Handle file processing
          }}
        />
      )}

    </div>
  );
}

// Main App component with Azure authentication
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we're running in local development
    const isLocalDev = window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.port !== '';

    if (isLocalDev) {
      // In local development, bypass authentication for testing
      console.log('🔧 Development mode: Bypassing Azure authentication');
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }

    // In production (Azure), check Azure authentication status
    console.log('🔐 Production mode: Checking Azure authentication');
    fetch('/.auth/me')
      .then(response => response.json())
      .then(data => {
        console.log('🔐 Azure auth response:', data);
        if (data.clientPrincipal) {
          setIsAuthenticated(true);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log('🔐 Azure auth check failed:', error);
        setLoading(false);
      });
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Check if we're in production before attempting logout
    const isLocalDev = window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.port !== '';

    if (isLocalDev) {
      // In local development, just reload the page
      window.location.reload();
    } else {
      // In production, redirect to Azure logout
      window.location.href = '/.auth/logout';
    }
  };

  if (loading) {
    return (
      <div className="app-loading-container">
        <div>Loading...</div>
      </div>
    );
  }

  // If not authenticated, show Azure authentication
  if (!isAuthenticated) {
    return <AzureAuth onAuthSuccess={handleAuthSuccess} />;
  }

  // If authenticated, show the main application
  return <AppContent onLogout={handleLogout} />;
}

export default App;
