# HTML Validation & Auto-Correction System

## Overview

This system ensures that all HTML wireframes are validated and automatically corrected before being displayed, preventing broken HTML from reaching the user interface.

## Architecture

### Three-Layer Validation

1. **API Layer** (`useWireframeGeneration.ts`)

   - Validates HTML immediately after receiving from backend
   - First line of defense against malformed API responses
   - Logs all validation issues with request IDs for debugging

2. **Component Layer** (`StaticWireframe.tsx`)

   - Validates HTML before rendering
   - Catches any issues that might have slipped through
   - Applies additional browser-based corrections

3. **Utility Layer** (`htmlValidator.ts`)
   - Core validation and correction logic
   - Reusable across the application
   - Comprehensive error reporting

## Features

### Auto-Fixes Applied

✅ **Missing Brackets**

- `style>` → `<style>`
- `div>` → `<div>`
- `/button>` → `</button>`

✅ **Incomplete Tags**

- `<button` → `<button>`
- `</div` → `</div>`

✅ **Stray Characters**

- `>>>content` → `content`
- `<<<content` → `content`

✅ **Duplicate Brackets**

- `>>` → `>`
- `<<` → `<`

✅ **Unclosed Tags**

- Browser DOMParser auto-closes tags
- Wraps content in div if needed

### Validation Results

Each validation returns:

```typescript
{
  isValid: boolean;              // Overall validation status
  correctedHtml: string;         // Auto-corrected HTML
  errors: string[];              // Critical errors found
  warnings: string[];            // Non-critical issues
  autoFixesApplied: string[];    // List of fixes applied
}
```

## Usage Examples

### Basic Validation

```typescript
import { validateAndFixHtml } from "../utils/htmlValidator";

const result = validateAndFixHtml(rawHtml);
if (!result.isValid) {
  console.error("Validation errors:", result.errors);
}
// Use result.correctedHtml instead of rawHtml
```

### Quick Check

```typescript
import { isValidHtml } from "../utils/htmlValidator";

if (!isValidHtml(html)) {
  // Handle invalid HTML
}
```

### CSS Extraction

```typescript
import { extractAndValidateCss } from "../utils/htmlValidator";

const { css, isValid } = extractAndValidateCss(html);
```

## Logging

All validation events are logged with clear prefixes:

- `🔍` Validation starting
- `🔧` Auto-fixes applied
- `⚠️` Warnings found
- `❌` Errors detected
- `✅` Validation successful

## Common Issues Fixed

### Issue 1: Missing Opening Bracket

**Before:**

```html
style>.my-class { color: red; }</style>
```

**After:**

```html
<style>
  .my-class {
    color: red;
  }
</style>
```

### Issue 2: Incomplete Tags

**Before:**

```html
<div>Content<div
```

**After:**

```html
<div>Content</div>
```

### Issue 3: Stray Brackets

**Before:**

```html
>
<div>Content</div>
>
```

**After:**

```html
<div>Content</div>
```

## Performance

- Minimal overhead (~5-10ms for typical wireframes)
- Caches validation results where appropriate
- Only logs in development mode

## Testing

Test cases covered:

- ✅ Valid HTML (no changes)
- ✅ Missing < bracket
- ✅ Missing > bracket
- ✅ Incomplete opening tags
- ✅ Incomplete closing tags
- ✅ Duplicate brackets
- ✅ Stray characters
- ✅ Unclosed tags
- ✅ Mixed issues
- ✅ Empty/null input
- ✅ Complex nested structures

## Future Enhancements

- [ ] HTML beautification/formatting
- [ ] Accessibility validation
- [ ] SEO validation
- [ ] Performance hints
- [ ] Custom validation rules
- [ ] Validation metrics dashboard

## Troubleshooting

### HTML still broken after validation?

1. Check browser console for validation logs
2. Look for `🔧` auto-fix messages
3. Review the `errors` and `warnings` arrays
4. File a bug report with the problematic HTML

### Performance issues?

1. Check HTML size (>1MB may be slow)
2. Review number of auto-fixes applied
3. Consider simplifying HTML structure

### False positives?

1. Check if HTML is intentionally non-standard
2. Review validation rules in `htmlValidator.ts`
3. Add exception handling if needed

## Best Practices

1. **Always use validated HTML**

   - Never bypass the validation system
   - Trust the auto-corrections

2. **Monitor logs in development**

   - Watch for frequent auto-fixes
   - Address root causes in backend

3. **Test edge cases**

   - Empty content
   - Very large HTML
   - Nested structures

4. **Report issues**
   - Log any HTML that breaks despite validation
   - Help improve the system

## Integration Checklist

When adding new HTML sources:

- [ ] Import `validateAndFixHtml` utility
- [ ] Validate HTML immediately after receiving
- [ ] Log validation results with context
- [ ] Use corrected HTML instead of raw
- [ ] Handle validation errors gracefully
- [ ] Test with malformed HTML samples

## Support

For issues or questions:

1. Check console logs for validation details
2. Review this documentation
3. Search for similar issues in codebase
4. Contact development team with:
   - Problematic HTML sample
   - Console logs
   - Expected vs actual behavior

---

**Last Updated:** October 9, 2025  
**Version:** 1.0  
**Maintainer:** Development Team
