import React, { useState, useEffect } from 'react';
import './PasswordProtection.css';

interface PasswordProtectionProps {
    onAuthSuccess: () => void;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ onAuthSuccess }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Check if user is already authenticated
    useEffect(() => {
        const authStatus = localStorage.getItem('designetica_authenticated');
        const authTime = localStorage.getItem('designetica_auth_time');

        if (authStatus === 'true' && authTime) {
            const authTimestamp = parseInt(authTime);
            const currentTime = Date.now();

            // Session expires after 24 hours
            if (currentTime - authTimestamp < 24 * 60 * 60 * 1000) {
                setIsAuthenticated(true);
                onAuthSuccess(); // Call the callback
            } else {
                // Clear expired session
                localStorage.removeItem('designetica_authenticated');
                localStorage.removeItem('designetica_auth_time');
            }
        }
    }, [onAuthSuccess]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Single required password for access
            const validPassword = 'B@rcaSuck$01!';

            if (password === validPassword) {
                localStorage.setItem('designetica_authenticated', 'true');
                localStorage.setItem('designetica_auth_time', Date.now().toString());
                setIsAuthenticated(true);
                onAuthSuccess(); // Call the callback
            } else {
                setError('Invalid password. Please try again.');
                setPassword('');
            }
        } catch (err) {
            setError('Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('designetica_authenticated');
        localStorage.removeItem('designetica_auth_time');
        setIsAuthenticated(false);
        setPassword('');
    };

    // Don't render anything if authenticated - parent component handles the main app
    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="password-protection">
            <div className="password-background"></div>
            <div className="password-container">
                <div className="password-header">
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
                        Private Access Required
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="password-form">
                    <div className="form-group">
                        <label htmlFor="password">Enter Access Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password required for access"
                            required
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="access-btn"
                        disabled={loading || !password.trim()}
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Authenticating...
                            </>
                        ) : (
                            <>
                                <span className="access-icon">🚀</span>
                                Access Designetica
                            </>
                        )}
                    </button>
                </form>

                <div className="password-footer">
                    <p className="security-note">
                        <span className="shield-icon">🛡️</span>
                        Your session will be remembered for 24 hours
                    </p>
                    <p className="contact-info">
                        Need access? Contact the <a href="mailto:camarinb@microsoft.com" className="admin-email">administrator</a>
                    </p>
                </div>
            </div>

            <div className="cxs-branding">
                <img src="/cxsLogo.png" alt="CXS Logo" className="cxs-logo" />
            </div>
        </div>
    );
};

export default PasswordProtection;
