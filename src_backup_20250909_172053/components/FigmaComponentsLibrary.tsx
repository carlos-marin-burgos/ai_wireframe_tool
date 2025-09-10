/**
 * Figma Components Library - Component library for Figma design resources
 * Includes Fluent Figma, Atlas Figma, and Azure Figma components
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

interface FigmaComponentsLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onAddComponent: (component: Component) => void;
    onGenerateWithAI?: (description: string) => void;
    currentDescription?: string;
}

const FigmaComponentsLibrary: React.FC<FigmaComponentsLibraryProps> = (props) => {
    return (
        <EnhancedComponentLibrary
            {...props}
            libraryType="figma-components"
        />
    );
};

export default FigmaComponentsLibrary;
