import React, { useState, useEffect } from 'react';
import { subscribeToToasts } from '../utils/helpers';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export const Toaster = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToToasts(setToasts);
    return unsubscribe;
  }, []);

  const getToastStyles = (type) => {
    const baseStyles = 'fixed right-4 bottom-4 p-4 rounded-lg shadow-lg flex items-center gap-3 text-white max-w-sm toast-enter';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500`;
      case 'error':
        return `${baseStyles} bg-red-500`;
      case 'warning':
        return `${baseStyles} bg-yellow-500`;
      case 'info':
        return `${baseStyles} bg-blue-500`;
      default:
        return baseStyles;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2 pointer-events-none">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={getToastStyles(toast.type)}
          style={{ pointerEvents: 'auto', zIndex: 9999 + index }}
        >
          <span className="flex-shrink-0">{getIcon(toast.type)}</span>
          <p className="flex-grow text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => {
              // Toasts auto-remove, this is just for manual close
            }}
            className="flex-shrink-0 ml-2 focus:outline-none"
          >
            <X size={16} className="opacity-70 hover:opacity-100" />
          </button>
        </div>
      ))}
    </div>
  );
};
