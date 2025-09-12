#!/usr/bin/env node

/**
 * Fluent UI Component Fetcher
 * Fetches component data from Fluent UI Storybook and generates fluent-library.json
 *
 * Usage: node scripts/fetch-fluent-components.js
 */

const fs = require("fs");
const path = require("path");

// Comprehensive Fluent UI Components based on https://react.fluentui.dev/
const fluentUIComponents = {
  components: [
    // Buttons
    {
      id: "fluent-button-primary",
      name: "Button (Primary)",
      description: "Primary action button with emphasis styling",
      category: "Buttons",
      githubPath: "react-components/react-button",
      htmlCode: `<button style="background: #8E9AAF; color: white; border: none; padding: 8px 20px; border-radius: 4px; font-family: 'Segoe UI', sans-serif; font-weight: 600; cursor: pointer; font-size: 14px;">Primary Button</button>`,
    },
    {
      id: "fluent-button-secondary",
      name: "Button (Secondary)",
      description: "Secondary action button with outline styling",
      category: "Buttons",
      githubPath: "react-components/react-button",
      htmlCode: `<button style="background: transparent; color: #8E9AAF; border: 1px solid #8E9AAF; padding: 7px 19px; border-radius: 4px; font-family: 'Segoe UI', sans-serif; font-weight: 600; cursor: pointer; font-size: 14px;">Secondary Button</button>`,
    },
    {
      id: "fluent-button-subtle",
      name: "Button (Subtle)",
      description: "Subtle button for less prominent actions",
      category: "Buttons",
      githubPath: "react-components/react-button",
      htmlCode: `<button style="background: transparent; color: #3C4858; border: none; padding: 8px 20px; border-radius: 4px; font-family: 'Segoe UI', sans-serif; font-weight: 600; cursor: pointer; font-size: 14px;">Subtle Button</button>`,
    },
    {
      id: "fluent-compound-button",
      name: "CompoundButton",
      description: "Button with primary and secondary text content",
      category: "Buttons",
      githubPath: "react-components/react-button",
      htmlCode: `<button style="background: #8E9AAF; color: white; border: none; padding: 12px 20px; border-radius: 4px; font-family: 'Segoe UI', sans-serif; cursor: pointer; text-align: left; min-width: 200px;"><div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;">Compound Button</div><div style="font-size: 12px; opacity: 0.9;">Secondary text content</div></button>`,
    },
    {
      id: "fluent-toggle-button",
      name: "ToggleButton",
      description:
        "Button that can be toggled between checked and unchecked states",
      category: "Buttons",
      githubPath: "react-components/react-button",
      htmlCode: `<button style="background: #f3f2f1; color: #3C4858; border: 1px solid #8a8886; padding: 8px 20px; border-radius: 4px; font-family: 'Segoe UI', sans-serif; font-weight: 600; cursor: pointer; font-size: 14px;">Toggle Button</button>`,
    },

    // Input Components
    {
      id: "fluent-input",
      name: "Input",
      description: "Text input field for single-line text entry",
      category: "Inputs",
      githubPath: "react-components/react-input",
      htmlCode: `<div style="margin-bottom: 16px;"><label style="display: block; margin-bottom: 4px; font-family: 'Segoe UI', sans-serif; font-weight: 600; color: #3C4858; font-size: 14px;">Label</label><input type="text" placeholder="Enter text here" style="width: 100%; max-width: 300px; padding: 8px 12px; border: 1px solid #8a8886; border-radius: 2px; font-family: 'Segoe UI', sans-serif; font-size: 14px;" /></div>`,
    },
    {
      id: "fluent-textarea",
      name: "Textarea",
      description: "Multi-line text input field",
      category: "Inputs",
      githubPath: "react-components/react-textarea",
      htmlCode: `<div style="margin-bottom: 16px;"><label style="display: block; margin-bottom: 4px; font-family: 'Segoe UI', sans-serif; font-weight: 600; color: #3C4858; font-size: 14px;">Description</label><textarea placeholder="Enter description here" style="width: 100%; max-width: 300px; padding: 8px 12px; border: 1px solid #8a8886; border-radius: 2px; font-family: 'Segoe UI', sans-serif; font-size: 14px; min-height: 80px; resize: vertical;"></textarea></div>`,
    },
    {
      id: "fluent-combobox",
      name: "Combobox",
      description: "Dropdown with text input and selectable options",
      category: "Inputs",
      githubPath: "react-components/react-combobox",
      htmlCode: `<div style="margin-bottom: 16px;"><label style="display: block; margin-bottom: 4px; font-family: 'Segoe UI', sans-serif; font-weight: 600; color: #3C4858; font-size: 14px;">Select Option</label><select style="width: 100%; max-width: 300px; padding: 8px 12px; border: 1px solid #8a8886; border-radius: 2px; font-family: 'Segoe UI', sans-serif; font-size: 14px; background: white;"><option>Choose an option...</option><option>Option 1</option><option>Option 2</option><option>Option 3</option></select></div>`,
    },
    {
      id: "fluent-checkbox",
      name: "Checkbox",
      description: "Checkbox for boolean input",
      category: "Inputs",
      githubPath: "react-components/react-checkbox",
      htmlCode: `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-family: 'Segoe UI', sans-serif;"><input type="checkbox" id="checkbox1" style="margin: 0; width: 16px; height: 16px;" /><label for="checkbox1" style="color: #3C4858; cursor: pointer; font-size: 14px;">I agree to the terms and conditions</label></div>`,
    },
    {
      id: "fluent-radio-group",
      name: "RadioGroup",
      description: "Group of radio buttons for single selection",
      category: "Inputs",
      githubPath: "react-components/react-radio",
      htmlCode: `<div style="font-family: 'Segoe UI', sans-serif;"><div style="margin-bottom: 8px; font-weight: 600; color: #3C4858; font-size: 14px;">Choose an option:</div><div style="display: flex; flex-direction: column; gap: 8px;"><label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;"><input type="radio" name="options" value="option1" /><span>Option 1</span></label><label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;"><input type="radio" name="options" value="option2" /><span>Option 2</span></label><label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;"><input type="radio" name="options" value="option3" /><span>Option 3</span></label></div></div>`,
    },
    {
      id: "fluent-switch",
      name: "Switch",
      description: "Toggle switch for on/off states",
      category: "Inputs",
      githubPath: "react-components/react-switch",
      htmlCode: `<div style="display: flex; align-items: center; gap: 8px; font-family: 'Segoe UI', sans-serif;"><div style="width: 40px; height: 20px; background: #8a8886; border-radius: 20px; position: relative; cursor: pointer;"><div style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: transform 0.2s;"></div></div><label style="color: #3C4858; cursor: pointer; font-size: 14px;">Enable notifications</label></div>`,
    },

    // Layout Components
    {
      id: "fluent-card",
      name: "Card",
      description: "Container for grouping related content",
      category: "Layout",
      githubPath: "react-components/react-card",
      htmlCode: `<div style="background: white; border: 1px solid #e1e5e9; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-family: 'Segoe UI', sans-serif; max-width: 300px;"><h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #3C4858;">Card Title</h3><p style="margin: 0 0 16px 0; color: #68769C; line-height: 1.5; font-size: 14px;">This is a sample card with some content. Cards are great for grouping related information.</p><button style="background: #8E9AAF; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 14px;">Action</button></div>`,
    },
    {
      id: "fluent-divider",
      name: "Divider",
      description: "Visual separator between content sections",
      category: "Layout",
      githubPath: "react-components/react-divider",
      htmlCode: `<div style="margin: 16px 0;"><hr style="border: none; height: 1px; background: #e1e5e9; margin: 0;" /></div>`,
    },

    // Navigation Components
    {
      id: "fluent-breadcrumb",
      name: "Breadcrumb",
      description: "Navigation breadcrumb trail",
      category: "Navigation",
      githubPath: "react-components/react-breadcrumb",
      htmlCode: `<nav style="font-family: 'Segoe UI', sans-serif; font-size: 14px;"><ol style="list-style: none; padding: 0; margin: 0; display: flex; align-items: center;"><li><a href="#" style="color: #8E9AAF; text-decoration: none;">Home</a></li><li style="margin: 0 8px; color: #8a8886;">/</li><li><a href="#" style="color: #8E9AAF; text-decoration: none;">Category</a></li><li style="margin: 0 8px; color: #8a8886;">/</li><li style="color: #3C4858;">Current Page</li></ol></nav>`,
    },
    {
      id: "fluent-tab-list",
      name: "TabList",
      description: "Horizontal tab navigation",
      category: "Navigation",
      githubPath: "react-components/react-tabs",
      htmlCode: `<div style="font-family: 'Segoe UI', sans-serif;"><div style="display: flex; border-bottom: 1px solid #e1e5e9;"><button style="background: none; border: none; padding: 12px 16px; cursor: pointer; font-size: 14px; font-weight: 600; color: #8E9AAF; border-bottom: 2px solid #8E9AAF;">Tab 1</button><button style="background: none; border: none; padding: 12px 16px; cursor: pointer; font-size: 14px; color: #68769C; border-bottom: 2px solid transparent;">Tab 2</button><button style="background: none; border: none; padding: 12px 16px; cursor: pointer; font-size: 14px; color: #68769C; border-bottom: 2px solid transparent;">Tab 3</button></div><div style="padding: 20px 0;"><p style="margin: 0; color: #3C4858;">Content for Tab 1</p></div></div>`,
    },

    // Data Display
    {
      id: "fluent-avatar",
      name: "Avatar",
      description: "User profile image or initials",
      category: "Data Display",
      githubPath: "react-components/react-avatar",
      htmlCode: `<div style="width: 40px; height: 40px; border-radius: 50%; background: #8E9AAF; display: flex; align-items: center; justify-content: center; color: white; font-family: 'Segoe UI', sans-serif; font-weight: 600; font-size: 16px;">JD</div>`,
    },
    {
      id: "fluent-badge",
      name: "Badge",
      description: "Small status or count indicator",
      category: "Data Display",
      githubPath: "react-components/react-badge",
      htmlCode: `<span style="background: #d13438; color: white; font-family: 'Segoe UI', sans-serif; font-size: 12px; font-weight: 600; padding: 2px 6px; border-radius: 10px; min-width: 16px; text-align: center; display: inline-block;">3</span>`,
    },
    {
      id: "fluent-progress-bar",
      name: "ProgressBar",
      description: "Visual progress indicator",
      category: "Data Display",
      githubPath: "react-components/react-progress",
      htmlCode: `<div style="font-family: 'Segoe UI', sans-serif; margin-bottom: 16px;"><div style="margin-bottom: 8px; font-weight: 600; color: #3C4858; font-size: 14px;">Progress: 60%</div><div style="width: 100%; max-width: 300px; height: 8px; background: #f3f2f1; border-radius: 4px; overflow: hidden;"><div style="width: 60%; height: 100%; background: #8E9AAF; transition: width 0.3s ease;"></div></div></div>`,
    },
    {
      id: "fluent-spinner",
      name: "Spinner",
      description: "Loading spinner indicator",
      category: "Data Display",
      githubPath: "react-components/react-spinner",
      htmlCode: `<div style="display: flex; align-items: center; gap: 12px; font-family: 'Segoe UI', sans-serif;"><div style="width: 20px; height: 20px; border: 2px solid #f3f2f1; border-top: 2px solid #8E9AAF; border-radius: 50%; animation: spin 1s linear infinite;"></div><span style="color: #3C4858; font-size: 14px;">Loading...</span></div><style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>`,
    },

    // Feedback Components
    {
      id: "fluent-message-bar",
      name: "MessageBar",
      description: "Notification message with status styling",
      category: "Feedback",
      githubPath: "react-components/react-message-bar",
      htmlCode: `<div style="background: #f3f9fd; border: 1px solid #cfe4fa; border-left: 4px solid #8E9AAF; padding: 12px 16px; border-radius: 4px; font-family: 'Segoe UI', sans-serif; margin-bottom: 16px;"><div style="display: flex; align-items: center; gap: 8px;"><span style="color: #004578; font-weight: 600; font-size: 14px;">Info</span><span style="color: #3C4858; font-size: 14px;">This is an informational message.</span></div></div>`,
    },
    {
      id: "fluent-toast",
      name: "Toast",
      description: "Temporary notification popup",
      category: "Feedback",
      githubPath: "react-components/react-toast",
      htmlCode: `<div style="background: white; border: 1px solid #e1e5e9; border-radius: 8px; padding: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); font-family: 'Segoe UI', sans-serif; max-width: 300px;"><div style="display: flex; align-items: center; gap: 12px;"><div style="width: 4px; height: 40px; background: #107c10; border-radius: 2px;"></div><div><div style="font-weight: 600; color: #3C4858; font-size: 14px; margin-bottom: 4px;">Success!</div><div style="color: #68769C; font-size: 14px;">Your action was completed successfully.</div></div></div></div>`,
    },

    // Menu Components
    {
      id: "fluent-menu",
      name: "Menu",
      description: "Dropdown menu with selectable options",
      category: "Overlays",
      githubPath: "react-components/react-menu",
      htmlCode: `<div style="background: white; border: 1px solid #e1e5e9; border-radius: 4px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); font-family: 'Segoe UI', sans-serif; min-width: 200px;"><div style="padding: 4px 0;"><div style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">Menu Item 1</div><div style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">Menu Item 2</div><hr style="border: none; height: 1px; background: #e1e5e9; margin: 4px 0;" /><div style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">Menu Item 3</div></div></div>`,
    },

    // Toolbar Components
    {
      id: "fluent-toolbar",
      name: "Toolbar",
      description: "Container for action buttons and controls",
      category: "Navigation",
      githubPath: "react-components/react-toolbar",
      htmlCode: `<div style="background: #f8f9fa; border: 1px solid #e1e5e9; border-radius: 4px; padding: 8px; display: flex; align-items: center; gap: 8px; font-family: 'Segoe UI', sans-serif;"><button style="background: none; border: none; padding: 8px; cursor: pointer; border-radius: 4px; font-size: 14px;">Cut</button><button style="background: none; border: none; padding: 8px; cursor: pointer; border-radius: 4px; font-size: 14px;">Copy</button><button style="background: none; border: none; padding: 8px; cursor: pointer; border-radius: 4px; font-size: 14px;">Paste</button><div style="width: 1px; height: 20px; background: #e1e5e9; margin: 0 4px;"></div><button style="background: none; border: none; padding: 8px; cursor: pointer; border-radius: 4px; font-size: 14px;">Undo</button><button style="background: none; border: none; padding: 8px; cursor: pointer; border-radius: 4px; font-size: 14px;">Redo</button></div>`,
    },
  ],
};

// Write the fluent-library.json file
const outputPath = path.join(__dirname, "..", "public", "fluent-library.json");
const outputDir = path.dirname(outputPath);

// Ensure the directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(fluentUIComponents, null, 2));

console.log("✅ Fluent UI component library generated successfully!");
console.log(`📁 File saved to: ${outputPath}`);
console.log(`📊 Total components: ${fluentUIComponents.components.length}`);

// Display component count by category
const categoryCounts = {};
fluentUIComponents.components.forEach((comp) => {
  categoryCounts[comp.category] = (categoryCounts[comp.category] || 0) + 1;
});

console.log("\n📋 Components by category:");
Object.entries(categoryCounts).forEach(([category, count]) => {
  console.log(`   ${category}: ${count} components`);
});
