import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import '../styles/globals.css';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={28} />;
      case 'error':
        return <AlertCircle size={28} />;
      case 'warning':
        return <AlertTriangle size={28} />;
      case 'info':
        return <Info size={28} />;
      default:
        return <Info size={28} />;
    }
  };

  const getToastClass = () => {
    return `toast toast-${type}`;
  };

  const getToastStyles = () => {
    const baseStyles: React.CSSProperties = {
      padding: '1.25rem 2rem',
      borderRadius: '1rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -6px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(16px)',
      border: '2px solid',
      minWidth: '400px',
      maxWidth: '600px',
      transform: 'translateX(0)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      fontSize: '16px',
      fontWeight: '500',
      position: 'relative',
      overflow: 'hidden'
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyles,
          background: 'var(--color-surface)',
          borderColor: 'var(--color-success)',
          color: 'var(--color-success)',
          boxShadow: '0 8px 25px -5px rgba(16, 185, 129, 0.15), 0 4px 6px -2px rgba(16, 185, 129, 0.05)'
        };
      case 'error':
        return {
          ...baseStyles,
          background: 'var(--color-surface)',
          borderColor: 'var(--color-danger)',
          color: 'var(--color-danger)',
          boxShadow: '0 8px 25px -5px rgba(239, 68, 68, 0.15), 0 4px 6px -2px rgba(239, 68, 68, 0.05)'
        };
      case 'warning':
        return {
          ...baseStyles,
          background: 'var(--color-surface)',
          borderColor: 'var(--color-warning)',
          color: 'var(--color-warning)',
          boxShadow: '0 8px 25px -5px rgba(245, 158, 11, 0.15), 0 4px 6px -2px rgba(245, 158, 11, 0.05)'
        };
      case 'info':
        return {
          ...baseStyles,
          background: 'var(--color-surface)',
          borderColor: 'var(--color-primary)',
          color: 'var(--color-primary)',
          boxShadow: '0 8px 25px -5px rgba(99, 102, 241, 0.15), 0 4px 6px -2px rgba(99, 102, 241, 0.05)'
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div 
      className={getToastClass()}
      style={getToastStyles()}
    >
      <div className="flex items-start gap-4">
        {/* Ícone */}
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-base leading-tight">{title}</div>
          {message && (
            <div className="text-sm mt-2 opacity-90 leading-relaxed">{message}</div>
          )}
        </div>

        {/* Botão fechar */}
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-200 hover:scale-105"
          aria-label="Fechar notificação"
          style={{ color: 'inherit' }}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
