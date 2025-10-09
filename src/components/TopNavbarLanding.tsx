import React from 'react';
import { FiMessageSquare, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth, logout } from '../hooks/useAuth';
import './TopNavbarLanding.css';

interface TopNavbarLandingProps {
    onLogoClick?: () => void;
    onLogout?: () => void;
    onOpenFeedback?: () => void;
}

const TopNavbarLanding: React.FC<TopNavbarLandingProps> = ({
    onLogoClick,
    onLogout,
    onOpenFeedback
}) => {
    const { user, isAuthenticated } = useAuth();

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
            <div className="navbar-right">
                {onOpenFeedback && (
                    <button
                        className="navbar-feedback-btn"
                        onClick={onOpenFeedback}
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
                            aria-label="Sign out"
                            title="Sign out"
                        >
                            <FiLogOut />
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default TopNavbarLanding;
