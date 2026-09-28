import React, { useEffect } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, MapPin, X, Search } from 'lucide-react';

function Toast({ toast, onClose, onAction }) {
  useEffect(() => {
    if (!toast) return;

    // Auto-dismiss after 6 seconds (or 8s for errors with interactive action)
    const duration = toast.actionLabel ? 8000 : 5000;
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const renderIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} className="toast-icon" />;
      case 'warning':
        return <AlertTriangle size={18} className="toast-icon" />;
      case 'info':
        return <MapPin size={18} className="toast-icon" />;
      case 'error':
      default:
        return <AlertCircle size={18} className="toast-icon" />;
    }
  };

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      <div className={`toast-item toast-${toast.type || 'error'}`} role="alert" aria-live="polite">
        <div className="toast-icon-wrapper">{renderIcon()}</div>
        <div className="toast-content">{toast.message}</div>
        {toast.actionLabel && (
          <button
            type="button"
            className="toast-action-btn"
            onClick={() => {
              if (onAction) onAction();
              if (toast.onAction) toast.onAction();
              onClose();
            }}
          >
            <Search size={13} />
            <span>{toast.actionLabel}</span>
          </button>
        )}
        <button
          type="button"
          className="toast-close-btn"
          onClick={onClose}
          aria-label="Dismiss notification"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}

export default Toast;
