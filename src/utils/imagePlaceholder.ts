/**
 * Image Placeholder Utility
 * Creates styled image placeholders following Fluent UI design patterns
 */

export interface ImagePlaceholderConfig {
  width?: number;
  height?: number;
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
}

/**
 * Generate a data URL for an SVG image placeholder
 */
export function generateImagePlaceholder(config: ImagePlaceholderConfig = {}): string {
  const {
    width = 200,
    height = 150,
    text = 'Image',
    backgroundColor = '#f3f2f1',
    textColor = '#605e5c',
    borderRadius = '4px'
  } = config;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="${backgroundColor}" stroke-width="1" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="${backgroundColor}" rx="${borderRadius}"/>
      <rect width="100%" height="100%" fill="url(#grid)" opacity="0.1"/>
      <g transform="translate(${width/2}, ${height/2})">
        <!-- Camera icon -->
        <g transform="translate(-12, -8)">
          <rect x="2" y="4" width="20" height="14" rx="2" fill="none" stroke="${textColor}" stroke-width="1.5"/>
          <circle cx="12" cy="11" r="3" fill="none" stroke="${textColor}" stroke-width="1.5"/>
          <path d="M7 4V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" fill="none" stroke="${textColor}" stroke-width="1.5"/>
        </g>
        <!-- Text -->
        <text x="0" y="26" text-anchor="middle" fill="${textColor}" font-family="Segoe UI, system-ui, sans-serif" font-size="12" font-weight="400">
          ${text}
        </text>
      </g>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Generate inline CSS for image placeholders
 */
export function getImagePlaceholderCSS(): string {
  return `
    .image-placeholder {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #f3f2f1;
      border: 1px solid #e1dfdd;
      border-radius: 4px;
      color: #605e5c;
      font-family: "Segoe UI", system-ui, sans-serif;
      font-size: 12px;
      font-weight: 400;
      text-align: center;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }
    
    .image-placeholder::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%);
      background-size: 20px 20px;
      opacity: 0.3;
    }
    
    .image-placeholder-icon {
      width: 24px;
      height: 24px;
      margin-bottom: 4px;
      opacity: 0.6;
    }
    
    .image-placeholder-text {
      display: block;
      font-size: 12px;
      line-height: 1.2;
      z-index: 1;
      position: relative;
    }
    
    /* Specific sizes */
    .image-placeholder-small {
      width: 100px;
      height: 75px;
      min-height: 75px;
    }
    
    .image-placeholder-medium {
      width: 200px;
      height: 150px;
      min-height: 150px;
    }
    
    .image-placeholder-large {
      width: 300px;
      height: 200px;
      min-height: 200px;
    }
    
    .image-placeholder-card {
      width: 100%;
      height: 120px;
      min-height: 120px;
    }
    
    .image-placeholder-avatar {
      width: 40px;
      height: 40px;
      min-height: 40px;
      border-radius: 50%;
    }
    
    .image-placeholder-banner {
      width: 100%;
      height: 200px;
      min-height: 200px;
    }
    
    /* Responsive behavior */
    @media (max-width: 768px) {
      .image-placeholder-medium {
        width: 150px;
        height: 113px;
        min-height: 113px;
      }
      
      .image-placeholder-large {
        width: 200px;
        height: 150px;
        min-height: 150px;
      }
    }
  `;
}

/**
 * Replace broken images with styled placeholders in HTML content
 */
export function replaceImagesWithPlaceholders(htmlContent: string): string {
  // Replace img tags with broken/missing src attributes
  return htmlContent
    // Replace empty or missing src attributes
    .replace(/<img([^>]*?)src=["']?["']?([^>]*?)>/gi, (match, beforeSrc, afterSrc) => {
      const altMatch = match.match(/alt=["']([^"']*?)["']/i);
      const altText = altMatch ? altMatch[1] : 'Image';
      const placeholderText = altText || 'Image';
      
      // Extract width and height if available
      const widthMatch = match.match(/width=["']?(\d+)["']?/i);
      const heightMatch = match.match(/height=["']?(\d+)["']?/i);
      const classMatch = match.match(/class=["']([^"']*?)["']/i);
      
      let placeholderClass = 'image-placeholder image-placeholder-medium';
      let style = '';
      
      if (widthMatch && heightMatch) {
        const width = parseInt(widthMatch[1]);
        const height = parseInt(heightMatch[1]);
        style = `width: ${width}px; height: ${height}px; min-height: ${height}px;`;
        
        // Choose appropriate size class
        if (width <= 100) placeholderClass = 'image-placeholder image-placeholder-small';
        else if (width <= 200) placeholderClass = 'image-placeholder image-placeholder-medium';
        else placeholderClass = 'image-placeholder image-placeholder-large';
      } else if (classMatch) {
        const existingClasses = classMatch[1];
        if (existingClasses.includes('avatar')) placeholderClass = 'image-placeholder image-placeholder-avatar';
        else if (existingClasses.includes('banner')) placeholderClass = 'image-placeholder image-placeholder-banner';
        else if (existingClasses.includes('card')) placeholderClass = 'image-placeholder image-placeholder-card';
      }
      
      return `<div class="${placeholderClass}" ${style ? `style="${style}"` : ''}>
        <div class="image-placeholder-content">
          <svg class="image-placeholder-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
          <span class="image-placeholder-text">${placeholderText}</span>
        </div>
      </div>`;
    })
    // Replace images with placeholder.com or other generic placeholder services
    .replace(/<img([^>]*?)src=["']https?:\/\/(?:via\.placeholder\.com|placeholder\.com|picsum\.photos|lorempixel\.com)[^"']*?["']([^>]*?)>/gi, (match) => {
      const altMatch = match.match(/alt=["']([^"']*?)["']/i);
      const altText = altMatch ? altMatch[1] : 'Image';
      const placeholderText = altText || 'Image';
      
      const widthMatch = match.match(/width=["']?(\d+)["']?/i);
      const heightMatch = match.match(/height=["']?(\d+)["']?/i);
      
      let placeholderClass = 'image-placeholder image-placeholder-medium';
      let style = '';
      
      if (widthMatch && heightMatch) {
        const width = parseInt(widthMatch[1]);
        const height = parseInt(heightMatch[1]);
        style = `width: ${width}px; height: ${height}px; min-height: ${height}px;`;
        
        if (width <= 100) placeholderClass = 'image-placeholder image-placeholder-small';
        else if (width <= 200) placeholderClass = 'image-placeholder image-placeholder-medium';
        else placeholderClass = 'image-placeholder image-placeholder-large';
      }
      
      return `<div class="${placeholderClass}" ${style ? `style="${style}"` : ''}>
        <div class="image-placeholder-content">
          <svg class="image-placeholder-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
          <span class="image-placeholder-text">${placeholderText}</span>
        </div>
      </div>`;
    });
}

/**
 * Generate a styled image placeholder HTML element
 */
export function createImagePlaceholder(options: {
  text?: string;
  width?: number;
  height?: number;
  className?: string;
  type?: 'small' | 'medium' | 'large' | 'card' | 'avatar' | 'banner';
}): string {
  const { text = 'Image', width, height, className = '', type = 'medium' } = options;
  
  let placeholderClass = `image-placeholder image-placeholder-${type}`;
  if (className) placeholderClass += ` ${className}`;
  
  let style = '';
  if (width && height) {
    style = `width: ${width}px; height: ${height}px; min-height: ${height}px;`;
  }
  
  return `<div class="${placeholderClass}" ${style ? `style="${style}"` : ''}>
    <div class="image-placeholder-content">
      <svg class="image-placeholder-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
      </svg>
      <span class="image-placeholder-text">${text}</span>
    </div>
  </div>`;
}
