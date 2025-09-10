import React from "react";

interface SaveDialogProps {
  saveTitle: string;
  setSaveTitle: (title: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const SaveDialog: React.FC<SaveDialogProps> = ({
  saveTitle,
  setSaveTitle,
  onSave,
  onCancel,
}) => (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Save Wireframe</h3>
      <input
        type="text"
        value={saveTitle}
        onChange={(e) => setSaveTitle(e.target.value)}
        placeholder="Enter a name for this wireframe"
        autoFocus
      />
      <div className="modal-buttons">
        <button onClick={onSave} disabled={!saveTitle.trim()}>
          Save
        </button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  </div>
);

export default SaveDialog;
