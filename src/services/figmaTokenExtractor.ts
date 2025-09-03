/**
 * Design Token Extraction Service
 * Extracts and manages design tokens from Figma files
 */

export interface ColorToken {
  id: string;
  name: string;
  value: string;
  rgb: { r: number; g: number; b: number; a?: number };
  hex: string;
  usage: "primary" | "secondary" | "accent" | "neutral" | "semantic";
  figmaReference?: string;
  description?: string;
}

export interface TypographyToken {
  id: string;
  name: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
  letterSpacing?: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  figmaReference?: string;
  usage: "heading" | "body" | "caption" | "label" | "display";
}

export interface SpacingToken {
  id: string;
  name: string;
  value: number;
  unit: "px" | "rem" | "em";
  usage: "padding" | "margin" | "gap" | "inset";
  scale?: number; // position in spacing scale
  figmaReference?: string;
}

export interface ShadowToken {
  id: string;
  name: string;
  value: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  usage: "elevation" | "focus" | "hover" | "pressed";
  figmaReference?: string;
}

export interface BorderRadiusToken {
  id: string;
  name: string;
  value: number;
  unit: "px" | "rem";
  usage: "small" | "medium" | "large" | "round" | "pill";
  figmaReference?: string;
}

export interface DesignTokenCollection {
  colors: ColorToken[];
  typography: TypographyToken[];
  spacing: SpacingToken[];
  shadows: ShadowToken[];
  borderRadius: BorderRadiusToken[];
  metadata: {
    extractedFrom: string;
    extractedAt: Date;
    figmaFileId?: string;
    version: string;
  };
}

export interface ExportOptions {
  format: "css" | "scss" | "js" | "json" | "style-dictionary";
  includeComments: boolean;
  useCustomProperties: boolean;
  namespace?: string;
  prefix?: string;
}

class DesignTokenExtractor {
  /**
   * Extract design tokens from Figma node data
   */
  extractTokensFromFigma(
    figmaData: any,
    fileId?: string
  ): DesignTokenCollection {
    const tokens: DesignTokenCollection = {
      colors: [],
      typography: [],
      spacing: [],
      shadows: [],
      borderRadius: [],
      metadata: {
        extractedFrom: "Figma",
        extractedAt: new Date(),
        figmaFileId: fileId,
        version: "1.0.0",
      },
    };

    // Extract from styles if available
    if (figmaData.styles) {
      this.extractFromStyles(figmaData.styles, tokens);
    }

    // Extract from document nodes
    if (figmaData.document) {
      this.extractFromNodes(figmaData.document, tokens);
    }

    // Generate semantic tokens
    this.generateSemanticTokens(tokens);

    // Sort and deduplicate
    this.processTokens(tokens);

    return tokens;
  }

  /**
   * Extract tokens from Figma styles
   */
  private extractFromStyles(styles: any, tokens: DesignTokenCollection): void {
    Object.entries(styles).forEach(([id, style]: [string, any]) => {
      const styleData = style as any;

      if (styleData.styleType === "FILL") {
        this.extractColorFromStyle(id, styleData, tokens.colors);
      } else if (styleData.styleType === "TEXT") {
        this.extractTypographyFromStyle(id, styleData, tokens.typography);
      } else if (styleData.styleType === "EFFECT") {
        this.extractShadowFromStyle(id, styleData, tokens.shadows);
      }
    });
  }

  /**
   * Extract tokens from document nodes
   */
  private extractFromNodes(node: any, tokens: DesignTokenCollection): void {
    // Extract colors from fills
    if (node.fills && Array.isArray(node.fills)) {
      node.fills.forEach((fill: any, index: number) => {
        if (fill.type === "SOLID" && fill.color) {
          this.extractColorFromFill(node.id, fill, index, tokens.colors);
        }
      });
    }

    // Extract typography from text nodes
    if (node.type === "TEXT" && node.style) {
      this.extractTypographyFromNode(node.id, node.style, tokens.typography);
    }

    // Extract shadows from effects
    if (node.effects && Array.isArray(node.effects)) {
      node.effects.forEach((effect: any, index: number) => {
        if (effect.type === "DROP_SHADOW" || effect.type === "INNER_SHADOW") {
          this.extractShadowFromEffect(node.id, effect, index, tokens.shadows);
        }
      });
    }

    // Extract border radius
    if (node.cornerRadius !== undefined) {
      this.extractBorderRadius(node.id, node.cornerRadius, tokens.borderRadius);
    }

    // Extract spacing from layout properties
    if (node.paddingLeft !== undefined || node.itemSpacing !== undefined) {
      this.extractSpacing(node.id, node, tokens.spacing);
    }

    // Recursively process children
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach((child: any) => {
        this.extractFromNodes(child, tokens);
      });
    }
  }

  /**
   * Extract color from Figma style
   */
  private extractColorFromStyle(
    id: string,
    style: any,
    colors: ColorToken[]
  ): void {
    const fills = style.definition?.fills;
    if (!fills || !Array.isArray(fills) || fills.length === 0) return;

    const fill = fills[0];
    if (fill.type === "SOLID" && fill.color) {
      const color = this.figmaColorToToken(id, fill.color, style.name);
      if (color) {
        color.figmaReference = id;
        colors.push(color);
      }
    }
  }

  /**
   * Extract color from Figma fill
   */
  private extractColorFromFill(
    nodeId: string,
    fill: any,
    index: number,
    colors: ColorToken[]
  ): void {
    if (fill.type === "SOLID" && fill.color) {
      const color = this.figmaColorToToken(
        `${nodeId}-fill-${index}`,
        fill.color
      );
      if (color) {
        color.figmaReference = nodeId;
        colors.push(color);
      }
    }
  }

  /**
   * Convert Figma color to ColorToken
   */
  private figmaColorToToken(
    id: string,
    figmaColor: any,
    name?: string
  ): ColorToken | null {
    const { r, g, b, a = 1 } = figmaColor;

    // Convert to 0-255 range
    const rgb = {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
      a: a < 1 ? a : undefined,
    };

    // Convert to hex
    const hex = `#${rgb.r.toString(16).padStart(2, "0")}${rgb.g
      .toString(16)
      .padStart(2, "0")}${rgb.b.toString(16).padStart(2, "0")}`;

    // Generate CSS value
    const value = a < 1 ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})` : hex;

    // Determine usage based on color properties
    const usage = this.determineColorUsage(rgb, name);

    return {
      id,
      name: name || this.generateColorName(rgb),
      value,
      rgb,
      hex,
      usage,
    };
  }

  /**
   * Determine color usage category
   */
  private determineColorUsage(
    rgb: { r: number; g: number; b: number },
    name?: string
  ): ColorToken["usage"] {
    if (name) {
      const lowerName = name.toLowerCase();
      if (lowerName.includes("primary")) return "primary";
      if (lowerName.includes("secondary")) return "secondary";
      if (lowerName.includes("accent")) return "accent";
      if (lowerName.includes("error") || lowerName.includes("danger"))
        return "semantic";
      if (lowerName.includes("success")) return "semantic";
      if (lowerName.includes("warning")) return "semantic";
    }

    // Calculate luminance to determine if it's likely neutral
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    if (luminance > 0.8 || luminance < 0.2) {
      return "neutral";
    }

    return "primary";
  }

  /**
   * Generate semantic color name
   */
  private generateColorName(rgb: { r: number; g: number; b: number }): string {
    const { r, g, b } = rgb;

    // Simple color name generation based on dominant channel
    if (r > g && r > b) return "Red";
    if (g > r && g > b) return "Green";
    if (b > r && b > g) return "Blue";
    if (r === g && r > b) return "Yellow";
    if (r === b && r > g) return "Magenta";
    if (g === b && g > r) return "Cyan";

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (luminance > 0.9) return "White";
    if (luminance < 0.1) return "Black";
    if (luminance > 0.7) return "Light Gray";
    if (luminance < 0.3) return "Dark Gray";

    return "Gray";
  }

  /**
   * Extract typography from Figma style
   */
  private extractTypographyFromStyle(
    id: string,
    style: any,
    typography: TypographyToken[]
  ): void {
    const definition = style.definition;
    if (!definition) return;

    const token: TypographyToken = {
      id,
      name: style.name || "Typography",
      fontFamily: definition.fontFamily || "inherit",
      fontSize: definition.fontSize || 16,
      lineHeight: definition.lineHeightPx || definition.lineHeight || 1.5,
      fontWeight: this.figmaFontWeightToNumber(definition.fontWeight),
      letterSpacing: definition.letterSpacing,
      figmaReference: id,
      usage: this.determineTypographyUsage(style.name, definition.fontSize),
    };

    typography.push(token);
  }

  /**
   * Extract typography from text node
   */
  private extractTypographyFromNode(
    nodeId: string,
    style: any,
    typography: TypographyToken[]
  ): void {
    const token: TypographyToken = {
      id: `${nodeId}-text`,
      name: "Text Style",
      fontFamily: style.fontFamily || "inherit",
      fontSize: style.fontSize || 16,
      lineHeight: style.lineHeightPx || style.lineHeight || 1.5,
      fontWeight: this.figmaFontWeightToNumber(style.fontWeight),
      letterSpacing: style.letterSpacing,
      figmaReference: nodeId,
      usage: this.determineTypographyUsage("", style.fontSize),
    };

    typography.push(token);
  }

  /**
   * Convert Figma font weight to number
   */
  private figmaFontWeightToNumber(weight: any): number {
    if (typeof weight === "number") return weight;

    const weightMap: Record<string, number> = {
      Thin: 100,
      ExtraLight: 200,
      Light: 300,
      Regular: 400,
      Medium: 500,
      SemiBold: 600,
      Bold: 700,
      ExtraBold: 800,
      Black: 900,
    };

    return weightMap[weight] || 400;
  }

  /**
   * Determine typography usage
   */
  private determineTypographyUsage(
    name: string,
    fontSize: number
  ): TypographyToken["usage"] {
    const lowerName = name.toLowerCase();

    if (lowerName.includes("heading") || lowerName.includes("title"))
      return "heading";
    if (lowerName.includes("body") || lowerName.includes("paragraph"))
      return "body";
    if (lowerName.includes("caption") || lowerName.includes("small"))
      return "caption";
    if (lowerName.includes("label") || lowerName.includes("tag"))
      return "label";
    if (lowerName.includes("display") || lowerName.includes("hero"))
      return "display";

    // Determine by font size
    if (fontSize >= 24) return "heading";
    if (fontSize >= 14) return "body";
    if (fontSize >= 10) return "caption";

    return "body";
  }

  /**
   * Extract shadow from style
   */
  private extractShadowFromStyle(
    id: string,
    style: any,
    shadows: ShadowToken[]
  ): void {
    const effects = style.definition?.effects;
    if (!effects || !Array.isArray(effects)) return;

    effects.forEach((effect: any, index: number) => {
      if (effect.type === "DROP_SHADOW" || effect.type === "INNER_SHADOW") {
        const shadow = this.figmaEffectToShadowToken(
          `${id}-${index}`,
          effect,
          style.name
        );
        if (shadow) {
          shadow.figmaReference = id;
          shadows.push(shadow);
        }
      }
    });
  }

  /**
   * Extract shadow from effect
   */
  private extractShadowFromEffect(
    nodeId: string,
    effect: any,
    index: number,
    shadows: ShadowToken[]
  ): void {
    const shadow = this.figmaEffectToShadowToken(
      `${nodeId}-effect-${index}`,
      effect
    );
    if (shadow) {
      shadow.figmaReference = nodeId;
      shadows.push(shadow);
    }
  }

  /**
   * Convert Figma effect to ShadowToken
   */
  private figmaEffectToShadowToken(
    id: string,
    effect: any,
    name?: string
  ): ShadowToken | null {
    const { offset, radius, color, spread = 0 } = effect;
    if (!offset || !color) return null;

    const colorValue = this.figmaColorToRgba(color);
    const value = `${offset.x}px ${offset.y}px ${radius}px ${spread}px ${colorValue}`;

    return {
      id,
      name: name || "Shadow",
      value,
      offsetX: offset.x,
      offsetY: offset.y,
      blur: radius,
      spread,
      color: colorValue,
      usage: this.determineShadowUsage(name, radius),
    };
  }

  /**
   * Convert Figma color to RGBA string
   */
  private figmaColorToRgba(figmaColor: any): string {
    const { r, g, b, a = 1 } = figmaColor;
    const rgb = {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };

    return a < 1
      ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`
      : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  /**
   * Determine shadow usage
   */
  private determineShadowUsage(
    name: string | undefined,
    blur: number
  ): ShadowToken["usage"] {
    if (name) {
      const lowerName = name.toLowerCase();
      if (lowerName.includes("focus")) return "focus";
      if (lowerName.includes("hover")) return "hover";
      if (lowerName.includes("pressed") || lowerName.includes("active"))
        return "pressed";
    }

    return "elevation";
  }

  /**
   * Extract border radius
   */
  private extractBorderRadius(
    nodeId: string,
    radius: number,
    borderRadii: BorderRadiusToken[]
  ): void {
    const token: BorderRadiusToken = {
      id: `${nodeId}-radius`,
      name: this.generateRadiusName(radius),
      value: radius,
      unit: "px",
      usage: this.determineRadiusUsage(radius),
      figmaReference: nodeId,
    };

    borderRadii.push(token);
  }

  /**
   * Generate radius name
   */
  private generateRadiusName(radius: number): string {
    if (radius === 0) return "None";
    if (radius <= 4) return "Small";
    if (radius <= 8) return "Medium";
    if (radius <= 16) return "Large";
    if (radius >= 100) return "Round";
    return "Custom";
  }

  /**
   * Determine radius usage
   */
  private determineRadiusUsage(radius: number): BorderRadiusToken["usage"] {
    if (radius === 0) return "small";
    if (radius <= 4) return "small";
    if (radius <= 8) return "medium";
    if (radius <= 16) return "large";
    if (radius >= 100) return "round";
    return "medium";
  }

  /**
   * Extract spacing
   */
  private extractSpacing(
    nodeId: string,
    node: any,
    spacing: SpacingToken[]
  ): void {
    const spacingValues = [
      { prop: "paddingLeft", usage: "padding" as const },
      { prop: "paddingRight", usage: "padding" as const },
      { prop: "paddingTop", usage: "padding" as const },
      { prop: "paddingBottom", usage: "padding" as const },
      { prop: "itemSpacing", usage: "gap" as const },
    ];

    spacingValues.forEach(({ prop, usage }) => {
      const value = node[prop];
      if (value !== undefined && value > 0) {
        const token: SpacingToken = {
          id: `${nodeId}-${prop}`,
          name: this.generateSpacingName(value),
          value,
          unit: "px",
          usage,
          figmaReference: nodeId,
        };
        spacing.push(token);
      }
    });
  }

  /**
   * Generate spacing name
   */
  private generateSpacingName(value: number): string {
    if (value <= 4) return "XS";
    if (value <= 8) return "S";
    if (value <= 16) return "M";
    if (value <= 24) return "L";
    if (value <= 32) return "XL";
    if (value <= 48) return "XXL";
    return "Custom";
  }

  /**
   * Generate semantic tokens based on extracted tokens
   */
  private generateSemanticTokens(tokens: DesignTokenCollection): void {
    // Generate semantic color tokens
    this.generateSemanticColors(tokens.colors);

    // Generate spacing scale
    this.generateSpacingScale(tokens.spacing);
  }

  /**
   * Generate semantic color tokens
   */
  private generateSemanticColors(colors: ColorToken[]): void {
    // This would generate semantic tokens like --color-primary, --color-success, etc.
    // based on the extracted colors
  }

  /**
   * Generate spacing scale
   */
  private generateSpacingScale(spacing: SpacingToken[]): void {
    // Generate a consistent spacing scale based on extracted values
    const uniqueValues = [...new Set(spacing.map((s) => s.value))].sort(
      (a, b) => a - b
    );

    uniqueValues.forEach((value, index) => {
      const existingToken = spacing.find((s) => s.value === value);
      if (existingToken) {
        existingToken.scale = index;
      }
    });
  }

  /**
   * Process and clean up tokens
   */
  private processTokens(tokens: DesignTokenCollection): void {
    // Remove duplicates and sort tokens
    tokens.colors = this.deduplicateTokens(tokens.colors, "value");
    tokens.typography = this.deduplicateTokens(tokens.typography, "name");
    tokens.spacing = this.deduplicateTokens(tokens.spacing, "value");
    tokens.shadows = this.deduplicateTokens(tokens.shadows, "value");
    tokens.borderRadius = this.deduplicateTokens(tokens.borderRadius, "value");
  }

  /**
   * Remove duplicate tokens based on a property
   */
  private deduplicateTokens<T extends { id: string }>(
    tokens: T[],
    property: keyof T
  ): T[] {
    const seen = new Set();
    return tokens.filter((token) => {
      const value = token[property];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }

  /**
   * Export tokens in specified format
   */
  exportTokens(tokens: DesignTokenCollection, options: ExportOptions): string {
    switch (options.format) {
      case "css":
        return this.exportToCss(tokens, options);
      case "scss":
        return this.exportToScss(tokens, options);
      case "js":
        return this.exportToJs(tokens, options);
      case "json":
        return this.exportToJson(tokens, options);
      case "style-dictionary":
        return this.exportToStyleDictionary(tokens, options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  /**
   * Export to CSS custom properties
   */
  private exportToCss(
    tokens: DesignTokenCollection,
    options: ExportOptions
  ): string {
    const {
      includeComments,
      useCustomProperties,
      namespace = "",
      prefix = "ds",
    } = options;
    let css = "";

    if (includeComments) {
      css += `/* Design Tokens Generated from ${tokens.metadata.extractedFrom} */\n`;
      css += `/* Generated at: ${tokens.metadata.extractedAt.toISOString()} */\n\n`;
    }

    css += ":root {\n";

    // Colors
    if (includeComments) css += "  /* Colors */\n";
    tokens.colors.forEach((token) => {
      const varName = `--${prefix}-color-${token.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
      css += `  ${varName}: ${token.value};\n`;
    });

    css += "\n";

    // Typography
    if (includeComments) css += "  /* Typography */\n";
    tokens.typography.forEach((token) => {
      const baseName = token.name.toLowerCase().replace(/\s+/g, "-");
      css += `  --${prefix}-font-family-${baseName}: ${token.fontFamily};\n`;
      css += `  --${prefix}-font-size-${baseName}: ${token.fontSize}px;\n`;
      css += `  --${prefix}-line-height-${baseName}: ${token.lineHeight};\n`;
      css += `  --${prefix}-font-weight-${baseName}: ${token.fontWeight};\n`;
      if (token.letterSpacing) {
        css += `  --${prefix}-letter-spacing-${baseName}: ${token.letterSpacing}px;\n`;
      }
    });

    css += "\n";

    // Spacing
    if (includeComments) css += "  /* Spacing */\n";
    tokens.spacing.forEach((token) => {
      const varName = `--${prefix}-spacing-${token.name.toLowerCase()}`;
      css += `  ${varName}: ${token.value}${token.unit};\n`;
    });

    css += "\n";

    // Shadows
    if (includeComments) css += "  /* Shadows */\n";
    tokens.shadows.forEach((token) => {
      const varName = `--${prefix}-shadow-${token.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
      css += `  ${varName}: ${token.value};\n`;
    });

    css += "\n";

    // Border Radius
    if (includeComments) css += "  /* Border Radius */\n";
    tokens.borderRadius.forEach((token) => {
      const varName = `--${prefix}-radius-${token.name.toLowerCase()}`;
      css += `  ${varName}: ${token.value}${token.unit};\n`;
    });

    css += "}\n";

    return css;
  }

  /**
   * Export to SCSS variables
   */
  private exportToScss(
    tokens: DesignTokenCollection,
    options: ExportOptions
  ): string {
    const { includeComments, prefix = "ds" } = options;
    let scss = "";

    if (includeComments) {
      scss += `// Design Tokens Generated from ${tokens.metadata.extractedFrom}\n`;
      scss += `// Generated at: ${tokens.metadata.extractedAt.toISOString()}\n\n`;
    }

    // Colors
    if (includeComments) scss += "// Colors\n";
    tokens.colors.forEach((token) => {
      const varName = `$${prefix}-color-${token.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
      scss += `${varName}: ${token.value};\n`;
    });

    scss += "\n";

    // Typography
    if (includeComments) scss += "// Typography\n";
    tokens.typography.forEach((token) => {
      const baseName = token.name.toLowerCase().replace(/\s+/g, "-");
      scss += `$${prefix}-font-family-${baseName}: ${token.fontFamily};\n`;
      scss += `$${prefix}-font-size-${baseName}: ${token.fontSize}px;\n`;
      scss += `$${prefix}-line-height-${baseName}: ${token.lineHeight};\n`;
      scss += `$${prefix}-font-weight-${baseName}: ${token.fontWeight};\n`;
    });

    return scss;
  }

  /**
   * Export to JavaScript/TypeScript
   */
  private exportToJs(
    tokens: DesignTokenCollection,
    options: ExportOptions
  ): string {
    const { includeComments } = options;

    let js = "";
    if (includeComments) {
      js += `/**\n * Design Tokens Generated from ${tokens.metadata.extractedFrom}\n`;
      js += ` * Generated at: ${tokens.metadata.extractedAt.toISOString()}\n */\n\n`;
    }

    js += "export const designTokens = {\n";
    js += "  colors: {\n";
    tokens.colors.forEach((token) => {
      const key = token.name.toLowerCase().replace(/\s+/g, "");
      js += `    ${key}: '${token.value}',\n`;
    });
    js += "  },\n";

    js += "  typography: {\n";
    tokens.typography.forEach((token) => {
      const key = token.name.toLowerCase().replace(/\s+/g, "");
      js += `    ${key}: {\n`;
      js += `      fontFamily: '${token.fontFamily}',\n`;
      js += `      fontSize: ${token.fontSize},\n`;
      js += `      lineHeight: ${token.lineHeight},\n`;
      js += `      fontWeight: ${token.fontWeight},\n`;
      js += "    },\n";
    });
    js += "  },\n";

    js += "  spacing: {\n";
    tokens.spacing.forEach((token) => {
      const key = token.name.toLowerCase();
      js += `    ${key}: ${token.value},\n`;
    });
    js += "  },\n";

    js += "};\n";

    return js;
  }

  /**
   * Export to JSON
   */
  private exportToJson(
    tokens: DesignTokenCollection,
    options: ExportOptions
  ): string {
    return JSON.stringify(tokens, null, 2);
  }

  /**
   * Export to Style Dictionary format
   */
  private exportToStyleDictionary(
    tokens: DesignTokenCollection,
    options: ExportOptions
  ): string {
    const styleDictionary = {
      color: {},
      size: {
        font: {},
        spacing: {},
        radius: {},
      },
      shadow: {},
    };

    // Convert colors
    tokens.colors.forEach((token) => {
      const path = token.name.toLowerCase().replace(/\s+/g, "-");
      (styleDictionary.color as any)[path] = {
        value: token.value,
        type: "color",
        description: token.description || `${token.usage} color`,
      };
    });

    // Convert typography
    tokens.typography.forEach((token) => {
      const path = token.name.toLowerCase().replace(/\s+/g, "-");
      (styleDictionary.size.font as any)[path] = {
        value: `${token.fontSize}px`,
        type: "dimension",
      };
    });

    // Convert spacing
    tokens.spacing.forEach((token) => {
      const path = token.name.toLowerCase();
      (styleDictionary.size.spacing as any)[path] = {
        value: `${token.value}${token.unit}`,
        type: "dimension",
      };
    });

    return JSON.stringify(styleDictionary, null, 2);
  }
}

export const tokenExtractor = new DesignTokenExtractor();
export default tokenExtractor;
