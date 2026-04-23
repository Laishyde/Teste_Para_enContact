// Initialize automatic translation system
import React from 'react';
import { autoTranslator } from './autoTranslate';

export const initializeAutoTranslate = () => {
  // Make autoTranslator available globally
  if (typeof window !== 'undefined') {
    window.autoTranslator = autoTranslator;
    
    // Apply current language if not Portuguese (simplified - no storage)
    setTimeout(() => {
      const currentLang = autoTranslator.getCurrentLanguage();
      if (currentLang !== 'pt') {
        autoTranslator.translatePage();
      }
    }, 100); // Small delay to ensure DOM is ready
  }
};

// Hook to initialize translation for React components
export const useAutoTranslateInit = () => {
  React.useEffect(() => {
    initializeAutoTranslate();
  }, []);
};
