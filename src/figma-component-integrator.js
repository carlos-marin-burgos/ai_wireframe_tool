/**import React from 'react';

 * Figma Component Integration Helper  

 * Integrates imported Figma wireframe components into the existing Designetica wireframe system  const Figma-component-integrator = () =>  {

 */	return (

	  <div>

export class FigmaComponentIntegrator {	  </div>

    constructor() {	);

        this.componentManifest = null;  }

        this.loadManifest();  

    }  export default Figma-component-integrator;

  
    async loadManifest() {
        try {
            const response = await fetch('./component-library-manifest.json');
            this.componentManifest = await response.json();
            console.log('📋 Component manifest loaded:', this.componentManifest.sections.length, 'sections');
        } catch (error) {
            console.warn('⚠️ Component manifest not found, using fallback data');
            this.componentManifest = this.getFallbackManifest();
        }
    }

    getFallbackManifest() {
        return {
            imported: new Date().toISOString(),
            sections: [
                { name: 'Hero Sections', nodeId: '4302:1228097', bodyFile: 'body-hero-sections.html' },
                { name: 'Forms', nodeId: '4303:636742', bodyFile: 'body-forms.html' },
                { name: 'Navigation', nodeId: '4302:1142033', bodyFile: 'body-navigation.html' },
                { name: 'Page Headers', nodeId: '3312:105535', bodyFile: 'body-page-headers.html' },
                { name: 'Call to Actions', nodeId: '4302:1373485', bodyFile: 'body-call-to-actions.html' },
                { name: 'Mobile Navigation', nodeId: '4302:1085774', bodyFile: 'body-mobile-navigation.html' }
            ]
        };
    }

    /**
     * Get a specific component section by name
     */
    async getComponentSection(sectionName) {
        if (!this.componentManifest) await this.loadManifest();
        
        const section = this.componentManifest.sections.find(s => 
            s.name.toLowerCase().includes(sectionName.toLowerCase())
        );
        
        if (!section) {
            throw new Error(`Component section "${sectionName}" not found`);
        }

        try {
            const response = await fetch(`./${section.bodyFile}`);
            const html = await response.text();
            return { ...section, html };
        } catch (error) {
            // Fallback to API import
            return await this.importFromApi(section.nodeId);
        }
    }

    /**
     * Import fresh component data via API
     */
    async importFromApi(nodeId, options = {}) {
        const response = await fetch('/api/figma-wireframe-import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nodeIds: nodeId,
                preserveText: options.preserveText !== false,
                inlineCss: options.inlineCss !== false,
                wrapRoot: options.wrapRoot !== false
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to import component: ${response.statusText}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || 'Import failed');
        }

        return result;
    }

    /**
     * Extract individual components from a section
     */
    extractComponents(sectionHtml) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(sectionHtml, 'text/html');
        
        // Find all top-level wireframe components
        const components = doc.querySelectorAll('.wireframe-component[data-node-type]');
        
        return Array.from(components).map((component, index) => ({
            id: `component-${index}`,
            type: component.getAttribute('data-node-type'),
            className: component.className,
            html: component.outerHTML,
            textContent: component.textContent.trim()
        }));
    }

    /**
     * Integrate component into existing wireframe
     */
    integrateComponent(targetContainer, componentHtml, options = {}) {
        const { 
            position = 'append', 
            wrapInContainer = true,
            addSpacing = true 
        } = options;

        let content = componentHtml;
        
        if (wrapInContainer) {
            content = `<div class="figma-component-wrapper">${content}</div>`;
        }

        if (addSpacing) {
            content = `<div style="margin: 1rem 0;">${content}</div>`;
        }

        switch (position) {
            case 'prepend':
                targetContainer.insertAdjacentHTML('afterbegin', content);
                break;
            case 'append':
                targetContainer.insertAdjacentHTML('beforeend', content);
                break;
            case 'replace':
                targetContainer.innerHTML = content;
                break;
            default:
                targetContainer.insertAdjacentHTML('beforeend', content);
        }

        // Trigger custom event for integration tracking
        targetContainer.dispatchEvent(new CustomEvent('figmaComponentIntegrated', {
            detail: { componentHtml, options }
        }));
    }

    /**
     * Quick integration methods for common use cases
     */
    async addHeroSection(container, preserveText = true) {
        const section = await this.getComponentSection('hero');
        this.integrateComponent(container, section.html, { position: 'prepend' });
        return section;
    }

    async addNavigationBar(container) {
        const section = await this.getComponentSection('navigation');
        this.integrateComponent(container, section.html, { position: 'prepend', addSpacing: false });
        return section;
    }

    async addFormSection(container) {
        const section = await this.getComponentSection('forms');
        this.integrateComponent(container, section.html);
        return section;
    }

    async addCallToAction(container) {
        const section = await this.getComponentSection('call to actions');
        this.integrateComponent(container, section.html);
        return section;
    }

    /**
     * Batch integration for full page layouts
     */
    async createLandingPageLayout(container) {
        console.log('🏗️ Creating landing page layout...');
        
        try {
            // Add navigation first
            await this.addNavigationBar(container);
            
            // Add hero section
            await this.addHeroSection(container);
            
            // Add CTA section
            await this.addCallToAction(container);
            
            console.log('✅ Landing page layout created');
            return true;
        } catch (error) {
            console.error('❌ Failed to create landing page layout:', error);
            throw error;
        }
    }

    /**
     * Get available component sections
     */
    getAvailableSections() {
        if (!this.componentManifest) return [];
        return this.componentManifest.sections.map(s => ({
            name: s.name,
            nodeId: s.nodeId,
            count: s.count || 0
        }));
    }

    /**
     * Search components by keywords
     */
    searchComponents(query) {
        if (!this.componentManifest) return [];
        
        const lowercaseQuery = query.toLowerCase();
        return this.componentManifest.sections.filter(section => 
            section.name.toLowerCase().includes(lowercaseQuery)
        );
    }
}

// Usage examples:
/*
// Initialize integrator
const integrator = new FigmaComponentIntegrator();

// Add specific components
const wireframeContainer = document.getElementById('wireframe-container');
await integrator.addHeroSection(wireframeContainer);

// Create full layout
await integrator.createLandingPageLayout(wireframeContainer);

// Get specific component
const heroSection = await integrator.getComponentSection('hero');
console.log(heroSection.html);

// Import fresh from API
const freshComponent = await integrator.importFromApi('4302:1228097');
*/
