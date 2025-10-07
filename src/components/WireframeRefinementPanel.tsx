/**
 * Wireframe Refinement Panel
 * Lovable-style iterative refinement UI
 */

import React, { useState } from 'react';
import lovableWireframeService from '../services/lovableWireframeService';

interface WireframeRefinementPanelProps {
    currentHtml: string;
    onRefinementComplete: (newHtml: string) => void;
    onClose: () => void;
}

const WireframeRefinementPanel: React.FC<WireframeRefinementPanelProps> = ({
    currentHtml,
    onRefinementComplete,
    onClose,
}) => {
    const [feedback, setFeedback] = useState('');
    const [isRefining, setIsRefining] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState(lovableWireframeService.getConversationHistory());

    const handleRefine = async () => {
        if (!feedback.trim()) {
            setError('Please provide feedback');
            return;
        }

        setIsRefining(true);
        setError(null);

        try {
            const result = await lovableWireframeService.refine(currentHtml, feedback);

            if (result.success) {
                onRefinementComplete(result.html);
                setHistory(lovableWireframeService.getConversationHistory());
                setFeedback(''); // Clear input after successful refinement
            } else {
                setError(result.error || 'Refinement failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Refinement failed');
        } finally {
            setIsRefining(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.metaKey) {
            handleRefine();
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'white',
            borderTop: '1px solid #e5e7eb',
            boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            padding: '1.5rem',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
            }}>
                <div>
                    <h3 style={{
                        margin: 0,
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        color: '#111827',
                    }}>
                        ✨ Refine Wireframe
                    </h3>
                    <p style={{
                        margin: '0.25rem 0 0 0',
                        fontSize: '0.875rem',
                        color: '#6b7280',
                    }}>
                        Tell me what you'd like to change
                        {history.length > 0 && ` · ${history.length} refinement${history.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '1.5rem',
                        color: '#6b7280',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        lineHeight: 1,
                    }}
                >
                    ×
                </button>
            </div>

            {/* Conversation History */}
            {history.length > 0 && (
                <div style={{
                    maxHeight: '150px',
                    overflowY: 'auto',
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    background: '#f9fafb',
                    borderRadius: '0.5rem',
                }}>
                    {history.map((entry, index) => (
                        <div
                            key={index}
                            style={{
                                marginBottom: index < history.length - 1 ? '0.75rem' : 0,
                                paddingBottom: index < history.length - 1 ? '0.75rem' : 0,
                                borderBottom: index < history.length - 1 ? '1px solid #e5e7eb' : 'none',
                            }}
                        >
                            <div style={{
                                fontSize: '0.875rem',
                                color: '#374151',
                                fontWeight: 500,
                            }}>
                                {index + 1}. {entry.feedback}
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: '#6b7280',
                                marginTop: '0.25rem',
                            }}>
                                ✓ {entry.response}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                }}>
                    {error}
                </div>
            )}

            {/* Input Area */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
            }}>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="E.g., 'Make the hero section taller' or 'Add a pricing table'"
                    disabled={isRefining}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        resize: 'vertical',
                        minHeight: '80px',
                        fontFamily: 'inherit',
                    }}
                />
                <button
                    onClick={handleRefine}
                    disabled={isRefining || !feedback.trim()}
                    style={{
                        background: isRefining || !feedback.trim() ? '#9ca3af' : '#2563eb',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: isRefining || !feedback.trim() ? 'not-allowed' : 'pointer',
                        minWidth: '120px',
                        transition: 'background 0.2s',
                    }}
                >
                    {isRefining ? 'Refining...' : 'Refine'}
                </button>
            </div>

            {/* Helper Text */}
            <div style={{
                marginTop: '0.75rem',
                fontSize: '0.75rem',
                color: '#6b7280',
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <span>Press ⌘+Enter to refine</span>
                <span>Powered by Claude 3.5 Sonnet</span>
            </div>
        </div>
    );
};

export default WireframeRefinementPanel;
