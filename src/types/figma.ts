/**
 * TypeScript types for Figma integration
 */

export interface FigmaComponent {
  id: string;
  name: string;
  description?: string;
  category?: string;
  library?: string;
  preview?: string;
  variants?: FigmaVariant[];
  usageCount?: number;
  tags?: string[];
  type?: string;
  lastModified?: string;
  createdBy?: string;
  htmlCode?: string;
  thumbnailUrl?: string;
  properties?: Record<string, any>;
  designTokens?: Record<string, any>;
  documentation?: string;
}

export interface FigmaVariant {
  id: string;
  name: string;
  properties: Record<string, any>;
  preview?: string;
}

export interface FigmaComponentImportResult {
  componentId: string;
  componentName?: string;
  wireframeHtml?: string;
  wireframeCss?: string;
  success: boolean;
  error?: string;
}

export interface FigmaImportSummary {
  total: number;
  successful: number;
  failed: number;
}

export interface FigmaImportResponse {
  results: FigmaComponentImportResult[];
  summary: FigmaImportSummary;
}

export interface FigmaComponentsResponse {
  components: FigmaComponent[];
  categories: string[];
  popular: Array<{
    id: string;
    name: string;
    preview?: string;
    usageCount?: number;
  }>;
  statistics: {
    totalComponents: number;
    categories: string[];
    totalUsage: number;
    libraries: string[];
  };
}

export interface FigmaIntegrationProps {
  onComponentsImported?: (components: FigmaComponentImportResult[]) => void;
  onClose?: () => void;
  designSystem?: "auto" | "fluent" | "atlas";
  mode?: "design-import" | "component-browser"; // New prop to distinguish use cases
}

export interface FigmaComponentBrowserProps {
  onImportComponents: (componentIds: string[]) => void;
  onClose: () => void;
}

export interface WireframeOptions {
  designSystem?: string;
  includeVariants?: boolean;
  generateCSS?: boolean;
  responsive?: boolean;
}
