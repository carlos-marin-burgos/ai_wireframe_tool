import { useState, useCallback, useRef, useEffect } from "react";
import { API_CONFIG } from "../config/api";
import { api } from "../utils/apiClient";

interface WireframeResponse {
  html: string;
  fallback?: boolean;
  processingTime?: number;
  source?: string;
  metadata?: {
    description?: string;
    correlationId?: string;
    processingTimeMs?: number;
    generatedAt?: string;
  };
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
  // First, scope all CSS to only affect wireframe content
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

  // Replace placeholder elements with actual content
  // Replace text placeholder headings with real headings
  html = html.replace(
    /<div[^>]*class="[^"]*text-placeholder-heading[^"]*"[^>]*><\/div>/gi,
    "<h2>Sample Heading</h2>"
  );

  // Replace text placeholder lines with sample paragraphs
  html = html.replace(
    /<div[^>]*class="[^"]*text-placeholder-line[^"]*"[^>]*><\/div>/gi,
    "<p>This is sample text content that represents the actual content that would appear in the final design.</p>"
  );

  // Replace multiple consecutive placeholder paragraphs with varied content
  html = html.replace(
    /(<p>This is sample text content that represents the actual content that would appear in the final design\.<\/p>\s*){2,}/gi,
    "<p>This is sample text content that represents the actual content that would appear in the final design.</p><p>Here is additional sample content to show how multiple paragraphs would look in the actual implementation.</p>"
  );

  // Remove any remaining text-placeholder CSS classes
  html = html.replace(/text-placeholder-[a-zA-Z-]+/gi, "");

  return html;
}; // Helper function to ensure HTML content is always a string and apply fixes
const ensureString = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    let cleaned = value.trim();

    // ROBUST HTML EXTRACTION - handles AI responses with explanations
    // 1. Try to find complete HTML document
    let htmlStart = cleaned.indexOf("<!DOCTYPE html>");
    if (htmlStart !== -1) {
      const htmlEnd = cleaned.lastIndexOf("</html>");
      if (htmlEnd !== -1) {
        cleaned = cleaned.substring(htmlStart, htmlEnd + 7);
      }
    } else {
      // 2. Try to find HTML tag
      htmlStart = cleaned.indexOf("<html");
      if (htmlStart !== -1) {
        const htmlEnd = cleaned.lastIndexOf("</html>");
        if (htmlEnd !== -1) {
          cleaned = cleaned.substring(htmlStart, htmlEnd + 7);
        }
      }
    }

    // Remove any remaining markdown artifacts
    cleaned = cleaned.replace(/^```html\s*/gi, "");
    cleaned = cleaned.replace(/```\s*$/gi, "");
    cleaned = cleaned.replace(/^['"]+|['"]+$/g, "");

    // Apply wireframe placeholder removal
    cleaned = removeWireframePlaceholders(cleaned);

    return cleaned.trim();
  }
  try {
    let stringValue = String(value).trim();

    // ROBUST HTML EXTRACTION for non-string values
    let htmlStart = stringValue.indexOf("<!DOCTYPE html>");
    if (htmlStart !== -1) {
      const htmlEnd = stringValue.lastIndexOf("</html>");
      if (htmlEnd !== -1) {
        stringValue = stringValue.substring(htmlStart, htmlEnd + 7);
      }
    } else {
      htmlStart = stringValue.indexOf("<html");
      if (htmlStart !== -1) {
        const htmlEnd = stringValue.lastIndexOf("</html>");
        if (htmlEnd !== -1) {
          stringValue = stringValue.substring(htmlStart, htmlEnd + 7);
        }
      }
    }

    stringValue = stringValue.replace(/^```html\s*/gi, "");
    stringValue = stringValue.replace(/```\s*$/gi, "");
    stringValue = stringValue.replace(/^['"]+|['"]+$/g, "");
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
  const loadingTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

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
    console.log("🚨 FORCE STOP - cancelGeneration called!");

    // FORCE STOP - Always reset loading state first
    setIsLoading(false);
    setLoadingStage("");
    setError(null);

    // Clear all loading timers
    loadingTimersRef.current.forEach((timer) => clearTimeout(timer));
    loadingTimersRef.current = [];

    // Abort any ongoing request
    if (abortControllerRef.current) {
      console.log("🚨 Aborting request...");
      try {
        abortControllerRef.current.abort();
        console.log("🚨 Request aborted!");
      } catch (error) {
        console.log("🚨 Error aborting request:", error);
      }
      abortControllerRef.current = null;
    }

    console.log("🚨 FORCE STOP completed!");
  }, []);

  const generateWireframe = useCallback(
    async (
      description: string,
      theme: string = "microsoft",
      colorScheme: string = "primary",
      skipCache: boolean = false,
      fastMode: boolean = false,
      websiteAnalysis?: any
    ) => {
      // Cancel any ongoing request
      cancelGeneration();

      console.log("🎨 Generating wireframe (INTELLIGENT FALLBACK):", {
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
      setLoadingStage("🚀 Connecting to AI wireframe service...");

      // Create a cache key
      const requestId = `req-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const cacheKey = `${description}-${theme}-${colorScheme}-${Date.now()}`;

      console.log(`🔍 [${requestId}] Starting wireframe generation for:`, {
        description:
          description.substring(0, 50) + (description.length > 50 ? "..." : ""),
        theme,
        colorScheme,
        requestId,
      });
      // Set up loading stage timers
      const timer1 = setTimeout(
        () => setLoadingStage("🤖 AI analyzing your description..."),
        2000
      );
      const timer2 = setTimeout(
        () => setLoadingStage("⚡ Generating intelligent wireframe..."),
        6000
      );
      const timer3 = setTimeout(
        () => setLoadingStage("🎯 Finalizing design..."),
        12000
      );
      loadingTimersRef.current = [timer1, timer2, timer3];

      try {
        // Create abort controller for this request
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        console.log(
          `🚀 [${requestId}] Attempting Azure Functions + OpenAI generation:`,
          {
            endpoint: API_CONFIG.ENDPOINTS.GENERATE_WIREFRAME,
            payload: { description, theme, colorScheme, fastMode: false },
            timestamp: Date.now(),
            cacheKey,
            requestId,
          }
        );

        // Detect and strip [strict] token (case-insensitive) from description
        let strictMode = false;
        let cleanedDescription = description;
        if (/\[strict\]/i.test(description)) {
          strictMode = true;
          cleanedDescription = description.replace(/\[strict\]/gi, "").trim();
          console.log(
            "🧱 Strict mode token detected. Cleaned description:",
            cleanedDescription
          );
        }

        // Sanitize websiteAnalysis to remove control characters from textual fields
        const sanitizeValue = (val: any) => {
          if (typeof val === "string") {
            return val
              .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, " ")
              .replace(/\s+/g, " ")
              .trim();
          }
          return val;
        };
        const deepSanitize = (obj: any): any => {
          if (!obj || typeof obj !== "object") return obj;
          if (Array.isArray(obj)) return obj.map(deepSanitize);
          const out: any = {};
          for (const k of Object.keys(obj)) {
            const v = obj[k];
            if (v && typeof v === "object") {
              out[k] = deepSanitize(v);
            } else {
              out[k] = sanitizeValue(v);
            }
          }
          return out;
        };
        const sanitizedAnalysis = websiteAnalysis
          ? deepSanitize(websiteAnalysis)
          : undefined;
        if (websiteAnalysis && sanitizedAnalysis) {
          console.log("🧼 Sanitized websiteAnalysis payload");
        }

        const requestPayload = {
          description: cleanedDescription,
          theme,
          colorScheme,
          fastMode: false,
          ...(sanitizedAnalysis && { websiteAnalysis: sanitizedAnalysis }),
          ...(strictMode && { strictMode: true }),
        };
        console.log(
          `📡 [${requestId}] Detailed request payload:`,
          JSON.stringify(requestPayload, null, 2)
        );

        const startTime = Date.now();

        // Try Azure Functions + OpenAI first (with shorter timeout for faster fallback)
        const data = await Promise.race([
          api.post<WireframeResponse>(
            API_CONFIG.ENDPOINTS.GENERATE_WIREFRAME + `?t=${Date.now()}`,
            requestPayload,
            {
              signal: abortController.signal,
              headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
                Expires: "0",
              },
            }
          ),
          // Timeout: 120 seconds for website analysis (more data), 60 seconds for normal generation
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error("Azure Functions timeout")),
              websiteAnalysis ? 120000 : 60000
            )
          ),
        ]);

        const endTime = Date.now();
        console.log(
          `✅ [${requestId}] Azure Functions call succeeded in`,
          endTime - startTime,
          "ms"
        );

        // New: log raw response object for diagnostics (non-truncated if small)
        try {
          console.log(`🩻 [${requestId}] Raw API response JSON:`, data);
        } catch (e) {
          console.log(
            `🩻 [${requestId}] Raw API response could not be stringified`
          );
        }

        // Support both legacy (direct html) and current (data.html) shapes
        const nestedHtml = (data as any)?.data?.html;
        const directHtml = (data as any)?.html; // legacy or alternate shape
        const htmlRaw = directHtml || nestedHtml || "";
        const apiSource =
          (data as any)?.source || (data as any)?.data?.source || "unknown";
        const apiMetadata =
          (data as any)?.metadata || (data as any)?.data?.metadata || undefined;
        const processingMs =
          (data as any)?.processingTime ||
          apiMetadata?.processingTimeMs ||
          endTime - startTime;
        const apiFallback =
          (data as any)?.fallback || (data as any)?.data?.fallback || false;

        console.log(`📦 [${requestId}] Normalized response info:`, {
          hasHtml: !!htmlRaw,
          htmlLength: htmlRaw?.length,
          apiFallback,
          processingMs,
          apiSource,
          metadata: apiMetadata,
          shape: {
            topLevelKeys: Object.keys(data || {}),
            hasDataObject: !!(data as any)?.data,
          },
        });

        // Log template detection info
        if (data.metadata?.description) {
          console.log(`🎯 [${requestId}] Template Detection:`, {
            requestedDescription: description,
            responseDescription: data.metadata.description,
            templateSource: data.source,
            match: description === data.metadata.description,
          });
        }

        // Update state based on response
        setFallback(apiFallback || false);
        if (processingMs) {
          setProcessingTime(processingMs);
        }

        // Make sure html is a string (from normalized htmlRaw)
        const htmlContent = ensureString(htmlRaw);

        // If strictMode metadata returned, log confirmation
        if ((data as any)?.metadata?.strictMode) {
          console.log(
            `🧱 Strict scaffold received (sections: ${
              (data as any).metadata.sections || "n/a"
            })`
          );
        }

        if (!htmlContent) {
          throw new Error("No HTML content received from Azure Functions");
        }

        // Cache the successful result
        if (htmlContent.length > 0 && !apiFallback) {
          wireframeCache[cacheKey] = {
            html: htmlContent,
            timestamp: Date.now(),
            processingTime: processingMs || 0,
          };
        }

        console.log("🎉 Azure Functions + OpenAI generation successful");
        return {
          html: htmlContent,
          fallback: apiFallback || false,
          processingTime: processingMs || 0,
          fromCache: false,
          source: "azure-functions",
        };
      } catch (err) {
        console.warn(
          "⚠️ Azure Functions unavailable, using intelligent fallback:",
          err
        );

        // Handle AbortError specially (user cancelled)
        if (
          err instanceof Error &&
          err.name === "AbortError" &&
          !err.message.includes("timeout")
        ) {
          setError("Request was cancelled");
          throw err;
        }

        // Use intelligent client-side fallback
        try {
          setLoadingStage("🧠 Using intelligent local generation...");

          const { generateFallbackWireframe } = await import(
            "../utils/fallbackWireframeGenerator"
          );

          console.log("🔧 Generating intelligent local wireframe...");
          const fallbackStartTime = Date.now();

          const fallbackHtml = await generateFallbackWireframe({
            description,
            theme,
            colorScheme,
          });

          const fallbackEndTime = Date.now();
          console.log(
            "✅ Intelligent fallback generated in",
            fallbackEndTime - fallbackStartTime,
            "ms"
          );

          const result = {
            html: fallbackHtml,
            fallback: true,
            processingTime: fallbackEndTime - fallbackStartTime,
            fromCache: false,
            source: "client-side-intelligent",
          };

          setFallback(true);
          setProcessingTime(result.processingTime);

          console.log("🎯 Client-side intelligent generation successful");
          return result;
        } catch (fallbackError) {
          console.error("❌ All generation methods failed:", fallbackError);

          const errorMessage =
            err instanceof Error
              ? err.message
              : "Unable to generate wireframe. Please try again.";
          setError(`Generation Failed: ${errorMessage}`);
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
