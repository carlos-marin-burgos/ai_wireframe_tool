/**
 * Figma Component Browser
 * Enhanced interface for browsing and importing Figma components into wireframes
 */

const FigmaService = require("./figmaService");

class FigmaComponentBrowser {
  constructor() {
    this.figmaService = new FigmaService();
    this.componentLibrary = new Map();
    this.categories = new Map();
    this.searchIndex = new Map();
    this.init();
  }

  /**
   * Initialize component browser
   */
  async init() {
    try {
      console.log("🔄 Initializing Figma Component Browser...");

      await this.figmaService.validateConnection();
      await this.loadComponentLibrary();
      await this.buildSearchIndex();

      console.log(
        `✅ Browser initialized with ${this.componentLibrary.size} components`
      );
    } catch (error) {
      console.error("❌ Failed to initialize browser:", error);
    }
  }

  /**
   * Load all available components from both Fluent and Atlas libraries
   */
  async loadComponentLibrary() {
    try {
      // Load Fluent UI components
      const fluentComponents = await this.loadFluentComponents();

      // Load Atlas components
      const atlasComponents = await this.loadAtlasComponents();

      // Combine and categorize
      this.categorizeComponents([...fluentComponents, ...atlasComponents]);

      console.log(
        `📚 Loaded ${fluentComponents.length} Fluent + ${atlasComponents.length} Atlas components`
      );
    } catch (error) {
      console.error("❌ Failed to load component library:", error);
    }
  }

  /**
   * Load Fluent UI components with previews
   */
  async loadFluentComponents() {
    const components = [];
    const fluentMapping = this.figmaService.getFluentComponentMapping();

    for (const [componentKey, componentData] of fluentMapping) {
      try {
        // Get component details from Figma
        const componentDetails = await this.figmaService.getComponentByNodeId(
          componentData.nodeId
        );

        // Generate preview image
        const previewImage = await this.figmaService.exportNodeImages(
          [componentData.nodeId],
          undefined,
          {
            format: "png",
            scale: 2,
          }
        );

        components.push({
          id: componentData.nodeId,
          name: componentData.name,
          description: componentData.description,
          category: this.extractCategory(componentData.name),
          library: "Fluent UI",
          variants: componentData.variants || [],
          props: componentData.props || [],
          preview: previewImage[componentData.nodeId],
          figmaUrl: `https://www.figma.com/file/${this.figmaService.fluentLibraryFileKey}?node-id=${componentData.nodeId}`,
          usageCount: 0,
          tags: this.generateTags(
            componentData.name,
            componentData.description
          ),
        });
      } catch (error) {
        console.warn(
          `⚠️ Failed to load Fluent component ${componentKey}:`,
          error.message
        );
      }
    }

    return components;
  }

  /**
   * Load Atlas Design Library components with previews
   */
  async loadAtlasComponents() {
    const components = [];
    const atlasMapping = this.figmaService.getAtlasComponentMapping();

    for (const [componentKey, componentData] of atlasMapping) {
      try {
        // Get component details from Atlas library
        const componentDetails =
          await this.figmaService.getAtlasComponentByNodeId(
            componentData.nodeId
          );

        // Generate preview image from Atlas library
        const previewImage = await this.figmaService.exportAtlasComponentImages(
          [componentData.nodeId],
          {
            format: "png",
            scale: 2,
          }
        );

        components.push({
          id: componentData.nodeId,
          name: componentData.name,
          description: componentData.description,
          category: this.extractCategory(componentData.name),
          library: "Atlas Design",
          variants: componentData.variants || [],
          props: componentData.props || [],
          preview: previewImage[componentData.nodeId],
          figmaUrl: `https://www.figma.com/file/${this.figmaService.atlasLibraryFileKey}?node-id=${componentData.nodeId}`,
          usageCount: 0,
          tags: this.generateTags(
            componentData.name,
            componentData.description
          ),
        });
      } catch (error) {
        console.warn(
          `⚠️ Failed to load Atlas component ${componentKey}:`,
          error.message
        );
      }
    }

    return components;
  }

  /**
   * Extract component category from name
   */
  extractCategory(name) {
    const categoryMap = {
      Button: "Actions",
      Input: "Forms",
      Card: "Layout",
      Modal: "Overlays",
      Navigation: "Navigation",
      Hero: "Marketing",
      Learning: "Education",
      Avatar: "Media",
      Icon: "Icons",
    };

    for (const [key, category] of Object.entries(categoryMap)) {
      if (name.includes(key)) return category;
    }

    return "General";
  }

  /**
   * Generate searchable tags for components
   */
  generateTags(name, description) {
    const tags = new Set();

    // Add name parts
    name
      .toLowerCase()
      .split(/[\/\s-_]/)
      .forEach((part) => {
        if (part.length > 2) tags.add(part);
      });

    // Add description words
    if (description) {
      description
        .toLowerCase()
        .split(/\s+/)
        .forEach((word) => {
          if (word.length > 3) tags.add(word);
        });
    }

    return Array.from(tags);
  }

  /**
   * Categorize components for browsing
   */
  categorizeComponents(components) {
    components.forEach((component) => {
      this.componentLibrary.set(component.id, component);

      if (!this.categories.has(component.category)) {
        this.categories.set(component.category, []);
      }
      this.categories.get(component.category).push(component);
    });
  }

  /**
   * Build search index for fast component finding
   */
  async buildSearchIndex() {
    for (const component of this.componentLibrary.values()) {
      // Index by name
      const nameTokens = component.name.toLowerCase().split(/[\/\s-_]/);
      nameTokens.forEach((token) => {
        if (!this.searchIndex.has(token)) {
          this.searchIndex.set(token, []);
        }
        this.searchIndex.get(token).push(component);
      });

      // Index by tags
      component.tags.forEach((tag) => {
        if (!this.searchIndex.has(tag)) {
          this.searchIndex.set(tag, []);
        }
        this.searchIndex.get(tag).push(component);
      });
    }
  }

  /**
   * Search components by query
   */
  searchComponents(query, options = {}) {
    const {
      category = null,
      library = null,
      limit = 20,
      includeVariants = false,
    } = options;

    const results = new Set();
    const queryLower = query.toLowerCase();

    // Search by exact matches first
    if (this.searchIndex.has(queryLower)) {
      this.searchIndex
        .get(queryLower)
        .forEach((component) => results.add(component));
    }

    // Search by partial matches
    for (const [term, components] of this.searchIndex) {
      if (term.includes(queryLower) || queryLower.includes(term)) {
        components.forEach((component) => results.add(component));
      }
    }

    // Filter results
    let filteredResults = Array.from(results);

    if (category) {
      filteredResults = filteredResults.filter((c) => c.category === category);
    }

    if (library) {
      filteredResults = filteredResults.filter((c) => c.library === library);
    }

    // Sort by relevance (usage count + name match)
    filteredResults.sort((a, b) => {
      const aScore =
        a.usageCount + (a.name.toLowerCase().includes(queryLower) ? 10 : 0);
      const bScore =
        b.usageCount + (b.name.toLowerCase().includes(queryLower) ? 10 : 0);
      return bScore - aScore;
    });

    return filteredResults.slice(0, limit);
  }

  /**
   * Get components by category
   */
  getComponentsByCategory(category) {
    return this.categories.get(category) || [];
  }

  /**
   * Get all available categories
   */
  getCategories() {
    return Array.from(this.categories.keys()).sort();
  }

  /**
   * Get component details with variants
   */
  async getComponentDetails(componentId) {
    const component = this.componentLibrary.get(componentId);
    if (!component) return null;

    // Increment usage count
    component.usageCount++;

    // Get variants if available
    let variants = [];
    if (component.variants.length > 0) {
      try {
        const variantDetails = await this.figmaService.getComponentVariants(
          componentId
        );
        variants = variantDetails.variants || [];
      } catch (error) {
        console.warn(
          `⚠️ Failed to load variants for ${componentId}:`,
          error.message
        );
      }
    }

    return {
      ...component,
      variants,
      lastUsed: new Date().toISOString(),
    };
  }

  /**
   * Import components into wireframe
   */
  async importComponentsToWireframe(componentIds, layout = "default") {
    try {
      console.log(
        `🎨 Importing ${componentIds.length} components to wireframe...`
      );

      // Separate by library
      const fluentIds = [];
      const atlasIds = [];

      componentIds.forEach((id) => {
        const component = this.componentLibrary.get(id);
        if (component) {
          if (component.library === "Fluent UI") {
            fluentIds.push(id);
          } else if (component.library === "Atlas Design") {
            atlasIds.push(id);
          }
        }
      });

      // Generate wireframes for each library
      const wireframes = [];

      if (fluentIds.length > 0) {
        const fluentWireframe = await this.figmaService.generateFluentWireframe(
          fluentIds,
          layout
        );
        wireframes.push({
          type: "fluent",
          ...fluentWireframe,
        });
      }

      if (atlasIds.length > 0) {
        const atlasWireframe = await this.figmaService.generateAtlasWireframe(
          atlasIds,
          layout
        );
        wireframes.push({
          type: "atlas",
          ...atlasWireframe,
        });
      }

      // Combine wireframes if multiple libraries
      const result =
        wireframes.length === 1
          ? wireframes[0]
          : this.combineWireframes(wireframes);

      console.log("✅ Components imported successfully");
      return result;
    } catch (error) {
      console.error("❌ Failed to import components:", error);
      throw error;
    }
  }

  /**
   * Combine multiple wireframes
   */
  combineWireframes(wireframes) {
    // Simple combination - in a real implementation you'd merge HTML more intelligently
    const combinedHtml = wireframes.map((w) => w.html).join("\n\n");
    const allComponents = wireframes.flatMap((w) => w.components);

    return {
      html: combinedHtml,
      components: allComponents,
      libraries: wireframes.map((w) => w.type),
      timestamp: new Date().toISOString(),
      combined: true,
    };
  }

  /**
   * Get popular/trending components
   */
  getPopularComponents(limit = 10) {
    return Array.from(this.componentLibrary.values())
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  /**
   * Get recently used components
   */
  getRecentComponents(limit = 10) {
    return Array.from(this.componentLibrary.values())
      .filter((c) => c.lastUsed)
      .sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed))
      .slice(0, limit);
  }

  /**
   * Get component statistics
   */
  getStatistics() {
    const categories = this.getCategories();
    const libraries = Array.from(
      new Set(Array.from(this.componentLibrary.values()).map((c) => c.library))
    );

    return {
      totalComponents: this.componentLibrary.size,
      categories: categories.map((cat) => ({
        name: cat,
        count: this.getComponentsByCategory(cat).length,
      })),
      libraries: libraries.map((lib) => ({
        name: lib,
        count: Array.from(this.componentLibrary.values()).filter(
          (c) => c.library === lib
        ).length,
      })),
      totalUsage: Array.from(this.componentLibrary.values()).reduce(
        (sum, c) => sum + c.usageCount,
        0
      ),
    };
  }

  /**
   * Get all components
   */
  async getAllComponents() {
    await this.ensureInitialized();
    return Array.from(this.componentLibrary.values());
  }

  /**
   * Get component by ID
   */
  async getComponentById(componentId) {
    await this.ensureInitialized();
    return this.componentLibrary.get(componentId) || null;
  }

  /**
   * Get component variants
   */
  async getComponentVariants(componentId) {
    const component = await this.getComponentById(componentId);
    return component ? component.variants : [];
  }

  /**
   * Get component usage statistics
   */
  async getComponentUsage(componentId) {
    const component = await this.getComponentById(componentId);
    return component
      ? { usageCount: component.usageCount, lastUsed: component.lastUsed }
      : { usageCount: 0 };
  }

  /**
   * Generate wireframe from component
   */
  async generateWireframeFromComponent(component, options = {}) {
    if (!component) throw new Error("Component not found");

    const wireframe = await this.importComponentsToWireframe(
      [component.id],
      options.layout || "default"
    );
    return {
      html: wireframe.html,
      css: "", // CSS would be included in the wireframe
      component: component,
    };
  }

  /**
   * Ensure browser is initialized
   */
  async ensureInitialized() {
    if (this.componentLibrary.size === 0) {
      await this.init();
    }
  }
}

module.exports = FigmaComponentBrowser;
