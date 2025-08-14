import React, { useRef, useEffect, useState } from "react";
import "./LandingPage.css";
import Footer from './Footer';
import ImageUploadModal from './ImageUploadModal';
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
  onDemoGenerate?: (imagePath: string, description: string) => void;
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
  onDemoGenerate,
}) => {
  // Create ref for textarea autofocus
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // State for image upload modal
  const [showImageUpload, setShowImageUpload] = useState(false);

  // State for validation error
  const [validationError, setValidationError] = useState<string | null>(null);

  // Modal states
  const [isFigmaModalOpen, setIsFigmaModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [githubStatus, setGithubStatus] = useState<{ connected: boolean; login?: string; error?: string }>({ connected: false });

  // Recent/Favorites tab state
  const [activeTab, setActiveTab] = useState<'recent' | 'favorites'>('recent');

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

  // Figma Integration handlers
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

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-content">
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
                <div className="projects-container github-container">
                  <div className="project-item github-item">
                    <div className="project-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path>
                      </svg>
                    </div>
                    <div className="project-details">
                      <div className="project-name">Azure Certification Dashboard</div>
                      <div className="project-meta">Last updated 3 hours ago</div>
                    </div>
                    <div className="project-actions">
                      <button className="action-btn star-btn" aria-label="Star">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                        </svg>
                      </button>
                      <button className="action-btn menu-btn" aria-label="More options">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="project-item github-item">
                    <div className="project-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path>
                      </svg>
                    </div>
                    <div className="project-details">
                      <div className="project-name">Microsoft 365 Admin Portal</div>
                      <div className="project-meta">Last updated last week</div>
                    </div>
                    <div className="project-actions">
                      <button className="action-btn star-btn" aria-label="Star">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                        </svg>
                      </button>
                      <button className="action-btn menu-btn" aria-label="More options">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Image Upload Zone */}
          {showImageUpload && onImageUpload && onAnalyzeImage && onDemoGenerate && (
            <ImageUploadModal
              isOpen={showImageUpload}
              onClose={() => setShowImageUpload(false)}
              onImageUpload={onImageUpload}
              onAnalyzeImage={onAnalyzeImage}
              onDemoGenerate={onDemoGenerate}
              isAnalyzing={isAnalyzingImage}
            />
          )}

        </div>
      </div>

      {/* Figma Integration Modal */}
      <FigmaIntegrationModal
        isOpen={isFigmaModalOpen}
        onClose={() => setIsFigmaModalOpen(false)}
        onImport={handleFigmaImport}
        onExport={handleFigmaExport}
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

      <Footer />
    </div>
  );
};

export default LandingPage;
