/**
 * figmaWireframeImport Azure Function
 * POST /api/figma-wireframe-import
 * Body: { fileKey: string (optional, default main), nodeIds: string | string[], description?: string }
 * Env: FIGMA_TOKEN (personal access token)
 *
 * Fetches specified Figma nodes and converts their frame/layer structure into
 * low-fidelity placeholder HTML using existing wireframe classes.
 */

let fetch;
try {
  fetch = require("node-fetch");
} catch (e) {
  // Fallback for environments where node-fetch isn't available
  console.error("node-fetch not available, using fallback");
}

// Reuse palette + placeholder CSS injection (lightweight subset) if consumer wants raw fragment
function injectLowFidelityCSSFragment(html) {
  if (/Low-Fidelity Wireframe Styles/.test(html)) return html;
  const css = `\n<style>/* Low-Fidelity Wireframe Styles (Figma Lookscout colors) */
:root {
  --wf-neutral-50:#F9FBFD;--wf-neutral-600:#E6E9EC;--wf-neutral-700:#D1D9E2;--wf-neutral-900:#7C8B9D;--wf-blue-500:#437EF7;--wf-white:#FFFFFF;--wf-gray-50:#5F6D7E;
}
/* Base wireframe styling to match Figma Lookscout Low-Fi design */
body{background:var(--wf-neutral-50);margin:0;padding:20px;font-family:system-ui,-apple-system,sans-serif;}
.wireframe-component{background:var(--wf-white);border:1px solid var(--wf-neutral-600);border-radius:8px;padding:12px;margin:4px 0;box-shadow:0 1px 3px rgba(0,0,0,0.1);}
.wireframe-image{background:var(--wf-neutral-700);border:none;border-radius:4px;display:flex;align-items:center;justify-content:center;color:var(--wf-white);font-size:10px;min-height:40px;opacity:0.8;}
.text-placeholder-heading{background:var(--wf-neutral-700);height:12px;border-radius:3px;margin:8px 0;display:block;width:65%;border:none;}
.text-placeholder-line{background:var(--wf-neutral-700);height:8px;border-radius:3px;margin:6px 0;display:block;width:88%;border:none;}
.text-placeholder-button{background:var(--wf-blue-500);height:32px;width:80px;border-radius:6px;display:inline-block;border:none;}
.actual-text{font:12px/1.4 system-ui,Arial,sans-serif;color:var(--wf-neutral-900);opacity:0.9;}
.primary-button{background:var(--wf-blue-500);color:var(--wf-white);border-radius:6px;padding:8px 16px;border:none;font-size:14px;}
.secondary-button{background:var(--wf-neutral-600);color:var(--wf-neutral-900);border-radius:6px;padding:8px 16px;border:none;font-size:14px;}
/* Figma-specific component improvements */
.wireframe-component[data-node-type="component_set"] {border:2px dashed var(--wf-neutral-600);background:var(--wf-neutral-50);}
.wireframe-component[data-node-type="instance"] {border:1px solid var(--wf-neutral-600);background:var(--wf-white);}
.wireframe-component[data-node-type="frame"] {border:1px solid var(--wf-neutral-700);background:transparent;}
/* Remove harsh black borders - use subtle Figma-style borders */
*{box-sizing:border-box;}
div[class*="wireframe-"]:not(.wireframe-image){border-color:var(--wf-neutral-600) !important;}
</style>`;
  if (/<head>/i.test(html)) return html.replace(/<head>/i, `<head>${css}`);
  if (/<!DOCTYPE html>/i.test(html))
    return html.replace(/<!DOCTYPE html>/i, `<!DOCTYPE html>${css}`);
  return css + html;
}

async function fetchFigmaNodes(fileKey, nodeIds, token) {
  const idsParam = encodeURIComponent(nodeIds.join(","));
  const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${idsParam}`;
  const res = await fetch(url, { headers: { "X-Figma-Token": token } });
  if (!res.ok) throw new Error(`Figma API error ${res.status}`);
  return res.json();
}

function sanitizeName(name = "") {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

// Convert a Figma node tree (limited) into placeholder HTML blocks
function createNodeToWireframe({ preserveText, warnings }) {
  function nodeToWireframe(node, depth = 0) {
    if (!node) return "";
    const type = node.type;
    const name = sanitizeName(node.name || type);
    if (
      [
        "FRAME",
        "GROUP",
        "COMPONENT",
        "INSTANCE",
        "SECTION",
        "CANVAS",
        "COMPONENT_SET",
      ].includes(type)
    ) {
      const children = (node.children || [])
        .map((c) => nodeToWireframe(c, depth + 1))
        .join("\n");
      return `<div class=\"wireframe-component wireframe-${name}\" data-node-type=\"${type.toLowerCase()}\">${children}</div>`;
    }
    if (type === "TEXT") {
      const raw = (node.characters || "").replace(/\s+/g, " ").trim();
      const fontSize =
        node.style && node.style.fontSize ? node.style.fontSize : undefined;
      const isHeading = fontSize ? fontSize >= 18 : raw.length <= 14;
      if (!raw) return `<div class=\"text-placeholder-line\"></div>`;
      if (preserveText) {
        const safe = raw.replace(/[<>]/g, "");
        return `<div class=\"${
          isHeading ? "text-placeholder-heading" : "text-placeholder-line"
        } actual-text\">${safe}</div>`;
      }
      return `<div class=\"${
        isHeading ? "text-placeholder-heading" : "text-placeholder-line"
      }\"></div>`;
    }
    if (
      ["RECTANGLE", "ELLIPSE", "POLYGON", "VECTOR", "STAR", "LINE"].includes(
        type
      )
    ) {
      const box = node.absoluteBoundingBox || {};
      const { width, height } = box;
      if (
        type === "RECTANGLE" &&
        width &&
        height &&
        height < 30 &&
        width / height > 6
      ) {
        return `<div class=\"text-placeholder-line\"></div>`;
      }
      return `<div class=\"wireframe-image\">${type.toLowerCase()}</div>`;
    }
    if (depth === 0) warnings.push(`Unhandled top-level type: ${type}`);
    return "";
  }
  return nodeToWireframe;
}

function buildHTMLFromNodes(nodesMap, options) {
  const { preserveText, wrapRoot, warnings } = options;
  const nodeToWireframe = createNodeToWireframe({ preserveText, warnings });
  const bodyFragments = [];
  for (const nodeId in nodesMap) {
    const node = nodesMap[nodeId] && nodesMap[nodeId].document;
    if (!node) {
      warnings.push(`Node ${nodeId} missing document data`);
      continue;
    }
    bodyFragments.push(nodeToWireframe(node, 0));
  }
  let body = bodyFragments.join("\n");
  if (wrapRoot)
    body = `<div class=\"wireframe-component wireframe-import-root\">${body}</div>`;
  return `<!DOCTYPE html><html><head><meta charset=\"utf-8\"/><title>Figma Import Wireframe</title></head><body>${body}</body></html>`;
}

module.exports = async function (context, req) {
  try {
    if (req.method === "OPTIONS") {
      context.res = { status: 200 };
      return;
    }

    if (!fetch) {
      context.res = {
        status: 500,
        body: { error: "node-fetch not available" },
      };
      return;
    }

    const token = process.env.FIGMA_TOKEN || process.env.FIGMA_ACCESS_TOKEN;
    if (!token) {
      context.res = {
        status: 400,
        body: { error: "Missing FIGMA_TOKEN or FIGMA_ACCESS_TOKEN env var" },
      };
      return;
    }
    const fileKey = (req.body && req.body.fileKey) || "T8nJZBzUNgkeEOdV2IYQHd"; // default from user provided
    let nodeIds = req.body && req.body.nodeIds;
    const preserveText = Boolean(req.body && req.body.preserveText);
    const inlineCss = req.body && req.body.inlineCss !== false; // default true
    const wrapRoot = req.body && req.body.wrapRoot !== false; // default true
    if (!nodeIds) {
      context.res = {
        status: 400,
        body: { error: "nodeIds required (string or array)" },
      };
      return;
    }
    if (typeof nodeIds === "string") nodeIds = [nodeIds];
    try {
      const data = await fetchFigmaNodes(fileKey, nodeIds, token);
      if (!data.nodes) throw new Error("No nodes returned");
      const warnings = [];
      let html = buildHTMLFromNodes(data.nodes, {
        preserveText,
        wrapRoot,
        warnings,
      });
      if (inlineCss) html = injectLowFidelityCSSFragment(html);
      context.res = {
        status: 200,
        body: {
          success: true,
          fileKey,
          count: Object.keys(data.nodes).length,
          options: { preserveText, inlineCss, wrapRoot },
          warnings,
          html,
        },
      };
    } catch (err) {
      context.log.error("Figma import failed", err);
      context.res = { status: 500, body: { error: err.message } };
    }
  } catch (outerErr) {
    context.log.error("Function error", outerErr);
    context.res = { status: 500, body: { error: "Internal function error" } };
  }
};
