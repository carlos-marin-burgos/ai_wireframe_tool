import React from 'react';
import './UnifiedComponentLibrary.css';

interface Component {
    id: string;
    name: string;
    description: string;
    category: string;
    htmlCode: string;
    preview?: string;
}

interface UnifiedComponentLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onAddComponent: (component: Component) => void;
}

const UnifiedComponentLibrary: React.FC<UnifiedComponentLibraryProps> = ({
    isOpen,
    onClose,
    onAddComponent
}) => {
    console.log('🚀 UnifiedComponentLibrary render:', { isOpen, timestamp: new Date().toISOString() });

    if (isOpen) {
        alert('🚀 UnifiedComponentLibrary: Modal should be VISIBLE now! isOpen=' + isOpen);
    }

    if (!isOpen) return null;

    const components: Component[] = [
        {
            id: 'button-primary',
            name: 'Primary Button',
            description: 'Main call-to-action button',
            category: 'Buttons',
            htmlCode: '<button class="btn btn-primary">Click Me</button>'
        },
        {
            id: 'card-basic',
            name: 'Basic Card',
            description: 'Simple card layout',
            category: 'Cards',
            htmlCode: '<div class="card"><div class="card-body"><h5>Card Title</h5><p>Card content goes here.</p></div></div>'
        },
        {
            id: 'form-input',
            name: 'Text Input',
            description: 'Basic text input field',
            category: 'Forms',
            htmlCode: '<div class="form-group"><label>Label:</label><input type="text" class="form-control" placeholder="Enter text..."></div>'
        }
    ];

    const handleComponentClick = (component: Component) => {
        console.log('🚀 Component clicked:', component.name);
        onAddComponent(component);
        onClose();
    };

    return (
        <div className="unified-library-overlay">
            <div className="unified-library-modal">
                <div className="unified-library-header">
                    <h2>🆕 FRESH v3.0 Component Library</h2>
                    <button
                        className="unified-library-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="unified-library-content">
                    <div className="unified-library-grid">
                        {components.map(component => (
                            <div
                                key={component.id}
                                className="unified-library-component"
                                onClick={() => handleComponentClick(component)}
                            >
                                <div className="unified-library-component-preview">
                                    <div dangerouslySetInnerHTML={{ __html: component.htmlCode }} />
                                </div>
                                <div className="unified-library-component-info">
                                    <h4>{component.name}</h4>
                                    <p>{component.description}</p>
                                    <span className="unified-library-component-category">{component.category}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnifiedComponentLibrary;
