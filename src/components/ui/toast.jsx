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
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col-reverse gap-3 max-w-md pointer-events-auto">
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

  // Define toast styles based on type with updated design
  const toastStyles = {
    info: 'bg-white border-[#2563eb]/20 text-[#262626]',
    success: 'bg-white border-[#16a34a]/20 text-[#262626]',
    warning: 'bg-white border-[#f97316]/20 text-[#262626]',
    error: 'bg-white border-[#ef4444]/20 text-[#262626]',
  };

  const iconStyles = {
    info: 'text-[#2563eb]',
    success: 'text-[#16a34a]',
    warning: 'text-[#f97316]',
    error: 'text-[#ef4444]',
  };

  return (
    <div
      className={`${toastStyles[type]} shadow-sm border rounded-xl px-5 py-4 flex items-start gap-4 animate-slide-up w-full pointer-events-auto`}
      role="alert"
    >
      {/* Toast Icon */}
      <div className={`flex-shrink-0 ${iconStyles[type]}`}>
        {type === 'success' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {type === 'error' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )}
        {type === 'warning' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )}
        {type === 'info' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>

      {/* Toast Message */}
      <div className="flex-grow text-sm">{message}</div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="text-[#8e8e8e] hover:text-[#262626] mt-0.5 flex items-center justify-center focus:outline-none p-1 rounded-full hover:bg-[#efefef] transition-colors"
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