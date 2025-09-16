/**
 * Atlas Component Library - Backend Component Generator
 * Provides consistent HTML components for wireframe generation
 */

class AtlasComponentLibrary {
  constructor() {
    this.baseStyles = `
      <style>
        .atlas-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        /* Official Microsoft Learn Hero Styles */
        .hero { 
          position: relative; 
          overflow: hidden; 
          padding: 80px 24px;
        }
        .hero-xs { 
          min-height: 300px; 
        }
        .hero-image { 
          min-height: 500px;
          background-image: var(--hero-background-image-light);
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        @media (prefers-color-scheme: dark) {
          .hero-image {
            background-image: var(--hero-background-image-dark);
          }
        }
        .hero-content { 
          position: relative; 
          z-index: 2;
          max-width: 600px;
        }
        .hero-details { 
          position: absolute; 
          right: 24px; 
          top: 50%; 
          transform: translateY(-50%); 
          z-index: 3;
        }
        .hero-details-card { 
          background: white; 
          border-radius: 8px; 
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          padding: 24px;
          max-width: 300px;
        }
        
        /* Microsoft Learn Typography */
        .font-size-sm { font-size: 14px; }
        .font-size-lg { font-size: 20px; }
        .font-size-h1 { font-size: 48px; line-height: 1.2; }
        .font-weight-semibold { font-weight: 600; }
        .font-weight-bold { font-weight: 700; }
        .letter-spacing-wide { letter-spacing: 0.1em; }
        .text-transform-uppercase { text-transform: uppercase; }
        .margin-block-sm { margin-block: 16px; }
        .margin-top-md { margin-top: 32px; }
        .margin-top-sm { margin-top: 12px; }
        
        /* Blue Monochromatic Colors */
        .background-color-primary { 
          background-color: #194a7a; 
          background-image: var(--background-image-pattern);
          background-size: 200px;
          background-repeat: repeat;
        }
        .color-primary-invert { color: white; }
        .background-color-body-accent { background-color: #d1dbe4; }
        .gradient-border-right { border-right: 4px solid #476f95; }
        .gradient-border-body-accent { border-right: 4px solid #a3b7ca; }
        .border { border: 1px solid #a3b7ca; }
        .border-radius-lg { border-radius: 8px; }
        .box-shadow-heavy { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
        .padding-sm { padding: 24px; }
        .flex-direction-row-tablet { 
          display: flex; 
          align-items: center;
          justify-content: space-between;
        }
        
        /* Microsoft Learn Buttons */
        .button { 
          display: inline-block; 
          padding: 12px 32px; 
          text-decoration: none; 
          border-radius: 4px; 
          font-weight: 600; 
          transition: all 0.2s ease; 
          cursor: pointer;
          border: none;
          background: transparent;
        }
        .button-clear { background: transparent; }
        .button.border { border: 2px solid currentColor; }
        .button:hover { 
          transform: translateY(-1px); 
          box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .hero { padding: 40px 16px !important; }
          .hero-content { max-width: 100% !important; }
          .hero-details { 
            position: static !important; 
            transform: none !important; 
            margin-top: 32px; 
            right: auto !important; 
          }
          .font-size-h1 { font-size: 36px !important; }
          .font-size-lg { font-size: 18px !important; }
          .flex-direction-row-tablet {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
        
        /* Base Microsoft Learn Styles */
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; 
          color: #194a7a; 
          line-height: 1.6; 
        }
        p { margin: 0 0 16px 0; }
        h1, h2, h3, h4, h5, h6 { margin: 0 0 16px 0; color: #194a7a; }
        
        /* Blue Monochromatic Atlas Styles */
        .atlas-hero { background: #d1dbe4; padding: 60px 0; text-align: center; }
        .atlas-button { background: #194a7a; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; }
        .atlas-input { width: 100%; padding: 12px; border: 1px solid #a3b7ca; border-radius: 4px; margin-bottom: 16px; }
        .atlas-textarea { width: 100%; padding: 12px; border: 1px solid #a3b7ca; border-radius: 4px; margin-bottom: 16px; resize: vertical; }
        .atlas-footer { background: #194a7a; color: white; padding: 40px 0; text-align: center; }
        .atlas-card { border: 1px solid #a3b7ca; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .atlas-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
      </style>
    `;
  }

  /**
   * Generate HTML component based on type and options
   * @param {string} type - Component type
   * @param {object} options - Component options
   * @returns {string} Generated HTML
   */
  generateComponent(type, options = {}) {
    switch (type) {
      case "site-header":
        return this.generateSiteHeader(options);
      case "atlas-top-nav":
      case "atlas-navigation":
      case "top-navigation":
        return this.generateAtlasTopNavigation(options);

      case "hero-section":
        return this.generateHeroSection(options);

      case "container":
        return this.generateContainer(options);

      case "heading":
        return this.generateHeading(options);

      case "paragraph":
        return this.generateParagraph(options);

      case "input-field":
        return this.generateInputField(options);

      case "textarea-field":
        return this.generateTextareaField(options);

      case "primary-button":
        return this.generatePrimaryButton(options);

      case "footer":
        return this.generateFooter(options);

      case "card":
        return this.generateCard(options);

      case "grid":
        return this.generateGrid(options);

      default:
        return `<!-- Unknown component: ${type} -->`;
    }
  }

  generateSiteHeader(options = {}) {
    // Use Microsoft Learn site header instead of generic blue header
    return `
      <div style="display: flex; align-items: center; padding: 12px 24px; background: white; border-bottom: 1px solid #a3b7ca; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <!-- Microsoft logo -->
        <a href="https://www.microsoft.com" aria-label="Microsoft" style="display: flex; align-items: center; margin-right: 16px; text-decoration: none;">
          <svg aria-hidden="true" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px;">
            <path d="M11.5216 0.5H0V11.9067H11.5216V0.5Z" fill="#f25022" />
            <path d="M24.2418 0.5H12.7202V11.9067H24.2418V0.5Z" fill="#7fba00" />
            <path d="M11.5216 13.0933H0V24.5H11.5216V13.0933Z" fill="#00a4ef" />
            <path d="M24.2418 13.0933H12.7202V24.5H24.2418V13.0933Z" fill="#ffb900" />
          </svg>
        </a>

        <!-- Divider -->
        <div style="width: 1px; height: 24px; background: #a3b7ca; margin-right: 16px;"></div>

        <!-- Brand -->
        <a href="#" class="ms-learn-brand">
          <span>Microsoft Learn</span>
        </a>

        <!-- Navigation -->
        <nav aria-label="site header navigation" class="wireframe-nav">
          <a href="#" class="wireframe-nav-link">Documentation</a>
          <a href="#" class="wireframe-nav-link">Training</a>
          <a href="#" class="wireframe-nav-link">Certifications</a>
        </nav>
      </div>
    `;
  }

  generateAtlasTopNavigation(options = {}) {
    // Specific Atlas Top Navigation from Figma (node-id: 11530:113245)
    return `
      <!-- Atlas Top Navigation - Always Present (Node ID: 11530:113245) -->
      <header class="atlas-top-navigation" data-node-id="11530:113245" style="
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 8px 24px;
        gap: 21px;
        width: 100%;
        height: 54px;
        box-sizing: border-box;
        background: #FFFFFF;
        border-bottom: 1px solid #E0E0E0;
        position: sticky;
        top: 0;
        z-index: 1000;
      ">
        <!-- Logo & Menu Section -->
        <div style="display: flex; flex-direction: row; align-items: center; padding: 0px; gap: 16px; flex-grow: 1;">
          <!-- Logo Container -->
          <div style="display: flex; flex-direction: row; align-items: center; padding: 0px; gap: 13px;">
            <!-- Microsoft Logo -->
            <div style="position: relative; width: 26px; height: 26px;">
              <div style="position: absolute; top: 0; left: 0; width: 12px; height: 12px; background: #F26522;"></div>
              <div style="position: absolute; top: 0; right: 0; width: 12px; height: 12px; background: #8DC63F;"></div>
              <div style="position: absolute; bottom: 0; left: 0; width: 12px; height: 12px; background: #00AEEF;"></div>
              <div style="position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; background: #FFC20E;"></div>
            </div>
            <!-- Separator -->
            <div style="width: 2px; height: 24px; background: #2F2F2F;"></div>
            <!-- Site Title -->
            <span class="ms-learn-brand">Learn</span>
          </div>
          
          <!-- Navigation Menu -->
          <nav class="wireframe-nav">
            <div class="wireframe-nav-item">
              <span class="wireframe-nav-link">Browse</span>
            </div>
            <div class="wireframe-nav-item">
              <span class="wireframe-nav-link">Reference</span>
            </div>
            <div class="wireframe-nav-item">
              <span class="wireframe-nav-link">Learn</span>
            </div>
            <div class="wireframe-nav-item">
              <span class="wireframe-nav-link">Q&A</span>
            </div>
          </nav>
        </div>
        
        <!-- Profile Section -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <!-- User Avatar with Mina image -->
          <img src="mina.png" alt="Mina" style="
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #e1e1e1;
          " />
          <!-- CXS Logo -->
          <!-- Microsoft Logo -->
          <div style="position: relative; width: 26px; height: 26px; margin-left: 8px;">
            <div style="position: absolute; top: 0; left: 0; width: 12px; height: 12px; background: #F26522;"></div>
            <div style="position: absolute; top: 0; right: 0; width: 12px; height: 12px; background: #8DC63F;"></div>
            <div style="position: absolute; bottom: 0; left: 0; width: 12px; height: 12px; background: #00AEEF;"></div>
            <div style="position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; background: #FFC20E;"></div>
          </div>
        </div>
      </header>
    `;
  }

  generateHeroSection(options = {}) {
    const variant = options.variant || "wayfinding"; // wayfinding, accent, accent-with-details
    const eyebrow = options.eyebrow || "MICROSOFT LEARN";
    const title = options.title || "Build your next great idea";
    const subtitle =
      options.subtitle ||
      "Transform your vision into reality with comprehensive resources and tools.";
    const description =
      options.description ||
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
    const buttonText = options.buttonText || options.ctaText || "Get Started";
    const buttonHref = options.buttonHref || "#";
    const backgroundImage = options.backgroundImage;
    const backgroundPattern = options.backgroundPattern;
    const detailsCard = options.detailsCard;

    // Generate hero based on variant
    switch (variant) {
      case "accent":
        return this.generateAccentHero(
          eyebrow,
          title,
          subtitle,
          description,
          buttonText,
          buttonHref,
          backgroundImage
        );

      case "accent-with-details":
        return this.generateAccentHeroWithDetails(
          eyebrow,
          title,
          subtitle,
          description,
          buttonText,
          buttonHref,
          backgroundImage,
          detailsCard
        );

      default: // wayfinding
        return this.generateWayfindingHero(
          eyebrow,
          title,
          subtitle,
          description,
          buttonText,
          buttonHref,
          backgroundPattern
        );
    }
  }

  generateWayfindingHero(
    eyebrow,
    title,
    subtitle,
    description,
    buttonText,
    buttonHref,
    backgroundPattern
  ) {
    const patternUrl =
      backgroundPattern ||
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iIzAwNzhkNCIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+";

    return `
      <section class="hero hero-xs background-color-primary color-primary-invert background-image-pattern background-size-200" 
               style="--background-image-pattern: url('${patternUrl}');">
        <div class="hero-content">
          <p class="letter-spacing-wide text-transform-uppercase font-size-sm">
            ${eyebrow}
          </p>
          <h1 class="font-size-h1 font-weight-semibold">
            ${title}
          </h1>
          <p class="font-size-lg font-weight-semibold margin-block-sm">
            ${subtitle}
          </p>
          <p>
            ${description}
          </p>
          <div class="buttons margin-top-md">
            <button class="button border button-clear">
              ${buttonText}
            </button>
          </div>
        </div>
      </section>
    `;
  }

  generateAccentHero(
    eyebrow,
    title,
    subtitle,
    description,
    buttonText,
    buttonHref,
    backgroundImage
  ) {
    const heroBackgroundImageLight =
      backgroundImage ||
      "https://learn.microsoft.com/en-us/media/home-and-directory/home-hero_light.png";
    const heroBackgroundImageDark =
      backgroundImage ||
      "https://learn.microsoft.com/en-us/media/home-and-directory/home-hero_dark.png";

    return `
      <section class="hero hero-image background-color-body-accent gradient-border-right gradient-border-body-accent"
               style="
                 --hero-background-image-light: url('${heroBackgroundImageLight}');
                 --hero-background-image-dark: url('${heroBackgroundImageDark}');
               ">
        <div class="hero-content">
          <p class="letter-spacing-wide text-transform-uppercase font-size-sm">
            ${eyebrow}
          </p>
          <h1 class="font-size-h1 font-weight-semibold">
            ${title}
          </h1>
          <p class="font-size-lg font-weight-semibold margin-block-sm">
            ${subtitle}
          </p>
          <p>
            ${description}
          </p>
          <div class="buttons margin-top-md">
            <button class="button border button-clear">
              ${buttonText}
            </button>
          </div>
        </div>
      </section>
    `;
  }

  generateAccentHeroWithDetails(
    eyebrow,
    title,
    subtitle,
    description,
    buttonText,
    buttonHref,
    backgroundImage,
    detailsTitle,
    detailsContent
  ) {
    const heroBackgroundImageLight =
      backgroundImage ||
      "https://learn.microsoft.com/en-us/media/learn/plans/skilling_plan_hero.png?branch=main";
    const heroBackgroundImageDark =
      backgroundImage ||
      "https://learn.microsoft.com/en-us/media/learn/plans/skilling_plan_hero.png?branch=main";

    return `
      <section class="hero hero-image flex-direction-row-tablet border background-color-body-accent gradient-border-right gradient-border-body-accent"
               style="
                 --hero-background-image-light: url('${heroBackgroundImageLight}');
                 --hero-background-image-dark: url('${heroBackgroundImageDark}');
               ">
        <div class="hero-content">
          <p class="letter-spacing-wide text-transform-uppercase font-size-sm">
            ${eyebrow}
          </p>
          <h1 class="font-size-h1 font-weight-semibold">
            ${title}
          </h1>
          <p class="font-size-lg font-weight-semibold margin-block-sm">
            ${subtitle}
          </p>
          <p>
            ${description}
          </p>
          <div class="buttons margin-top-md">
            <button class="button border button-clear">
              ${buttonText}
            </button>
          </div>
        </div>
        <div class="hero-details">
          <div class="hero-details-card border border-radius-lg box-shadow-heavy padding-sm">
            <p class="font-weight-bold">
              ${detailsTitle || "Learn More"}
            </p>
            <p class="margin-top-sm">
              ${
                detailsContent ||
                "Discover additional resources and tools to help you succeed in your learning journey."
              }
            </p>
          </div>
        </div>
      </section>
    `;
  }

  generateContainer(options = {}) {
    const content = options.content || "";
    const className = options.className || "";

    return `
      <div class="atlas-container ${className}">
        ${content}
      </div>
    `;
  }

  generateHeading(options = {}) {
    const text = options.text || "Heading";
    const level = options.level || 2;
    const className = options.className || "";

    return `<h${level} class="${className}" style="color: #333; margin-bottom: 1rem;">${text}</h${level}>`;
  }

  generateParagraph(options = {}) {
    const text = options.text || "Paragraph text";
    const className = options.className || "";

    return `<p class="${className}" style="color: #666; line-height: 1.6; margin-bottom: 1rem;">${text}</p>`;
  }

  generateInputField(options = {}) {
    const label = options.label || "Input Field";
    const placeholder = options.placeholder || "";
    const type = options.type || "text";
    const required = options.required ? "required" : "";
    const id = options.id || label.toLowerCase().replace(/\s+/g, "-");

    return `
      <div style="margin-bottom: 1rem;">
        <label for="${id}" style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #333;">${label}</label>
        <input type="${type}" id="${id}" name="${id}" placeholder="${placeholder}" class="atlas-input" ${required}>
      </div>
    `;
  }

  generateTextareaField(options = {}) {
    const label = options.label || "Message";
    const placeholder = options.placeholder || "";
    const rows = options.rows || 4;
    const required = options.required ? "required" : "";
    const id = options.id || label.toLowerCase().replace(/\s+/g, "-");

    return `
      <div style="margin-bottom: 1rem;">
        <label for="${id}" style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #333;">${label}</label>
        <textarea id="${id}" name="${id}" placeholder="${placeholder}" rows="${rows}" class="atlas-textarea" ${required}></textarea>
      </div>
    `;
  }

  generatePrimaryButton(options = {}) {
    const text = options.text || "Button";
    const href = options.href || "#";
    const type = options.type || "button";
    const className = options.className || "";

    if (options.href) {
      return `<a href="${href}" class="atlas-button ${className}" style="text-decoration: none; display: inline-block;">${text}</a>`;
    } else {
      return `<button type="${type}" class="atlas-button ${className}">${text}</button>`;
    }
  }

  generateFooter(options = {}) {
    const copyright =
      options.copyright || "© 2025 Atlas Design System. All rights reserved.";
    const links = options.links || [
      { text: "Privacy Policy", href: "#" },
      { text: "Terms of Service", href: "#" },
      { text: "Contact", href: "#" },
    ];

    const linkItems = links
      .map(
        (link) =>
          `<a href="${link.href}" style="color: #ccc; text-decoration: none; margin: 0 10px;">${link.text}</a>`
      )
      .join("");

    return `
      <footer class="atlas-footer">
        <div class="atlas-container">
          <div style="margin-bottom: 1rem;">${linkItems}</div>
          <p style="margin: 0; color: #ccc;">${copyright}</p>
        </div>
      </footer>
    `;
  }

  generateCard(options = {}) {
    const title = options.title || "Card Title";
    const content = options.content || "Card content goes here.";
    const className = options.className || "";

    return `
      <div class="atlas-card ${className}">
        <h3 style="margin-top: 0; color: #333;">${title}</h3>
        <div style="color: #666;">${content}</div>
      </div>
    `;
  }

  generateGrid(options = {}) {
    const items = options.items || [];
    const className = options.className || "";

    const gridItems = items.map((item) => this.generateCard(item)).join("");

    return `
      <div class="atlas-grid ${className}">
        ${gridItems}
      </div>
    `;
  }

  /**
   * Get base styles for injection into HTML head
   * @returns {string} CSS styles
   */
  getBaseStyles() {
    return this.baseStyles;
  }
}

module.exports = AtlasComponentLibrary;
