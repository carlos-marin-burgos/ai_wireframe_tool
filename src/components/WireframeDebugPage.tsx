import React, { useState } from 'react';
import { useWireframeGenerationDebug } from '../hooks/useWireframeGenerationDebug';

export const WireframeDebugPage: React.FC = () => {
    const [description, setDescription] = useState('Create a modern dashboard with user profile and notification cards');
    const [result, setResult] = useState<any>(null);

    const {
        generateWireframe,
        cancelGeneration,
        isLoading,
        error,
        fallback,
        loadingStage
    } = useWireframeGenerationDebug();

    const handleTest = async () => {
        try {
            console.log('🔍 COMPONENT: Starting test...');
            const wireframeResult = await generateWireframe(description);
            setResult(wireframeResult);
            console.log('✅ COMPONENT: Test completed:', wireframeResult);
        } catch (error) {
            console.error('❌ COMPONENT: Test failed:', error);
            setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>🔬 Wireframe Debug Interface</h1>
            <p>This tests the wireframe generation directly within your React app</p>

            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="description">Description:</label>
                <br />
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ width: '100%', height: '80px', marginTop: '5px' }}
                />
            </div>

            <button
                onClick={handleTest}
                disabled={isLoading}
                style={{
                    background: isLoading ? '#ccc' : '#0078d4',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isLoading ? 'default' : 'pointer',
                    marginRight: '10px'
                }}
            >
                {isLoading ? `⏳ ${loadingStage || 'Processing...'}` : '🚀 Test AI Generation'}
            </button>

            {isLoading && (
                <button
                    onClick={cancelGeneration}
                    style={{
                        background: '#d13438',
                        color: 'white',
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    ❌ Cancel
                </button>
            )}

            {error && (
                <div style={{
                    background: '#ffeaa7',
                    padding: '15px',
                    margin: '20px 0',
                    borderRadius: '4px',
                    border: '1px solid #fdcb6e'
                }}>
                    <strong>❌ Error:</strong> {error}
                </div>
            )}

            {fallback && (
                <div style={{
                    background: '#fab1a0',
                    padding: '15px',
                    margin: '20px 0',
                    borderRadius: '4px',
                    border: '1px solid #e17055'
                }}>
                    <strong>⚠️ Fallback Mode Active</strong>
                </div>
            )}

            {result && (
                <div style={{
                    background: '#dff0d8',
                    padding: '15px',
                    margin: '20px 0',
                    borderRadius: '4px',
                    border: '1px solid #d6e9c6'
                }}>
                    <h3>📊 Result Analysis:</h3>
                    <ul>
                        <li><strong>Processing Time:</strong> {result.processingTime}ms</li>
                        <li><strong>HTML Length:</strong> {result.html?.length || 0} characters</li>
                        <li><strong>From Cache:</strong> {result.fromCache ? 'Yes' : 'No'}</li>
                        <li><strong>Fallback:</strong> {result.fallback ? 'Yes' : 'No'}</li>
                        {result.debug && (
                            <>
                                <li><strong>Endpoint:</strong> {result.debug.endpoint}</li>
                                <li><strong>Title:</strong> {result.debug.title}</li>
                                <li><strong>AI Generated:</strong> {result.debug.aiGenerated ? 'Yes' : 'No'}</li>
                                <li><strong>Fluent Buttons:</strong> {result.debug.fluentComponents?.buttons || 0}</li>
                                <li><strong>Fluent Text Fields:</strong> {result.debug.fluentComponents?.textFields || 0}</li>
                                <li><strong>Fluent Selects:</strong> {result.debug.fluentComponents?.selects || 0}</li>
                            </>
                        )}
                    </ul>

                    {result.html && (
                        <details style={{ marginTop: '15px' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                📄 View Generated HTML (click to expand)
                            </summary>
                            <pre style={{
                                background: '#f8f9fa',
                                padding: '10px',
                                overflow: 'auto',
                                maxHeight: '300px',
                                fontSize: '12px',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {result.html.substring(0, 2000)}
                                {result.html.length > 2000 && '... (truncated)'}
                            </pre>
                        </details>
                    )}
                </div>
            )}

            <div style={{
                background: '#e8f4fd',
                padding: '15px',
                margin: '20px 0',
                borderRadius: '4px',
                border: '1px solid #bee5eb'
            }}>
                <h3>📋 Instructions:</h3>
                <ol>
                    <li>Enter a description above</li>
                    <li>Click "Test AI Generation"</li>
                    <li>Check the console for detailed logs</li>
                    <li>Compare processing time (should be 10-30s for AI)</li>
                    <li>Verify Fluent components are present</li>
                </ol>
            </div>
        </div>
    );
};
