/**
 * 🔄 Fluent UI Component Loader
 *
 * Integrates imported Fluent UI components with your existing component library
 */

import React, { useEffect, useState } from "react";

interface FluentComponent {
  id: string;
  name: string;
  description: string;
  category: string;
  htmlCode: string;
  source: string;
  lastUpdated: string;
  githubPath?: string;
}

interface FluentComponentLibrary {
  lastUpdated: string;
  source: string;
  totalComponents: number;
  components: FluentComponent[];
}

// Hook to load Fluent UI components
export function useFluentComponents() {
  const [fluentComponents, setFluentComponents] = useState<FluentComponent[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFluentComponents();
  }, []);

  const loadFluentComponents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to load from local file first
      const response = await fetch("/src/components/fluent-library.json");

      if (response.ok) {
        const data: FluentComponentLibrary = await response.json();
        setFluentComponents(data.components || []);
        console.log("✅ Loaded", data.totalComponents, "Fluent UI components");
      } else {
        // Fallback: Generate some default Fluent components
        const defaultComponents = generateDefaultFluentComponents();
        setFluentComponents(defaultComponents);
        console.log("📦 Using default Fluent components");
      }
    } catch (error) {
      console.error("❌ Failed to load Fluent components:", error);
      setError("Failed to load Fluent UI components");

      // Use fallback components
      const fallbackComponents = generateDefaultFluentComponents();
      setFluentComponents(fallbackComponents);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshComponents = () => {
    loadFluentComponents();
  };

  return {
    fluentComponents,
    isLoading,
    error,
    refreshComponents,
  };
}

// Generate default Fluent components if import fails
function generateDefaultFluentComponents(): FluentComponent[] {
  return [
    {
      id: "fluent-primary-button",
      name: "Fluent Primary Button",
      description: "Microsoft Fluent UI primary button component",
      category: "Fluent",
      source: "built-in",
      lastUpdated: new Date().toISOString(),
      htmlCode: `<!-- Fluent UI Primary Button -->
<button class="fluent-button-primary" 
        style="
          font-family: 'Segoe UI', sans-serif;
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          padding: 5px 12px;
          border-radius: 4px;
          border: 1px solid #0078d4;
          background-color: #0078d4;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 80px;
          box-sizing: border-box;
        "
        onmouseover="this.style.backgroundColor='#106ebe'; this.style.borderColor='#106ebe'; this.style.transform='translateY(-1px)';"
        onmouseout="this.style.backgroundColor='#0078d4'; this.style.borderColor='#0078d4'; this.style.transform='translateY(0)';"
        onfocus="this.style.outline='2px solid #c7e0f4'; this.style.outlineOffset='2px';"
        onblur="this.style.outline='none';">
  Primary Action
</button>`,
    },
    {
      id: "fluent-secondary-button",
      name: "Fluent Secondary Button",
      description: "Microsoft Fluent UI secondary button component",
      category: "Fluent",
      source: "built-in",
      lastUpdated: new Date().toISOString(),
      htmlCode: `<!-- Fluent UI Secondary Button -->
<button class="fluent-button-secondary" 
        style="
          font-family: 'Segoe UI', sans-serif;
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          padding: 5px 12px;
          border-radius: 4px;
          border: 1px solid #8a8886;
          background-color: transparent;
          color: #323130;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 80px;
          box-sizing: border-box;
        "
        onmouseover="this.style.backgroundColor='#f3f2f1'; this.style.borderColor='#323130';"
        onmouseout="this.style.backgroundColor='transparent'; this.style.borderColor='#8a8886';"
        onfocus="this.style.outline='2px solid #c7e0f4'; this.style.outlineOffset='2px';"
        onblur="this.style.outline='none';">
  Secondary Action
</button>`,
    },
    {
      id: "fluent-text-input",
      name: "Fluent Text Input",
      description: "Microsoft Fluent UI text input component",
      category: "Fluent",
      source: "built-in",
      lastUpdated: new Date().toISOString(),
      htmlCode: `<!-- Fluent UI Text Input -->
<div class="fluent-input-container" style="margin-bottom: 16px;">
  <label for="fluent-text-input" 
         style="
           font-family: 'Segoe UI', sans-serif;
           font-size: 14px;
           font-weight: 600;
           color: #323130;
           display: block;
           margin-bottom: 4px;
         ">
    Input Label
  </label>
  <input id="fluent-text-input"
         type="text" 
         placeholder="Enter text..."
         style="
           font-family: 'Segoe UI', sans-serif;
           font-size: 14px;
           line-height: 20px;
           padding: 8px 12px;
           border: 1px solid #8a8886;
           border-radius: 4px;
           background-color: #ffffff;
           color: #323130;
           width: 100%;
           box-sizing: border-box;
           transition: border-color 0.2s, box-shadow 0.2s;
         "
         onfocus="this.style.borderColor='#0078d4'; this.style.boxShadow='0 0 0 2px rgba(0, 120, 212, 0.2)';"
         onblur="this.style.borderColor='#8a8886'; this.style.boxShadow='none';" />
</div>`,
    },
    {
      id: "fluent-card",
      name: "Fluent Card",
      description: "Microsoft Fluent UI card component",
      category: "Fluent",
      source: "built-in",
      lastUpdated: new Date().toISOString(),
      htmlCode: `<!-- Fluent UI Card -->
<div class="fluent-card" 
     style="
       font-family: 'Segoe UI', sans-serif;
       background-color: #ffffff;
       border: 1px solid #e1e5e9;
       border-radius: 8px;
       padding: 16px;
       box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
       transition: all 0.2s ease;
       margin-bottom: 16px;
       max-width: 320px;
     "
     onmouseover="this.style.boxShadow='0 4px 8px rgba(0, 0, 0, 0.12)'; this.style.transform='translateY(-2px)';"
     onmouseout="this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.08)'; this.style.transform='translateY(0)';">
  <h3 style="
        font-size: 16px;
        font-weight: 600;
        color: #323130;
        margin: 0 0 8px 0;
      ">
    Card Title
  </h3>
  <p style="
       font-size: 14px;
       color: #605e5c;
       margin: 0 0 12px 0;
       line-height: 20px;
     ">
    This is a Fluent UI card component with Microsoft design standards.
  </p>
  <button style="
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 4px;
            border: 1px solid #0078d4;
            background-color: #0078d4;
            color: #ffffff;
            cursor: pointer;
            transition: background-color 0.2s;
          "
          onmouseover="this.style.backgroundColor='#106ebe';"
          onmouseout="this.style.backgroundColor='#0078d4';">
    Learn More
  </button>
</div>`,
    },
    {
      id: "fluent-toggle",
      name: "Fluent Toggle",
      description: "Microsoft Fluent UI toggle switch component",
      category: "Fluent",
      source: "built-in",
      lastUpdated: new Date().toISOString(),
      htmlCode: `<!-- Fluent UI Toggle Switch -->
<div class="fluent-toggle-container" style="display: flex; align-items: center; margin-bottom: 16px;">
  <label style="
           font-family: 'Segoe UI', sans-serif;
           font-size: 14px;
           font-weight: 600;
           color: #323130;
           margin-right: 12px;
         ">
    Enable feature
  </label>
  <div class="fluent-toggle" 
       style="
         width: 40px;
         height: 20px;
         border-radius: 10px;
         background-color: #8a8886;
         position: relative;
         cursor: pointer;
         transition: background-color 0.2s;
       "
       onclick="
         var isOn = this.getAttribute('data-on') === 'true';
         this.setAttribute('data-on', !isOn);
         this.style.backgroundColor = !isOn ? '#0078d4' : '#8a8886';
         var thumb = this.querySelector('.toggle-thumb');
         thumb.style.transform = !isOn ? 'translateX(20px)' : 'translateX(0)';
       "
       data-on="false">
    <div class="toggle-thumb" 
         style="
           width: 16px;
           height: 16px;
           border-radius: 50%;
           background-color: #ffffff;
           position: absolute;
           top: 2px;
           left: 2px;
           transition: transform 0.2s;
           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
         ">
    </div>
  </div>
</div>`,
    },
    {
      id: "fluent-dropdown",
      name: "Fluent Dropdown",
      description: "Microsoft Fluent UI dropdown/select component",
      category: "Fluent",
      source: "built-in",
      lastUpdated: new Date().toISOString(),
      htmlCode: `<!-- Fluent UI Dropdown -->
<div class="fluent-dropdown-container" style="margin-bottom: 16px;">
  <label for="fluent-dropdown" 
         style="
           font-family: 'Segoe UI', sans-serif;
           font-size: 14px;
           font-weight: 600;
           color: #323130;
           display: block;
           margin-bottom: 4px;
         ">
    Select Option
  </label>
  <select id="fluent-dropdown"
         style="
           font-family: 'Segoe UI', sans-serif;
           font-size: 14px;
           line-height: 20px;
           padding: 8px 32px 8px 12px;
           border: 1px solid #8a8886;
           border-radius: 4px;
           background-color: #ffffff;
           color: #323130;
           width: 100%;
           box-sizing: border-box;
           cursor: pointer;
           transition: border-color 0.2s;
           appearance: none;
           background-image: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"%23605e5c\"><path d=\"M7 10l5 5 5-5z\"/></svg>');
           background-repeat: no-repeat;
           background-position: right 8px center;
           background-size: 16px;
         "
         onfocus="this.style.borderColor='#0078d4';"
         onblur="this.style.borderColor='#8a8886';">
    <option value="">Choose an option...</option>
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    <option value="option3">Option 3</option>
  </select>
</div>`,
    },
    {
      id: "fluent-checkbox",
      name: "Fluent Checkbox",
      description: "Microsoft Fluent UI checkbox component",
      category: "Fluent",
      source: "built-in",
      lastUpdated: new Date().toISOString(),
      htmlCode: `<!-- Fluent UI Checkbox -->
<div class="fluent-checkbox-container" style="display: flex; align-items: center; margin-bottom: 16px;">
  <label style="
           position: relative;
           display: flex;
           align-items: center;
           cursor: pointer;
           font-family: 'Segoe UI', sans-serif;
           font-size: 14px;
           color: #323130;
         ">
    <input type="checkbox" 
           style="
             appearance: none;
             width: 16px;
             height: 16px;
             border: 1px solid #8a8886;
             border-radius: 2px;
             background: #ffffff;
             cursor: pointer;
             transition: all 0.2s ease;
             margin-right: 8px;
             position: relative;
           " 
           onchange="
             if (this.checked) {
               this.style.backgroundColor = '#0078d4';
               this.style.borderColor = '#0078d4';
               this.nextElementSibling.style.opacity = '1';
             } else {
               this.style.backgroundColor = '#ffffff';
               this.style.borderColor = '#8a8886';
               this.nextElementSibling.style.opacity = '0';
             }
           ">
    <span style="
            position: absolute;
            left: 2px;
            top: 1px;
            width: 10px;
            height: 6px;
            border: 2px solid #ffffff;
            border-top: none;
            border-right: none;
            transform: rotate(-45deg);
            opacity: 0;
            transition: opacity 0.2s ease;
          "></span>
    Checkbox Label
  </label>
</div>`,
    },
    {
      id: "fluent-progress-bar",
      name: "Fluent Progress Bar",
      description: "Microsoft Fluent UI progress indicator",
      category: "Fluent",
      source: "built-in",
      lastUpdated: new Date().toISOString(),
      htmlCode: `<!-- Fluent UI Progress Bar -->
<div class="fluent-progress-container" style="margin-bottom: 16px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
    <span style="
           font-family: 'Segoe UI', sans-serif;
           font-size: 14px;
           font-weight: 600;
           color: #323130;
         ">
      Progress
    </span>
    <span style="
           font-family: 'Segoe UI', sans-serif;
           font-size: 12px;
           color: #605e5c;
         ">
      75%
    </span>
  </div>
  <div style="
         width: 100%;
         height: 4px;
         background-color: #e1e5e9;
         border-radius: 2px;
         overflow: hidden;
       ">
    <div style="
           width: 75%;
           height: 100%;
           background: linear-gradient(90deg, #0078d4 0%, #106ebe 100%);
           border-radius: 2px;
           transition: width 0.3s ease;
         "></div>
  </div>
</div>`,
    },
    {
      id: "fluent-search-box",
      name: "Fluent Search Box",
      description: "Microsoft Fluent UI search input with icon",
      category: "Fluent",
      source: "built-in",
      lastUpdated: new Date().toISOString(),
      htmlCode: `<!-- Fluent UI Search Box -->
<div class="fluent-search-container" style="position: relative; margin-bottom: 16px;">
  <label for="fluent-search" 
         style="
           font-family: 'Segoe UI', sans-serif;
           font-size: 14px;
           font-weight: 600;
           color: #323130;
           display: block;
           margin-bottom: 4px;
         ">
    Search
  </label>
  <div style="position: relative;">
    <input id="fluent-search"
           type="search" 
           placeholder="Search..."
           style="
             font-family: 'Segoe UI', sans-serif;
             font-size: 14px;
             line-height: 20px;
             padding: 8px 36px 8px 12px;
             border: 1px solid #8a8886;
             border-radius: 4px;
             background-color: #ffffff;
             color: #323130;
             width: 100%;
             box-sizing: border-box;
             transition: border-color 0.2s;
           "
           onfocus="this.style.borderColor='#0078d4';"
           onblur="this.style.borderColor='#8a8886';" />
    <div style="
           position: absolute;
           right: 8px;
           top: 50%;
           transform: translateY(-50%);
           width: 16px;
           height: 16px;
           pointer-events: none;
           background-image: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"%23605e5c\"><path d=\"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z\"/></svg>');
           background-repeat: no-repeat;
           background-position: center;
           background-size: 16px;
         "></div>
  </div>
</div>`,
    },
    {
      id: "fluent-spinner",
      name: "Fluent Spinner",
      description: "Microsoft Fluent UI loading spinner",
      category: "Fluent",
      source: "built-in",
      lastUpdated: new Date().toISOString(),
      htmlCode: `<!-- Fluent UI Spinner -->
<div class="fluent-spinner-container" style="display: flex; align-items: center; margin-bottom: 16px;">
  <div style="
         width: 20px;
         height: 20px;
         border: 2px solid #e1e5e9;
         border-top: 2px solid #0078d4;
         border-radius: 50%;
         animation: fluent-spin 1s linear infinite;
         margin-right: 8px;
       "></div>
  <span style="
         font-family: 'Segoe UI', sans-serif;
         font-size: 14px;
         color: #605e5c;
       ">
    Loading...
  </span>
</div>

<style>
@keyframes fluent-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>`,
    },
  ];
}

// Utility to merge Fluent components with existing components
export function mergeFluentWithExisting(
  existingComponents: any[],
  fluentComponents: FluentComponent[]
) {
  // Create a combined array
  const combined = [...existingComponents];

  // Add Fluent components with unique IDs, checking for duplicates
  fluentComponents.forEach((fluentComp) => {
    const exists = combined.find((comp) => comp.id === fluentComp.id);
    const isDuplicate = isDuplicateComponent(fluentComp.id, fluentComp.name);

    if (!exists && !isDuplicate) {
      combined.push(fluentComp);
      console.log(`✅ Added Fluent component: ${fluentComp.name}`);
    } else if (isDuplicate) {
      console.log(
        `⚠️  Skipped duplicate component: ${fluentComp.name} (${fluentComp.id})`
      );
    }
  });

  return combined;
}

// Existing component IDs to avoid duplicating
const EXISTING_COMPONENT_IDS = [
  // MS Learn Headers
  "ms-learn-header-default",
  "ms-learn-header-hero",
  "ms-learn-header-minimal",
  "ms-learn-header-with-breadcrumb",
  "ms-learn-header-with-tabs",
  "ms-learn-header-dark",

  // Buttons (various styles)
  "button-primary",
  "button-secondary",
  "button-cta",
  "button-link",
  "button-icon",
  "button-outline",
  "button-ghost",
  "button-danger",
  "button-success",
  "button-warning",

  // Form Components
  "form-contact",
  "form-newsletter",
  "form-login",
  "form-register",
  "form-search",
  "form-feedback",
  "form-quiz",
  "form-survey",
  "form-upload",

  // Cards
  "card-basic",
  "card-feature",
  "card-testimonial",
  "card-pricing",
  "card-product",
  "card-blog",
  "card-team-member",
  "card-statistic",

  // Input variations that might conflict
  "input-text",
  "input-email",
  "input-password",
  "input-search",
  "input-number",
  "input-tel",
  "input-url",
  "input-date",
  "textarea",
  "select",
  "checkbox",
  "radio",
  "toggle",
  "slider",

  // Navigation
  "nav-main",
  "nav-sidebar",
  "nav-breadcrumb",
  "nav-tabs",
  "nav-pagination",
  "nav-footer",

  // Layout
  "layout-grid",
  "layout-flex",
  "layout-section",
  "layout-container",
  "layout-hero",
  "layout-sidebar",

  // Common UI patterns that might overlap
  "modal",
  "dialog",
  "dropdown",
  "accordion",
  "carousel",
  "slider",
  "progress",
  "spinner",
  "loader",
  "alert",
  "notification",
  "toast",
  "tooltip",
  "popover",
  "badge",
  "chip",
  "tag",
  "avatar",
  "icon",
];

// Smart duplicate detection - checks various naming patterns
function isDuplicateComponent(fluentId: string, fluentName: string): boolean {
  const normalizedFluentId = fluentId.toLowerCase();
  const normalizedFluentName = fluentName.toLowerCase();

  // Direct ID match
  if (EXISTING_COMPONENT_IDS.includes(normalizedFluentId)) {
    return true;
  }

  // Check for similar naming patterns
  for (const existingId of EXISTING_COMPONENT_IDS) {
    const existingNormalized = existingId.toLowerCase();

    // Extract base component type (e.g., "button" from "button-primary")
    const fluentBaseType = normalizedFluentId
      .replace(/^fluent-/, "")
      .split("-")[0];
    const existingBaseType = existingNormalized.split("-")[0];

    // If base types match (button, input, card, etc.)
    if (fluentBaseType === existingBaseType) {
      console.log(
        `🔍 Potential duplicate detected: Fluent "${fluentId}" vs existing "${existingId}" (both are ${fluentBaseType} components)`
      );
      return true;
    }

    // Check if Fluent component name contains existing component type
    if (
      normalizedFluentName.includes(existingBaseType) ||
      normalizedFluentId.includes(existingBaseType)
    ) {
      console.log(
        `🔍 Component type overlap: Fluent "${fluentId}" overlaps with existing "${existingId}"`
      );
      return true;
    }
  }

  return false;
}

export type { FluentComponent, FluentComponentLibrary };
