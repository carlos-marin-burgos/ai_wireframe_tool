import { useState, useCallback, useRef, useEffect } from "react";
import { API_CONFIG } from "../config/api";
import { api } from "../utils/apiClient";

interface WireframeResponse {
  html: string;
  fallback?: boolean;
  processingTime?: number;
}

// Debug Hook - Forces direct API calls and logs everything
export function useWireframeGenerationDebug() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fallback, setFallback] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateWireframe = useCallback(
    async (
      description: string,
      theme = "microsoftlearn",
      colorScheme = "primary"
    ) => {
      console.log("🚀 DEBUG HOOK: Starting wireframe generation...");
      console.log("🔍 DEBUG HOOK: Input params:", {
        description,
        theme,
        colorScheme,
      });
      console.log("🔍 DEBUG HOOK: API_CONFIG.BASE_URL:", API_CONFIG.BASE_URL);
      console.log("🔍 DEBUG HOOK: isDevelopment:", import.meta.env.DEV);

      setIsLoading(true);
      setError(null);
      setFallback(false);
      setLoadingStage("Initializing...");

      // Abort any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        setLoadingStage("Contacting AI service...");

        // **FORCE** the working endpoint - bypass all routing logic
        const directEndpoint = "/api/generate-html-wireframe";
        const fullUrl = `${API_CONFIG.BASE_URL}${directEndpoint}`;

        console.log("🎯 DEBUG HOOK: Forcing direct endpoint:", fullUrl);
        console.log("🎯 DEBUG HOOK: Request payload:", {
          description,
          theme,
          colorScheme,
        });

        const startTime = Date.now();

        // Make the API call directly
        const response = await fetch(fullUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          body: JSON.stringify({
            description,
            theme,
            colorScheme,
            fastMode: false,
          }),
          signal: abortController.signal,
        });

        const processingTime = Date.now() - startTime;
        console.log("⏱️ DEBUG HOOK: Processing time:", processingTime + "ms");

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        console.log("📥 DEBUG HOOK: Raw API response:", {
          hasHtml: !!data.html,
          htmlLength: data.html?.length,
          hasFluentComponents:
            data.html?.includes("fluent-button") ||
            data.html?.includes("fluent-text-field"),
          title:
            data.html?.match(/<title>(.*?)<\/title>/)?.[1] || "No title found",
          aiGenerated: data.aiGenerated,
          source: data.source,
          metadata: data.metadata,
        });

        // Check for Fluent components
        const fluentComponentCount = {
          buttons: (data.html?.match(/fluent-button/g) || []).length,
          textFields: (data.html?.match(/fluent-text-field/g) || []).length,
          selects: (data.html?.match(/fluent-select/g) || []).length,
        };

        console.log(
          "🧩 DEBUG HOOK: Fluent component analysis:",
          fluentComponentCount
        );

        setLoadingStage("");

        return {
          html: data.html,
          fallback: false,
          processingTime,
          fromCache: false,
          debug: {
            endpoint: fullUrl,
            fluentComponents: fluentComponentCount,
            title: data.html?.match(/<title>(.*?)<\/title>/)?.[1],
            aiGenerated: data.aiGenerated,
          },
        };
      } catch (err) {
        console.error("❌ DEBUG HOOK: Error:", err);

        if (err instanceof Error && err.name === "AbortError") {
          setError("Request was cancelled");
          throw err;
        }

        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(`Wireframe Generation Failed: ${errorMessage}`);
        throw err;
      } finally {
        setIsLoading(false);
        setLoadingStage("");
        abortControllerRef.current = null;
      }
    },
    []
  );

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    generateWireframe,
    cancelGeneration,
    isLoading,
    error,
    fallback,
    loadingStage,
  };
}
