import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./SplitLayout.css";
import SuggestionSourceIndicator from "./SuggestionSourceIndicator";
import LoadingOverlay from "./LoadingOverlay";
import StaticWireframe from "./StaticWireframe";
import EnhancedMessage from "./EnhancedMessage";
import ComponentPreview from "./ComponentPreview";
import AddPagesModal from './AddPagesModal';
import SaveWireframeModal from './SaveWireframeModal';
import ImageUploadModal from './ImageUploadModal';

import {
  FiSend,
  FiLoader,
  FiStopCircle,
  FiCpu,
  FiChevronLeft,
  FiChevronRight,
  FiImage,
} from 'react-icons/fi';

interface SplitLayoutProps {
  description: string;
  setDescription: (desc: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  loadingStage?: string;
  fallback?: boolean;
  processingTime?: number;
  handleStop: () => void;
  showAiSuggestions: boolean;
  aiSuggestions: string[];
  suggestionLoading: boolean;
  isAiSourced?: boolean;
  setShowAiSuggestions: (show: boolean) => void;
  onGenerateAiSuggestions?: (input: string) => void;
  error: string | null;
  htmlWireframe: string;
  setHtmlWireframe: (html: string) => void;
  reactComponent?: string;
  setReactComponent?: (component: string) => void;
  designTheme: string;
  colorScheme: string;
  onAiSuggestionClick: (suggestion: string) => void;
  forceUpdateKey?: number;
}

const SplitLayoutSimple: React.FC<SplitLayoutProps> = ({
  description,
  setDescription,
  handleSubmit,
  loading,
  loadingStage,
  fallback,
  processingTime,
  handleStop,
  showAiSuggestions,
  aiSuggestions,
  suggestionLoading,
  isAiSourced = false,
  setShowAiSuggestions,
  onGenerateAiSuggestions,
  error,
  htmlWireframe,
  setHtmlWireframe,
  reactComponent,
  setReactComponent,
  onAiSuggestionClick,
  designTheme,
  colorScheme,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const initialMessageAddedRef = useRef(false);
  const debounceTimerRef = useRef<number | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);

  // Conversation history state
  const [conversationHistory, setConversationHistory] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>>([]);

  // Validation state for chat input
  const [chatValidationError, setChatValidationError] = useState<string | null>(null);

  // Modal state variables
  const [isAddPagesModalOpen, setIsAddPagesModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState(false);
  const [isDemoModeEnabled, setIsDemoModeEnabled] = useState(true); // Demo mode toggle

  // Image upload modal handler
  const openImageUploadModal = useCallback(() => {
    setIsImageUploadModalOpen(true);
  }, []);

  // Function to validate chat input - check if it's only numbers
  const validateChatInput = (input: string): boolean => {
    const trimmedInput = input.trim();
    const onlyNumbersRegex = /^[\d\s.,]+$/;

    if (onlyNumbersRegex.test(trimmedInput) && trimmedInput.length > 0) {
      setChatValidationError("Please provide a descriptive text, not just numbers. For example: 'contact form with name and email fields' instead of just '2'.");
      return false;
    }

    setChatValidationError(null);
    return true;
  };

  // Clear AI suggestions when SplitLayout loads
  useEffect(() => {
    console.log('🧹 SplitLayout mounted - clearing AI suggestions');
    setShowAiSuggestions(false);
  }, [setShowAiSuggestions]);

  // Keyboard shortcut for demo mode toggle (Ctrl+Shift+D or Cmd+Shift+D)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        setIsDemoModeEnabled(prev => {
          const newMode = !prev;
          console.log(`🎭 Demo mode ${newMode ? 'enabled' : 'disabled'}`);
          // Show a temporary notification
          const notification = document.createElement('div');
          notification.innerHTML = `<div style="
            position: fixed; 
            top: 20px; 
            right: 20px; 
            background: ${newMode ? '#0078d4' : '#6c757d'}; 
            color: white; 
            padding: 12px 16px; 
            border-radius: 4px; 
            z-index: 9999; 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          ">
            🎭 Demo Mode ${newMode ? 'Enabled' : 'Disabled'}
          </div>`;
          document.body.appendChild(notification);
          setTimeout(() => document.body.removeChild(notification), 2000);
          return newMode;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced AI suggestion trigger on typing
  useEffect(() => {
    if (!onGenerateAiSuggestions) return;

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    if (description.length > 0) {
      const trimmedInput = description.trim();
      const onlyNumbersRegex = /^[\d\s.,]+$/;

      if (!onlyNumbersRegex.test(trimmedInput)) {
        const delay = description.length <= 3 ? 100 : 200;
        debounceTimerRef.current = window.setTimeout(() => {
          onGenerateAiSuggestions(description);
        }, delay);
      }
    }

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [description, onGenerateAiSuggestions, setShowAiSuggestions]);

  // Add message to conversation
  const addMessage = useCallback((type: 'user' | 'ai', content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setConversationHistory(prev => [...prev, newMessage]);
  }, []);

  // Toggle left panel collapse
  const handleToggleLeftPanel = useCallback(() => {
    setIsLeftPanelCollapsed(prev => !prev);
  }, []);

  // Direct AI generation
  const enhancedHandleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Direct AI generation called!', { description: description.trim(), loading });

    if (!validateChatInput(description)) {
      return;
    }

    if (description.trim() && !loading) {
      if (initialMessageAddedRef.current || conversationHistory.length > 0) {
        addMessage('user', description);
        addMessage('ai', '✨ Generating wireframe...');
      }

      handleSubmit(e);
    }
  }, [description, loading, conversationHistory.length, addMessage, validateChatInput, handleSubmit]);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  // Auto-scroll when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory, loading]);

  // Focus the textarea on component mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Handle wireframe completion
  useEffect(() => {
    if (htmlWireframe && !loading && conversationHistory.length > 0) {
      const lastMessage = conversationHistory[conversationHistory.length - 1];
      if (lastMessage && lastMessage.type === 'user') {
        addMessage('ai', '✅ Wireframe created successfully! Check the preview on the right.');
      }
    }
  }, [htmlWireframe, loading, conversationHistory, addMessage]);

  // Handle initial description from main page
  useEffect(() => {
    if (!initialMessageAddedRef.current && description && description.trim()) {
      addMessage('user', description);
      setDescription('');
      initialMessageAddedRef.current = true;
    }
  }, [description, addMessage, setDescription]);

  return (
    <div className={`split-layout ${isLeftPanelCollapsed ? 'left-panel-collapsed' : ''}`}>
      {/* Demo Mode Indicator */}
      {isDemoModeEnabled && (
        <div
          className="demo-mode-indicator"
          onClick={() => setIsDemoModeEnabled(false)}
          title="Demo mode is active. Click to disable or press Ctrl+Shift+D"
        >
          🎭 Demo Mode
        </div>
      )}

      {/* Panel Toggle Button */}
      <button
        className="panel-toggle-btn"
        onClick={handleToggleLeftPanel}
        title={isLeftPanelCollapsed ? 'Expand panel' : 'Collapse panel'}
      >
        {isLeftPanelCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
      </button>

      {/* Left: Chat Interface */}
      <div className={`left-pane ${isLeftPanelCollapsed ? 'collapsed' : ''}`}>
        {/* Chat Messages Area */}
        <div className="chat-messages" ref={chatMessagesRef}>
          {conversationHistory.length === 0 && !loading && (
            <EnhancedMessage
              message={{
                id: 'welcome',
                type: 'ai',
                content: '👋 Hello! I\'m your AI wireframe assistant. Describe what you\'d like to create and I\'ll generate a wireframe for you.',
                timestamp: new Date(),
                status: 'sent'
              }}
            />
          )}

          {/* Conversation History */}
          {conversationHistory.map((message) => (
            <EnhancedMessage
              key={message.id}
              message={message}
            />
          ))}

          {/* Loading message */}
          {loading && (
            <EnhancedMessage
              message={{
                id: 'loading',
                type: 'ai',
                content: 'Creating your wireframe...',
                timestamp: new Date(),
                status: 'sending'
              }}
            />
          )}
        </div>

        {/* Chat Input */}
        <div className="chat-input-container">
          {error && <div className="error error-margin">{error}</div>}
          {chatValidationError && <div className="input-info-alert">{chatValidationError}</div>}

          <form onSubmit={enhancedHandleSubmit} className="chat-form">
            <div className="chat-input-wrapper">
              <textarea
                ref={textareaRef}
                value={description}
                onChange={(e) => {
                  const value = e.target.value;
                  setDescription(value);

                  if (value.trim()) {
                    const trimmedInput = value.trim();
                    const onlyNumbersRegex = /^[\d\s.,]+$/;

                    if (!onlyNumbersRegex.test(trimmedInput)) {
                      setChatValidationError(null);
                    }
                  } else {
                    setChatValidationError(null);
                  }

                  if (value.length <= 2) {
                    setShowAiSuggestions(false);
                  } else {
                    const trimmedInput = value.trim();
                    const onlyNumbersRegex = /^[\d\s.,]+$/;
                    if (onlyNumbersRegex.test(trimmedInput)) {
                      setShowAiSuggestions(false);
                    }
                  }
                }}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onClick={() => {
                  if (description.length > 2) {
                    const trimmedInput = description.trim();
                    const onlyNumbersRegex = /^[\d\s.,]+$/;

                    if (!onlyNumbersRegex.test(trimmedInput)) {
                      if (onGenerateAiSuggestions) {
                        onGenerateAiSuggestions(description);
                      }
                      setShowAiSuggestions(true);
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    enhancedHandleSubmit(e);
                  }
                }}
                placeholder="Describe your wireframe idea..."
                className="chat-input"
                rows={3}
              />

              <button
                type="submit"
                disabled={loading || !description.trim()}
                className="chat-send-btn"
              >
                {loading ? (
                  <FiLoader className="loading-spinner" />
                ) : (
                  <FiSend />
                )}
              </button>
            </div>

            {/* AI Suggestions */}
            {showAiSuggestions && (aiSuggestions.length > 0 || (suggestionLoading && isInputFocused)) && (
              <div className="ai-suggestions-integrated">
                <div className="ai-suggestions-label">
                  <FiCpu className="ai-icon" />
                  <span>AI Suggestions:</span>
                  {suggestionLoading && <span className="loading-dot">●</span>}
                </div>
                <div className="ai-suggestions-panel" aria-label="AI suggestions">
                  {aiSuggestions.length > 0 ? (
                    <div className="ai-suggestions-buttons">
                      {aiSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="ai-suggestion-pill ai-suggestion-button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDescription(suggestion);
                            onAiSuggestionClick(suggestion);
                          }}
                        >
                          <span className="ai-badge">AI</span>
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="ai-suggestions-placeholder">
                      <div className="skeleton-pill" />
                      <div className="skeleton-pill" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Right: Wireframe Display */}
      <div className={`right-pane ${isLeftPanelCollapsed ? 'expanded' : ''}`}>
        {htmlWireframe ? (
          <div className="wireframe-panel">
            <div className="wireframe-container">
              <div className="wireframe-content">
                {reactComponent ? (
                  <div className="react-component-preview">
                    <ComponentPreview
                      componentCode={reactComponent}
                      componentName="GeneratedComponent"
                    />
                  </div>
                ) : (
                  <StaticWireframe
                    html={htmlWireframe}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="ai-assistant-container">
            <h1 className="ai-assistant-title">AI Wireframe Assistant</h1>

            <div className="complexity-section">
              <h3 className="complexity-title">Choose complexity level</h3>
              <div className="complexity-options">
                <label className="complexity-option selected">
                  <input
                    type="radio"
                    name="complexity"
                    value="simple"
                    defaultChecked
                    className="complexity-radio"
                  />
                  <div className="complexity-label">Simple</div>
                  <p className="complexity-description">
                    Basic components and layouts. Perfect for quick prototypes and simple interfaces.
                  </p>
                </label>
                <label className="complexity-option">
                  <input
                    type="radio"
                    name="complexity"
                    value="detailed"
                    className="complexity-radio"
                  />
                  <div className="complexity-label">Detailed</div>
                  <p className="complexity-description">
                    Rich interactions and complex layouts. Great for production-ready designs.
                  </p>
                </label>
              </div>
            </div>

            <div className="ai-assistant-input-container">
              <textarea
                ref={textareaRef}
                value={description}
                onChange={(e) => {
                  const value = e.target.value;
                  setDescription(value);

                  if (value.length <= 2) {
                    setShowAiSuggestions(false);
                  }
                }}
                onClick={() => {
                  if (description.length > 2) {
                    if (onGenerateAiSuggestions) {
                      onGenerateAiSuggestions(description);
                    }
                    setShowAiSuggestions(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (description.trim() && !loading) {
                      enhancedHandleSubmit(e);
                    }
                  }
                }}
                placeholder="Describe your wireframe idea... (e.g., 'Create a modern login form with email, password, and social login options')"
                className="ai-assistant-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="ai-assistant-submit"
              onClick={(e) => {
                enhancedHandleSubmit(e);
              }}
            >
              {loading ? (
                <>
                  <FiLoader className="loading-spinner" />
                  Generating...
                </>
              ) : (
                <>
                  <FiSend />
                  Create Wireframe
                </>
              )}
            </button>

            {/* Image Upload Button */}
            <button
              type="button"
              className="ai-assistant-submit secondary-action"
              onClick={openImageUploadModal}
              title="Upload an image to generate wireframe from existing UI"
            >
              <FiImage />
              Upload Image
            </button>

            {loading && (
              <button
                type="button"
                className="ai-assistant-submit stop-generating"
                onClick={handleStop}
              >
                <FiStopCircle />
                Stop Generation
              </button>
            )}

            {showAiSuggestions && aiSuggestions.length > 0 && (
              <div className="ai-suggestions-inline">
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDescription(suggestion);
                        onAiSuggestionClick(suggestion);
                      }}
                    >
                      <FiCpu /> {suggestion}
                      <SuggestionSourceIndicator
                        isAI={isAiSourced}
                        isLoading={suggestionLoading}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <LoadingOverlay
              isVisible={loading}
              message={loadingStage || (loading ? "Creating your wireframe..." : "")}
            />
          </div>
        )}

        {/* Modal Components */}
        {isAddPagesModalOpen && (
          <AddPagesModal
            isOpen={isAddPagesModalOpen}
            onClose={() => setIsAddPagesModalOpen(false)}
            existingPages={[]}
            onAddPages={(pages) => {
              console.log('Pages added:', pages);
              setIsAddPagesModalOpen(false);
            }}
          />
        )}

        {isSaveModalOpen && (
          <SaveWireframeModal
            isOpen={isSaveModalOpen}
            onClose={() => setIsSaveModalOpen(false)}
            currentHtml={htmlWireframe}
            currentCss=""
            designTheme="modern"
            colorScheme="light"
            onSave={(wireframe, options) => {
              console.log('Wireframe saved:', wireframe, options);
              setIsSaveModalOpen(false);
            }}
          />
        )}

        {isImageUploadModalOpen && (
          <ImageUploadModal
            isOpen={isImageUploadModalOpen}
            onClose={() => setIsImageUploadModalOpen(false)}
            onImageUpload={(file) => {
              console.log('Image uploaded:', file);
              setIsImageUploadModalOpen(false);
            }}
            onAnalyzeImage={(imageUrl, fileName) => {
              console.log('Image analyzed:', imageUrl, fileName);
              setIsImageUploadModalOpen(false);
            }}
            demoMode={isDemoModeEnabled} // Use state variable for demo mode
          />
        )}
      </div>
    </div>
  );
};

export default SplitLayoutSimple;
