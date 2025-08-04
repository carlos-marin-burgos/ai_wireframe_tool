/**
 * Atlas Component Library - Backend Component Generator
 * Provides consistent HTML components for wireframe generation
 */

class AtlasComponentLibrary {
  constructor() {
    this.baseStyles = `
      <style>
        .atlas-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .atlas-header { background: #0078d4; color: white; padding: 1rem 0; }
        .atlas-hero { background: #f5f5f5; padding: 60px 0; text-align: center; }
        .atlas-button { background: #0078d4; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; }
        .atlas-input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 16px; }
        .atlas-textarea { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 16px; resize: vertical; }
        .atlas-footer { background: #333; color: white; padding: 40px 0; text-align: center; }
        .atlas-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .atlas-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
      </style>
    `;
  }

  /**
   * Generate HTML component based on type and options
   * @param {string} type - Component type
   * @param {object} options - Component options
   * @returns {string} Generated HTML
   */
  generateComponent(type, options = {}) {
    switch (type) {
      case 'site-header':
        return this.generateSiteHeader(options);
      
      case 'hero-section':
        return this.generateHeroSection(options);
      
      case 'container':
        return this.generateContainer(options);
      
      case 'heading':
        return this.generateHeading(options);
      
      case 'paragraph':
        return this.generateParagraph(options);
      
      case 'input-field':
        return this.generateInputField(options);
      
      case 'textarea-field':
        return this.generateTextareaField(options);
      
      case 'primary-button':
        return this.generatePrimaryButton(options);
      
      case 'footer':
        return this.generateFooter(options);
      
      case 'card':
        return this.generateCard(options);
      
      case 'grid':
        return this.generateGrid(options);
      
      default:
        return `<!-- Unknown component: ${type} -->`;
    }
  }

  generateSiteHeader(options = {}) {
    const title = options.title || 'Atlas Design System';
    const navigation = options.navigation || [
      { text: 'Home', href: '#' },
      { text: 'About', href: '#' },
      { text: 'Services', href: '#' },
      { text: 'Contact', href: '#' }
    ];

    const navItems = navigation.map(item => 
      `<a href="${item.href}" style="color: white; text-decoration: none; margin: 0 15px;">${item.text}</a>`
    ).join('');

    return `
      <header class="atlas-header">
        <div class="atlas-container">
          <nav style="display: flex; justify-content: space-between; align-items: center;">
            <h1 style="margin: 0; font-size: 1.5rem;">${title}</h1>
            <div>${navItems}</div>
          </nav>
        </div>
      </header>
    `;
  }

  generateHeroSection(options = {}) {
    const title = options.title || 'Welcome to Atlas';
    const subtitle = options.subtitle || 'Building beautiful web experiences';
    const buttonText = options.buttonText || 'Get Started';
    const buttonHref = options.buttonHref || '#';

    return `
      <section class="atlas-hero">
        <div class="atlas-container">
          <h1 style="font-size: 3rem; margin-bottom: 1rem; color: #333;">${title}</h1>
          <p style="font-size: 1.25rem; margin-bottom: 2rem; color: #666;">${subtitle}</p>
          <a href="${buttonHref}" class="atlas-button" style="text-decoration: none; display: inline-block;">${buttonText}</a>
        </div>
      </section>
    `;
  }

  generateContainer(options = {}) {
    const content = options.content || '';
    const className = options.className || '';
    
    return `
      <div class="atlas-container ${className}">
        ${content}
      </div>
    `;
  }

  generateHeading(options = {}) {
    const text = options.text || 'Heading';
    const level = options.level || 2;
    const className = options.className || '';
    
    return `<h${level} class="${className}" style="color: #333; margin-bottom: 1rem;">${text}</h${level}>`;
  }

  generateParagraph(options = {}) {
    const text = options.text || 'Paragraph text';
    const className = options.className || '';
    
    return `<p class="${className}" style="color: #666; line-height: 1.6; margin-bottom: 1rem;">${text}</p>`;
  }

  generateInputField(options = {}) {
    const label = options.label || 'Input Field';
    const placeholder = options.placeholder || '';
    const type = options.type || 'text';
    const required = options.required ? 'required' : '';
    const id = options.id || label.toLowerCase().replace(/\s+/g, '-');
    
    return `
      <div style="margin-bottom: 1rem;">
        <label for="${id}" style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #333;">${label}</label>
        <input type="${type}" id="${id}" name="${id}" placeholder="${placeholder}" class="atlas-input" ${required}>
      </div>
    `;
  }

  generateTextareaField(options = {}) {
    const label = options.label || 'Message';
    const placeholder = options.placeholder || '';
    const rows = options.rows || 4;
    const required = options.required ? 'required' : '';
    const id = options.id || label.toLowerCase().replace(/\s+/g, '-');
    
    return `
      <div style="margin-bottom: 1rem;">
        <label for="${id}" style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #333;">${label}</label>
        <textarea id="${id}" name="${id}" placeholder="${placeholder}" rows="${rows}" class="atlas-textarea" ${required}></textarea>
      </div>
    `;
  }

  generatePrimaryButton(options = {}) {
    const text = options.text || 'Button';
    const href = options.href || '#';
    const type = options.type || 'button';
    const className = options.className || '';
    
    if (options.href) {
      return `<a href="${href}" class="atlas-button ${className}" style="text-decoration: none; display: inline-block;">${text}</a>`;
    } else {
      return `<button type="${type}" class="atlas-button ${className}">${text}</button>`;
    }
  }

  generateFooter(options = {}) {
    const copyright = options.copyright || '© 2025 Atlas Design System. All rights reserved.';
    const links = options.links || [
      { text: 'Privacy Policy', href: '#' },
      { text: 'Terms of Service', href: '#' },
      { text: 'Contact', href: '#' }
    ];

    const linkItems = links.map(link => 
      `<a href="${link.href}" style="color: #ccc; text-decoration: none; margin: 0 10px;">${link.text}</a>`
    ).join('');

    return `
      <footer class="atlas-footer">
        <div class="atlas-container">
          <div style="margin-bottom: 1rem;">${linkItems}</div>
          <p style="margin: 0; color: #ccc;">${copyright}</p>
        </div>
      </footer>
    `;
  }

  generateCard(options = {}) {
    const title = options.title || 'Card Title';
    const content = options.content || 'Card content goes here.';
    const className = options.className || '';
    
    return `
      <div class="atlas-card ${className}">
        <h3 style="margin-top: 0; color: #333;">${title}</h3>
        <div style="color: #666;">${content}</div>
      </div>
    `;
  }

  generateGrid(options = {}) {
    const items = options.items || [];
    const className = options.className || '';
    
    const gridItems = items.map(item => this.generateCard(item)).join('');
    
    return `
      <div class="atlas-grid ${className}">
        ${gridItems}
      </div>
    `;
  }

  /**
   * Get base styles for injection into HTML head
   * @returns {string} CSS styles
   */
  getBaseStyles() {
    return this.baseStyles;
  }
}

module.exports = AtlasComponentLibrary;
