import React, { useState, useCallback } from 'react';
import { FiStar, FiX, FiEdit3, FiFileText } from 'react-icons/fi';
import './AddToFavoritesModal.css';

interface AddToFavoritesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, description: string) => void;
    initialName?: string;
}

const AddToFavoritesModal: React.FC<AddToFavoritesModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialName = ''
}) => {
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState('');

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(name.trim(), description.trim());
            setName('');
            setDescription('');
        }
    }, [name, description, onSave]);

    const handleClose = useCallback(() => {
        setName('');
        setDescription('');
        onClose();
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
            <div className="favorites-modal">
                <div className="modal-header">
                    <h2>
                        <FiStar className="modal-icon" />
                        Add to Favorites
                    </h2>
                    <button
                        className="close-btn"
                        onClick={handleClose}
                        aria-label="Close modal"
                    >
                        <FiX />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-field">
                            <label htmlFor="favorite-name" className="form-label">
                                <FiEdit3 className="label-icon" />
                                Wireframe Name
                            </label>
                            <input
                                id="favorite-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter a name for your wireframe"
                                className="form-input"
                                autoFocus
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="favorite-description" className="form-label">
                                <FiFileText className="label-icon" />
                                Description (Optional)
                            </label>
                            <textarea
                                id="favorite-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your wireframe design and purpose"
                                className="form-textarea"
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!name.trim()}
                        >
                            <FiStar />
                            Add to Favorites
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddToFavoritesModal;
