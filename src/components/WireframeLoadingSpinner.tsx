import React from 'react';
import './WireframeLoadingSpinner.css';

interface WireframeLoadingSpinnerProps {
    isVisible: boolean;
    message?: string;
    size?: 'small' | 'medium' | 'large';
}

const WireframeLoadingSpinner: React.FC<WireframeLoadingSpinnerProps> = ({
    isVisible,
    message = 'Generating wireframe...',
    size = 'medium'
}) => {
    if (!isVisible) return null;

    return (
        <div className="wireframe-loading-overlay">
            <div className={`wireframe-spinner wireframe-spinner-${size}`}>
                <div className="spinner-circle"></div>
            </div>
            <div className="wireframe-loading-message">{message}</div>
        </div>
    );
};

export default WireframeLoadingSpinner;
