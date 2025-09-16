/**
 * Image Handler for Wireframe Generation
 * Provides placeholder images and proper image handling
 */

class ImageHandler {
  constructor() {
    // Available local images in public directory
    this.localImages = {
      course: "/course.png",
      module: "/module.png",
      path: "/path.png",
      azure: "/azure.png",
      copilot: "/copilot.png",
      hero: "/Hero300.png",
      mslearn: "/mslearn-logo.png",
      windows: "/windowsLogo.png",
      cxs: "/cxsLogo.png",
      designetica: "/designetica.png",
      certification: "/microsoft-certified-fundamentals-badge 2.png",
    };

    // Placeholder image services
    this.placeholderServices = {
      unsplash: (width = 300, height = 200, category = "tech") =>
        `https://source.unsplash.com/${width}x${height}/?${category}`,
      placeholder: (width = 300, height = 200, text = "") =>
        `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(
          text
        )}`,
      picsum: (width = 300, height = 200, id = "") =>
        `https://picsum.photos/${width}/${height}${id ? `?random=${id}` : ""}`,
    };
  }

  /**
   * Get appropriate image source based on context
   */
  getImageSrc(type, context = {}) {
    const { width = 300, height = 200, category = "tech" } = context;

    // Check for local images first
    if (this.localImages[type]) {
      return this.localImages[type];
    }

    // Generate appropriate placeholder based on type
    switch (type) {
      case "course":
      case "learning":
      case "education":
        return this.placeholderServices.placeholder(width, height, "Course");

      case "user":
      case "profile":
      case "avatar":
        return this.placeholderServices.placeholder(width, height, "User");

      case "dashboard":
      case "analytics":
        return this.placeholderServices.placeholder(width, height, "Dashboard");

      case "hero":
      case "banner":
        return this.placeholderServices.unsplash(width, height, "technology");

      case "icon":
        return this.generateSVGIcon(context.iconType || "default");

      default:
        return this.placeholderServices.placeholder(
          width,
          height,
          type || "Image"
        );
    }
  }

  /**
   * Generate SVG icons for common types
   */
  generateSVGIcon(iconType) {
    const svgTemplates = {
      course: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="4" fill="#194a7a"/>
        <path d="M20 12L26 18H14L20 12Z" fill="white"/>
        <rect x="14" y="18" width="12" height="14" fill="white"/>
      </svg>`,

      module: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="4" fill="#476f95"/>
        <rect x="12" y="12" width="16" height="3" fill="white"/>
        <rect x="12" y="18" width="16" height="3" fill="white"/>
        <rect x="12" y="24" width="12" height="3" fill="white"/>
      </svg>`,

      default: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="4" fill="#7593af"/>
        <circle cx="20" cy="20" r="8" fill="white"/>
      </svg>`,
    };

    const svg = svgTemplates[iconType] || svgTemplates.default;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }

  /**
   * Fix broken image sources in HTML
   */
  fixBrokenImages(html) {
    // Replace common broken image patterns
    html = html.replace(/src="course\d+\.jpg"/g, 'src="/course.png"');
    html = html.replace(/src="module\d+\.jpg"/g, 'src="/module.png"');
    html = html.replace(/src="icon\d+\.(jpg|png)"/g, (match) => {
      return `src="${this.generateSVGIcon("default")}"`;
    });

    // Replace any remaining broken local references with placeholders
    html = html.replace(/src="[^"]*\.(jpg|jpeg|png|gif|svg)"/g, (match) => {
      const src = match.match(/src="([^"]*)"/)[1];

      // If it's already a valid URL or base64, keep it
      if (
        src.startsWith("http") ||
        src.startsWith("data:") ||
        src.startsWith("/")
      ) {
        return match;
      }

      // Replace with placeholder
      return 'src="https://via.placeholder.com/300x200?text=Image"';
    });

    return html;
  }

  /**
   * Get card icon based on type
   */
  getCardIcon(cardType) {
    const iconMap = {
      COURSE: this.localImages.course,
      MODULE: this.localImages.module,
      "LEARNING PATH": this.localImages.path,
      CERTIFICATION: this.localImages.certification,
      ARTICLE: this.generateSVGIcon("default"),
      VIDEO: this.generateSVGIcon("default"),
      TUTORIAL: this.generateSVGIcon("course"),
    };

    return iconMap[cardType.toUpperCase()] || this.generateSVGIcon("default");
  }
}

module.exports = { ImageHandler };
