import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./SplitLayout.css";
import SuggestionSourceIndicator from "./SuggestionSourceIndicator";
import LoadingOverlay from "./LoadingOverlay";
import AddPagesModal from "./AddPagesModal";
import FluentSaveWireframeModal, { SavedWireframe } from "./FluentSaveWireframeModal";
import FluentImageUploadModal from "./FluentImageUploadModal";
import FigmaIntegrationModal from "./FigmaIntegrationModal";
import DownloadModal from "./DownloadModal";
import DevPlaybooksLibrary from "./DevPlaybooksLibrary";
import FigmaComponentsLibrary from "./FigmaComponentsLibrary";
import EnhancedComponentLibrary from "./EnhancedComponentLibrary";
import SimpleDragWireframe from "./SimpleDragWireframe";
import EnhancedMessage from "./EnhancedMessage";
import ImageUploadZone from "./ImageUploadZone";
import PageNavigation from "./PageNavigation";
import HtmlCodeViewer from "./HtmlCodeViewer";
import PresentationMode from "./PresentationMode";
import ComponentPreview from "./ComponentPreview";

import { generateShareUrl } from "../utils/powerpointExport";
import { generateWireframeName } from "../utils/wireframeNaming";
import {
  FiSend,
  FiLoader,
  FiStopCircle,
  FiCpu,
  FiImage,
  FiLink,
  FiChevronLeft,
  FiChevronRight,
  FiCopy,
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
  // React component props
  reactComponent?: string;
  setReactComponent?: (component: string) => void;
  // New props for content header
  onSave: () => void;
  onEnhancedSave?: React.MutableRefObject<(() => void) | null>; // Enhanced save for TopNavbar
  onMultiStep: () => void;
  // Design system props (Microsoft theme only)
  designTheme: string;
  setDesignTheme?: (theme: string) => void; // Optional since we only have Microsoft theme
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
  // Figma export handler
  onFigmaExport?: (format: 'figma-file' | 'figma-components') => void;
  // Toolbar function references for header toolbar
  onFigmaIntegration?: React.MutableRefObject<(() => void) | null>;
  onComponentLibrary?: React.MutableRefObject<(() => void) | null>;
  onDevPlaybooks?: React.MutableRefObject<(() => void) | null>;
  onFigmaComponents?: React.MutableRefObject<(() => void) | null>;
  onViewHtmlCode?: React.MutableRefObject<(() => void) | null>;
  onDownloadWireframe?: React.MutableRefObject<(() => void) | null>;
  onPresentationMode?: React.MutableRefObject<(() => void) | null>;
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
  reactComponent,
  setReactComponent,
  onAiSuggestionClick,
  designTheme,
  colorScheme,
  onSave,
  onEnhancedSave,
  onAddComponent,
  onGeneratePageContent,
  onFigmaExport,
  onFigmaIntegration,
  onComponentLibrary,
  onDevPlaybooks,
  onFigmaComponents,
  onViewHtmlCode,
  onDownloadWireframe,
  onPresentationMode,
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

  // Enhanced Save System state
  const [isEnhancedSaveModalOpen, setIsEnhancedSaveModalOpen] = useState(false);
  const [savedWireframes, setSavedWireframes] = useState<SavedWireframe[]>([]);
  const [isUpdatingWireframe, setIsUpdatingWireframe] = useState(false);
  const [wireframeToUpdate, setWireframeToUpdate] = useState<SavedWireframe | undefined>();

  // Validation state for chat input
  const [chatValidationError, setChatValidationError] = useState<string | null>(null);

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
  const [isDevPlaybooksOpen, setIsDevPlaybooksOpen] = useState(false);
  const [isFigmaComponentsOpen, setIsFigmaComponentsOpen] = useState(false);

  // Download Modal state
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Image Upload Modal state
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Left panel collapse state
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);

  // Wireframe name state
  const [wireframeName, setWireframeName] = useState<string | null>(null);

  // Track if wireframe has been added to recents to avoid duplicates
  const [addedToRecents, setAddedToRecents] = useState<boolean>(false);

  // Function to validate chat input - check if it's only numbers
  const validateChatInput = (input: string): boolean => {
    const trimmedInput = input.trim();

    // Check if the input is only numbers (including spaces and basic punctuation)
    const onlyNumbersRegex = /^[\d\s.,]+$/;

    if (onlyNumbersRegex.test(trimmedInput) && trimmedInput.length > 0) {
      setChatValidationError("Please provide a descriptive text, not just numbers. For example: 'contact form with name and email fields' instead of just '2'.");
      return false;
    }

    // Clear validation error if input is valid
    setChatValidationError(null);
    return true;
  };

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
      // Don't generate suggestions for number-only inputs
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
            <div style="background: #E9ECEF; padding: 60px 40px; border-radius: 12px; margin: 20px 0; text-align: center; border: 1px solid #e1dfdd;">
              <h1 style="color: #3C4858; margin: 0 0 16px 0; font-size: 28px; font-weight: 600;">📄 ${currentPage.name}</h1>
              <p style="color: #68769C; margin: 0 0 24px 0; font-size: 16px;">
                This is a new ${currentPage.type || 'page'}. Click the buttons below or ask me to generate content for this page.
              </p>
              <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <button style="background: #8E9AAF; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-weight: 600; transition: background-color 0.2s ease;">
                  Generate Content
                </button>
                <button style="background: #f3f2f1; color: #3C4858; border: 1px solid #e1dfdd; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-weight: 600; transition: background-color 0.2s ease;">
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

  const handleAddToFavorites = useCallback(() => {
    if (!currentPageId) return;

    const currentPage = wireframePages.find(p => p.id === currentPageId);
    if (!currentPage) return;

    // Get current content for the page
    const currentContent = pageContents[currentPageId] || htmlWireframe;

    // Create favorite item
    const favoriteItem = {
      id: `favorite-${Date.now()}`,
      name: currentPage.name,
      htmlContent: currentContent,
      type: currentPage.type,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingFavorites = JSON.parse(localStorage.getItem('designetica_favorites') || '[]');
    existingFavorites.push(favoriteItem);
    localStorage.setItem('designetica_favorites', JSON.stringify(existingFavorites));

    // Show confirmation message
    addMessage('ai', `⭐ Added "${currentPage.name}" to favorites! You can find it in the favorites tab on the landing page.`);
  }, [currentPageId, wireframePages, pageContents, htmlWireframe, addMessage]);

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
    console.log('🎨 SplitLayout: handleFigmaIntegration - Opening enhanced Figma Integration Modal');
    // Enable the enhanced FigmaIntegrationModal
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

  // Download wireframe handler
  const handleDownloadWireframe = useCallback(() => {
    setIsDownloadModalOpen(true);
  }, []);

  const handleDownloadModalDownload = useCallback((format: 'html' | 'json') => {
    // Call the parent's figma export handler with the appropriate format
    // This reuses the existing export functionality
    const figmaFormat = format === 'html' ? 'figma-file' : 'figma-components';
    onFigmaExport?.(figmaFormat);
    addMessage('ai', `🎉 ${format.toUpperCase()} download started! Check your browser's Downloads folder.`);
  }, [onFigmaExport, addMessage]);

  // HTML import handler for HtmlCodeViewer
  const handleHtmlImport = useCallback((htmlContent: string) => {
    if (htmlContent && setHtmlWireframe) {
      setHtmlWireframe(htmlContent);
      addMessage('ai', `✅ Successfully imported HTML content! The wireframe is ready for editing.`);
    }
  }, [setHtmlWireframe, addMessage]);

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

  const handleImageFile = useCallback((file: File) => {
    setIsProcessingImage(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      handleImageUpload(imageDataUrl);
      setIsImageUploadModalOpen(false);
      setIsProcessingImage(false);
    };
    reader.readAsDataURL(file);
  }, [handleImageUpload]);

  const handleAnalyzeImage = useCallback((imageUrl: string, fileName: string) => {
    setIsProcessingImage(true);
    addMessage('user', `[Image uploaded: ${fileName}]`);
    setTimeout(() => {
      addMessage('ai', '🔍 Analyzing your uploaded image for UI components. Please wait while I detect buttons, inputs, and other elements...');
      setIsProcessingImage(false);
    }, 500);
  }, [addMessage]);

  const toggleImageUpload = useCallback(() => {
    setShowImageUpload(prev => !prev);
  }, []);

  const openImageUploadModal = useCallback(() => {
    setIsImageUploadModalOpen(true);
  }, []);

  // Enhanced Save System handlers
  const handleOpenEnhancedSave = useCallback(() => {
    setIsEnhancedSaveModalOpen(true);
    setIsUpdatingWireframe(false);
    setWireframeToUpdate(undefined);
  }, []);

  // Generate intelligent wireframe name based on content
  const generateAndSetWireframeName = useCallback(() => {
    const currentContent = currentPageId && pageContents[currentPageId]
      ? pageContents[currentPageId]
      : htmlWireframe;

    if (currentContent) {
      const intelligentName = generateWireframeName(currentContent);
      setWireframeName(intelligentName);
      console.log('🧠 Generated intelligent wireframe name:', intelligentName);

      // Automatically add to recents when wireframe is first generated (only once)
      if (!addedToRecents) {
        const addToRecents = (window as any).addToRecents;
        if (addToRecents && typeof addToRecents === 'function') {
          addToRecents(
            intelligentName,
            "Auto-generated wireframe",
            currentContent
          );
          console.log(`✅ Auto-added "${intelligentName}" to recents`);
          setAddedToRecents(true); // Mark as added to avoid duplicates

          // Also dispatch a custom event to ensure UI updates
          window.dispatchEvent(new CustomEvent('wireframeSaved', {
            detail: {
              name: intelligentName,
              description: "Auto-generated wireframe",
              html: currentContent
            }
          }));
        } else {
          console.warn("addToRecents function not available for auto-add");
        }
      }
    }
  }, [currentPageId, pageContents, htmlWireframe, addedToRecents]);

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

      // Add saved wireframe to recents - moved outside of try-catch for better reliability
      const addToRecents = (window as any).addToRecents;
      if (addToRecents && typeof addToRecents === 'function') {
        addToRecents(wireframeData.name, wireframeData.description || "Saved wireframe", wireframeData.html);
        console.log(`✅ Added "${wireframeData.name}" to recents`);

        // Also dispatch a custom event to ensure UI updates
        window.dispatchEvent(new CustomEvent('wireframeSaved', {
          detail: {
            name: wireframeData.name,
            description: wireframeData.description || "Saved wireframe",
            html: wireframeData.html
          }
        }));
      } else {
        console.warn("addToRecents function not available on window object");
      }
    }

    setIsEnhancedSaveModalOpen(false);
  }, [isUpdatingWireframe, wireframeToUpdate, savedWireframes, addMessage]);

  // Update localStorage whenever savedWireframes changes
  useEffect(() => {
    localStorage.setItem('designetica_saved_wireframes', JSON.stringify(savedWireframes));
  }, [savedWireframes]);

  // Generate intelligent wireframe name when content changes
  useEffect(() => {
    if (htmlWireframe && htmlWireframe.trim() && !wireframeName) {
      // Only generate name for the first time when content is created
      generateAndSetWireframeName();
    }
  }, [htmlWireframe, wireframeName, generateAndSetWireframeName]);

  // Regenerate name when switching pages or when significant content changes
  useEffect(() => {
    if ((htmlWireframe || (currentPageId && pageContents[currentPageId])) && wireframeName) {
      // Regenerate name when page content changes significantly
      const currentContent = currentPageId && pageContents[currentPageId]
        ? pageContents[currentPageId]
        : htmlWireframe;

      if (currentContent && currentContent.length > 500) { // Only for substantial content
        const newName = generateWireframeName(currentContent);
        if (newName !== wireframeName) {
          setWireframeName(newName);
          console.log('🔄 Updated wireframe name to:', newName);
        }
      }
    }
  }, [currentPageId, pageContents, htmlWireframe, wireframeName]);

  // Reset addedToRecents flag when starting a new wireframe session
  useEffect(() => {
    if (!htmlWireframe || htmlWireframe.trim() === '') {
      setAddedToRecents(false);
      setWireframeName(null);
    }
  }, [htmlWireframe]);

  const handleOpenLibrary = useCallback(() => {
    console.log('🎨 Opening Component Library Modal');
    setIsComponentLibraryOpen(true);
  }, []);

  const handleOpenDevPlaybooks = useCallback(() => {
    console.log('📚 Opening Dev Playbooks Library');
    setIsDevPlaybooksOpen(true);
  }, []);

  const handleOpenFigmaComponents = useCallback(() => {
    console.log('🎨 Opening Figma Components Library');
    setIsFigmaComponentsOpen(true);
  }, []);

  // Export handlers



  // Presentation Mode handler
  const handlePresentationMode = useCallback(() => {
    setIsPresentationModeOpen(true);
  }, []);

  // Set toolbar function refs for header toolbar access
  // Set up the Figma Integration ref
  useEffect(() => {
    if (onFigmaIntegration) {
      onFigmaIntegration.current = handleFigmaIntegration;
    }
  }, [onFigmaIntegration, handleFigmaIntegration]);

  useEffect(() => {
    if (onComponentLibrary) {
      onComponentLibrary.current = handleOpenLibrary;
    }
  }, [onComponentLibrary, handleOpenLibrary]);

  useEffect(() => {
    if (onDevPlaybooks) {
      onDevPlaybooks.current = handleOpenDevPlaybooks;
    }
  }, [onDevPlaybooks, handleOpenDevPlaybooks]);

  useEffect(() => {
    if (onFigmaComponents) {
      onFigmaComponents.current = handleOpenFigmaComponents;
    }
  }, [onFigmaComponents, handleOpenFigmaComponents]);

  useEffect(() => {
    if (onViewHtmlCode) {
      onViewHtmlCode.current = handleViewHtmlCode;
    }
  }, [onViewHtmlCode, handleViewHtmlCode]);

  useEffect(() => {
    if (onDownloadWireframe) {
      onDownloadWireframe.current = handleDownloadWireframe;
    }
  }, [onDownloadWireframe, handleDownloadWireframe]);

  useEffect(() => {
    if (onPresentationMode) {
      onPresentationMode.current = handlePresentationMode;
    }
  }, [onPresentationMode, handlePresentationMode]);

  // Toggle left panel collapse
  const handleToggleLeftPanel = useCallback(() => {
    setIsLeftPanelCollapsed(prev => !prev);
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

  // Expose enhanced save to parent via ref
  useEffect(() => {
    if (onEnhancedSave) {
      onEnhancedSave.current = enhancedOnSave;
    }
  }, [onEnhancedSave, enhancedOnSave]);

  // Direct AI generation with Microsoft components - no modal
  const enhancedHandleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Direct AI generation called!', { description: description.trim(), loading });

    // Validate the input before proceeding
    if (!validateChatInput(description)) {
      return; // Stop submission if validation fails
    }

    if (description.trim() && !loading) {
      // Close image upload zone when starting generation for cleaner UI
      if (showImageUpload) {
        setShowImageUpload(false);
      }

      // Direct AI approach: Skip modal, go straight to AI generation with Microsoft components
      console.log('🤖 Direct AI approach: Calling handleSubmit for immediate AI generation');

      // Only add a message if it's coming from the form input (not initial description)
      // Check our ref to make sure this isn't the first message from landing page
      if (initialMessageAddedRef.current || conversationHistory.length > 0) {
        addMessage('user', description);
        addMessage('ai', '✨ Generating wireframe with Microsoft components...');
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
  }, [description, loading, conversationHistory.length, showImageUpload, setShowImageUpload, addMessage, validateChatInput, handleSubmit]);

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
    <div className={`split-layout ${isLeftPanelCollapsed ? 'left-panel-collapsed' : ''}`}>
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
              onReact={handleMessageReact}
              reactions={messageReactions[message.id] || []}
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

        {/* Unified Chat Input and AI Suggestions Container */}
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

                  // Check if input is valid and clear validation error if needed
                  if (value.trim()) {
                    const trimmedInput = value.trim();
                    const onlyNumbersRegex = /^[\d\s.,]+$/;

                    // Clear validation error if input becomes valid
                    if (!onlyNumbersRegex.test(trimmedInput)) {
                      setChatValidationError(null);
                    }
                  } else {
                    // Clear validation error if input is empty
                    setChatValidationError(null);
                  }

                  // Hide suggestions if content becomes too short or is number-only
                  if (value.length <= 2) {
                    setShowAiSuggestions(false);
                  } else {
                    // Don't show suggestions for number-only inputs
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
                  // Generate AI suggestions when textarea is clicked
                  if (description.length > 2) {
                    // Don't generate suggestions for number-only inputs
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

            {/* AI Suggestions integrated within the same container */}
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

      {/* Right: AI Assistant Interface */}
      <div className={`right-pane ${isLeftPanelCollapsed ? 'expanded' : ''}`}>
        {(htmlWireframe || wireframePages.length > 0) ? (
          <div className="wireframe-panel">
            {/* Intelligent Wireframe Name Display */}
            {wireframeName && (
              <div className="wireframe-name-header">
                <h3 className="wireframe-title">{wireframeName}</h3>
              </div>
            )}

            {/* Always show PageNavigation when we have a wireframe */}
            <PageNavigation
              pages={wireframePages}
              currentPageId={currentPageId}
              onPageSwitch={handlePageSwitch}
              onAddPage={handleAddPages}
              onOpenLibrary={handleOpenLibrary}
              onOpenDevPlaybooks={handleOpenDevPlaybooks}
              onOpenFigmaComponents={handleOpenFigmaComponents}
              onSave={enhancedOnSave}
              onAddToFavorites={handleAddToFavorites}
              onImageUpload={openImageUploadModal}
            />

            <div className="wireframe-container">
              <div className="wireframe-content">
                {reactComponent ? (
                  // Show React component with visual preview
                  <div className="react-component-preview">
                    <ComponentPreview
                      componentCode={reactComponent}
                      componentName="GeneratedComponent"
                    />
                  </div>
                ) : (
                  // Show HTML wireframe
                  <SimpleDragWireframe
                    htmlContent={currentPageId ? (pageContents[currentPageId] || htmlWireframe) : htmlWireframe}
                    onUpdateContent={(newContent) => {
                      if (currentPageId) {
                        setPageContents(prev => ({ ...prev, [currentPageId]: newContent }));
                      } else {
                        setHtmlWireframe(newContent);
                      }
                    }}
                  />
                )}
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
      <FluentSaveWireframeModal
        isOpen={isEnhancedSaveModalOpen}
        onClose={() => setIsEnhancedSaveModalOpen(false)}
        onSave={handleSaveWireframe}
        currentHtml={htmlWireframe}
        currentCss="/* Generated CSS styles */"
        designTheme={designTheme}
        colorScheme={colorScheme}
        initialName={wireframeName || undefined}
        isUpdating={isUpdatingWireframe}
        existingWireframe={wireframeToUpdate}
      />

      {/* Image Upload Modal */}
      <FluentImageUploadModal
        isOpen={isImageUploadModalOpen}
        onClose={() => setIsImageUploadModalOpen(false)}
        onImageUpload={handleImageFile}
        onAnalyzeImage={handleAnalyzeImage}
        isAnalyzing={isProcessingImage}
      />

      {/* Figma Integration Modal */}
      <FigmaIntegrationModal
        isOpen={isFigmaModalOpen}
        onClose={() => setIsFigmaModalOpen(false)}
        onImport={handleFigmaImport}
        onExport={handleFigmaExport}
      />

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onDownload={handleDownloadModalDownload}
        wireframeTitle={description || 'Wireframe'}
      />

      {/* Dev Playbooks Library */}
      <DevPlaybooksLibrary
        isOpen={isDevPlaybooksOpen}
        onClose={() => {
          setIsDevPlaybooksOpen(false);
        }}
        onAddComponent={(component: any) => {
          console.log('✨ Dev Playbook component added:', component.name);
          if (onAddComponent) {
            onAddComponent(component);
          }
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

      {/* Figma Components Library */}
      <FigmaComponentsLibrary
        isOpen={isFigmaComponentsOpen}
        onClose={() => {
          setIsFigmaComponentsOpen(false);
        }}
        onAddComponent={(component: any) => {
          console.log('✨ Figma component added:', component.name);
          if (onAddComponent) {
            onAddComponent(component);
          }
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

      {/* Enhanced Component Library (Legacy) */}
      <EnhancedComponentLibrary
        isOpen={isComponentLibraryOpen}
        onClose={() => {
          setIsComponentLibraryOpen(false);
        }}
        onAddComponent={(component: any) => {
          console.log('✨ Component added:', component.name);
          if (onAddComponent) {
            onAddComponent(component);
          }
          // Removed toast notification to prevent components showing inside toasts
        }}
        onGenerateWithAI={(description: string) => {
          console.log('🤖 AI generation requested for:', description);
          // Call the original handleSubmit to trigger AI generation
          const mockEvent = new Event('submit') as any;
          handleSubmit(mockEvent);
          addMessage('ai', '🤖 Generating wireframe with AI...');
        }}
        currentDescription={description}
        libraryType="dev-playbooks"
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
        onImportHtml={handleHtmlImport}
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
