import React from "react";
import { FiX } from "react-icons/fi";

interface SavedWireframe {
  id: string;
  name: string;
  description: string;
  html: string;
  createdAt: string;
}

interface LoadDialogProps {
  savedWireframes: SavedWireframe[];
  onLoad: (wireframe: SavedWireframe) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const LoadDialog: React.FC<LoadDialogProps> = ({
  savedWireframes,
  onLoad,
  onDelete,
  onClose,
}) => (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Load Wireframe</h3>
      {savedWireframes.length === 0 ? (
        <p>No saved wireframes found.</p>
      ) : (
        <div className="saved-list">
          {savedWireframes.map((wireframe) => (
            <div key={wireframe.id} className="saved-item">
              <div className="saved-info">
                <strong>{wireframe.name}</strong>
                <small>
                  {new Date(wireframe.createdAt).toLocaleDateString()}
                </small>
                <div className="saved-description">{wireframe.description}</div>
              </div>
              <div className="saved-actions">
                <button onClick={() => onLoad(wireframe)}>Load</button>
                <button
                  onClick={() => onDelete(wireframe.id)}
                  className="delete-btn"
                  title="Delete wireframe"
                  aria-label="Delete wireframe"
                >
                  <FiX />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="modal-buttons">
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

export default LoadDialog;
