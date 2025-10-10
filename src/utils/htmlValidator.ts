/**
 * HTML Validator and Auto-Corrector
 *
 * Comprehensive HTML validation and automatic correction utility
 * to prevent malformed HTML from breaking the wireframe display.
 *
 * Features:
 * - Auto-fixes missing < or > brackets
 * - Repairs broken tags (style>, div>, etc.)
 * - Closes unclosed tags
 * - Validates and sanitizes HTML
 * - Provides detailed error reporting
 */

interface ValidationResult {
  isValid: boolean;
  correctedHtml: string;
  errors: string[];
  warnings: string[];
  autoFixesApplied: string[];
}

/**
 * Comprehensive HTML validation and auto-correction
 */
export function validateAndFixHtml(rawHtml: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const autoFixesApplied: string[] = [];

  if (!rawHtml || typeof rawHtml !== "string") {
    errors.push("Invalid input: HTML must be a non-empty string");
    return {
      isValid: false,
      correctedHtml: '<div class="error">Invalid HTML input</div>',
      errors,
      warnings,
      autoFixesApplied,
    };
  }

  let correctedHtml = rawHtml.trim();

  // Step 0: Aggressive fix for style tags at the very beginning
  if (correctedHtml.startsWith("style>")) {
    correctedHtml = "<" + correctedHtml;
    autoFixesApplied.push("Fixed missing < at start of style tag");
  }

  // Step 1: Fix common tag syntax errors
  const tagFixes = [
    // Fix broken opening tags (missing <)
    {
      pattern:
        /(\s|^)(style|div|span|p|h1|h2|h3|h4|h5|h6|button|a|ul|ol|li|nav|header|footer|section|article|main|aside|form|input|textarea|select|label|table|tr|td|th|thead|tbody|img|br|hr)>/gi,
      replacement: "<$2>",
      message: "Fixed missing < in opening tag",
    },
    // Fix broken closing tags (missing <)
    {
      pattern:
        /(\s|^)\/(style|div|span|p|h1|h2|h3|h4|h5|h6|button|a|ul|ol|li|nav|header|footer|section|article|main|aside|form|table|tr|td|th|thead|tbody)>/gi,
      replacement: "</$2>",
      message: "Fixed missing < in closing tag",
    },
    // Fix broken closing tags (missing >)
    {
      pattern:
        /<\/(style|div|span|p|h1|h2|h3|h4|h5|h6|button|a|ul|ol|li|nav|header|footer|section|article|main|aside|form|table|tr|td|th|thead|tbody)(\s|$)/gi,
      replacement: "</$1>",
      message: "Fixed missing > in closing tag",
    },
    // Fix double closing brackets
    {
      pattern: />\s*>/g,
      replacement: ">",
      message: "Removed duplicate > brackets",
    },
    // Fix double opening brackets
    {
      pattern: /<\s*</g,
      replacement: "<",
      message: "Removed duplicate < brackets",
    },
  ];

  tagFixes.forEach((fix) => {
    const beforeFix = correctedHtml;
    correctedHtml = correctedHtml.replace(fix.pattern, fix.replacement);
    if (beforeFix !== correctedHtml) {
      autoFixesApplied.push(fix.message);
    }
  });

  // Step 1.5: Fix DOCTYPE declarations
  if (correctedHtml.includes("!DOCTYPE")) {
    const beforeFix = correctedHtml;
    // Fix missing < in DOCTYPE - multiple patterns
    correctedHtml = correctedHtml
      .replace(/^!DOCTYPE\s+html>/i, "<!DOCTYPE html>")
      .replace(/(\s|^)!DOCTYPE\s+html>/gi, "<!DOCTYPE html>");
    if (beforeFix !== correctedHtml) {
      autoFixesApplied.push("Fixed DOCTYPE declaration");
    }
  }

  // Step 2: Remove stray brackets at start/end
  const strayBracketsStart = correctedHtml.match(/^[<>]+/);
  if (strayBracketsStart) {
    correctedHtml = correctedHtml.replace(/^[<>]+/, "");
    autoFixesApplied.push("Removed stray brackets at start");
  }

  const strayBracketsEnd = correctedHtml.match(/[<>]+$/);
  if (strayBracketsEnd) {
    correctedHtml = correctedHtml.replace(/[<>]+$/, "");
    autoFixesApplied.push("Removed stray brackets at end");
  }

  // Step 3: Fix incomplete tags at end of string
  const incompleteOpenTag = correctedHtml.match(/<([a-z][a-z0-9]*)\s*$/i);
  if (incompleteOpenTag) {
    correctedHtml = correctedHtml.replace(/<([a-z][a-z0-9]*)\s*$/i, "<$1>");
    autoFixesApplied.push(
      `Fixed incomplete opening tag: <${incompleteOpenTag[1]}>`
    );
  }

  const incompleteCloseTag = correctedHtml.match(/<\/([a-z][a-z0-9]*)\s*$/i);
  if (incompleteCloseTag) {
    correctedHtml = correctedHtml.replace(/<\/([a-z][a-z0-9]*)\s*$/i, "</$1>");
    autoFixesApplied.push(
      `Fixed incomplete closing tag: </${incompleteCloseTag[1]}>`
    );
  }

  // Step 4: Validate with DOMParser
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(correctedHtml, "text/html");

    // Check for parser errors
    const parserError = doc.querySelector("parsererror");
    if (parserError) {
      errors.push("HTML parsing error detected");
      warnings.push(parserError.textContent || "Unknown parsing error");

      // Try to recover by wrapping in a div
      correctedHtml = `<div>${correctedHtml}</div>`;
      const retryDoc = parser.parseFromString(correctedHtml, "text/html");
      const retryError = retryDoc.querySelector("parsererror");

      if (retryError) {
        errors.push("Unable to auto-fix HTML after wrapping");
      } else {
        autoFixesApplied.push("Wrapped content in div to fix parsing errors");
        // Extract the corrected HTML from the retry
        correctedHtml = retryDoc.body?.innerHTML || correctedHtml;
      }
    } else {
      // Use browser's auto-correction by extracting from parsed document
      const browserCorrected = doc.body?.innerHTML || correctedHtml;
      if (browserCorrected !== correctedHtml) {
        autoFixesApplied.push("Applied browser auto-corrections");
        correctedHtml = browserCorrected;
      }
    }
  } catch (error) {
    errors.push(
      `DOM parsing exception: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  // Step 5: Final validation checks
  const unclosedTags = findUnclosedTags(correctedHtml);
  if (unclosedTags.length > 0) {
    warnings.push(`Potentially unclosed tags: ${unclosedTags.join(", ")}`);
  }

  const isValid = errors.length === 0;

  // Log results in development
  if (autoFixesApplied.length > 0) {
    console.log("🔧 HTML Auto-fixes applied:", autoFixesApplied);
  }
  if (warnings.length > 0) {
    console.warn("⚠️ HTML Warnings:", warnings);
  }
  if (errors.length > 0) {
    console.error("❌ HTML Errors:", errors);
  }

  return {
    isValid,
    correctedHtml,
    errors,
    warnings,
    autoFixesApplied,
  };
}

/**
 * Find potentially unclosed tags (basic check)
 */
function findUnclosedTags(html: string): string[] {
  const unclosed: string[] = [];
  const selfClosingTags = ["img", "br", "hr", "input", "meta", "link"];

  // Extract all opening and closing tags
  const openingTags = html.match(/<([a-z][a-z0-9]*)[^>]*(?<!\/)\>/gi) || [];
  const closingTags = html.match(/<\/([a-z][a-z0-9]*)>/gi) || [];

  const openCount: { [key: string]: number } = {};

  openingTags.forEach((tag) => {
    const tagName = tag.match(/<([a-z][a-z0-9]*)/i)?.[1]?.toLowerCase();
    if (tagName && !selfClosingTags.includes(tagName)) {
      openCount[tagName] = (openCount[tagName] || 0) + 1;
    }
  });

  closingTags.forEach((tag) => {
    const tagName = tag.match(/<\/([a-z][a-z0-9]*)/i)?.[1]?.toLowerCase();
    if (tagName) {
      openCount[tagName] = (openCount[tagName] || 0) - 1;
    }
  });

  Object.keys(openCount).forEach((tagName) => {
    if (openCount[tagName] > 0) {
      unclosed.push(tagName);
    }
  });

  return unclosed;
}

/**
 * Quick validation check without full correction
 */
export function isValidHtml(html: string): boolean {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return !doc.querySelector("parsererror");
  } catch {
    return false;
  }
}

/**
 * Extract and validate CSS from HTML
 */
export function extractAndValidateCss(html: string): {
  css: string;
  isValid: boolean;
} {
  const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);

  if (!styleMatches) {
    return { css: "", isValid: true };
  }

  let css = "";
  let isValid = true;

  styleMatches.forEach((styleBlock) => {
    const content = styleBlock.replace(/<\/?style[^>]*>/gi, "");
    css += content + "\n";

    // Basic CSS validation
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;

    if (openBraces !== closeBraces) {
      console.warn("⚠️ Mismatched braces in CSS block");
      isValid = false;
    }
  });

  return { css, isValid };
}
