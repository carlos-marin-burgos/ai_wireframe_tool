/**
 * Validated API Configuration System
 * 
 * This module provides a centralized, validated API configuration that prevents
 * endpoint mismatches by validating endpoints at build time and runtime.
 * 
 * Features:
 * - Type-safe endpoint definitions
 * - Runtime endpoint validation
 * - Automatic fallback mechanisms
 * - Development warnings for misconfigurations
 * - Build-time endpoint checking
 */

import { getApiValidator } from './apiEndpointValidator';
import { getApiHealthChecker } from './apiHealthChecker';

// Define the actual available Azure Functions endpoints
// This should match the actual function.json files in the backend
const ACTUAL_AZURE_FUNCTIONS = [
  '/api/generate-wireframe',
  '/api/generate-suggestions', 
  '/api/figmaOAuthCallback',
  '/api/figmaOAuthStart',
  '/api/figmaOAuthDiagnostics',
  '/api/githubAuthCallback',
  '/api/githubAuthStart',
  '/api/health',
  // Add more as needed based on your backend/function.json files
] as const;

// Type for validated endpoints
type ValidatedEndpoint = typeof ACTUAL_AZURE_FUNCTIONS[number];

// Endpoint categories for better organization
interface EndpointCategories {
  AI_GENERATION: {
    GENERATE_WIREFRAME: ValidatedEndpoint;
    GENERATE_SUGGESTIONS: ValidatedEndpoint;
  };
  AUTHENTICATION: {
    FIGMA_OAUTH_START: ValidatedEndpoint;
    FIGMA_OAUTH_CALLBACK: ValidatedEndpoint;
    FIGMA_OAUTH_DIAGNOSTICS: ValidatedEndpoint;
    GITHUB_AUTH_START: ValidatedEndpoint;
    GITHUB_AUTH_CALLBACK: ValidatedEndpoint;
  };
  SYSTEM: {
    HEALTH: ValidatedEndpoint;
  };
}

// Validated endpoint configuration
export const VALIDATED_API_ENDPOINTS: EndpointCategories = {
  AI_GENERATION: {
    GENERATE_WIREFRAME: '/api/generate-wireframe',
    GENERATE_SUGGESTIONS: '/api/generate-suggestions',
  },
  AUTHENTICATION: {
    FIGMA_OAUTH_START: '/api/figmaOAuthStart',
    FIGMA_OAUTH_CALLBACK: '/api/figmaOAuthCallback',
    FIGMA_OAUTH_DIAGNOSTICS: '/api/figmaOAuthDiagnostics',
    GITHUB_AUTH_START: '/api/githubAuthStart',
    GITHUB_AUTH_CALLBACK: '/api/githubAuthCallback',
  },
  SYSTEM: {
    HEALTH: '/api/health',
  },
};

// Flattened endpoints array for validation
export const ALL_VALIDATED_ENDPOINTS: string[] = Object.values(VALIDATED_API_ENDPOINTS)
  .flatMap(category => Object.values(category)) as string[];

// Base URL configuration with validation
export class ValidatedApiConfig {
  private baseUrl: string;
  private validator = getApiValidator();
  private healthChecker = getApiHealthChecker();
  private isValidated = false;

  constructor() {
    this.baseUrl = this.determineBaseUrl();
  }

  private determineBaseUrl(): string {
    // Priority: environment variable > development default > production fallback
    const envUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    const devUrl = 'http://localhost:7071';
    const prodUrl = window.location.origin;

    if (envUrl) {
      console.log('🔧 Using API base URL from environment:', envUrl);
      return envUrl;
    }

    if (import.meta.env.DEV) {
      console.log('🔧 Using development API base URL:', devUrl);
      return devUrl;
    }

    console.log('🔧 Using production API base URL:', prodUrl);
    return prodUrl;
  }

  /**
   * Get the base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Get a validated endpoint URL
   */
  async getEndpoint(endpoint: ValidatedEndpoint): Promise<string> {
    if (!this.isValidated) {
      await this.validateConfiguration();
    }

    return this.validator.getValidatedEndpoint(endpoint);
  }

  /**
   * Make a safe API call with automatic endpoint validation
   */
  async safeFetch(endpoint: ValidatedEndpoint, options: RequestInit = {}): Promise<Response> {
    if (!this.isValidated) {
      await this.validateConfiguration();
    }

    return this.validator.safeFetch(endpoint, options);
  }

  /**
   * Validate the entire API configuration
   */
  async validateConfiguration(): Promise<boolean> {
    console.log('🔍 Validating API configuration...');
    
    try {
      const healthCheck = await this.healthChecker.performHealthCheck(ALL_VALIDATED_ENDPOINTS);
      
      if (healthCheck.unavailableEndpoints > 0) {
        console.warn('⚠️ Some API endpoints are not available. Application may have limited functionality.');
        
        // In development, this is more serious
        if (import.meta.env.DEV) {
          console.error('❌ API validation failed in development mode.');
          console.error('💡 Make sure your Azure Functions are running on the correct port.');
          console.error('💡 Check that all function.json files match the VALIDATED_API_ENDPOINTS configuration.');
        }
        
        this.isValidated = false;
        return false;
      }

      console.log('✅ API configuration validation successful');
      this.isValidated = true;
      return true;
      
    } catch (error) {
      console.error('❌ API configuration validation failed:', error);
      this.isValidated = false;
      return false;
    }
  }

  /**
   * Get configuration health report
   */
  async getHealthReport(): Promise<string> {
    return this.healthChecker.exportHealthReport(ALL_VALIDATED_ENDPOINTS);
  }

  /**
   * Reset validation state (useful for development)
   */
  resetValidation(): void {
    this.isValidated = false;
    this.validator.clearCache();
    console.log('🔄 API validation state reset');
  }

  /**
   * Check if configuration is validated
   */
  isConfigurationValidated(): boolean {
    return this.isValidated;
  }
}

// Singleton instance
let apiConfigInstance: ValidatedApiConfig | null = null;

export function getValidatedApiConfig(): ValidatedApiConfig {
  if (!apiConfigInstance) {
    apiConfigInstance = new ValidatedApiConfig();
  }
  return apiConfigInstance;
}

// Convenience functions for common operations
export async function makeValidatedApiCall(
  endpoint: ValidatedEndpoint, 
  options: RequestInit = {}
): Promise<Response> {
  const config = getValidatedApiConfig();
  return config.safeFetch(endpoint, options);
}

export async function getValidatedEndpointUrl(endpoint: ValidatedEndpoint): Promise<string> {
  const config = getValidatedApiConfig();
  return config.getEndpoint(endpoint);
}

// Development helper to check if an endpoint exists
export function isEndpointValidated(endpoint: string): endpoint is ValidatedEndpoint {
  return ALL_VALIDATED_ENDPOINTS.includes(endpoint as ValidatedEndpoint);
}

// Export types and constants
export type { ValidatedEndpoint, EndpointCategories };
export { ACTUAL_AZURE_FUNCTIONS };