#!/usr/bin/env node

/**
 * 🚀 Simple Fluent UI Component Generator
 * Generates Fluent UI components based on known component types
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_OUTPUT_PATH = path.join(
  __dirname,
  "../public/fluent-library.json"
);

// Generate enhanced Fluent UI components
function generateEnhancedFluentComponents() {
  return [
    {
      id: "fluent-github-menu",
      name: "Fluent Menu",
      description:
        "Official Microsoft Fluent UI menu component with dropdown functionality",
      category: "GitHub Fluent",
      htmlCode: `<!-- Fluent UI Menu Component -->
<div class="fluent-menu-container" style="position: relative; display: inline-block; margin-bottom: 16px;">
  <button class="fluent-menu-trigger"
          style="
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            font-weight: 600;
            padding: 8px 32px 8px 12px;
            border: 1px solid #8a8886;
            border-radius: 4px;
            background-color: #ffffff;
            color: #323130;
            cursor: pointer;
            transition: border-color 0.2s;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"%23605e5c\"><path d=\"M7 10l5 5 5-5z\"/></svg>');
            background-repeat: no-repeat;
            background-position: right 8px center;
            background-size: 16px;
          "
          onclick="toggleFluentMenu(this)"
          onfocus="this.style.borderColor='#0078d4';"
          onblur="this.style.borderColor='#8a8886';">
    Menu Options
  </button>
  <div class="fluent-menu-popup" id="fluent-menu-popup"
       style="
         position: absolute;
         top: 100%;
         left: 0;
         min-width: 200px;
         background: #ffffff;
         border: 1px solid #e1e5e9;
         border-radius: 4px;
         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
         z-index: 1000;
         display: none;
         font-family: 'Segoe UI', sans-serif;
       ">
    <div class="fluent-menu-item" 
         style="padding: 8px 12px; cursor: pointer; color: #323130; font-size: 14px;"
         onmouseover="this.style.backgroundColor='#f3f2f1';"
         onmouseout="this.style.backgroundColor='transparent';">
      Menu Item 1
    </div>
    <div class="fluent-menu-item" 
         style="padding: 8px 12px; cursor: pointer; color: #323130; font-size: 14px;"
         onmouseover="this.style.backgroundColor='#f3f2f1';"
         onmouseout="this.style.backgroundColor='transparent';">
      Menu Item 2
    </div>
    <div class="fluent-menu-item" 
         style="padding: 8px 12px; cursor: pointer; color: #323130; font-size: 14px;"
         onmouseover="this.style.backgroundColor='#f3f2f1';"
         onmouseout="this.style.backgroundColor='transparent';">
      Menu Item 3
    </div>
  </div>
</div>

<script>
function toggleFluentMenu(button) {
  const popup = button.nextElementSibling;
  const isVisible = popup.style.display === 'block';
  popup.style.display = isVisible ? 'none' : 'block';
}
</script>`,
      source: "fluent-ui-github",
      lastUpdated: new Date().toISOString(),
      githubPath: "@fluentui/react-menu",
    },
    {
      id: "fluent-github-avatar",
      name: "Fluent Avatar",
      description:
        "Official Microsoft Fluent UI avatar component with initials and image support",
      category: "GitHub Fluent",
      htmlCode: `<!-- Fluent UI Avatar Component -->
<div class="fluent-avatar-container" style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
  <!-- Small Avatar with Initials -->
  <div class="fluent-avatar-small"
       style="
         width: 32px;
         height: 32px;
         border-radius: 50%;
         background: linear-gradient(135deg, #0078d4, #106ebe);
         color: #ffffff;
         display: flex;
         align-items: center;
         justify-content: center;
         font-family: 'Segoe UI', sans-serif;
         font-size: 12px;
         font-weight: 600;
       ">
    JD
  </div>
  
  <!-- Medium Avatar -->
  <div class="fluent-avatar-medium"
       style="
         width: 40px;
         height: 40px;
         border-radius: 50%;
         background: linear-gradient(135deg, #00bcf2, #0078d4);
         color: #ffffff;
         display: flex;
         align-items: center;
         justify-content: center;
         font-family: 'Segoe UI', sans-serif;
         font-size: 14px;
         font-weight: 600;
       ">
    MS
  </div>
  
  <!-- Large Avatar with Image -->
  <div class="fluent-avatar-large"
       style="
         width: 56px;
         height: 56px;
         border-radius: 50%;
         background: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"%23605e5c\"><path d=\"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\"/></svg>') center/cover;
         border: 2px solid #e1e5e9;
       ">
  </div>
</div>`,
      source: "fluent-ui-github",
      lastUpdated: new Date().toISOString(),
      githubPath: "@fluentui/react-avatar",
    },
    {
      id: "fluent-github-badge",
      name: "Fluent Badge",
      description:
        "Official Microsoft Fluent UI badge component for status and notifications",
      category: "GitHub Fluent",
      htmlCode: `<!-- Fluent UI Badge Component -->
<div class="fluent-badge-container" style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 16px;">
  <!-- Default Badge -->
  <span class="fluent-badge-default"
        style="
          font-family: 'Segoe UI', sans-serif;
          font-size: 12px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 12px;
          background-color: #f3f2f1;
          color: #323130;
          white-space: nowrap;
        ">
    Default
  </span>
  
  <!-- Success Badge -->
  <span class="fluent-badge-success"
        style="
          font-family: 'Segoe UI', sans-serif;
          font-size: 12px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 12px;
          background-color: #107c10;
          color: #ffffff;
          white-space: nowrap;
        ">
    Success
  </span>
  
  <!-- Warning Badge -->
  <span class="fluent-badge-warning"
        style="
          font-family: 'Segoe UI', sans-serif;
          font-size: 12px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 12px;
          background-color: #ff8c00;
          color: #ffffff;
          white-space: nowrap;
        ">
    Warning
  </span>
  
  <!-- Error Badge -->
  <span class="fluent-badge-error"
        style="
          font-family: 'Segoe UI', sans-serif;
          font-size: 12px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 12px;
          background-color: #d13438;
          color: #ffffff;
          white-space: nowrap;
        ">
    Error
  </span>
  
  <!-- Notification Badge -->
  <div style="position: relative; display: inline-block;">
    <button style="
             font-family: 'Segoe UI', sans-serif;
             padding: 8px 16px;
             border: 1px solid #8a8886;
             border-radius: 4px;
             background: #ffffff;
             color: #323130;
             cursor: pointer;
           ">
      Notifications
    </button>
    <span class="fluent-badge-notification"
          style="
            position: absolute;
            top: -4px;
            right: -4px;
            min-width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: #d13438;
            color: #ffffff;
            font-family: 'Segoe UI', sans-serif;
            font-size: 10px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 4px;
          ">
      3
    </span>
  </div>
</div>`,
      source: "fluent-ui-github",
      lastUpdated: new Date().toISOString(),
      githubPath: "@fluentui/react-badge",
    },
    {
      id: "fluent-github-tabs",
      name: "Fluent Tabs",
      description:
        "Official Microsoft Fluent UI tabs component with multiple panels",
      category: "GitHub Fluent",
      htmlCode: `<!-- Fluent UI Tabs Component -->
<div class="fluent-tabs-container" style="margin-bottom: 16px; font-family: 'Segoe UI', sans-serif;">
  <div class="fluent-tabs-list" 
       style="
         display: flex;
         border-bottom: 1px solid #e1e5e9;
         margin-bottom: 16px;
       ">
    <button class="fluent-tab active" 
            data-tab="tab1"
            style="
              padding: 12px 16px;
              border: none;
              background: transparent;
              color: #0078d4;
              font-family: 'Segoe UI', sans-serif;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              border-bottom: 2px solid #0078d4;
              transition: all 0.2s;
            "
            onclick="switchFluentTab(this, 'tab1')">
      Tab 1
    </button>
    <button class="fluent-tab" 
            data-tab="tab2"
            style="
              padding: 12px 16px;
              border: none;
              background: transparent;
              color: #605e5c;
              font-family: 'Segoe UI', sans-serif;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              border-bottom: 2px solid transparent;
              transition: all 0.2s;
            "
            onmouseover="this.style.color='#323130';"
            onmouseout="if(!this.classList.contains('active')) this.style.color='#605e5c';"
            onclick="switchFluentTab(this, 'tab2')">
      Tab 2
    </button>
    <button class="fluent-tab" 
            data-tab="tab3"
            style="
              padding: 12px 16px;
              border: none;
              background: transparent;
              color: #605e5c;
              font-family: 'Segoe UI', sans-serif;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              border-bottom: 2px solid transparent;
              transition: all 0.2s;
            "
            onmouseover="this.style.color='#323130';"
            onmouseout="if(!this.classList.contains('active')) this.style.color='#605e5c';"
            onclick="switchFluentTab(this, 'tab3')">
      Tab 3
    </button>
  </div>
  
  <div class="fluent-tab-panels">
    <div class="fluent-tab-panel active" id="tab1" style="display: block;">
      <h3 style="margin: 0 0 12px 0; color: #323130; font-size: 16px; font-weight: 600;">Panel 1 Content</h3>
      <p style="margin: 0; color: #605e5c; line-height: 20px;">This is the content for the first tab panel. It contains relevant information and controls.</p>
    </div>
    <div class="fluent-tab-panel" id="tab2" style="display: none;">
      <h3 style="margin: 0 0 12px 0; color: #323130; font-size: 16px; font-weight: 600;">Panel 2 Content</h3>
      <p style="margin: 0; color: #605e5c; line-height: 20px;">This is the content for the second tab panel with different information and features.</p>
    </div>
    <div class="fluent-tab-panel" id="tab3" style="display: none;">
      <h3 style="margin: 0 0 12px 0; color: #323130; font-size: 16px; font-weight: 600;">Panel 3 Content</h3>
      <p style="margin: 0; color: #605e5c; line-height: 20px;">This is the content for the third tab panel showcasing additional functionality.</p>
    </div>
  </div>
</div>

<script>
function switchFluentTab(button, tabId) {
  // Remove active class from all tabs
  const tabs = button.parentElement.querySelectorAll('.fluent-tab');
  tabs.forEach(tab => {
    tab.classList.remove('active');
    tab.style.color = '#605e5c';
    tab.style.borderBottomColor = 'transparent';
  });
  
  // Add active class to clicked tab
  button.classList.add('active');
  button.style.color = '#0078d4';
  button.style.borderBottomColor = '#0078d4';
  
  // Hide all panels
  const panels = button.closest('.fluent-tabs-container').querySelectorAll('.fluent-tab-panel');
  panels.forEach(panel => {
    panel.style.display = 'none';
  });
  
  // Show target panel
  document.getElementById(tabId).style.display = 'block';
}
</script>`,
      source: "fluent-ui-github",
      lastUpdated: new Date().toISOString(),
      githubPath: "@fluentui/react-tabs",
    },
    {
      id: "fluent-github-tooltip",
      name: "Fluent Tooltip",
      description:
        "Official Microsoft Fluent UI tooltip component with hover functionality",
      category: "GitHub Fluent",
      htmlCode: `<!-- Fluent UI Tooltip Component -->
<div class="fluent-tooltip-container" style="display: inline-flex; gap: 24px; align-items: center; margin-bottom: 16px;">
  <!-- Button with Tooltip -->
  <div class="fluent-tooltip-wrapper" style="position: relative; display: inline-block;">
    <button class="fluent-button-with-tooltip"
            style="
              font-family: 'Segoe UI', sans-serif;
              padding: 8px 16px;
              border: 1px solid #0078d4;
              border-radius: 4px;
              background: #0078d4;
              color: #ffffff;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
            "
            onmouseenter="showFluentTooltip(this)"
            onmouseleave="hideFluentTooltip(this)">
      Hover for Tooltip
    </button>
    <div class="fluent-tooltip"
         style="
           position: absolute;
           bottom: 100%;
           left: 50%;
           transform: translateX(-50%);
           margin-bottom: 8px;
           padding: 8px 12px;
           background: #323130;
           color: #ffffff;
           font-family: 'Segoe UI', sans-serif;
           font-size: 12px;
           border-radius: 4px;
           white-space: nowrap;
           opacity: 0;
           visibility: hidden;
           transition: opacity 0.2s, visibility 0.2s;
           z-index: 1000;
         ">
      This is a helpful tooltip message
      <div style="
             position: absolute;
             top: 100%;
             left: 50%;
             transform: translateX(-50%);
             width: 0;
             height: 0;
             border-left: 4px solid transparent;
             border-right: 4px solid transparent;
             border-top: 4px solid #323130;
           "></div>
    </div>
  </div>
  
  <!-- Icon with Tooltip -->
  <div class="fluent-tooltip-wrapper" style="position: relative; display: inline-block;">
    <div class="fluent-icon-with-tooltip"
         style="
           width: 24px;
           height: 24px;
           border-radius: 50%;
           background: #605e5c;
           color: #ffffff;
           display: flex;
           align-items: center;
           justify-content: center;
           cursor: help;
           font-family: 'Segoe UI', sans-serif;
           font-size: 14px;
           font-weight: bold;
         "
         onmouseenter="showFluentTooltip(this)"
         onmouseleave="hideFluentTooltip(this)">
      ?
    </div>
    <div class="fluent-tooltip"
         style="
           position: absolute;
           bottom: 100%;
           left: 50%;
           transform: translateX(-50%);
           margin-bottom: 8px;
           padding: 8px 12px;
           background: #323130;
           color: #ffffff;
           font-family: 'Segoe UI', sans-serif;
           font-size: 12px;
           border-radius: 4px;
           white-space: nowrap;
           opacity: 0;
           visibility: hidden;
           transition: opacity 0.2s, visibility 0.2s;
           z-index: 1000;
           max-width: 200px;
           white-space: normal;
         ">
      More detailed information about this feature or control
      <div style="
             position: absolute;
             top: 100%;
             left: 50%;
             transform: translateX(-50%);
             width: 0;
             height: 0;
             border-left: 4px solid transparent;
             border-right: 4px solid transparent;
             border-top: 4px solid #323130;
           "></div>
    </div>
  </div>
</div>

<script>
function showFluentTooltip(element) {
  const tooltip = element.querySelector('.fluent-tooltip');
  if (tooltip) {
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';
  }
}

function hideFluentTooltip(element) {
  const tooltip = element.querySelector('.fluent-tooltip');
  if (tooltip) {
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
  }
}
</script>`,
      source: "fluent-ui-github",
      lastUpdated: new Date().toISOString(),
      githubPath: "@fluentui/react-tooltip",
    },
    {
      id: "fluent-github-slider",
      name: "Fluent Slider",
      description:
        "Official Microsoft Fluent UI slider component for value selection",
      category: "GitHub Fluent",
      htmlCode: `<!-- Fluent UI Slider Component -->
<div class="fluent-slider-container" style="margin-bottom: 24px; font-family: 'Segoe UI', sans-serif;">
  <!-- Horizontal Slider -->
  <div style="margin-bottom: 20px;">
    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; color: #323130;">
      Volume: <span id="slider1-value">50</span>%
    </label>
    <div class="fluent-slider-horizontal" style="position: relative; width: 200px; height: 20px;">
      <div class="fluent-slider-track"
           style="
             position: absolute;
             top: 50%;
             left: 0;
             right: 0;
             height: 4px;
             background: #e1e5e9;
             border-radius: 2px;
             transform: translateY(-50%);
           "></div>
      <div class="fluent-slider-filled"
           id="slider1-filled"
           style="
             position: absolute;
             top: 50%;
             left: 0;
             width: 50%;
             height: 4px;
             background: #0078d4;
             border-radius: 2px;
             transform: translateY(-50%);
           "></div>
      <div class="fluent-slider-thumb"
           id="slider1-thumb"
           style="
             position: absolute;
             top: 50%;
             left: 50%;
             width: 16px;
             height: 16px;
             background: #0078d4;
             border: 2px solid #ffffff;
             border-radius: 50%;
             transform: translate(-50%, -50%);
             cursor: pointer;
             box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
             transition: transform 0.1s;
           "
           onmousedown="startFluentSliderDrag(event, 'slider1')"
           onmouseover="this.style.transform='translate(-50%, -50%) scale(1.1)';"
           onmouseout="this.style.transform='translate(-50%, -50%) scale(1)';">
      </div>
    </div>
  </div>
  
  <!-- Range Slider -->
  <div style="margin-bottom: 20px;">
    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; color: #323130;">
      Price Range: $<span id="slider2-min">20</span> - $<span id="slider2-max">80</span>
    </label>
    <div class="fluent-slider-horizontal" style="position: relative; width: 200px; height: 20px;">
      <div class="fluent-slider-track"
           style="
             position: absolute;
             top: 50%;
             left: 0;
             right: 0;
             height: 4px;
             background: #e1e5e9;
             border-radius: 2px;
             transform: translateY(-50%);
           "></div>
      <div class="fluent-slider-filled"
           id="slider2-filled"
           style="
             position: absolute;
             top: 50%;
             left: 20%;
             width: 60%;
             height: 4px;
             background: #0078d4;
             border-radius: 2px;
             transform: translateY(-50%);
           "></div>
      <div class="fluent-slider-thumb"
           id="slider2-thumb-min"
           style="
             position: absolute;
             top: 50%;
             left: 20%;
             width: 16px;
             height: 16px;
             background: #0078d4;
             border: 2px solid #ffffff;
             border-radius: 50%;
             transform: translate(-50%, -50%);
             cursor: pointer;
             box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
           "
           onmousedown="startFluentSliderDrag(event, 'slider2', 'min')">
      </div>
      <div class="fluent-slider-thumb"
           id="slider2-thumb-max"
           style="
             position: absolute;
             top: 50%;
             left: 80%;
             width: 16px;
             height: 16px;
             background: #0078d4;
             border: 2px solid #ffffff;
             border-radius: 50%;
             transform: translate(-50%, -50%);
             cursor: pointer;
             box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
           "
           onmousedown="startFluentSliderDrag(event, 'slider2', 'max')">
      </div>
    </div>
  </div>
</div>

<script>
let isDragging = false;
let currentSlider = null;
let currentType = null;

function startFluentSliderDrag(event, sliderId, type = 'single') {
  isDragging = true;
  currentSlider = sliderId;
  currentType = type;
  event.preventDefault();
  
  document.addEventListener('mousemove', handleFluentSliderDrag);
  document.addEventListener('mouseup', stopFluentSliderDrag);
}

function handleFluentSliderDrag(event) {
  if (!isDragging) return;
  
  const slider = document.querySelector(\`#\${currentSlider}-thumb\${currentType === 'single' ? '' : '-' + currentType}\`).closest('.fluent-slider-horizontal');
  const rect = slider.getBoundingClientRect();
  const percent = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
  
  if (currentSlider === 'slider1') {
    updateSingleSlider(percent);
  } else if (currentSlider === 'slider2') {
    updateRangeSlider(percent, currentType);
  }
}

function stopFluentSliderDrag() {
  isDragging = false;
  currentSlider = null;
  currentType = null;
  document.removeEventListener('mousemove', handleFluentSliderDrag);
  document.removeEventListener('mouseup', stopFluentSliderDrag);
}

function updateSingleSlider(percent) {
  const thumb = document.getElementById('slider1-thumb');
  const filled = document.getElementById('slider1-filled');
  const value = document.getElementById('slider1-value');
  
  thumb.style.left = percent + '%';
  filled.style.width = percent + '%';
  value.textContent = Math.round(percent);
}

function updateRangeSlider(percent, type) {
  const minThumb = document.getElementById('slider2-thumb-min');
  const maxThumb = document.getElementById('slider2-thumb-max');
  const filled = document.getElementById('slider2-filled');
  const minValue = document.getElementById('slider2-min');
  const maxValue = document.getElementById('slider2-max');
  
  let minPercent = parseFloat(minThumb.style.left) || 20;
  let maxPercent = parseFloat(maxThumb.style.left) || 80;
  
  if (type === 'min' && percent <= maxPercent) {
    minPercent = percent;
    minThumb.style.left = percent + '%';
  } else if (type === 'max' && percent >= minPercent) {
    maxPercent = percent;
    maxThumb.style.left = percent + '%';
  }
  
  filled.style.left = minPercent + '%';
  filled.style.width = (maxPercent - minPercent) + '%';
  minValue.textContent = Math.round(minPercent);
  maxValue.textContent = Math.round(maxPercent);
}
</script>`,
      source: "fluent-ui-github",
      lastUpdated: new Date().toISOString(),
      githubPath: "@fluentui/react-slider",
    },
  ];
}

async function main() {
  console.log("🚀 Generating Enhanced Fluent UI Components...");
  console.log(`📁 Output: ${COMPONENTS_OUTPUT_PATH}`);
  console.log("─".repeat(50));

  try {
    const components = generateEnhancedFluentComponents();

    // Create directory if it doesn't exist
    const outputDir = path.dirname(COMPONENTS_OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const output = {
      lastUpdated: new Date().toISOString(),
      source: "microsoft/fluentui-enhanced",
      totalComponents: components.length,
      components: components,
    };

    fs.writeFileSync(COMPONENTS_OUTPUT_PATH, JSON.stringify(output, null, 2));

    console.log(
      `✅ Generated ${components.length} enhanced Fluent UI components`
    );
    console.log("─".repeat(50));
    console.log("🎉 Component generation completed successfully!");
    console.log(
      "📊 Components added:",
      components.map((c) => c.name).join(", ")
    );
    console.log("");
    console.log("🔄 Components are now available in your library!");
    console.log(
      "💡 Open the component library to see the new GitHub Fluent components"
    );
  } catch (error) {
    console.error("❌ Generation failed:", error);
    process.exit(1);
  }
}

console.log("🔥 Starting Enhanced Fluent UI Component Generator...");
main().catch(console.error);
