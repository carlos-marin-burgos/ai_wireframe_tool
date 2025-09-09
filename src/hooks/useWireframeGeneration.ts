import { useState, useCallback, useRef, useEffect } from "react";
import { API_CONFIG } from "../config/api";
import { api } from "../utils/apiClient";

interface WireframeResponse {
  html: string;
  fallback?: boolean;
  processingTime?: number;
}

// Simple in-memory cache
const wireframeCache: Record<
  string,
  {
    html: string;
    timestamp: number;
    processingTime: number;
  }
> = {};

// Cache expiration time (30 minutes)
const CACHE_EXPIRATION = 30 * 60 * 1000;

// Function to remove wireframe placeholders and replace with functional content
const removeWireframePlaceholders = (html: string): string => {
  // DEBUG: Log what CSS is in the wireframe HTML
  const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  if (styleMatches) {
    console.log(
      "🎨 Found CSS in wireframe HTML:",
      styleMatches.length,
      "style blocks"
    );
    styleMatches.forEach((style, index) => {
      console.log(`Style block ${index + 1}:`, style.substring(0, 200) + "...");
    });
  }

  // PROPER FIX: Scope all CSS to only affect wireframe content
  html = html.replace(
    /<style[^>]*>([\s\S]*?)<\/style>/gi,
    (match, cssContent) => {
      // Scope all CSS rules to only apply within .wireframe-content
      const scopedCSS = cssContent.replace(
        /([^{}]+){/g,
        (ruleMatch, selector) => {
          // Don't scope @keyframes, @media, or other @ rules
          if (selector.trim().startsWith("@")) {
            return ruleMatch;
          }
          // Scope the selector to only apply within wireframe content
          const trimmedSelector = selector.trim();
          if (
            trimmedSelector &&
            !trimmedSelector.includes(".wireframe-content")
          ) {
            return `.wireframe-content ${trimmedSelector} {`;
          }
          return ruleMatch;
        }
      );

      return `<style>${scopedCSS}</style>`;
    }
  );

  // ENHANCED: Remove ALL wireframe placeholder CSS that creates rectangles/gray boxes
  // Remove text-placeholder styles
  html = html.replace(/\.text-placeholder[^}]*}/g, "");
  // Remove placeholder styles with various naming patterns
  html = html.replace(/\.[^{]*placeholder[^{]*\{[^}]*background[^}]*\}/gi, "");
  html = html.replace(
    /\.[^{]*placeholder[^{]*\{[^}]*width[^}]*height[^}]*\}/gi,
    ""
  );
  // Remove generic rectangle/box styles that might be placeholders
  html = html.replace(
    /\.[^{]*\{[^}]*background:\s*#[a-fA-F0-9]{3,6}[^}]*width:[^}]*height:[^}]*\}/gi,
    ""
  );
  // Remove any CSS creating colored rectangles (common placeholder pattern)
  html = html.replace(
    /\.[^{]*\{[^}]*background-color:\s*#[a-fA-F0-9]{3,6}[^}]*\}/gi,
    ""
  );
  // Remove wireframe-specific patterns
  html = html.replace(/\.[^{]*wireframe[^{]*\{[^}]*background[^}]*\}/gi, "");
  html = html.replace(/\.[^{]*component[^{]*\{[^}]*background[^}]*\}/gi, "");
  html = html.replace(/\.[^{]*rectangle[^{]*\{[^}]*\}/gi, "");
  html = html.replace(/\.[^{]*box[^{]*\{[^}]*background[^}]*\}/gi, "");
  // Remove specific low-fi patterns
  html = html.replace(/\.[^{]*mockup[^{]*\{[^}]*\}/gi, "");
  html = html.replace(/\.[^{]*sketch[^{]*\{[^}]*\}/gi, "");
  html = html.replace(/\.[^{]*proto[^{]*\{[^}]*\}/gi, "");

  // Replace wireframe placeholder elements with actual content
  html = html.replace(
    /<div class="text-placeholder-heading[^"]*"><\/div>/g,
    "<h2>Microsoft Learn - Azure Platform</h2>"
  );

  html = html.replace(
    /<div class="text-placeholder-line[^"]*"><\/div>/g,
    "<p>Learn Microsoft Azure with hands-on tutorials, documentation, and interactive examples.</p>"
  );

  html = html.replace(
    /<h1 class="text-placeholder[^"]*"><\/h1>/g,
    "<h1>Welcome to Microsoft Learn</h1>"
  );

  // Replace any remaining placeholder divs with actual content
  html = html.replace(
    /<div[^>]*class="[^"]*placeholder[^"]*"[^>]*><\/div>/gi,
    "<p>Sample content</p>"
  );

  // Replace wireframe-specific elements
  html = html.replace(
    /<div[^>]*class="[^"]*wireframe[^"]*"[^>]*><\/div>/gi,
    "<p>Sample content</p>"
  );

  html = html.replace(
    /<div[^>]*class="[^"]*component[^"]*"[^>]*><\/div>/gi,
    "<div class='content-block'><p>Content</p></div>"
  );

  html = html.replace(
    /<div[^>]*class="[^"]*rectangle[^"]*"[^>]*><\/div>/gi,
    "<p>Sample content</p>"
  );

  // Replace empty divs that might be placeholders
  html = html.replace(/<div[^>]*class="[^"]*"[^>]*><\/div>/gi, (match) => {
    // Only replace if it looks like a placeholder (has width/height styles or placeholder in class)
    if (
      match.includes("placeholder") ||
      match.includes("wireframe") ||
      match.includes("component") ||
      match.includes("rectangle") ||
      match.includes("width") ||
      match.includes("height")
    ) {
      return "<p>Sample content</p>";
    }
    return match;
  });

  return html;
}; // Helper function to ensure HTML content is always a string and apply fixes
const ensureString = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    let cleaned = value.trim();
    // Remove any markdown artifacts
    cleaned = cleaned.replace(/^[0'"]+|[0'"]+$/g, "");
    cleaned = cleaned.replace(/^'''html\s*/gi, "");
    cleaned = cleaned.replace(/^```html\s*/gi, "");
    cleaned = cleaned.replace(/```\s*$/gi, "");

    // Apply wireframe placeholder removal
    cleaned = removeWireframePlaceholders(cleaned);

    return cleaned.trim();
  }
  try {
    let stringValue = String(value).trim();
    stringValue = stringValue.replace(/^[0'"]+|[0'"]+$/g, "");
    stringValue = stringValue.replace(/^'''html\s*/gi, "");
    stringValue = stringValue.replace(/^```html\s*/gi, "");
    stringValue = stringValue.replace(/```\s*$/gi, "");

    // Apply wireframe placeholder removal
    stringValue = removeWireframePlaceholders(stringValue);

    return stringValue.trim();
  } catch (e) {
    console.error("Failed to convert HTML content to string:", e);
    return "";
  }
};

export const useWireframeGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [fallback, setFallback] = useState(false);
  const [processingTime, setProcessingTime] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadingTimersRef = useRef<number[]>([]);

  // Clear loading timers on unmount
  useEffect(() => {
    return () => {
      loadingTimersRef.current.forEach((timer) => clearTimeout(timer));
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Cancels any ongoing wireframe generation request
   */
  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    // Clear all loading timers
    loadingTimersRef.current.forEach((timer) => clearTimeout(timer));
    loadingTimersRef.current = [];
    // Reset loading states
    setIsLoading(false);
    setLoadingStage("");
  }, []);

  const generateWireframe = useCallback(
    async (
      description: string,
      theme: string = "microsoftlearn",
      colorScheme: string = "primary",
      skipCache: boolean = false,
      fastMode: boolean = false
    ) => {
      // Cancel any ongoing request
      cancelGeneration();

      console.log("🎨 Generating wireframe (SIMPLIFIED):", {
        description: description.substring(0, 100) + "...",
        theme,
        colorScheme,
        skipCache,
        fastMode,
        baseUrl: API_CONFIG.BASE_URL,
      });

      // Reset state
      setIsLoading(true);
      setError(null);
      setFallback(false);
      setLoadingStage("🤖 AI mode: Connecting to wireframe service...");

      // Create a cache key
      const cacheKey = `${description}-${theme}-${colorScheme}-${Date.now()}`;

      // Set up loading stage timers
      const timer1 = setTimeout(
        () => setLoadingStage("🤖 Analyzing your description..."),
        3000
      );
      const timer2 = setTimeout(
        () => setLoadingStage("🤖 Generating wireframe code..."),
        8000
      );
      const timer3 = setTimeout(
        () => setLoadingStage("⚡ Almost ready..."),
        15000
      );
      loadingTimersRef.current = [timer1, timer2, timer3];

      try {
        // Create abort controller for this request
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        console.log("🚀 Making API call to:", {
          endpoint: API_CONFIG.ENDPOINTS.GENERATE_WIREFRAME,
          payload: { description, theme, colorScheme, fastMode: false },
        });

        const startTime = Date.now();

        // Call the single working endpoint
        const data = await api.post<WireframeResponse>(
          API_CONFIG.ENDPOINTS.GENERATE_WIREFRAME + `?t=${Date.now()}`,
          { description, theme, colorScheme, fastMode: false },
          {
            signal: abortController.signal,
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );

        const endTime = Date.now();
        console.log("✅ API call succeeded in", endTime - startTime, "ms");
        console.log("📦 Response data:", {
          hasHtml: !!data.html,
          htmlLength: data.html?.length,
          fallback: data.fallback,
          processingTime: data.processingTime,
        });

        // Update state based on response
        setFallback(data.fallback || false);
        if (data.processingTime) {
          setProcessingTime(data.processingTime);
        }

        // Make sure html is a string
        const htmlContent = ensureString(data.html);

        if (!htmlContent) {
          throw new Error("No HTML content received from API");
        }

        // Cache the successful result
        if (htmlContent.length > 0 && !data.fallback) {
          wireframeCache[cacheKey] = {
            html: htmlContent,
            timestamp: Date.now(),
            processingTime: data.processingTime || 0,
          };
        }

        return {
          html: htmlContent,
          fallback: data.fallback || false,
          processingTime: data.processingTime || 0,
          fromCache: false,
        };
      } catch (err) {
        console.error("❌ Primary endpoint failed:", err);

        // Handle AbortError specially
        if (err instanceof Error && err.name === "AbortError") {
          setError("Request was cancelled");
          throw err;
        }

        // Use fallback generator
        try {
          setLoadingStage("🛠️ Using local fallback generator...");

          const { generateFallbackWireframe } = await import(
            "../utils/fallbackWireframeGenerator"
          );

          console.log("🔧 Generating fallback wireframe...");
          const fallbackStartTime = Date.now();

          const fallbackHtml = await generateFallbackWireframe({
            description,
            theme,
            colorScheme,
          });

          const fallbackEndTime = Date.now();
          console.log(
            "✅ Fallback wireframe generated in",
            fallbackEndTime - fallbackStartTime,
            "ms"
          );

          const result = {
            html: fallbackHtml,
            fallback: true,
            processingTime: fallbackEndTime - fallbackStartTime,
            fromCache: false,
          };

          setFallback(true);
          setProcessingTime(result.processingTime);

          return result;
        } catch (fallbackError) {
          console.error("❌ Fallback generator also failed:", fallbackError);

          const errorMessage =
            err instanceof Error
              ? err.message
              : "An unexpected error occurred while generating the wireframe.";
          setError(`Wireframe Generation Failed: ${errorMessage}`);
          throw err;
        }
      } finally {
        setIsLoading(false);
        setLoadingStage("");
        loadingTimersRef.current.forEach((timer) => clearTimeout(timer));
        loadingTimersRef.current = [];
        abortControllerRef.current = null;
      }
    },
    [cancelGeneration]
  );

  /**
   * Clears the wireframe cache
   */
  const clearCache = useCallback(() => {
    const cacheSize = Object.keys(wireframeCache).length;
    Object.keys(wireframeCache).forEach((key) => delete wireframeCache[key]);
    console.log(`Cleared ${cacheSize} items from wireframe cache`);
  }, []);

  return {
    generateWireframe,
    isLoading,
    loadingStage,
    error,
    fallback,
    processingTime,
    cancelGeneration,
    clearCache,
  };
};

// Function to clear the wireframe cache
export const clearWireframeCache = () => {
  Object.keys(wireframeCache).forEach((key) => delete wireframeCache[key]);
  console.log("Frontend wireframe cache cleared");
};
