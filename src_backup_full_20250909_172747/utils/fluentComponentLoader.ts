/**
 * Fluent UI Component Loader
 * Loads and manages Fluent UI components from the library
 */

export interface FluentComponent {
  id: string;
  name: string;
  category: string;
  description: string;
  html: string;
  css?: string;
  tags: string[];
  icon?: string;
  preview?: string;
}

export interface FluentLibrary {
  categories: Record<string, FluentComponent[]>;
  components: FluentComponent[];
}

class FluentComponentLoader {
  private library: FluentLibrary | null = null;
  private loadingPromise: Promise<FluentLibrary> | null = null;

  /**
   * Load the Fluent UI component library
   */
  async loadLibrary(): Promise<FluentLibrary> {
    if (this.library) {
      return this.library;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this.fetchLibrary();
    this.library = await this.loadingPromise;
    this.loadingPromise = null;

    return this.library;
  }

  /**
   * Fetch the library from the JSON file
   */
  private async fetchLibrary(): Promise<FluentLibrary> {
    try {
      const response = await fetch("/fluent-library.json");
      if (!response.ok) {
        throw new Error(
          `Failed to load Fluent library: ${response.statusText}`
        );
      }

      const data = await response.json();

      // Ensure the data structure is correct
      if (!data.categories || !data.components) {
        throw new Error("Invalid Fluent library format");
      }

      return data as FluentLibrary;
    } catch (error) {
      console.error("Error loading Fluent library:", error);

      // Return a fallback library with basic components
      return this.getFallbackLibrary();
    }
  }

  /**
   * Get components by category
   */
  async getComponentsByCategory(category: string): Promise<FluentComponent[]> {
    const library = await this.loadLibrary();
    return library.categories[category] || [];
  }

  /**
   * Get all available categories
   */
  async getCategories(): Promise<string[]> {
    const library = await this.loadLibrary();
    return Object.keys(library.categories);
  }

  /**
   * Search components by name or tags
   */
  async searchComponents(query: string): Promise<FluentComponent[]> {
    const library = await this.loadLibrary();
    const searchTerm = query.toLowerCase();

    return library.components.filter(
      (component) =>
        component.name.toLowerCase().includes(searchTerm) ||
        component.description.toLowerCase().includes(searchTerm) ||
        component.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }

  /**
   * Get a specific component by ID
   */
  async getComponent(id: string): Promise<FluentComponent | null> {
    const library = await this.loadLibrary();
    return library.components.find((component) => component.id === id) || null;
  }

  /**
   * Get all components
   */
  async getAllComponents(): Promise<FluentComponent[]> {
    const library = await this.loadLibrary();
    return library.components;
  }

  /**
   * Get popular/recommended components
   */
  async getPopularComponents(limit: number = 8): Promise<FluentComponent[]> {
    const library = await this.loadLibrary();

    // Return components from common categories
    const popularCategories = ["buttons", "navigation", "cards", "forms"];
    const popular: FluentComponent[] = [];

    for (const category of popularCategories) {
      const categoryComponents = library.categories[category] || [];
      popular.push(...categoryComponents.slice(0, 2));

      if (popular.length >= limit) break;
    }

    return popular.slice(0, limit);
  }

  /**
   * Fallback library with basic components
   */
  private getFallbackLibrary(): FluentLibrary {
    const fallbackComponents: FluentComponent[] = [
      {
        id: "primary-button",
        name: "Primary Button",
        category: "buttons",
        description: "A primary action button with Fluent design",
        html: `<button class="fluent-button fluent-button-primary">
  <span class="fluent-button-content">
    <span class="fluent-button-text">Primary Action</span>
  </span>
</button>`,
        css: `.fluent-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid transparent;
  font-family: "Segoe UI", system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.1s ease;
}

.fluent-button-primary {
  background: #8E9AAF;
  color: white;
}

.fluent-button-primary:hover {
  background: #68769C;
}

.fluent-button-primary:active {
  background: #68769C;
}`,
        tags: ["button", "primary", "action"],
        icon: "button",
      },
      {
        id: "navigation-card",
        name: "Navigation Card",
        category: "cards",
        description: "A card component for navigation or content display",
        html: `<div class="fluent-card">
  <div class="fluent-card-header">
    <h3 class="fluent-card-title">Card Title</h3>
  </div>
  <div class="fluent-card-content">
    <p>Card content goes here. This is a description of what this card contains.</p>
  </div>
  <div class="fluent-card-actions">
    <button class="fluent-button fluent-button-primary">Action</button>
  </div>
</div>`,
        css: `.fluent-card {
  background: white;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.fluent-card-header {
  padding: 16px 16px 0;
}

.fluent-card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #3C4858;
}

.fluent-card-content {
  padding: 12px 16px;
  color: #68769C;
}

.fluent-card-actions {
  padding: 0 16px 16px;
}`,
        tags: ["card", "navigation", "content"],
        icon: "card",
      },
    ];

    return {
      categories: {
        buttons: [fallbackComponents[0]],
        cards: [fallbackComponents[1]],
      },
      components: fallbackComponents,
    };
  }

  /**
   * Clear the loaded library (useful for testing or reloading)
   */
  clearCache(): void {
    this.library = null;
    this.loadingPromise = null;
  }
}

// Export singleton instance
export const fluentComponentLoader = new FluentComponentLoader();
export default fluentComponentLoader;
