import React, { useRef, useEffect, useState, useCallback } from "react";
import { FiX } from 'react-icons/fi';
import "./LandingPage.css";
import Footer from './Footer';
import FluentImageUploadModal from './FluentImageUploadModal';
import { figmaApi, FigmaFile as ApiFigmaFile, FigmaFrame } from '../services/figmaApi';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import FigmaIntegrationModal from './FigmaIntegrationModal';

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
  onAnalyzeImage?: (imageUrl: string, fileName: string) => void;
  isAnalyzingImage?: boolean;
  onFigmaImport?: (html: string, fileName: string) => void;
  onFigmaExport?: (format: 'figma-file' | 'figma-components') => void;
  onOpenWireframe?: (html: string, description: string) => void;
  onFigmaModalOpen?: () => void;
}

import {
  FiPlus,
  FiFolder,
  FiLoader,
  FiSend,
  FiStopCircle,
  FiCpu,
  FiImage,
  FiLink,
  FiFigma,
  FiZap,
  FiGithub,
  FiTrash,
  FiUpload,
  FiDownload,
  FiRefreshCw,
  FiCheck,
  FiAlertCircle,
  FiFileText,
  FiLayers,
  FiSettings,
  FiExternalLink,
} from "react-icons/fi";

const LandingPage: React.FC<LandingPageProps> = ({
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
  onFigmaModalOpen,
}) => {
  // Create ref for textarea autofocus
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Ref for projects container to handle scroll indicators
  const projectsContainerRef = useRef<HTMLDivElement>(null);

  // State for image upload modal
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState(false);

  // State for validation error
  const [validationError, setValidationError] = useState<string | null>(null);

  // Modal states
  const [isFigmaModalOpen, setIsFigmaModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [githubStatus, setGithubStatus] = useState<{ connected: boolean; login?: string; error?: string }>({ connected: false });

  // Recent/Favorites tab state
  const [activeTab, setActiveTab] = useState<'recent' | 'favorites'>('recent');
  const [favorites, setFavorites] = useState<any[]>([]);
  const [recents, setRecents] = useState<any[]>([]);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemName: string;
    itemType: 'favorite' | 'recent';
    onConfirm: () => void;
  }>({
    isOpen: false,
    itemName: '',
    itemType: 'favorite',
    onConfirm: () => { }
  });

  // Load favorites and recents from localStorage
  useEffect(() => {
    const loadFavorites = () => {
      const savedFavorites = JSON.parse(localStorage.getItem('designetica_favorites') || '[]');
      setFavorites(savedFavorites);
    };

    const loadRecents = () => {
      const savedRecents = JSON.parse(localStorage.getItem('designetica_recents') || '[]');
      setRecents(savedRecents);
    };

    loadFavorites();
    loadRecents();

    // Listen for favorites and recents updates
    const handleStorageChange = () => {
      loadFavorites();
      loadRecents();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Delete favorite function
  const handleDeleteFavorite = (favoriteId: string) => {
    const favoriteToDelete = favorites.find(fav => fav.id === favoriteId);
    const favoriteName = favoriteToDelete?.name || 'this favorite';

    setDeleteModal({
      isOpen: true,
      itemName: favoriteName,
      itemType: 'favorite',
      onConfirm: () => {
        const updatedFavorites = favorites.filter(fav => fav.id !== favoriteId);
        setFavorites(updatedFavorites);
        localStorage.setItem('designetica_favorites', JSON.stringify(updatedFavorites));
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
  };  // Add to favorites from recent section
  const handleAddRecentToFavorites = (projectName: string, projectMeta: string, htmlContent?: string) => {
    const newFavorite = {
      id: Date.now().toString(),
      name: projectName,
      htmlContent: htmlContent || '',
      type: 'recent',
      createdAt: new Date().toISOString()
    };

    const currentFavorites = JSON.parse(localStorage.getItem('designetica_favorites') || '[]');
    const updatedFavorites = [...currentFavorites, newFavorite];

    setFavorites(updatedFavorites);
    localStorage.setItem('designetica_favorites', JSON.stringify(updatedFavorites));

    alert(`"${projectName}" has been added to your favorites!`);
  };

  // Add to recents utility function (can be called from parent)
  const addToRecents = useCallback((name: string, description: string, htmlContent?: string) => {
    const newRecent = {
      id: Date.now().toString(),
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

  const startGitHubOAuth = async () => {
    setGithubStatus(s => ({ connected: s.connected, login: s.login }));
    try {
      const { startGitHubAuth } = await import('../services/githubAuth');
      const result = await startGitHubAuth();
      if (result.status === 'success') {
        setGithubStatus({ connected: true, login: result.login || 'unknown' });
        if (result.token) sessionStorage.setItem('github_token', result.token);
      } else {
        setGithubStatus({ connected: false, error: result.error || 'Authentication failed' });
      }
    } catch (e: any) {
      setGithubStatus({ connected: false, error: e.message });
    }
  };

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
  }, [favorites, recents, activeTab]);

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
    setIsImageUploadModalOpen(prev => !prev);
  };

  // Open image upload modal (for consistency with SplitLayout)
  const openImageUploadModal = () => {
    setIsImageUploadModalOpen(true);
  };

  // Simple Figma Integration handlers - Enhanced modal handles the rest
  const handleFigmaImport = (html: string, fileName: string) => {
    if (onFigmaImport) {
      onFigmaImport(html, fileName);
    }
    setIsFigmaModalOpen(false);
  };

  const handleFigmaExport = (format: 'figma-file' | 'figma-components') => {
    if (onFigmaExport) {
      onFigmaExport(format);
    }
    setIsFigmaModalOpen(false);
  };

  // Image processing handlers - delegate to parent but close modal
  const handleImageFile = (file: File) => {
    if (onImageUpload) {
      onImageUpload(file);
    }
    // Don't close modal immediately in LandingPage - let parent handle it
  };

  const handleAnalyzeImage = (imageUrl: string, fileName: string) => {
    if (onAnalyzeImage) {
      onAnalyzeImage(imageUrl, fileName);
    }
    setIsImageUploadModalOpen(false);
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
                <p>Generate AI wireframes directly in Figma. Perfect for designers who want to stay in their workflow.</p>
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
                  title={loading ? "Generating..." : "Generate Wireframe"}
                >
                  {loading ? (
                    <FiLoader className="loading-spinner" />
                  ) : (
                    <FiSend className="send-icon" />
                  )}
                </button>
                {loading && (
                  <button
                    type="button"
                    className={`stop-btn ${loading ? "generating" : ""}`}
                    onClick={handleStop}
                    title="Stop wireframe generation"
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

                <button
                  type="button"
                  className="integration-pill github-pill"
                  onClick={() => {
                    console.log('🔗 GitHub pill clicked on landing page!');
                    setIsGitHubModalOpen(true);
                  }}
                  title="Connect to GitHub repository"
                >
                  <FiGithub className="pill-icon" />
                  <span>Connect GitHub</span>
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
                    className={`tab-btn github-tab ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                  >
                    <svg className="tab-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                    </svg>
                    Favorites
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
                              aria-label="Favorite this"
                              title="Favorite this"
                              onClick={() => handleAddRecentToFavorites(recent.name, recent.description || `Created ${new Date(recent.createdAt).toLocaleDateString()}`, recent.htmlContent)}
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
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
                    favorites.length > 0 ? (
                      favorites.map((favorite) => (
                        <div key={favorite.id} className="project-item github-item" onClick={() => handleOpenWireframe(favorite)}>
                          <div className="project-icon favorite">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                            </svg>
                          </div>
                          <div className="project-details">
                            <div className="project-name">{favorite.name}</div>
                            <div className="project-meta">{`Added ${new Date(favorite.createdAt).toLocaleDateString()}`}</div>
                          </div>
                          <div className="project-actions" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="action-btn delete-btn"
                              aria-label="Delete favorite"
                              onClick={() => handleDeleteFavorite(favorite.id)}
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
                            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                          </svg>
                          <p className="empty-message">No favorites</p>
                          <p className="empty-description">Star projects to add them to your favorites</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Image Upload Zone */}
          {/* Inline image upload zone would go here if showImageUpload is true */}
          {/* Note: Image upload is now handled by FluentImageUploadModal below */}

        </div>
      </div>

      {/* Enhanced Figma Integration Modal */}
      <FigmaIntegrationModal
        isOpen={isFigmaModalOpen}
        onClose={() => setIsFigmaModalOpen(false)}
        onImport={handleFigmaImport}
        onExport={handleFigmaExport}
      />

      {/* Image Upload Modal */}
      <FluentImageUploadModal
        isOpen={isImageUploadModalOpen}
        onClose={() => setIsImageUploadModalOpen(false)}
        onImageUpload={handleImageFile}
        onAnalyzeImage={handleAnalyzeImage}
        isAnalyzing={isAnalyzingImage || false}
      />

      {/* GitHub Connect Modal */}
      {isGitHubModalOpen && (
        <div className="modal-overlay" onClick={() => setIsGitHubModalOpen(false)}>
          <div className="modal-content github-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🚀 Connect to GitHub</h2>
              <button
                className="modal-close-btn"
                onClick={() => setIsGitHubModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="github-benefits">
                <div className="benefit-item">
                  <FiZap className="benefit-icon" />
                  <div>
                    <h4>Import Repositories</h4>
                    <p>Import existing projects and wireframes from your GitHub repositories</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <FiFolder className="benefit-icon" />
                  <div>
                    <h4>Save Wireframes</h4>
                    <p>Automatically save your wireframes to GitHub for version control</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <FiLink className="benefit-icon" />
                  <div>
                    <h4>Team Collaboration</h4>
                    <p>Share wireframes with your team through GitHub integration</p>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-primary github-connect-btn" type="button" onClick={() => { if (!githubStatus.connected) startGitHubOAuth(); }}>
                  <FiGithub />
                  {githubStatus.connected ? `Connected: ${githubStatus.login}` : 'Connect with GitHub'}
                </button>
                {githubStatus.error && (
                  <div className="error github-error">
                    {githubStatus.error}
                  </div>
                )}
                <button
                  className="btn-secondary"
                  onClick={() => setIsGitHubModalOpen(false)}
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={deleteModal.onConfirm}
        itemName={deleteModal.itemName}
        itemType={deleteModal.itemType}
      />

      <Footer />
    </div>
  );
};

export default LandingPage;
