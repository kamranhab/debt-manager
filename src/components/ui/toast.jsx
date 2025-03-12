import { createContext, useContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ToastContext = createContext(undefined);

/**
 * Toast provider component for managing notifications
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Remove toast after it expires
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prevToasts) => prevToasts.slice(1));
      }, toasts[0].duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [toasts]);

  // Add new toast to the queue
  const addToast = (toast) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      message: toast.message,
      type: toast.type || 'info',
      duration: toast.duration || 5000,
    };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    return id;
  };

  // Remove a specific toast by ID
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {createPortal(<ToastContainer toasts={toasts} removeToast={removeToast} />, document.body)}
    </ToastContext.Provider>
  );
}

/**
 * Container for rendering toasts
 */
function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col-reverse gap-4 max-w-md pointer-events-auto">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

/**
 * Individual toast notification
 */
function Toast({ toast, onClose }) {
  const { id, message, type } = toast;
  
  useEffect(() => {
    // Auto-close toast after duration
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 5000);
    
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  // Define toast styles based on type
  const toastStyles = {
    info: 'border-l-slate-400 bg-white',
    success: 'border-l-emerald-500 bg-white',
    warning: 'border-l-amber-500 bg-white',
    error: 'border-l-red-500 bg-white',
  };

  return (
    <div
      className={`${toastStyles[type]} shadow-sm border border-slate-100 border-l-2 px-5 py-4 flex items-start gap-4 animate-slide-up w-full pointer-events-auto`}
      role="alert"
    >
      <div className="flex-grow text-sm text-slate-700">{message}</div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 mt-0.5 flex items-center justify-center focus:outline-none"
        aria-label="Close"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}

/**
 * Hook for using toast notifications
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Helper functions for common toast types
export const toast = {
  info: (message, duration) => {
    const { addToast } = useToast();
    return addToast({ message, type: 'info', duration });
  },
  success: (message, duration) => {
    const { addToast } = useToast();
    return addToast({ message, type: 'success', duration });
  },
  warning: (message, duration) => {
    const { addToast } = useToast();
    return addToast({ message, type: 'warning', duration });
  },
  error: (message, duration) => {
    const { addToast } = useToast();
    return addToast({ message, type: 'error', duration });
  },
}; 