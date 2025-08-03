import React from 'react';

interface Component {
    id: string;
    name: string;
    description: string;
    htmlCode: string;
}

interface SimpleComponentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddComponent: (component: Component) => void;
}

const SimpleComponentModal: React.FC<SimpleComponentModalProps> = ({
    isOpen,
    onClose,
    onAddComponent
}) => {
    if (!isOpen) return null;

    const components: Component[] = [
        {
            id: 'btn-1',
            name: 'Primary Button',
            description: 'Main action button',
            htmlCode: '<button class="btn btn-primary">Click Me</button>'
        },
        {
            id: 'card-1',
            name: 'Simple Card',
            description: 'Basic card component',
            htmlCode: '<div class="card"><div class="card-body"><h5>Card Title</h5><p>Some content</p></div></div>'
        }
    ];

    const handleClick = (component: Component) => {
        alert(`Adding: ${component.name}`);
        onAddComponent(component);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>🆕 Component Library v4.0</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer'
                        }}
                    >
                        ×
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                    {components.map(component => (
                        <div
                            key={component.id}
                            onClick={() => handleClick(component)}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '15px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                backgroundColor: '#f9f9f9'
                            }}
                        >
                            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{component.name}</h4>
                            <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>{component.description}</p>
                            <div style={{
                                padding: '10px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontFamily: 'monospace'
                            }}>
                                {component.htmlCode}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SimpleComponentModal;
