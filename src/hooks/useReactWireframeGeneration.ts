import React, { useState, useCallback } from "react";
import { API_CONFIG } from "../config/api";
import { api } from "../utils/apiClient";

interface ReactWireframeResponse {
  component: string;
  success: boolean;
  error?: string;
  processingTime?: number;
}

export const useReactWireframeGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState(0);

  const generateReactWireframe = useCallback(async (description: string) => {
    console.log('🎨 Generating React wireframe for:', description);
    
    setIsLoading(true);
    setError(null);
    
    try {
      const startTime = Date.now();
      
      const response = await api.post<ReactWireframeResponse>(
        API_CONFIG.ENDPOINTS.GENERATE_WIREFRAME,
        { description },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      const endTime = Date.now();
      setProcessingTime(endTime - startTime);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate React wireframe');
      }
      
      console.log('✅ React wireframe generated successfully');
      return response.component;
      
    } catch (err) {
      console.error('❌ React wireframe generation failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    generateReactWireframe,
    isLoading,
    error,
    processingTime,
  };
};
