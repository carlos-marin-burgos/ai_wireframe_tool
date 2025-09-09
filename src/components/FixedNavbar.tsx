import React from 'react';
import './FixedNavbar.css';

interface FixedNavbarProps {
    className?: string;
}

const FixedNavbar: React.FC<FixedNavbarProps> = ({ className = '' }) => {
    return (
        <nav className={`fixed-navbar ${className}`}>
            <div className="navbar-container">
                <div className="navbar-left">
                    <button className="navbar-logo-button">
                        <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.5216 0.5H0V11.9067H11.5216V0.5Z" fill="#F26522" />
                            <path d="M24.2418 0.5H12.7202V11.9067H24.2418V0.5Z" fill="#8DC63F" />
                            <path d="M11.5216 13.0933H0V24.5H11.5216V13.0933Z" fill="#00AEEF" />
                            <path d="M24.2418 13.0933H12.7202V24.5H24.2418V13.0933Z" fill="#FFC20E" />
                        </svg>
                        <span className="navbar-logo-text">Designetica</span>
                    </button>
                </div>

                <div className="navbar-center">
                    <div className="nav-links">
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#wireframes" className="nav-link">Wireframes</a>
                        <a href="#templates" className="nav-link">Templates</a>
                        <a href="#about" className="nav-link">About</a>
                    </div>
                </div>

                <div className="navbar-right">
                    <button className="nav-button secondary">Sign In</button>
                    <button className="nav-button primary">Get Started</button>
                </div>
            </div>
        </nav>
    );
};

export default FixedNavbar;
