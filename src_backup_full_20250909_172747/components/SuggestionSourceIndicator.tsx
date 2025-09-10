import React from "react";

interface SuggestionSourceIndicatorProps {
  isAI: boolean;
  isLoading: boolean;
}

const SuggestionSourceIndicator: React.FC<SuggestionSourceIndicatorProps> = ({
  isAI,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <span className="suggestion-source-indicator loading">
        <span className="loading-dots">...</span>
      </span>
    );
  }

  return (
    <span className={`suggestion-source-indicator ${isAI ? "ai" : "local"}`}>
      {isAI ? "AI" : "AI"}
    </span>
  );
};

export default SuggestionSourceIndicator;
