import React from 'react';
import './MicrosoftNavbar.css';

interface MicrosoftNavbarProps {
    className?: string;
    showSearch?: boolean;
    showProfile?: boolean;
}

const MicrosoftNavbar: React.FC<MicrosoftNavbarProps> = ({
    className = '',
    showSearch = true,
    showProfile = true
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
