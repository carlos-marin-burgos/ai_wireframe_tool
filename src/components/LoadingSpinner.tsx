import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    color?: 'white' | 'blue' | 'gray';
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    color = 'white',
    className = ''
}) => {
    return (
        <div
            className={`loading-spinner loading-spinner--${size} loading-spinner--${color} ${className}`}
            role="status"
            aria-label="Loading"
        >
            <div className="loading-spinner__inner"></div>
        </div>
    );
};

export default LoadingSpinner;
