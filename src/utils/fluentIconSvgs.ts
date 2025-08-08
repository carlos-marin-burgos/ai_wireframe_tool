/**
 * Fluent UI Icons as SVG strings for use in generated wireframes
 * These SVGs are extracted from @fluentui/react-icons for standalone HTML usage
 */

export interface FluentIconSvg {
  name: string;
  svg: string;
  viewBox: string;
}

// Common Fluent UI icons as SVG strings
export const fluentIconSvgs: Record<string, FluentIconSvg> = {
  // Navigation
  home: {
    name: "Home",
    viewBox: "0 0 20 20",
    svg: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.002 3.148a.75.75 0 0 0-.744.002L3.76 6.15c-.474.268-.76.78-.76 1.36v8.74a.75.75 0 0 0 .75.75h3a.75.75 0 0 0 .75-.75v-5a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 .75.75v5a.75.75 0 0 0 .75.75h3a.75.75 0 0 0 .75-.75V7.51a1.75 1.75 0 0 0-.76-1.36l-5.498-3z"/></svg>`
  },
  
  // Actions
  search: {
    name: "Search",
    viewBox: "0 0 20 20", 
    svg: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M8.5 3a5.5 5.5 0 0 1 4.383 8.823l3.896 3.896a.75.75 0 0 1-1.06 1.061l-3.897-3.896A5.5 5.5 0 1 1 8.5 3zM4.5 8.5a4 4 0 1 0 8 0 4 4 0 0 0-8 0z"/></svg>`
  },
  
  add: {
    name: "Add",
    viewBox: "0 0 20 20",
    svg: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5z"/></svg>`
  },
  
  edit: {
    name: "Edit",
    viewBox: "0 0 20 20",
    svg: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M12.9 6.858 13.142 7.1 7.643 12.6H7.4v-.242L12.9 6.858zm1.414-1.414L15.728 4.03a1 1 0 0 1 1.414 0l.828.828a1 1 0 0 1 0 1.414L16.556 7.686 14.314 5.444zM6.4 13.8v2.8h2.8l7.035-7.035-2.8-2.8L6.4 13.8z"/></svg>`
  },
  
  delete: {
    name: "Delete", 
    viewBox: "0 0 20 20",
    svg: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M8.5 4h3a1.5 1.5 0 0 0-3 0zm-1 0a2.5 2.5 0 0 1 5 0h5a.5.5 0 0 1 0 1h-1.054l-.821 10.26A2.5 2.5 0 0 1 13.133 18H6.867a2.5 2.5 0 0 1-2.492-2.74L3.554 5H2.5a.5.5 0 0 1 0-1h5zM5.064 5l.81 10.132A1.5 1.5 0 0 0 7.368 17h5.264a1.5 1.5 0 0 0 1.494-1.868L14.936 5H5.064z"/></svg>`
  },
  
  // User & Profile
  person: {
    name: "Person",
    viewBox: "0 0 20 20",
    svg: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM7 6a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm-2 5a2 2 0 0 0-2 2c0 1.7.83 2.97 2.13 3.8C6.42 17.6 8.16 18 10 18s3.58-.4 4.87-1.2C16.17 15.97 17 14.7 17 13a2 2 0 0 0-2-2H5zm-1 2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1c0 1.3-.62 2.28-1.67 2.95C13.29 16.65 11.75 17 10 17s-3.29-.35-4.33-1.05C4.62 15.28 4 14.3 4 13z"/></svg>`
  },
  
  settings: {
    name: "Settings",
    viewBox: "0 0 20 20",
    svg: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9.26 2c-.18 0-.34.1-.43.26l-.85 1.48a7.02 7.02 0 0 0-1.16.67l-1.69-.34c-.2-.04-.4.04-.5.2l-.74 1.28c-.1.16-.07.37.07.5l1.33 1.04c-.05.4-.05.8 0 1.2l-1.33 1.04c-.14.13-.17.34-.07.5l.74 1.28c.1.16.3.24.5.2l1.69-.34c.36.26.75.48 1.16.67l.85 1.48c.09.16.25.26.43.26h1.48c.18 0 .34-.1.43-.26l.85-1.48a7.02 7.02 0 0 0 1.16-.67l1.69.34c.2.04.4-.04.5-.2l.74-1.28c.1-.16.07-.37-.07-.5l-1.33-1.04c.05-.4.05-.8 0-1.2l1.33-1.04c.14-.13.17-.34.07-.5l-.74-1.28c-.1-.16-.3-.24-.5-.2l-1.69.34a7.02 7.02 0 0 0-1.16-.67L10.17 2.26c-.09-.16-.25-.26-.43-.26H9.26zM10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg>`
  },
  
  // Communication
  mail: {
    name: "Mail", 
    viewBox: "0 0 20 20",
    svg: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H3zm-.5 2A1.5 1.5 0 0 1 4 4.5h12A1.5 1.5 0 0 1 17.5 6v.21l-7.5 4.61L2.5 6.21V6zm0 1.79L9.14 12c.48.3 1.24.3 1.72 0L17.5 7.79V14a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 14V7.79z"/></svg>`
  },
  
  // Content
  document: {
    name: "Document",
    viewBox: "0 0 20 20",
    svg: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 0 1 2-2h4.5a.5.5 0 0 1 .354.146l5 5A.5.5 0 0 1 16 7.5V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4zm7.5-.5V7a.5.5 0 0 0 .5.5h3.5L11.5 3.5z"/></svg>`
  },
  
  // Commerce
  cart: {
    name: "Cart",
    viewBox: "0 0 20 20", 
    svg: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3.5 4a.5.5 0 0 0 0 1H4l.05.25.79 3.95A2.5 2.5 0 0 0 7.29 11H14.5a.5.5 0 0 0 0-1H7.29a1.5 1.5 0 0 1-1.47-1.22L5.05 5H16.5a.5.5 0 0 1 .49.6l-.74 4.44a.5.5 0 0 0 .99.17l.74-4.44A1.5 1.5 0 0 0 16.5 4H3.5zM6 16.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm7 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"/></svg>`
  },
  
  // Status
  checkmark: {
    name: "Checkmark",
    viewBox: "0 0 20 20",
    svg: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M16.78 5.97a.75.75 0 0 1 .02 1.06l-8.25 8.5a.75.75 0 0 1-1.08-.02l-3.5-3.75a.75.75 0 1 1 1.1-1.02l2.95 3.17 7.7-7.94a.75.75 0 0 1 1.06-.02z"/></svg>`
  },
  
  warning: {
    name: "Warning", 
    viewBox: "0 0 20 20",
    svg: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M8.68 2.79a1.5 1.5 0 0 1 2.64 0l6.5 11.5A1.5 1.5 0 0 1 16.5 17h-13a1.5 1.5 0 0 1-1.32-2.21l6.5-11.5zM10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6zm0 7a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z"/></svg>`
  }
};

/**
 * Get a Fluent icon as an inline SVG string
 */
export function getFluentIconSvg(iconName: string, className?: string, style?: string): string {
  const icon = fluentIconSvgs[iconName];
  if (!icon) {
    console.warn(`Fluent icon "${iconName}" not found. Available icons:`, Object.keys(fluentIconSvgs));
    return `<span>📄</span>`; // Fallback
  }
  
  const classAttr = className ? ` class="${className}"` : '';
  const styleAttr = style ? ` style="${style}"` : '';
  
  return icon.svg.replace('<svg', `<svg${classAttr}${styleAttr}`);
}

/**
 * Get all available Fluent icon names
 */
export function getAvailableFluentIcons(): string[] {
  return Object.keys(fluentIconSvgs);
}

/**
 * Replace icon placeholders in HTML with actual Fluent icons
 * Usage: {{icon:home}}, {{icon:search}}, etc.
 */
export function replaceFluentIconPlaceholders(html: string): string {
  return html.replace(/\{\{icon:([^}]+)\}\}/g, (match, iconName) => {
    return getFluentIconSvg(iconName, 'fluent-icon', 'width: 20px; height: 20px; vertical-align: middle;');
  });
}

/**
 * Generate CSS for Fluent icons in wireframes
 */
export function getFluentIconCSS(): string {
  return `
    .fluent-icon {
      width: 20px;
      height: 20px;
      display: inline-block;
      vertical-align: middle;
      color: currentColor;
      fill: currentColor;
    }
    
    .fluent-icon-lg {
      width: 24px;
      height: 24px;
    }
    
    .fluent-icon-sm {
      width: 16px;
      height: 16px;
    }
    
    /* Button icons */
    button .fluent-icon {
      margin-right: 6px;
    }
    
    /* Navigation icons */
    nav .fluent-icon {
      margin-right: 8px;
    }
  `;
}
