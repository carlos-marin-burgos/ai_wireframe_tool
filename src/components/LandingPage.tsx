import React, { useRef, useEffect, useState } from "react";
import "./LandingPage.css";
import Footer from './Footer';
import FixedNavbar from './FixedNavbar';
import ImageUploadZone from './ImageUploadZone';
import ImageUploadModal from './ImageUploadModal';
import FigmaIntegrationModal from './FigmaIntegrationModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
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
} from "react-icons/fi";

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
}

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
}) => {
  // Create ref for textarea autofocus
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // State for image upload modal
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Modal states
  const [isFigmaModalOpen, setIsFigmaModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  // Focus the textarea on component mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Toggle image upload modal
  const toggleImageUpload = () => {
    setShowImageUpload(prev => !prev);
  };

  return (
    <div className="landing-page">
      {/* Fixed Navbar */}
      <FixedNavbar />
      
      <div className="landing-container">
        <div className="landing-content">
          <h1 className="main-heading">What will you design today?</h1>
          <p className="main-subtitle">
            Sketch your vision, ship your wireframe - Designetica AI does the
            heavy lifting.
          </p>

          {error && <div className="error error-center">{error}</div>}
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

          <form onSubmit={onSubmit} className="main-form">
            <div className="input-container">
              {/* Text Input with Upload Button */}
              <div className="textarea-container">
                <textarea
                  ref={textareaRef}
                  value={description}
                  onChange={onDescriptionChange}
                  onClick={() => {
                    // Clear textarea content when clicked
                    onDescriptionChange({ target: { value: "" } } as React.ChangeEvent<HTMLTextAreaElement>);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (description.trim() && !loading) {
                        onSubmit(e);
                      }
                    }
                  }}
                  placeholder="How can Designetica help you today?"
                  rows={4}
                  required
                  className="app-textarea main-input"
                />

                {/* Image upload button */}
                <button
                  type="button"
                  onClick={toggleImageUpload}
                  className="image-upload-btn"
                  title="Upload UI image to analyze"
                >
                  <FiImage />
                </button>

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

              {/* Help text with example pills */}
              <div className="help-text">
                <div className="help-examples">
                  <div className="help-examples-label">
                    <span>💡 Try these examples:</span>
                  </div>
                  <div className="help-examples-pills">
                    <button
                      type="button"
                      className="help-example-pill"
                      onClick={(e) => {
                        const exampleText = "Microsoft Learn landing page";
                        console.log('🔵 Pill 1 clicked:', exampleText);
                        // Update the textarea value immediately
                        onDescriptionChange({ target: { value: exampleText } } as React.ChangeEvent<HTMLTextAreaElement>);
                        // Submit directly with the description, bypassing state timing issues
                        setTimeout(() => {
                          console.log('🔵 Submitting Pill 1 with direct description:', exampleText);
                          onSubmit(e as any, exampleText);
                        }, 100);
                      }}
                    >
                      Microsoft Learn landing page
                    </button>
                    <button
                      type="button"
                      className="help-example-pill"
                      onClick={(e) => {
                        const exampleText = "Microsoft Learning Plan";
                        console.log('🟢 Pill 2 clicked:', exampleText);
                        onDescriptionChange({ target: { value: exampleText } } as React.ChangeEvent<HTMLTextAreaElement>);
                        // Submit directly with the description, bypassing state timing issues
                        setTimeout(() => {
                          console.log('🟢 Submitting Pill 2 with direct description:', exampleText);
                          onSubmit(e as any, exampleText);
                        }, 100);
                      }}
                    >
                      Microsoft Learning Plan
                    </button>
                    <button
                      type="button"
                      className="help-example-pill"
                      onClick={(e) => {
                        const exampleText = "Microsoft Learn Doc page";
                        console.log('🟡 Pill 3 clicked:', exampleText);
                        onDescriptionChange({ target: { value: exampleText } } as React.ChangeEvent<HTMLTextAreaElement>);
                        // Submit directly with the description, bypassing state timing issues
                        setTimeout(() => {
                          console.log('🟡 Submitting Pill 3 with direct description:', exampleText);
                          onSubmit(e as any, exampleText);
                        }, 100);
                      }}
                    >
                      Microsoft Learn Doc page
                    </button>
                  </div>
                </div>
              </div>

              {showAiSuggestions && aiSuggestions.length > 0 && (
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
            </div>
          </form>

          {/* Image Upload Zone */}
          {showImageUpload && onImageUpload && onAnalyzeImage && (
            <div className="image-upload-section">
              <ImageUploadZone
                onImageUpload={(file) => {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const imageDataUrl = e.target?.result as string;
                    onImageUpload(file);
                    if (onAnalyzeImage) {
                      onAnalyzeImage(imageDataUrl, file.name);
                    }
                  };
                  reader.readAsDataURL(file);
                }}
                onAnalyzeImage={onAnalyzeImage}
                isAnalyzing={isAnalyzingImage}
              />
            </div>
          )}

        </div>
      </div>

      {/* Modals */}
      <ImageUploadModal
        isOpen={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onImageUpload={onImageUpload || (() => {})}
        onAnalyzeImage={onAnalyzeImage || (() => {})}
        isAnalyzing={isAnalyzingImage}
      />

      <FigmaIntegrationModal
        isOpen={isFigmaModalOpen}
        onClose={() => setIsFigmaModalOpen(false)}
        onImport={onFigmaImport || (() => {})}
        onExport={onFigmaExport || (() => {})}
      />

      <DeleteConfirmationModal
        isOpen={false}
        onClose={() => {}}
        onConfirm={() => {}}
        itemName=""
        itemType="recent"
      />

      <Footer />
    </div>
  );
};

export default LandingPage;
