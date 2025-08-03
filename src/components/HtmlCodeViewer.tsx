import React, { useState } from 'react';
import { FiX, FiCopy, FiDownload, FiCheck } from 'react-icons/fi';
import './HtmlCodeViewer.css';

interface HtmlCodeViewerProps {
    isOpen: boolean;
    onClose: () => void;
    htmlContent: string;
    title?: string;
}

const HtmlCodeViewer: React.FC<HtmlCodeViewerProps> = ({
    isOpen,
    onClose,
    htmlContent,
    title = "HTML Code"
}) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(htmlContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wireframe.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const formatHtml = (html: string) => {
        // Simple HTML formatting for better readability
        return html
            .replace(/></g, '>\n<')
            .replace(/^\s*\n/gm, '')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n');
    };

    return (
        <div className="html-code-overlay">
            <div className="html-code-modal">
                <div className="html-code-header">
                    <div className="header-left">
                        <h2>{title}</h2>
                        <p>Copy or download the HTML code for your wireframe</p>
                    </div>
                    <div className="header-right">
                        <button
                            className="code-action-btn"
                            onClick={handleCopy}
                            title="Copy to Clipboard"
                        >
                            {copied ? <FiCheck /> : <FiCopy />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                            className="code-action-btn"
                            onClick={handleDownload}
                            title="Download HTML File"
                        >
                            <FiDownload />
                            Download
                        </button>
                        <button
                            className="close-btn"
                            onClick={onClose}
                            title="Close Code Viewer"
                        >
                            <FiX />
                        </button>
                    </div>
                </div>

                <div className="html-code-content">
                    <pre className="html-code-block">
                        <code>{formatHtml(htmlContent)}</code>
                    </pre>
                </div>

                <div className="html-code-footer">
                    <div className="footer-info">
                        <small>
                            {htmlContent.length} characters • Ready to use HTML code
                        </small>
                    </div>
                    <button className="btn-secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HtmlCodeViewer;
