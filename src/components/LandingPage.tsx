import React, { useRef, useEffect, useState } from "react";
import "./LandingPage.css";
import Footer from './Footer';
import ImageUploadZone from './ImageUploadZone';

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
}

import {
  FiFolder,
  FiLoader,
  FiSend,
  FiStopCircle,
  FiCpu,
  FiImage,
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
}) => {
  // Create ref for textarea autofocus
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // State for image upload modal
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Debounce timer for AI suggestions
  const debounceTimerRef = useRef<number | null>(null);

  // Focus the textarea on component mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Debounced AI suggestion trigger
  useEffect(() => {
    if (onGenerateAiSuggestions && description.length > 0) {
      // Clear existing timer
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }

      // Set new timer with 300ms delay
      debounceTimerRef.current = window.setTimeout(() => {
        onGenerateAiSuggestions(description);
      }, 300);
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

  return (
    <div className="landing-page">
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
      <Footer />
    </div>
  );
};

export default LandingPage;
