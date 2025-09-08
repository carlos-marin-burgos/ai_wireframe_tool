import React, { useState } from 'react';
import './SimpleAIWireframe.css';

interface SimpleAIWireframeProps {
    onGenerate?: (html: string) => void;
}

const SimpleAIWireframe: React.FC<SimpleAIWireframeProps> = ({ onGenerate }) => {
    const [description, setDescription] = useState('');
    const [generatedHtml, setGeneratedHtml] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!description.trim()) {
            setError('Please enter a description for your wireframe');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:7072/api/generate-html-wireframe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: description.trim(),
                    designTheme: 'modern',
                    colorScheme: 'primary'
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to generate wireframe: ${response.status}`);
            }

            const data = await response.json();

            if (data.htmlContent) {
                setGeneratedHtml(data.htmlContent);
                onGenerate?.(data.htmlContent);
            } else {
                throw new Error('No HTML content received from AI');
            }
        } catch (err) {
            console.error('Error generating wireframe:', err);
            setError(err instanceof Error ? err.message : 'Failed to generate wireframe');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setDescription('');
        setGeneratedHtml('');
        setError('');
    };

    return (
        <div className="simple-ai-wireframe">
            <div className="input-section">
                <h2>🚀 AI Wireframe Generator</h2>
                <p>Describe what you want to create, and AI will generate it instantly:</p>

                <div className="input-group">
                    <label htmlFor="description">What do you want to build?</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Examples:
• Create a dashboard with metrics cards and charts
• Build a contact form with name, email, and message fields  
• Design a landing page with hero section and feature cards
• Make a user profile page with avatar and settings
• Create a product catalog with search and filters"
                        rows={6}
                        disabled={isLoading}
                    />
                </div>

                <div className="button-group">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !description.trim()}
                        className="generate-btn"
                    >
                        {isLoading ? '🧠 AI is creating...' : '✨ Generate Wireframe'}
                    </button>
                    <button
                        onClick={handleClear}
                        disabled={isLoading}
                        className="clear-btn"
                    >
                        🗑️ Clear
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        ❌ {error}
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <p>AI is crafting your wireframe with real content...</p>
                </div>
            )}

            {generatedHtml && !isLoading && (
                <div className="preview-section">
                    <div className="preview-header">
                        <h3>✅ Your AI-Generated Wireframe</h3>
                        <p>Real, functional wireframe with no placeholders!</p>
                    </div>
                    <div
                        className="preview-content"
                        dangerouslySetInnerHTML={{ __html: generatedHtml }}
                    />
                </div>
            )}
        </div>
    );
};

export default SimpleAIWireframe;
