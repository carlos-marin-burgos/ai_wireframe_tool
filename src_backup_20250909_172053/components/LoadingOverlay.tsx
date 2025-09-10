import React from 'react';

interface LoadingOverlayProps {
    isVisible: boolean;
    message?: string;
    progress?: number; // 0-100 for progress bar
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isVisible,
    message = 'Loading...',
    progress
}) => {
    if (!isVisible) return null;

    return (
        <div className={`loading-overlay ${isVisible ? 'visible' : ''}`}>
            <div className="loading-spinner">
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
            </div>
            <div className="loading-message">{message}</div>
            {progress !== undefined && (
                <div className="loading-progress-container">
                    <div className="loading-progress-bar">
                        <div
                            className="loading-progress-fill"
                            style={{ '--progress': `${Math.max(0, Math.min(100, progress))}%` } as React.CSSProperties}
                        />
                    </div>
                    <div className="loading-progress-text">
                        {Math.round(progress)}%
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoadingOverlay;
