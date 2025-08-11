import React from 'react';
import {
    FiUser,
    FiCpu,
    FiCheck,
    FiClock,
    FiCopy,
    FiThumbsUp,
    FiThumbsDown,
    FiMoreHorizontal
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
    onCopy?: (content: string) => void;
    onEdit?: (messageId: string) => void;
}

const EnhancedMessage: React.FC<EnhancedMessageProps> = ({
    message,
    onReact,
    reactions = [],
    onCopy,
    onEdit
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

    const handleCopy = () => {
        if (onCopy) {
            onCopy(message.content);
        } else {
            navigator.clipboard.writeText(message.content);
        }
    };

    return (
        <div className={`enhanced-message ${message.type}-message microsoft-chat-style`}>
            {/* Message container with Microsoft styling */}
            <div className="message-container">
                {/* Header with avatar and name */}
                <div className="message-header">
                    <div className="message-persona">
                        <div className="message-avatar">
                            {message.type === 'user' ? (
                                <FiUser className="avatar-icon user-avatar-icon" />
                            ) : (
                                <div className="ai-avatar-container">
                                    <div className="ai-gradient-bg"></div>
                                    <div className="ai-icon-shape"></div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="message-meta">
                        <span className="message-time">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {getStatusIcon()}
                    </div>
                </div>

                {/* Message content */}
                <div className="message-response">
                    <div className="message-body">
                        {message.content}
                    </div>
                </div>

                {/* Actions and reactions */}
                <div className="message-actions">
                    <button className="action-btn copy-btn" onClick={handleCopy} title="Copy message">
                        <FiCopy />
                    </button>
                    {message.type === 'ai' && (
                        <>
                            <button className="action-btn thumbs-up-btn" onClick={() => onReact?.(message.id, '👍')} title="Good response">
                                <FiThumbsUp />
                            </button>
                            <button className="action-btn thumbs-down-btn" onClick={() => onReact?.(message.id, '👎')} title="Poor response">
                                <FiThumbsDown />
                            </button>
                        </>
                    )}
                    <button className="action-btn more-btn" title="More options">
                        <FiMoreHorizontal />
                    </button>
                </div>

                {/* Reactions */}
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
