# URL-to-Wireframe Accuracy Improvement Plan

## Priority 1: Visual Design Extraction (High Impact)

### 1.1 Color Extraction
- [ ] Use `page.evaluate()` to get computed styles
- [ ] Extract actual background colors from elements
- [ ] Sample primary/secondary/accent colors from major sections
- [ ] Calculate color palette from most-used colors

### 1.2 Typography Analysis
- [ ] Extract actual font-family from computed styles
- [ ] Capture font sizes for h1, h2, h3, body text
- [ ] Get font weights and line heights
- [ ] Identify web fonts (Google Fonts, Adobe Fonts, etc.)

### 1.3 Spacing & Sizing
- [ ] Extract margins/padding from major sections
- [ ] Capture element dimensions (width, height)
- [ ] Identify spacing patterns (8px grid, 4px grid, etc.)
- [ ] Get container max-widths

## Priority 2: Layout Accuracy (Medium Impact)

### 2.1 CSS Grid/Flexbox Detection
- [ ] Detect display: grid usage
- [ ] Capture grid-template-columns patterns
- [ ] Identify flexbox layouts and justify-content
- [ ] Get gap values for modern layouts

### 2.2 Responsive Design
- [ ] Capture mobile viewport layout
- [ ] Identify breakpoint patterns
- [ ] Detect hamburger menus
- [ ] Analyze responsive image handling

## Priority 3: Screenshot Comparison (Medium Impact)

### 3.1 Re-enable Screenshots
- [ ] Optimize screenshot generation
- [ ] Add side-by-side comparison view
- [ ] Highlight structural differences
- [ ] Visual diff tool integration

## Priority 4: Modern Web Support (Low-Medium Impact)

### 4.1 SPA Handling
- [ ] Better waiting for client-side rendering
- [ ] Detect React/Vue/Angular patterns
- [ ] Wait for AJAX completion
- [ ] Handle infinite scroll

### 4.2 Advanced Features
- [ ] Capture CSS animations
- [ ] Detect sticky headers
- [ ] Identify modal patterns
- [ ] Recognize carousels/sliders

## Implementation Code Examples

### Color Extraction (page.evaluate)
```javascript
const colors = await page.evaluate(() => {
  const elements = document.querySelectorAll('header, nav, main, section, footer, button, .btn, a');
  const colorMap = new Map();
  
  elements.forEach(el => {
    const styles = window.getComputedStyle(el);
    const bg = styles.backgroundColor;
    const color = styles.color;
    
    colorMap.set(bg, (colorMap.get(bg) || 0) + 1);
    colorMap.set(color, (colorMap.get(color) || 0) + 1);
  });
  
  return Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([color]) => color);
});
```

### Typography Extraction
```javascript
const typography = await page.evaluate(() => {
  const headings = {
    h1: window.getComputedStyle(document.querySelector('h1')),
    h2: window.getComputedStyle(document.querySelector('h2')),
    body: window.getComputedStyle(document.body)
  };
  
  return {
    h1: headings.h1.fontFamily + ' ' + headings.h1.fontSize,
    h2: headings.h2.fontFamily + ' ' + headings.h2.fontSize,
    body: headings.body.fontFamily + ' ' + headings.body.fontSize
  };
});
```

### Spacing Extraction
```javascript
const spacing = await page.evaluate(() => {
  const sections = document.querySelectorAll('section, main, .section');
  const spacingValues = [];
  
  sections.forEach(el => {
    const styles = window.getComputedStyle(el);
    spacingValues.push({
      margin: styles.margin,
      padding: styles.padding,
      gap: styles.gap
    });
  });
  
  return spacingValues;
});
```

## Expected Accuracy After Improvements

| Aspect | Current | Target | Impact |
|--------|---------|--------|--------|
| Colors | 20-30% | 80-90% | **+60%** 🎨 |
| Typography | 20-30% | 75-85% | **+55%** 📝 |
| Spacing | 10-20% | 70-80% | **+60%** 📏 |
| Overall | 50-60% | **85-90%** | **+30%** 🚀 |

