import React from 'react';
import {
    FiUser,
    FiCpu,
    FiCheck,
    FiClock
} from 'react-icons/fi';
import './EnhancedMessage.css';

interface Message {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    status?: 'sending' | 'sent' | 'delivered' | 'read';
}

interface EnhancedMessageProps {
    message: Message;
    onReact?: (messageId: string, reaction: string) => void;
    reactions?: Array<{ emoji: string; count: number; userReacted: boolean }>;
}

const EnhancedMessage: React.FC<EnhancedMessageProps> = ({
    message,
    onReact,
    reactions = []
}) => {

    const getStatusIcon = () => {
        switch (message.status) {
            case 'sending':
                return <FiClock className="status-icon sending" />;
            case 'sent':
                return <FiCheck className="status-icon sent" />;
            case 'delivered':
                return <div className="status-icon delivered"><FiCheck /><FiCheck /></div>;
            case 'read':
                return <div className="status-icon read"><FiCheck /><FiCheck /></div>;
            default:
                return null;
        }
    };

    return (
        <div className={`enhanced-message ${message.type}-message`}>
            <div className="message-avatar">
                {message.type === 'user' ? (
                    <FiUser className="avatar-icon" />
                ) : (
                    <FiCpu className="avatar-icon ai-avatar" />
                )}
            </div>

            <div className="message-body">
                <div className="message-header">
                    <span className="message-sender">
                        {message.type === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                    <span className="message-time">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {getStatusIcon()}
                </div>

                <div className="message-content-wrapper">
                    <div className="message-content">
                        {message.content}
                    </div>
                </div>

                {/* Simple Reactions */}
                {reactions.length > 0 && (
                    <div className="message-reactions">
                        {reactions.map((reaction, index) => (
                            <button
                                key={index}
                                className={`reaction-btn ${reaction.userReacted ? 'user-reacted' : ''}`}
                                onClick={() => onReact?.(message.id, reaction.emoji)}
                            >
                                <span className="reaction-emoji">{reaction.emoji}</span>
                                <span className="reaction-count">{reaction.count}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnhancedMessage;
