/**
 * Auto-generated API Types
 * Generated at: 2025-09-17T20:44:02.021Z
 * 
 * ⚠️ DO NOT EDIT MANUALLY - This file is auto-generated
 */

export const DISCOVERED_ENDPOINTS = [
  '/api/addFigmaComponent',
  '/api/ai-builder/{*segments}',
  '/api/analyze-image',
  '/api/analyzeUIImage',
  '/api/figma/atlas-hero/{nodeId:regex(^[0-9:-]+$)}',
  '/api/debugOAuth',
  '/api/direct-image-to-wireframe',
  '/api/figma/components',
  '/api/figma/import',
  '/api/figmaNodeImporter',
  '/api/figmaOAuthCallback',
  '/api/figmaOAuthDiagnostics',
  '/api/figmaOAuthStart',
  '/api/assets/{*path}',
  '/api/generate-suggestions',
  '/api/generate-wireframe',
  '/api/get-template',
  '/api/github/auth/callback',
  '/api/github/auth/start',
  '/api/health',
  '/api/openai-health',
  '/api/update-theme-colors',
  '/api/wireframeAnalyze',
] as const;

export type DiscoveredEndpoint = typeof DISCOVERED_ENDPOINTS[number];

export const AZURE_FUNCTIONS_INFO = [
  {
    "name": "addFigmaComponent",
    "route": "addFigmaComponent",
    "methods": [
      "post",
      "options"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: addFigmaComponent"
  },
  {
    "name": "aiBuilderIntegration",
    "route": "ai-builder/{*segments}",
    "methods": [
      "get",
      "post",
      "options"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: aiBuilderIntegration"
  },
  {
    "name": "analyzeImage",
    "route": "analyze-image",
    "methods": [
      "post",
      "options"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: analyzeImage"
  },
  {
    "name": "analyzeUIImage",
    "route": "analyzeUIImage",
    "methods": [
      "post",
      "options"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: analyzeUIImage"
  },
  {
    "name": "atlasComponents",
    "route": "figma/atlas-hero/{nodeId:regex(^[0-9:-]+$)}",
    "methods": [
      "get",
      "options"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: atlasComponents"
  },
  {
    "name": "debugOAuth",
    "route": "debugOAuth",
    "methods": [
      "get",
      "post",
      "options"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: debugOAuth"
  },
  {
    "name": "directImageToWireframe",
    "route": "direct-image-to-wireframe",
    "methods": [
      "post",
      "options"
    ],
    "authLevel": "function",
    "description": "Azure Function: directImageToWireframe"
  },
  {
    "name": "figmaComponents",
    "route": "figma/components",
    "methods": [
      "get"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: figmaComponents"
  },
  {
    "name": "figmaImport",
    "route": "figma/import",
    "methods": [
      "post",
      "options"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: figmaImport"
  },
  {
    "name": "figmaNodeImporter",
    "route": "figmaNodeImporter",
    "methods": [
      "post",
      "options"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: figmaNodeImporter"
  },
  {
    "name": "figmaOAuthCallback",
    "route": "figmaOAuthCallback",
    "methods": [
      "get",
      "options"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: figmaOAuthCallback"
  },
  {
    "name": "figmaOAuthDiagnostics",
    "route": "figmaOAuthDiagnostics",
    "methods": [
      "get"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: figmaOAuthDiagnostics"
  },
  {
    "name": "figmaOAuthStart",
    "route": "figmaOAuthStart",
    "methods": [
      "get",
      "post",
      "options"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: figmaOAuthStart"
  },
  {
    "name": "frontend",
    "route": "assets/{*path}",
    "methods": [
      "get"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: frontend"
  },
  {
    "name": "generateSuggestions",
    "route": "generate-suggestions",
    "methods": [
      "get",
      "post",
      "options"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: generateSuggestions"
  },
  {
    "name": "generateWireframe",
    "route": "generate-wireframe",
    "methods": [
      "get",
      "post",
      "options"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: generateWireframe"
  },
  {
    "name": "get-template",
    "route": "get-template",
    "methods": [
      "post",
      "options"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: get-template"
  },
  {
    "name": "githubAuthCallback",
    "route": "github/auth/callback",
    "methods": [
      "get"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: githubAuthCallback"
  },
  {
    "name": "githubAuthStart",
    "route": "github/auth/start",
    "methods": [
      "get"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: githubAuthStart"
  },
  {
    "name": "health",
    "route": "health",
    "methods": [
      "get"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: health"
  },
  {
    "name": "openai-health",
    "route": "openai-health",
    "methods": [
      "get",
      "options"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: openai-health"
  },
  {
    "name": "updateThemeColors",
    "route": "update-theme-colors",
    "methods": [
      "post",
      "options"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: updateThemeColors"
  },
  {
    "name": "wireframeAnalyze",
    "route": "wireframeAnalyze",
    "methods": [
      "post",
      "options"
    ],
    "authLevel": "anonymous",
    "description": "Azure Function: wireframeAnalyze"
  }
];
