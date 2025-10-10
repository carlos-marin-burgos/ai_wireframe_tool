import React, { useState } from 'react';
import { FiX, FiSend, FiStar } from 'react-icons/fi';
import './FeedbackModal.css';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type FeedbackType = 'bug' | 'feature' | 'general' | 'praise';

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const [feedbackType, setFeedbackType] = useState<FeedbackType>('general');
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) {
            alert('Please enter your feedback message');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            // Gather metadata
            const metadata = {
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: new Date().toISOString(),
                viewport: `${window.innerWidth}x${window.innerHeight}`
            };

            const feedbackData = {
                type: feedbackType,
                rating,
                message: message.trim(),
                email: email.trim() || null,
                metadata
            };

            // Get API URL - use relative path in production for Static Web App proxy
            const apiUrl = import.meta.env.VITE_API_URL ||
                (window.location.hostname === 'localhost' ? 'http://localhost:7071' : '');

            // Authentication is handled by Azure Static Web Apps proxy
            const apiEndpoint = `${apiUrl}/api/submit-feedback`;

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            setSubmitStatus('success');

            // Reset form after success
            setTimeout(() => {
                setMessage('');
                setEmail('');
                setRating(0);
                setFeedbackType('general');
                setSubmitStatus('idle');
                onClose();
            }, 2000);

        } catch (error) {
            console.error('Error submitting feedback:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setSubmitStatus('idle');
            onClose();
        }
    };

    return (
        <div className="feedback-modal-overlay" onClick={handleClose}>
            <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
                <div className="feedback-modal-header">
                    <h2>💬 Send Feedback</h2>
                    <button
                        className="close-button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        aria-label="Close feedback modal"
                    >
                        <FiX />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="feedback-form">
                    {/* Feedback Type */}
                    <div className="form-group">
                        <label>What kind of feedback do you have?</label>
                        <div className="feedback-type-buttons">
                            <button
                                type="button"
                                className={`type-button ${feedbackType === 'bug' ? 'active' : ''}`}
                                onClick={() => setFeedbackType('bug')}
                            >
                                🐛 Bug Report
                            </button>
                            <button
                                type="button"
                                className={`type-button ${feedbackType === 'feature' ? 'active' : ''}`}
                                onClick={() => setFeedbackType('feature')}
                            >
                                💡 Feature Request
                            </button>
                            <button
                                type="button"
                                className={`type-button ${feedbackType === 'general' ? 'active' : ''}`}
                                onClick={() => setFeedbackType('general')}
                            >
                                💬 General Feedback
                            </button>
                            <button
                                type="button"
                                className={`type-button ${feedbackType === 'praise' ? 'active' : ''}`}
                                onClick={() => setFeedbackType('praise')}
                            >
                                ⭐ Praise
                            </button>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="form-group">
                        <label>How would you rate your experience?</label>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`star-button ${star <= (hoveredRating || rating) ? 'active' : ''}`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    aria-label={`Rate ${star} stars`}
                                >
                                    <FiStar />
                                </button>
                            ))}
                            {rating > 0 && (
                                <span className="rating-text">({rating}/5)</span>
                            )}
                        </div>
                    </div>

                    {/* Message */}
                    <div className="form-group">
                        <label htmlFor="feedback-message">
                            Your feedback <span className="required">*</span>
                        </label>
                        <textarea
                            id="feedback-message"
                            className="feedback-textarea"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell us what you think... Be as detailed as possible!"
                            rows={6}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Optional Email */}
                    <div className="form-group">
                        <label htmlFor="feedback-email">
                            Email (optional)
                        </label>
                        <input
                            id="feedback-email"
                            type="email"
                            className="feedback-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com (if you'd like a response)"
                            disabled={isSubmitting}
                        />
                        <small className="form-hint">
                            We'll only use this to follow up on your feedback
                        </small>
                    </div>

                    {/* Submit Status Messages */}
                    {submitStatus === 'success' && (
                        <div className="status-message success">
                            ✅ Thank you! Your feedback has been submitted successfully.
                        </div>
                    )}
                    {submitStatus === 'error' && (
                        <div className="status-message error">
                            ❌ Oops! Something went wrong. Please try again.
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting || !message.trim()}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span> Sending...
                                </>
                            ) : (
                                <>
                                    <FiSend /> Send Feedback
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackModal;
