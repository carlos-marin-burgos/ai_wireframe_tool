// API configuration for different environments
const isDevelopment = import.meta.env.DEV;
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "[::1]");

// Environment detection - removed hardcoded production domain for flexibility
const isProduction = !isDevelopment && !isLocalhost;

// Always use Static Web App proxy for production when on Static Web App hostname
const STATIC_WEB_APP_HOSTS = new Set([
  "delightful-pond-064d9a91e.1.azurestaticapps.net",
]);

const productionHostFallback =
  typeof window !== "undefined" &&
  STATIC_WEB_APP_HOSTS.has(window.location.hostname)
    ? "" // Use relative URLs for Static Web App proxy
    : undefined;

// Centralized port configuration to avoid conflicts
const PORTS = {
  development: {
    primary: 7071, // Azure Functions backend (current running port) - FIXED: Updated to match actual backend
    fallback: 5001, // Clean Express server with NO Microsoft Learn content
    frontend: 5173, // Frontend dev server
  },
  production: {
    primary: 443,
    frontend: 443,
  },
};

// Read the actual backend port from state files
const getBackendPortFromState = (): number | null => {
  if (typeof window === "undefined") return null; // Server-side rendering

  try {
    // Try to read from localStorage cache first (faster)
    const cachedPort = localStorage.getItem("designetica_backend_port");
    const cacheTime = localStorage.getItem("designetica_backend_port_time");
    const now = Date.now();

    // Use cached port if it's less than 10 seconds old
    if (cachedPort && cacheTime && now - parseInt(cacheTime) < 10000) {
      return parseInt(cachedPort);
    }

    // Clear stale cache
    if (cachedPort) {
      localStorage.removeItem("designetica_backend_port");
      localStorage.removeItem("designetica_backend_port_time");
    }
  } catch (error) {
    console.warn("Failed to read cached backend port:", error);
  }

  return null;
};

// Cache the detected backend port
const cacheBackendPort = (port: number) => {
  try {
    localStorage.setItem("designetica_backend_port", port.toString());
    localStorage.setItem(
      "designetica_backend_port_time",
      Date.now().toString()
    );
  } catch (error) {
    console.warn("Failed to cache backend port:", error);
  }
};

// Get the actual base URL that will be used
const getActualBaseUrl = () => {
  if (productionHostFallback) return productionHostFallback;
  if (import.meta.env.VITE_API_BASE_URL)
    return import.meta.env.VITE_API_BASE_URL;

  if (isDevelopment || isLocalhost) {
    // Try to get the actual backend port
    const detectedPort = getBackendPortFromState();
    if (detectedPort && detectedPort !== PORTS.development.primary) {
      console.log(
        `🔄 Using detected backend port: ${detectedPort} (instead of default ${PORTS.development.primary})`
      );
      return `http://localhost:${detectedPort}`;
    }
    return ""; // Use relative URLs to leverage Vite proxy in development
  }

  return ""; // Fallback to relative URLs
};

console.log("🔍 API Configuration:", {
  isDevelopment,
  isLocalhost,
  isProduction,
  hostname: typeof window !== "undefined" ? window.location.hostname : "server",
  actualBaseUrl: getActualBaseUrl(),
  hasProductionFallback: Boolean(productionHostFallback),
  willUseDirectFunctionApp: Boolean(productionHostFallback),
  finalBaseURL: getActualBaseUrl(),
});

export const API_CONFIG = {
  // Static configuration - Enhanced Microsoft ecosystem suggestions
  FALLBACK_SUGGESTIONS: [
    // Azure & Cloud Services
    "Create an Azure dashboard with service monitoring and resource management",
    "Design Azure certification journey pages with exam codes (AZ-900, AZ-104, AZ-204, AZ-305)",
    "Build cloud training dashboard with module completion tracking and time estimates",
    "Add skills assessment portal with technology-specific evaluation paths",

    // Documentation & Content
    "Generate Microsoft Docs-style API reference pages with code samples and Try It buttons",
    "Create training module structure with objectives, knowledge checks, and summary",
    "Design hands-on lab interface with Azure sandbox environment integration",
    "Build Q&A community pages with expert answers and voting system",

    // Product-Specific Content
    "Design Azure services catalog with pricing, regions, and getting started tutorials",
    "Create Microsoft 365 admin center with role-based permissions guides",
    "Build Power Platform center with app templates and connector documentation",
    "Generate Visual Studio Code extension marketplace with development tutorials",

    // Career & Professional Development
    "Create career path explorer with job role requirements and skill mapping",
    "Design certification preparation hub with study guides, practice exams, and community forums",
    "Build professional profile dashboard with achievements, transcripts, and learning streaks",
    "Add mentorship platform connecting learners with industry experts",

    // Interactive Learning
    "Generate interactive tutorials with step-by-step Azure portal guidance",
    "Create code playground with live compilation and Azure resource deployment",
    "Design assessment engine with adaptive questioning and personalized feedback",
    "Build virtual labs with real Azure environments and guided exercises",
  ],

  ENDPOINTS: {
    // ✨ AI Wireframe Generation - Using the correct Azure Function endpoint
    GENERATE_WIREFRAME: "/api/generate-wireframe",
    GENERATE_REACT_COMPONENT: "/api/generate-react-component", // Integrated React component generation
    GENERATE_WIREFRAME_ENHANCED: "/api/generate-wireframe",
    GENERATE_FLUENT_WIREFRAME: "/api/generate-fluent-wireframe",
    GENERATE_SUGGESTIONS: "/api/generate-suggestions",
    GET_TEMPLATE: "/api/get-template",
    COMPONENT_LIBRARY: "/api/component-library",
    FLUENT_COMPONENTS: "/api/fluent-components",
    FLUENT_COMPONENTS_SEARCH: "/api/fluent-components/search",
    HEALTH: "/api/health",
    WEBSITE_ANALYZER: "/api/websiteAnalyzer", // Website structure analysis

    // 🖼️ Direct Image-to-Wireframe Generation
    DIRECT_IMAGE_TO_WIREFRAME: "/api/direct-image-to-wireframe",

    // 🔐 OAuth endpoints (align with Azure Function routes which are lowercase)
    FIGMA_OAUTH_STATUS: "/api/figmaoauthstatus",
    FIGMA_OAUTH_START: "/api/figmaoauthstart",
    FIGMA_OAUTH_CALLBACK: "/api/figmaoauthcallback",
    FIGMA_OAUTH_DIAGNOSTICS: "/api/figmaoauthdiagnostics",
    FIGMA_COMPONENTS: "/api/figma/components",
  },

  // Port configuration
  PORTS,

  // FIXED: Use proper URL for different environments
  // In production, Azure Static Web Apps automatically proxy /api/* to the Function App
  // In development, use local Azure Functions port
  BASE_URL: getActualBaseUrl(),
};

// Health check to verify backend has AI capabilities
export const verifyBackendAI = async (baseUrl: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${baseUrl}/api/generate-wireframe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description:
          "Create a certification preparation dashboard with Azure exam tracking, study progress analytics, hands-on lab access, and personalized learning path recommendations",
        fastMode: false,
        useTemplates: false,
        aiOnly: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data.aiGenerated === true && data.source?.includes("openai");
    }
    return false;
  } catch (error) {
    console.warn("Backend AI verification failed:", error);
    return false;
  }
};

// Auto-detect working backend (can be called at runtime)
export const detectWorkingBackend = async (): Promise<string> => {
  if (!isDevelopment && !isLocalhost) {
    return API_CONFIG.BASE_URL;
  }

  // Check cache first
  const cachedPort = getBackendPortFromState();
  if (cachedPort) {
    const testUrl = `http://localhost:${cachedPort}`;
    try {
      const healthResponse = await fetch(`${testUrl}/api/health`, {
        method: "GET",
        signal: AbortSignal.timeout(2000),
      });

      if (healthResponse.ok) {
        console.log(`✅ Using cached backend port: ${cachedPort}`);
        return testUrl;
      } else {
        // Cache is stale, clear it
        localStorage.removeItem("designetica_backend_port");
        localStorage.removeItem("designetica_backend_port_time");
      }
    } catch (error) {
      console.log(
        `❌ Cached port ${cachedPort} no longer available, detecting...`
      );
      localStorage.removeItem("designetica_backend_port");
      localStorage.removeItem("designetica_backend_port_time");
    }
  }

  // Detect available ports
  const portsToTest = [PORTS.development.primary, PORTS.development.fallback];

  // Add some common Azure Functions ports
  const additionalPorts = [7072, 7073, 7074, 7075];
  portsToTest.push(...additionalPorts);

  for (const port of portsToTest) {
    const testUrl = `http://localhost:${port}`;
    try {
      // Test health endpoint first
      const healthResponse = await fetch(`${testUrl}/api/health`, {
        method: "GET",
        signal: AbortSignal.timeout(2000),
      });

      if (healthResponse.ok) {
        // Test AI capabilities
        const hasAI = await verifyBackendAI(testUrl);
        if (hasAI) {
          console.log(`✅ AI-enabled backend detected on port ${port}`);
          cacheBackendPort(port);

          // Update Vite proxy if needed (for dev environment)
          if (port !== PORTS.development.primary) {
            console.log(
              `🔄 Backend running on port ${port}, different from default ${PORTS.development.primary}`
            );
            console.log(
              `💡 Consider restarting frontend dev server or using: npm run dev`
            );
          }

          return testUrl;
        } else {
          console.log(`⚠️ Backend on port ${port} has no AI capabilities`);
        }
      }
    } catch (error) {
      console.log(`❌ Port ${port} not available:`, error.message);
    }
  }

  console.warn("⚠️ No AI-enabled backend detected, using primary port");
  return `http://localhost:${PORTS.development.primary}`;
};

// Automatic backend startup for development
export const autoStartBackendIfNeeded = async (): Promise<boolean> => {
  if (!isDevelopment && !isLocalhost) {
    return true; // Production doesn't need auto-start
  }

  try {
    // First check if backend is already running
    const workingBackend = await detectWorkingBackend();
    const isAlreadyRunning = workingBackend.includes("localhost");

    if (isAlreadyRunning) {
      // Verify it's actually responding
      const healthResponse = await fetch(`${workingBackend}/api/health`, {
        method: "GET",
        signal: AbortSignal.timeout(3000),
      });

      if (healthResponse.ok) {
        console.log("✅ Backend already running and healthy");
        return true;
      }
    }

    console.log("🚀 Backend not detected, providing startup guidance...");

    // Show user-friendly notification with auto-detection
    if (typeof window !== "undefined") {
      console.log("🔄 No backend detected - showing startup guidance...");

      // Create a helpful status notification
      const statusElement = document.createElement("div");
      statusElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #0078d4, #005a9e);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        max-width: 320px;
        cursor: pointer;
        transition: all 0.3s ease;
      `;

      statusElement.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 8px;">🚀 Backend Startup Required</div>
        <div style="font-size: 12px; opacity: 0.9; margin-bottom: 12px;">Backend services are not running. Click to copy the startup command:</div>
        <div style="background: rgba(255,255,255,0.15); padding: 8px 12px; border-radius: 6px; font-family: 'Monaco', 'Consolas', monospace; font-size: 11px;">./start-backend.sh</div>
        <div style="font-size: 11px; opacity: 0.8; margin-top: 8px;">Click to copy • Auto-dismisses in 15s</div>
      `;

      document.body.appendChild(statusElement);

      // Add hover effect
      statusElement.onmouseenter = () => {
        statusElement.style.transform = "translateY(-2px)";
        statusElement.style.boxShadow = "0 12px 32px rgba(0,0,0,0.2)";
      };
      statusElement.onmouseleave = () => {
        statusElement.style.transform = "translateY(0)";
        statusElement.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
      };

      // Copy command on click
      statusElement.onclick = () => {
        navigator.clipboard
          ?.writeText("./start-backend.sh")
          .then(() => {
            statusElement.innerHTML = `
            <div style="text-align: center;">
              <div style="font-weight: 600; margin-bottom: 8px;">📋 Copied!</div>
              <div style="font-size: 12px; opacity: 0.9;">Run the command in your terminal</div>
            </div>
          `;
            statusElement.style.background =
              "linear-gradient(135deg, #107c10, #004b1c)";

            setTimeout(() => {
              if (statusElement.parentElement) {
                statusElement.style.opacity = "0";
                statusElement.style.transform = "translateY(-20px)";
                setTimeout(() => document.body.removeChild(statusElement), 300);
              }
            }, 2000);
          })
          .catch(() => {
            statusElement.innerHTML = `
            <div style="text-align: center;">
              <div style="font-weight: 600; margin-bottom: 8px;">⚠️ Copy Failed</div>
              <div style="font-size: 11px;">Please run: ./start-backend.sh</div>
            </div>
          `;
          });
      };

      // Auto-dismiss after 15 seconds
      setTimeout(() => {
        if (statusElement.parentElement) {
          statusElement.style.opacity = "0";
          statusElement.style.transform = "translateY(-20px)";
          setTimeout(() => document.body.removeChild(statusElement), 300);
        }
      }, 15000);

      // Periodically check if backend comes online
      let checkCount = 0;
      const checkInterval = setInterval(async () => {
        checkCount++;
        if (checkCount > 30) {
          // Stop checking after 30 attempts (5 minutes)
          clearInterval(checkInterval);
          return;
        }

        try {
          const newWorkingBackend = await detectWorkingBackend();
          const isNowRunning = newWorkingBackend.includes("localhost");

          if (isNowRunning) {
            const healthResponse = await fetch(
              `${newWorkingBackend}/api/health`,
              {
                method: "GET",
                signal: AbortSignal.timeout(2000),
              }
            );

            if (healthResponse.ok) {
              clearInterval(checkInterval);

              if (statusElement.parentElement) {
                statusElement.innerHTML = `
                  <div style="text-align: center;">
                    <div style="font-weight: 600; margin-bottom: 8px;">✅ Backend Online!</div>
                    <div style="font-size: 12px; opacity: 0.9;">Ready for wireframe generation</div>
                  </div>
                `;
                statusElement.style.background =
                  "linear-gradient(135deg, #107c10, #004b1c)";
                statusElement.style.cursor = "default";
                statusElement.onclick = null;
                statusElement.onmouseenter = null;
                statusElement.onmouseleave = null;

                setTimeout(() => {
                  if (statusElement.parentElement) {
                    statusElement.style.opacity = "0";
                    statusElement.style.transform = "translateY(-20px)";
                    setTimeout(
                      () => document.body.removeChild(statusElement),
                      300
                    );
                  }
                }, 3000);
              }

              console.log("✅ Backend detected and verified!");
              return true;
            }
          }
        } catch (error) {
          // Continue checking
        }
      }, 10000); // Check every 10 seconds
    }

    return false;
  } catch (error) {
    console.warn("❌ Auto-startup check failed:", error);
    return false;
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string, customBaseUrl?: string) => {
  const baseUrl = customBaseUrl || API_CONFIG.BASE_URL;
  const finalUrl = `${baseUrl}${endpoint}`;

  // Debug logging for Figma endpoints
  if (endpoint.includes("figma")) {
    console.log(`🔍 getApiUrl Debug:`, {
      endpoint,
      customBaseUrl,
      baseUrl,
      API_CONFIG_BASE_URL: API_CONFIG.BASE_URL,
      finalUrl,
      productionHostFallback:
        typeof window !== "undefined" &&
        STATIC_WEB_APP_HOSTS.has(window.location.hostname)
          ? "https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net"
          : undefined,
    });
  }

  return finalUrl;
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  timeout = 90000, // Increased to 90 seconds for OpenAI rate limiting
  maxRetries = 2 // Reduced retries since backend already handles retries
) => {
  let retries = 0;
  let lastError: Error | null = null;

  while (retries <= maxRetries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Get the current API URL
      let apiUrl = getApiUrl(endpoint);

      // If this is a retry or we're in development, try to detect the working backend
      if (retries > 0 || (isDevelopment && endpoint.startsWith("/api/"))) {
        const workingBackend = await detectWorkingBackend();
        if (workingBackend !== API_CONFIG.BASE_URL) {
          apiUrl = `${workingBackend}${endpoint}`;
          console.log(`🔄 Retry ${retries}: Using detected backend: ${apiUrl}`);
        }
      }

      const response = await fetch(apiUrl, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();

        // Check for specific port-related errors
        if (response.status === 503 || errorText.includes("ECONNREFUSED")) {
          console.warn(
            `🔴 Backend connection failed (${response.status}): ${errorText}`
          );

          // Clear cached port if connection failed
          if (typeof window !== "undefined") {
            localStorage.removeItem("designetica_backend_port");
            localStorage.removeItem("designetica_backend_port_time");
          }

          throw new Error(
            `Backend connection failed: ${response.status} - ${errorText}`
          );
        }

        throw new Error(
          `API request failed: ${response.status} ${response.statusText}\n${errorText}`
        );
      }

      console.log(`✅ API request successful: ${endpoint}`);
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error as Error;

      console.warn(
        `⚠️ API request failed (attempt ${retries + 1}/${maxRetries + 1}):`,
        {
          endpoint,
          error: error instanceof Error ? error.message : String(error),
          retries,
          willRetry: retries < maxRetries,
        }
      );

      retries++;

      if (retries <= maxRetries) {
        // Exponential backoff with jitter
        const delay = Math.min(
          1000 * Math.pow(2, retries) + Math.random() * 1000,
          5000
        );
        console.log(`⏳ Retrying in ${delay.toFixed(0)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  const errorMessage = `API request failed after ${maxRetries + 1} attempts: ${
    lastError?.message || "Unknown error"
  }`;
  console.error(`🔴 ${errorMessage}`);
  throw new Error(errorMessage);
};

// ================================================================================
// 🚨 COMPREHENSIVE AUTO-RECOVERY SYSTEM
// ================================================================================

interface RecoveryScenario {
  name: string;
  description: string;
  detection: () => Promise<boolean>;
  recovery: () => Promise<boolean>;
  priority: number; // 1 = highest priority
  cooldown: number; // milliseconds between recovery attempts
}

interface SystemHealth {
  backend: "healthy" | "degraded" | "down";
  ai: "healthy" | "degraded" | "down";
  network: "healthy" | "degraded" | "down";
  frontend: "healthy" | "degraded" | "down";
  lastCheck: Date;
}

class AutoRecoverySystem {
  private static instance: AutoRecoverySystem;
  private isMonitoring = false;
  private lastRecoveryAttempts = new Map<string, number>();
  private systemHealth: SystemHealth = {
    backend: "down",
    ai: "down",
    network: "healthy",
    frontend: "healthy",
    lastCheck: new Date(),
  };

  static getInstance(): AutoRecoverySystem {
    if (!AutoRecoverySystem.instance) {
      AutoRecoverySystem.instance = new AutoRecoverySystem();
    }
    return AutoRecoverySystem.instance;
  }

  private scenarios: RecoveryScenario[] = [
    {
      name: "backend_down",
      description: "Backend services are not responding",
      priority: 1,
      cooldown: 30000, // 30 seconds
      detection: async () => {
        try {
          const workingBackend = await detectWorkingBackend();
          const response = await fetch(`${workingBackend}/api/health`, {
            signal: AbortSignal.timeout(5000),
          });
          return !response.ok;
        } catch {
          return true; // Backend is down
        }
      },
      recovery: async () => {
        return this.showRecoveryNotification({
          title: "🚀 Backend Services Down",
          message: "Backend services need to be restarted",
          command: "./auto-recovery.sh fix-backend",
          type: "backend",
        });
      },
    },
    {
      name: "ai_service_down",
      description: "AI/OpenAI services are not responding",
      priority: 2,
      cooldown: 60000, // 1 minute
      detection: async () => {
        try {
          const workingBackend = await detectWorkingBackend();
          const response = await fetch(`${workingBackend}/api/openai-health`, {
            signal: AbortSignal.timeout(10000),
          });
          if (!response.ok) return true;

          const health = await response.json();
          return health.status !== "healthy";
        } catch {
          return true; // AI service is down
        }
      },
      recovery: async () => {
        return this.showRecoveryNotification({
          title: "🤖 AI Services Issue",
          message: "OpenAI/AI services may be experiencing issues",
          command: "./auto-recovery.sh fix-ai",
          type: "ai",
          additionalInfo:
            "This will restart Azure Functions with fresh AI connections",
        });
      },
    },
    {
      name: "port_conflict",
      description: "Backend running on wrong port (Vite proxy mismatch)",
      priority: 3,
      cooldown: 15000, // 15 seconds
      detection: async () => {
        const cachedPort = getBackendPortFromState();
        if (!cachedPort) return false;

        // Check if Vite proxy and backend port match
        const expectedPort = PORTS.development.primary;
        return cachedPort !== expectedPort;
      },
      recovery: async () => {
        return this.showRecoveryNotification({
          title: "🔄 Port Conflict Detected",
          message: "Backend is running on a different port than expected",
          command: "./auto-recovery.sh fix-ports",
          type: "port",
          additionalInfo: "This will restart backend on the correct port",
        });
      },
    },
    {
      name: "memory_leak",
      description: "Backend consuming excessive memory",
      priority: 4,
      cooldown: 120000, // 2 minutes
      detection: async () => {
        try {
          const workingBackend = await detectWorkingBackend();
          const response = await fetch(`${workingBackend}/api/health`, {
            signal: AbortSignal.timeout(5000),
          });
          if (!response.ok) return false;

          const health = await response.json();
          const memoryUsageMB = health.system?.memoryUsage?.rss / 1024 / 1024;
          return memoryUsageMB > 500; // > 500MB indicates potential memory leak
        } catch {
          return false;
        }
      },
      recovery: async () => {
        return this.showRecoveryNotification({
          title: "🧠 Memory Usage High",
          message: "Backend is consuming excessive memory",
          command: "./restart-functions.sh",
          type: "memory",
          additionalInfo: "This will restart backend to free up memory",
        });
      },
    },
    {
      name: "stale_processes",
      description: "Orphaned backend processes detected",
      priority: 5,
      cooldown: 180000, // 3 minutes
      detection: async () => {
        // This would require a backend endpoint to check for orphaned processes
        // For now, we'll check if multiple ports are responding
        let activePortCount = 0;
        for (const port of [7071, 7072, 7073, 7074, 7075]) {
          try {
            const response = await fetch(
              `http://localhost:${port}/api/health`,
              {
                signal: AbortSignal.timeout(2000),
              }
            );
            if (response.ok) activePortCount++;
          } catch {
            // Port not active
          }
        }
        return activePortCount > 1; // Multiple active backends
      },
      recovery: async () => {
        return this.showRecoveryNotification({
          title: "🔄 Multiple Backend Processes",
          message: "Multiple backend processes detected",
          command: "./stop-backend.sh && ./start-backend.sh",
          type: "cleanup",
          additionalInfo: "This will clean up orphaned processes and restart",
        });
      },
    },
    {
      name: "dependency_issues",
      description: "Missing or corrupted dependencies",
      priority: 6,
      cooldown: 300000, // 5 minutes
      detection: async () => {
        try {
          const workingBackend = await detectWorkingBackend();
          const response = await fetch(`${workingBackend}/api/health`, {
            signal: AbortSignal.timeout(5000),
          });
          if (!response.ok) return false;

          const health = await response.json();
          // Check for missing OpenAI configuration
          return !health.services?.hasOpenAI;
        } catch {
          return false;
        }
      },
      recovery: async () => {
        return this.showRecoveryNotification({
          title: "📦 Dependency Issues",
          message: "Backend dependencies may need reinstalling",
          command: "cd backend && npm install && cd .. && ./start-backend.sh",
          type: "dependencies",
          additionalInfo:
            "This will reinstall dependencies and restart backend",
        });
      },
    },
  ];

  private async attemptAutoRecovery(type: string): Promise<boolean> {
    try {
      // Map recovery types to auto-recovery actions
      const actionMap: Record<string, string> = {
        backend: "fix-backend",
        ai: "fix-ai",
        port: "fix-ports",
        memory: "fix-memory",
        dependencies: "fix-dependencies",
        cleanup: "auto",
      };

      const action = actionMap[type] || "auto";

      console.log(`🔧 Attempting automatic recovery: ${action}`);

      // Try to execute auto-recovery through backend endpoint
      const workingBackend = await detectWorkingBackend();
      const response = await fetch(`${workingBackend}/api/auto-recovery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: action,
          scenario: type,
        }),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Auto-recovery successful:`, result);
        return true;
      } else {
        console.warn(`❌ Auto-recovery failed: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.warn(`❌ Auto-recovery error:`, error);
      return false;
    }
  }

  private showRecoveryNotification(config: {
    title: string;
    message: string;
    command: string;
    type: string;
    additionalInfo?: string;
  }): Promise<boolean> {
    return new Promise(async (resolve) => {
      if (typeof window === "undefined") {
        resolve(false);
        return;
      }

      // First, attempt automatic recovery
      console.log(`🤖 Attempting automatic recovery for: ${config.type}`);

      // Show initial "attempting recovery" notification
      const initialNotification = document.createElement("div");
      initialNotification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #0078d4, #005a9e);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        z-index: 10002;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        max-width: 320px;
        transition: all 0.3s ease;
      `;

      initialNotification.innerHTML = `
        <div style="display: flex; align-items: center;">
          <div style="margin-right: 12px;">🔧</div>
          <div>
            <div style="font-weight: 600;">Auto-Recovery Active</div>
            <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">Attempting to fix ${config.type} issue...</div>
          </div>
        </div>
      `;

      document.body.appendChild(initialNotification);

      try {
        const autoRecoverySuccess = await this.attemptAutoRecovery(config.type);

        // Remove initial notification
        if (initialNotification.parentElement) {
          document.body.removeChild(initialNotification);
        }

        if (autoRecoverySuccess) {
          // Show success notification
          const successNotification = document.createElement("div");
          successNotification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #107c10, #004b1c);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(16, 124, 16, 0.3);
            z-index: 10002;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            max-width: 320px;
            transition: all 0.3s ease;
          `;

          successNotification.innerHTML = `
            <div style="display: flex; align-items: center;">
              <div style="margin-right: 12px;">✅</div>
              <div>
                <div style="font-weight: 600;">Auto-Recovery Successful!</div>
                <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">Issue fixed automatically</div>
              </div>
            </div>
          `;

          document.body.appendChild(successNotification);

          setTimeout(() => {
            if (successNotification.parentElement) {
              successNotification.style.opacity = "0";
              successNotification.style.transform = "translateY(-20px)";
              setTimeout(
                () => document.body.removeChild(successNotification),
                300
              );
            }
          }, 4000);

          resolve(true);
          return;
        }
      } catch (error) {
        console.warn("Auto-recovery attempt failed:", error);

        // Remove initial notification
        if (initialNotification.parentElement) {
          document.body.removeChild(initialNotification);
        }
      }

      // Auto-recovery failed or not available, show manual recovery notification
      console.log(`📋 Auto-recovery failed, showing manual recovery option`);

      // Create enhanced recovery notification
      const notification = document.createElement("div");
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #d13438, #b91c1c);
        color: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(209, 52, 56, 0.3);
        z-index: 10001;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-width: 380px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid rgba(255,255,255,0.1);
      `;

      notification.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <div style="font-weight: 700; font-size: 16px;">${config.title}</div>
          <div style="margin-left: auto; font-size: 12px; opacity: 0.8;">Manual Fix</div>
        </div>
        <div style="font-size: 14px; margin-bottom: 12px; opacity: 0.95;">${
          config.message
        }</div>
        <div style="font-size: 12px; margin-bottom: 12px; opacity: 0.8; font-style: italic;">Auto-recovery failed - manual intervention needed</div>
        ${
          config.additionalInfo
            ? `<div style="font-size: 12px; margin-bottom: 12px; opacity: 0.8; font-style: italic;">${config.additionalInfo}</div>`
            : ""
        }
        <div style="background: rgba(0,0,0,0.2); padding: 10px 12px; border-radius: 8px; font-family: 'Monaco', 'Consolas', monospace; font-size: 12px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.1);">${
          config.command
        }</div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <div style="font-size: 11px; opacity: 0.8; flex: 1;">Click to copy command</div>
          <div style="background: rgba(255,255,255,0.15); padding: 4px 8px; border-radius: 4px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;">${
            config.type
          }</div>
        </div>
      `;

      document.body.appendChild(notification);

      // Add hover effects
      notification.onmouseenter = () => {
        notification.style.transform = "translateY(-2px) scale(1.02)";
        notification.style.boxShadow = "0 12px 40px rgba(209, 52, 56, 0.4)";
      };
      notification.onmouseleave = () => {
        notification.style.transform = "translateY(0) scale(1)";
        notification.style.boxShadow = "0 8px 32px rgba(209, 52, 56, 0.3)";
      };

      // Copy command on click
      notification.onclick = () => {
        navigator.clipboard
          ?.writeText(config.command)
          .then(() => {
            notification.innerHTML = `
            <div style="text-align: center;">
              <div style="font-weight: 700; margin-bottom: 8px; font-size: 16px;">📋 Command Copied!</div>
              <div style="font-size: 14px; opacity: 0.9;">Run in terminal to fix the issue</div>
              <div style="font-size: 12px; opacity: 0.7; margin-top: 8px;">Auto-monitoring will continue...</div>
            </div>
          `;
            notification.style.background =
              "linear-gradient(135deg, #107c10, #004b1c)";
            notification.style.cursor = "default";
            notification.onclick = null;

            setTimeout(() => {
              if (notification.parentElement) {
                notification.style.opacity = "0";
                notification.style.transform = "translateY(-20px)";
                setTimeout(() => document.body.removeChild(notification), 300);
              }
            }, 3000);

            resolve(true);
          })
          .catch(() => {
            notification.innerHTML = `
            <div style="text-align: center;">
              <div style="font-weight: 700; margin-bottom: 8px;">⚠️ Copy Failed</div>
              <div style="font-size: 12px;">Please run: ${config.command}</div>
            </div>
          `;
            resolve(false);
          });
      };

      // Auto-dismiss after 20 seconds
      setTimeout(() => {
        if (notification.parentElement) {
          notification.style.opacity = "0";
          notification.style.transform = "translateY(-20px)";
          setTimeout(() => document.body.removeChild(notification), 300);
        }
        resolve(false);
      }, 20000);
    });
  }

  async startMonitoring(): Promise<void> {
    if (this.isMonitoring || !isDevelopment) return;

    this.isMonitoring = true;
    console.log("🔍 Starting auto-recovery monitoring system...");

    // Monitor every 30 seconds
    const monitorInterval = setInterval(async () => {
      if (!this.isMonitoring) {
        clearInterval(monitorInterval);
        return;
      }

      await this.runHealthCheck();
    }, 30000);

    // Initial health check
    await this.runHealthCheck();
  }

  private async runHealthCheck(): Promise<void> {
    for (const scenario of this.scenarios.sort(
      (a, b) => a.priority - b.priority
    )) {
      const lastAttempt = this.lastRecoveryAttempts.get(scenario.name) || 0;
      const now = Date.now();

      // Check cooldown
      if (now - lastAttempt < scenario.cooldown) {
        continue;
      }

      try {
        const needsRecovery = await scenario.detection();
        if (needsRecovery) {
          console.warn(`🚨 Auto-recovery triggered: ${scenario.name}`);
          this.lastRecoveryAttempts.set(scenario.name, now);
          await scenario.recovery();
          break; // Only handle one scenario at a time
        }
      } catch (error) {
        console.warn(
          `❌ Recovery scenario check failed: ${scenario.name}`,
          error
        );
      }
    }

    this.systemHealth.lastCheck = new Date();
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    console.log("🛑 Stopped auto-recovery monitoring");
  }

  getSystemHealth(): SystemHealth {
    return { ...this.systemHealth };
  }
}

// ================================================================================
// 🚀 INITIALIZE AUTO-RECOVERY SYSTEM
// ================================================================================

export const autoRecoverySystem = AutoRecoverySystem.getInstance();

// Start monitoring automatically in development
if (isDevelopment && typeof window !== "undefined") {
  // Start monitoring after a short delay to allow app initialization
  setTimeout(() => {
    autoRecoverySystem.startMonitoring();
  }, 5000);
}
