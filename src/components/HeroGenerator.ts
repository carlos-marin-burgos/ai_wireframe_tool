// Hero Control HTML Generator for Wireframes
// This generates HTML strings that can be used in wireframe generation

interface HeroOptions {
  title?: string;
  summary?: string;
  eyebrow?: string;
  ctaText?: string;
  secondaryCtaText?: string;
  showSecondaryButton?: boolean;
  backgroundColor?: string;
  heroImageUrl?: string;
}

export function generateHeroHTML(options: HeroOptions = {}): string {
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

// Predefined Hero templates for common scenarios
export const HeroTemplates = {
  default: () => generateHeroHTML(),

  learning: () =>
    generateHeroHTML({
      title: "Master new skills with Microsoft Learn",
      summary:
        "Explore hands-on learning paths and earn certifications in Microsoft technologies.",
      eyebrow: "MICROSOFT LEARN",
      ctaText: "Start Learning",
      showSecondaryButton: true,
      secondaryCtaText: "Browse",
      backgroundColor: "#E8E6DF",
      heroImageUrl: "hero-learn.svg",
    }),

  azure: () =>
    generateHeroHTML({
      title: "Build and deploy with Azure",
      summary:
        "Create scalable applications with Microsoft Azure cloud services and tools.",
      eyebrow: "MICROSOFT AZURE",
      ctaText: "Get Started",
      showSecondaryButton: true,
      secondaryCtaText: "Learn More",
      backgroundColor: "#E8E6DF",
      heroImageUrl: "azure.svg",
    }),

  developer: () =>
    generateHeroHTML({
      title: "Developer tools and resources",
      summary:
        "Everything you need to build amazing applications with Microsoft technologies.",
      eyebrow: "DEVELOPER PLATFORM",
      ctaText: "Explore Docs",
      showSecondaryButton: true,
      secondaryCtaText: "Documentation",
      backgroundColor: "#E8E6DF",
      heroImageUrl: "vscode.svg",
    }),

  ai: () =>
    generateHeroHTML({
      title: "Accelerate innovation with AI",
      summary:
        "Transform your business with artificial intelligence and machine learning solutions.",
      eyebrow: "AI & MACHINE LEARNING",
      ctaText: "Explore AI",
      showSecondaryButton: false,
      backgroundColor: "#E8E6DF",
      heroImageUrl: "azure-ai.svg",
    }),

  minimal: () =>
    generateHeroHTML({
      title: "Simple and focused experience",
      summary: "Clean, minimalist design that puts content first.",
      eyebrow: "GETTING STARTED",
      ctaText: "Get Started",
      showSecondaryButton: false,
      backgroundColor: "#E8E6DF",
      heroImageUrl: "hero-learn.svg",
    }),
};

export default { generateHeroHTML, HeroTemplates };
