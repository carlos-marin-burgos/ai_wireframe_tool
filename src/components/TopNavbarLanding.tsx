import React from 'react';
import './TopNavbarLanding.css';

interface TopNavbarLandingProps {
    onLogoClick?: () => void;
    onLogout?: () => void;
}

const TopNavbarLanding: React.FC<TopNavbarLandingProps> = ({
    onLogoClick,
    onLogout
}) => {
    return (
        <nav className="top-nav-landing">
            <div className="navbar-left">
                <button
                    onClick={onLogoClick}
                    className="navbar-logo-button"
                    title="Designetica"
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
            {/* Logout removed for Microsoft internal use */}
        </nav>
    );
};

export default TopNavbarLanding;
