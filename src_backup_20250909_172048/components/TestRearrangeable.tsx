import React from 'react';
import EnhancedWireframeRenderer from './EnhancedWireframeRenderer';

interface TestRearrangeableProps {
    htmlContent?: string;
}

const TestRearrangeable: React.FC<TestRearrangeableProps> = ({ htmlContent = '' }) => {
    // Sample test HTML with Bootstrap grid for testing
    const testHtml = htmlContent || `
        <div class="container">
            <div class="row">
                <div class="col-sm-4">
                    <div class="card" style="padding: 20px; background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 20px;">
                        <h3>Feature Card 1</h3>
                        <p>This is a draggable card component that you can rearrange!</p>
                        <button style="background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 4px;">Learn More</button>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="card" style="padding: 20px; background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 20px;">
                        <h3>Feature Card 2</h3>
                        <p>Drag and drop these cards to rearrange the layout!</p>
                        <button style="background: #107c10; color: white; border: none; padding: 8px 16px; border-radius: 4px;">Get Started</button>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="card" style="padding: 20px; background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 20px;">
                        <h3>Feature Card 3</h3>
                        <p>Switch to Rearrange mode to activate drag and drop!</p>
                        <button style="background: #d83b01; color: white; border: none; padding: 8px 16px; border-radius: 4px;">Try Now</button>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div style="padding: 20px; background: #fff; border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 20px;">
                        <h2>Hero Section</h2>
                        <p>This is a larger component that spans 6 columns. You can drag this too!</p>
                        <button style="background: #5c2d91; color: white; border: none; padding: 12px 24px; border-radius: 4px;">Action Button</button>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div style="padding: 20px; background: #fff; border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 20px;">
                        <h2>Content Block</h2>
                        <p>Another 6-column component that can be rearranged with the others.</p>
                        <form style="margin-top: 16px;">
                            <input type="text" placeholder="Your email" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-right: 8px;">
                            <button type="submit" style="background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 4px;">Subscribe</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    const handleUpdateContent = (newContent: string) => {
        console.log('Content updated:', newContent);
        // In a real implementation, this would update the wireframe state
    };

    const sampleComponents = [
        {
            name: 'Button',
            type: 'button-group',
            html: '<button style="background: #0078d4; color: white; border: none; padding: 12px 24px; border-radius: 4px;">New Button</button>',
            defaultWidth: 3,
            icon: '🔘'
        },
        {
            name: 'Card',
            type: 'card',
            html: '<div class="card" style="padding: 20px; background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px;"><h3>New Card</h3><p>Card content here</p></div>',
            defaultWidth: 4,
            icon: '📋'
        },
        {
            name: 'Form',
            type: 'form',
            html: '<form style="padding: 20px; background: #fff; border: 1px solid #e9ecef; border-radius: 8px;"><input type="text" placeholder="Enter text" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 100%; margin-bottom: 12px;"><button type="submit" style="background: #107c10; color: white; border: none; padding: 8px 16px; border-radius: 4px;">Submit</button></form>',
            defaultWidth: 6,
            icon: '📝'
        }
    ];

    return (
        <div style={{ padding: '20px', height: '100vh' }}>
            <div style={{
                background: 'linear-gradient(135deg, #0078d4 0%, #106ebe 100%)',
                color: 'white',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center'
            }}>
                <h2 style={{ margin: '0 0 8px 0' }}>🎯 Test Rearrangeable Wireframe</h2>
                <p style={{ margin: 0, opacity: 0.9 }}>
                    Click "Rearrange" mode above and try dragging the cards around!
                </p>
            </div>

            <EnhancedWireframeRenderer
                htmlContent={testHtml}
                onUpdateContent={handleUpdateContent}
                componentLibraryItems={sampleComponents}
                enableRearrangeable={true}
                showComponentLibrary={true}
            />
        </div>
    );
};

export default TestRearrangeable;
