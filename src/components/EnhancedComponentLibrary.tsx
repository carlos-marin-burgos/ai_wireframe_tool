/**
 * Enhanced Component Library with organized sources
 * - Fluent UI: GitHub microsoft/fluentui (Fluent Dev Playbook)
 * - Atlas: GitHub microsoft/atlas-design (Atlas Dev Playbook)  
 * - Figma: Fluent & Atlas design files
 */

import React, { useState, useMemo, useEffect } from 'react';
import './EnhancedComponentLibrary.css';

type ComponentSource = 'fluent' | 'atlas' | 'figma-fluent' | 'figma-atlas' | 'figma-azure' | 'azure-services';

interface Component {
    id: string;
    name: string;
    description: string;
    category: string;
    htmlCode: string;
    preview?: string;
    source: ComponentSource;
    sourceUrl?: string;
    playbook?: 'Fluent Dev Playbook' | 'Atlas Dev Playbook' | 'Azure Dev Playbook' | 'Figma Fluent Library' | 'Figma Atlas Library' | 'Figma Azure Library';
    library?: 'dev-playbooks' | 'figma-components';
    collection?: string;
}

interface EnhancedComponentLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onAddComponent: (component: Component) => void;
    onGenerateWithAI?: (description: string) => void;
    currentDescription?: string;
    libraryType?: 'dev-playbooks' | 'figma-components';
}

const EnhancedComponentLibrary: React.FC<EnhancedComponentLibraryProps> = ({
    isOpen,
    onClose,
    onAddComponent,
    onGenerateWithAI,
    currentDescription,
    libraryType
}) => {
    // Get available playbooks based on library type
    const getAvailablePlaybooks = (): ('Fluent Dev Playbook' | 'Atlas Dev Playbook' | 'Azure Dev Playbook' | 'Figma Fluent Library' | 'Figma Atlas Library' | 'Figma Azure Library')[] => {
        if (libraryType === 'dev-playbooks') {
            return ['Fluent Dev Playbook', 'Atlas Dev Playbook', 'Azure Dev Playbook'];
        } else if (libraryType === 'figma-components') {
            return ['Figma Fluent Library', 'Figma Atlas Library', 'Figma Azure Library'];
        }
        return ['Fluent Dev Playbook', 'Atlas Dev Playbook', 'Azure Dev Playbook', 'Figma Fluent Library', 'Figma Atlas Library', 'Figma Azure Library'];
    };

    const availablePlaybooks = getAvailablePlaybooks();
    const defaultPlaybook = availablePlaybooks[0];

    // State management
    const [selectedPlaybook, setSelectedPlaybook] = useState<'Fluent Dev Playbook' | 'Atlas Dev Playbook' | 'Azure Dev Playbook' | 'Figma Fluent Library' | 'Figma Atlas Library' | 'Figma Azure Library'>(defaultPlaybook);
    const [selectedSource, setSelectedSource] = useState<'all' | 'fluent-github' | 'atlas-github' | 'azure-services' | 'figma-fluent' | 'figma-atlas' | 'figma-azure'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loadedComponents, setLoadedComponents] = useState<Component[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedComponentIds, setSelectedComponentIds] = useState<Set<string>>(new Set());

    // Load components based on selected playbook
    useEffect(() => {
        if (isOpen) {
            // Reset source filter when changing playbooks
            setSelectedSource('all');
            loadComponentsForPlaybook();
        }
    }, [isOpen, selectedPlaybook]);

    const loadComponentsForPlaybook = async () => {
        setLoading(true);
        try {
            let components: Component[] = [];

            switch (selectedPlaybook) {
                case 'Fluent Dev Playbook':
                    components = await loadFluentComponents();
                    break;
                case 'Atlas Dev Playbook':
                    components = await loadAtlasComponents();
                    break;
                case 'Azure Dev Playbook':
                    console.log('🔥 Loading Azure Dev Playbook');
                    components = await loadAzureServiceComponents();
                    console.log('🔥 Azure components loaded:', components.length);
                    break;
                case 'Figma Fluent Library':
                    components = await loadFigmaFluentComponents();
                    break;
                case 'Figma Atlas Library':
                    components = await loadFigmaAtlasComponents();
                    break;
                case 'Figma Azure Library':
                    components = await loadFigmaAzureComponents();
                    break;
            }

            setLoadedComponents(components);
            console.log('🎯 Components set to state:', components.length);
        } catch (error) {
            console.error('Error loading components:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load Fluent UI components from GitHub/library
    const loadFluentComponents = async (): Promise<Component[]> => {
        try {
            const response = await fetch('/fluent-library.json');
            if (!response.ok) throw new Error('Failed to load Fluent UI components');

            const data = await response.json();
            return data.components.map((comp: any) => ({
                id: comp.id,
                name: comp.name,
                description: comp.description,
                category: comp.category,
                htmlCode: comp.htmlCode,
                source: 'fluent-github' as const,
                sourceUrl: comp.githubPath ? `https://github.com/microsoft/fluentui/tree/master/packages/${comp.githubPath}` : undefined,
                playbook: 'Fluent Dev Playbook' as const
            }));
        } catch (error) {
            console.error('Error loading Fluent components:', error);
            return [];
        }
    };

    // Load Atlas components from Microsoft Learn Design System
    const loadAtlasComponents = async (): Promise<Component[]> => {
        try {
            const response = await fetch('/atlas-library.json');
            if (!response.ok) throw new Error('Failed to load Atlas components');

            const data = await response.json();
            return data.components.map((comp: any) => ({
                id: comp.id,
                name: comp.name,
                description: comp.description,
                category: comp.category,
                htmlCode: comp.htmlCode,
                source: 'atlas-github' as const,
                sourceUrl: comp.atlasUrl || `https://design.learn.microsoft.com/atomics/${comp.category.toLowerCase()}`,
                playbook: 'Atlas Dev Playbook' as const
            }));
        } catch (error) {
            console.error('Error loading Atlas components:', error);
            return [];
        }
    };

    // Load Figma Fluent components only
    const loadFigmaFluentComponents = async (): Promise<Component[]> => {
        try {
            const response = await fetch('/figma-fluent-library.json');
            if (response.ok) {
                const data = await response.json();
                const components = data.components.map((comp: any) => ({
                    id: comp.id,
                    name: comp.name,
                    description: comp.description,
                    category: comp.category,
                    htmlCode: comp.htmlCode,
                    source: 'figma-fluent' as const,
                    sourceUrl: comp.sourceUrl,
                    playbook: 'Figma Fluent Library' as const
                }));
                console.log(`✅ Loaded ${components.length} Fluent Figma components`);
                return components;
            }
        } catch (error) {
            console.warn('Could not load Fluent Figma library:', error);
        }

        // Fallback component
        return [{
            id: 'figma-fluent-button-set',
            name: 'Fluent Button Set',
            description: 'Complete button component set from Fluent 2 Figma library',
            category: 'Buttons',
            source: 'figma-fluent',
            sourceUrl: 'https://www.figma.com/design/GvIcCw0tWaJVDSWD4f1OIW/Fluent-2-web?node-id=0-1&p=f&t=0UVE7Ann6oVPNlGW-0',
            playbook: 'Figma Fluent Library',
            htmlCode: `
            <div style="padding: 24px; background: #f8f9fa; border-radius: 8px; font-family: 'Segoe UI', sans-serif;">
                <h3 style="margin: 0 0 16px 0; color: #323130;">Fluent Button Components</h3>
                <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
                    <button style="background: #0078d4; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: 600;">Primary</button>
                    <button style="background: transparent; color: #0078d4; border: 1px solid #0078d4; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: 600;">Secondary</button>
                    <button style="background: transparent; color: #323130; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: 600;">Subtle</button>
                    <button style="background: #f3f2f1; color: #a19f9d; border: none; padding: 10px 20px; border-radius: 4px; cursor: not-allowed; font-weight: 600;" disabled>Disabled</button>
                </div>
                <p style="margin: 16px 0 0 0; font-size: 12px; color: #605e5c;">From Fluent 2 Figma Design System (Fallback)</p>
            </div>`
        }];
    };

    // Load Figma Atlas components only
    const loadFigmaAtlasComponents = async (): Promise<Component[]> => {
        try {
            const response = await fetch('/figma-atlas-library.json');
            if (response.ok) {
                const data = await response.json();
                const components = data.components.map((comp: any) => ({
                    id: comp.id,
                    name: comp.name,
                    description: comp.description,
                    category: comp.category,
                    htmlCode: comp.htmlCode,
                    source: 'figma-atlas' as const,
                    sourceUrl: comp.sourceUrl,
                    playbook: 'Figma Atlas Library' as const
                }));
                console.log(`✅ Loaded ${components.length} Atlas Figma components`);
                return components;
            }
        } catch (error) {
            console.warn('Could not load Atlas Figma library:', error);
        }

        // Fallback component
        return [{
            id: 'figma-atlas-navigation',
            name: 'Atlas Navigation',
            description: 'Navigation component from Atlas Figma library',
            category: 'Navigation',
            source: 'figma-atlas',
            sourceUrl: 'https://www.figma.com/design/PuWj05uKXhfbqrhmJLtCij/Atlas-library-for-designetica?node-id=1-4688',
            playbook: 'Figma Atlas Library',
            htmlCode: `
            <div style="background: white; border: 1px solid #e1e5e9; border-radius: 8px; overflow: hidden; font-family: 'Segoe UI', sans-serif;">
                <div style="background: #0078d4; color: white; padding: 16px 24px;">
                    <h3 style="margin: 0; font-size: 18px;">Atlas Navigation</h3>
                </div>
                <nav style="padding: 16px 0;">
                    <a href="#" style="display: block; padding: 12px 24px; color: #323130; text-decoration: none; border-left: 3px solid #0078d4; background: #f3f9ff;">Dashboard</a>
                    <a href="#" style="display: block; padding: 12px 24px; color: #605e5c; text-decoration: none; border-left: 3px solid transparent;">Analytics</a>
                    <a href="#" style="display: block; padding: 12px 24px; color: #605e5c; text-decoration: none; border-left: 3px solid transparent;">Projects</a>
                    <a href="#" style="display: block; padding: 12px 24px; color: #605e5c; text-decoration: none; border-left: 3px solid transparent;">Settings</a>
                </nav>
                <p style="margin: 0; padding: 16px 24px; font-size: 12px; color: #605e5c; border-top: 1px solid #f3f2f1;">From Atlas Figma Library (Fallback)</p>
            </div>`
        }];
    };

    // Load Figma Azure components only
    const loadFigmaAzureComponents = async (): Promise<Component[]> => {
        try {
            const response = await fetch('/figma-azure-library.json');
            if (response.ok) {
                const data = await response.json();
                const components = data.components.map((comp: any) => ({
                    id: comp.id,
                    name: comp.name,
                    description: comp.description,
                    category: comp.category,
                    htmlCode: comp.htmlCode,
                    source: 'figma-azure' as const,
                    sourceUrl: comp.sourceUrl,
                    playbook: 'Figma Azure Library' as const
                }));
                console.log(`✅ Loaded ${components.length} Azure Figma components`);
                return components;
            }
        } catch (error) {
            console.warn('Could not load Azure Figma library:', error);
        }

        // Fallback component
        return [{
            id: 'figma-azure-dashboard',
            name: 'Azure Resource Dashboard',
            description: 'Azure resource management dashboard from Figma Azure library',
            category: 'Dashboards',
            source: 'figma-azure',
            sourceUrl: 'https://www.figma.com/design/Bwn8rmUOYtnPRwA3JoQTBn/Web-UI-kit---Azure-Fluent-extension?node-id=3002-373291&p=f&t=D0O7CJYPRwQGcynA-0',
            playbook: 'Figma Azure Library',
            htmlCode: `
            <div style="background: white; border: 1px solid #e1dfdd; border-radius: 12px; overflow: hidden; font-family: 'Segoe UI', sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 480px;">
                <div style="background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%); color: white; padding: 24px;">
                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                        <div style="width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <div style="width: 24px; height: 24px; background: white; border-radius: 4px;"></div>
                        </div>
                        <div>
                            <h2 style="margin: 0; font-size: 24px; font-weight: 600;">Azure Portal</h2>
                            <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 14px;">Resource Management Dashboard</p>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
                        <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 28px; font-weight: 700; margin-bottom: 4px;">47</div>
                            <div style="font-size: 12px; opacity: 0.9;">Resources</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 28px; font-weight: 700; margin-bottom: 4px;">12</div>
                            <div style="font-size: 12px; opacity: 0.9;">Services</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 28px; font-weight: 700; margin-bottom: 4px;">3</div>
                            <div style="font-size: 12px; opacity: 0.9;">Regions</div>
                        </div>
                    </div>
                </div>
                <div style="padding: 24px;">
                    <div style="margin-bottom: 20px;">
                        <h3 style="margin: 0 0 12px 0; color: #323130; font-size: 16px; font-weight: 600;">Recent Activity</h3>
                        <div style="space-y: 8px;">
                            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid #f3f2f1;">
                                <div style="width: 8px; height: 8px; background: #107c10; border-radius: 50%;"></div>
                                <span style="flex: 1; font-size: 14px; color: #323130;">App Service deployed successfully</span>
                                <span style="font-size: 12px; color: #605e5c;">2m ago</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid #f3f2f1;">
                                <div style="width: 8px; height: 8px; background: #0078d4; border-radius: 50%;"></div>
                                <span style="flex: 1; font-size: 14px; color: #323130;">SQL Database backup completed</span>
                                <span style="font-size: 12px; color: #605e5c;">15m ago</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 0;">
                                <div style="width: 8px; height: 8px; background: #d83b01; border-radius: 50%;"></div>
                                <span style="flex: 1; font-size: 14px; color: #323130;">Function app scaling event</span>
                                <span style="font-size: 12px; color: #605e5c;">1h ago</span>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button style="background: #0078d4; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; flex: 1;">Manage Resources</button>
                        <button style="background: transparent; color: #0078d4; border: 2px solid #0078d4; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; flex: 1;">View Metrics</button>
                    </div>
                </div>
                <div style="background: #f8f9fa; padding: 12px 24px; font-size: 12px; color: #605e5c; text-align: center;">
                    From Azure Figma Design System (Fallback)
                </div>
            </div>`
        }];
    };

    // Load Azure Service Components
    const loadAzureServiceComponents = async (): Promise<Component[]> => {
        console.log('🚀 Loading Azure Service components!');
        const azureComponents = [
            {
                id: 'azure-resource-group',
                name: 'Resource Group Card',
                description: 'Azure Resource Group management card with resource overview and quick actions',
                category: 'Azure Services',
                source: 'azure-services' as const,
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/overview',
                playbook: 'Azure Dev Playbook' as const,
                htmlCode: `
                    <div style="background: white; border: 1px solid #e1dfdd; border-radius: 8px; padding: 20px; width: 400px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 32px; height: 32px; background: #0078d4; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">RG</div>
                                <div>
                                    <h3 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">my-app-resources</h3>
                                    <p style="margin: 2px 0 0 0; color: #605e5c; font-size: 12px;">East US • Active</p>
                                </div>
                            </div>
                            <button style="background: #0078d4; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">Manage</button>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                            <div style="text-align: center;">
                                <div style="font-size: 20px; font-weight: 600; color: #323130;">12</div>
                                <div style="font-size: 12px; color: #605e5c;">Resources</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 20px; font-weight: 600; color: #107c10;">$47.82</div>
                                <div style="font-size: 12px; color: #605e5c;">Monthly Cost</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 20px; font-weight: 600; color: #0078d4;">3</div>
                                <div style="font-size: 12px; color: #605e5c;">Deployments</div>
                            </div>
                        </div>
                        <div style="border-top: 1px solid #e1dfdd; padding-top: 12px;">
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                <span style="background: #deecf9; color: #0078d4; padding: 4px 8px; border-radius: 12px; font-size: 11px;">App Service</span>
                                <span style="background: #deecf9; color: #0078d4; padding: 4px 8px; border-radius: 12px; font-size: 11px;">SQL Database</span>
                                <span style="background: #deecf9; color: #0078d4; padding: 4px 8px; border-radius: 12px; font-size: 11px;">Storage Account</span>
                            </div>
                        </div>
                    </div>`
            },
            {
                id: 'azure-app-service',
                name: 'App Service Dashboard',
                description: 'Azure App Service monitoring dashboard with deployment status and performance metrics',
                category: 'Azure Services',
                source: 'azure-services' as const,
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/app-service/',
                playbook: 'Azure Dev Playbook' as const,
                htmlCode: `
                    <div style="background: white; border: 1px solid #e1dfdd; border-radius: 8px; width: 450px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="background: #f8f9fa; padding: 16px; border-bottom: 1px solid #e1dfdd; border-radius: 8px 8px 0 0;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width: 32px; height: 32px; background: #0078d4; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">AS</div>
                                    <div>
                                        <h3 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">my-web-app</h3>
                                        <p style="margin: 2px 0 0 0; color: #605e5c; font-size: 12px;">https://my-web-app.azurewebsites.net</p>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 8px; height: 8px; background: #107c10; border-radius: 50%;"></div>
                                    <span style="font-size: 12px; color: #107c10; font-weight: 600;">Running</span>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                                <div>
                                    <div style="font-size: 12px; color: #605e5c; margin-bottom: 4px;">CPU Usage</div>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div style="background: #f3f2f1; height: 8px; border-radius: 4px; flex: 1; position: relative;">
                                            <div style="background: #107c10; height: 100%; width: 35%; border-radius: 4px;"></div>
                                        </div>
                                        <span style="font-size: 14px; font-weight: 600; color: #323130;">35%</span>
                                    </div>
                                </div>
                                <div>
                                    <div style="font-size: 12px; color: #605e5c; margin-bottom: 4px;">Memory Usage</div>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div style="background: #f3f2f1; height: 8px; border-radius: 4px; flex: 1; position: relative;">
                                            <div style="background: #0078d4; height: 100%; width: 67%; border-radius: 4px;"></div>
                                        </div>
                                        <span style="font-size: 14px; font-weight: 600; color: #323130;">67%</span>
                                    </div>
                                </div>
                            </div>
                            <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                                <button style="background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 12px; cursor: pointer; flex: 1;">Deploy</button>
                                <button style="background: transparent; color: #0078d4; border: 1px solid #0078d4; padding: 8px 16px; border-radius: 4px; font-size: 12px; cursor: pointer; flex: 1;">Logs</button>
                            </div>
                            <div style="border-top: 1px solid #e1dfdd; padding-top: 12px; font-size: 12px; color: #605e5c;">
                                Last deployment: 2 hours ago • Build #247
                            </div>
                        </div>
                    </div>`
            },
            {
                id: 'azure-sql-database',
                name: 'SQL Database Panel',
                description: 'Azure SQL Database management panel with connection strings and performance monitoring',
                category: 'Azure Services',
                source: 'azure-services' as const,
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/azure-sql/',
                playbook: 'Azure Dev Playbook' as const,
                htmlCode: `
                    <div style="background: white; border: 1px solid #e1dfdd; border-radius: 8px; width: 380px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="background: #f8f9fa; padding: 16px; border-bottom: 1px solid #e1dfdd; border-radius: 8px 8px 0 0;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width: 32px; height: 32px; background: #0078d4; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">DB</div>
                                    <div>
                                        <h3 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">myapp-database</h3>
                                        <p style="margin: 2px 0 0 0; color: #605e5c; font-size: 12px;">SQL Database • Standard S2</p>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 8px; height: 8px; background: #107c10; border-radius: 50%;"></div>
                                    <span style="font-size: 12px; color: #107c10; font-weight: 600;">Online</span>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 18px; font-weight: 600; color: #323130;">47</div>
                                    <div style="font-size: 11px; color: #605e5c;">DTU Usage</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 18px; font-weight: 600; color: #323130;">23.4 GB</div>
                                    <div style="font-size: 11px; color: #605e5c;">Storage Used</div>
                                </div>
                            </div>
                            <div style="background: #f8f9fa; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                                <div style="font-size: 11px; color: #605e5c; margin-bottom: 4px;">Connection String</div>
                                <div style="font-size: 10px; color: #323130; font-family: 'Courier New', monospace; word-break: break-all;">Server=tcp:myserver.database.windows.net...</div>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button style="background: #0078d4; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Query Editor</button>
                                <button style="background: transparent; color: #0078d4; border: 1px solid #0078d4; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Metrics</button>
                            </div>
                        </div>
                    </div>`
            },
            {
                id: 'azure-storage-account',
                name: 'Storage Account Widget',
                description: 'Azure Storage Account overview with blob containers, file shares, and usage statistics',
                category: 'Azure Services',
                source: 'azure-services' as const,
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/storage/',
                playbook: 'Azure Dev Playbook' as const,
                htmlCode: `
                    <div style="background: white; border: 1px solid #e1dfdd; border-radius: 8px; width: 360px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="background: #f8f9fa; padding: 16px; border-bottom: 1px solid #e1dfdd; border-radius: 8px 8px 0 0;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 32px; height: 32px; background: #0078d4; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">ST</div>
                                <div>
                                    <h3 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">myappstorage</h3>
                                    <p style="margin: 2px 0 0 0; color: #605e5c; font-size: 12px;">General Purpose v2 • Hot Tier</p>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 18px; font-weight: 600; color: #323130;">2.3 GB</div>
                                    <div style="font-size: 11px; color: #605e5c;">Used Storage</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 18px; font-weight: 600; color: #323130;">$4.12</div>
                                    <div style="font-size: 11px; color: #605e5c;">Monthly Cost</div>
                                </div>
                            </div>
                            <div style="margin-bottom: 16px;">
                                <div style="font-size: 12px; color: #605e5c; margin-bottom: 8px;">Services</div>
                                <div style="space-y: 4px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0;">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="width: 16px; height: 16px; background: #0078d4; border-radius: 2px;"></div>
                                            <span style="font-size: 12px; color: #323130;">Blob Storage</span>
                                        </div>
                                        <span style="font-size: 11px; color: #605e5c;">23 containers</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0;">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="width: 16px; height: 16px; background: #107c10; border-radius: 2px;"></div>
                                            <span style="font-size: 12px; color: #323130;">File Shares</span>
                                        </div>
                                        <span style="font-size: 11px; color: #605e5c;">5 shares</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0;">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="width: 16px; height: 16px; background: #d83b01; border-radius: 2px;"></div>
                                            <span style="font-size: 12px; color: #323130;">Queues</span>
                                        </div>
                                        <span style="font-size: 11px; color: #605e5c;">12 queues</span>
                                    </div>
                                </div>
                            </div>
                            <button style="background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 12px; cursor: pointer; width: 100%;">Storage Explorer</button>
                        </div>
                    </div>`
            },
            {
                id: 'azure-function-app',
                name: 'Function App Monitor',
                description: 'Azure Functions monitoring panel with execution statistics and deployment options',
                category: 'Azure Services',
                source: 'azure-services' as const,
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/azure-functions/',
                playbook: 'Azure Dev Playbook' as const,
                htmlCode: `
                    <div style="background: white; border: 1px solid #e1dfdd; border-radius: 8px; width: 420px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="background: #f8f9fa; padding: 16px; border-bottom: 1px solid #e1dfdd; border-radius: 8px 8px 0 0;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width: 32px; height: 32px; background: #0078d4; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">FN</div>
                                    <div>
                                        <h3 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">my-function-app</h3>
                                        <p style="margin: 2px 0 0 0; color: #605e5c; font-size: 12px;">Consumption Plan • Node.js 18</p>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 8px; height: 8px; background: #107c10; border-radius: 50%;"></div>
                                    <span style="font-size: 12px; color: #107c10; font-weight: 600;">Running</span>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #323130;">247</div>
                                    <div style="font-size: 10px; color: #605e5c;">Executions Today</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #323130;">156ms</div>
                                    <div style="font-size: 10px; color: #605e5c;">Avg Duration</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #d83b01;">2</div>
                                    <div style="font-size: 10px; color: #605e5c;">Errors</div>
                                </div>
                            </div>
                            <div style="margin-bottom: 16px;">
                                <div style="font-size: 12px; color: #605e5c; margin-bottom: 8px;">Functions</div>
                                <div style="background: #f8f9fa; border-radius: 4px; padding: 8px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                        <span style="font-size: 12px; color: #323130; font-weight: 600;">HttpTrigger1</span>
                                        <span style="font-size: 10px; color: #107c10;">Active</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                        <span style="font-size: 12px; color: #323130; font-weight: 600;">TimerTrigger1</span>
                                        <span style="font-size: 10px; color: #107c10;">Active</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 12px; color: #323130; font-weight: 600;">BlobTrigger1</span>
                                        <span style="font-size: 10px; color: #605e5c;">Disabled</span>
                                    </div>
                                </div>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button style="background: #0078d4; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Deploy</button>
                                <button style="background: transparent; color: #0078d4; border: 1px solid #0078d4; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Monitor</button>
                            </div>
                        </div>
                    </div>`
            },
            {
                id: 'azure-virtual-machine',
                name: 'Virtual Machine Panel',
                description: 'Azure Virtual Machine management panel with performance metrics and control actions',
                category: 'Compute',
                source: 'azure-services' as const,
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/virtual-machines/',
                playbook: 'Azure Dev Playbook' as const,
                htmlCode: `
                    <div style="background: white; border: 1px solid #e1dfdd; border-radius: 8px; width: 400px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="background: #f8f9fa; padding: 16px; border-bottom: 1px solid #e1dfdd; border-radius: 8px 8px 0 0;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width: 32px; height: 32px; background: #0078d4; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">VM</div>
                                    <div>
                                        <h3 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">web-server-01</h3>
                                        <p style="margin: 2px 0 0 0; color: #605e5c; font-size: 12px;">Standard B2s • Ubuntu 20.04</p>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 8px; height: 8px; background: #107c10; border-radius: 50%;"></div>
                                    <span style="font-size: 12px; color: #107c10; font-weight: 600;">Running</span>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                                <div>
                                    <div style="font-size: 12px; color: #605e5c; margin-bottom: 4px;">CPU</div>
                                    <div style="font-size: 18px; font-weight: 600; color: #323130;">23%</div>
                                </div>
                                <div>
                                    <div style="font-size: 12px; color: #605e5c; margin-bottom: 4px;">Memory</div>
                                    <div style="font-size: 18px; font-weight: 600; color: #323130;">4.2 GB</div>
                                </div>
                            </div>
                            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                                <button style="background: #0078d4; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Connect</button>
                                <button style="background: transparent; color: #d83b01; border: 1px solid #d83b01; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Stop</button>
                            </div>
                        </div>
                    </div>`
            },
            {
                id: 'azure-cosmos-db',
                name: 'Cosmos DB Dashboard',
                description: 'Azure Cosmos DB management dashboard with throughput and performance monitoring',
                category: 'Databases',
                source: 'azure-services' as const,
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/cosmos-db/',
                playbook: 'Azure Dev Playbook' as const,
                htmlCode: `
                    <div style="background: white; border: 1px solid #e1dfdd; border-radius: 8px; width: 420px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="background: #f8f9fa; padding: 16px; border-bottom: 1px solid #e1dfdd; border-radius: 8px 8px 0 0;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 32px; height: 32px; background: #0078d4; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">DB</div>
                                <div>
                                    <h3 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">myapp-cosmos</h3>
                                    <p style="margin: 2px 0 0 0; color: #605e5c; font-size: 12px;">SQL API • Multi-region</p>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #323130;">400 RU/s</div>
                                    <div style="font-size: 10px; color: #605e5c;">Throughput</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #323130;">1.2M</div>
                                    <div style="font-size: 10px; color: #605e5c;">Documents</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #323130;">847 MB</div>
                                    <div style="font-size: 10px; color: #605e5c;">Storage</div>
                                </div>
                            </div>
                            <div style="background: #f8f9fa; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                                <div style="font-size: 11px; color: #605e5c; margin-bottom: 4px;">Connection String</div>
                                <div style="font-size: 10px; color: #323130; font-family: 'Courier New', monospace;">AccountEndpoint=https://myapp-cosmos.documents.azure.com...</div>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button style="background: #0078d4; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Data Explorer</button>
                                <button style="background: transparent; color: #0078d4; border: 1px solid #0078d4; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Scale</button>
                            </div>
                        </div>
                    </div>`
            },
            {
                id: 'azure-key-vault',
                name: 'Key Vault Panel',
                description: 'Azure Key Vault secrets management panel with access policies and certificates',
                category: 'Security',
                source: 'azure-services' as const,
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/key-vault/',
                playbook: 'Azure Dev Playbook' as const,
                htmlCode: `
                    <div style="background: white; border: 1px solid #e1dfdd; border-radius: 8px; width: 380px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="background: #f8f9fa; padding: 16px; border-bottom: 1px solid #e1dfdd; border-radius: 8px 8px 0 0;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 32px; height: 32px; background: #0078d4; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">KV</div>
                                <div>
                                    <h3 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">myapp-keyvault</h3>
                                    <p style="margin: 2px 0 0 0; color: #605e5c; font-size: 12px;">Standard • RBAC Enabled</p>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 18px; font-weight: 600; color: #323130;">12</div>
                                    <div style="font-size: 11px; color: #605e5c;">Secrets</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 18px; font-weight: 600; color: #323130;">3</div>
                                    <div style="font-size: 11px; color: #605e5c;">Keys</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 18px; font-weight: 600; color: #323130;">2</div>
                                    <div style="font-size: 11px; color: #605e5c;">Certificates</div>
                                </div>
                            </div>
                            <div style="background: #f8f9fa; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                                <div style="font-size: 11px; color: #605e5c; margin-bottom: 8px;">Recent Access</div>
                                <div style="font-size: 12px; color: #323130;">database-connection-string</div>
                                <div style="font-size: 12px; color: #323130;">api-secret-key</div>
                            </div>
                            <button style="background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 12px; cursor: pointer; width: 100%;">Manage Secrets</button>
                        </div>
                    </div>`
            },
            {
                id: 'azure-container-registry',
                name: 'Container Registry',
                description: 'Azure Container Registry management with image repositories and security scanning',
                category: 'Containers',
                source: 'azure-services' as const,
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/container-registry/',
                playbook: 'Azure Dev Playbook' as const,
                htmlCode: `
                    <div style="background: white; border: 1px solid #e1dfdd; border-radius: 8px; width: 400px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="background: #f8f9fa; padding: 16px; border-bottom: 1px solid #e1dfdd; border-radius: 8px 8px 0 0;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 32px; height: 32px; background: #0078d4; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">CR</div>
                                <div>
                                    <h3 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">myappregistry</h3>
                                    <p style="margin: 2px 0 0 0; color: #605e5c; font-size: 12px;">Premium • Geo-replication</p>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 18px; font-weight: 600; color: #323130;">23</div>
                                    <div style="font-size: 11px; color: #605e5c;">Repositories</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 18px; font-weight: 600; color: #323130;">4.2 GB</div>
                                    <div style="font-size: 11px; color: #605e5c;">Storage Used</div>
                                </div>
                            </div>
                            <div style="margin-bottom: 16px;">
                                <div style="font-size: 12px; color: #605e5c; margin-bottom: 8px;">Recent Images</div>
                                <div style="background: #f8f9fa; border-radius: 4px; padding: 8px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                        <span style="font-size: 12px; color: #323130;">webapp:latest</span>
                                        <span style="font-size: 10px; color: #107c10;">✓ Scanned</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 12px; color: #323130;">api:v2.1</span>
                                        <span style="font-size: 10px; color: #107c10;">✓ Scanned</span>
                                    </div>
                                </div>
                            </div>
                            <button style="background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 12px; cursor: pointer; width: 100%;">Browse Images</button>
                        </div>
                    </div>`
            },
            {
                id: 'azure-service-bus',
                name: 'Service Bus Queue',
                description: 'Azure Service Bus queue management with message monitoring and throughput metrics',
                category: 'Messaging',
                source: 'azure-services' as const,
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/service-bus-messaging/',
                playbook: 'Azure Dev Playbook' as const,
                htmlCode: `
                    <div style="background: white; border: 1px solid #e1dfdd; border-radius: 8px; width: 420px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="background: #f8f9fa; padding: 16px; border-bottom: 1px solid #e1dfdd; border-radius: 8px 8px 0 0;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 32px; height: 32px; background: #0078d4; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">SB</div>
                                <div>
                                    <h3 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">order-processing</h3>
                                    <p style="margin: 2px 0 0 0; color: #605e5c; font-size: 12px;">Standard • Queue</p>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #323130;">127</div>
                                    <div style="font-size: 10px; color: #605e5c;">Active Messages</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #323130;">2.3K</div>
                                    <div style="font-size: 10px; color: #605e5c;">Processed Today</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #d83b01;">3</div>
                                    <div style="font-size: 10px; color: #605e5c;">Dead Letter</div>
                                </div>
                            </div>
                            <div style="background: #f8f9fa; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                                <div style="font-size: 11px; color: #605e5c; margin-bottom: 4px;">Throughput (msgs/sec)</div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="background: #107c10; height: 4px; width: 60%; border-radius: 2px;"></div>
                                    <span style="font-size: 12px; color: #323130;">45/sec</span>
                                </div>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button style="background: #0078d4; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Send Message</button>
                                <button style="background: transparent; color: #0078d4; border: 1px solid #0078d4; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Monitor</button>
                            </div>
                        </div>
                    </div>`
            },
            {
                id: 'azure-redis-cache',
                name: 'Redis Cache Dashboard',
                description: 'Azure Cache for Redis performance monitoring with hit ratio and memory usage',
                category: 'Caching',
                source: 'azure-services' as const,
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/',
                playbook: 'Azure Dev Playbook' as const,
                htmlCode: `
                    <div style="background: white; border: 1px solid #e1dfdd; border-radius: 8px; width: 380px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="background: #f8f9fa; padding: 16px; border-bottom: 1px solid #e1dfdd; border-radius: 8px 8px 0 0;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 32px; height: 32px; background: #d83b01; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">RC</div>
                                <div>
                                    <h3 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">myapp-cache</h3>
                                    <p style="margin: 2px 0 0 0; color: #605e5c; font-size: 12px;">Standard C1 • 1 GB</p>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                                <div>
                                    <div style="font-size: 12px; color: #605e5c; margin-bottom: 4px;">Hit Ratio</div>
                                    <div style="font-size: 18px; font-weight: 600; color: #107c10;">96.3%</div>
                                </div>
                                <div>
                                    <div style="font-size: 12px; color: #605e5c; margin-bottom: 4px;">Memory Used</div>
                                    <div style="font-size: 18px; font-weight: 600; color: #323130;">412 MB</div>
                                </div>
                            </div>
                            <div style="margin-bottom: 16px;">
                                <div style="font-size: 12px; color: #605e5c; margin-bottom: 8px;">Operations/sec</div>
                                <div style="background: #f8f9fa; padding: 12px; border-radius: 4px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                        <span style="font-size: 12px; color: #323130;">Gets</span>
                                        <span style="font-size: 12px; color: #323130; font-weight: 600;">1,247</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 12px; color: #323130;">Sets</span>
                                        <span style="font-size: 12px; color: #323130; font-weight: 600;">89</span>
                                    </div>
                                </div>
                            </div>
                            <button style="background: #d83b01; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 12px; cursor: pointer; width: 100%;">Redis Console</button>
                        </div>
                    </div>`
            },
            {
                id: 'azure-monitor',
                name: 'Azure Monitor Dashboard',
                description: 'Azure Monitor application insights dashboard with alerts and metrics overview',
                category: 'Monitoring',
                source: 'azure-services' as const,
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/azure-monitor/',
                playbook: 'Azure Dev Playbook' as const,
                htmlCode: `
                    <div style="background: white; border: 1px solid #e1dfdd; border-radius: 8px; width: 450px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="background: #f8f9fa; padding: 16px; border-bottom: 1px solid #e1dfdd; border-radius: 8px 8px 0 0;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 32px; height: 32px; background: #0078d4; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">AM</div>
                                <div>
                                    <h3 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">Application Insights</h3>
                                    <p style="margin: 2px 0 0 0; color: #605e5c; font-size: 12px;">myapp-insights</p>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #323130;">1.2K</div>
                                    <div style="font-size: 10px; color: #605e5c;">Requests/min</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #323130;">156ms</div>
                                    <div style="font-size: 10px; color: #605e5c;">Avg Response</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #d83b01;">2</div>
                                    <div style="font-size: 10px; color: #605e5c;">Active Alerts</div>
                                </div>
                            </div>
                            <div style="background: #f8f9fa; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                                <div style="font-size: 11px; color: #605e5c; margin-bottom: 8px;">Recent Alerts</div>
                                <div style="font-size: 12px; color: #d83b01; margin-bottom: 4px;">• High CPU usage on VM-01</div>
                                <div style="font-size: 12px; color: #d83b01;">• Database connection timeout</div>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button style="background: #0078d4; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">View Logs</button>
                                <button style="background: transparent; color: #0078d4; border: 1px solid #0078d4; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Metrics</button>
                            </div>
                        </div>
                    </div>`
            },
            {
                id: 'azure-api-management',
                name: 'API Management Gateway',
                description: 'Azure API Management gateway with API policies, analytics, and developer portal',
                category: 'Integration',
                source: 'azure-services' as const,
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/api-management/',
                playbook: 'Azure Dev Playbook' as const,
                htmlCode: `
                    <div style="background: white; border: 1px solid #e1dfdd; border-radius: 8px; width: 440px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="background: #f8f9fa; padding: 16px; border-bottom: 1px solid #e1dfdd; border-radius: 8px 8px 0 0;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 32px; height: 32px; background: #0078d4; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">API</div>
                                <div>
                                    <h3 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">myapp-apim</h3>
                                    <p style="margin: 2px 0 0 0; color: #605e5c; font-size: 12px;">Developer Tier • Gateway</p>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #323130;">12</div>
                                    <div style="font-size: 10px; color: #605e5c;">APIs</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #323130;">2.4K</div>
                                    <div style="font-size: 10px; color: #605e5c;">Calls/hour</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #107c10;">99.8%</div>
                                    <div style="font-size: 10px; color: #605e5c;">Uptime</div>
                                </div>
                            </div>
                            <div style="background: #f8f9fa; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                                <div style="font-size: 11px; color: #605e5c; margin-bottom: 8px;">Top APIs</div>
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                    <span style="font-size: 12px; color: #323130;">User Management</span>
                                    <span style="font-size: 11px; color: #605e5c;">1.2K calls</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-size: 12px; color: #323130;">Payment Processing</span>
                                    <span style="font-size: 11px; color: #605e5c;">890 calls</span>
                                </div>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button style="background: #0078d4; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">API Portal</button>
                                <button style="background: transparent; color: #0078d4; border: 1px solid #0078d4; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Analytics</button>
                            </div>
                        </div>
                    </div>`
            },
            {
                id: 'azure-logic-apps',
                name: 'Logic Apps Workflow',
                description: 'Azure Logic Apps workflow designer with triggers, actions, and execution history',
                category: 'Integration',
                source: 'azure-services' as const,
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/logic-apps/',
                playbook: 'Azure Dev Playbook' as const,
                htmlCode: `
                    <div style="background: white; border: 1px solid #e1dfdd; border-radius: 8px; width: 400px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="background: #f8f9fa; padding: 16px; border-bottom: 1px solid #e1dfdd; border-radius: 8px 8px 0 0;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 32px; height: 32px; background: #0078d4; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">LA</div>
                                <div>
                                    <h3 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">order-processing</h3>
                                    <p style="margin: 2px 0 0 0; color: #605e5c; font-size: 12px;">Standard • Enabled</p>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 18px; font-weight: 600; color: #323130;">47</div>
                                    <div style="font-size: 11px; color: #605e5c;">Runs Today</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 18px; font-weight: 600; color: #107c10;">98%</div>
                                    <div style="font-size: 11px; color: #605e5c;">Success Rate</div>
                                </div>
                            </div>
                            <div style="background: #f8f9fa; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                                <div style="font-size: 11px; color: #605e5c; margin-bottom: 8px;">Workflow Steps</div>
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                    <div style="width: 16px; height: 16px; background: #107c10; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">1</div>
                                    <span style="font-size: 12px; color: #323130;">HTTP Trigger</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                    <div style="width: 16px; height: 16px; background: #107c10; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">2</div>
                                    <span style="font-size: 12px; color: #323130;">Parse JSON</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 16px; height: 16px; background: #107c10; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">3</div>
                                    <span style="font-size: 12px; color: #323130;">Send Email</span>
                                </div>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button style="background: #0078d4; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Designer</button>
                                <button style="background: transparent; color: #0078d4; border: 1px solid #0078d4; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Run History</button>
                            </div>
                        </div>
                    </div>`
            },
            {
                id: 'azure-cognitive-services',
                name: 'Cognitive Services API',
                description: 'Azure Cognitive Services with AI models, usage analytics, and endpoint management',
                category: 'AI + ML',
                source: 'azure-services' as const,
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/cognitive-services/',
                playbook: 'Azure Dev Playbook' as const,
                htmlCode: `
                    <div style="background: white; border: 1px solid #e1dfdd; border-radius: 8px; width: 420px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="background: #f8f9fa; padding: 16px; border-bottom: 1px solid #e1dfdd; border-radius: 8px 8px 0 0;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 32px; height: 32px; background: #0078d4; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">AI</div>
                                <div>
                                    <h3 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">myapp-cognitive</h3>
                                    <p style="margin: 2px 0 0 0; color: #605e5c; font-size: 12px;">Multi-service • S0</p>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 18px; font-weight: 600; color: #323130;">12.4K</div>
                                    <div style="font-size: 11px; color: #605e5c;">API Calls Today</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 18px; font-weight: 600; color: #323130;">127ms</div>
                                    <div style="font-size: 11px; color: #605e5c;">Avg Latency</div>
                                </div>
                            </div>
                            <div style="background: #f8f9fa; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                                <div style="font-size: 11px; color: #605e5c; margin-bottom: 8px;">Active Services</div>
                                <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;">
                                    <span style="background: #deecf9; color: #0078d4; padding: 4px 8px; border-radius: 12px; font-size: 10px;">Text Analytics</span>
                                    <span style="background: #deecf9; color: #0078d4; padding: 4px 8px; border-radius: 12px; font-size: 10px;">Computer Vision</span>
                                </div>
                                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                                    <span style="background: #deecf9; color: #0078d4; padding: 4px 8px; border-radius: 12px; font-size: 10px;">Speech Services</span>
                                    <span style="background: #deecf9; color: #0078d4; padding: 4px 8px; border-radius: 12px; font-size: 10px;">Language</span>
                                </div>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button style="background: #0078d4; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Test APIs</button>
                                <button style="background: transparent; color: #0078d4; border: 1px solid #0078d4; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Usage</button>
                            </div>
                        </div>
                    </div>`
            },
            {
                id: 'azure-devops',
                name: 'Azure DevOps Pipeline',
                description: 'Azure DevOps CI/CD pipeline status with build history and deployment tracking',
                category: 'DevOps',
                source: 'azure-services' as const,
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/devops/',
                playbook: 'Azure Dev Playbook' as const,
                htmlCode: `
                    <div style="background: white; border: 1px solid #e1dfdd; border-radius: 8px; width: 440px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="background: #f8f9fa; padding: 16px; border-bottom: 1px solid #e1dfdd; border-radius: 8px 8px 0 0;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 32px; height: 32px; background: #0078d4; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">DO</div>
                                <div>
                                    <h3 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">myapp-ci-cd</h3>
                                    <p style="margin: 2px 0 0 0; color: #605e5c; font-size: 12px;">Build Pipeline • main branch</p>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #107c10;">✓</div>
                                    <div style="font-size: 10px; color: #605e5c;">Last Build</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #323130;">4m 23s</div>
                                    <div style="font-size: 10px; color: #605e5c;">Duration</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #323130;">#247</div>
                                    <div style="font-size: 10px; color: #605e5c;">Build Number</div>
                                </div>
                            </div>
                            <div style="background: #f8f9fa; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                                <div style="font-size: 11px; color: #605e5c; margin-bottom: 8px;">Pipeline Stages</div>
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                    <div style="width: 12px; height: 12px; background: #107c10; border-radius: 50%;"></div>
                                    <span style="font-size: 12px; color: #323130;">Build</span>
                                    <span style="font-size: 10px; color: #605e5c; margin-left: auto;">2m 14s</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                    <div style="width: 12px; height: 12px; background: #107c10; border-radius: 50%;"></div>
                                    <span style="font-size: 12px; color: #323130;">Test</span>
                                    <span style="font-size: 10px; color: #605e5c; margin-left: auto;">1m 32s</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 12px; height: 12px; background: #107c10; border-radius: 50%;"></div>
                                    <span style="font-size: 12px; color: #323130;">Deploy</span>
                                    <span style="font-size: 10px; color: #605e5c; margin-left: auto;">37s</span>
                                </div>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button style="background: #0078d4; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Run Pipeline</button>
                                <button style="background: transparent; color: #0078d4; border: 1px solid #0078d4; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">History</button>
                            </div>
                        </div>
                    </div>`
            },
            {
                id: 'azure-event-grid',
                name: 'Event Grid Topic',
                description: 'Azure Event Grid topic management with event routing and subscription monitoring',
                category: 'Messaging',
                source: 'azure-services' as const,
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/event-grid/',
                playbook: 'Azure Dev Playbook' as const,
                htmlCode: `
                    <div style="background: white; border: 1px solid #e1dfdd; border-radius: 8px; width: 400px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="background: #f8f9fa; padding: 16px; border-bottom: 1px solid #e1dfdd; border-radius: 8px 8px 0 0;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 32px; height: 32px; background: #0078d4; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">EG</div>
                                <div>
                                    <h3 style="margin: 0; color: #323130; font-size: 16px; font-weight: 600;">user-events</h3>
                                    <p style="margin: 2px 0 0 0; color: #605e5c; font-size: 12px;">Custom Topic • Standard</p>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 18px; font-weight: 600; color: #323130;">1.8K</div>
                                    <div style="font-size: 11px; color: #605e5c;">Events Today</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 18px; font-weight: 600; color: #323130;">5</div>
                                    <div style="font-size: 11px; color: #605e5c;">Subscriptions</div>
                                </div>
                            </div>
                            <div style="background: #f8f9fa; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                                <div style="font-size: 11px; color: #605e5c; margin-bottom: 8px;">Event Types</div>
                                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                                    <span style="background: #deecf9; color: #0078d4; padding: 4px 8px; border-radius: 12px; font-size: 10px;">UserCreated</span>
                                    <span style="background: #deecf9; color: #0078d4; padding: 4px 8px; border-radius: 12px; font-size: 10px;">UserUpdated</span>
                                    <span style="background: #deecf9; color: #0078d4; padding: 4px 8px; border-radius: 12px; font-size: 10px;">UserDeleted</span>
                                </div>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button style="background: #0078d4; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Send Event</button>
                                <button style="background: transparent; color: #0078d4; border: 1px solid #0078d4; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; flex: 1;">Metrics</button>
                            </div>
                        </div>
                    </div>`
            }
        ];
        console.log('✅ Azure Service components loaded:', azureComponents.length);
        return azureComponents;
    };

    // Filter components based on selection
    const filteredComponents = useMemo(() => {
        let filtered = loadedComponents;

        // Filter by source
        if (selectedSource !== 'all') {
            filtered = filtered.filter(comp => comp.source === selectedSource);
        }

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(comp => comp.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(comp =>
                comp.name.toLowerCase().includes(query) ||
                comp.description.toLowerCase().includes(query) ||
                comp.category.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [loadedComponents, selectedSource, selectedCategory, searchQuery]);

    // Get unique categories
    const categories = useMemo(() => {
        const cats = new Set(['All']);
        loadedComponents.forEach(comp => cats.add(comp.category));
        return Array.from(cats);
    }, [loadedComponents]);

    // Get source counts
    const sourceCounts = useMemo(() => {
        const counts = {
            'fluent-github': 0,
            'atlas-github': 0,
            'azure-services': 0,
            'figma-fluent': 0,
            'figma-atlas': 0,
            'figma-azure': 0
        };
        loadedComponents.forEach(comp => {
            counts[comp.source]++;
        });
        console.log('📊 Source counts:', counts);
        console.log('📦 Loaded components:', loadedComponents.length);
        return counts;
    }, [loadedComponents]);

    // Handle component selection
    const toggleComponentSelection = (componentId: string) => {
        const newSelected = new Set(selectedComponentIds);
        if (newSelected.has(componentId)) {
            newSelected.delete(componentId);
        } else {
            newSelected.add(componentId);
        }
        setSelectedComponentIds(newSelected);
    };

    // Handle adding selected components
    const addSelectedComponents = () => {
        const selectedComponents = loadedComponents.filter(comp =>
            selectedComponentIds.has(comp.id)
        );

        selectedComponents.forEach(component => {
            onAddComponent(component);
        });

        // Clear selection after adding
        setSelectedComponentIds(new Set());
    };

    // Clear all selections
    const clearSelection = () => {
        setSelectedComponentIds(new Set());
    };

    if (!isOpen) return null;

    return (
        <div className="enhanced-component-library-overlay">
            <div className="enhanced-component-library-modal">
                {/* Header */}
                <div className="library-header">
                    <div className="header-content">
                        <h2>
                            {libraryType === 'dev-playbooks' ? 'Dev Playbooks' :
                                libraryType === 'figma-components' ? 'Figma Components' :
                                    'Component Library'}
                        </h2>
                        <p>
                            {libraryType === 'dev-playbooks'
                                ? 'Development components from GitHub repositories and Azure services'
                                : libraryType === 'figma-components'
                                    ? 'Design components from Figma libraries'
                                    : 'Browse components from Fluent Dev Playbook, Atlas Dev Playbook, Azure Dev Playbook, Figma Fluent Library, and Figma Atlas Library'}
                        </p>
                    </div>
                    <button onClick={onClose} className="close-button">×</button>
                </div>

                {/* Playbook Selector */}
                <div className="playbook-selector">
                    <div className="playbook-tabs">
                        {availablePlaybooks.map(playbook => (
                            <button
                                key={playbook}
                                className={`playbook-tab ${selectedPlaybook === playbook ? 'active' : ''}`}
                                onClick={() => setSelectedPlaybook(playbook)}
                            >
                                {playbook}
                                {playbook === 'Fluent Dev Playbook' && (
                                    <span className="source-badge github">
                                        {selectedPlaybook === 'Fluent Dev Playbook' ? (sourceCounts['fluent-github'] || 0) : '5'} Components
                                    </span>
                                )}
                                {playbook === 'Atlas Dev Playbook' && (
                                    <span className="source-badge github">
                                        {selectedPlaybook === 'Atlas Dev Playbook' ? (sourceCounts['atlas-github'] || 0) : '5'} Components
                                    </span>
                                )}
                                {playbook === 'Azure Dev Playbook' && (
                                    <span className="source-badge github">
                                        {selectedPlaybook === 'Azure Dev Playbook' ? (sourceCounts['azure-services'] || 0) : '20'} Components
                                    </span>
                                )}
                                {playbook === 'Figma Fluent Library' && (
                                    <span className="source-badge github">
                                        {selectedPlaybook === 'Figma Fluent Library' ? (sourceCounts['figma-fluent'] || 0) : '8'} Components
                                    </span>
                                )}
                                {playbook === 'Figma Atlas Library' && (
                                    <span className="source-badge github">
                                        {selectedPlaybook === 'Figma Atlas Library' ? (sourceCounts['figma-atlas'] || 0) : '6'} Components
                                    </span>
                                )}
                                {playbook === 'Figma Azure Library' && (
                                    <span className="source-badge github">
                                        {selectedPlaybook === 'Figma Azure Library' ? (sourceCounts['figma-azure'] || 0) : '1'} Components
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    <div className="filter-group">
                        <label htmlFor="source-select">Source:</label>
                        <select
                            id="source-select"
                            value={selectedSource}
                            onChange={(e) => setSelectedSource(e.target.value as any)}
                            aria-label="Select component source"
                        >
                            <option value="all">All Sources</option>
                            {selectedPlaybook === 'Fluent Dev Playbook' && (
                                <option value="fluent-github">{sourceCounts['fluent-github'] || 0} Components (Fluent)</option>
                            )}
                            {selectedPlaybook === 'Atlas Dev Playbook' && (
                                <option value="atlas-github">{sourceCounts['atlas-github'] || 0} Components (Atlas)</option>
                            )}
                            {selectedPlaybook === 'Azure Dev Playbook' && (
                                <option value="azure-services">{sourceCounts['azure-services'] || 0} Components (Azure)</option>
                            )}
                            {selectedPlaybook === 'Figma Fluent Library' && (
                                <option value="figma-fluent">{sourceCounts['figma-fluent'] || 0} Components (Figma Fluent)</option>
                            )}
                            {selectedPlaybook === 'Figma Atlas Library' && (
                                <option value="figma-atlas">{sourceCounts['figma-atlas'] || 0} Components (Figma Atlas)</option>
                            )}
                            {selectedPlaybook === 'Figma Azure Library' && (
                                <option value="figma-azure">{sourceCounts['figma-azure'] || 0} Components (Figma Azure)</option>
                            )}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="category-select">Category:</label>
                        <select
                            id="category-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            aria-label="Select component category"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group search-group">
                        <label>Search:</label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search components..."
                            className="search-input"
                        />
                    </div>
                </div>

                {/* Selection Controls */}
                {selectedComponentIds.size > 0 && (
                    <div className="selection-controls">
                        <div className="selection-info">
                            <span className="selection-count">
                                {selectedComponentIds.size} component{selectedComponentIds.size !== 1 ? 's' : ''} selected
                            </span>
                        </div>
                        <div className="selection-actions">
                            <button
                                onClick={addSelectedComponents}
                                className="add-selected-btn primary"
                            >
                                Add Selected to Wireframe
                            </button>
                            <button
                                onClick={clearSelection}
                                className="clear-selection-btn"
                            >
                                Clear Selection
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading {selectedPlaybook} components...</p>
                    </div>
                )}

                {/* Components Grid */}
                {!loading && (
                    <>
                        {/* Grid Header with Library Link */}
                        {selectedPlaybook === 'Figma Fluent Library' && (
                            <div className="components-grid-header">
                                <div className="grid-header-info">
                                    <h3>Fluent 2 Design System Components</h3>
                                    <p>{filteredComponents.length} components available</p>
                                </div>
                                <div className="grid-header-actions">
                                    <a
                                        href="https://www.figma.com/design/GvIcCw0tWaJVDSWD4f1OIW/Fluent-2-web?node-id=0-1&p=f&t=0UVE7Ann6oVPNlGW-0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="figma-library-link"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="figma-icon">
                                            <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z" />
                                            <path d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z" />
                                            <path d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z" />
                                            <path d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z" />
                                            <path d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4z" />
                                        </svg>
                                        <span>Open in Figma</span>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="external-link-icon">
                                            <path d="M3 3L9 9M9 3L9 9L3 9" stroke="currentColor" strokeWidth="1" fill="none" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        )}

                        {selectedPlaybook === 'Figma Atlas Library' && (
                            <div className="components-grid-header">
                                <div className="grid-header-info">
                                    <h3>Atlas Design System Components</h3>
                                    <p>{filteredComponents.length} components available</p>
                                </div>
                                <div className="grid-header-actions">
                                    <a
                                        href="https://www.figma.com/design/GvIcCw0tWaJVDSWD4f1OIW/Fluent-2-web?node-id=0-1&p=f&t=0UVE7Ann6oVPNlGW-0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="figma-library-link"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="figma-icon">
                                            <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z" />
                                            <path d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z" />
                                            <path d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z" />
                                            <path d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z" />
                                            <path d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4z" />
                                        </svg>
                                        <span>Open in Figma</span>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="external-link-icon">
                                            <path d="M3 3L9 9M9 3L9 9L3 9" stroke="currentColor" strokeWidth="1" fill="none" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        )}

                        <div className="components-grid">
                            {filteredComponents.map(component => {
                                const isSelected = selectedComponentIds.has(component.id);
                                return (
                                    <div
                                        key={component.id}
                                        className={`component-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => toggleComponentSelection(component.id)}
                                    >
                                        <div className="component-selection-indicator">
                                            <div className={`selection-checkbox ${isSelected ? 'checked' : ''}`}>
                                                {isSelected && <span className="checkmark">✓</span>}
                                            </div>
                                        </div>
                                        <div className="component-preview">
                                            <div
                                                dangerouslySetInnerHTML={{ __html: component.htmlCode }}
                                                className="component-preview-scaled"
                                            />
                                        </div>
                                        <div className="component-info">
                                            <div className="component-header">
                                                <h3>{component.name}</h3>
                                                <div className="source-indicators">
                                                    <span className={`source-tag ${component.source}`}>
                                                        {component.source.includes('github') ? 'GitHub' : 'Figma'}
                                                    </span>
                                                    <span className="playbook-tag">{component.playbook}</span>
                                                </div>
                                            </div>
                                            <p className="component-description">{component.description}</p>
                                            <div className="component-meta">
                                                <span className="category-tag">{component.category}</span>
                                                {component.sourceUrl && (
                                                    <a
                                                        href={component.sourceUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="source-link"
                                                        onClick={(e) => e.stopPropagation()} // Prevent selection toggle
                                                    >
                                                        View Source
                                                    </a>
                                                )}
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent selection toggle
                                                    onAddComponent(component);
                                                }}
                                                className="add-component-btn individual"
                                            >
                                                Add to Wireframe
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Empty State */}
                {!loading && filteredComponents.length === 0 && (
                    <div className="empty-state">
                        <p>No components found matching your criteria.</p>
                        <button onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('All');
                            setSelectedSource('all');
                            setSelectedComponentIds(new Set()); // Clear selections when clearing filters
                        }}>
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Footer */}
                <div className="library-footer">
                    <div className="stats">
                        Showing {filteredComponents.length} of {loadedComponents.length} components from {selectedPlaybook}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedComponentLibrary;
