import React from 'react';

interface OfflineBannerProps {
    isVisible: boolean;
    onRetry?: () => void;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ isVisible, onRetry }) => {
    return (
        <div className={`offline-banner ${isVisible ? 'visible' : ''}`}>
            <div className="offline-banner-content">
                <span className="offline-icon">🔌</span>
                <span>You're currently offline. Some features may not work.</span>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="offline-retry-btn"
                        style={{
                            marginLeft: '1rem',
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                        }}
                    >
                        Retry
                    </button>
                )}
            </div>
        </div>
    );
};

export default OfflineBanner;
