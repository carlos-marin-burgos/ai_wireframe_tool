// Container Nesting Fix for Wireframe Generation
// Purpose: Detect and fix excessive container nesting that prevents component rearrangement

function fixContainerNesting(html) {
  console.log("🔧 Applying container nesting fixes...");

  if (!html || typeof html !== "string") return html;

  let fixedHtml = html;
  let fixesApplied = 0;

  // 1. Fix excessive div nesting around cards/components
  const cardContainerPatterns = [
    // Pattern: Multiple nested containers around single components
    {
      pattern:
        /<div[^>]*>\s*<div[^>]*>\s*<div[^>]*>\s*<div[^>]*class="[^"]*card[^"]*"/gi,
      replacement: '<div class="card',
      description: "Excessive div nesting around cards",
    },

    // Pattern: Nested containers with redundant styling
    {
      pattern:
        /<div[^>]*class="[^"]*container[^"]*"[^>]*>\s*<div[^>]*class="[^"]*container[^"]*"/gi,
      replacement: (match) => {
        const firstDiv = match.match(
          /<div[^>]*class="[^"]*container[^"]*"[^>]*>/
        )[0];
        return firstDiv;
      },
      description: "Nested container classes",
    },

    // Pattern: Empty wrapper divs
    {
      pattern:
        /<div[^>]*>\s*<div[^>]*>\s*(<div[^>]*class="[^"]*(?:card|component|item)[^"]*")/gi,
      replacement: "$1",
      description: "Empty wrapper divs around components",
    },

    // Pattern: Excessive flexbox containers
    {
      pattern: /<div[^>]*display:\s*flex[^>]*>\s*<div[^>]*display:\s*flex/gi,
      replacement: (match) => {
        // Keep only the outer flex container
        const outerDiv = match.match(/<div[^>]*display:\s*flex[^>]*>/)[0];
        return outerDiv;
      },
      description: "Nested flex containers",
    },
  ];

  // Apply card container fixes
  cardContainerPatterns.forEach((fix) => {
    const beforeLength = fixedHtml.length;

    if (typeof fix.replacement === "function") {
      fixedHtml = fixedHtml.replace(fix.pattern, fix.replacement);
    } else {
      fixedHtml = fixedHtml.replace(fix.pattern, fix.replacement);
    }

    const afterLength = fixedHtml.length;
    if (beforeLength !== afterLength) {
      fixesApplied++;
      console.log(`   ✓ Fixed: ${fix.description}`);
    }
  });

  // 2. Ensure proper grid/flex layout for cards
  const layoutFixes = [
    // Add proper grid layout for card containers
    {
      pattern:
        /<div([^>]*class="[^"]*(?:cards|grid|layout)[^"]*"[^>]*)>(?!\s*<style)/gi,
      replacement: (match, attributes) => {
        if (
          !attributes.includes("style=") &&
          !attributes.includes("display:")
        ) {
          return match.replace(
            ">",
            ' style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; width: 100%;">'
          );
        }
        return match;
      },
      description: "Added grid layout to card containers",
    },

    // Fix card widths to prevent overflow
    {
      pattern: /<div([^>]*class="[^"]*card[^"]*"[^>]*)>/gi,
      replacement: (match, attributes) => {
        if (
          !attributes.includes("style=") ||
          !attributes.includes("max-width")
        ) {
          const hasStyle = attributes.includes("style=");
          if (hasStyle) {
            return match.replace(
              'style="',
              'style="max-width: 100%; box-sizing: border-box; '
            );
          } else {
            return match.replace(
              ">",
              ' style="max-width: 100%; box-sizing: border-box;">'
            );
          }
        }
        return match;
      },
      description: "Fixed card widths for proper arrangement",
    },
  ];

  // Apply layout fixes
  layoutFixes.forEach((fix) => {
    const beforeLength = fixedHtml.length;
    fixedHtml = fixedHtml.replace(fix.pattern, fix.replacement);
    const afterLength = fixedHtml.length;

    if (beforeLength !== afterLength) {
      fixesApplied++;
      console.log(`   ✓ Fixed: ${fix.description}`);
    }
  });

  // 3. Add responsive CSS if not present
  if (!fixedHtml.includes("@media") && fixedHtml.includes("card")) {
    const responsiveCSS = `
        @media (max-width: 768px) {
            .cards, .grid, .layout {
                grid-template-columns: 1fr !important;
                gap: 16px !important;
            }
            .card {
                margin-bottom: 16px !important;
            }
        }
        `;

    if (fixedHtml.includes("</style>")) {
      fixedHtml = fixedHtml.replace(
        "</style>",
        responsiveCSS + "\n    </style>"
      );
      fixesApplied++;
      console.log("   ✓ Added responsive card layout CSS");
    }
  }

  console.log(`🎯 Applied ${fixesApplied} container nesting fixes`);
  return fixedHtml;
}

module.exports = { fixContainerNesting };
