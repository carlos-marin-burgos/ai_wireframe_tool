import React from 'react';
import './LandingNavbar.css';

const LandingNavbar: React.FC = () => {
    return (
        <nav className="landing-navbar">
            <div className="landing-navbar-container">
                <div className="landing-navbar-brand">
                    <span className="landing-navbar-logo">Designetica</span>
                </div>
                <div className="landing-navbar-cxs">
                    <img src="/cxsLogo.png" alt="CxS Logo" className="landing-navbar-cxs-logo" />
                </div>
            </div>
        </nav>
    );
};

export default LandingNavbar;
