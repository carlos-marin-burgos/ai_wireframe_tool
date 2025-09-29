/**
 * Unified Image Upload Hook
 * Centralized logic and state management for consistent behavior
 * across all components (LandingPage, SplitLayout, etc.)
 */

import { useState, useCallback } from "react";
import { getApiUrl, API_CONFIG } from "../config/api";

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
      console.log("📁 Image uploaded:", file.name, "Size:", file.size);
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
        "🔍 Starting enhanced image-to-wireframe conversion:",
        fileName,
        "Size:",
        imageUrl.length,
        "bytes"
      );

      setState((prev) => ({
        ...prev,
        isAnalyzing: true,
        error: null,
      }));

      try {
        // Convert data URL to base64 (remove data:image/...;base64, prefix)
        const base64Match = imageUrl.match(/^data:image\/[^;]+;base64,(.+)$/);
        if (!base64Match) {
          throw new Error(
            "Invalid image format. Please upload a valid image file."
          );
        }

        const base64Image = base64Match[1];

        // Use the enhanced direct image-to-wireframe conversion endpoint
        const response = await fetch(
          getApiUrl(API_CONFIG.ENDPOINTS.DIRECT_IMAGE_TO_WIREFRAME),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              imageBase64: base64Image,
              fileName: fileName,
              designTheme: designTheme || "microsoftlearn",
              colorScheme: colorScheme || "light",
              options: {
                extractColors: true,
                generateResponsive: true,
                preserveLayout: true,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              errorData.error ||
              `Image analysis failed: ${response.status}`
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || result.error || "Image analysis failed"
          );
        }

        console.log(
          "✅ Enhanced image-to-wireframe conversion completed successfully"
        );

        setState((prev) => ({
          ...prev,
          isAnalyzing: false,
          success: "Image successfully converted to wireframe!",
        }));

        // Extract HTML from the response (handle both direct html and data.html)
        const html = result.data?.html || result.html;
        if (!html) {
          throw new Error("No HTML wireframe was generated from the image");
        }

        // Call success callback with the generated HTML and description
        const description = `Wireframe generated from ${fileName} - Colors and layout preserved from original image`;
        if (onSuccess) {
          onSuccess(html, description);
        }

        return {
          success: true,
          html: html,
          description: description,
        };
      } catch (error) {
        console.error(
          "❌ Enhanced image-to-wireframe conversion failed:",
          error
        );

        const errorMessage =
          error instanceof Error ? error.message : "Image analysis failed";

        setState((prev) => ({
          ...prev,
          isAnalyzing: false,
          error: errorMessage,
        }));

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
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.HEALTH));
      return response.ok;
    } catch (error) {
      console.warn("Image analysis API health check failed:", error);
      return false;
    }
  }, []);

  return {
    ...state,
    isAnalyzing: state.isAnalyzing,
    error: state.error,
    success: state.success,
    handleImageUpload,
    handleAnalyzeImage,
    clearState,
    testImageAnalysisAPI,
  };
};

export default useImageUpload;
