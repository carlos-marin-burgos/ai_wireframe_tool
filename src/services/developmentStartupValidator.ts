/**
 * Development Startup Validator
 * 
 * This module runs comprehensive validation checks when the application starts
 * in development mode to catch configuration issues early.
 */

import { getValidatedApiConfig, ALL_VALIDATED_ENDPOINTS } from './validatedApiConfig';
import { getApiHealthChecker } from './apiHealthChecker';

interface StartupValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

export class DevelopmentStartupValidator {
  private config = getValidatedApiConfig();
  private healthChecker = getApiHealthChecker();

  /**
   * Run all startup validation checks
   */
  async validateStartup(): Promise<StartupValidationResult> {
    console.log('🚀 Running development startup validation...');
    
    const result: StartupValidationResult = {
      success: true,
      errors: [],
      warnings: [],
      recommendations: [],
    };

    // Check 1: Environment configuration
    this.validateEnvironment(result);

    // Check 2: API endpoint availability
    await this.validateApiEndpoints(result);

    // Check 3: Critical services
    await this.validateCriticalServices(result);

    // Check 4: Development tools
    this.validateDevelopmentTools(result);

    // Generate final report
    this.generateStartupReport(result);

    return result;
  }

  /**
   * Validate environment configuration
   */
  private validateEnvironment(result: StartupValidationResult): void {
    console.log('🔧 Validating environment configuration...');

    // Check base URL configuration
    const baseUrl = this.config.getBaseUrl();
    if (!baseUrl) {
      result.errors.push('API base URL is not configured');
      result.success = false;
    } else if (baseUrl.includes('localhost') && !import.meta.env.DEV) {
      result.warnings.push('Using localhost URL in production build');
    }

    // Check environment variables
    const requiredEnvVars = ['DEV'];
    const missingEnvVars = requiredEnvVars.filter(varName => 
      import.meta.env[varName] === undefined
    );

    if (missingEnvVars.length > 0) {
      result.warnings.push(`Missing environment variables: ${missingEnvVars.join(', ')}`);
    }

    // Check development mode
    if (!import.meta.env.DEV) {
      result.warnings.push('Startup validation running in production mode');
    }
  }

  /**
   * Validate API endpoint availability
   */
  private async validateApiEndpoints(result: StartupValidationResult): Promise<void> {
    console.log('🌐 Validating API endpoints...');

    try {
      const healthCheck = await this.healthChecker.performHealthCheck(ALL_VALIDATED_ENDPOINTS);
      
      if (healthCheck.unavailableEndpoints > 0) {
        const unavailableList = Object.values(healthCheck.endpoints)
          .filter(e => !e.isAvailable)
          .map(e => `${e.endpoint} (${e.error})`)
          .join(', ');

        result.errors.push(`${healthCheck.unavailableEndpoints} API endpoints unavailable: ${unavailableList}`);
        result.success = false;

        result.recommendations.push('Start your Azure Functions with: func start --port 7071');
        result.recommendations.push('Check that all function.json files exist in backend/');
      } else {
        console.log('✅ All API endpoints are available');
      }

      // Check response times
      if (healthCheck.avgResponseTime > 1000) {
        result.warnings.push(`API response times are slow (${healthCheck.avgResponseTime}ms average)`);
        result.recommendations.push('Consider optimizing your Azure Functions or checking network connectivity');
      }

    } catch (error) {
      result.errors.push(`API endpoint validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result.success = false;
    }
  }

  /**
   * Validate critical services
   */
  private async validateCriticalServices(result: StartupValidationResult): Promise<void> {
    console.log('🔧 Validating critical services...');

    // Test wireframe generation endpoint specifically
    try {
      const response = await this.config.safeFetch('/api/generate-wireframe', {
        method: 'POST',
        body: JSON.stringify({
          description: 'Test wireframe for startup validation',
          theme: 'professional',
          colorScheme: 'blue',
          fastMode: true,
        }),
      });

      if (!response.ok) {
        result.warnings.push(`Wireframe generation endpoint returned ${response.status}`);
      } else {
        const data = await response.json();
        if (!data.success || !data.html) {
          result.warnings.push('Wireframe generation endpoint returned invalid response format');
        }
      }
    } catch (error) {
      result.errors.push(`Critical service validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate development tools
   */
  private validateDevelopmentTools(result: StartupValidationResult): void {
    console.log('🛠️ Validating development tools...');

    // Check for common development issues
    if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
      result.warnings.push('Using HTTP in non-localhost environment (consider HTTPS)');
    }

    // Check browser capabilities
    if (!window.fetch) {
      result.errors.push('Browser does not support fetch API');
      result.success = false;
    }

    if (!window.AbortController) {
      result.warnings.push('Browser does not support AbortController (request cancellation disabled)');
    }
  }

  /**
   * Generate and display startup report
   */
  private generateStartupReport(result: StartupValidationResult): void {
    console.log('\n🎯 Development Startup Validation Report:');
    console.log('=' .repeat(50));

    if (result.success) {
      console.log('✅ All critical validations passed');
    } else {
      console.error('❌ Critical validation failures detected');
    }

    if (result.errors.length > 0) {
      console.error('\n❌ Errors:');
      result.errors.forEach((error, index) => {
        console.error(`  ${index + 1}. ${error}`);
      });
    }

    if (result.warnings.length > 0) {
      console.warn('\n⚠️ Warnings:');
      result.warnings.forEach((warning, index) => {
        console.warn(`  ${index + 1}. ${warning}`);
      });
    }

    if (result.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      result.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
    }

    console.log('\n' + '='.repeat(50));

    if (!result.success) {
      console.error('⚠️ Application may not function correctly until these issues are resolved.');
    } else {
      console.log('🚀 Application is ready for development!');
    }
  }

  /**
   * Start continuous validation monitoring
   */
  startContinuousValidation(): () => void {
    const stopHealthMonitoring = this.healthChecker.startHealthMonitoring(ALL_VALIDATED_ENDPOINTS, 10);
    
    return () => {
      stopHealthMonitoring();
    };
  }
}

// Auto-run startup validation in development
let validationPromise: Promise<StartupValidationResult> | null = null;

export async function runStartupValidation(): Promise<StartupValidationResult> {
  if (!validationPromise) {
    const validator = new DevelopmentStartupValidator();
    validationPromise = validator.validateStartup();
  }
  return validationPromise;
}

// Auto-run if in development mode
if (import.meta.env.DEV) {
  runStartupValidation().catch(error => {
    console.error('Startup validation failed:', error);
  });
}