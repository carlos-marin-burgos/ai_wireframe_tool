/**
 * Wireframe Processing Utilities
 * Processes and enhances wireframe HTML content
 */

import { fixWireframeImages } from "./imagePlaceholders";

/**
 * Fixes Microsoft logo references in wireframe HTML
 */
export function fixMicrosoftLogoReferences(html: string): string {
  // Replace broken via.placeholder.com URLs for Microsoft logos
  let processedHtml = html.replace(
    /https:\/\/via\.placeholder\.com\/\d+x\d+\/[^"']*text=Microsoft[^"']*/gi,
    "/windowsLogo.png"
  );

  // Replace other Microsoft logo placeholders
  processedHtml = processedHtml.replace(
    /src=["'][^"']*microsoft[^"']*logo[^"']*["']/gi,
    'src="/windowsLogo.png"'
  );

  // Replace docs-header-brand placeholders
  processedHtml = processedHtml.replace(
    /<div[^>]*class=["'][^"']*docs-header-brand[^"']*["'][^>]*>[\s\S]*?<\/div>/gi,
    (match) => {
      if (match.includes("windowsLogo.png")) {
        return match; // Already has the correct logo
      }
      return match.replace(
        /<img[^>]*>/gi,
        '<img src="/windowsLogo.png" alt="Microsoft Logo" width="24" height="24">'
      );
    }
  );

  return processedHtml;
}

/**
 * Enhances wireframe HTML with better image handling and Microsoft branding
 */
export function enhanceWireframeContent(html: string): string {
  // Step 1: Fix Microsoft logo references
  let processedHtml = fixMicrosoftLogoReferences(html);

  // Step 2: Fix all image placeholders
  processedHtml = fixWireframeImages(processedHtml);

  // Step 3: Add Microsoft Learn branding enhancements
  processedHtml = addMicrosoftLearnEnhancements(processedHtml);

  return processedHtml;
}

/**
 * Adds Microsoft Learn specific enhancements to wireframes
 */
function addMicrosoftLearnEnhancements(html: string): string {
  // Add Microsoft Learn styling variables if not present
  if (!html.includes("--ms-color-primary")) {
    const styleBlock = `
      <style>
        :root {
          --ms-color-primary: #8E9AAF;
          --ms-color-primary-hover: #68769C;
          --ms-color-white: #ffffff;
          --ms-color-gray-50: #f8f9fa;
          --ms-color-gray-900: #1a1a1a;
          --ms-font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        /* Microsoft Learn Logo Styling */
        .docs-header-brand img {
          transition: opacity 0.2s ease;
        }
        
        .docs-header-brand img:hover {
          opacity: 0.8;
        }
        
        /* Enhanced Microsoft Learn Components */
        .ms-learn-button {
          background: var(--ms-color-primary);
          color: var(--ms-color-white);
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          font-family: var(--ms-font-family);
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .ms-learn-button:hover {
          background: var(--ms-color-primary-hover);
        }
      </style>
    `;

    // Insert the style block before the closing head tag or at the beginning if no head
    if (html.includes("</head>")) {
      html = html.replace("</head>", `${styleBlock}</head>`);
    } else if (html.includes("<head>")) {
      html = html.replace("<head>", `<head>${styleBlock}`);
    } else {
      html = `${styleBlock}${html}`;
    }
  }

  return html;
}

/**
 * Validates and fixes common wireframe issues
 */
export function validateWireframeHTML(html: string): {
  isValid: boolean;
  issues: string[];
  fixedHtml: string;
} {
  const issues: string[] = [];
  let fixedHtml = html;

  // Check for broken image URLs
  const brokenImageRegex = /https:\/\/via\.placeholder\.com[^"']*/g;
  const brokenImages = html.match(brokenImageRegex);
  if (brokenImages) {
    issues.push(
      `Found ${brokenImages.length} potentially broken placeholder images`
    );
    fixedHtml = enhanceWireframeContent(fixedHtml);
  }

  // Check for missing alt attributes
  const imgTags = html.match(/<img[^>]*>/g) || [];
  const imagesWithoutAlt = imgTags.filter((tag) => !tag.includes("alt="));
  if (imagesWithoutAlt.length > 0) {
    issues.push(
      `Found ${imagesWithoutAlt.length} images without alt attributes`
    );
  }

  // Check for Microsoft Learn specific components
  const hasDocsBrand = html.includes("docs-header-brand");
  const hasMicrosoftLogo =
    html.includes("Microsoft Logo") || html.includes("windowsLogo.png");

  if (hasDocsBrand && !hasMicrosoftLogo) {
    issues.push(
      "Microsoft Learn header found but missing proper Microsoft logo"
    );
    fixedHtml = enhanceWireframeContent(fixedHtml);
  }

  return {
    isValid: issues.length === 0,
    issues,
    fixedHtml,
  };
}

/**
 * Process wireframe HTML for production use
 */
export function processWireframeForProduction(html: string): string {
  const validation = validateWireframeHTML(html);

  if (!validation.isValid) {
    console.log("Wireframe validation issues:", validation.issues);
  }

  return validation.fixedHtml;
}
