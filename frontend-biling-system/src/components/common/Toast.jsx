import React, { useEffect } from "react";
import "../styles/Toast.css";

const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {type === "success" && <span className="toast-icon">✓</span>}
        {type === "error" && <span className="toast-icon">✕</span>}
        {type === "warning" && <span className="toast-icon">!</span>}
        {type === "info" && <span className="toast-icon">ℹ</span>}
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
