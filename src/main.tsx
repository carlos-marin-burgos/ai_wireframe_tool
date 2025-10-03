import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/colors.css"; // Centralized color system
import "./styles/themes.css";
import App from "./App";
// Production safety layer: prevent accidental localhost calls in deployed builds
import "./runtime/productionSafety";
// Automatic backend startup for development - DISABLED (using START.sh instead)
// import { autoStartBackendIfNeeded, autoRecoverySystem } from "./config/api";

// Expose React globally for dynamic code execution
declare global {
  interface Window {
    React: typeof React;
  }
}
window.React = React;

// Navigation initialization removed - Microsoft Learn navigation should only appear within wireframe content, not at application level

// Enhanced automatic system health check and recovery - DISABLED
// Using manual START.sh script instead for simpler, more reliable development
/*
if (import.meta.env.DEV) {
  const runComprehensiveStartup = async () => {
    try {
      console.log("🚀 Running comprehensive development environment startup...");

      // Step 1: Check if backend is responding
      const backendHealthy = await autoStartBackendIfNeeded();

      if (!backendHealthy) {
        console.log("🔧 Backend issues detected - attempting smart startup...");

        // Try to run smart-dev-start through the auto-recovery system
        try {
          // First try to detect any working backend to call auto-recovery
          const testPorts = [7071, 7072, 7073, 7074, 7075];
          let workingBackend = null;

          for (const port of testPorts) {
            try {
              const response = await fetch(`http://localhost:${port}/api/health`, {
                signal: AbortSignal.timeout(2000)
              });
              if (response.ok) {
                workingBackend = `http://localhost:${port}`;
                break;
              }
            } catch {
              // Continue checking other ports
            }
          }

          if (workingBackend) {
            console.log("✅ Found working backend, attempting auto-recovery...");

            const recoveryResponse = await fetch(`${workingBackend}/api/auto-recovery`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'smart-start',
                scenario: 'startup'
              }),
              signal: AbortSignal.timeout(45000) // 45 seconds for full startup
            });

            if (recoveryResponse.ok) {
              console.log("🎉 Smart startup completed automatically!");

              // Show success notification
              if (typeof window !== "undefined") {
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
                  z-index: 10003;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  font-size: 14px;
                  max-width: 350px;
                  transition: all 0.3s ease;
                `;

                successNotification.innerHTML = `
                  <div style="display: flex; align-items: center;">
                    <div style="margin-right: 12px; font-size: 18px;">🎉</div>
                    <div>
                      <div style="font-weight: 600;">Development Environment Ready!</div>
                      <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">Auto-recovery and monitoring active</div>
                    </div>
                  </div>
                `;

                document.body.appendChild(successNotification);

                setTimeout(() => {
                  if (successNotification.parentElement) {
                    successNotification.style.opacity = '0';
                    successNotification.style.transform = 'translateY(-20px)';
                    setTimeout(() => document.body.removeChild(successNotification), 300);
                  }
                }, 5000);
              }
            } else {
              throw new Error('Auto-recovery endpoint failed');
            }
          } else {
            throw new Error('No working backend found for auto-recovery');
          }
        } catch (autoRecoveryError) {
          console.warn("🔶 Automatic smart startup failed:", autoRecoveryError);

          // Fallback: Show manual startup guidance
          if (typeof window !== "undefined") {
            const guidanceNotification = document.createElement("div");
            guidanceNotification.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: linear-gradient(135deg, #ff8c00, #cc7000);
              color: white;
              padding: 18px 22px;
              border-radius: 12px;
              box-shadow: 0 8px 24px rgba(255, 140, 0, 0.3);
              z-index: 10003;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 14px;
              max-width: 380px;
              cursor: pointer;
              transition: all 0.3s ease;
            `;

            guidanceNotification.innerHTML = `
              <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <div style="margin-right: 12px; font-size: 18px;">⚡</div>
                <div style="font-weight: 600; font-size: 15px;">Development Environment Setup</div>
              </div>
              <div style="font-size: 13px; margin-bottom: 12px; opacity: 0.95;">Click to copy the smart startup command:</div>
              <div style="background: rgba(0,0,0,0.2); padding: 10px 12px; border-radius: 8px; font-family: 'Monaco', 'Consolas', monospace; font-size: 12px; margin-bottom: 12px;">./smart-dev-start.sh</div>
              <div style="font-size: 11px; opacity: 0.85;">This will set up auto-recovery and monitoring</div>
            `;

            document.body.appendChild(guidanceNotification);

            guidanceNotification.onclick = () => {
              navigator.clipboard?.writeText('./smart-dev-start.sh').then(() => {
                guidanceNotification.innerHTML = `
                  <div style="text-align: center;">
                    <div style="font-weight: 600; margin-bottom: 8px; font-size: 15px;">📋 Command Copied!</div>
                    <div style="font-size: 13px; opacity: 0.9;">Run in terminal to set up auto-recovery</div>
                  </div>
                `;

                setTimeout(() => {
                  if (guidanceNotification.parentElement) {
                    guidanceNotification.style.opacity = '0';
                    guidanceNotification.style.transform = 'translateY(-20px)';
                    setTimeout(() => document.body.removeChild(guidanceNotification), 300);
                  }
                }, 3000);
              });
            };

            setTimeout(() => {
              if (guidanceNotification.parentElement) {
                guidanceNotification.style.opacity = '0';
                guidanceNotification.style.transform = 'translateY(-20px)';
                setTimeout(() => document.body.removeChild(guidanceNotification), 300);
              }
            }, 20000);
          }
        }
      } else {
        console.log("✅ Backend is healthy, starting monitoring system...");

        // Start the auto-recovery monitoring system
        setTimeout(() => {
          autoRecoverySystem.startMonitoring();
        }, 3000);
      }

    } catch (error) {
      console.warn("🔶 Comprehensive startup failed:", error);
      // Don't block app startup for backend issues
    }
  };

  // Run comprehensive startup
  runComprehensiveStartup();
}
*/
console.log("🚀 Development mode - using manual START.sh for backend management");

// Get the root element
const rootElement = document.getElementById("root");

// Create the React application
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
