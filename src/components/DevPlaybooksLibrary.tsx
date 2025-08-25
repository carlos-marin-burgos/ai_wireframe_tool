/**
 * Dev Playbooks Library - Component library for development resources
 * Includes Fluent Dev, Atlas Dev, and Azure Communication Services
 */

import React from 'react';
import EnhancedComponentLibrary from './EnhancedComponentLibrary';

interface Component {
    id: string;
    name: string;
    description: string;
    category: string;
    htmlCode: string;
    preview?: string;
    source: string;
    sourceUrl?: string;
    library?: string;
    collection?: string;
}

interface DevPlaybooksLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onAddComponent: (component: Component) => void;
    onGenerateWithAI?: (description: string) => void;
    currentDescription?: string;
}

const DevPlaybooksLibrary: React.FC<DevPlaybooksLibraryProps> = (props) => {
    return (
        <EnhancedComponentLibrary
            {...props}
            libraryType="dev-playbooks"
        />
    );
};

export default DevPlaybooksLibrary;
