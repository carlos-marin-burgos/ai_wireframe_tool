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
        // Always use Azure Static Web Apps authentication for Microsoft employees
        console.log('🔐 Checking Azure Static Web Apps authentication for Microsoft employees');
        fetch('/.auth/me')
            .then(response => response.json())
            .then(data => {
                console.log('🔐 Azure auth data:', data);
                const clientPrincipal = data.clientPrincipal;
                if (clientPrincipal) {
                    setUser(clientPrincipal);
                    onAuthSuccess();
                } else {
                    // Auto-redirect to Microsoft login for internal employees
                    console.log('🔐 No authentication found, redirecting to Microsoft login...');
                    window.location.href = '/.auth/login/aad';
                }
                setLoading(false);
            })
            .catch((error) => {
                console.log('🔐 Azure auth failed, redirecting to Microsoft login:', error);
                window.location.href = '/.auth/login/aad';
                setLoading(false);
            });
    }, [onAuthSuccess]);

    if (loading) {
        return (
            <div className="azure-auth">
                <div className="auth-container">
                    <div className="loading-spinner"></div>
                    <p>Authenticating with Microsoft...</p>
                </div>
            </div>
        );
    }

    // If user is authenticated, don't show anything
    // If user is not authenticated, they've already been redirected to Microsoft login
    return null;
};

export default AzureAuth;
