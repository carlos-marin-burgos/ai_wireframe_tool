import React from 'react';
import './MicrosoftNavbar.css';

interface MicrosoftNavbarProps {
    className?: string;
    showSearch?: boolean;
    showProfile?: boolean;
    onOpenFeedback?: () => void;
}

const MicrosoftNavbar: React.FC<MicrosoftNavbarProps> = ({
    className = '',
    showSearch = true,
    showProfile = true,
    onOpenFeedback
}) => {
    return (
        <header className={`microsoft-navbar ${className}`}>
            {/* Logo & Brand Section */}
            <div className="brand-section">
                <div className="logo-container">
                    <div className="microsoft-logo">
                        <div className="logo-orange"></div>
                        <div className="logo-green"></div>
                        <div className="logo-blue"></div>
                        <div className="logo-yellow"></div>
                    </div>
                    <div className="brand-separator"></div>
                    <div className="site-title">Docs</div>
                </div>

                {/* Navigation Menu */}
                <nav className="main-navigation">
                    <div className="nav-item">
                        <span className="nav-text">Browse</span>
                        <div className="chevron-icon">
                            <div className="chevron-shape"></div>
                        </div>
                    </div>
                    <div className="nav-item">
                        <span className="nav-text">Reference</span>
                        <div className="chevron-icon">
                            <div className="chevron-shape"></div>
                        </div>
                    </div>
                    <div className="nav-item">
                        <span className="nav-text">Learn</span>
                        <div className="chevron-icon">
                            <div className="chevron-shape"></div>
                        </div>
                    </div>
                    <div className="nav-item">
                        <span className="nav-text">Q&A</span>
                        <div className="chevron-icon">
                            <div className="chevron-shape"></div>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Search and Profile Section */}
            <div className="user-section">
                {showSearch && (
                    <div className="search-container">
                        <div className="search-icon">
                            <div className="search-shape"></div>
                        </div>
                    </div>
                )}
                {/* Feedback Button */}
                {onOpenFeedback && (
                    <button
                        className="feedback-button"
                        onClick={onOpenFeedback}
                        aria-label="Send Feedback"
                        title="Send us your feedback"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span className="feedback-text">Feedback</span>
                    </button>
                )}
                {showProfile && (
                    <div className="avatar-container">
                        <div className="avatar">
                            <div className="avatar-image"></div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default MicrosoftNavbar;
