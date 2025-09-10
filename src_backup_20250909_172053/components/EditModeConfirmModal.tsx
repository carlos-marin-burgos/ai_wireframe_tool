import React from 'react';
import { FiSave, FiX, FiAlertTriangle } from 'react-icons/fi';
import './EditModeConfirmModal.css';

interface EditModeConfirmModalProps {
    isOpen: boolean;
    onSave: () => void;
    onDiscard: () => void;
    onCancel: () => void;
}

const EditModeConfirmModal: React.FC<EditModeConfirmModalProps> = ({
    isOpen,
    onSave,
    onDiscard,
    onCancel
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="edit-confirm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">
                        <FiAlertTriangle className="warning-icon" />
                        Save Changes?
                    </div>
                    <button
                        className="modal-close-btn"
                        onClick={onCancel}
                        title="Cancel"
                        aria-label="Cancel"
                    >
                        <FiX />
                    </button>
                </div>

                <div className="modal-content">
                    <p>You have unsaved changes in edit mode. What would you like to do?</p>
                </div>

                <div className="modal-actions">
                    <button
                        className="modal-btn modal-btn-primary"
                        onClick={onSave}
                        title="Save changes and exit edit mode"
                    >
                        <FiSave />
                        Save Changes
                    </button>
                    <button
                        className="modal-btn modal-btn-secondary"
                        onClick={onDiscard}
                        title="Discard changes and exit edit mode"
                    >
                        Discard Changes
                    </button>
                    <button
                        className="modal-btn modal-btn-tertiary"
                        onClick={onCancel}
                        title="Continue editing"
                    >
                        Continue Editing
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModeConfirmModal;
