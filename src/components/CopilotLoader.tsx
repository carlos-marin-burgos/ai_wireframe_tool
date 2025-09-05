import React, { useEffect, useState } from 'react';
import './CopilotLoader.css';

interface CopilotLoaderProps {
    message?: string;
    stage?: string;
}

const CopilotLoader: React.FC<CopilotLoaderProps> = ({ message, stage }) => {
    const [animationPhase, setAnimationPhase] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationPhase((prev) => (prev + 1) % 6);
        }, 300);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="copilot-loader-container">
            <div className="copilot-loader">
                <span className={`copilot-dot copilot-dot-1 ${animationPhase >= 0 ? 'active' : ''}`}></span>
                <span className={`copilot-dot copilot-dot-2 ${animationPhase >= 1 ? 'active' : ''}`}></span>
                <span className={`copilot-bar copilot-bar-1 ${animationPhase >= 2 ? 'active' : ''}`}></span>
                <span className={`copilot-bar copilot-bar-2 ${animationPhase >= 3 ? 'active' : ''}`}></span>
                <span className={`copilot-dot copilot-dot-3 ${animationPhase >= 4 ? 'active' : ''}`}></span>
                <span className={`copilot-bar copilot-bar-3 ${animationPhase >= 5 ? 'active' : ''}`}></span>
            </div>
            {message && (
                <div className="copilot-loader-message">{message}</div>
            )}
            {stage && (
                <div className="copilot-loader-stage">{stage}</div>
            )}
        </div>
    );
};

export default CopilotLoader;
