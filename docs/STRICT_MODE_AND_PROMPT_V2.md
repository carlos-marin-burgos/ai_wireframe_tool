# Wireframe Generation Strict Mode & Prompt v2

_Last updated: September 19, 2025_

## Overview

This document explains the deterministic Strict Mode scaffold, the structured Prompt v2 system, backward compatibility (legacy `prompt` field), and how website analysis inputs alter generation behavior.

## Motivation

| Problem                                              | Solution                                                                          |
| ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| Hallucinated structure & inconsistent section counts | Deterministic scaffold (Strict Mode) or structural contract injection (Prompt v2) |
| Legacy clients using `prompt` field                  | Backward-compatible alias → `description` (preferred)                             |
| Unstable accessibility & nesting                     | Post-processing fixes (readability + container nesting)                           |
| Need telemetry on evolution                          | `metadata.promptVersion = "v2"`                                                   |

## Modes of Generation

### 1. Strict Mode (Deterministic)

Triggered when the incoming `description` contains `[strict]` token (removed before further processing) OR client sets `strictMode: true` explicitly.

Characteristics:

- Bypasses AI creative expansion for layout scaffolding.
- Uses `websiteAnalysis` (if provided) to derive ordered sections and navigation.
- Builds minimal, semantically structured HTML scaffold with:
  - `<main data-structure="strict">`
  - `data-section-index` attributes (0-based)
  - Predictable IDs: `section-0`, `section-1`, ...
  - Accessible landmarks (nav, main, footer).
- Adds metadata: `{ strictMode: true, promptVersion: 'v2' }`.
- Still passes the scaffold through accessibility & container fixes.

Intended Use Cases:

- Pixel/structure alignment validation.
- Regression tests / diffing stable DOM shapes.
- Bootstrapping quick editing flows before creative fill.

### 2. Standard AI Mode (Structured Prompt v2)

Used when `strictMode` is false (default). The model receives the structured Prompt v2 which blends user intent (`description`) + optional extracted `websiteAnalysis` contract.

Enhancements in Prompt v2:

- SYSTEM PREAMBLE: Role + non-goal clarity.
- HARD RULES: Enumerated, short, testable constraints (IDs naming, absence of extra wrappers, limit of libraries, alt text requirements, no external network calls, etc.).
- STRUCTURAL CONTRACT: Derived from `websiteAnalysis.layout.sections` & navigation. Each section is enumerated with canonical index and expected semantic intent.
- OUTPUT FORMAT: Single self-contained HTML document only (no markdown, no explanation).
- Metadata version tagging (`promptVersion`).

Fallback Behavior:

- If `websiteAnalysis` absent or invalid, structural contract block is omitted but rules persist.

## Request Payload Schema

```jsonc
POST /api/generate-wireframe
{
  "description": "Dashboard with KPI cards and activity feed", // or use legacy 'prompt'
  "strictMode": false,                                        // optional override
  "websiteAnalysis": { /* sanitized analysis object */ }       // optional
}
```

Alias Logic:

- If `description` missing and `prompt` present, backend assigns `description = prompt` and logs a deprecation warning (server-side).

## Response Outline

```jsonc
{
  "success": true,
  "html": "<main ...>...</main>",
  "metadata": {
    "strictMode": false,
    "promptVersion": "v2"
    // Additional runtime details (timings, section counts, etc.)
  }
}
```

## Strict Mode Detection (Frontend)

Frontend hook strips `[strict]` token case-insensitively and sets `strictMode = true`. Example input:

```
"[strict] Marketing landing hero + features grid"
```

Becomes:

```
Description sent: "Marketing landing hero + features grid"
strictMode: true
```

## Website Analysis Contract

When provided, the backend extracts:

- `layout.sections`: Ordered list with names / roles.
- `navigation.primary` items (if present).
  The contract enforces that the model:
- Must create exactly that number of top-level primary sections inside `<main>`.
- Must preserve order and semantic intent.
- Must NOT introduce additional root siblings beyond allowed landmarks.

If the AI deviates, downstream validators (future extension) can diff expected vs produced.

## Accessibility & Post-Processing

After HTML generation (strict or AI):

1. Button readability enhancement (contrast & text normalization).
2. Container nesting fix (`containerNestingFix`) to prevent invalid DOM hierarchies.
   All transformations are in-place before returning the final HTML.

## Versioning & Observability

Field `metadata.promptVersion` allows clients to branch logic or collect analytics. Current value: `"v2"`.
Plan for future versions:

- Introduce `v3` with token limits, variant classes standardization, or component taxonomy anchors.
- Maintain compatibility for at least one version window (v2 still accepted for N releases after v3 rolls out).

## Migration Guide (prompt → description)

| Client State             | Action                                                                |
| ------------------------ | --------------------------------------------------------------------- |
| Still sending `prompt`   | Start sending `description` (no functional change).                   |
| Needs strict scaffolds   | Add `[strict]` token at beginning or set `strictMode: true`.          |
| Unsure if server updated | Inspect `metadata.promptVersion`; if missing, server may be outdated. |

## Testing Examples

### Strict Mode Example

```bash
curl -s -X POST http://localhost:7071/api/generate-wireframe \
  -H 'Content-Type: application/json' \
  -d '{
    "description": "[strict] Marketing landing hero + features grid",
    "websiteAnalysis": { "layout": { "sections": [ {"name": "Hero"}, {"name": "Features"} ] } }
  }' | jq '.metadata.strictMode, (.html | length)'
```

Output should show `true` and stable length (± small variation from fixes).

### Standard Mode Example

```bash
curl -s -X POST http://localhost:7071/api/generate-wireframe \
  -H 'Content-Type: application/json' \
  -d '{
    "description": "Data analytics dashboard with KPI strip, trend chart, and activity feed"
  }' | jq '.metadata.strictMode, .metadata.promptVersion'
```

Should output `false` and `"v2"`.

### Legacy Alias Test

```bash
curl -s -X POST http://localhost:7071/api/generate-wireframe \
  -H 'Content-Type: application/json' \
  -d '{
    "prompt": "Compact email client: folder list + message preview + reading pane"
  }' | jq '.success, .metadata.promptVersion'
```

Should still succeed with `"v2"`.

## Edge Cases & Safeguards

| Scenario                                     | Handling                                                          |
| -------------------------------------------- | ----------------------------------------------------------------- |
| Empty description after stripping `[strict]` | Returns validation error: "Description is required".              |
| Malformed `websiteAnalysis` (non-object)     | Ignored; structural contract omitted.                             |
| Extra unknown fields in payload              | Ignored (non-breaking).                                           |
| Attempted external script/link injection     | Prompt rules forbid; rely on model compliance + future sanitizer. |

## Future Enhancements (Proposed)

- Add JSON schema validation for `websiteAnalysis` & expose validation errors in metadata.
- Provide diff endpoint `/api/validate-structure` comparing generated DOM vs contract.
- Expand accessibility pass: landmark uniqueness, heading order report.
- Introduce `promptVersion` negotiation via request header (e.g., `X-Prompt-Version: v2`).

## Quick Reference

| Feature                       | Flag / Indicator                                         |
| ----------------------------- | -------------------------------------------------------- |
| Strict deterministic scaffold | `strictMode: true` or `[strict]` token                   |
| Prompt version                | `metadata.promptVersion`                                 |
| Legacy prompt support         | Provide `prompt` (deprecated)                            |
| Structural contract active    | Presence of `websiteAnalysis.layout.sections` in request |

---

**Contact / Ownership:** Backend AI Generation Module

Submit improvements or questions via issues referencing: `docs/STRICT_MODE_AND_PROMPT_V2.md`.
