import React from 'react';
import { useApp, useAppActions } from '../context/AppContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
  const { state } = useApp();
  const { removeToast } = useAppActions();

  if (!state.toasts || state.toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-24 right-8 z-50 space-y-3 max-w-lg">
      {state.toasts.map((toast) => (
        <Toast 
          key={toast.id} 
          {...toast} 
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
