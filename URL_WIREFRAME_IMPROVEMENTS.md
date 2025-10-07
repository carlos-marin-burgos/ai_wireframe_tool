# URL-Based Wireframe Generation Improvements# URL-to-Wireframe Accuracy Improvement Plan

## Problem Statement## Priority 1: Visual Design Extraction (High Impact)

When entering a URL like `https://learn.microsoft.com` to create a wireframe, the generated output was not accurately reflecting the actual website structure. The wireframes looked generic and didn't match the site's layout, sections, or content hierarchy.### 1.1 Color Extraction

- [ ] Use `page.evaluate()` to get computed styles

## Root Causes Identified- [ ] Extract actual background colors from elements

- [ ] Sample primary/secondary/accent colors from major sections

1. **Generic Content Extraction**: The `extractSections()` function only looked for basic HTML elements (`<section>`, `<article>`) without understanding their semantic meaning or purpose.- [ ] Calculate color palette from most-used colors

2. **No Pattern Recognition**: Modern websites like Microsoft Learn have distinct patterns (hero sections, feature grids, CTAs, learning paths) that weren't being identified.### 1.2 Typography Analysis

- [ ] Extract actual font-family from computed styles

3. **Basic Prompts**: The AI prompts only included generic text snippets like "Section 1: Some text..." without describing the **type** of section or its **purpose**.- [ ] Capture font sizes for h1, h2, h3, body text

- [ ] Get font weights and line heights

4. **Missing Visual Context**: No information about the visual hierarchy, layout structure, or prominence of sections was captured.- [ ] Identify web fonts (Google Fonts, Adobe Fonts, etc.)

## Improvements Implemented### 1.3 Spacing & Sizing

- [ ] Extract margins/padding from major sections

### 1. Enhanced Section Detection (`extractSections`)- [ ] Capture element dimensions (width, height)

- [ ] Identify spacing patterns (8px grid, 4px grid, etc.)

**File**: `backend/websiteAnalyzer/index.js`- [ ] Get container max-widths

**Changes**:## Priority 2: Layout Accuracy (Medium Impact)

- Added `detectSectionType()` function that identifies 12+ section types:

  - **Hero sections**: Large headings with CTA buttons### 2.1 CSS Grid/Flexbox Detection

  - **Features**: Multiple cards/items with icons- [ ] Detect display: grid usage

  - **CTAs**: Call-to-action sections- [ ] Capture grid-template-columns patterns

  - **Testimonials**: Reviews and quotes- [ ] Identify flexbox layouts and justify-content

  - **Pricing**: Pricing plans- [ ] Get gap values for modern layouts

  - **Forms**: Input sections

  - **Stats**: Metrics and numbers### 2.2 Responsive Design

  - **Gallery**: Image showcases- [ ] Capture mobile viewport layout

  - **Blog lists**: Article listings- [ ] Identify breakpoint patterns

  - **Navigation**: Menu sections- [ ] Detect hamburger menus

  - **Team**: About/team sections- [ ] Analyze responsive image handling

  - **Content**: General informational sections

## Priority 3: Screenshot Comparison (Medium Impact)

- Extracts rich metadata for each section:

  - Heading and subheadings### 3.1 Re-enable Screenshots

  - Summary/context- [ ] Optimize screenshot generation

  - Component counts (buttons, images, forms, videos, links)- [ ] Add side-by-side comparison view

  - CTA button text- [ ] Highlight structural differences

  - CSS classes and IDs- [ ] Visual diff tool integration

### 2. Visual Hierarchy Extraction (`extractVisualHierarchy`)## Priority 4: Modern Web Support (Low-Medium Impact)

**File**: `backend/websiteAnalyzer/index.js` (new function)### 4.1 SPA Handling

- [ ] Better waiting for client-side rendering

**Features**:- [ ] Detect React/Vue/Angular patterns

- Uses Puppeteer to analyze rendered page- [ ] Wait for AJAX completion

- Detects overall layout type (grid, flex, block)- [ ] Handle infinite scroll

- Identifies hero sections based on size and position

- Detects sidebars### 4.2 Advanced Features

- Calculates visual prominence scores for sections- [ ] Capture CSS animations

- Identifies sections in initial viewport- [ ] Detect sticky headers

- Measures header height and main content width- [ ] Identify modal patterns

- [ ] Recognize carousels/sliders

### 3. Enhanced Prompt Generation (`generateWireframePrompt`)

## Implementation Code Examples

**File**: `backend/websiteAnalyzer/index.js`

### Color Extraction (page.evaluate)

**Improvements**:```javascript

- Creates structured, hierarchical prompts with:const colors = await page.evaluate(() => {

  - **Overall Structure**: Header, navigation, main content, footer const elements = document.querySelectorAll('header, nav, main, section, footer, button, .btn, a');

  - **Detailed Section Descriptions**: Each section with: const colorMap = new Map();

    - Type and purpose

    - Content summary elements.forEach(el => {

    - Subheadings const styles = window.getComputedStyle(el);

    - Component counts const bg = styles.backgroundColor;

    - CTA button text const color = styles.color;

  - **Wireframe Generation Instructions**:

    - Preserve section order and hierarchy colorMap.set(bg, (colorMap.get(bg) || 0) + 1);

    - Use appropriate layouts for each section type colorMap.set(color, (colorMap.get(color) || 0) + 1);

    - Include realistic content placeholders });

    - Apply Microsoft Design System styling

  return Array.from(colorMap.entries())

### 4. Improved Wireframe Generation Integration .sort((a, b) => b[1] - a[1])

    .slice(0, 10)

**File**: `backend/generateWireframe/index.js` .map(([color]) => color);

});

**Changes**:```

- Enhanced prompt section for website analysis

- Includes visual hierarchy information### Typography Extraction

- Provides detailed section-by-section breakdown```javascript

- Specifies appropriate layout patterns for each section type:const typography = await page.evaluate(() => {

  - Hero: Large, prominent with heading + CTA const headings = {

  - Features: Grid or card layout h1: window.getComputedStyle(document.querySelector('h1')),

  - CTA: Centered, focused h2: window.getComputedStyle(document.querySelector('h2')),

  - Forms: Organized inputs with labels body: window.getComputedStyle(document.body)

  - Stats: Prominent metrics display };

  - Gallery: Visual grid

  return {

## Testing Results h1: headings.h1.fontFamily + ' ' + headings.h1.fontSize,

    h2: headings.h2.fontFamily + ' ' + headings.h2.fontSize,

**Test URL**: `https://learn.microsoft.com` body: headings.body.fontFamily + ' ' + headings.body.fontSize

};

**Analysis Results**:});

- ✅ 15 sections detected (vs ~3-5 previously)```

- ✅ Section types identified: hero, features, forms, content, CTA

- ✅ Visual hierarchy extracted: Grid layout, no hero initially, 248px header### Spacing Extraction

- ✅ 25 navigation links captured```javascript

- ✅ Subheadings and CTAs extracted for contextconst spacing = await page.evaluate(() => {

  const sections = document.querySelectorAll('section, main, .section');

**Wireframe Generation**: const spacingValues = [];

- ✅ Generated 4,759 characters of HTML (more detailed)

- ✅ Includes detected section types sections.forEach(el => {

- ✅ Properly structured with semantic sections const styles = window.getComputedStyle(el);

- ✅ Better reflects actual website organization spacingValues.push({

      margin: styles.margin,

## Before vs After padding: styles.padding,

      gap: styles.gap

### Before });

````});

Website "Title" analysis:

Navigation: 10 navigation links  return spacingValues;

Content sections (3):});

1. Untitled section: Some generic text...```

2. Content block: More text...

3. Section: Additional content...## Expected Accuracy After Improvements

````

| Aspect | Current | Target | Impact |

### After|--------|---------|--------|--------|

```| Colors | 20-30% | 80-90% | **+60%** 🎨 |

# Website Analysis for: "Microsoft Learn: Build skills..."| Typography | 20-30% | 75-85% | **+55%** 📝 |

URL: https://learn.microsoft.com| Spacing | 10-20% | 70-80% | **+60%** 📏 |

| Overall | 50-60% | **85-90%** | **+30%** 🚀 |

## Overall Structure

- Header: Microsoft Ignite November 17–21, 2025...
- Navigation (25 links): Previous, Documentation, All product documentation...
- Main Content: 15 distinct sections
- Footer: Present with links and information

## Content Sections (15 identified)

### 1. HERO - "Microsoft Ignite"
Purpose: Primary landing section with main value proposition
Content: Microsoft Ignite November 17–21, 2025...
Components: 2 buttons, 1 links
Call-to-Actions: "Register now", "Dismiss alert"

### 2. FEATURES
Purpose: Showcase key features or benefits
Content: Free to join. Request to attend. Microsoft AI Tour...
Components: 1 links
...
```

## Impact

1. **Accuracy**: Wireframes now better reflect the actual website structure
2. **Context**: AI understands the purpose of each section (hero, features, CTA)
3. **Layout**: Appropriate layouts are used for different section types
4. **Content**: More realistic placeholders based on actual content
5. **Hierarchy**: Visual prominence and structure are preserved

## How to Test

```bash
# Run the test script
node test-enhanced-analyzer.js

# Or test in the UI
1. Open Designetica app
2. Enter: "Create a wireframe based on https://learn.microsoft.com"
3. Compare generated wireframe with actual site
```

## Next Steps (Optional Enhancements)

1. **Color Extraction**: Use actual colors from the website
2. **Image Placeholders**: Include representative images
3. **Typography Matching**: Use similar font sizes/styles
4. **Responsive Layout**: Capture mobile vs desktop layouts
5. **Interactive Elements**: Detect dropdowns, accordions, tabs
6. **Content Length**: Match text length to actual content

## Files Modified

1. `backend/websiteAnalyzer/index.js` - Enhanced section detection, visual hierarchy, prompt generation
2. `backend/generateWireframe/index.js` - Improved prompt integration
3. `test-enhanced-analyzer.js` - New test script to verify improvements

## Conclusion

The wireframe generation from URLs is now significantly more accurate, with proper section type detection, visual hierarchy analysis, and enhanced prompt generation. Users should see wireframes that much better reflect the structure and content of the target website.
