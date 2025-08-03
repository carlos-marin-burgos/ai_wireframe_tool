import React from 'react';
import './TopNavbar.css';

interface TopNavbarProps {
    onLogoClick?: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ onLogoClick }) => {
    return (
        <nav className="top-nav">
            <div className="navbar-left">
                <button
                    onClick={onLogoClick}
                    className="navbar-logo-button"
                    title="Back to Home"
                >
                    <span className="navbar-logo-text">Designetica</span>
                </button>
            </div>
            <div className="navbar-right">
                <img src="/cxsLogo.png" alt="CXS Logo" className="navbar-cxs-logo" />
            </div>
        </nav>
    );
};

export default TopNavbar;
