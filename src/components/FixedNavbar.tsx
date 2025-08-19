import React from 'react';
import { FiHome, FiSettings, FiUser, FiHelpCircle } from 'react-icons/fi';
import './FixedNavbar.css';

interface FixedNavbarProps {
    className?: string;
}

const FixedNavbar: React.FC<FixedNavbarProps> = ({ className = '' }) => {
    return (
        <nav className={`fixed-navbar ${className}`}>
            <div className="navbar-container">
                {/* Logo/Brand */}
                <div className="navbar-brand">
                    <span className="brand-logo">✨</span>
                    <span className="brand-text">Designetica</span>
                </div>

                {/* Navigation Items */}
                <div className="navbar-items">
                    <button className="navbar-item active" title="Home">
                        <FiHome />
                        <span>Home</span>
                    </button>

                    <button className="navbar-item" title="Settings">
                        <FiSettings />
                        <span>Settings</span>
                    </button>

                    <button className="navbar-item" title="Profile">
                        <FiUser />
                        <span>Profile</span>
                    </button>

                    <button className="navbar-item" title="Help">
                        <FiHelpCircle />
                        <span>Help</span>
                    </button>
                </div>

                {/* Action Button */}
                <div className="navbar-actions">
                    <button className="navbar-action-btn">
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default FixedNavbar;
