import React, { useEffect, useState } from 'react';
import './Toast.css';

interface ToastProps {
    message: string;
    type?: 'success' | 'info' | 'warning' | 'error';
    duration?: number;
    onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({
    message,
    type = 'success',
    duration = 3000,
    onClose
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                onClose?.();
            }, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    return (
        <div className={`toast toast-${type} ${isVisible ? 'toast-visible' : 'toast-hidden'}`}>
            <div className="toast-content">
                <span className="toast-icon">
                    {type === 'success' && '✅'}
                    {type === 'info' && 'ℹ️'}
                    {type === 'warning' && '⚠️'}
                    {type === 'error' && '❌'}
                </span>
                <span className="toast-message">{message}</span>
            </div>
            <button
                className="toast-close"
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => onClose?.(), 300);
                }}
            >
                ×
            </button>
        </div>
    );
};

export default Toast;
