// src/components/FlashMessage.js
import React from "react";

function FlashMessage({ message, type = "info", onClose }) {
  if (!message) return null;

  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {message}
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={onClose}
      ></button>
    </div>
  );
}

export default FlashMessage;
