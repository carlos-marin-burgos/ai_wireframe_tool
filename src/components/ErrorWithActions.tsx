import React from 'react';

interface ErrorWithActionsProps {
    title: string;
    message?: string;
    onRetry?: () => void;
    onDismiss?: () => void;
    retryLabel?: string;
    dismissLabel?: string;
    className?: string;
}

const ErrorWithActions: React.FC<ErrorWithActionsProps> = ({
    title,
    message,
    onRetry,
    onDismiss,
    retryLabel = 'Retry',
    dismissLabel = 'Dismiss',
    className = ''
}) => {
    return (
        <div className={`error error-with-actions error-margin ${className}`}>
            <div className="error-message">
                <span>{title}</span>
                {message && <p>{message}</p>}
            </div>
            <div className="error-actions">
                {onDismiss && (
                    <button
                        className="dismiss-btn"
                        onClick={onDismiss}
                        type="button"
                    >
                        {dismissLabel}
                    </button>
                )}
                {onRetry && (
                    <button
                        className="retry-btn"
                        onClick={onRetry}
                        type="button"
                    >
                        {retryLabel}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorWithActions;
