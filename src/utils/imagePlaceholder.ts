/**
 * Image Placeholder Utilities
 * Generates placeholder images for wireframes and components
 */

export interface PlaceholderOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  textColor?: string;
  text?: string;
  format?: "png" | "jpg" | "svg";
  style?: "modern" | "classic" | "minimal";
}

export interface PlaceholderResult {
  url: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * Generate a placeholder image URL using various services
 */
export function generatePlaceholderImage(
  options: PlaceholderOptions = {}
): PlaceholderResult {
  const {
    width = 300,
    height = 200,
    backgroundColor = "#0078d4",
    textColor = "#ffffff",
    text = "Image",
    format = "png",
    style = "modern",
  } = options;

  // Remove # from hex colors for URL
  const bgColor = backgroundColor.replace("#", "");
  const txtColor = textColor.replace("#", "");

  let url: string;

  switch (style) {
    case "modern":
      // Using picsum for realistic placeholder images
      url = `https://picsum.photos/${width}/${height}?blur=1&grayscale=1`;
      break;

    case "minimal":
      // Using placeholder.com for clean, minimal placeholders
      url = `https://via.placeholder.com/${width}x${height}/${bgColor}/${txtColor}?text=${encodeURIComponent(
        text
      )}`;
      break;

    case "classic":
    default:
      // Using placehold.co for better customization
      url = `https://placehold.co/${width}x${height}/${bgColor}/${txtColor}/${format}?text=${encodeURIComponent(
        text
      )}`;
      break;
  }

  return {
    url,
    width,
    height,
    alt: `Placeholder image: ${text} (${width}x${height})`,
  };
}

/**
 * Generate SVG placeholder for better control and performance
 */
export function generateSVGPlaceholder(
  options: PlaceholderOptions = {}
): string {
  const {
    width = 300,
    height = 200,
    backgroundColor = "#f3f4f6",
    textColor = "#6b7280",
    text = "Image",
  } = options;

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}" stroke="#e5e7eb" stroke-width="1"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="system-ui, -apple-system, sans-serif" 
            font-size="14" fill="${textColor}">
        ${text}
      </text>
      <circle cx="50%" cy="35%" r="12" fill="${textColor}" opacity="0.3"/>
      <rect x="40%" y="40%" width="20%" height="3" fill="${textColor}" opacity="0.2" rx="1"/>
      <rect x="35%" y="45%" width="30%" height="2" fill="${textColor}" opacity="0.2" rx="1"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Generate placeholder for specific wireframe contexts
 */
export function generateWireframePlaceholder(
  type: "hero" | "card" | "avatar" | "icon" | "banner" | "thumbnail",
  customOptions: Partial<PlaceholderOptions> = {}
): PlaceholderResult {
  const presets: Record<string, PlaceholderOptions> = {
    hero: {
      width: 800,
      height: 400,
      backgroundColor: "#f8fafc",
      textColor: "#64748b",
      text: "Hero Image",
      style: "modern",
    },
    card: {
      width: 300,
      height: 200,
      backgroundColor: "#f1f5f9",
      textColor: "#475569",
      text: "Card Image",
      style: "minimal",
    },
    avatar: {
      width: 64,
      height: 64,
      backgroundColor: "#e2e8f0",
      textColor: "#475569",
      text: "👤",
      style: "minimal",
    },
    icon: {
      width: 24,
      height: 24,
      backgroundColor: "#e2e8f0",
      textColor: "#64748b",
      text: "⭐",
      style: "minimal",
    },
    banner: {
      width: 1200,
      height: 300,
      backgroundColor: "#f8fafc",
      textColor: "#64748b",
      text: "Banner Image",
      style: "modern",
    },
    thumbnail: {
      width: 150,
      height: 150,
      backgroundColor: "#f1f5f9",
      textColor: "#475569",
      text: "Thumb",
      style: "minimal",
    },
  };

  const options = { ...presets[type], ...customOptions };
  return generatePlaceholderImage(options);
}

/**
 * Generate multiple placeholder variations for A/B testing
 */
export function generatePlaceholderVariations(
  baseOptions: PlaceholderOptions,
  variations: number = 3
): PlaceholderResult[] {
  const colors = ["#0078d4", "#107c10", "#d83b01", "#5c2d91", "#ca5010"];
  const texts = ["Image A", "Image B", "Image C", "Option 1", "Option 2"];

  return Array.from({ length: variations }, (_, index) => {
    return generatePlaceholderImage({
      ...baseOptions,
      backgroundColor: colors[index % colors.length],
      text: texts[index % texts.length],
    });
  });
}

/**
 * Convert placeholder to data URL for embedding
 */
export async function placeholderToDataURL(
  placeholderUrl: string
): Promise<string> {
  try {
    const response = await fetch(placeholderUrl);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to convert placeholder to data URL:", error);
    // Fallback to SVG placeholder
    return generateSVGPlaceholder({ width: 300, height: 200, text: "Image" });
  }
}

/**
 * Utility to replace placeholder URLs in HTML content
 */
export function replacePlaceholdersInHTML(
  html: string,
  options: PlaceholderOptions = {}
): string {
  // Replace common placeholder patterns
  const patterns = [
    /https?:\/\/via\.placeholder\.com\/[^"\s]*/g,
    /https?:\/\/placehold\.co\/[^"\s]*/g,
    /https?:\/\/picsum\.photos\/[^"\s]*/g,
    /src=["'][^"']*placeholder[^"']*["']/g,
  ];

  let updatedHTML = html;

  patterns.forEach((pattern) => {
    updatedHTML = updatedHTML.replace(pattern, (match) => {
      // Extract dimensions if possible
      const dimensionMatch = match.match(/(\d+)x?(\d+)?/);
      const width = dimensionMatch
        ? parseInt(dimensionMatch[1])
        : options.width || 300;
      const height = dimensionMatch
        ? parseInt(dimensionMatch[2] || dimensionMatch[1])
        : options.height || 200;

      const placeholder = generatePlaceholderImage({
        ...options,
        width,
        height,
      });

      return match.includes("src=")
        ? `src="${placeholder.url}"`
        : placeholder.url;
    });
  });

  return updatedHTML;
}

/**
 * Replace broken/missing image sources with proper placeholders
 * Handles cases like: image1.jpg, article-image.png, hero-bg.jpg, etc.
 */
export function replaceBrokenImageSources(
  html: string,
  options: PlaceholderOptions = {}
): string {
  // Pattern to match image sources that are likely broken/missing
  const brokenImagePatterns = [
    // Match simple filenames like image1.jpg, photo.png, etc.
    /src=["']([^"']*\.(jpg|jpeg|png|gif|webp|svg))["']/gi,
    // Match relative paths like ./images/photo.jpg, images/hero.png
    /src=["']([.\/]*[^"']*\/[^"']*\.(jpg|jpeg|png|gif|webp|svg))["']/gi,
    // Match descriptive names like hero-image.jpg, article-photo.png
    /src=["']([^"']*(?:image|photo|pic|hero|banner|card|thumb)[^"']*\.(jpg|jpeg|png|gif|webp|svg))["']/gi,
  ];

  let updatedHTML = html;

  brokenImagePatterns.forEach((pattern) => {
    updatedHTML = updatedHTML.replace(pattern, (match, imageSrc, extension) => {
      // Extract alt text and class for context
      const imgTagMatch = updatedHTML.match(
        new RegExp(
          `<img[^>]*src=["']${imageSrc.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )}["'][^>]*>`,
          "i"
        )
      );

      if (!imgTagMatch) return match;

      const imgTag = imgTagMatch[0];
      const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
      const classMatch = imgTag.match(/class=["']([^"']*)["']/i);

      // Determine placeholder text from alt or filename
      let placeholderText = "Image";
      if (altMatch && altMatch[1]) {
        placeholderText = altMatch[1];
      } else {
        // Extract meaningful text from filename
        const filename = imageSrc.split("/").pop()?.split(".")[0] || "";
        if (filename) {
          placeholderText =
            filename
              .replace(/[-_]/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())
              .replace(/\d+/g, "")
              .trim() || "Image";
        }
      }

      // Determine placeholder type and dimensions from context
      let placeholderType:
        | "hero"
        | "card"
        | "avatar"
        | "icon"
        | "banner"
        | "thumbnail" = "card";
      let customOptions: Partial<PlaceholderOptions> = {};

      if (classMatch) {
        const classes = classMatch[1].toLowerCase();
        if (classes.includes("hero")) {
          placeholderType = "hero";
        } else if (classes.includes("avatar") || classes.includes("profile")) {
          placeholderType = "avatar";
        } else if (classes.includes("icon")) {
          placeholderType = "icon";
        } else if (classes.includes("banner")) {
          placeholderType = "banner";
        } else if (classes.includes("thumb")) {
          placeholderType = "thumbnail";
        } else if (classes.includes("card")) {
          placeholderType = "card";
        }
      }

      // Check for width/height attributes or styles
      const widthMatch = imgTag.match(
        /(?:width=["'](\d+)["']|width:\s*(\d+)px)/i
      );
      const heightMatch = imgTag.match(
        /(?:height=["'](\d+)["']|height:\s*(\d+)px)/i
      );

      if (widthMatch) {
        customOptions.width = parseInt(widthMatch[1] || widthMatch[2]);
      }
      if (heightMatch) {
        customOptions.height = parseInt(heightMatch[1] || heightMatch[2]);
      }

      // Generate appropriate placeholder
      const placeholder = generateWireframePlaceholder(placeholderType, {
        ...options,
        ...customOptions,
        text: placeholderText,
      });

      return `src="${placeholder.url}"`;
    });
  });

  return updatedHTML;
}

/**
 * Process HTML content to replace all types of placeholder and broken images
 * This is the main function to call for wireframe processing
 */
export function processWireframeImages(
  html: string,
  options: PlaceholderOptions = {}
): string {
  // First replace existing placeholder services
  let processedHTML = replacePlaceholdersInHTML(html, options);

  // Then replace broken/missing image sources
  processedHTML = replaceBrokenImageSources(processedHTML, options);

  return processedHTML;
}

// Export commonly used presets
export const PLACEHOLDER_PRESETS = {
  HERO: { width: 800, height: 400, style: "modern" as const },
  CARD: { width: 300, height: 200, style: "minimal" as const },
  AVATAR: { width: 64, height: 64, style: "minimal" as const },
  ICON: { width: 24, height: 24, style: "minimal" as const },
  BANNER: { width: 1200, height: 300, style: "modern" as const },
  THUMBNAIL: { width: 150, height: 150, style: "minimal" as const },
} as const;
