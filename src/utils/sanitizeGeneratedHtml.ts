// Utility to sanitize AI generated HTML by removing narrative wrappers, full-document scaffolding, and explanation sections.
export interface SanitizedResult {
  html: string;
  styles: string; // concatenated <style> blocks preserved
  links?: string[]; // array of <link rel="stylesheet" href="..."> to optionally inline or include
  inlinedStyles?: string; // CSS content from external links (when inlined)
}

// Helper function to fetch and inline external CSS
async function inlineExternalCSS(links: string[]): Promise<string> {
  const inlinedCSS: string[] = [];

  for (const link of links) {
    try {
      // Skip non-HTTP links or malformed URLs
      if (
        !link ||
        (!link.startsWith("http://") &&
          !link.startsWith("https://") &&
          !link.startsWith("/"))
      ) {
        continue;
      }

      // Convert relative URLs to absolute
      let absoluteUrl = link;
      if (link.startsWith("/")) {
        absoluteUrl =
          (typeof window !== "undefined" ? window.location.origin : "") + link;
      }

      // Skip if we can't form a valid URL
      if (!absoluteUrl.startsWith("http")) {
        continue;
      }

      console.log(`🔗 Attempting to fetch CSS from: ${absoluteUrl}`);

      const response = await fetch(absoluteUrl, {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "text/css,*/*;q=0.1",
        },
      });

      if (
        response.ok &&
        response.headers.get("content-type")?.includes("css")
      ) {
        const cssContent = await response.text();
        if (cssContent.trim()) {
          inlinedCSS.push(`/* Inlined from ${absoluteUrl} */\n${cssContent}`);
          console.log(
            `✅ Successfully inlined CSS from: ${absoluteUrl} (${cssContent.length} chars)`
          );
        }
      } else {
        console.warn(
          `⚠️ Failed to fetch CSS from ${absoluteUrl}: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.warn(`❌ Error fetching CSS from ${link}:`, error);
      // Continue with other links even if one fails
    }
  }

  return inlinedCSS.join("\n\n");
}

export function sanitizeGeneratedHtml(input?: string): string;
export function sanitizeGeneratedHtml(
  input: string | undefined,
  returnObject: true
): SanitizedResult;
export function sanitizeGeneratedHtml(
  input?: string,
  returnObject?: boolean
): any {
  if (!input) return returnObject ? { html: "", styles: "", links: [] } : "";
  const original = String(input);
  let html = original;
  const collectedStyles: string[] = [];
  const collectedLinks: string[] = [];

  // 1. Pre-capture ALL <style> blocks anywhere (head or body) before any slicing
  try {
    const styleMatches = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
      .map((m) => m[1].trim())
      .filter(Boolean);
    if (styleMatches.length) {
      collectedStyles.push(...styleMatches);
    }
    // Capture <link rel="stylesheet" href="..."> tags (keep href)
    const linkMatches = [
      ...html.matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi),
    ];
    for (const tag of linkMatches) {
      const hrefMatch = tag[0].match(/href=["']([^"']+)["']/i);
      if (hrefMatch) collectedLinks.push(hrefMatch[1]);
    }
  } catch (_) {
    /* ignore */
  }

  try {
    // Normalize newlines
    html = html.replace(/\r\n?/g, "\n");

    // Remove code fences / language hints
    html = html
      .replace(/```(?:html|HTML)?/g, "")
      .replace(/'''(?:html|HTML)?/g, "");

    // Trim surrounding quotes/backticks
    html = html.replace(/^['`\s]+|['`\s]+$/g, "").trim();

    // Remove leading narrative phrases before first structural tag
    const narrativePatterns = [
      /here['']?s a complete html document[^<]*?/i,
      /here is a complete html document[^<]*?/i,
      /this is a complete html document[^<]*?/i,
      /below is (?:a|an) complete html document[^<]*?/i,
      /the following (?:is|shows) (?:a|an) complete html document[^<]*?/i,
    ];
    for (const pat of narrativePatterns) {
      if (pat.test(html)) {
        // Slice from first meaningful tag after match
        const idx = html.search(
          /<(?:div|header|main|section|nav|article|aside|form|table|ul|ol|footer)\b/i
        );
        if (idx !== -1) {
          html = html.slice(idx);
        }
        break;
      }
    }

    // If full document present, extract head styles then body (we already globally captured styles above, but also gather head-only ones for completeness)
    if (/<!DOCTYPE html>/i.test(html) || /<html[\s>]/i.test(html)) {
      // Capture <style> blocks in head
      const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
      if (headMatch) {
        const headContent = headMatch[1];
        const styleBlocks = [
          ...headContent.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi),
        ].map((m) => m[1].trim());
        if (styleBlocks.length) collectedStyles.push(...styleBlocks);
        const headLinks = [
          ...headContent.matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi),
        ];
        for (const tag of headLinks) {
          const hrefMatch = tag[0].match(/href=["']([^"']+)["']/i);
          if (hrefMatch) collectedLinks.push(hrefMatch[1]);
        }
      }
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        html = bodyMatch[1];
      } else {
        html = html
          .replace(/<head>[\s\S]*?<\/head>/gi, "")
          .replace(/<!DOCTYPE[^>]*>/gi, "")
          .replace(/<\/:?html[^>]*>/gi, "")
          .replace(/<body[^>]*>/gi, "")
          .replace(/<\/body>/gi, "");
      }
    }

    // Remove explanation sections
    html = html.replace(/###?\s*Explanation:?[\s\S]*$/i, "");

    // Remove markdown list artifacts (lines starting with - or *) that have no HTML tags
    html = html.replace(/^(?:[-*])\s+[^<\n]+$/gim, "");

    // Remove inline JS blocks
    html = html.replace(/<script[\s\S]*?<\/script>/gi, "");

    // Remove stray DOCTYPE / html / body tags leftover
    html = html
      .replace(/<!DOCTYPE[^>]*>/gi, "")
      .replace(/<\/?html[^>]*>/gi, "")
      .replace(/<\/?body[^>]*>/gi, "");

    html = html.trim();

    // If still mostly narrative (no tags), wrap
    if (
      !/<(div|header|main|section|article|nav|form|table|ul|ol|footer)\b/i.test(
        html
      )
    ) {
      html = `<div class="generated-page" style="padding:24px;">${html}</div>`;
    }

    // Deduplicate styles (exact matches) to reduce iframe weight
    const uniqueStyles = Array.from(new Set(collectedStyles));
    const uniqueLinks = Array.from(new Set(collectedLinks));

    // Post-process combined styles for common AI issues (namespacing + malformed tokens)
    let combinedStyles = uniqueStyles.join("\n");

    // Detect namespaced pattern .wireframe-content ... but missing wrapper in HTML
    const hasNamespace = /\.wireframe-content\s/.test(combinedStyles);
    const hasWrapperInHtml =
      /class=["']wireframe-content["']/.test(html) ||
      /<div[^>]+wireframe-content/.test(html);
    let didAutoWrap = false;
    if (hasNamespace && !hasWrapperInHtml) {
      // Wrap entire content to allow namespaced rules to apply
      html = `<div class="wireframe-content">${html}</div>`;
      didAutoWrap = true;
    }

    // Fix invalid selectors produced like '.wireframe-content body' (body can't be descendant)
    combinedStyles = combinedStyles.replace(
      /\.wireframe-content\s+body\b/g,
      ".wireframe-content"
    );

    // Remove stray namespace before comment markers or @media
    combinedStyles = combinedStyles.replace(
      /\.wireframe-content\s*\/\*/g,
      "/*"
    );
    combinedStyles = combinedStyles.replace(
      /\.wireframe-content\s*@media/g,
      "@media"
    );

    // If we auto-wrapped the HTML, adapt selectors that target top-level html/body
    // so they still apply to the wrapped content. This converts simple selectors
    // like `body { ... }`, `html { ... }`, and comma-separated uses like
    // `html, body { ... }` into `.wireframe-content { ... }` or prefixed variants.
    if (didAutoWrap) {
      try {
        // Replace leading or grouped selectors 'html' or 'body' with '.wireframe-content'
        combinedStyles = combinedStyles.replace(
          /(^|,)\s*(?:html|body)\b/gi,
          "$1 .wireframe-content"
        );
        // Replace remaining standalone occurrences of 'html' or 'body' in selectors
        combinedStyles = combinedStyles.replace(
          /\b(?:html|body)\b/gi,
          ".wireframe-content"
        );
      } catch (_) {
        // ignore failures in replacement
      }
    }

    // If styles are entirely namespaced but we failed to wrap (edge), optionally strip namespace so something renders
    if (hasNamespace && !hasWrapperInHtml) {
      // Already wrapped above, but safety: ensure replaced variant isn't empty
      // Nothing additional needed here.
    }

    // If after cleanup we still have zero non-comment CSS, treat as empty
    const nonComment = combinedStyles.replace(/\/\*[\s\S]*?\*\//g, "").trim();
    if (!nonComment) combinedStyles = "";

    const cleaned = html.trim();
    if (returnObject) {
      return { html: cleaned, styles: combinedStyles, links: uniqueLinks };
    }
    return cleaned;
  } catch (e) {
    if (returnObject) return { html: original, styles: "", links: [] };
    return original;
  }
}

// Async version that can inline external CSS
export async function sanitizeGeneratedHtmlWithInlining(
  input: string | undefined,
  inlineCSS: boolean = true
): Promise<SanitizedResult> {
  const result = sanitizeGeneratedHtml(input, true);

  if (inlineCSS && result.links && result.links.length > 0) {
    try {
      const inlinedStyles = await inlineExternalCSS(result.links);
      return {
        ...result,
        inlinedStyles,
        styles: result.styles + (inlinedStyles ? "\n\n" + inlinedStyles : ""),
      };
    } catch (error) {
      console.warn("Failed to inline external CSS:", error);
      return result;
    }
  }

  return result;
}
