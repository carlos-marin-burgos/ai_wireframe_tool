import React, { useEffect, useRef, useState, useCallback } from "react";
import "./SplitLayout.css";
import SuggestionSourceIndicator from "./SuggestionSourceIndicator";
import LoadingOverlay from "./LoadingOverlay";
import CompactToolbar from "./CompactToolbar";
import AddPagesModal from "./AddPagesModal";
import SaveWireframeModal, { SavedWireframe } from "./SaveWireframeModal";
import FigmaIntegrationModal from "./FigmaIntegrationModal";
import ComponentLibraryModal from "./ComponentLibraryModal";
import LinkableWireframe from "./LinkableWireframe";
import EnhancedMessage from "./EnhancedMessage";
import ImageUploadZone from "./ImageUploadZone";
import DemoImageSelector from "./DemoImageSelector";
import PageNavigation from "./PageNavigation";
import HtmlCodeViewer from "./HtmlCodeViewer";
import PresentationMode from "./PresentationMode";

import { generateShareUrl } from "../utils/powerpointExport";
import {
  FiSend,
  FiLoader,
  FiStopCircle,
  FiCpu,
  FiImage,
  FiLink,
} from 'react-icons/fi';
import { TbBoxModel2 } from 'react-icons/tb'; // Fluent UI style icon for component library

interface SplitLayoutProps {
  description: string;
  setDescription: (desc: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  loadingStage?: string; // Enhanced loading stage message
  fallback?: boolean; // Whether using fallback mode
  processingTime?: number; // Processing time in ms
  handleStop: () => void;
  showAiSuggestions: boolean;
  aiSuggestions: string[];
  suggestionLoading: boolean;
  isAiSourced?: boolean; // Whether suggestions come from AI or local patterns
  setShowAiSuggestions: (show: boolean) => void;
  onGenerateAiSuggestions?: (input: string) => void;
  error: string | null;
  savedWireframesCount: number;
  onLoadClick: () => void;
  htmlWireframe: string;
  setHtmlWireframe: (html: string) => void;
  // New props for content header
  onSave: () => void;
  onMultiStep: () => void;
  // Design system props (Microsoft Learn theme only)
  designTheme: string;
  setDesignTheme?: (theme: string) => void; // Optional since we only have Microsoft Learn
  colorScheme: string;
  // This prop is needed by parent but not used here
  setColorScheme?: (scheme: string) => void;
  // Auto-generate function
  onDesignChange?: (theme?: string, scheme?: string) => void;
  // AI suggestion click handler - Required to ensure proper wireframe generation
  onAiSuggestionClick: (suggestion: string) => void;
  // Force update key for wireframe refresh
  forceUpdateKey?: number;
  // Back to landing function
  onBackToLanding?: () => void;
  // Component addition handler
  onAddComponent?: (component: any) => void;
  // Page content generation handler
  onGeneratePageContent?: (description: string, pageType: string) => Promise<string>;
}

const SplitLayout: React.FC<SplitLayoutProps> = ({
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
  isAiSourced = false, // Whether suggestions are from AI or local patterns
  setShowAiSuggestions,
  onGenerateAiSuggestions,
  error,
  htmlWireframe,
  setHtmlWireframe,
  onAiSuggestionClick,
  designTheme,
  colorScheme,
  onAddComponent,
  onGeneratePageContent,
}) => {
  // Create ref for textarea autofocus
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  // Ref to track if initial message has been added
  const initialMessageAddedRef = useRef(false);
  // Debounce timer for AI suggestions on typing
  const debounceTimerRef = useRef<number | null>(null);
  // Track input focus to stabilize suggestions container
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Conversation history state
  const [conversationHistory, setConversationHistory] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>>([]);

  // Add Pages Modal state
  const [isAddPagesModalOpen, setIsAddPagesModalOpen] = useState(false);
  const [wireframePages, setWireframePages] = useState<Array<{
    id: string;
    name: string;
    description: string;
    type: 'page' | 'modal' | 'component';
    htmlContent?: string; // Store page-specific HTML content
    links?: { [elementId: string]: string }; // Store element-to-page links
  }>>([]);

  // Current page navigation state
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [pageContents, setPageContents] = useState<{ [pageId: string]: string }>({});

  // Figma Integration Modal state
  const [isFigmaModalOpen, setIsFigmaModalOpen] = useState(false);

  // Image Upload and Analysis state
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  // Enhanced Save System state
  const [isEnhancedSaveModalOpen, setIsEnhancedSaveModalOpen] = useState(false);
  const [savedWireframes, setSavedWireframes] = useState<SavedWireframe[]>([]);
  const [isUpdatingWireframe, setIsUpdatingWireframe] = useState(false);
  const [wireframeToUpdate, setWireframeToUpdate] = useState<SavedWireframe | undefined>();

  // Component Library Modal removed - using direct AI generation instead

  // Enhanced chat state
  const [messageReactions, setMessageReactions] = useState<Record<string, Array<{
    emoji: string;
    count: number;
    userReacted: boolean;
  }>>>({});

  // HTML Code Viewer state
  const [isHtmlCodeViewerOpen, setIsHtmlCodeViewerOpen] = useState(false);

  // Presentation Mode state
  const [isPresentationModeOpen, setIsPresentationModeOpen] = useState(false);

  // Component Library Modal state
  const [isComponentLibraryOpen, setIsComponentLibraryOpen] = useState(false);

  // Clear AI suggestions when SplitLayout loads
  useEffect(() => {
    console.log('🧹 SplitLayout mounted - clearing AI suggestions');
    setShowAiSuggestions(false);
  }, [setShowAiSuggestions]); // Include dependency for proper function reference

  // Debounced AI suggestion trigger on typing (mirror LandingPage behavior)
  useEffect(() => {
    if (!onGenerateAiSuggestions) return;

    // Clear existing timer
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    // Only react when user has started typing
    if (description.length > 0) {
      const delay = description.length <= 3 ? 100 : 200;
      debounceTimerRef.current = window.setTimeout(() => {
        onGenerateAiSuggestions(description);
      }, delay);
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

  // Auto-create "First Page" page when wireframe content is first generated
  useEffect(() => {
    console.log('🔥 useEffect for First Page:', {
      hasWireframe: !!htmlWireframe,
      wireframePagesLength: wireframePages.length
    });

    // If we have wireframe content but no pages, create a "First Page" page
    if (htmlWireframe && wireframePages.length === 0) {
      console.log('🔥 Creating First Page automatically');
      const homePage = {
        id: 'home-page',
        name: 'First Page',
        description: 'First Page',
        type: 'page' as const
      };

      setWireframePages([homePage]);
      setCurrentPageId(homePage.id);

      // Store the current wireframe content for the First Page
      setPageContents(prev => ({
        ...prev,
        [homePage.id]: htmlWireframe
      }));
    }
  }, [htmlWireframe, wireframePages.length]);

  // Update current page content when htmlWireframe changes
  useEffect(() => {
    if (currentPageId && htmlWireframe) {
      console.log('🔄 Updating current page content:', {
        currentPageId,
        htmlWireframeLength: htmlWireframe.length,
        previousContent: pageContents[currentPageId]?.length || 0
      });

      setPageContents(prev => ({
        ...prev,
        [currentPageId]: htmlWireframe
      }));
    }
  }, [htmlWireframe, currentPageId]);

  // Handlers for wireframe toolbar
  const handleAddPagesToWireframe = useCallback((pages: Array<{
    id: string;
    name: string;
    description: string;
    type: 'page' | 'modal' | 'component';
    htmlContent?: string; // AI-generated content for the page
  }>) => {
    console.log('🔥 handleAddPagesToWireframe called with pages:', pages);
    console.log('🔥 Current wireframePages:', wireframePages);

    // Find which pages are actually new
    const existingIds = new Set(wireframePages.map(p => p.id));
    const newPages = pages.filter(p => !existingIds.has(p.id));

    console.log('🔥 New pages found:', newPages);
    console.log('🔥 New pages with content:', newPages.map(p => ({
      id: p.id,
      name: p.name,
      hasContent: !!(p.htmlContent && p.htmlContent.trim()),
      contentLength: p.htmlContent?.length || 0
    })));
    console.log('🔥 Setting wireframePages to:', pages);

    setWireframePages(pages);

    // Switch to the first NEW page when pages are added
    if (newPages.length > 0) {
      const firstNewPage = newPages[0];
      console.log('🔥 Switching to first new page:', firstNewPage);

      // Save current wireframe content if we have one
      if (currentPageId && htmlWireframe) {
        setPageContents(prev => ({
          ...prev,
          [currentPageId]: htmlWireframe
        }));
      } else if (htmlWireframe && !currentPageId) {
        // If this is the first time adding pages, save current content to first new page
        setPageContents(prev => ({
          ...prev,
          [firstNewPage.id]: htmlWireframe
        }));
      }

      // Store AI-generated content for all new pages
      const newPageContents: { [pageId: string]: string } = {};
      newPages.forEach(page => {
        if (page.htmlContent && page.htmlContent.trim()) {
          console.log(`🔥 Storing AI-generated content for page ${page.id}:`, page.htmlContent.substring(0, 100) + '...');
          newPageContents[page.id] = page.htmlContent;
        }
      });

      // Update page contents with AI-generated content
      if (Object.keys(newPageContents).length > 0) {
        setPageContents(prev => ({
          ...prev,
          ...newPageContents
        }));
      }

      // Switch to the first new page
      console.log('🔥 Setting currentPageId to:', firstNewPage.id);
      setCurrentPageId(firstNewPage.id);

      // Load the AI-generated content for the first new page immediately
      if (firstNewPage.htmlContent && firstNewPage.htmlContent.trim()) {
        console.log('🔥 Loading AI-generated content for first new page');
        setHtmlWireframe(firstNewPage.htmlContent);
        if (newPages.length === 1) {
          addMessage('ai', `🤖 Added "${firstNewPage.name}" page with AI-generated content! You can switch between pages using the navigation above.`);
        } else {
          addMessage('ai', `🤖 Added "${firstNewPage.name}" page with AI-generated content! Plus ${newPages.length - 1} other new page(s). You can switch between pages using the navigation above.`);
        }
      } else {
        if (newPages.length === 1) {
          addMessage('ai', `📄 Added "${firstNewPage.name}" page and switched to it. You can now click on buttons and links in your wireframe to set up navigation between pages!`);
        } else {
          addMessage('ai', `📄 Added ${newPages.length} new pages and switched to "${firstNewPage.name}". You can now click on buttons and links in your wireframe to set up navigation between pages!`);
        }
      }
    }

    console.log('🔥 Closing modal');
    setIsAddPagesModalOpen(false);
  }, [currentPageId, htmlWireframe, addMessage]);

  // Page navigation handlers
  const handlePageSwitch = useCallback(async (pageId: string) => {
    console.log('🔥 handlePageSwitch called with pageId:', pageId);

    // Prevent unnecessary switches
    if (currentPageId === pageId) {
      console.log('🔥 Already on this page, skipping switch');
      return;
    }

    // Save current page content before switching
    if (currentPageId) {
      const currentContent = pageContents[currentPageId] || htmlWireframe;
      console.log('🔥 Saving current page content for:', currentPageId);
      setPageContents(prev => ({
        ...prev,
        [currentPageId]: currentContent
      }));
    }

    // Switch to new page
    setCurrentPageId(pageId);

    // Load the content for the new page
    const newPageContent = pageContents[pageId];
    const currentPage = wireframePages.find(p => p.id === pageId);

    if (newPageContent) {
      console.log('🔥 Loading existing content for page:', pageId);
      setHtmlWireframe(newPageContent);

      // Inform user about page switch
      if (currentPage) {
        addMessage('ai', `📄 Switched to "${currentPage.name}" page. Content loaded! You can click on buttons and links to set up navigation between pages.`);
      }
    } else if (currentPage && currentPage.htmlContent && currentPage.htmlContent.trim()) {
      // Check if the page has AI-generated content stored in the page object itself
      console.log('🔥 Loading AI-generated content from page object for:', pageId);
      setHtmlWireframe(currentPage.htmlContent);

      // Also store it in pageContents for future reference
      setPageContents(prev => ({
        ...prev,
        [pageId]: currentPage.htmlContent!
      }));

      addMessage('ai', `📄 Switched to "${currentPage.name}" page with AI-generated content! You can click on buttons and links to set up navigation between pages.`);
    } else {
      // For new empty pages, provide a simple starter template and suggest content generation
      console.log('🔥 New empty page detected:', pageId);

      if (currentPage) {
        // Create a simple placeholder wireframe for the new page
        const placeholderHtml = `
          <div style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: 'Segoe UI', sans-serif; background: #ffffff; min-height: 100vh;">
            <div style="background: #E8E6DF; padding: 60px 40px; border-radius: 12px; margin: 20px 0; text-align: center; border: 1px solid #e1dfdd;">
              <h1 style="color: #323130; margin: 0 0 16px 0; font-size: 28px; font-weight: 600;">📄 ${currentPage.name}</h1>
              <p style="color: #605e5c; margin: 0 0 24px 0; font-size: 16px;">
                This is a new ${currentPage.type || 'page'}. Click the buttons below or ask me to generate content for this page.
              </p>
              <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <button style="background: #0078d4; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-weight: 600; transition: background-color 0.2s ease;">
                  Generate Content
                </button>
                <button style="background: #f3f2f1; color: #323130; border: 1px solid #e1dfdd; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-weight: 600; transition: background-color 0.2s ease;">
                  Copy from First Page
                </button>
              </div>
            </div>
          </div>
        `;

        setHtmlWireframe(placeholderHtml);

        // Save the placeholder content
        setPageContents(prev => ({
          ...prev,
          [pageId]: placeholderHtml
        }));

        addMessage('ai', `📄 Switched to "${currentPage.name}" page. This is a new ${currentPage.type || 'page'} ready for content! You can ask me to "generate content for ${currentPage.name}" or "create a ${currentPage.type} layout" and I'll customize it for you.`);
      }
    }
  }, [currentPageId, htmlWireframe, pageContents, wireframePages, addMessage]);

  const handleAddPages = useCallback(() => {
    setIsAddPagesModalOpen(true);
  }, []);

  // Enhanced chat handlers
  const handleMessageReact = useCallback((messageId: string, emoji: string) => {
    setMessageReactions(prev => {
      const reactions = prev[messageId] || [];
      const existingReaction = reactions.find(r => r.emoji === emoji);

      if (existingReaction) {
        return {
          ...prev,
          [messageId]: reactions.map(r =>
            r.emoji === emoji
              ? { ...r, count: r.userReacted ? r.count - 1 : r.count + 1, userReacted: !r.userReacted }
              : r
          ).filter(r => r.count > 0)
        };
      } else {
        return {
          ...prev,
          [messageId]: [...reactions, { emoji, count: 1, userReacted: true }]
        };
      }
    });
  }, []);

  // Figma Integration handlers
  const handleFigmaIntegration = useCallback(() => {
    setIsFigmaModalOpen(true);
  }, []);

  const handleFigmaImport = useCallback((html: string, fileName: string) => {
    // Handle Figma file import
    console.log('Importing Figma file:', fileName);

    // Set the imported HTML as the current wireframe
    if (setHtmlWireframe) {
      setHtmlWireframe(html);
    }

    addMessage('ai', `✅ Successfully imported "${fileName}" from Figma! The wireframe has been converted and is ready for editing.`);
    setIsFigmaModalOpen(false);
  }, [setHtmlWireframe, addMessage]);

  // HTML Import handler
  const handleImportHtml = useCallback(() => {
    // Create file input element for HTML import
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html,.htm';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const htmlContent = e.target?.result as string;
          if (htmlContent && setHtmlWireframe) {
            setHtmlWireframe(htmlContent);
            addMessage('ai', `✅ Successfully imported "${file.name}"! The HTML wireframe is ready for editing.`);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [setHtmlWireframe, addMessage]);

  const handleFigmaExport = useCallback((format: 'figma-file' | 'figma-components') => {
    // Handle Figma export
    console.log('Exporting to Figma as:', format);
    addMessage('ai', `Wireframe exported to Figma as ${format} successfully! You can now access it in your Figma workspace.`);
    setIsFigmaModalOpen(false);
  }, [addMessage]);

  // HTML Code viewer handler
  const handleViewHtmlCode = useCallback(() => {
    setIsHtmlCodeViewerOpen(true);
  }, []);

  // Image Upload and Analysis handlers
  const handleImageUpload = useCallback((imageDataUrl: string) => {
    // Add image message to chat
    addMessage('user', `[Image uploaded for analysis]`);

    // Add AI response about starting analysis
    setTimeout(() => {
      addMessage('ai', '🔍 Analyzing your uploaded image for UI components. Please wait while I detect buttons, inputs, and other elements...');
      // In a real implementation, you would use imageDataUrl here
      console.log('Image data URL:', imageDataUrl);
    }, 500);
  }, [addMessage]);

  const toggleImageUpload = useCallback(() => {
    setShowImageUpload(prev => !prev);
    // Close demo selector when opening image upload
    if (!showImageUpload) {
      setShowDemoSelector(false);
    }
  }, [showImageUpload]);

  const toggleDemoSelector = useCallback(() => {
    setShowDemoSelector(prev => !prev);
    // Close image upload when opening demo selector
    if (!showDemoSelector) {
      setShowImageUpload(false);
    }
  }, [showDemoSelector]);

  const handleDemoGenerate = useCallback((imagePath: string, description: string) => {
    setDescription(description);
    setShowDemoSelector(false);

    // Add demo message to chat
    addMessage('user', `🎯 Demo: ${description}`);

    // Generate wireframe immediately
    setTimeout(() => {
      handleSubmit({ preventDefault: () => { } } as React.FormEvent);
    }, 100);
  }, [setDescription, addMessage, handleSubmit]);

  // Enhanced Save System handlers
  const handleOpenEnhancedSave = useCallback(() => {
    setIsEnhancedSaveModalOpen(true);
    setIsUpdatingWireframe(false);
    setWireframeToUpdate(undefined);
  }, []);

  const handleSaveWireframe = useCallback(async (
    wireframeData: Omit<SavedWireframe, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date().toISOString();

    if (isUpdatingWireframe && wireframeToUpdate) {
      // Update existing wireframe
      const updatedWireframe: SavedWireframe = {
        ...wireframeToUpdate,
        ...wireframeData,
        updatedAt: now
      };

      setSavedWireframes(prev =>
        prev.map(w => w.id === wireframeToUpdate.id ? updatedWireframe : w)
      );

      addMessage('ai', `✅ Wireframe "${wireframeData.name}" updated successfully!`);
    } else {
      // Save new wireframe
      const newWireframe: SavedWireframe = {
        ...wireframeData,
        id: `wireframe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now
      };

      setSavedWireframes(prev => [...prev, newWireframe]);
      addMessage('ai', `💾 Wireframe "${wireframeData.name}" saved successfully! You can access it from the library.`);
    }

    // In a real app, you would also save to backend/localStorage
    localStorage.setItem('designetica_saved_wireframes', JSON.stringify(savedWireframes));

    setIsEnhancedSaveModalOpen(false);
  }, [isUpdatingWireframe, wireframeToUpdate, savedWireframes, addMessage]);

  const handleOpenLibrary = useCallback(() => {
    setIsComponentLibraryOpen(true);
  }, []);

  // Export handlers



  const handleShareUrl = useCallback(async () => {
    try {
      // Prepare wireframe data for sharing
      const wireframeData = {
        name: `Wireframe ${new Date().toLocaleDateString()}`,
        description: 'Generated wireframe design',
        pages: wireframePages.length > 0 ? wireframePages : [{
          id: 'main',
          name: 'Main Page',
          description: 'Main wireframe page',
          type: 'page' as const
        }],
        pageContents: wireframePages.length > 0 ? pageContents : {
          main: htmlWireframe || '<p>No content available</p>'
        }
      };

      const contentToShare = htmlWireframe || '<p>No wireframe content available</p>';
      const result = await generateShareUrl(contentToShare, wireframeData.name);

      if (result.success) {
        // Show success message with toast notification
        console.log('✅ Share URL generated:', result.shareUrl);
        console.log('Share URL copied to clipboard!');
      } else {
        console.error('Failed to generate share URL:', result.message);
      }
    } catch (error) {
      console.error('Share URL generation failed:', error);
    }
  }, [wireframePages, pageContents, htmlWireframe]);

  // Presentation Mode handler
  const handlePresentationMode = useCallback(() => {
    setIsPresentationModeOpen(true);
  }, []);

  // Load saved wireframes from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('designetica_saved_wireframes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedWireframes(parsed);
      } catch (error) {
        console.error('Failed to load saved wireframes:', error);
      }
    }
  }, []);

  // Override the original onSave prop with enhanced save
  const enhancedOnSave = useCallback(() => {
    handleOpenEnhancedSave();
  }, [handleOpenEnhancedSave]);

  // Direct AI generation with Microsoft Learn components - no modal
  const enhancedHandleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Direct AI generation called!', { description: description.trim(), loading });

    if (description.trim() && !loading) {
      // Close image upload zone when starting generation for cleaner UI
      if (showImageUpload) {
        setShowImageUpload(false);
      }

      // Direct AI approach: Skip modal, go straight to AI generation with Microsoft Learn components
      console.log('🤖 Direct AI approach: Calling handleSubmit for immediate AI generation');

      // Only add a message if it's coming from the form input (not initial description)
      // Check our ref to make sure this isn't the first message from landing page
      if (initialMessageAddedRef.current || conversationHistory.length > 0) {
        addMessage('user', description);
        addMessage('ai', '� Generating wireframe with Microsoft Learn components...');
      }

      // Call the original handleSubmit for direct AI generation
      handleSubmit(e);
    } else {
      console.log('❌ enhancedHandleSubmit: Conditions not met', {
        descriptionTrimmed: description.trim(),
        descriptionLength: description.trim().length,
        loading
      });
    }
  }, [description, loading, setDescription, conversationHistory.length, showImageUpload, setShowImageUpload, addMessage]);

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
      // Only add success message if the last message isn't already a success message
      const lastMessage = conversationHistory[conversationHistory.length - 1];
      if (lastMessage && lastMessage.type === 'user') {
        addMessage('ai', '✅ Wireframe created successfully! Check the preview on the right.');
      }
    }
  }, [htmlWireframe, loading, conversationHistory, addMessage]);

  // Handle initial description from main page
  useEffect(() => {
    // Only process when coming from landing page with a description and message hasn't been added yet
    if (!initialMessageAddedRef.current && description && description.trim()) {
      // Add to conversation
      addMessage('user', description);
      // Clear the description from the textarea since it's now in the chat bubble
      setDescription('');
      // Mark that initial message has been added to prevent duplicate messages
      initialMessageAddedRef.current = true;
    }
  }, [description, addMessage, setDescription]);

  return (
    <div className="split-layout">
      {/* Left: Chat Interface */}
      <div className="left-pane">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="chat-header-title-group">
              <h2 className="chat-header-title">Designetica AI</h2>
              <p className="chat-header-subtitle">AI-generated content may be incorrect</p>
            </div>
          </div>
        </div>
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

          {conversationHistory.map((message) => (
            <EnhancedMessage
              key={message.id}
              message={message}
              onReact={handleMessageReact}
              reactions={messageReactions[message.id] || []}
            />
          ))}

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

        {/* Simple Chat Input Area */}
        <div className="chat-input-container">
          {error && <div className="error error-margin">{error}</div>}

          <form onSubmit={enhancedHandleSubmit} className="chat-form">
            <div className="chat-input-wrapper">
              <textarea
                ref={textareaRef}
                value={description}
                onChange={(e) => {
                  const value = e.target.value;
                  setDescription(value);
                  // Hide suggestions if content becomes too short
                  if (value.length <= 2) {
                    setShowAiSuggestions(false);
                  }
                }}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onClick={() => {
                  // Generate AI suggestions when textarea is clicked
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
                    enhancedHandleSubmit(e);
                  }
                }}
                placeholder="Describe your wireframe idea..."
                className="chat-input"
                rows={3}
              />

              {/* Send button */}
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
          </form>

          {/* AI Suggestions: label outside a dedicated scrollable panel */}
          {showAiSuggestions && (aiSuggestions.length > 0 || (suggestionLoading && isInputFocused)) && (
            <div className="ai-suggestions-container">
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

        </div>
      </div>

      {/* Right: AI Assistant Interface */}
      <div className="right-pane">
        {(htmlWireframe || wireframePages.length > 0) ? (
          <div className="wireframe-panel">
            <CompactToolbar
              onImportHtml={handleImportHtml}
              onFigmaIntegration={handleFigmaIntegration}
              onSave={enhancedOnSave}
              onOpenLibrary={handleOpenLibrary}
              onViewHtmlCode={handleViewHtmlCode}
              onPresentationMode={handlePresentationMode}
              onShareUrl={handleShareUrl}
            />

            {/* Always show PageNavigation when we have a wireframe */}
            <PageNavigation
              pages={wireframePages}
              currentPageId={currentPageId}
              onPageSwitch={handlePageSwitch}
              onAddPage={handleAddPages}
            />
            <div className="wireframe-container">
              {/* Status bar removed for cleaner presentation */}
              <div className="wireframe-content">
                <LinkableWireframe
                  htmlContent={currentPageId ? (pageContents[currentPageId] || htmlWireframe) : htmlWireframe}
                  onUpdateHtml={(newHtml) => {
                    // Update the current page content
                    if (currentPageId) {
                      setPageContents(prev => ({
                        ...prev,
                        [currentPageId]: newHtml
                      }));
                    }
                    // Also update the main htmlWireframe if it's the first page or no current page
                    if (!currentPageId || wireframePages.length === 0) {
                      // You would call your main update function here
                      // For now, we'll just store it locally
                    }
                  }}
                  onNavigateToPage={handlePageSwitch}
                  availablePages={wireframePages}
                />
              </div>
            </div>
          </div>
        ) : (
          /* AI Assistant main interface */
          <div className="ai-assistant-container">
            <h1 className="ai-assistant-title">AI Wireframe Assistant</h1>

            {/* Complexity Level Selection */}
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

            {/* Main input area */}
            <div className="ai-assistant-input-container">
              <textarea
                ref={textareaRef}
                value={description}
                onChange={(e) => {
                  const value = e.target.value;
                  setDescription(value);

                  // Hide suggestions when content becomes too short
                  if (value.length <= 2) {
                    setShowAiSuggestions(false);
                  }
                }}
                onClick={() => {
                  // Generate AI suggestions when textarea is clicked
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

            {/* Submit button */}
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

            {/* Stop button when generating */}
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

            {/* AI Suggestions */}
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

            {/* Feature callout */}
            <div className="feature-callout">
              <div className="feature-callout-title">💡 Pro Tip</div>
              <p className="feature-callout-text">
                Be specific about your requirements. Mention components, layout, colors, and interactions for better results.
              </p>
            </div>

            {/* Loading overlay for AI processing */}
            <LoadingOverlay
              isVisible={loading}
              message={loadingStage || (loading ? "Creating your wireframe..." : "")}
            />
          </div>
        )}
      </div>

      {/* Add Pages Modal */}
      <AddPagesModal
        isOpen={isAddPagesModalOpen}
        onClose={() => setIsAddPagesModalOpen(false)}
        onAddPages={handleAddPagesToWireframe}
        existingPages={wireframePages.map(page => ({
          ...page,
          htmlContent: pageContents[page.id] || page.htmlContent || htmlWireframe
        }))}
        onGeneratePageContent={onGeneratePageContent}
      />

      {/* Figma Integration Modal */}
      {/* TODO: Re-enable when FigmaIntegrationModal is implemented
      <FigmaIntegrationModal
        isOpen={isFigmaModalOpen}
        onClose={() => setIsFigmaModalOpen(false)}
        onImport={handleFigmaImport}
        onExport={handleFigmaExport}
      />
      */}

      {/* Image Analysis Modal */}
      {/* TODO: Re-enable when ImageAnalysisModal is implemented
      {currentAnalysisImage && (
        <ImageAnalysisModal
          isOpen={isImageAnalysisModalOpen}
          onClose={() => setIsImageAnalysisModalOpen(false)}
          imageUrl={currentAnalysisImage}
          imageName="Uploaded Image"
          isAnalyzing={false}
          onGenerateWireframe={handleImageAnalysisComplete}
        />
      )}
      */}

      {/* Enhanced Save Modal */}
      <SaveWireframeModal
        isOpen={isEnhancedSaveModalOpen}
        onClose={() => setIsEnhancedSaveModalOpen(false)}
        onSave={handleSaveWireframe}
        currentHtml={htmlWireframe}
        currentCss="/* Generated CSS styles */"
        designTheme={designTheme}
        colorScheme={colorScheme}
        isUpdating={isUpdatingWireframe}
        existingWireframe={wireframeToUpdate}
      />

      {/* Figma Integration Modal */}
      <FigmaIntegrationModal
        isOpen={isFigmaModalOpen}
        onClose={() => setIsFigmaModalOpen(false)}
        onImport={handleFigmaImport}
        onExport={handleFigmaExport}
      />

      {/* Component Library Modal */}
      <ComponentLibraryModal
        isOpen={isComponentLibraryOpen}
        onClose={() => {
          console.log('🔄 Component library modal closing');
          setIsComponentLibraryOpen(false);
        }}
        onAddComponent={(component: any) => {
          console.log('✨ Component added:', component.name);
          if (onAddComponent) {
            onAddComponent(component);
          }
          addMessage('ai', `✨ Added ${component.name} to your wireframe!`);
        }}
        onGenerateWithAI={(description: string) => {
          console.log('🤖 AI generation requested for:', description);
          // Call the original handleSubmit to trigger AI generation
          const mockEvent = new Event('submit') as any;
          handleSubmit(mockEvent);
          addMessage('ai', '🤖 Generating wireframe with AI...');
        }}
        currentDescription={description}
      />

      {/* HTML Code Viewer */}
      <HtmlCodeViewer
        isOpen={isHtmlCodeViewerOpen}
        onClose={() => setIsHtmlCodeViewerOpen(false)}
        htmlContent={currentPageId ? (pageContents[currentPageId] || htmlWireframe) : htmlWireframe}
        title={currentPageId ?
          `HTML Code - ${wireframePages.find(p => p.id === currentPageId)?.name || 'Unknown Page'}` :
          'HTML Code - Main Wireframe'
        }
      />

      {/* Presentation Mode */}
      <PresentationMode
        isOpen={isPresentationModeOpen}
        onClose={() => setIsPresentationModeOpen(false)}
        wireframeName={`Wireframe ${new Date().toLocaleDateString()}`}
        wireframeDescription="Generated wireframe design"
        pages={wireframePages.length > 0 ? wireframePages.map(page => ({
          id: page.id,
          name: page.name,
          description: page.description,
          content: pageContents[page.id] || htmlWireframe || '<p>No content available</p>'
        })) : htmlWireframe ? [{
          id: 'main',
          name: 'Main Wireframe',
          description: 'Primary wireframe content',
          content: htmlWireframe
        }] : []}
      />

    </div>
  );
};

export default SplitLayout;
