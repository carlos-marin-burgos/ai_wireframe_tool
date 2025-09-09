import React, { useState, useEffect } from 'react';

interface ReactWireframeRendererProps {
  componentCode: string;
  onError?: (error: string) => void;
}

export const ReactWireframeRenderer: React.FC<ReactWireframeRendererProps> = ({
  componentCode,
  onError,
}) => {
  const [renderedHTML, setRenderedHTML] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!componentCode?.trim()) {
      setRenderedHTML('');
      return;
    }

    try {
      // For now, we'll display the React code as formatted text
      // In a real implementation, you'd use a JSX transformer
      const cleanCode = componentCode
        .replace(/^```jsx?\n?/i, '')
        .replace(/^```\n?/i, '')
        .replace(/\n?```$/i, '')
        .trim();

      // Convert basic JSX-like syntax to HTML for preview
      let htmlPreview = cleanCode;
      
      // Simple JSX to HTML conversion for preview purposes
      htmlPreview = htmlPreview
        .replace(/export default function \w+\(\) \{/g, '')
        .replace(/function \w+\(\) \{/g, '')
        .replace(/return \(/g, '')
        .replace(/\);?\s*\}?\s*$/g, '')
        .replace(/className=/g, 'class=')
        .replace(/{\/\*[\s\S]*?\*\/}/g, '')
        .replace(/\/\*[\s\S]*?\*\//g, '');

      // Simple state handling preview
      htmlPreview = htmlPreview
        .replace(/const \[[\w\s,]+\] = useState\([^)]*\);?\s*/g, '')
        .replace(/onClick=\{[^}]*\}/g, 'onclick="console.log(\'Button clicked\')"')
        .replace(/onChange=\{[^}]*\}/g, 'onchange="console.log(\'Input changed\')"');

      setRenderedHTML(htmlPreview.trim());
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to render component';
      console.error('❌ Failed to process React component:', err);
      setError(errorMessage);
      onError?.(errorMessage);
      setRenderedHTML('');
    }
  }, [componentCode, onError]);

  if (error) {
    return (
      <div style={{
        padding: '20px',
        border: '2px solid #ff6b6b',
        borderRadius: '8px',
        backgroundColor: '#ffe0e0',
        color: '#d63031',
        fontFamily: 'monospace',
      }}>
        <h3>❌ Processing Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!renderedHTML && !componentCode) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#6c757d',
        fontStyle: 'italic',
      }}>
        No component to render
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '200px' }}>
      {/* React Code Preview */}
      <div style={{
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Generated React Component:</h4>
        <pre style={{
          margin: 0,
          fontFamily: 'Monaco, Consolas, monospace',
          fontSize: '14px',
          whiteSpace: 'pre-wrap',
          maxHeight: '300px',
          overflow: 'auto',
          backgroundColor: '#ffffff',
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #e9ecef',
        }}>
          {componentCode}
        </pre>
      </div>

      {/* HTML Preview */}
      {renderedHTML && (
        <div style={{
          padding: '15px',
          backgroundColor: '#ffffff',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          minHeight: '200px',
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>Component Preview:</h4>
          <div dangerouslySetInnerHTML={{ __html: renderedHTML }} />
        </div>
      )}
    </div>
  );
};
