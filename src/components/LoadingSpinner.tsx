import React from 'react';
import '../styles/globals.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div 
      className={`animate-spin border-2 border-current border-t-transparent rounded-full ${sizeClasses[size]} ${className}`}
      style={{
        borderColor: 'var(--color-primary)',
        borderTopColor: 'transparent'
      }}
    />
  );
};

export default LoadingSpinner;
