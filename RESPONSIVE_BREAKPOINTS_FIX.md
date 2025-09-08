# Responsive Breakpoints Fix

## Issue

The application was showing mobile/tablet layout at 1024px resolution because the CSS media queries were using `max-width: 991px` breakpoints, which caused 1024px screens to fall into the tablet category instead of desktop.

## Solution

Updated all media queries to use the following standardized breakpoints:

### New Breakpoint System

- **xs: 0-575px** - Mobile (portrait)
- **sm: 576-767px** - Mobile (landscape)
- **md: 768-991px** - Tablet
- **lg: 992-1199px** - Desktop (includes 1024px)
- **xl: 1200px+** - Large Desktop

### Key Changes Made

1. **Changed `max-width: 991px` to `max-width: 768px`** in:

   - `/src/components/SplitLayout.css`
   - `/src/components/MicrosoftLearnTopNav.css`
   - `/src/components/MicrosoftLearnLayout.css`
   - `/src/components/MicrosoftLearnHero.css`
   - `/src/components/MicrosoftLearnFooter.css`
   - `/src/components/CompactToolbar.css`
   - `/src/components/ComponentLibrary.css`
   - `/src/wireframe-styles.css`

2. **Result**: 1024px screens now get desktop layout instead of mobile/tablet layout

### Testing

Test the following resolutions to verify the fix:

- 1024px - Should show desktop layout
- 768px - Should show tablet layout
- 480px - Should show mobile layout

### Files Modified

- [x] SplitLayout.css
- [x] MicrosoftLearnTopNav.css
- [x] MicrosoftLearnLayout.css
- [x] MicrosoftLearnHero.css
- [x] MicrosoftLearnFooter.css
- [x] CompactToolbar.css
- [x] ComponentLibrary.css
- [x] wireframe-styles.css

### Standard Responsive CSS Pattern

```css
/* Desktop first approach */
.component {
  /* Desktop styles (992px+) */
}

@media (max-width: 1199px) {
  /* Large desktop adjustments */
}

@media (max-width: 991px) {
  /* Small desktop styles */
}

@media (max-width: 768px) {
  /* Tablet styles */
}

@media (max-width: 575px) {
  /* Mobile landscape */
}

@media (max-width: 479px) {
  /* Mobile portrait */
}
```

## Verification

After applying these changes, 1024px screens should display the desktop layout instead of mobile layout.
