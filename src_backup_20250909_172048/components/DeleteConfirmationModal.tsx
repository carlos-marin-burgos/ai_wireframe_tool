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
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content modal-small">
                <div className="modal-header">
                    <h2>
                        <FiAlertTriangle size={20} className="warning-icon" />
                        Delete {itemType === 'favorite' ? 'Favorite' : 'Recent Project'}
                    </h2>
                    <button
                        className="close-button"
                        onClick={onClose}
                        aria-label="Close dialog"
                        title="Close"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <p>
                        Are you sure you want to delete <strong>"{itemName}"</strong> from your {itemType === 'favorite' ? 'favorites' : 'recent projects'}?
                    </p>
                    <p className="delete-warning">
                        This action cannot be undone.
                    </p>
                </div>

                <div className="modal-footer">
                    <button
                        className="modal-button modal-button-secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="modal-button modal-button-danger"
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
