import React, { useState, useRef } from 'react';
import { FiX, FiCopy, FiDownload, FiCheck, FiUpload } from 'react-icons/fi';
import './HtmlCodeViewer.css';

interface HtmlCodeViewerProps {
    isOpen: boolean;
    onClose: () => void;
    htmlContent: string;
    title?: string;
    onImportHtml?: (html: string) => void; // new
}

const HtmlCodeViewer: React.FC<HtmlCodeViewerProps> = ({
    isOpen,
    onClose,
    htmlContent,
    title = "HTML Code",
    onImportHtml
}) => {
    const [copied, setCopied] = useState(false);
    const [importing, setImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImporting(true);
        try {
            const text = await file.text();
            onImportHtml?.(text);
        } catch (err) {
            console.error('Failed to read file', err);
        } finally {
            setImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const triggerFilePicker = () => {
        fileInputRef.current?.click();
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
                        <p>Copy, import, or download the HTML for your wireframe</p>
                    </div>
                    <div className="header-right">
                        {onImportHtml && (
                            <>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".html,.htm,text/html"
                                    className="visually-hidden-file-input"
                                    aria-label="Import HTML file"
                                    onChange={handleFileChange}
                                />
                                <button
                                    className="code-action-btn"
                                    onClick={triggerFilePicker}
                                    title="Import HTML File"
                                    disabled={importing}
                                >
                                    <FiUpload />
                                    {importing ? 'Importing...' : 'Import'}
                                </button>
                            </>
                        )}
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
