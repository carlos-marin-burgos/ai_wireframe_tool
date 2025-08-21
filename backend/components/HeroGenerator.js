// Hero Control HTML Generator for Backend Wireframe Generation
// This generates HTML strings that can be used in wireframe generation

/**
 * Generates the complete Microsoft Learn Navigation HTML
 * Uses the specific Atlas navigation component from Figma (node-id: 11530:113245)
 * @returns {string} Complete HTML string for Microsoft Learn navbar
 */
function generateMicrosoftNavHTML() {
  return `
  <!-- Atlas Top Navigation - Always Present (Node ID: 11530:113245) -->
  <header class="atlas-top-navigation" data-node-id="11530:113245" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding: 8px 24px; gap: 21px; width: 100%; height: 54px; box-sizing: border-box; background: #FFFFFF; border-bottom: 1px solid #E0E0E0; position: sticky; top: 0; z-index: 1000;">
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
        <div style="display: flex; align-items: center; padding: 6px 8px; gap: 4px; cursor: pointer;">
          <span style="font-family: 'Segoe UI', sans-serif; font-weight: 400; font-size: 14px; color: #171717;">Learn</span>
        </div>
        <div style="display: flex; align-items: center; padding: 6px 8px; gap: 4px; cursor: pointer;">
          <span style="font-family: 'Segoe UI', sans-serif; font-weight: 400; font-size: 14px; color: #171717;">Q&A</span>
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

/**
 * Generates the Microsoft Learn Footer HTML
 * @returns {string} Complete HTML string for Microsoft Learn footer
 */
function generateMicrosoftFooterHTML() {
  return `
  <!-- Microsoft Learn Footer -->
  <footer style="background-color: #f8f8f8; border-top: 1px solid #e0e0e0; padding: 24px 0; margin-top: 60px; text-align: center;">
    <p style="margin: 0; font-size: 14px; color: #666; font-family: 'Segoe UI', sans-serif;">© 2025 Designetica by Cloud Experience Studio - Microsoft Learn</p>
  </footer>
  `;
}

/**
 * Generates the Hero HTML using Microsoft Learn Accent Hero pattern
 * @param {Object} options - Configuration options for the hero
 * @returns {string} Complete HTML string for Microsoft Learn Accent Hero
 */
function generateHeroHTML(options = {}) {
  const {
    title = "Learning for everyone, everywhere",
    summary = "Explore Microsoft product documentation, training, credentials, Q&A, code references, and shows.",
    eyebrow = "MICROSOFT LEARN",
    ctaText = "Get Started",
    secondaryCtaText = "Browse",
    showSecondaryButton = true,
    backgroundColor = "#E8E6DF",
    heroImageUrl = "public/hero300.png",
  } = options;

  return `
    <!-- Microsoft Learn Accent Hero Section -->
    <section class="hero hero-image background-color-body-accent gradient-border-right gradient-border-body-accent" 
             style="--hero-background-image-light: url('${heroImageUrl}'); --hero-background-image-dark: url('${heroImageUrl}'); 
                    position: relative; display: flex; flex-direction: column; min-height: 300px; padding: 2rem; 
                    background-color: ${backgroundColor}; background-image: var(--hero-background-image-light); 
                    background-size: cover; background-position: center; background-repeat: no-repeat;">
      
      <!-- Gradient Border Right -->
      <div style="content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 4px; 
                  background: linear-gradient(180deg, ${backgroundColor} 0%, rgba(232, 230, 223, 0) 100%);"></div>
      
      <!-- Hero Content -->
      <div class="hero-content" style="max-width: 800px; z-index: 1;">
        <!-- Eyebrow Text -->
        <p class="letter-spacing-wide text-transform-uppercase font-size-sm" 
           style="letter-spacing: 0.2em; text-transform: uppercase; font-size: 0.875rem; 
                  line-height: 1.25rem; margin: 0 0 0.5rem 0; color: #323130; font-weight: 600;">
          ${eyebrow}
        </p>
        
        <!-- Main Title -->
        <h1 class="font-size-h1 font-weight-semibold" 
            style="font-size: 2.5rem; line-height: 3rem; font-weight: 600; margin: 0 0 1rem 0; color: #323130;">
          ${title}
        </h1>
        
        <!-- Summary Text -->
        <p class="font-size-lg font-weight-semibold margin-block-sm" 
           style="font-size: 1.125rem; line-height: 1.75rem; font-weight: 600; 
                  margin-top: 0.5rem; margin-bottom: 0.5rem; color: #323130;">
          ${summary}
        </p>
        
        <!-- Action Buttons -->
        <div class="buttons margin-top-md" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem;">
          <button class="button border button-clear" 
                  style="display: inline-flex; align-items: center; justify-content: center; 
                         padding: 0.5rem 1rem; border-radius: 0.25rem; font-family: 'Segoe UI', sans-serif; 
                         font-size: 0.875rem; font-weight: 600; text-decoration: none; cursor: pointer; 
                         transition: all 0.2s ease; min-height: 2.5rem; border: 1px solid #0078d4; 
                         background-color: transparent; color: #0078d4;">
            ${ctaText}
          </button>
          ${
            showSecondaryButton
              ? `
          <button class="button border" 
                  style="display: inline-flex; align-items: center; justify-content: center; 
                         padding: 0.5rem 1rem; border-radius: 0.25rem; font-family: 'Segoe UI', sans-serif; 
                         font-size: 0.875rem; font-weight: 600; text-decoration: none; cursor: pointer; 
                         transition: all 0.2s ease; min-height: 2.5rem; border: 1px solid #0078d4; 
                         background-color: #0078d4; color: white;">
            ${secondaryCtaText}
          </button>
          `
              : ""
          }
        </div>
      </div>
    </section>
    
    <style>
      /* Microsoft Learn Accent Hero CSS Classes */
      .hero {
        position: relative;
        display: flex;
        flex-direction: column;
        min-height: 300px;
        padding: 2rem;
        font-family: 'Segoe UI', sans-serif;
      }
      
      .hero-image {
        background-image: var(--hero-background-image-light);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
      
      .background-color-body-accent {
        background-color: #E8E6DF;
      }
      
      .gradient-border-right::after {
        content: '';
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: linear-gradient(180deg, #E8E6DF 0%, rgba(232, 230, 223, 0) 100%);
      }
      
      .hero-content {
        max-width: 800px;
        z-index: 1;
      }
      
      .button:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      
      .button.button-clear:hover {
        background-color: #0078d4 !important;
        color: white !important;
      }
      
      .button.border:hover {
        background-color: #106ebe !important;
        border-color: #106ebe !important;
      }
      
      @media (max-width: 768px) {
        .hero {
          padding: 1rem;
        }
        
        .font-size-h1 {
          font-size: 1.875rem !important;
          line-height: 2.25rem !important;
        }
        
        .buttons {
          flex-direction: column;
        }
        
        .button {
          width: 100%;
          justify-content: center;
        }
      }
    </style>
  `;
}

// Predefined Hero templates for common wireframe scenarios
const HeroTemplates = {
  // Default custom style
  default: () => generateHeroHTML(),

  // Learning and education focused
  learning: () =>
    generateHeroHTML({
      title: "Master new skills and grow your expertise",
      summary:
        "Explore comprehensive learning paths and earn valuable certifications in modern technologies.",
      ctaText: "Start Learning",
      backgroundColor: "#E8E6DF",
    }),

  // Business and enterprise solutions
  business: () =>
    generateHeroHTML({
      title: "Transform your business with innovation",
      summary:
        "Discover powerful solutions designed to streamline operations and drive growth.",
      showSearch: false,
      showSecondaryButton: true,
      ctaText: "Get Started",
      secondaryCtaText: "Learn More",
      backgroundColor: "#E8E6DF",
    }),

  // Developer tools and resources
  developer: () =>
    generateHeroHTML({
      title: "Build exceptional applications",
      summary:
        "Access comprehensive tools and resources for modern software development.",
      searchPlaceholder: "Search developer docs...",
      ctaText: "Explore Tools",
      backgroundColor: "#E8E6DF",
    }),

  // Technology and innovation
  technology: () =>
    generateHeroHTML({
      title: "Leading the future of technology",
      summary:
        "Discover cutting-edge innovations and solutions that transform how we work and live.",
      searchPlaceholder: "Search innovations...",
      ctaText: "Explore Tech",
      backgroundColor: "#E8E6DF",
      imageUrl:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    }),

  // Minimal design without image
  minimal: () =>
    generateHeroHTML({
      title: "Simple and focused experience",
      summary: "Clean, minimalist design that puts your content first.",
      showImage: false,
      showSearch: false,
      ctaText: "Get Started",
      backgroundColor: "#E8E6DF",
    }),

  // Product showcase
  product: () =>
    generateHeroHTML({
      title: "Discover our innovative solutions",
      summary:
        "Explore products designed to solve real-world challenges and deliver exceptional value.",
      showSearch: false,
      showSecondaryButton: true,
      ctaText: "View Products",
      secondaryCtaText: "Watch Demo",
      backgroundColor: "#E8E6DF",
      imageUrl:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
    }),

  // Community and collaboration
  community: () =>
    generateHeroHTML({
      title: "Join a thriving community",
      summary:
        "Connect with like-minded professionals, share knowledge, and collaborate on exciting projects.",
      searchPlaceholder: "Search community resources...",
      ctaText: "Join Community",
      backgroundColor: "#E8E6DF",
      imageUrl:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
    }),
};

// Helper function to detect hero type from description
function detectHeroType(description = "") {
  const desc = description.toLowerCase();

  if (
    desc.includes("learn") ||
    desc.includes("education") ||
    desc.includes("course") ||
    desc.includes("training")
  ) {
    return "learning";
  } else if (
    desc.includes("business") ||
    desc.includes("enterprise") ||
    desc.includes("corporate")
  ) {
    return "business";
  } else if (
    desc.includes("developer") ||
    desc.includes("api") ||
    desc.includes("documentation") ||
    desc.includes("code")
  ) {
    return "developer";
  } else if (
    desc.includes("tech") ||
    desc.includes("innovation") ||
    desc.includes("future") ||
    desc.includes("cutting-edge")
  ) {
    return "technology";
  } else if (desc.includes("product") || desc.includes("solution")) {
    return "product";
  } else if (
    desc.includes("community") ||
    desc.includes("event") ||
    desc.includes("meetup") ||
    desc.includes("collaboration")
  ) {
    return "community";
  } else if (
    desc.includes("minimal") ||
    desc.includes("simple") ||
    desc.includes("clean")
  ) {
    return "minimal";
  }

  return "default";
}

// Generate hero based on wireframe description
function generateContextualHero(description = "", options = {}) {
  const heroType = detectHeroType(description);
  const template = HeroTemplates[heroType] || HeroTemplates.default;

  // Extract custom options from description if possible
  const customOptions = { ...options };

  if (description.includes("search")) {
    customOptions.showSearch = true;
  }

  if (description.includes("button") && description.includes("secondary")) {
    customOptions.showSecondaryButton = true;
  }

  if (
    description.includes("no image") ||
    description.includes("without image")
  ) {
    customOptions.showImage = false;
  }

  // Generate base template and apply custom options
  if (Object.keys(customOptions).length > 0) {
    return generateHeroHTML({
      ...parseTemplateOptions(heroType),
      ...customOptions,
    });
  }

  return template();
}

// Helper to get template options
function parseTemplateOptions(heroType) {
  const templateConfigs = {
    learning: {
      title: "Master new skills and grow your expertise",
      summary:
        "Explore comprehensive learning paths and earn valuable certifications in modern technologies.",
      ctaText: "Start Learning",
      backgroundColor: "#E8E6DF",
    },
    business: {
      title: "Transform your business with innovation",
      summary:
        "Discover powerful solutions designed to streamline operations and drive growth.",
      showSearch: false,
      showSecondaryButton: true,
      ctaText: "Get Started",
      secondaryCtaText: "Learn More",
      backgroundColor: "#E8E6DF",
    },
    developer: {
      title: "Build exceptional applications",
      summary:
        "Access comprehensive tools and resources for modern software development.",
      searchPlaceholder: "Search developer docs...",
      ctaText: "Explore Tools",
      backgroundColor: "#E8E6DF",
    },
    technology: {
      title: "Leading the future of technology",
      summary:
        "Discover cutting-edge innovations and solutions that transform how we work and live.",
      searchPlaceholder: "Search innovations...",
      ctaText: "Explore Tech",
      backgroundColor: "#E8E6DF",
    },
    minimal: {
      title: "Simple and focused experience",
      summary: "Clean, minimalist design that puts your content first.",
      showImage: false,
      showSearch: false,
      ctaText: "Get Started",
      backgroundColor: "#E8E6DF",
    },
    product: {
      title: "Discover our innovative solutions",
      summary:
        "Explore products designed to solve real-world challenges and deliver exceptional value.",
      showSearch: false,
      showSecondaryButton: true,
      ctaText: "View Products",
      secondaryCtaText: "Watch Demo",
      backgroundColor: "#E8E6DF",
    },
    community: {
      title: "Join a thriving community",
      summary:
        "Connect with like-minded professionals, share knowledge, and collaborate on exciting projects.",
      searchPlaceholder: "Search community resources...",
      ctaText: "Join Community",
      backgroundColor: "#E8E6DF",
    },
  };

  return templateConfigs[heroType] || {};
}

module.exports = {
  generateHeroHTML,
  generateMicrosoftNavHTML,
  generateMicrosoftFooterHTML,
  HeroTemplates,
  detectHeroType,
  generateContextualHero,
};
