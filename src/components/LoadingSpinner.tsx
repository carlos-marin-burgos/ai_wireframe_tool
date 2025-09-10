import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    color?: 'white' | 'blue' | 'gray' | 'dark';
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    color = 'white',
    className = ''
}) => {
    const classes = [
        'loading-spinner',
        `loading-spinner--${size}`,
        `loading-spinner--${color}`,
        className
    ].filter(Boolean).join(' ');

    return <div className={classes} title="Loading..." />;
};

export default LoadingSpinner;
