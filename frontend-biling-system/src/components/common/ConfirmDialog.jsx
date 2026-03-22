import React from "react";
import "../styles/ConfirmDialog.css";

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog-box">
        <h2 className="confirm-dialog-title">{title}</h2>
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button
            className="confirm-btn-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`confirm-btn-confirm ${isDangerous ? "danger" : ""}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
