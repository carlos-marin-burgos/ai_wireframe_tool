import React, { useRef, useEffect, useState, useCallback } from "react";
import { FiX } from 'react-icons/fi';
import "./LandingPage.css";

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
  onGenerateAiSuggestions?: (input: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  error,
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
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Focus the textarea on component mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  }, [onSubmit]);

  return (
    <div className="landing-page">
      <div className="landing-page-container">
        <header className="hero-section">
          <h1 className="hero-title">AI Wireframe Generator</h1>
          <p className="hero-subtitle">
            Create beautiful wireframes with AI. Just describe what you want to build.
          </p>
        </header>

        <main className="input-section">
          {error && (
            <div className="error-message">
              <span>{error}</span>
              <button onClick={() => window.location.reload()}>
                <FiX />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="wireframe-form">
            <div className="input-container">
              <textarea
                ref={textareaRef}
                value={description}
                onChange={onDescriptionChange}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onClick={() => {
                  if (description.length > 2 && onGenerateAiSuggestions) {
                    onGenerateAiSuggestions(description);
                  }
                }}
                placeholder="Describe your wireframe idea... (e.g., 'Create a dashboard with navigation sidebar and chart widgets')"
                className="description-input"
                rows={4}
                disabled={loading}
              />
              
              <div className="button-group">
                {loading ? (
                  <button type="button" onClick={handleStop} className="stop-button">
                    Stop Generation
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!description.trim()}
                    className="generate-button"
                  >
                    Generate Wireframe
                  </button>
                )}
              </div>
            </div>

            {/* AI Suggestions */}
            {showAiSuggestions && (aiSuggestions.length > 0 || suggestionLoading) && (
              <div className="ai-suggestions-section">
                <h3>AI Suggestions</h3>
                {suggestionLoading ? (
                  <div className="suggestions-loading">
                    <div className="skeleton-suggestion"></div>
                    <div className="skeleton-suggestion"></div>
                    <div className="skeleton-suggestion"></div>
                  </div>
                ) : (
                  <div className="suggestions-grid">
                    {aiSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="suggestion-card"
                        onClick={() => onAiSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>
        </main>

        <footer className="landing-footer">
          <p>Powered by AI • Generate wireframes instantly</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
