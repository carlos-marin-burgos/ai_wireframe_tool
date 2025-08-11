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

// Helper function to ensure HTML content is always a string
const ensureString = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    let cleaned = value.trim();
    // Remove any markdown artifacts or unwanted prefixes that might come from AI responses
    cleaned = cleaned.replace(/^[0'"]+|[0'"]+$/g, "");
    cleaned = cleaned.replace(/^'''html\s*/gi, "");
    cleaned = cleaned.replace(/^```html\s*/gi, "");
    cleaned = cleaned.replace(/```\s*$/gi, "");
    return cleaned.trim();
  }
  // Try to convert to string if possible
  try {
    let stringValue = String(value).trim();
    // Apply same cleaning to converted strings
    stringValue = stringValue.replace(/^[0'"]+|[0'"]+$/g, "");
    stringValue = stringValue.replace(/^'''html\s*/gi, "");
    stringValue = stringValue.replace(/^```html\s*/gi, "");
    stringValue = stringValue.replace(/```\s*$/gi, "");
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
  }, []);

  const generateWireframe = useCallback(
    async (
      description: string,
      theme: string = "microsoftlearn",
      colorScheme: string = "primary",
      skipCache: boolean = false,
      fastMode: boolean = false // New parameter for fast mode
    ) => {
      // Cancel any ongoing request
      cancelGeneration();

      console.log("🎨 Generating wireframe with enhanced fallback support:", {
        description: description.substring(0, 100) + "...",
        theme,
        colorScheme,
        skipCache,
        fastMode,
      });

      // 🤖 AI-ONLY MODE: Always use AI, never fast mode
      const shouldUseFastMode = false; // Disabled - always use AI

      // Reset state
      setIsLoading(true);
      setError(null);
      setFallback(false);

      // 🤖 Always show AI mode loading stages
      setLoadingStage("🤖 AI mode: Initializing AI model...");

      // Create a cache key with version for Microsoft Design Language update
      // DEVELOPMENT: Always skip cache by making key unique
      const cacheKey = `${description}-${theme}-${colorScheme}-${shouldUseFastMode}-DEVELOPMENT-NOCACHE-${Date.now()}`;

      // Set up AI loading stage timers
      const timer1 = setTimeout(
        () => setLoadingStage("🤖 Analyzing your description..."),
        1000
      );
      const timer2 = setTimeout(
        () => setLoadingStage("🤖 Generating wireframe code..."),
        3000
      );
      const timer3 = setTimeout(
        () => setLoadingStage("🤖 Optimizing layout..."),
        8000
      );
      const timer4 = setTimeout(
        () => setLoadingStage("🤖 Finalizing components..."),
        15000
      );
      const timer5 = setTimeout(
        () => setLoadingStage("🤖 Almost done..."),
        25000
      );
      loadingTimersRef.current = [timer1, timer2, timer3, timer4, timer5];

      try {
        // DEVELOPMENT: Completely skip cache for debugging
        const skipCacheCompletely = true;
        if (!skipCacheCompletely && !skipCache && wireframeCache[cacheKey]) {
          const cached = wireframeCache[cacheKey];
          const now = Date.now();

          // Check if cache is still valid
          if (now - cached.timestamp < CACHE_EXPIRATION) {
            console.log("Using cached wireframe", {
              age: Math.round((now - cached.timestamp) / 1000) + "s",
              processingTime: cached.processingTime + "ms",
            });
            setProcessingTime(cached.processingTime);

            // Still wait a bit to avoid UI flashing
            await new Promise((resolve) => setTimeout(resolve, 500));

            return {
              html: ensureString(cached.html),
              fallback: false,
              fromCache: true,
            };
          } else {
            console.log("Cache expired, generating new wireframe");
            // Remove expired cache entry
            delete wireframeCache[cacheKey];
          }
        }

        // Create abort controller for this request
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        // Call the API using our new client
        console.log("🚀 Making API call with:", {
          description,
          theme,
          colorScheme,
          fastMode: shouldUseFastMode,
          timestamp: Date.now(),
        });

        const data = await api.post<WireframeResponse>(
          API_CONFIG.ENDPOINTS.GENERATE_WIREFRAME + `?t=${Date.now()}`, // Add timestamp to force cache bust
          { description, theme, colorScheme, fastMode: shouldUseFastMode },
          {
            signal: abortController.signal,
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );

        console.log("📥 API response received:", {
          hasHtml: !!data.html,
          htmlLength: data.html?.length,
          fallback: data.fallback,
          source: (data as any).source,
          title:
            data.html?.match(/<title>(.*?)<\/title>/)?.[1] || "No title found",
        });

        console.log("API response received");
        console.log("API response data keys:", Object.keys(data));
        console.log("API response data structure:", data);

        // Validate the data structure
        if (!data || typeof data !== "object") {
          console.error("API returned invalid data structure:", data);
          throw new Error("Invalid data structure from wireframe API");
        }

        // Update state based on response
        setFallback(data.fallback || false);

        if (data.processingTime) {
          setProcessingTime(data.processingTime);
        }

        // Debug log
        console.log("API returned HTML content type:", typeof data.html);
        console.log("HTML is null?", data.html === null);
        console.log("HTML is undefined?", data.html === undefined);

        // Make sure html is a string
        const htmlContent = ensureString(data.html);

        // Log additional debugging info
        if (htmlContent) {
          console.log(
            "HTML content length after ensureString:",
            htmlContent.length
          );
          console.log(
            "HTML content preview:",
            htmlContent.substring(0, 100) + "..."
          );
        } else {
          console.error("HTML content is empty after ensureString");
        }

        // Cache the successful result if not a fallback and content is valid
        if (htmlContent && htmlContent.length > 0 && !data.fallback) {
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
        console.error("❌ Error generating wireframe:", err);

        // Handle AbortError specially
        if (err instanceof Error && err.name === "AbortError") {
          setError("Request was cancelled");
          throw err;
        }

        // Check if this is an AI service unavailable error
        if (
          err instanceof Error &&
          (err.message.includes(
            "AI Wireframe Service Temporarily Unavailable"
          ) ||
            err.message.includes("AI Service Connection Failed") ||
            err.message.includes("Service temporarily unavailable"))
        ) {
          console.log(
            "🚫 AI service is unavailable - showing error message to user"
          );
          setError(err.message);
          throw err; // Don't use fallback, just show the error
        }

        // For other errors, show a generic error message
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while generating the wireframe.";
        setError(`Wireframe Generation Failed: ${errorMessage}`);
        throw err; // Don't use fallback for any errors
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
