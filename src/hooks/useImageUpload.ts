/**
 * Unified Image Upload Hook
 * Centra  // Handle file upload (just logging, actual processing in handleAnalyzeImage)
  const handleImageUpload = useCallback(
    (file: File) => {
      console.log("📁 Image uploaded:", file.name, "Size:", file.size);
      clearState();
      // File processing happens in ImageUploadZone for preview
      // Actual wireframe generation happens in handleAnalyzeImage
    },
    [clearState]
  );oad logic and state management for consistent behavior
 * across all components (LandingPage, SplitLayout, etc.)
 */

import { useState, useCallback } from "react";
import { getApiUrl } from "../config/api";

interface ImageUploadState {
  isAnalyzing: boolean;
  error: string | null;
  success: string | null;
}

interface ImageUploadResult {
  success: boolean;
  html: string;
  description?: string;
  error?: string;
}

export const useImageUpload = (
  designTheme?: string,
  colorScheme?: string,
  onSuccess?: (html: string, description: string) => void,
  onError?: (error: string) => void
) => {
  const [state, setState] = useState<ImageUploadState>({
    isAnalyzing: false,
    error: null,
    success: null,
  });

  const clearState = useCallback(() => {
    setState({
      isAnalyzing: false,
      error: null,
      success: null,
    });
  }, []);

  // Handle file upload (just logging, actual processing in handleAnalyzeImage)
  const handleImageUpload = useCallback(
    (file: File) => {
      console.log(
        "� [DEBUG] Unified hook handleImageUpload called:",
        file.name,
        "Size:",
        file.size
      );
      clearState();
      // File processing happens in ImageUploadZone for preview
      // Actual wireframe generation happens in handleAnalyzeImage
    },
    [clearState]
  );

  // Main image analysis function - converts image to wireframe
  const handleAnalyzeImage = useCallback(
    async (imageUrl: string, fileName: string) => {
      console.log(
        "🔍 Starting unified image-to-wireframe conversion:",
        fileName,
        "Size:",
        imageUrl.length,
        "bytes"
      );

      setState((prev) => ({
        ...prev,
        isAnalyzing: true,
        error: null,
        success: null,
      }));

      try {
        // Use the unified direct image-to-wireframe conversion endpoint
        const response = await fetch(
          getApiUrl("/api/direct-image-to-wireframe"),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: imageUrl, // Base64 image data
              designTheme: designTheme || "microsoftlearn",
              colorScheme: colorScheme || "light",
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Image analysis failed: ${response.status}`
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Image analysis failed");
        }

        console.log(
          "✅ Unified image-to-wireframe conversion completed successfully"
        );

        const description =
          result.description ||
          `Pixel-perfect wireframe generated from uploaded image: ${fileName}. Preserves exact colors, text, and layout from the original design.`;

        setState((prev) => ({
          ...prev,
          isAnalyzing: false,
          success: `Successfully generated wireframe from ${fileName}!`,
        }));

        // Call success callback
        const html = result.data?.html;
        if (onSuccess && html) {
          onSuccess(html, description);
        }

        return { success: true, html, description };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to analyze image";

        console.error(
          "❌ Unified image-to-wireframe conversion failed:",
          errorMessage
        );

        setState((prev) => ({
          ...prev,
          isAnalyzing: false,
          error: errorMessage,
        }));

        // Call error callback
        if (onError) {
          onError(errorMessage);
        }

        throw error;
      }
    },
    [designTheme, colorScheme, onSuccess, onError]
  );

  // Test if image analysis API is available
  const testImageAnalysisAPI = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(getApiUrl("/api/health"), {
        method: "GET",
      });

      return response.ok;
    } catch (error) {
      console.warn("Image analysis API health check failed:", error);
      return false;
    }
  }, []);

  return {
    // State
    isAnalyzing: state.isAnalyzing,
    error: state.error,
    success: state.success,

    // Actions
    handleImageUpload,
    handleAnalyzeImage,
    clearState,
    testImageAnalysisAPI,
  };
};

export default useImageUpload;
