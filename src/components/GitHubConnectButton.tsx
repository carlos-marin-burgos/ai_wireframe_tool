import React, { useState } from 'react';
import { FiGithub } from 'react-icons/fi';
import GitHubConnectModal from './GitHubConnectModal';
import './GitHubConnectButton.css';

const GitHubConnectButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const handleConnect = () => {
        setIsConnected(true);
        console.log('GitHub connected successfully!');
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={`github-connect-btn integration-pill ${isConnected ? 'connected' : ''}`}
                title="Connect to GitHub"
            >
                <FiGithub className="pill-icon" />
                <span>{isConnected ? 'GitHub Connected' : 'Connect GitHub'}</span>
            </button>

            <GitHubConnectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConnect={handleConnect}
            />
        </>
    );
};

export default GitHubConnectButton;
