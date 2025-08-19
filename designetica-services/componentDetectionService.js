/**
 * Component Detection Service
 * Automatically detects and maps React components to Figma components
 */

const fs = require("fs");
const path = require("path");

class ComponentDetectionService {
  constructor() {
    this.srcPath = "../src/components";
    this.detectedComponents = new Map();
    this.componentPatterns = {
      button: /button|btn/i,
      modal: /modal|dialog/i,
      input: /input|textfield|form/i,
      navigation: /nav|menu|breadcrumb/i,
      card: /card|tile/i,
      avatar: /avatar|profile/i,
      badge: /badge|chip|tag/i,
      tooltip: /tooltip|hint/i,
    };
  }

  /**
   * Scan and detect all React components
   */
  async detectComponents() {
    try {
      console.log("🔄 Scanning for React components...");

      const componentFiles = await this.scanComponentFiles();
      const analysisResults = [];

      for (const file of componentFiles) {
        const analysis = await this.analyzeComponent(file);
        if (analysis) {
          this.detectedComponents.set(analysis.name, analysis);
          analysisResults.push(analysis);
        }
      }

      console.log(`✅ Detected ${analysisResults.length} components`);
      return analysisResults;
    } catch (error) {
      console.error("❌ Component detection failed:", error.message);
      throw error;
    }
  }

  /**
   * Scan for component files in the src directory
   */
  async scanComponentFiles() {
    const componentFiles = [];

    const scanDirectory = (dirPath) => {
      try {
        const items = fs.readdirSync(dirPath);

        for (const item of items) {
          const fullPath = path.join(dirPath, item);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            scanDirectory(fullPath);
          } else if (this.isComponentFile(item)) {
            componentFiles.push(fullPath);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Could not scan directory ${dirPath}:`, error.message);
      }
    };

    scanDirectory(this.srcPath);
    return componentFiles;
  }

  /**
   * Check if file is a React component
   */
  isComponentFile(fileName) {
    const componentExtensions = [".tsx", ".jsx"];
    const hasValidExtension = componentExtensions.some((ext) =>
      fileName.endsWith(ext)
    );
    const isComponent = /^[A-Z]/.test(fileName); // Components start with capital letter
    const isNotTest =
      !fileName.includes(".test.") && !fileName.includes(".spec.");

    return hasValidExtension && isComponent && isNotTest;
  }

  /**
   * Analyze individual component file
   */
  async analyzeComponent(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const fileName = path.basename(filePath, path.extname(filePath));

      const analysis = {
        name: fileName,
        filePath: filePath,
        type: this.detectComponentType(fileName, content),
        props: this.extractProps(content),
        exports: this.extractExports(content),
        imports: this.extractImports(content),
        hasStyles: this.hasAssociatedStyles(filePath),
        complexity: this.calculateComplexity(content),
        figmaMapping: this.suggestFigmaMapping(fileName, content),
      };

      return analysis;
    } catch (error) {
      console.warn(
        `⚠️ Could not analyze component ${filePath}:`,
        error.message
      );
      return null;
    }
  }

  /**
   * Detect component type based on name and content
   */
  detectComponentType(fileName, content) {
    for (const [type, pattern] of Object.entries(this.componentPatterns)) {
      if (pattern.test(fileName) || pattern.test(content)) {
        return type;
      }
    }

    // Additional detection based on content patterns
    if (content.includes("useState") || content.includes("useEffect")) {
      return "interactive";
    }

    if (content.includes("children")) {
      return "container";
    }

    return "basic";
  }

  /**
   * Extract props from component interface
   */
  extractProps(content) {
    const props = [];

    // Extract from TypeScript interface
    const interfaceMatch = content.match(/interface\s+\w+Props\s*\{([^}]+)\}/);
    if (interfaceMatch) {
      const interfaceContent = interfaceMatch[1];
      const propMatches = interfaceContent.match(/(\w+)(\?)?:\s*([^;]+);/g);

      if (propMatches) {
        propMatches.forEach((match) => {
          const propMatch = match.match(/(\w+)(\?)?:\s*([^;]+);/);
          if (propMatch) {
            props.push({
              name: propMatch[1],
              optional: !!propMatch[2],
              type: propMatch[3].trim(),
            });
          }
        });
      }
    }

    // Extract from function parameters
    const funcParamMatch = content.match(
      /\(\s*\{([^}]+)\}\s*(?::\s*\w+Props)?\s*\)/
    );
    if (funcParamMatch && props.length === 0) {
      const paramContent = funcParamMatch[1];
      const paramNames = paramContent.split(",").map((p) => p.trim());

      paramNames.forEach((param) => {
        props.push({
          name: param,
          optional: false,
          type: "unknown",
        });
      });
    }

    return props;
  }

  /**
   * Extract exports from component
   */
  extractExports(content) {
    const exports = [];

    // Default export
    if (content.includes("export default")) {
      exports.push("default");
    }

    // Named exports
    const namedExportMatches = content.match(
      /export\s+(?:const|function|class)\s+(\w+)/g
    );
    if (namedExportMatches) {
      namedExportMatches.forEach((match) => {
        const exportMatch = match.match(
          /export\s+(?:const|function|class)\s+(\w+)/
        );
        if (exportMatch) {
          exports.push(exportMatch[1]);
        }
      });
    }

    return exports;
  }

  /**
   * Extract imports from component
   */
  extractImports(content) {
    const imports = [];
    const importMatches = content.match(
      /import\s+[^;]+from\s+['"`]([^'"`]+)['"`];/g
    );

    if (importMatches) {
      importMatches.forEach((match) => {
        const importMatch = match.match(/from\s+['"`]([^'"`]+)['"`]/);
        if (importMatch) {
          imports.push(importMatch[1]);
        }
      });
    }

    return imports;
  }

  /**
   * Check if component has associated CSS files
   */
  hasAssociatedStyles(filePath) {
    const baseName = path.basename(filePath, path.extname(filePath));
    const dirName = path.dirname(filePath);

    const possibleStyleFiles = [
      path.join(dirName, `${baseName}.css`),
      path.join(dirName, `${baseName}.module.css`),
      path.join(dirName, `${baseName}.scss`),
      path.join(dirName, `${baseName}.module.scss`),
    ];

    return possibleStyleFiles.some((styleFile) => {
      try {
        return fs.existsSync(styleFile);
      } catch (error) {
        return false;
      }
    });
  }

  /**
   * Calculate component complexity
   */
  calculateComplexity(content) {
    let complexity = 0;

    // Count hooks usage
    const hooks = ["useState", "useEffect", "useCallback", "useMemo", "useRef"];
    hooks.forEach((hook) => {
      const matches = content.match(new RegExp(hook, "g"));
      complexity += matches ? matches.length : 0;
    });

    // Count conditional rendering
    const conditionals = content.match(/\{[^}]*\?[^}]*:/g);
    complexity += conditionals ? conditionals.length : 0;

    // Count event handlers
    const eventHandlers = content.match(/on\w+\s*=\s*\{/g);
    complexity += eventHandlers ? eventHandlers.length : 0;

    if (complexity <= 3) return "low";
    if (complexity <= 8) return "medium";
    return "high";
  }

  /**
   * Suggest Figma mapping based on component analysis
   */
  suggestFigmaMapping(fileName, content) {
    const type = this.detectComponentType(fileName, content);

    const mappingSuggestions = {
      button: {
        figmaComponent: "Button",
        variants: ["primary", "secondary", "outline"],
        props: ["variant", "size", "disabled"],
      },
      modal: {
        figmaComponent: "Modal",
        variants: ["small", "medium", "large"],
        props: ["isOpen", "size", "hasOverlay"],
      },
      input: {
        figmaComponent: "Input",
        variants: ["text", "email", "password"],
        props: ["type", "placeholder", "disabled"],
      },
      navigation: {
        figmaComponent: "Navigation",
        variants: ["horizontal", "vertical"],
        props: ["items", "activeItem"],
      },
    };

    return (
      mappingSuggestions[type] || {
        figmaComponent: "Generic",
        variants: ["default"],
        props: ["children"],
      }
    );
  }

  /**
   * Generate component mapping report
   */
  generateMappingReport() {
    const report = {
      totalComponents: this.detectedComponents.size,
      componentsByType: {},
      complexityDistribution: { low: 0, medium: 0, high: 0 },
      recommendations: [],
    };

    // Analyze detected components
    for (const [name, component] of this.detectedComponents) {
      // Count by type
      if (!report.componentsByType[component.type]) {
        report.componentsByType[component.type] = 0;
      }
      report.componentsByType[component.type]++;

      // Count by complexity
      report.complexityDistribution[component.complexity]++;

      // Generate recommendations
      if (component.complexity === "high") {
        report.recommendations.push({
          component: name,
          suggestion: "Consider breaking down into smaller components",
          priority: "high",
        });
      }

      if (component.props.length === 0) {
        report.recommendations.push({
          component: name,
          suggestion: "Add TypeScript interface for better Figma mapping",
          priority: "medium",
        });
      }
    }

    return report;
  }

  /**
   * Get detected components
   */
  getDetectedComponents() {
    return Array.from(this.detectedComponents.values());
  }

  /**
   * Get component by name
   */
  getComponent(name) {
    return this.detectedComponents.get(name);
  }
}

module.exports = ComponentDetectionService;
