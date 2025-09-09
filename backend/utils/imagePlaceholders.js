/**
 * Image Placeholder Utilities for Backend
 * Handles broken images in AI-generated wireframes by replacing them with placeholders
 */

// Microsoft Learn themed placeholders using inline SVG data URLs
const MS_LEARN_PLACEHOLDERS = {
  primary: (width, height, text = "Image") =>
    createSVGPlaceholder(width, height, text, "#0078d4", "#ffffff"),
  secondary: (width, height, text = "Image") =>
    createSVGPlaceholder(width, height, text, "#106ebe", "#ffffff"),
  neutral: (width, height, text = "Image") =>
    createSVGPlaceholder(width, height, text, "#f3f2f1", "#323130"),
  avatar: (size) =>
    createSVGPlaceholder(size, size, "👤", "#ca5010", "#ffffff"),
  icon: (size, text = "🔲") =>
    createSVGPlaceholder(size, size, text, "#605e5c", "#ffffff"),
};

/**
 * Creates an inline SVG placeholder as a data URL
 */
function createSVGPlaceholder(width, height, text, bgColor, textColor) {
  const fontSize = Math.min(width, height) * 0.1;
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    <text x="50%" y="50%" text-anchor="middle" dy=".3em" 
          font-family="Segoe UI, sans-serif" font-size="${fontSize}" fill="${textColor}">
      ${text.substring(0, 15)}
    </text>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// Common image dimensions for different use cases
const IMAGE_DIMENSIONS = {
  avatar: { width: 64, height: 64 },
  icon: { width: 24, height: 24 },
  thumbnail: { width: 150, height: 150 },
  card: { width: 300, height: 200 },
  hero: { width: 800, height: 400 },
  banner: { width: 1200, height: 300 },
  product: { width: 250, height: 250 },
  gallery: { width: 400, height: 300 },
  logo: { width: 120, height: 40 },
};

/**
 * Determines appropriate dimensions based on image context
 */
function getImageDimensions(src = "", alt = "", className = "") {
  const contextLower = `${src} ${alt} ${className}`.toLowerCase();

  if (contextLower.includes("avatar") || contextLower.includes("profile")) {
    return IMAGE_DIMENSIONS.avatar;
  } else if (contextLower.includes("icon") || contextLower.includes("logo")) {
    return IMAGE_DIMENSIONS.icon;
  } else if (contextLower.includes("hero") || contextLower.includes("banner")) {
    return IMAGE_DIMENSIONS.hero;
  } else if (
    contextLower.includes("card") ||
    contextLower.includes("product")
  ) {
    return IMAGE_DIMENSIONS.card;
  } else if (
    contextLower.includes("thumbnail") ||
    contextLower.includes("thumb")
  ) {
    return IMAGE_DIMENSIONS.thumbnail;
  } else if (contextLower.includes("gallery")) {
    return IMAGE_DIMENSIONS.gallery;
  } else {
    // Default dimensions
    return IMAGE_DIMENSIONS.card;
  }
}

/**
 * Generates a placeholder image URL based on context
 */
function generatePlaceholderUrl(
  src = "",
  alt = "",
  className = "",
  theme = "neutral"
) {
  const dimensions = getImageDimensions(src, alt, className);
  const text = alt || extractTextFromSrc(src) || "Image";

  switch (theme) {
    case "primary":
      return MS_LEARN_PLACEHOLDERS.primary(
        dimensions.width,
        dimensions.height,
        text
      );
    case "secondary":
      return MS_LEARN_PLACEHOLDERS.secondary(
        dimensions.width,
        dimensions.height,
        text
      );
    default:
      return MS_LEARN_PLACEHOLDERS.neutral(
        dimensions.width,
        dimensions.height,
        text
      );
  }
}

/**
 * Extracts meaningful text from image source filename
 */
function extractTextFromSrc(src) {
  if (!src) return "";

  try {
    // Extract filename without extension
    const filename = src.split("/").pop() || "";
    const nameWithoutExt = filename.split(".")[0] || "";

    // Convert to readable text
    return nameWithoutExt
      .replace(/[-_]/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .substring(0, 20);
  } catch {
    return "";
  }
}

/**
 * Processes HTML content and replaces broken image references with placeholders
 */
function processImagePlaceholders(html) {
  // Regular expression to match img tags
  const imgRegex = /<img([^>]*?)src=["']([^"']*?)["']([^>]*?)>/gi;

  return html.replace(imgRegex, (match, beforeSrc, src, afterSrc) => {
    // Skip if it's already a placeholder URL (data: or known placeholder services)
    if (
      src.includes("placeholder.com") ||
      src.includes("picsum.photos") ||
      src.includes("dummyimage.com") ||
      src.startsWith("data:")
    ) {
      return match;
    }

    // Skip if it's a proper absolute URL with HTTPS
    if (src.startsWith("https://") && !src.includes("localhost")) {
      return match;
    }

    // Extract alt text and class from the img tag
    const altMatch = match.match(/alt=["']([^"']*?)["']/i);
    const classMatch = match.match(/class=["']([^"']*?)["']/i);

    const alt = altMatch ? altMatch[1] : "";
    const className = classMatch ? classMatch[1] : "";

    // Generate placeholder URL using inline SVG
    const placeholderUrl = generatePlaceholderUrl(
      src,
      alt,
      className,
      "primary"
    );

    // Replace src with placeholder
    return `<img${beforeSrc}src="${placeholderUrl}"${afterSrc}>`;
  });
}

/**
 * Adds error handling to images via onerror attribute
 */
function addImageErrorHandling(html) {
  const imgRegex = /<img([^>]*?)src=["']([^"']*?)["']([^>]*?)>/gi;

  return html.replace(imgRegex, (match) => {
    // Skip if already has onerror handler
    if (match.includes("onerror=")) {
      return match;
    }

    // Extract src and alt for fallback
    const srcMatch = match.match(/src=["']([^"']*?)["']/i);
    const altMatch = match.match(/alt=["']([^"']*?)["']/i);
    const classMatch = match.match(/class=["']([^"']*?)["']/i);

    const src = srcMatch ? srcMatch[1] : "";
    const alt = altMatch ? altMatch[1] : "";
    const className = classMatch ? classMatch[1] : "";

    // Generate fallback placeholder using inline SVG
    const fallbackUrl = generatePlaceholderUrl(src, alt, className, "neutral");

    // Add onerror handler before the closing >
    const withErrorHandler = match.replace(
      />$/,
      ` onerror="this.src='${fallbackUrl}'; this.onerror=null;">`
    );

    return withErrorHandler;
  });
}

/**
 * Main function to process wireframe HTML and fix image issues
 */
function fixWireframeImages(html) {
  // First pass: replace obvious broken image references with placeholders
  let processedHtml = processImagePlaceholders(html);

  // Second pass: add error handling for remaining images
  processedHtml = addImageErrorHandling(processedHtml);

  return processedHtml;
}

module.exports = {
  fixWireframeImages,
  processImagePlaceholders,
  addImageErrorHandling,
  generatePlaceholderUrl,
  MS_LEARN_PLACEHOLDERS,
  IMAGE_DIMENSIONS,
};
