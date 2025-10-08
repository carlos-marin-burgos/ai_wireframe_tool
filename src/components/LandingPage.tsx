import React, { useRef, useEffect, useState, useCallback } from "react";
import "./LandingPage.css";
import Footer from './Footer';
import ImageUploadModal from './ImageUploadModal';
import ColorThemeSelector from './ColorThemeSelector';
import { figmaApi, FigmaFile as ApiFigmaFile, FigmaFrame } from '../services/figmaApi';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import FigmaIntegrationModal from './FigmaIntegrationModal';
import LoadingSpinner from './LoadingSpinner';

interface LandingPageProps {
  error: string | null;
  savedWireframesCount: number;
  onLoadClick: () => void;
  description: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent, overrideDescription?: string) => void;
  loading: boolean;
  handleStop: () => void;
  showAiSuggestions: boolean;
  aiSuggestions: string[];
  suggestionLoading: boolean;
  onAiSuggestionClick: (suggestion: string) => void;
  onGenerateAiSuggestions?: (currentValue: string) => void;
  onImageUpload?: (file: File) => void;
  onAnalyzeImage?: (imageUrl: string, fileName: string) => Promise<any> | void;
  isAnalyzingImage?: boolean;
  onFigmaImport?: (html: string, fileName: string) => void;
  onFigmaExport?: (format: 'image' | 'pdf') => void;
  onOpenWireframe?: (html: string, description: string) => void;
  onFigmaModalOpen?: () => void;
}

import {
  FiPlus,
  FiFolder,
  FiSend,
  FiStopCircle,
  FiCpu,
  FiImage,
  FiLink,
  FiFigma,
  FiZap,
  FiTrash,
  FiDownload,
  FiRefreshCw,
  FiCheck,
  FiAlertCircle,
  FiFileText,
  FiLayers,
  FiSettings,
  FiExternalLink,
} from "react-icons/fi";

function LandingPage({
  error,
  savedWireframesCount,
  onLoadClick,
  description,
  onDescriptionChange,
  onSubmit,
  loading,
  handleStop,
  showAiSuggestions,
  aiSuggestions,
  suggestionLoading,
  onAiSuggestionClick,
  onGenerateAiSuggestions,
  onImageUpload,
  onAnalyzeImage,
  isAnalyzingImage = false,
  onFigmaImport,
  onFigmaExport,
  onOpenWireframe,
}: LandingPageProps) {
  // Create ref for textarea autofocus
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Ref for projects container to handle scroll indicators
  const projectsContainerRef = useRef<HTMLDivElement>(null);

  // State for image upload modal
  const [showImageUpload, setShowImageUpload] = useState(false);

  // State for validation error
  const [validationError, setValidationError] = useState<string | null>(null);

  // Modal states
  const [isFigmaModalOpen, setIsFigmaModalOpen] = useState(false);

  // Recent/Saved tab state
  const [activeTab, setActiveTab] = useState<'recent' | 'saved'>('recent');
  const [savedWireframes, setSavedWireframes] = useState<any[]>([]);
  const [recents, setRecents] = useState<any[]>([]);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemName: string;
    itemType: 'saved' | 'recent';
    onConfirm: () => void;
  }>({
    isOpen: false,
    itemName: '',
    itemType: 'saved',
    onConfirm: () => { }
  });

  // Load saved wireframes and recents from localStorage
  useEffect(() => {
    // ONE-TIME MIGRATION: Move data from old key to new key
    const migrateOldFavorites = () => {
      const oldFavorites = localStorage.getItem('designetica_favorites');
      const newSaved = localStorage.getItem('designetica-saved-wireframes');

      // Only migrate if old data exists and new key is empty
      if (oldFavorites && !newSaved) {
        console.log('Migrating favorites to saved wireframes...');
        localStorage.setItem('designetica-saved-wireframes', oldFavorites);
        // Keep old data for safety, users can manually clean it up later
      }
    };

    migrateOldFavorites();

    const loadSavedWireframes = () => {
      const saved = JSON.parse(localStorage.getItem('designetica-saved-wireframes') || '[]');
      setSavedWireframes(saved);
    };

    const loadRecents = () => {
      const savedRecents = JSON.parse(localStorage.getItem('designetica_recents') || '[]');
      setRecents(savedRecents);
    };

    loadSavedWireframes();
    loadRecents();

    // Listen for saved wireframes and recents updates
    const handleStorageChange = () => {
      loadSavedWireframes();
      loadRecents();
    };

    // Listen for custom events (same-tab updates)
    const handleSavedWireframesUpdated = () => {
      loadSavedWireframes();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('savedWireframesUpdated', handleSavedWireframesUpdated as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('savedWireframesUpdated', handleSavedWireframesUpdated as EventListener);
    };
  }, []);

  // Delete saved wireframe function
  const handleDeleteSaved = (savedId: string) => {
    const savedToDelete = savedWireframes.find(item => item.id === savedId);
    const savedName = savedToDelete?.name || 'this wireframe';

    setDeleteModal({
      isOpen: true,
      itemName: savedName,
      itemType: 'saved',
      onConfirm: () => {
        const updatedSaved = savedWireframes.filter(item => item.id !== savedId);
        setSavedWireframes(updatedSaved);
        localStorage.setItem('designetica-saved-wireframes', JSON.stringify(updatedSaved));
      }
    });
  };

  // Delete recent function
  const handleDeleteRecent = (recentId: string) => {
    const recentToDelete = recents.find(rec => rec.id === recentId);
    const recentName = recentToDelete?.name || 'this recent project';

    setDeleteModal({
      isOpen: true,
      itemName: recentName,
      itemType: 'recent',
      onConfirm: () => {
        const updatedRecents = recents.filter(rec => rec.id !== recentId);
        setRecents(updatedRecents);
        localStorage.setItem('designetica_recents', JSON.stringify(updatedRecents));
      }
    });
  };

  // Open wireframe from recent or favorites
  const handleOpenWireframe = (item: any) => {
    if (onOpenWireframe && item.htmlContent) {
      onOpenWireframe(item.htmlContent, item.description || item.name);
    } else {
      console.warn('Cannot open wireframe: missing HTML content or onOpenWireframe handler');
    }
  };

  // Save wireframe from recent section
  const handleSaveRecentWireframe = (projectName: string, projectMeta: string, htmlContent?: string) => {
    const newSaved = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: projectName,
      description: projectMeta,
      htmlContent: htmlContent || '',
      type: 'recent',
      createdAt: new Date().toISOString()
    };

    const currentSaved = JSON.parse(localStorage.getItem('designetica-saved-wireframes') || '[]');
    const updatedSaved = [...currentSaved, newSaved];

    setSavedWireframes(updatedSaved);
    localStorage.setItem('designetica-saved-wireframes', JSON.stringify(updatedSaved));

    alert(`"${projectName}" has been saved!`);
  };

  // Add to recents utility function (can be called from parent)
  const addToRecents = useCallback((name: string, description: string, htmlContent?: string) => {
    const newRecent = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      htmlContent: htmlContent || '',
      type: 'wireframe',
      createdAt: new Date().toISOString()
    };

    const currentRecents = JSON.parse(localStorage.getItem('designetica_recents') || '[]');

    // Avoid duplicates by checking if a recent with the same name exists
    const existingIndex = currentRecents.findIndex((recent: any) => recent.name === name);
    if (existingIndex !== -1) {
      currentRecents.splice(existingIndex, 1); // Remove existing
    }

    // Add to beginning of array (most recent first)
    const updatedRecents = [newRecent, ...currentRecents].slice(0, 10); // Keep only last 10

    setRecents(updatedRecents);
    localStorage.setItem('designetica_recents', JSON.stringify(updatedRecents));
  }, []);

  // Expose addToRecents function to parent
  useEffect(() => {
    // Make the function available globally if needed
    (window as any).addToRecents = addToRecents;

    // Listen for wireframe save events to update UI
    const handleWireframeSaved = (event: CustomEvent) => {
      const { name, description, html } = event.detail;
      addToRecents(name, description, html);
    };

    window.addEventListener('wireframeSaved', handleWireframeSaved as EventListener);

    return () => {
      window.removeEventListener('wireframeSaved', handleWireframeSaved as EventListener);
    };
  }, [addToRecents]);

  // Debounce timer for AI suggestions
  const debounceTimerRef = useRef<number | null>(null);

  // Function to validate input - check if it's only numbers
  const validateInput = (input: string): boolean => {
    const trimmedInput = input.trim();

    // Check if input is empty - just return false without showing error
    if (trimmedInput.length === 0) {
      return false;
    }

    // Check if the input is only numbers (including spaces and basic punctuation)
    const onlyNumbersRegex = /^[\d\s.,]+$/;

    if (onlyNumbersRegex.test(trimmedInput)) {
      setValidationError("Please provide a descriptive text, not just numbers. For example: 'contact form with name and email fields' instead of just '2'.");
      return false;
    }

    // Clear validation error if input is valid
    setValidationError(null);
    return true;
  };

  // Wrapper for form submission with validation
  const handleFormSubmit = (e: React.FormEvent, overrideDescription?: string) => {
    e.preventDefault();

    // Use override description if provided, otherwise use current description
    const inputToValidate = overrideDescription || description;

    // Validate the input before proceeding
    if (!validateInput(inputToValidate)) {
      return; // Stop submission if validation fails
    }

    // Call the original onSubmit if validation passes
    onSubmit(e, overrideDescription);
  };

  // Wrapper for description change with real-time validation
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    // Call the parent's onChange handler
    onDescriptionChange(e);

    // Clear validation error in real-time as user types valid input
    if (validationError && value.trim()) {
      const trimmedInput = value.trim();
      const onlyNumbersRegex = /^[\d\s.,]+$/;

      // If the input is no longer number-only, clear the error
      if (!onlyNumbersRegex.test(trimmedInput)) {
        setValidationError(null);
      }
    }

    // Also clear error if input becomes empty
    if (!value.trim()) {
      setValidationError(null);
    }
  };

  // Focus the textarea on component mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Handle scroll indicator for projects container
  useEffect(() => {
    const container = projectsContainerRef.current;
    if (!container) return;

    const updateScrollIndicator = () => {
      const isScrollable = container.scrollHeight > container.clientHeight;
      const isScrolledToBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 5;

      if (isScrollable && !isScrolledToBottom) {
        container.style.setProperty('--scroll-indicator-opacity', '1');
      } else {
        container.style.setProperty('--scroll-indicator-opacity', '0');
      }
    };

    // Initial check
    updateScrollIndicator();

    // Listen for scroll events
    container.addEventListener('scroll', updateScrollIndicator);

    // Listen for content changes
    const observer = new ResizeObserver(updateScrollIndicator);
    observer.observe(container);

    return () => {
      container.removeEventListener('scroll', updateScrollIndicator);
      observer.disconnect();
    };
  }, [savedWireframes, recents, activeTab]);

  // Debounced AI suggestion trigger
  useEffect(() => {
    if (onGenerateAiSuggestions && description.length > 0) {
      // Check if the current input is valid before generating suggestions
      const trimmedInput = description.trim();
      const onlyNumbersRegex = /^[\d\s.,]+$/;

      // Don't generate suggestions for number-only inputs
      if (onlyNumbersRegex.test(trimmedInput)) {
        return;
      }

      // Clear existing timer
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }

      // Immediate trigger for first 2 characters (fast suggestions only)
      // Shorter delay for responsive feel
      const delay = description.length <= 3 ? 100 : 200;

      debounceTimerRef.current = window.setTimeout(() => {
        onGenerateAiSuggestions(description);
      }, delay);
    }

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [description, onGenerateAiSuggestions]);

  // Toggle image upload modal
  const toggleImageUpload = () => {
    setShowImageUpload(prev => !prev);
  };

  // Wrapper handlers to close modal after successful image analysis
  const handleImageUploadWithModalClose = useCallback((file: File) => {
    if (onImageUpload) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleAnalyzeImageWithModalClose = useCallback(async (imageUrl: string, fileName: string) => {
    if (onAnalyzeImage) {
      try {
        await onAnalyzeImage(imageUrl, fileName);
        // Close modal on successful analysis
        setShowImageUpload(false);
      } catch (error) {
        // Keep modal open on error so user can try again
        console.error('Image analysis failed:', error);
      }
    }
  }, [onAnalyzeImage]);

  // Simple Figma Integration handlers - Enhanced modal handles the rest
  const handleFigmaImport = (html: string, fileName: string) => {
    if (onFigmaImport) {
      onFigmaImport(html, fileName);
    }
    setIsFigmaModalOpen(false);
  };

  const handleFigmaExport = (format: 'image' | 'pdf') => {
    if (onFigmaExport) {
      onFigmaExport(format);
    }
    setIsFigmaModalOpen(false);
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-content">
          {/* Figma Plugin Announcement Banner - Positioned at the very top */}
          <div className="figma-plugin-announcement">
            <div className="announcement-content">
              <div className="announcement-icon">
                <FiFigma />
              </div>
              <div className="announcement-text">
                <h3>🎉 New: Designetica Figma Plugin!</h3>
                <p>Generate AI wireframes directly in Figma.</p>
              </div>
              <div className="announcement-action">
                <a
                  href="figma://plugin/1543300122157762658"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="figma-plugin-btn"
                >
                  <FiFigma />
                  Open in Figma
                </a>
              </div>
            </div>
          </div>

          <h1 className="main-heading">What will you <span className="design-word">design</span> today?</h1>
          <p className="main-subtitle">
            Sketch your vision, ship your wireframe - Designetica AI does the
            heavy lifting.
          </p>

          {error && <div className="error error-center">{error}</div>}
          {validationError && <div className="input-info-alert">{validationError}</div>}
          {savedWireframesCount > 0 && (
            <div className="action-buttons-center">
              <button
                type="button"
                onClick={onLoadClick}
                className="secondary-btn-center"
              >
                <FiFolder /> Load Previous Work
              </button>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="main-form">
            <div className="input-container">
              {/* Text Input with Upload Button */}
              <div className="textarea-container">
                <textarea
                  ref={textareaRef}
                  value={description}
                  onChange={handleDescriptionChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (description.trim() && !loading) {
                        // Use validation wrapper for Enter key submission
                        handleFormSubmit(e);
                      }
                    }
                  }}
                  placeholder="How can Designetica help you today? (e.g., 'Create a Microsoft Learn certification dashboard with Azure exam tracking and study progress')"
                  rows={4}
                  className="app-textarea main-input"
                />

                <button
                  type="submit"
                  disabled={loading || !description.trim()}
                  className="send-btn"
                  title={loading ? "Generating..." : "Generate"}
                >
                  {loading ? (
                    <LoadingSpinner size="small" color="white" />
                  ) : (
                    <FiSend className="send-icon" />
                  )}
                </button>

                {loading && (
                  <button
                    type="button"
                    className={`stop-btn-landing ${loading ? "generating" : ""}`}
                    onClick={(e) => {
                      console.log('🛑 Stop button clicked!');
                      console.log('🛑 Current loading state:', loading);
                      console.log('🛑 handleStop function:', typeof handleStop);
                      e.preventDefault();
                      e.stopPropagation();

                      // Call handleStop immediately
                      try {
                        console.log('🛑 About to call handleStop...');
                        handleStop();
                        console.log('🛑 handleStop called successfully!');
                      } catch (error) {
                        console.error('🛑 Error calling handleStop:', error);
                      }
                    }}
                    title="Stop generation"
                  >
                    <FiStopCircle />
                  </button>
                )}
              </div>

              {showAiSuggestions && !loading && aiSuggestions.length > 0 && (
                <div className="ai-suggestions-inline ai-suggestions-dynamic">
                  <div className="ai-suggestions-label">
                    <FiCpu className="ai-icon" />
                    <span>AI Suggestions:</span>
                    {suggestionLoading && <span className="loading-dot">●</span>}
                  </div>
                  <div className="ai-suggestions-buttons">
                    {aiSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="ai-suggestion-pill ai-suggestion-button"
                        onClick={() => {
                          onAiSuggestionClick(suggestion);
                        }}
                      >
                        <span className="ai-badge">AI</span>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Integration Pills Container */}
              <div className="integration-pills-container">
                <button
                  type="button"
                  className="integration-pill figma-pill"
                  onClick={() => {
                    console.log('🔗 Figma pill clicked on landing page!');
                    setIsFigmaModalOpen(true);
                  }}
                  title="Connect with Figma - Import designs or export wireframes"
                >
                  <FiFigma className="pill-icon" />
                  <span>Figma Integration</span>
                </button>

                <button
                  type="button"
                  className="integration-pill image-pill"
                  onClick={toggleImageUpload}
                  title="Upload UI image to analyze"
                >
                  <FiImage className="pill-icon" />
                  <span>Upload Image</span>
                </button>
              </div>

              {/* AI Disclaimer */}
              <div className="ai-disclaimer">
                <p>Designetica uses AI. Check for mistakes.</p>
              </div>

              {/* Recent and Favorites Section */}
              <div className="recent-favorites-section">
                <div className="section-tabs github-style">
                  <button
                    className={`tab-btn github-tab ${activeTab === 'recent' ? 'active' : ''}`}
                    onClick={() => setActiveTab('recent')}
                  >
                    <svg className="tab-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"></path>
                    </svg>
                    Recent
                  </button>
                  <button
                    className={`tab-btn github-tab ${activeTab === 'saved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('saved')}
                  >
                    <svg className="tab-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"></path>
                    </svg>
                    Saved
                  </button>
                </div>
                <div className="projects-container github-container" ref={projectsContainerRef}>
                  {activeTab === 'recent' ? (
                    recents.length > 0 ? (
                      recents.map((recent) => (
                        <div key={recent.id} className="project-item github-item" onClick={() => handleOpenWireframe(recent)}>
                          <div className="project-icon">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"></path>
                            </svg>
                          </div>
                          <div className="project-details">
                            <div className="project-name">{recent.name}</div>
                            <div className="project-meta">{recent.description || `Created ${new Date(recent.createdAt).toLocaleDateString()}`}</div>
                          </div>
                          <div className="project-actions" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="action-btn star-btn"
                              aria-label="Save this"
                              title="Save this"
                              onClick={() => handleSaveRecentWireframe(recent.name, recent.description || `Created ${new Date(recent.createdAt).toLocaleDateString()}`, recent.htmlContent)}
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"></path>
                              </svg>
                            </button>
                            <button
                              className="action-btn delete-btn"
                              aria-label="Delete recent"
                              onClick={() => handleDeleteRecent(recent.id)}
                            >
                              <FiTrash size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <div className="empty-state-content">
                          <svg className="empty-icon" width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"></path>
                          </svg>
                          <p className="empty-message">No recent projects</p>
                          <p className="empty-description">Start creating wireframes to see your recent work here</p>
                        </div>
                      </div>
                    )
                  ) : (
                    savedWireframes.length > 0 ? (
                      savedWireframes.map((saved) => (
                        <div key={saved.id} className="project-item github-item" onClick={() => handleOpenWireframe(saved)}>
                          <div className="project-icon saved">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"></path>
                            </svg>
                          </div>
                          <div className="project-details">
                            <div className="project-name">{saved.name}</div>
                            {saved.description && (
                              <div className="project-description">{saved.description}</div>
                            )}
                            <div className="project-meta">{`Saved ${new Date(saved.createdAt).toLocaleDateString()}`}</div>
                          </div>
                          <div className="project-actions" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="action-btn delete-btn"
                              aria-label="Delete saved wireframe"
                              onClick={() => handleDeleteSaved(saved.id)}
                            >
                              <FiTrash size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <div className="empty-state-content">
                          <svg className="empty-icon" width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"></path>
                          </svg>
                          <p className="empty-message">No saved wireframes</p>
                          <p className="empty-description">Click the save button in the editor to save your wireframes</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Image Upload Modal - Unified Component */}
          <ImageUploadModal
            isOpen={showImageUpload}
            onClose={() => setShowImageUpload(false)}
            onImageUpload={handleImageUploadWithModalClose}
            onAnalyzeImage={handleAnalyzeImageWithModalClose}
            isAnalyzing={isAnalyzingImage}
            demoMode={false} // No demo mode in landing page
          />

        </div>
      </div>

      {/* Enhanced Figma Integration Modal */}
      <FigmaIntegrationModal
        isOpen={isFigmaModalOpen}
        onClose={() => setIsFigmaModalOpen(false)}
        onImport={handleFigmaImport}
        onExport={handleFigmaExport}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={deleteModal.onConfirm}
        itemName={deleteModal.itemName}
        itemType={deleteModal.itemType}
      />

      <ColorThemeSelector />
      <Footer />
    </div>
  );
};

export default LandingPage;
