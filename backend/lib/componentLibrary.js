// Pre-built Component Library (Lovable-style)
// Reusable components that Claude can reference and compose

const COMPONENT_LIBRARY = {
  // Navigation Components
  navigation: {
    horizontal: {
      name: "Horizontal Navigation",
      description: "Top navigation bar with logo and links",
      html: `
        <nav style="background: #fff; border-bottom: 1px solid #e5e7eb; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 1.5rem; font-weight: 700; color: #111827;">Logo</div>
          <ul style="display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0;">
            <li><a href="#" style="color: #374151; text-decoration: none; font-weight: 500;">Home</a></li>
            <li><a href="#" style="color: #374151; text-decoration: none; font-weight: 500;">About</a></li>
            <li><a href="#" style="color: #374151; text-decoration: none; font-weight: 500;">Services</a></li>
            <li><a href="#" style="color: #374151; text-decoration: none; font-weight: 500;">Contact</a></li>
          </ul>
        </nav>
      `,
    },
    sidebar: {
      name: "Sidebar Navigation",
      description: "Vertical sidebar with navigation links",
      html: `
        <aside style="width: 250px; background: #f9fafb; border-right: 1px solid #e5e7eb; padding: 2rem 1rem; min-height: 100vh;">
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; color: #111827;">Menu</h3>
          <nav>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
              <li><a href="#" style="display: block; padding: 0.75rem 1rem; color: #374151; text-decoration: none; border-radius: 0.5rem; transition: background 0.2s;">Dashboard</a></li>
              <li><a href="#" style="display: block; padding: 0.75rem 1rem; color: #374151; text-decoration: none; border-radius: 0.5rem; transition: background 0.2s;">Projects</a></li>
              <li><a href="#" style="display: block; padding: 0.75rem 1rem; color: #374151; text-decoration: none; border-radius: 0.5rem; transition: background 0.2s;">Settings</a></li>
            </ul>
          </nav>
        </aside>
      `,
    },
  },

  // Button Components
  buttons: {
    primary: {
      name: "Primary Button",
      description: "Main call-to-action button",
      html: `
        <button style="background: #2563eb; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 1rem; cursor: pointer; transition: background 0.2s;">
          Primary Action
        </button>
      `,
    },
    secondary: {
      name: "Secondary Button",
      description: "Secondary action button",
      html: `
        <button style="background: transparent; color: #2563eb; padding: 0.75rem 1.5rem; border: 2px solid #2563eb; border-radius: 0.5rem; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.2s;">
          Secondary Action
        </button>
      `,
    },
  },

  // Card Components
  cards: {
    basic: {
      name: "Basic Card",
      description: "Simple content card",
      html: `
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; color: #111827;">Card Title</h3>
          <p style="color: #6b7280; line-height: 1.6; margin-bottom: 1rem;">Card content goes here. This is a reusable card component.</p>
          <button style="background: #2563eb; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; font-weight: 500; cursor: pointer;">Learn More</button>
        </div>
      `,
    },
    feature: {
      name: "Feature Card",
      description: "Card with icon for features",
      html: `
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center;">
          <div style="width: 64px; height: 64px; background: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 2rem;">⚡</div>
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; color: #111827;">Feature Name</h3>
          <p style="color: #6b7280; line-height: 1.6;">Brief description of this feature and its benefits.</p>
        </div>
      `,
    },
  },

  // Form Components
  forms: {
    input: {
      name: "Text Input",
      description: "Standard text input field",
      html: `
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Label</label>
          <input type="text" placeholder="Enter text..." style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; box-sizing: border-box;">
        </div>
      `,
    },
    textarea: {
      name: "Text Area",
      description: "Multi-line text input",
      html: `
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Message</label>
          <textarea placeholder="Enter message..." rows="4" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; box-sizing: border-box; resize: vertical;"></textarea>
        </div>
      `,
    },
    select: {
      name: "Select Dropdown",
      description: "Dropdown selection field",
      html: `
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Select Option</label>
          <select style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; box-sizing: border-box; background: white;">
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
      `,
    },
  },

  // Hero Sections
  heroes: {
    centered: {
      name: "Centered Hero",
      description: "Hero section with centered content",
      html: `
        <section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 6rem 2rem; text-align: center;">
          <h1 style="font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; margin-bottom: 1.5rem;">Hero Title</h1>
          <p style="font-size: 1.25rem; max-width: 600px; margin: 0 auto 2rem; opacity: 0.95;">Compelling subtitle that explains the value proposition.</p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button style="background: white; color: #667eea; padding: 1rem 2rem; border: none; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem; cursor: pointer;">Get Started</button>
            <button style="background: transparent; color: white; padding: 1rem 2rem; border: 2px solid white; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem; cursor: pointer;">Learn More</button>
          </div>
        </section>
      `,
    },
  },

  // Footer Components
  footers: {
    simple: {
      name: "Simple Footer",
      description: "Basic footer with links",
      html: `
        <footer style="background: #111827; color: white; padding: 3rem 2rem; margin-top: auto;">
          <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
            <div>
              <h4 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 1rem;">Company</h4>
              <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
                <li><a href="#" style="color: #9ca3af; text-decoration: none;">About</a></li>
                <li><a href="#" style="color: #9ca3af; text-decoration: none;">Careers</a></li>
                <li><a href="#" style="color: #9ca3af; text-decoration: none;">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 1rem;">Resources</h4>
              <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
                <li><a href="#" style="color: #9ca3af; text-decoration: none;">Blog</a></li>
                <li><a href="#" style="color: #9ca3af; text-decoration: none;">Docs</a></li>
                <li><a href="#" style="color: #9ca3af; text-decoration: none;">Support</a></li>
              </ul>
            </div>
          </div>
          <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #374151; color: #9ca3af;">
            © 2024 Company Name. All rights reserved.
          </div>
        </footer>
      `,
    },
  },
};

/**
 * Get all components as a flat list for Claude
 */
function getComponentList() {
  const components = [];

  Object.entries(COMPONENT_LIBRARY).forEach(([category, items]) => {
    Object.entries(items).forEach(([key, component]) => {
      components.push({
        id: `${category}-${key}`,
        category,
        ...component,
      });
    });
  });

  return components;
}

/**
 * Get component by ID
 */
function getComponent(id) {
  const [category, key] = id.split("-");
  return COMPONENT_LIBRARY[category]?.[key] || null;
}

/**
 * Get components by category
 */
function getComponentsByCategory(category) {
  const categoryData = COMPONENT_LIBRARY[category];
  if (!categoryData) return [];

  return Object.entries(categoryData).map(([key, component]) => ({
    id: `${category}-${key}`,
    category,
    ...component,
  }));
}

module.exports = {
  COMPONENT_LIBRARY,
  getComponentList,
  getComponent,
  getComponentsByCategory,
};
