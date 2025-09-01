import React from 'react';
import { FiFigma, FiCode, FiShare2, FiMonitor, FiDownload, FiSave } from 'react-icons/fi';
import './TopNavbar.css';

interface TopNavbarProps {
    onLogoClick?: () => void;
    // Toolbar actions
    onSave?: () => void;
    onFigmaIntegration?: () => void;
    onViewHtmlCode?: () => void;
    onShareUrl?: () => void;
    onPresentationMode?: () => void;
    onDownloadWireframe?: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({
    onLogoClick,
    onSave,
    onFigmaIntegration,
    onViewHtmlCode,
    onShareUrl,
    onPresentationMode,
    onDownloadWireframe
}) => {
    return (
        <nav className="top-nav">
            <div className="navbar-left">
                <button
                    onClick={onLogoClick}
                    className="navbar-logo-button"
                    title="Back to Home"
                >
                    <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.5216 0.5H0V11.9067H11.5216V0.5Z" fill="#F26522" />
                        <path d="M24.2418 0.5H12.7202V11.9067H24.2418V0.5Z" fill="#8DC63F" />
                        <path d="M11.5216 13.0933H0V24.5H11.5216V13.0933Z" fill="#00AEEF" />
                        <path d="M24.2418 13.0933H12.7202V24.5H24.2418V13.0933Z" fill="#FFC20E" />
                    </svg>
                    <span className="navbar-logo-text">Designetica</span>
                </button>
            </div>
            <div className="navbar-right">
                {/* Moved Toolbar */}
                <div className="navbar-toolbar">
                    <button
                        className="navbar-toolbar-btn save-btn"
                        onClick={onSave}
                        title="Save Wireframe"
                    >
                        <FiSave />
                    </button>
                    <button
                        className="navbar-toolbar-btn"
                        onClick={onFigmaIntegration}
                        title="Figma Integration"
                    >
                        <FiFigma />
                    </button>
                    <button
                        className="navbar-toolbar-btn"
                        onClick={onViewHtmlCode}
                        title="View & Import HTML"
                    >
                        <FiCode />
                    </button>
                    <button
                        className="navbar-toolbar-btn"
                        onClick={onShareUrl}
                        title="Share URL"
                    >
                        <FiShare2 />
                    </button>
                    <button
                        className="navbar-toolbar-btn"
                        onClick={onPresentationMode}
                        title="Presentation Mode"
                    >
                        <FiMonitor />
                    </button>
                    <button
                        className="navbar-toolbar-btn"
                        onClick={onDownloadWireframe}
                        title="Download Wireframe"
                    >
                        <FiDownload />
                    </button>
                </div>

                {/* CXS Logo */}
                <img src="/cxsLogo.png" alt="CXS Logo" className="navbar-cxs-logo" />
            </div>
        </nav>
    );
};

export default TopNavbar;
