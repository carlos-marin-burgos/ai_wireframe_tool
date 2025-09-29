/**
 * Image Placeholder Utilities
 * Handles broken images in AI-generated wireframes by replacing them with placeholders
 */

// Placeholder image service configurations
const PLACEHOLDER_SERVICES = {
  picsum: (width: number, height: number) =>
    `https://picsum.photos/${width}/${height}`,
  placeholder: (width: number, height: number, text?: string) =>
    `https://placehold.co/${width}x${height}/f3f2f1/323130?text=${encodeURIComponent(
      text || "Image"
    )}`,
  dummyimage: (width: number, height: number, text?: string) =>
    `https://dummyimage.com/${width}x${height}/f3f2f1/323130&text=${encodeURIComponent(
      text || "Image"
    )}`,
};

// Microsoft Learn themed placeholders
const MS_LEARN_PLACEHOLDERS = {
  primary: (width: number, height: number, text?: string) =>
    `https://placehold.co/${width}x${height}/0078d4/ffffff?text=${encodeURIComponent(
      text || "Image"
    )}`,
  secondary: (width: number, height: number, text?: string) =>
    `https://placehold.co/${width}x${height}/106ebe/ffffff?text=${encodeURIComponent(
      text || "Image"
    )}`,
  neutral: (width: number, height: number, text?: string) =>
    `https://placehold.co/${width}x${height}/f3f2f1/323130?text=${encodeURIComponent(
      text || "Image"
    )}`,
  avatar: (size: number) =>
    `https://placehold.co/${size}x${size}/ca5010/ffffff?text=👤`,
  icon: (size: number, text?: string) =>
    `https://placehold.co/${size}x${size}/605e5c/ffffff?text=${encodeURIComponent(
      text || "🔲"
    )}`,
  microsoftLogo: (size: number = 24) => `/windowsLogo.png`,
  mslearnLogo: (size: number = 120) => `/mslearn-logo.png`,
};

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
function getImageDimensions(
  src: string,
  alt: string = "",
  className: string = ""
): { width: number; height: number } {
  const lowerSrc = src.toLowerCase();
  const lowerAlt = alt.toLowerCase();
  const lowerClass = className.toLowerCase();

  // Check for specific patterns in src, alt, or class
  if (
    lowerSrc.includes("avatar") ||
    lowerAlt.includes("avatar") ||
    lowerClass.includes("avatar")
  ) {
    return IMAGE_DIMENSIONS.avatar;
  }

  if (
    lowerSrc.includes("icon") ||
    lowerAlt.includes("icon") ||
    lowerClass.includes("icon")
  ) {
    return IMAGE_DIMENSIONS.icon;
  }

  if (
    lowerSrc.includes("logo") ||
    lowerAlt.includes("logo") ||
    lowerClass.includes("logo")
  ) {
    return IMAGE_DIMENSIONS.logo;
  }

  if (
    lowerSrc.includes("hero") ||
    lowerAlt.includes("hero") ||
    lowerClass.includes("hero")
  ) {
    return IMAGE_DIMENSIONS.hero;
  }

  if (
    lowerSrc.includes("banner") ||
    lowerAlt.includes("banner") ||
    lowerClass.includes("banner")
  ) {
    return IMAGE_DIMENSIONS.banner;
  }

  if (
    lowerSrc.includes("product") ||
    lowerAlt.includes("product") ||
    lowerClass.includes("product")
  ) {
    return IMAGE_DIMENSIONS.product;
  }

  if (
    lowerSrc.includes("gallery") ||
    lowerAlt.includes("gallery") ||
    lowerClass.includes("gallery")
  ) {
    return IMAGE_DIMENSIONS.gallery;
  }

  if (
    lowerSrc.includes("thumb") ||
    lowerAlt.includes("thumb") ||
    lowerClass.includes("thumb")
  ) {
    return IMAGE_DIMENSIONS.thumbnail;
  }

  // Default to card dimensions
  return IMAGE_DIMENSIONS.card;
}

/**
 * Generates a placeholder image URL based on context
 */
export function generatePlaceholderUrl(
  src: string,
  alt: string = "",
  className: string = "",
  theme: "primary" | "secondary" | "neutral" = "neutral"
): string {
  // Check for specific image types first
  if (
    alt.toLowerCase().includes("microsoft logo") ||
    alt.toLowerCase().includes("windows logo") ||
    src.toLowerCase().includes("microsoft") ||
    src.toLowerCase().includes("windows") ||
    src.toLowerCase().includes("logo.png") ||
    (src.toLowerCase().includes("logo") &&
      alt.toLowerCase().includes("microsoft"))
  ) {
    return MS_LEARN_PLACEHOLDERS.microsoftLogo();
  }

  if (
    alt.toLowerCase().includes("ms learn") ||
    alt.toLowerCase().includes("microsoft learn") ||
    src.toLowerCase().includes("mslearn")
  ) {
    return MS_LEARN_PLACEHOLDERS.mslearnLogo();
  }

  const dimensions = getImageDimensions(src, alt, className);
  const placeholderText = alt || extractTextFromSrc(src) || "Image";

  return MS_LEARN_PLACEHOLDERS[theme](
    dimensions.width,
    dimensions.height,
    placeholderText
  );
}

/**
 * Extracts meaningful text from image source filename
 */
function extractTextFromSrc(src: string): string {
  const filename = src.split("/").pop()?.split(".")[0] || "";
  return (
    filename
      .replace(/[-_]/g, " ")
      .replace(/\d+/g, "")
      .trim()
      .substring(0, 20) || "Image"
  );
}

/**
 * Processes HTML content and replaces broken image references with placeholders
 */
export function processImagePlaceholders(html: string): string {
  // Regular expression to match img tags
  const imgRegex = /<img([^>]*?)src=["']([^"']*?)["']([^>]*?)>/gi;

  return html.replace(imgRegex, (match, beforeSrc, src, afterSrc) => {
    // Skip if it's already a good placeholder URL or local asset
    if (
      src.includes("placehold.co") ||
      src.includes("picsum.photos") ||
      src.includes("dummyimage.com") ||
      src.startsWith("/windowsLogo.png") ||
      src.startsWith("/mslearn-logo.png") ||
      src.startsWith("/cxsLogo.png")
    ) {
      return match;
    }

    // Fix broken via.placeholder.com URLs by replacing with placehold.co
    if (src.includes("via.placeholder.com")) {
      const fixedSrc = src.replace("via.placeholder.com", "placehold.co");
      return `<img${beforeSrc}src="${fixedSrc}"${afterSrc}>`;
    }

    // Skip if it's a data URL or working absolute URL
    if (
      src.startsWith("data:") ||
      ((src.startsWith("http://") || src.startsWith("https://")) &&
        !src.includes("via.placeholder.com"))
    ) {
      return match;
    }

    // Extract alt text and class from the img tag
    const altMatch = match.match(/alt=["']([^"']*?)["']/i);
    const classMatch = match.match(/class=["']([^"']*?)["']/i);

    const alt = altMatch ? altMatch[1] : "";
    const className = classMatch ? classMatch[1] : "";

    // Generate placeholder URL
    const placeholderUrl = generatePlaceholderUrl(src, alt, className);

    // Replace the src with placeholder
    return `<img${beforeSrc}src="${placeholderUrl}"${afterSrc}>`;
  });
}

/**
 * Adds error handling to images via onerror attribute
 */
export function addImageErrorHandling(html: string): string {
  const imgRegex = /<img([^>]*?)>/gi;

  return html.replace(imgRegex, (match, attributes) => {
    // Skip if already has onerror
    if (attributes.includes("onerror")) {
      return match;
    }

    // Extract dimensions if available
    const widthMatch = attributes.match(/width=["']?(\d+)["']?/i);
    const heightMatch = attributes.match(/height=["']?(\d+)["']?/i);
    const altMatch = attributes.match(/alt=["']([^"']*?)["']/i);

    const width = widthMatch ? widthMatch[1] : "300";
    const height = heightMatch ? heightMatch[1] : "200";
    const alt = altMatch ? altMatch[1] : "Image";

    // Use more reliable fallback URL
    const fallbackUrl = `https://placehold.co/${width}x${height}/f3f2f1/323130?text=${encodeURIComponent(
      alt
    )}`;

    const onerrorHandler = `onerror="this.src='${fallbackUrl}'; this.onerror=null;"`;

    return `<img${attributes} ${onerrorHandler}>`;
  });
}

/**
 * Main function to process wireframe HTML and fix image issues
 */
export function fixWireframeImages(html: string): string {
  // First pass: replace obvious broken image references with placeholders
  let processedHtml = processImagePlaceholders(html);

  // Second pass: add error handling for remaining images
  processedHtml = addImageErrorHandling(processedHtml);

  return processedHtml;
}

// Export default placeholders for direct use
export { MS_LEARN_PLACEHOLDERS, IMAGE_DIMENSIONS };

// Export specific placeholder generators
export const createMicrosoftLogo = () => MS_LEARN_PLACEHOLDERS.microsoftLogo();
export const createMSLearnLogo = () => MS_LEARN_PLACEHOLDERS.mslearnLogo();
export const createPrimaryPlaceholder = (
  width: number,
  height: number,
  text?: string
) => MS_LEARN_PLACEHOLDERS.primary(width, height, text);
export const createNeutralPlaceholder = (
  width: number,
  height: number,
  text?: string
) => MS_LEARN_PLACEHOLDERS.neutral(width, height, text);
