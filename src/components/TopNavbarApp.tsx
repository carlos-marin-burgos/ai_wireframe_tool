import React, { useState } from 'react';
import { FiFigma, FiCode, FiMonitor, FiDownload, FiLogOut, FiUpload, FiMessageSquare, FiUser } from 'react-icons/fi';
import { useAuth, logout } from '../hooks/useAuth';
import './TopNavbarApp.css';

interface TopNavbarAppProps {
    onLogoClick?: () => void;
    onLogout?: () => void;
    // Toolbar actions
    onFigmaIntegration?: () => void;
    onExportToFigma?: () => void;
    onViewHtmlCode?: () => void;
    onPresentationMode?: () => void;
    onDownloadWireframe?: () => void;
    onOpenFeedback?: () => void;
}

const TopNavbarApp: React.FC<TopNavbarAppProps> = ({
    onLogoClick,
    onLogout,
    onFigmaIntegration,
    onExportToFigma,
    onViewHtmlCode,
    onPresentationMode,
    onDownloadWireframe,
    onOpenFeedback
}) => {
    const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
    const { user, isAuthenticated } = useAuth();

    const showTooltip = (e: React.MouseEvent<HTMLButtonElement>, text: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            text,
            x: rect.left + rect.width / 2,
            y: rect.bottom + 8
        });
    };

    const hideTooltip = () => {
        setTooltip(null);
    };
    return (
        <>
            <nav className="top-nav-app">
                <div className="navbar-left">
                    <button
                        type="button"
                        onClick={onLogoClick}
                        className="navbar-logo-button"
                        title="Designetica - Back to home"
                    >
                        <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.5216 0.5H0V11.9067H11.5216V0.5Z" fill="#F26522" />
                            <path d="M24.2418 0.5H12.7202V11.9067H24.2418V0.5Z" fill="#8DC63F" />
                            <path d="M11.5216 13.0933H0V24.5H11.5216V13.0933Z" fill="#00AEEF" />
                            <path d="M24.2418 13.0933H12.7202V24.5H24.2418V13.0933Z" fill="#FFC20E" />
                        </svg>
                        <span className="navbar-logo-text">Designetica</span>
                    </button>
                    <div className="separator-bar"></div>
                    <img src="/cxsLogo.png" alt="CXS" className="navbar-cxs-logo" />
                </div>

                <div className="navbar-right">
                    {/* Toolbar */}
                    <div className="navbar-toolbar">
                        <button
                            className="navbar-toolbar-btn"
                            onClick={onFigmaIntegration}
                            onMouseEnter={(e) => showTooltip(e, "Figma Integration")}
                            onMouseLeave={hideTooltip}
                            aria-label="Figma Integration"
                        >
                            <FiFigma />
                        </button>
                        <button
                            className="navbar-toolbar-btn"
                            onClick={onExportToFigma}
                            onMouseEnter={(e) => showTooltip(e, "Export to Figma")}
                            onMouseLeave={hideTooltip}
                            aria-label="Export to Figma"
                        >
                            <FiUpload />
                        </button>
                        <button
                            className="navbar-toolbar-btn"
                            onClick={onViewHtmlCode}
                            onMouseEnter={(e) => showTooltip(e, "View & Import HTML")}
                            onMouseLeave={hideTooltip}
                            aria-label="View & Import HTML"
                        >
                            <FiCode />
                        </button>
                        <button
                            className="navbar-toolbar-btn"
                            onClick={onPresentationMode}
                            onMouseEnter={(e) => showTooltip(e, "Presentation Mode")}
                            onMouseLeave={hideTooltip}
                            aria-label="Presentation Mode"
                        >
                            <FiMonitor />
                        </button>
                        <button
                            className="navbar-toolbar-btn"
                            onClick={onDownloadWireframe}
                            onMouseEnter={(e) => showTooltip(e, "Download Wireframe")}
                            onMouseLeave={hideTooltip}
                            aria-label="Download Wireframe"
                        >
                            <FiDownload />
                        </button>
                    </div>

                    {/* Feedback Button */}
                    {onOpenFeedback && (
                        <button
                            className="navbar-feedback-btn"
                            onClick={onOpenFeedback}
                            onMouseEnter={(e) => showTooltip(e, "Send Feedback")}
                            onMouseLeave={hideTooltip}
                            aria-label="Send Feedback"
                            title="Send us your feedback"
                        >
                            <FiMessageSquare />
                            <span>Feedback</span>
                        </button>
                    )}

                    {/* User Info & Logout */}
                    {isAuthenticated && user && (
                        <div className="navbar-user-section">
                            <div className="navbar-user-info">
                                <FiUser className="navbar-user-icon" />
                                <span className="navbar-user-name" title={user.userDetails}>
                                    {user.userDetails}
                                </span>
                            </div>
                            <button
                                className="navbar-logout-btn"
                                onClick={logout}
                                onMouseEnter={(e) => showTooltip(e, "Sign out")}
                                onMouseLeave={hideTooltip}
                                aria-label="Sign out"
                                title="Sign out"
                            >
                                <FiLogOut />
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Black background tooltip */}
            {tooltip && (
                <div className="black-tooltip-container">
                    <div
                        className="black-tooltip"
                        ref={(el) => {
                            if (el) {
                                el.style.left = `${tooltip.x}px`;
                                el.style.top = `${tooltip.y}px`;
                            }
                        }}
                    >
                        {tooltip.text}
                    </div>
                </div>
            )}
        </>
    );
};

export default TopNavbarApp;
