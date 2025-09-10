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
    categories: Array<{
      name: string;
      count: number;
    }>;
    totalUsage: number;
    libraries: Array<{
      name: string;
      count: number;
    }>;
  };
}

export interface FigmaIntegrationProps {
  onComponentsImported?: (components: FigmaComponentImportResult[]) => void;
  onAddToWireframe?: (componentData: any[]) => void; // New prop for adding to wireframe
  onClose?: () => void;
  designSystem?: "auto" | "fluent" | "atlas";
  mode?: "design-import" | "component-browser" | "add-to-wireframe"; // New mode for wireframe integration
}

export interface FigmaComponentBrowserProps {
  onImportComponents?: (componentIds: string[]) => void;
  onAddToWireframe?: (componentData: any[]) => void; // New prop for adding to wireframe
  onClose: () => void;
  mode?: "import" | "add-to-wireframe"; // New prop to distinguish modes
}

export interface WireframeOptions {
  designSystem?: string;
  includeVariants?: boolean;
  generateCSS?: boolean;
  responsive?: boolean;
}
