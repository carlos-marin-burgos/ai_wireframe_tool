// Smart AI Context Panel Component
import React, { useState, useEffect } from "react";
import { aiEnhancer } from "./AIEnhancer";

interface SmartContextPanelProps {
  currentPrompt: string;
  onSuggestionClick: (suggestion: string) => void;
  isVisible: boolean;
}

export const SmartContextPanel: React.FC<SmartContextPanelProps> = ({
  currentPrompt,
  onSuggestionClick,
  isVisible,
}) => {
  const [contextualSuggestions, setContextualSuggestions] = useState<string[]>(
    []
  );
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);
  const [promptCategory, setPromptCategory] = useState<{
    category: string;
    confidence: number;
    suggestedEnhancements: string[];
  } | null>(null);

  useEffect(() => {
    if (currentPrompt.length > 2) {
      // Get smart suggestions based on current input
      const suggestions = aiEnhancer.getSmartSuggestions(currentPrompt);
      setSmartSuggestions(suggestions);

      // Categorize the prompt
      const category = aiEnhancer.categorizePrompt(currentPrompt);
      setPromptCategory(category);
    } else {
      setSmartSuggestions([]);
      setPromptCategory(null);
    }

    // Always get contextual suggestions
    const contextual = aiEnhancer.getContextualSuggestions();
    setContextualSuggestions(contextual);
  }, [currentPrompt]);

  if (!isVisible) return null;

  return (
    <div className="smart-context-panel">
      {/* AI Thinking Indicator */}
      {currentPrompt.length > 0 && (
        <div className="ai-thinking">
          <div className="thinking-dots">
            <div className="thinking-dot"></div>
            <div className="thinking-dot"></div>
            <div className="thinking-dot"></div>
          </div>
          <span>AI analyzing your request...</span>
        </div>
      )}

      {/* Context Awareness */}
      {promptCategory && promptCategory.confidence > 0.3 && (
        <div className="context-indicator">
          <div className="context-icon">🎯</div>
          <span>Detected: {promptCategory.category} component</span>
        </div>
      )}

      {/* Smart Completions */}
      {smartSuggestions.length > 0 && (
        <div className="smart-completions">
          <div className="section-header">
            <div className="enhancement-icon">💡</div>
            <span>Smart Completions</span>
          </div>
          <div className="suggestion-list">
            {smartSuggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-item"
                onClick={() => onSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Prompt Preview */}
      {currentPrompt.length > 10 && (
        <div className="prompt-enhancement">
          <div className="prompt-enhancement-label">
            <div className="enhancement-icon">✨</div>
            Enhanced Prompt
          </div>
          <div className="enhanced-prompt-preview">
            {aiEnhancer.enhancePrompt(currentPrompt)}
          </div>
        </div>
      )}

      {/* Related Suggestions */}
      {promptCategory && promptCategory.suggestedEnhancements.length > 0 && (
        <div className="related-suggestions">
          <div className="section-header">
            <div className="enhancement-icon">🔗</div>
            <span>Related Features</span>
          </div>
          <div className="suggestion-list">
            {promptCategory.suggestedEnhancements.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-item related"
                onClick={() => onSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contextual History */}
      {contextualSuggestions.length > 0 && (
        <div className="contextual-suggestions">
          <div className="section-header">
            <div className="enhancement-icon">🧠</div>
            <span>Based on Your Session</span>
          </div>
          <div className="suggestion-list">
            {contextualSuggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-item contextual"
                onClick={() => onSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartContextPanel;
