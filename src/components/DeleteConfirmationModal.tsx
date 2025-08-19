import React, { useEffect } from 'react';
import { FiX, FiTrash, FiAlertTriangle } from 'react-icons/fi';
import './Modal.css'; // Use shared modal styles
import './DeleteConfirmationModal.css'; // Keep specific styles if needed

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    itemType: 'favorite' | 'recent';
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    itemType
}) => {
    // Handle ESC key to close modal
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="delete-modal-overlay" onClick={onClose}>
            <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="delete-modal-header">
                    <div className="delete-modal-icon">
                        <FiAlertTriangle size={24} />
                    </div>
                    <h2>Delete {itemType === 'favorite' ? 'Favorite' : 'Recent Project'}</h2>
                    <button
                        className="delete-modal-close"
                        onClick={onClose}
                        aria-label="Close dialog"
                        title="Close"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="delete-modal-body">
                    <p>
                        Are you sure you want to delete <strong>"{itemName}"</strong> from your {itemType === 'favorite' ? 'favorites' : 'recent projects'}?
                    </p>
                    <p className="delete-modal-warning">
                        This action cannot be undone.
                    </p>
                </div>

                <div className="delete-modal-footer">
                    <button
                        className="delete-modal-cancel"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="delete-modal-confirm"
                        onClick={handleConfirm}
                    >
                        <FiTrash size={16} />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
