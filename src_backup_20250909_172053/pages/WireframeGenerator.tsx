import React, { useState } from 'react';
import ComponentPreview from '../components/ComponentPreview';

const WireframeGenerator: React.FC = () => {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedComponent, setGeneratedComponent] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'wireframe' | 'component'>('wireframe');

    const generateWireframe = async () => {
        if (!description.trim()) {
            alert('Please enter a description');
            return;
        }

        setLoading(true);
        setError(null);
        setGeneratedComponent(null);

        try {
            const endpoint = mode === 'wireframe'
                ? '/api/generate-react-wireframe'
                : '/api/generate-react-component';

            const response = await fetch(`http://localhost:5001${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description,
                    componentType: mode === 'wireframe' ? 'wireframe' : 'page',
                    designTheme: mode === 'wireframe' ? 'wireframe' : 'modern'
                })
            });

            const data = await response.json();

            if (data.component) {
                setGeneratedComponent(data.component);
            } else {
                setError(data.error || 'Failed to generate component');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    🎨 Lovable-Style Component Generator
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Generation Mode
                            </label>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setMode('wireframe')}
                                    className={`px-4 py-2 rounded-lg ${mode === 'wireframe'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    🖼️ Wireframe
                                </button>
                                <button
                                    onClick={() => setMode('component')}
                                    className={`px-4 py-2 rounded-lg ${mode === 'component'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    ⚛️ Component
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Describe your {mode}
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={`Example: ${mode === 'wireframe'
                                    ? 'Create a dashboard wireframe with sidebar navigation, main content area, and header'
                                    : 'Create a modern user profile card with avatar, name, email, and action buttons'
                                    }`}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={generateWireframe}
                            disabled={loading || !description.trim()}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? '🔄 Generating...'
                                : `🚀 Generate ${mode === 'wireframe' ? 'Wireframe' : 'Component'}`
                            }
                        </button>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                <strong>Error:</strong> {error}
                            </div>
                        )}
                    </div>

                    {/* Preview Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {mode === 'wireframe' ? '🎨 Wireframe Preview' : '⚛️ Component Preview'}
                        </h2>

                        {loading && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto mb-4"></div>
                                <p className="text-gray-600">Generating your {mode}...</p>
                            </div>
                        )}

                        {generatedComponent && (
                            <ComponentPreview
                                componentCode={generatedComponent}
                                componentName={mode === 'wireframe' ? 'GeneratedWireframe' : 'GeneratedComponent'}
                            />
                        )}

                        {!loading && !generatedComponent && !error && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                                <p>Your generated {mode} will appear here</p>
                            </div>
                        )}
                    </div>
                </div>

                {generatedComponent && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <details>
                            <summary className="cursor-pointer text-lg font-medium text-gray-700 hover:text-gray-900">
                                📝 View Generated Code
                            </summary>
                            <pre className="mt-4 bg-gray-50 border rounded-lg p-4 overflow-x-auto text-sm">
                                {generatedComponent}
                            </pre>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WireframeGenerator;
