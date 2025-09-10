// Hero Control HTML Generator for Wireframes
// This generates HTML strings that can be used in wireframe generation

interface HeroOptions {
  title?: string;
  summary?: string;
  eyebrow?: string;
  searchPlaceholder?: string;
  ctaText?: string;
  secondaryCtaText?: string;
  showSearch?: boolean;
  showSecondaryButton?: boolean;
  showImage?: boolean;
  imageUrl?: string;
  backgroundColor?: string;
}

export function generateHeroHTML(options: HeroOptions = {}): string {
  const {
    title = "Create amazing experiences with Microsoft Learn",
    summary = "Discover learning paths and modules designed to help you build skills in cloud computing, development, and more.",
    eyebrow = "",
    searchPlaceholder = "Search for topics...",
    ctaText = "Start Learning",
    secondaryCtaText = "Browse",
    showSearch = true,
    showSecondaryButton = false,
    showImage = true,
    imageUrl,
    backgroundColor = "#E8E6DF",
  } = options;

  const searchIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.5 3C5.46243 3 3 5.46243 3 8.5C3 11.5376 5.46243 14 8.5 14C9.83879 14 11.0659 13.5217 12.0196 12.7266L16.6464 17.3536L17.3536 16.6464L12.7266 12.0196C13.5217 11.0659 14 9.83879 14 8.5C14 5.46243 11.5376 3 8.5 3ZM4 8.5C4 6.01472 6.01472 4 8.5 4C10.9853 4 13 6.01472 13 8.5C13 10.9853 10.9853 13 8.5 13C6.01472 13 4 10.9853 4 8.5Z" fill="white"/>
  </svg>`;

  const imageBackground = imageUrl
    ? `background-image: url(${imageUrl}); background-size: cover; background-position: center; background-repeat: no-repeat;`
    : "background: #ffffff;";

  const actionSection = showSearch
    ? `<div style="display: flex; flex-direction: row; align-items: flex-start; padding: 0px; gap: 8px; width: 516.75px; height: 40.5px;">
         <div style="display: flex; flex-direction: column; align-items: flex-start; padding: 0px; gap: 4px; width: 400px; height: 40.5px;">
           <input type="text" placeholder="${searchPlaceholder}" 
                  style="box-sizing: border-box; width: 400px; height: 40.5px; background: #FFFFFF; border: 1px solid #505050; border-radius: 2px; padding: 5.75px 10.25px; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 18px; color: #505050; outline: none;" />
         </div>
         <button style="display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 5.75px 13.5px; gap: 6.75px; width: 108.75px; height: 40.5px; background: #0078D4; border-radius: 2px; border: none; cursor: pointer; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 600; font-size: 18px; color: #FFFFFF;">
           ${searchIcon}
           <span>${ctaText}</span>
         </button>
       </div>`
    : `<div style="display: flex; gap: 8px;">
         <button style="display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 5.75px 13.5px; gap: 6.75px; width: 108.75px; height: 40.5px; background: #0078D4; border-radius: 2px; border: none; cursor: pointer; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 600; font-size: 18px; color: #FFFFFF;">
           ${ctaText}
         </button>
         ${
           showSecondaryButton
             ? `<button style="box-sizing: border-box; display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 6px 14px; gap: 8px; width: 70px; height: 38px; border: 1px solid #8E8E8E; border-radius: 2px; background: transparent; cursor: pointer; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 600; font-size: 16px; color: #161616;">
           ${secondaryCtaText}
         </button>`
             : ""
         }
       </div>`;

  const imageSection = showImage
    ? `<div style="width: 592px; height: 387px; position: relative; overflow: hidden;">
         <div style="position: absolute; width: 592px; height: 386px; left: -49px; top: 0px; ${imageBackground}"></div>
         <div style="position: absolute; width: 130px; height: 387px; left: -49px; top: 0px; background: linear-gradient(90deg, ${backgroundColor} 0%, rgba(232, 230, 223, 0) 100%);"></div>
         <div style="position: absolute; width: 130px; height: 386px; left: 413px; top: 0px; background: linear-gradient(90deg, ${backgroundColor} 0%, rgba(232, 230, 223, 0) 100%); transform: rotate(-180deg);"></div>
       </div>`
    : "";

  return `
    <div style="display: flex; flex-direction: row; align-items: center; padding: 0px 0px 0px 16px; gap: 38px; width: 100%; max-width: 1360px; height: 387px; background: ${backgroundColor}; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;">
      <!-- Left Section -->
      <div style="display: flex; flex-direction: row; justify-content: center; align-items: flex-start; padding: 64px 0px; gap: 16px; width: 714px; height: 364.5px;">
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: 0px; gap: 16px; width: 714px;">
          <div style="display: flex; flex-direction: column; align-items: flex-start; padding: 0px; gap: 24px; width: 534px;">
            ${
              eyebrow
                ? `<!-- Eyebrow -->
            <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 600; font-size: 12px; line-height: 16px; text-transform: uppercase; letter-spacing: 0.5px; color: #616161; margin: 0;">
              ${eyebrow}
            </div>`
                : ""
            }
            
            <!-- Title -->
            <h1 style="width: 534px; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 600; font-size: 40px; line-height: 52px; background: linear-gradient(91.54deg, #0078D4 2.94%, #C73ECC 78.45%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">
              ${title}
            </h1>
            
            <!-- Summary -->
            <p style="width: 534px; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 400; font-size: 16px; line-height: 22px; color: #161616; margin: 0;">
              ${summary}
            </p>
            
            <!-- Action Section -->
            ${actionSection}
          </div>
        </div>
      </div>
      
      <!-- Hero Image -->
      ${imageSection}
    </div>
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
      ctaText: "Start Learning",
      backgroundColor: "#f3f2f1",
    }),

  azure: () =>
    generateHeroHTML({
      title: "Build and deploy with Azure",
      summary:
        "Create scalable applications with Microsoft Azure cloud services and tools.",
      showSearch: false,
      showSecondaryButton: true,
      ctaText: "Get Started",
      secondaryCtaText: "Learn More",
      backgroundColor: "#ddeaf7",
    }),

  developer: () =>
    generateHeroHTML({
      title: "Developer tools and resources",
      summary:
        "Everything you need to build amazing applications with Microsoft technologies.",
      searchPlaceholder: "Search developer docs...",
      ctaText: "Explore Docs",
      backgroundColor: "#e1dfdd",
    }),

  ai: () =>
    generateHeroHTML({
      title: "Accelerate innovation with AI",
      summary:
        "Transform your business with artificial intelligence and machine learning solutions.",
      searchPlaceholder: "Search AI solutions...",
      ctaText: "Explore AI",
      backgroundColor: "#f0f7ff",
      imageUrl:
        "https://via.placeholder.com/600x400/4a90e2/ffffff?text=AI+Innovation",
    }),

  minimal: () =>
    generateHeroHTML({
      title: "Simple and focused experience",
      summary: "Clean, minimalist design that puts content first.",
      showImage: false,
      showSearch: false,
      ctaText: "Get Started",
      backgroundColor: "#ffffff",
    }),
};

export default { generateHeroHTML, HeroTemplates };
