/**
 * Test page to demonstrate Figma Component Browser integration
 */

import React, { useState } from 'react';
import FigmaIntegration from '../components/FigmaIntegration';

const FigmaTestPage = () => {
    const [importedComponents, setImportedComponents] = useState([]);

    const handleComponentsImported = (components) => {
        console.log('Components imported:', components);
        setImportedComponents(components);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>🎨 Figma Component Browser Test</h1>

            <div style={{ marginBottom: '30px' }}>
                <h2>Import Components from Figma</h2>
                <FigmaIntegration
                    onComponentsImported={handleComponentsImported}
                    designSystem="auto"
                />
            </div>

            {importedComponents.length > 0 && (
                <div style={{ marginTop: '30px' }}>
                    <h2>✅ Imported Components</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '20px'
                    }}>
                        {importedComponents.map((component, index) => (
                            <div
                                key={index}
                                style={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    backgroundColor: '#f9f9f9'
                                }}
                            >
                                <h3 style={{ marginTop: 0, color: '#007ACC' }}>
                                    {component.componentName}
                                </h3>
                                <p><strong>Component ID:</strong> {component.componentId}</p>
                                {component.wireframeHtml && (
                                    <div>
                                        <h4>Generated Wireframe:</h4>
                                        <div
                                            style={{
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                padding: '10px',
                                                backgroundColor: 'white',
                                                fontSize: '12px',
                                                fontFamily: 'monospace',
                                                maxHeight: '200px',
                                                overflow: 'auto'
                                            }}
                                            dangerouslySetInnerHTML={{ __html: component.wireframeHtml }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
                <h2>📋 Test Instructions</h2>
                <ol>
                    <li>Click the "Import from Figma" button above</li>
                    <li>Browse through the available Figma components</li>
                    <li>Select components you want to import</li>
                    <li>Click "Import Selected" to import them</li>
                    <li>The imported components will appear below</li>
                </ol>

                <h3>🔍 Features to Test:</h3>
                <ul>
                    <li>Component search and filtering</li>
                    <li>Category browsing (Actions, Marketing, etc.)</li>
                    <li>Library filtering (Fluent UI vs Atlas Design)</li>
                    <li>Grid vs List view modes</li>
                    <li>Multi-component selection</li>
                    <li>Component import and wireframe generation</li>
                </ul>
            </div>
        </div>
    );
};

export default FigmaTestPage;
