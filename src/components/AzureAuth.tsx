import React, { useEffect, useState } from 'react';
import './AzureAuth.css';

interface AzureAuthProps {
    onAuthSuccess: () => void;
}

interface ClientPrincipal {
    identityProvider: string;
    userId: string;
    userDetails: string;
    userRoles: string[];
}

const AzureAuth: React.FC<AzureAuthProps> = ({ onAuthSuccess }) => {
    const [user, setUser] = useState<ClientPrincipal | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is authenticated via Azure Static Web Apps
        fetch('/.auth/me')
            .then(response => response.json())
            .then(data => {
                const clientPrincipal = data.clientPrincipal;
                if (clientPrincipal) {
                    setUser(clientPrincipal);
                    onAuthSuccess();
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [onAuthSuccess]);

    const handleLogin = () => {
        // Redirect to Azure AD login
        window.location.href = '/.auth/login/aad';
    };

    if (loading) {
        return (
            <div className="azure-auth">
                <div className="auth-container">
                    <div className="loading-spinner"></div>
                    <p>Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (user) {
        return null; // User is authenticated, don't show login
    }

    return (
        <div className="azure-auth">
            <div className="auth-background"></div>
            <div className="auth-container">
                <div className="auth-header">
                    <div className="logo-section">
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.5216 0.5H0V11.9067H11.5216V0.5Z" fill="#F26522" />
                            <path d="M24.2418 0.5H12.7202V11.9067H24.2418V0.5Z" fill="#8DC63F" />
                            <path d="M11.5216 13.0933H0V24.5H11.5216V13.0933Z" fill="#00AEEF" />
                            <path d="M24.2418 13.0933H12.7202V24.5H24.2418V13.0933Z" fill="#FFC20E" />
                        </svg>
                        <h1>Designetica</h1>
                    </div>
                    <p className="app-subtitle">AI Wireframe Generator</p>
                    <div className="security-badge">
                        <span className="security-icon">🔒</span>
                        Microsoft Employee Access Only
                    </div>
                </div>

                <div className="auth-content">
                    <p className="auth-description">
                        This application is for Microsoft employees only. Sign in with your Microsoft corporate account to access Designetica.
                    </p>

                    <button onClick={handleLogin} className="login-btn">
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 0H0V10H10V0Z" fill="#F25022" />
                            <path d="M21 0H11V10H21V0Z" fill="#7FBA00" />
                            <path d="M10 11H0V21H10V11Z" fill="#00A4EF" />
                            <path d="M21 11H11V21H21V11Z" fill="#FFB900" />
                        </svg>
                        Sign in with Microsoft
                    </button>

                    <div className="auth-footer">
                        <p className="security-note">
                            <span className="shield-icon">🛡️</span>
                            Secure authentication via Microsoft Azure Active Directory
                        </p>
                        <p className="contact-info">
                            For internal Microsoft use only. Questions? Contact <a href="mailto:camarinb@microsoft.com" className="admin-email">Carlos Marin</a>
                        </p>
                    </div>
                </div>

                <div className="cxs-branding">
                    <img src="/cxsLogo.png" alt="CXS Logo" className="cxs-logo" />
                </div>
            </div>
        </div>
    );
};

export default AzureAuth;
