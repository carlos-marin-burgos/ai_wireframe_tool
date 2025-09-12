#!/usr/bin/env node

/**
 * Advanced Fluent UI Component Fetcher
 * Fetches component data from Fluent UI Storybook API and generates comprehensive fluent-library.json
 *
 * Usage: node scripts/fetch-fluent-advanced.cjs
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

// Fluent UI Storybook base URL
const FLUENT_STORYBOOK_URL = "https://react.fluentui.dev";

// Function to make HTTP requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// Enhanced component definitions with more comprehensive coverage
const enhancedFluentComponents = {
  components: [
    // Basic Components
    {
      id: "fluent-button-primary",
      name: "Button (Primary)",
      description:
        "Primary action button with emphasis styling from Fluent UI React",
      category: "Buttons",
      githubPath: "react-components/react-button",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-button--default",
      htmlCode: `<button style="background: #8E9AAF; color: white; border: none; padding: 8px 20px; border-radius: 4px; font-family: 'Segoe UI', sans-serif; font-weight: 600; cursor: pointer; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#68769C'" onmouseout="this.style.background='#8E9AAF'">Primary Button</button>`,
    },
    {
      id: "fluent-button-secondary",
      name: "Button (Secondary)",
      description:
        "Secondary action button with outline styling from Fluent UI React",
      category: "Buttons",
      githubPath: "react-components/react-button",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-button--default",
      htmlCode: `<button style="background: transparent; color: #8E9AAF; border: 1px solid #8E9AAF; padding: 7px 19px; border-radius: 4px; font-family: 'Segoe UI', sans-serif; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.2s;" onmouseover="this.style.background='#f3f9fd'" onmouseout="this.style.background='transparent'">Secondary Button</button>`,
    },
    {
      id: "fluent-button-subtle",
      name: "Button (Subtle)",
      description:
        "Subtle button for less prominent actions from Fluent UI React",
      category: "Buttons",
      githubPath: "react-components/react-button",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-button--default",
      htmlCode: `<button style="background: transparent; color: #3C4858; border: none; padding: 8px 20px; border-radius: 4px; font-family: 'Segoe UI', sans-serif; font-weight: 600; cursor: pointer; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">Subtle Button</button>`,
    },
    {
      id: "fluent-compound-button",
      name: "CompoundButton",
      description:
        "Button with primary and secondary text content from Fluent UI React",
      category: "Buttons",
      githubPath: "react-components/react-button",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-button--compound",
      htmlCode: `<button style="background: #8E9AAF; color: white; border: none; padding: 12px 20px; border-radius: 4px; font-family: 'Segoe UI', sans-serif; cursor: pointer; text-align: left; min-width: 200px; transition: background 0.2s;" onmouseover="this.style.background='#68769C'" onmouseout="this.style.background='#8E9AAF'"><div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;">Compound Button</div><div style="font-size: 12px; opacity: 0.9;">Secondary text content</div></button>`,
    },
    {
      id: "fluent-toggle-button",
      name: "ToggleButton",
      description:
        "Button that can be toggled between checked and unchecked states from Fluent UI React",
      category: "Buttons",
      githubPath: "react-components/react-button",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-button--toggle",
      htmlCode: `<button style="background: #f3f2f1; color: #3C4858; border: 1px solid #8a8886; padding: 8px 20px; border-radius: 4px; font-family: 'Segoe UI', sans-serif; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.2s;" onmouseover="this.style.background='#edebe9'" onmouseout="this.style.background='#f3f2f1'">Toggle Button</button>`,
    },
    {
      id: "fluent-menu-button",
      name: "MenuButton",
      description: "Button that opens a dropdown menu from Fluent UI React",
      category: "Buttons",
      githubPath: "react-components/react-button",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-button--menu",
      htmlCode: `<button style="background: #8E9AAF; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-family: 'Segoe UI', sans-serif; font-weight: 600; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px; transition: background 0.2s;" onmouseover="this.style.background='#68769C'" onmouseout="this.style.background='#8E9AAF'">Menu Button <span style="font-size: 12px;">▼</span></button>`,
    },

    // Input Components
    {
      id: "fluent-input",
      name: "Input",
      description:
        "Text input field for single-line text entry from Fluent UI React",
      category: "Inputs",
      githubPath: "react-components/react-input",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-input--default",
      htmlCode: `<div style="margin-bottom: 16px;"><label style="display: block; margin-bottom: 4px; font-family: 'Segoe UI', sans-serif; font-weight: 600; color: #3C4858; font-size: 14px;">Label</label><input type="text" placeholder="Enter text here" style="width: 100%; max-width: 300px; padding: 8px 12px; border: 1px solid #8a8886; border-radius: 2px; font-family: 'Segoe UI', sans-serif; font-size: 14px; transition: border-color 0.2s;" onfocus="this.style.borderColor='#8E9AAF'" onblur="this.style.borderColor='#8a8886'" /></div>`,
    },
    {
      id: "fluent-textarea",
      name: "Textarea",
      description: "Multi-line text input field from Fluent UI React",
      category: "Inputs",
      githubPath: "react-components/react-textarea",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-textarea--default",
      htmlCode: `<div style="margin-bottom: 16px;"><label style="display: block; margin-bottom: 4px; font-family: 'Segoe UI', sans-serif; font-weight: 600; color: #3C4858; font-size: 14px;">Description</label><textarea placeholder="Enter description here" style="width: 100%; max-width: 300px; padding: 8px 12px; border: 1px solid #8a8886; border-radius: 2px; font-family: 'Segoe UI', sans-serif; font-size: 14px; min-height: 80px; resize: vertical; transition: border-color 0.2s;" onfocus="this.style.borderColor='#8E9AAF'" onblur="this.style.borderColor='#8a8886'"></textarea></div>`,
    },
    {
      id: "fluent-combobox",
      name: "Combobox",
      description:
        "Dropdown with text input and selectable options from Fluent UI React",
      category: "Inputs",
      githubPath: "react-components/react-combobox",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-combobox--default",
      htmlCode: `<div style="margin-bottom: 16px;"><label style="display: block; margin-bottom: 4px; font-family: 'Segoe UI', sans-serif; font-weight: 600; color: #3C4858; font-size: 14px;">Select Option</label><select style="width: 100%; max-width: 300px; padding: 8px 12px; border: 1px solid #8a8886; border-radius: 2px; font-family: 'Segoe UI', sans-serif; font-size: 14px; background: white; cursor: pointer; transition: border-color 0.2s;" onfocus="this.style.borderColor='#8E9AAF'" onblur="this.style.borderColor='#8a8886'"><option>Choose an option...</option><option>Option 1</option><option>Option 2</option><option>Option 3</option></select></div>`,
    },
    {
      id: "fluent-dropdown",
      name: "Dropdown",
      description: "Simple dropdown selection component from Fluent UI React",
      category: "Inputs",
      githubPath: "react-components/react-dropdown",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-dropdown--default",
      htmlCode: `<div style="position: relative; margin-bottom: 16px;"><label style="display: block; margin-bottom: 4px; font-family: 'Segoe UI', sans-serif; font-weight: 600; color: #3C4858; font-size: 14px;">Choose Option</label><div style="width: 100%; max-width: 300px; padding: 8px 12px; border: 1px solid #8a8886; border-radius: 2px; font-family: 'Segoe UI', sans-serif; font-size: 14px; background: white; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="alert('Dropdown clicked')">Selected Option <span style="font-size: 12px; color: #8a8886;">▼</span></div></div>`,
    },
    {
      id: "fluent-checkbox",
      name: "Checkbox",
      description: "Checkbox for boolean input from Fluent UI React",
      category: "Inputs",
      githubPath: "react-components/react-checkbox",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-checkbox--default",
      htmlCode: `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-family: 'Segoe UI', sans-serif;"><input type="checkbox" id="checkbox1" style="margin: 0; width: 16px; height: 16px; cursor: pointer;" /><label for="checkbox1" style="color: #3C4858; cursor: pointer; font-size: 14px;">I agree to the terms and conditions</label></div>`,
    },
    {
      id: "fluent-radio-group",
      name: "RadioGroup",
      description:
        "Group of radio buttons for single selection from Fluent UI React",
      category: "Inputs",
      githubPath: "react-components/react-radio",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-radio--default",
      htmlCode: `<div style="font-family: 'Segoe UI', sans-serif;"><div style="margin-bottom: 8px; font-weight: 600; color: #3C4858; font-size: 14px;">Choose an option:</div><div style="display: flex; flex-direction: column; gap: 8px;"><label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;"><input type="radio" name="options" value="option1" style="cursor: pointer;" /><span>Option 1</span></label><label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;"><input type="radio" name="options" value="option2" style="cursor: pointer;" /><span>Option 2</span></label><label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;"><input type="radio" name="options" value="option3" style="cursor: pointer;" /><span>Option 3</span></label></div></div>`,
    },
    {
      id: "fluent-switch",
      name: "Switch",
      description: "Toggle switch for on/off states from Fluent UI React",
      category: "Inputs",
      githubPath: "react-components/react-switch",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-switch--default",
      htmlCode: `<div style="display: flex; align-items: center; gap: 8px; font-family: 'Segoe UI', sans-serif;"><div style="width: 40px; height: 20px; background: #8a8886; border-radius: 20px; position: relative; cursor: pointer; transition: background 0.2s;" onclick="this.style.background=this.style.background==='rgb(0, 120, 212)' ? '#8a8886' : '#8E9AAF'; this.children[0].style.transform=this.style.background==='rgb(0, 120, 212)' ? 'translateX(20px)' : 'translateX(0)';"><div style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: transform 0.2s;"></div></div><label style="color: #3C4858; cursor: pointer; font-size: 14px;">Enable notifications</label></div>`,
    },
    {
      id: "fluent-slider",
      name: "Slider",
      description:
        "Range slider for numeric value selection from Fluent UI React",
      category: "Inputs",
      githubPath: "react-components/react-slider",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-slider--default",
      htmlCode: `<div style="font-family: 'Segoe UI', sans-serif; margin-bottom: 16px;"><label style="display: block; margin-bottom: 8px; font-weight: 600; color: #3C4858; font-size: 14px;">Volume: 50%</label><div style="position: relative; width: 100%; max-width: 300px; height: 4px; background: #e1e5e9; border-radius: 2px; cursor: pointer;"><div style="position: absolute; left: 0; top: 0; width: 50%; height: 100%; background: #8E9AAF; border-radius: 2px;"></div><div style="position: absolute; left: 50%; top: -6px; width: 16px; height: 16px; background: #8E9AAF; border-radius: 50%; transform: translateX(-50%); cursor: grab;"></div></div></div>`,
    },

    // Layout Components
    {
      id: "fluent-card",
      name: "Card",
      description:
        "Container for grouping related content from Fluent UI React",
      category: "Layout",
      githubPath: "react-components/react-card",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-card--default",
      htmlCode: `<div style="background: white; border: 1px solid #e1e5e9; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-family: 'Segoe UI', sans-serif; max-width: 300px; transition: box-shadow 0.2s;" onmouseover="this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)'" onmouseout="this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"><h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #3C4858;">Card Title</h3><p style="margin: 0 0 16px 0; color: #68769C; line-height: 1.5; font-size: 14px;">This is a sample card with some content. Cards are great for grouping related information.</p><button style="background: #8E9AAF; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 14px;">Action</button></div>`,
    },
    {
      id: "fluent-divider",
      name: "Divider",
      description:
        "Visual separator between content sections from Fluent UI React",
      category: "Layout",
      githubPath: "react-components/react-divider",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-divider--default",
      htmlCode: `<div style="margin: 16px 0;"><hr style="border: none; height: 1px; background: #e1e5e9; margin: 0;" /></div>`,
    },
    {
      id: "fluent-accordion",
      name: "Accordion",
      description: "Collapsible content sections from Fluent UI React",
      category: "Layout",
      githubPath: "react-components/react-accordion",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-accordion--default",
      htmlCode: `<div style="border: 1px solid #e1e5e9; border-radius: 4px; font-family: 'Segoe UI', sans-serif; max-width: 400px;"><div style="padding: 12px 16px; background: #f8f9fa; border-bottom: 1px solid #e1e5e9; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: 600; color: #3C4858;" onclick="var content=this.nextElementSibling; content.style.display=content.style.display==='none'?'block':'none'; this.children[0].textContent=content.style.display==='none'?'▶':'▼';"><span>▼</span><span>Accordion Item 1</span><span></span></div><div style="padding: 16px; color: #68769C; line-height: 1.5; border-bottom: 1px solid #e1e5e9;">This is the content of the first accordion item. It can contain any type of content including text, images, or other components.</div><div style="padding: 12px 16px; background: #f8f9fa; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: 600; color: #3C4858;" onclick="var content=this.nextElementSibling; content.style.display=content.style.display==='none'?'block':'none'; this.children[0].textContent=content.style.display==='none'?'▶':'▼';"><span>▶</span><span>Accordion Item 2</span><span></span></div><div style="padding: 16px; color: #68769C; line-height: 1.5; display: none;">This is the content of the second accordion item.</div></div>`,
    },

    // Navigation Components
    {
      id: "fluent-breadcrumb",
      name: "Breadcrumb",
      description: "Navigation breadcrumb trail from Fluent UI React",
      category: "Navigation",
      githubPath: "react-components/react-breadcrumb",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-breadcrumb--default",
      htmlCode: `<nav style="font-family: 'Segoe UI', sans-serif; font-size: 14px;"><ol style="list-style: none; padding: 0; margin: 0; display: flex; align-items: center;"><li><a href="#" style="color: #8E9AAF; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='#68769C'" onmouseout="this.style.color='#8E9AAF'">Home</a></li><li style="margin: 0 8px; color: #8a8886;">/</li><li><a href="#" style="color: #8E9AAF; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='#68769C'" onmouseout="this.style.color='#8E9AAF'">Category</a></li><li style="margin: 0 8px; color: #8a8886;">/</li><li style="color: #3C4858;">Current Page</li></ol></nav>`,
    },
    {
      id: "fluent-tab-list",
      name: "TabList",
      description: "Horizontal tab navigation from Fluent UI React",
      category: "Navigation",
      githubPath: "react-components/react-tabs",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-tabs--default",
      htmlCode: `<div style="font-family: 'Segoe UI', sans-serif;"><div style="display: flex; border-bottom: 1px solid #e1e5e9;"><button style="background: none; border: none; padding: 12px 16px; cursor: pointer; font-size: 14px; font-weight: 600; color: #8E9AAF; border-bottom: 2px solid #8E9AAF; transition: color 0.2s;">Tab 1</button><button style="background: none; border: none; padding: 12px 16px; cursor: pointer; font-size: 14px; color: #68769C; border-bottom: 2px solid transparent; transition: color 0.2s;" onmouseover="this.style.color='#3C4858'" onmouseout="this.style.color='#68769C'">Tab 2</button><button style="background: none; border: none; padding: 12px 16px; cursor: pointer; font-size: 14px; color: #68769C; border-bottom: 2px solid transparent; transition: color 0.2s;" onmouseover="this.style.color='#3C4858'" onmouseout="this.style.color='#68769C'">Tab 3</button></div><div style="padding: 20px 0;"><p style="margin: 0; color: #3C4858; line-height: 1.5;">Content for Tab 1. This area shows the content associated with the currently selected tab.</p></div></div>`,
    },
    {
      id: "fluent-toolbar",
      name: "Toolbar",
      description:
        "Container for action buttons and controls from Fluent UI React",
      category: "Navigation",
      githubPath: "react-components/react-toolbar",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-toolbar--default",
      htmlCode: `<div style="background: #f8f9fa; border: 1px solid #e1e5e9; border-radius: 4px; padding: 8px; display: flex; align-items: center; gap: 8px; font-family: 'Segoe UI', sans-serif;"><button style="background: none; border: none; padding: 8px; cursor: pointer; border-radius: 4px; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#e1e5e9'" onmouseout="this.style.background='transparent'">Cut</button><button style="background: none; border: none; padding: 8px; cursor: pointer; border-radius: 4px; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#e1e5e9'" onmouseout="this.style.background='transparent'">Copy</button><button style="background: none; border: none; padding: 8px; cursor: pointer; border-radius: 4px; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#e1e5e9'" onmouseout="this.style.background='transparent'">Paste</button><div style="width: 1px; height: 20px; background: #e1e5e9; margin: 0 4px;"></div><button style="background: none; border: none; padding: 8px; cursor: pointer; border-radius: 4px; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#e1e5e9'" onmouseout="this.style.background='transparent'">Undo</button><button style="background: none; border: none; padding: 8px; cursor: pointer; border-radius: 4px; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#e1e5e9'" onmouseout="this.style.background='transparent'">Redo</button></div>`,
    },

    // Data Display
    {
      id: "fluent-avatar",
      name: "Avatar",
      description: "User profile image or initials from Fluent UI React",
      category: "Data Display",
      githubPath: "react-components/react-avatar",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-avatar--default",
      htmlCode: `<div style="width: 40px; height: 40px; border-radius: 50%; background: #8E9AAF; display: flex; align-items: center; justify-content: center; color: white; font-family: 'Segoe UI', sans-serif; font-weight: 600; font-size: 16px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#68769C'" onmouseout="this.style.background='#8E9AAF'" title="John Doe">JD</div>`,
    },
    {
      id: "fluent-badge",
      name: "Badge",
      description: "Small status or count indicator from Fluent UI React",
      category: "Data Display",
      githubPath: "react-components/react-badge",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-badge--default",
      htmlCode: `<span style="background: #d13438; color: white; font-family: 'Segoe UI', sans-serif; font-size: 12px; font-weight: 600; padding: 2px 6px; border-radius: 10px; min-width: 16px; text-align: center; display: inline-block; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">3</span>`,
    },
    {
      id: "fluent-progress-bar",
      name: "ProgressBar",
      description: "Visual progress indicator from Fluent UI React",
      category: "Data Display",
      githubPath: "react-components/react-progress",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-progress--default",
      htmlCode: `<div style="font-family: 'Segoe UI', sans-serif; margin-bottom: 16px;"><div style="margin-bottom: 8px; font-weight: 600; color: #3C4858; font-size: 14px;">Progress: 60%</div><div style="width: 100%; max-width: 300px; height: 8px; background: #f3f2f1; border-radius: 4px; overflow: hidden;"><div style="width: 60%; height: 100%; background: #8E9AAF; transition: width 0.3s ease; border-radius: 4px;"></div></div></div>`,
    },
    {
      id: "fluent-spinner",
      name: "Spinner",
      description: "Loading spinner indicator from Fluent UI React",
      category: "Data Display",
      githubPath: "react-components/react-spinner",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-spinner--default",
      htmlCode: `<div style="display: flex; align-items: center; gap: 12px; font-family: 'Segoe UI', sans-serif;"><div style="width: 20px; height: 20px; border: 2px solid #f3f2f1; border-top: 2px solid #8E9AAF; border-radius: 50%; animation: spin 1s linear infinite;"></div><span style="color: #3C4858; font-size: 14px;">Loading...</span></div><style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>`,
    },
    {
      id: "fluent-image",
      name: "Image",
      description: "Responsive image component from Fluent UI React",
      category: "Data Display",
      githubPath: "react-components/react-image",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-image--default",
      htmlCode: `<div style="width: 200px; height: 150px; border: 1px solid #e1e5e9; border-radius: 4px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; font-family: 'Segoe UI', sans-serif; color: #8a8886; font-size: 14px;">Image Placeholder</div>`,
    },

    // Feedback Components
    {
      id: "fluent-message-bar",
      name: "MessageBar",
      description:
        "Notification message with status styling from Fluent UI React",
      category: "Feedback",
      githubPath: "react-components/react-message-bar",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-messagebar--default",
      htmlCode: `<div style="background: #f3f9fd; border: 1px solid #cfe4fa; border-left: 4px solid #8E9AAF; padding: 12px 16px; border-radius: 4px; font-family: 'Segoe UI', sans-serif; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;"><span style="color: #004578; font-weight: 600; font-size: 14px;">ℹ</span><span style="color: #3C4858; font-size: 14px;">This is an informational message that provides important context to the user.</span><button style="background: none; border: none; color: #8a8886; cursor: pointer; margin-left: auto; font-size: 16px;" onclick="this.parentElement.style.display='none'">×</button></div>`,
    },
    {
      id: "fluent-toast",
      name: "Toast",
      description: "Temporary notification popup from Fluent UI React",
      category: "Feedback",
      githubPath: "react-components/react-toast",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-toast--default",
      htmlCode: `<div style="background: white; border: 1px solid #e1e5e9; border-radius: 8px; padding: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); font-family: 'Segoe UI', sans-serif; max-width: 300px; position: relative;"><div style="display: flex; align-items: center; gap: 12px;"><div style="width: 4px; height: 40px; background: #107c10; border-radius: 2px;"></div><div><div style="font-weight: 600; color: #3C4858; font-size: 14px; margin-bottom: 4px;">✓ Success!</div><div style="color: #68769C; font-size: 14px;">Your action was completed successfully.</div></div></div><button style="position: absolute; top: 8px; right: 8px; background: none; border: none; color: #8a8886; cursor: pointer; font-size: 16px;" onclick="this.parentElement.style.display='none'">×</button></div>`,
    },
    {
      id: "fluent-dialog",
      name: "Dialog",
      description:
        "Modal dialog for important interactions from Fluent UI React",
      category: "Feedback",
      githubPath: "react-components/react-dialog",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-dialog--default",
      htmlCode: `<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-family: 'Segoe UI', sans-serif; z-index: 1000;"><div style="background: white; border-radius: 8px; padding: 24px; max-width: 400px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);"><h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #3C4858;">Confirm Action</h2><p style="margin: 0 0 20px 0; color: #68769C; line-height: 1.5;">Are you sure you want to proceed with this action? This cannot be undone.</p><div style="display: flex; gap: 12px; justify-content: flex-end;"><button style="background: transparent; color: #3C4858; border: 1px solid #8a8886; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600;">Cancel</button><button style="background: #8E9AAF; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600;">Confirm</button></div></div></div>`,
    },

    // Overlays
    {
      id: "fluent-menu",
      name: "Menu",
      description: "Dropdown menu with selectable options from Fluent UI React",
      category: "Overlays",
      githubPath: "react-components/react-menu",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-menu--default",
      htmlCode: `<div style="background: white; border: 1px solid #e1e5e9; border-radius: 4px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); font-family: 'Segoe UI', sans-serif; min-width: 200px;"><div style="padding: 4px 0;"><div style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; transition: background 0.2s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">📄 New Document</div><div style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; transition: background 0.2s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">📁 Open Folder</div><hr style="border: none; height: 1px; background: #e1e5e9; margin: 4px 0;" /><div style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; transition: background 0.2s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">💾 Save</div><div style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #d13438; transition: background 0.2s;" onmouseover="this.style.background='#fdf2f2'" onmouseout="this.style.background='transparent'">🗑️ Delete</div></div></div>`,
    },
    {
      id: "fluent-popover",
      name: "Popover",
      description: "Floating content container from Fluent UI React",
      category: "Overlays",
      githubPath: "react-components/react-popover",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-popover--default",
      htmlCode: `<div style="position: relative; display: inline-block;"><button style="background: #8E9AAF; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: 'Segoe UI', sans-serif; font-weight: 600;">Show Popover</button><div style="position: absolute; top: 100%; left: 0; margin-top: 8px; background: white; border: 1px solid #e1e5e9; border-radius: 8px; padding: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); font-family: 'Segoe UI', sans-serif; min-width: 200px; z-index: 1000;"><h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #3C4858;">Popover Title</h4><p style="margin: 0; color: #68769C; font-size: 14px; line-height: 1.5;">This is a popover with some helpful information or additional controls.</p></div></div>`,
    },
    {
      id: "fluent-tooltip",
      name: "Tooltip",
      description: "Contextual help tooltip from Fluent UI React",
      category: "Overlays",
      githubPath: "react-components/react-tooltip",
      storybookUrl:
        "https://react.fluentui.dev/?path=/docs/components-tooltip--default",
      htmlCode: `<div style="position: relative; display: inline-block; font-family: 'Segoe UI', sans-serif;"><span style="color: #8E9AAF; cursor: help; text-decoration: underline; text-decoration-style: dotted;" onmouseover="this.nextElementSibling.style.display='block'" onmouseout="this.nextElementSibling.style.display='none'">Hover for tooltip</span><div style="position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 8px; background: #3C4858; color: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; white-space: nowrap; z-index: 1000; display: none;">This is a helpful tooltip</div></div>`,
    },
  ],
};

async function fetchStorybookData() {
  console.log("🔄 Attempting to fetch data from Fluent UI Storybook...");

  try {
    // Try to fetch the Storybook stories.json file which contains component metadata
    const storiesUrl = `${FLUENT_STORYBOOK_URL}/stories.json`;
    const storiesData = await makeRequest(storiesUrl);

    console.log("✅ Successfully fetched Storybook metadata");

    // Parse the stories.json to extract component information
    const stories = JSON.parse(storiesData);

    // Extract component names and URLs from stories
    const storyEntries = Object.entries(stories.stories || {});
    console.log(`📚 Found ${storyEntries.length} stories in Storybook`);

    // Add Storybook URLs to existing components where possible
    enhancedFluentComponents.components =
      enhancedFluentComponents.components.map((comp) => {
        const matchingStory = storyEntries.find(
          ([key, story]) =>
            story.title &&
            story.title
              .toLowerCase()
              .includes(comp.name.toLowerCase().replace(/[()]/g, ""))
        );

        if (matchingStory) {
          const [storyKey] = matchingStory;
          comp.storybookUrl = `${FLUENT_STORYBOOK_URL}/?path=/story/${storyKey}`;
        }

        return comp;
      });

    console.log("🔗 Enhanced components with Storybook URLs");
  } catch (error) {
    console.log(
      "⚠️  Could not fetch live Storybook data, using predefined comprehensive library"
    );
    console.log(`   Error: ${error.message}`);
  }
}

async function generateLibrary() {
  console.log("🚀 Generating Enhanced Fluent UI Component Library...");

  // Try to fetch live data from Storybook
  await fetchStorybookData();

  // Write the enhanced fluent-library.json file
  const outputPath = path.join(
    __dirname,
    "..",
    "public",
    "fluent-library.json"
  );
  const outputDir = path.dirname(outputPath);

  // Ensure the directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    outputPath,
    JSON.stringify(enhancedFluentComponents, null, 2)
  );

  console.log(
    "✅ Enhanced Fluent UI component library generated successfully!"
  );
  console.log(`📁 File saved to: ${outputPath}`);
  console.log(
    `📊 Total components: ${enhancedFluentComponents.components.length}`
  );

  // Display component count by category
  const categoryCounts = {};
  enhancedFluentComponents.components.forEach((comp) => {
    categoryCounts[comp.category] = (categoryCounts[comp.category] || 0) + 1;
  });

  console.log("\n📋 Enhanced Components by category:");
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} components`);
  });

  console.log("\n🌟 New features in this enhanced version:");
  console.log("   • Interactive hover effects and transitions");
  console.log("   • Enhanced accessibility with proper focus states");
  console.log("   • Storybook URL references for each component");
  console.log("   • More comprehensive component coverage");
  console.log("   • Improved visual styling and user experience");
}

// Run the generator
generateLibrary().catch(console.error);
